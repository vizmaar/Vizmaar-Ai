import type {
  AuditCheck,
  AuditRecommendation,
  AuditStrategy,
  CoreWebVitals,
  LighthouseScores,
} from "./types";

function extractMeta(html: string, name: string, attr: "name" | "property" = "name"): string | null {
  const regex = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]+content=["']([^"']*)["']`, "i");
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, "i");
  return html.match(regex)?.[1] ?? html.match(alt)?.[1] ?? null;
}

function extractTitle(html: string): string | null {
  return html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
}

function extractCanonical(html: string): string | null {
  const match = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    ?? html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  return match?.[1] ?? null;
}

function extractHeadings(html: string): { h1: number; h2: number; h3: number; structure: string[] } {
  const headings: string[] = [];
  let h1 = 0, h2 = 0, h3 = 0;
  const regex = /<h([1-6])[^>]*>([^<]*)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    if (level === 1) h1++;
    if (level === 2) h2++;
    if (level === 3) h3++;
    headings.push(`H${level}: ${match[2].trim().slice(0, 80)}`);
  }
  return { h1, h2, h3, structure: headings.slice(0, 20) };
}

function extractImages(html: string): { total: number; withoutAlt: number; large: number } {
  const imgRegex = /<img[^>]*>/gi;
  let total = 0;
  let withoutAlt = 0;
  const matches = html.match(imgRegex) ?? [];
  for (const img of matches) {
    total++;
    if (!/alt=["'][^"']+["']/i.test(img)) withoutAlt++;
  }
  return { total, withoutAlt, large: 0 };
}

function extractLinks(html: string, baseUrl: string): { internal: number; external: number; broken: number } {
  const hrefRegex = /href=["']([^"'#][^"']*)["']/gi;
  let internal = 0;
  let external = 0;
  let match;
  const base = new URL(baseUrl);
  while ((match = hrefRegex.exec(html)) !== null) {
    try {
      const link = new URL(match[1], baseUrl);
      if (link.hostname === base.hostname) internal++;
      else external++;
    } catch {
      // skip invalid
    }
  }
  return { internal, external, broken: 0 };
}

function hasSchema(html: string): boolean {
  return /application\/ld\+json/i.test(html) || /itemtype=["']https?:\/\/schema\.org/i.test(html);
}

function checkRobotsTxt(baseUrl: string): Promise<boolean> {
  return fetch(new URL("/robots.txt", baseUrl).href, { signal: AbortSignal.timeout(5000) })
    .then((r) => r.ok)
    .catch(() => false);
}

function checkSitemap(baseUrl: string): Promise<boolean> {
  return fetch(new URL("/sitemap.xml", baseUrl).href, { signal: AbortSignal.timeout(5000) })
    .then((r) => r.ok)
    .catch(() => false);
}

function checkSecurityHeaders(headers: Headers): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const securityHeaders = [
    { name: "Content-Security-Policy", id: "csp" },
    { name: "Strict-Transport-Security", id: "hsts" },
    { name: "X-Frame-Options", id: "xfo" },
    { name: "X-Content-Type-Options", id: "xcto" },
  ];

  for (const h of securityHeaders) {
    const present = headers.has(h.name.toLowerCase());
    checks.push({
      id: `security-${h.id}`,
      name: h.name,
      category: "security",
      status: present ? "pass" : "warn",
      message: present ? `${h.name} header is set` : `${h.name} header is missing`,
      recommendation: present ? undefined : `Add ${h.name} header to improve security posture`,
    });
  }
  return checks;
}

export async function runHtmlAudit(url: string, html: string, responseHeaders: Headers): Promise<AuditCheck[]> {
  const checks: AuditCheck[] = [];
  const title = extractTitle(html);
  const description = extractMeta(html, "description");
  const ogTitle = extractMeta(html, "og:title", "property");
  const ogDescription = extractMeta(html, "og:description", "property");
  const ogImage = extractMeta(html, "og:image", "property");
  const twitterCard = extractMeta(html, "twitter:card");
  const canonical = extractCanonical(html);
  const headings = extractHeadings(html);
  const images = extractImages(html);
  const links = extractLinks(html, url);
  const schema = hasSchema(html);

  // Meta title
  checks.push({
    id: "meta-title",
    name: "Meta Title",
    category: "seo",
    status: !title ? "fail" : title.length < 30 || title.length > 60 ? "warn" : "pass",
    message: title ? `Title: "${title}" (${title.length} chars)` : "Missing page title",
    value: title ?? undefined,
    recommendation: !title ? "Add a descriptive <title> tag" : title.length > 60 ? "Shorten title to under 60 characters" : title.length < 30 ? "Expand title to 30-60 characters for better SEO" : undefined,
  });

  // Meta description
  checks.push({
    id: "meta-description",
    name: "Meta Description",
    category: "seo",
    status: !description ? "fail" : description.length < 120 || description.length > 160 ? "warn" : "pass",
    message: description ? `Description: ${description.length} characters` : "Missing meta description",
    value: description ?? undefined,
    recommendation: !description ? "Add <meta name=\"description\"> with 120-160 characters" : undefined,
  });

  // Heading structure
  checks.push({
    id: "heading-h1",
    name: "H1 Heading",
    category: "seo",
    status: headings.h1 === 0 ? "fail" : headings.h1 > 1 ? "warn" : "pass",
    message: headings.h1 === 0 ? "No H1 found" : headings.h1 > 1 ? `${headings.h1} H1 tags found (should be 1)` : "Single H1 found",
    recommendation: headings.h1 === 0 ? "Add exactly one H1 tag per page" : headings.h1 > 1 ? "Use only one H1 tag per page" : undefined,
  });

  checks.push({
    id: "heading-structure",
    name: "Heading Hierarchy",
    category: "seo",
    status: headings.h2 === 0 && headings.h3 > 0 ? "warn" : "pass",
    message: `H1: ${headings.h1}, H2: ${headings.h2}, H3: ${headings.h3}`,
  });

  // Canonical
  checks.push({
    id: "canonical",
    name: "Canonical URL",
    category: "seo",
    status: canonical ? "pass" : "warn",
    message: canonical ? `Canonical: ${canonical}` : "No canonical URL specified",
    value: canonical ?? undefined,
    recommendation: !canonical ? "Add <link rel=\"canonical\"> to prevent duplicate content issues" : undefined,
  });

  // Open Graph
  checks.push({
    id: "open-graph",
    name: "Open Graph Tags",
    category: "seo",
    status: ogTitle && ogDescription && ogImage ? "pass" : ogTitle || ogDescription ? "warn" : "fail",
    message: `OG: title=${!!ogTitle}, description=${!!ogDescription}, image=${!!ogImage}`,
    recommendation: !ogTitle ? "Add og:title, og:description, and og:image meta tags" : undefined,
  });

  // Twitter Cards
  checks.push({
    id: "twitter-cards",
    name: "Twitter Cards",
    category: "seo",
    status: twitterCard ? "pass" : "warn",
    message: twitterCard ? `Twitter card: ${twitterCard}` : "No Twitter Card meta tags",
    recommendation: !twitterCard ? "Add twitter:card meta tag for better social sharing" : undefined,
  });

  // Schema
  checks.push({
    id: "schema",
    name: "Structured Data",
    category: "seo",
    status: schema ? "pass" : "warn",
    message: schema ? "Schema.org markup detected" : "No structured data found",
    recommendation: !schema ? "Add JSON-LD structured data (Organization, WebSite, or relevant schema)" : undefined,
  });

  // Images
  checks.push({
    id: "image-alt",
    name: "Image Alt Text",
    category: "accessibility",
    status: images.withoutAlt === 0 ? "pass" : images.withoutAlt <= 2 ? "warn" : "fail",
    message: `${images.withoutAlt} of ${images.total} images missing alt text`,
    recommendation: images.withoutAlt > 0 ? "Add descriptive alt attributes to all images" : undefined,
  });

  // Internal linking
  checks.push({
    id: "internal-links",
    name: "Internal Linking",
    category: "seo",
    status: links.internal >= 3 ? "pass" : links.internal >= 1 ? "warn" : "fail",
    message: `${links.internal} internal, ${links.external} external links`,
    recommendation: links.internal < 3 ? "Add more internal links to improve site navigation and SEO" : undefined,
  });

  // Robots & Sitemap
  const [hasRobots, hasSitemap] = await Promise.all([checkRobotsTxt(url), checkSitemap(url)]);
  checks.push({
    id: "robots-txt",
    name: "Robots.txt",
    category: "seo",
    status: hasRobots ? "pass" : "warn",
    message: hasRobots ? "robots.txt found" : "robots.txt not found",
    recommendation: !hasRobots ? "Create a robots.txt file at your domain root" : undefined,
  });
  checks.push({
    id: "sitemap",
    name: "XML Sitemap",
    category: "seo",
    status: hasSitemap ? "pass" : "warn",
    message: hasSitemap ? "sitemap.xml found" : "sitemap.xml not found",
    recommendation: !hasSitemap ? "Create and submit an XML sitemap to search engines" : undefined,
  });

  checks.push(...checkSecurityHeaders(responseHeaders));
  return checks;
}

interface PageSpeedAuditRef {
  id: string;
  title: string;
  score: number | null;
  description: string;
}

function extractPageSpeedScores(data: Record<string, unknown>): LighthouseScores {
  const categories = (data.lighthouseResult as Record<string, unknown>)?.categories as Record<string, { score: number }> ?? {};
  return {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
  };
}

function extractCoreWebVitals(data: Record<string, unknown>): CoreWebVitals {
  const audits = (data.lighthouseResult as Record<string, unknown>)?.audits as Record<string, { numericValue?: number }> ?? {};
  return {
    lcp: audits["largest-contentful-paint"]?.numericValue ?? null,
    fid: audits["max-potential-fid"]?.numericValue ?? null,
    cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
    fcp: audits["first-contentful-paint"]?.numericValue ?? null,
    ttfb: audits["server-response-time"]?.numericValue ?? null,
    inp: audits["interaction-to-next-paint"]?.numericValue ?? null,
  };
}

function extractPageSpeedChecks(data: Record<string, unknown>): AuditCheck[] {
  const audits = (data.lighthouseResult as Record<string, unknown>)?.audits as Record<string, PageSpeedAuditRef> ?? {};
  const categoryMap: Record<string, AuditCheck["category"]> = {
    performance: "performance",
    accessibility: "accessibility",
    "best-practices": "best-practices",
    seo: "seo",
  };

  const checks: AuditCheck[] = [];
  for (const [id, audit] of Object.entries(audits)) {
    if (audit.score === null || audit.score === undefined) continue;
    if (audit.score >= 0.9) continue;

    let category: AuditCheck["category"] = "performance";
    for (const [key, cat] of Object.entries(categoryMap)) {
      if (id.includes(key) || audit.title.toLowerCase().includes(key)) {
        category = cat;
        break;
      }
    }

    checks.push({
      id: `lh-${id}`,
      name: audit.title,
      category,
      status: audit.score >= 0.5 ? "warn" : "fail",
      message: audit.description?.slice(0, 200) ?? audit.title,
      recommendation: audit.description,
    });
  }
  return checks.slice(0, 30);
}

export async function fetchPageSpeed(url: string, strategy: AuditStrategy): Promise<{
  scores: LighthouseScores;
  coreWebVitals: CoreWebVitals;
  checks: AuditCheck[];
} | null> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({
    url,
    strategy,
    category: "performance,accessibility,best-practices,seo",
  });
  if (apiKey) params.set("key", apiKey);

  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`,
      { signal: AbortSignal.timeout(60_000) }
    );
    if (!res.ok) return null;
    const data = await res.json() as Record<string, unknown>;
    return {
      scores: extractPageSpeedScores(data),
      coreWebVitals: extractCoreWebVitals(data),
      checks: extractPageSpeedChecks(data),
    };
  } catch {
    return null;
  }
}

