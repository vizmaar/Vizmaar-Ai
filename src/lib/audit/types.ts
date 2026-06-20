export type AuditStrategy = "mobile" | "desktop";
export type AuditPriority = "critical" | "high" | "medium" | "low";
export type AuditCategory =
  | "performance"
  | "seo"
  | "accessibility"
  | "best-practices"
  | "security";

export interface CoreWebVitals {
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  fcp: number | null;
  ttfb: number | null;
  inp: number | null;
}

export interface LighthouseScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface AuditCheck {
  id: string;
  name: string;
  category: AuditCategory;
  status: "pass" | "warn" | "fail";
  message: string;
  value?: string;
  recommendation?: string;
}

export interface AuditRecommendation {
  id: string;
  title: string;
  description: string;
  category: AuditCategory;
  priority: AuditPriority;
  impactPercent: number;
  fixInstructions: string;
}

export interface AuditReport {
  url: string;
  strategy: AuditStrategy;
  auditedAt: string;
  scores: LighthouseScores;
  coreWebVitals: CoreWebVitals;
  checks: AuditCheck[];
  recommendations: AuditRecommendation[];
  overallScore: number;
  source: "pagespeed" | "hybrid" | "html-only";
}
