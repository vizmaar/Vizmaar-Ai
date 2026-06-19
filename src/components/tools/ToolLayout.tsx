"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface ToolLayoutProps {
  children: ReactNode;
  wide?: boolean;
}

export function ToolLayout({ children, wide = false }: ToolLayoutProps) {
  return (
    <Card className={wide ? "max-w-5xl mx-auto" : "max-w-3xl mx-auto"}>
      <div className="space-y-6">{children}</div>
    </Card>
  );
}

export function ToolResult({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-hover/50 p-4">
      {label && (
        <p className="text-xs font-medium text-muted uppercase tracking-wider mb-2">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

export function ToolGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{children}</div>
  );
}

export function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-brand-light/30 dark:bg-brand-light/10 p-3 text-center">
      <p className="text-2xl font-bold text-brand">{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