export function generateRecommendations(checks: AuditCheck[], scores: LighthouseScores): AuditRecommendation[] {
  const recs: AuditRecommendation[] = [];
  let id = 0;

  const addRec = (
    title: string,
    description: string,
    category: AuditRecommendation["category"],
    priority: AuditRecommendation["priority"],
    impactPercent: number,
    fixInstructions: string
  ) => {
    recs.push({ id: `rec-${++id}`, title, description, category, priority, impactPercent, fixInstructions });
  };

  if (scores.performance < 90) {
    addRec(
      "Improve Page Performance",
      `Performance score is ${scores.performance}/100. Target 95+ for optimal user experience.`,
      "performance",
      scores.performance < 50 ? "critical" : "high",
      Math.min(25, 100 - scores.performance),
      "Enable compression, optimize images (WebP/AVIF), defer non-critical JS, use a CDN, and implement lazy loading."
    );
  }

  if (scores.seo < 90) {
    addRec(
      "Boost SEO Score",
      `SEO score is ${scores.seo}/100. Fix meta tags, headings, and structured data.`,
      "seo",
      "high",
      Math.min(20, 100 - scores.seo),
      "Ensure unique titles/descriptions, single H1, canonical URLs, sitemap, and Schema.org markup."
    );
  }

  if (scores.accessibility < 90) {
    addRec(
      "Enhance Accessibility",
      `Accessibility score is ${scores.accessibility}/100.`,
      "accessibility",
      "high",
      Math.min(15, 100 - scores.accessibility),
      "Add alt text to images, ensure color contrast ratios ≥ 4.5:1, use semantic HTML, and add ARIA labels."
    );
  }

  for (const check of checks.filter((c) => c.status === "fail")) {
    if (check.recommendation) {
      addRec(
        `Fix: ${check.name}`,
        check.message,
        check.category,
        check.category === "security" ? "critical" : "medium",
        check.category === "seo" ? 8 : 5,
        check.recommendation
      );
    }
  }

  return recs.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority] || b.impactPercent - a.impactPercent;
  }).slice(0, 15);
}

export function computeOverallScore(scores: LighthouseScores): number {
  return Math.round(
    scores.performance * 0.3 +
    scores.seo * 0.3 +
    scores.accessibility * 0.2 +
    scores.bestPractices * 0.2
  );
}
