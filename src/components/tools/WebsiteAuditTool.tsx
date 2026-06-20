"use client";

import { useState } from "react";
import {
  Search, Loader2, FileJson, FileSpreadsheet, FileText,
  Smartphone, Monitor, AlertTriangle, CheckCircle2, XCircle, ChevronDown,
} from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ToolLayout, StatBox } from "./ToolLayout";
import { downloadBlob } from "@/lib/utils";
import { saveToHistory } from "@/lib/storage";
import type { AuditReport, AuditStrategy, AuditCheck, AuditRecommendation } from "@/lib/audit/types";

function StatusIcon({ status }: { status: AuditCheck["status"] }) {
  if (status === "pass") return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
  if (status === "warn") return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
  return <XCircle className="h-4 w-4 text-error shrink-0" />;
}

function PriorityBadge({ priority }: { priority: AuditRecommendation["priority"] }) {
  const colors = {
    critical: "bg-error/10 text-error",
    high: "bg-warning/10 text-warning",
    medium: "bg-brand-light text-brand",
    low: "bg-surface-hover text-muted",
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[priority]}`}>{priority}</span>;
}

function formatMs(ms: number | null): string {
  if (ms === null) return "N/A";
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${Math.round(ms)}ms`;
}

export default function WebsiteAuditTool() {
  const [url, setUrl] = useState("");
  const [strategy, setStrategy] = useState<AuditStrategy>("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "checks" | "recommendations">("overview");

  const runAudit = async () => {
    if (!url.trim()) { setError("Please enter a URL"); return; }
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), strategy }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Audit failed"); return; }
      setReport(data as AuditReport);
      saveToHistory("website-audit", { url: data.url, score: data.overallScore, date: data.auditedAt });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportJSON = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    downloadBlob(blob, `audit-${new URL(report.url).hostname}.json`);
  };

  const exportCSV = () => {
    if (!report) return;
    const rows = [
      ["Check", "Category", "Status", "Message"],
      ...report.checks.map((c) => [c.name, c.category, c.status, c.message]),
      [],
      ["Recommendation", "Priority", "Impact %", "Instructions"],
      ...report.recommendations.map((r) => [r.title, r.priority, String(r.impactPercent), r.fixInstructions]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv" }), `audit-${new URL(report.url).hostname}.csv`);
  };

  const exportPDF = () => {
    if (!report) return;
    const doc = new jsPDF();
    const host = new URL(report.url).hostname;

    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 35, "F");
    doc.setTextColor(255);
    doc.setFontSize(22);
    doc.text("Website Audit Report", 20, 22);
    doc.setFontSize(10);
    doc.text(host, 20, 30);

    doc.setTextColor(0);
    doc.setFontSize(11);
    let y = 48;
    doc.text(`URL: ${report.url}`, 20, y); y += 7;
    doc.text(`Strategy: ${report.strategy} | Overall Score: ${report.overallScore}/100`, 20, y); y += 7;
    doc.text(`Audited: ${new Date(report.auditedAt).toLocaleString()}`, 20, y); y += 12;

    doc.setFontSize(13);
    doc.setTextColor(99, 102, 241);
    doc.text("Lighthouse Scores", 20, y); y += 8;
    doc.setFontSize(10);
    doc.setTextColor(0);
    const scores = [
      `Performance: ${report.scores.performance}`,
      `SEO: ${report.scores.seo}`,
      `Accessibility: ${report.scores.accessibility}`,
      `Best Practices: ${report.scores.bestPractices}`,
    ];
    scores.forEach((s) => { doc.text(s, 20, y); y += 6; });
    y += 6;

    doc.setFontSize(13);
    doc.setTextColor(99, 102, 241);
    doc.text("Top Recommendations", 20, y); y += 8;
    doc.setFontSize(9);
    doc.setTextColor(0);
    report.recommendations.slice(0, 8).forEach((r) => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "bold");
      doc.text(`[${r.priority.toUpperCase()}] ${r.title} (+${r.impactPercent}%)`, 20, y); y += 5;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(r.fixInstructions, 170);
      doc.text(lines, 20, y); y += lines.length * 4 + 4;
    });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Generated by VIZMAAR Website Audit Tool — vizmaar.com", 20, 285);
    doc.save(`audit-${host}.pdf`);
  };

  const passCount = report?.checks.filter((c) => c.status === "pass").length ?? 0;
  const warnCount = report?.checks.filter((c) => c.status === "warn").length ?? 0;
  const failCount = report?.checks.filter((c) => c.status === "fail").length ?? 0;

  return (
    <ToolLayout wide>
      <div className="space-y-4">
        <div>
          <Label htmlFor="audit-url">Website URL</Label>
          <div className="flex flex-col sm:flex-row gap-2 mt-1">
            <Input
              id="audit-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runAudit()}
              className="flex-1"
            />
            <Button onClick={runAudit} disabled={loading} className="shrink-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Analyzing..." : "Run Audit"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          {(["mobile", "desktop"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStrategy(s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                strategy === s ? "border-brand bg-brand-light text-brand" : "border-border text-muted hover:border-brand/50"
              }`}
            >
              {s === "mobile" ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-lg border border-border p-8 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand mx-auto" />
            <p className="text-sm text-muted">Running Lighthouse analysis & SEO checks...</p>
            <p className="text-xs text-muted-foreground">This may take 30-60 seconds</p>
          </div>
        )}
      </div>

      {report && (
        <div className="space-y-6 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{new URL(report.url).hostname}</h2>
              <p className="text-xs text-muted">{new Date(report.auditedAt).toLocaleString()} · {report.strategy}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={exportPDF}><FileText className="h-4 w-4" /> PDF</Button>
              <Button variant="outline" size="sm" onClick={exportCSV}><FileSpreadsheet className="h-4 w-4" /> CSV</Button>
              <Button variant="outline" size="sm" onClick={exportJSON}><FileJson className="h-4 w-4" /> JSON</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            <ScoreRing score={report.overallScore} label="Overall" size="lg" className="col-span-2 sm:col-span-1" />
            <ScoreRing score={report.scores.performance} label="Performance" />
            <ScoreRing score={report.scores.seo} label="SEO" />
            <ScoreRing score={report.scores.accessibility} label="Accessibility" />
            <ScoreRing score={report.scores.bestPractices} label="Best Practices" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatBox label="Passed" value={passCount} />
            <StatBox label="Warnings" value={warnCount} />
            <StatBox label="Failed" value={failCount} />
          </div>

          <div className="rounded-lg border border-border p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Core Web Vitals</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="text-center p-2 rounded-lg bg-surface-hover/50">
                <p className="text-lg font-bold text-foreground">{formatMs(report.coreWebVitals.lcp)}</p>
                <p className="text-xs text-muted">LCP</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-hover/50">
                <p className="text-lg font-bold text-foreground">{formatMs(report.coreWebVitals.fcp)}</p>
                <p className="text-xs text-muted">FCP</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-hover/50">
                <p className="text-lg font-bold text-foreground">{report.coreWebVitals.cls?.toFixed(3) ?? "N/A"}</p>
                <p className="text-xs text-muted">CLS</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-hover/50">
                <p className="text-lg font-bold text-foreground">{formatMs(report.coreWebVitals.ttfb)}</p>
                <p className="text-xs text-muted">TTFB</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-hover/50">
                <p className="text-lg font-bold text-foreground">{formatMs(report.coreWebVitals.inp)}</p>
                <p className="text-xs text-muted">INP</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-surface-hover/50">
                <p className="text-lg font-bold text-foreground">{formatMs(report.coreWebVitals.fid)}</p>
                <p className="text-xs text-muted">FID</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1 border-b border-border">
            {(["overview", "checks", "recommendations"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors capitalize ${
                  activeTab === tab ? "border-brand text-brand" : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {tab} {tab === "checks" ? `(${report.checks.length})` : tab === "recommendations" ? `(${report.recommendations.length})` : ""}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div className="space-y-4">
              <ProgressBar value={report.scores.performance} label="Performance" />
              <ProgressBar value={report.scores.seo} label="SEO" />
              <ProgressBar value={report.scores.accessibility} label="Accessibility" />
              <ProgressBar value={report.scores.bestPractices} label="Best Practices" />
            </div>
          )}

          {activeTab === "checks" && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {report.checks.map((check) => (
                <div key={check.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface-hover/30 transition-colors">
                  <StatusIcon status={check.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">{check.name}</span>
                      <Badge>{check.category}</Badge>
                    </div>
                    <p className="text-xs text-muted mt-0.5">{check.message}</p>
                    {check.recommendation && (
                      <p className="text-xs text-brand mt-1">{check.recommendation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-3">
              {report.recommendations.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">No recommendations — great job!</p>
              ) : (
                report.recommendations.map((rec) => (
                  <details key={rec.id} className="group rounded-lg border border-border overflow-hidden">
                    <summary className="flex items-center gap-3 p-4 cursor-pointer hover:bg-surface-hover/30 transition-colors list-none">
                      <ChevronDown className="h-4 w-4 text-muted group-open:rotate-180 transition-transform shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">{rec.title}</span>
                          <PriorityBadge priority={rec.priority} />
                          <span className="text-xs text-success font-medium">+{rec.impactPercent}% impact</span>
                        </div>
                        <p className="text-xs text-muted mt-0.5">{rec.description}</p>
                      </div>
                    </summary>
                    <div className="px-4 pb-4 pt-0 border-t border-border bg-surface-hover/20">
                      <p className="text-sm text-foreground mt-3"><strong>How to fix:</strong> {rec.fixInstructions}</p>
                    </div>
                  </details>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </ToolLayout>
  );
}
