"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, label, showValue = true, className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const color = percent >= 90 ? "bg-success" : percent >= 50 ? "bg-warning" : "bg-error";

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-xs">
          {label && <span className="text-muted">{label}</span>}
          {showValue && <span className="font-medium text-foreground">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percent}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
