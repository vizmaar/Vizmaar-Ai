"use client";

import { cn } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-error";
}

function getStrokeColor(score: number): string {
  if (score >= 90) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--error)";
}

const SIZES = { sm: 64, md: 96, lg: 128 };
const STROKES = { sm: 6, md: 8, lg: 10 };

export function ScoreRing({ score, label, size = "md", className }: ScoreRingProps) {
  const dim = SIZES[size];
  const stroke = STROKES[size];
  const radius = (dim - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(score)}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold", getScoreColor(score), size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-lg")}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted text-center">{label}</span>
    </div>
  );
}
