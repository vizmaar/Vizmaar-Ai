import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { isValidUrl, normalizeUrl } from "@/lib/validation";
import {
  fetchPageSpeed,
  runHtmlAudit,
  generateRecommendations,
  computeOverallScore,
} from "@/lib/audit/engine";
import type { AuditReport, AuditStrategy } from "@/lib/audit/types";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const limit = rateLimit(`audit:${ip}`, 5, 60_000);

  if (!limit.success) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let body: { url?: string; strategy?: AuditStrategy };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url: rawUrl, strategy = "mobile" } = body;

  if (!rawUrl || typeof rawUrl !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  if (!isValidUrl(rawUrl)) {
    return NextResponse.json({ error: "Invalid or unsafe URL" }, { status: 400 });
  }

  const url = normalizeUrl(rawUrl);

  try {
    const [pageSpeed, pageResponse] = await Promise.all([
      fetchPageSpeed(url, strategy),
      fetch(url, {
        signal: AbortSignal.timeout(15_000),
        headers: { "User-Agent": "VIZMAAR-AuditBot/1.0 (+https://vizmaar.com)" },
        redirect: "follow",
      }).catch(() => null),
    ]);

    let htmlChecks: Awaited<ReturnType<typeof runHtmlAudit>> = [];
    if (pageResponse?.ok) {
      const html = await pageResponse.text();
      htmlChecks = await runHtmlAudit(url, html.slice(0, 500_000), pageResponse.headers);
    }

    const defaultScores = { performance: 0, seo: 0, accessibility: 0, bestPractices: 0 };
    const scores = pageSpeed?.scores ?? defaultScores;
    const allChecks = [...(pageSpeed?.checks ?? []), ...htmlChecks];

    const uniqueChecks = allChecks.filter(
      (check, index, self) => self.findIndex((c) => c.id === check.id) === index
    );

    const report: AuditReport = {
      url,
      strategy,
      auditedAt: new Date().toISOString(),
      scores,
      coreWebVitals: pageSpeed?.coreWebVitals ?? {
        lcp: null, fid: null, cls: null, fcp: null, ttfb: null, inp: null,
      },
      checks: uniqueChecks,
      recommendations: generateRecommendations(uniqueChecks, scores),
      overallScore: pageSpeed ? computeOverallScore(scores) : Math.round(
        uniqueChecks.filter((c) => c.status === "pass").length / Math.max(uniqueChecks.length, 1) * 100
      ),
      source: pageSpeed ? "hybrid" : "html-only",
    };

    if (!pageSpeed && uniqueChecks.length === 0) {
      return NextResponse.json(
        { error: "Unable to audit this URL. The site may be blocking automated requests." },
        { status: 422 }
      );
    }

    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Audit failed. Please try again." }, { status: 500 });
  }
}
