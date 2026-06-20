"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";

type Mode = "percent-of" | "what-percent" | "change";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("percent-of");
  const [a, setA] = useState(25);
  const [b, setB] = useState(200);

  const result = useMemo(() => {
    switch (mode) {
      case "percent-of":
        return { label: "Result", value: `${((a / 100) * b).toFixed(2)}`, detail: `${a}% of ${b} = ${((a / 100) * b).toFixed(2)}` };
      case "what-percent":
        return { label: "Result", value: `${b !== 0 ? ((a / b) * 100).toFixed(2) : 0}%`, detail: `${a} is ${b !== 0 ? ((a / b) * 100).toFixed(2) : 0}% of ${b}` };
      case "change":
        return { label: "Change", value: `${b !== 0 ? (((a - b) / b) * 100).toFixed(2) : 0}%`, detail: `From ${b} to ${a} = ${b !== 0 ? (((a - b) / b) * 100).toFixed(2) : 0}% change` };
    }
  }, [mode, a, b]);

  const modes: { key: Mode; label: string; aLabel: string; bLabel: string }[] = [
    { key: "percent-of", label: "X% of Y", aLabel: "Percentage (%)", bLabel: "Number" },
    { key: "what-percent", label: "X is what % of Y", aLabel: "Number (X)", bLabel: "Number (Y)" },
    { key: "change", label: "% Change", aLabel: "New Value", bLabel: "Original Value" },
  ];

  const current = modes.find((m) => m.key === mode)!;

  return (
    <ToolLayout>
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <button key={m.key} onClick={() => setMode(m.key)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${mode === m.key ? "bg-brand text-white" : "bg-surface-hover text-muted"}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="val-a">{current.aLabel}</Label>
          <Input id="val-a" type="number" value={a} onChange={(e) => setA(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="val-b">{current.bLabel}</Label>
          <Input id="val-b" type="number" value={b} onChange={(e) => setB(Number(e.target.value))} />
        </div>
      </div>
      <ToolResult label={result.label}>
        <p className="text-3xl font-bold text-brand">{result.value}</p>
        <p className="text-sm text-muted mt-1">{result.detail}</p>
      </ToolResult>
    </ToolLayout>
  );
}
