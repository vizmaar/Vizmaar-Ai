"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";

export default function BMICalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);

  const result = useMemo(() => {
    if (height <= 0 || weight <= 0) return null;
    let bmi: number;
    if (unit === "metric") {
      const hM = height / 100;
      bmi = weight / (hM * hM);
    } else {
      bmi = (703 * weight) / (height * height);
    }

    let category: string;
    let color: string;
    if (bmi < 18.5) { category = "Underweight"; color = "text-blue-500"; }
    else if (bmi < 25) { category = "Normal weight"; color = "text-success"; }
    else if (bmi < 30) { category = "Overweight"; color = "text-warning"; }
    else { category = "Obese"; color = "text-error"; }

    return { bmi: bmi.toFixed(1), category, color };
  }, [unit, weight, height]);

  return (
    <ToolLayout>
      <div className="flex gap-2">
        <button onClick={() => setUnit("metric")} className={`px-4 py-2 rounded-lg text-sm font-medium ${unit === "metric" ? "bg-brand text-white" : "bg-surface-hover text-muted"}`}>Metric (kg/cm)</button>
        <button onClick={() => setUnit("imperial")} className={`px-4 py-2 rounded-lg text-sm font-medium ${unit === "imperial" ? "bg-brand text-white" : "bg-surface-hover text-muted"}`}>Imperial (lb/in)</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight">Weight ({unit === "metric" ? "kg" : "lb"})</Label>
          <Input id="weight" type="number" min="1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="height">Height ({unit === "metric" ? "cm" : "in"})</Label>
          <Input id="height" type="number" min="1" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </div>
      </div>
      {result ? (
        <ToolResult label="Your BMI">
          <p className="text-4xl font-bold text-brand">{result.bmi}</p>
          <p className={`text-lg font-medium mt-2 ${result.color}`}>{result.category}</p>
          <p className="text-xs text-muted mt-3">BMI ranges: Underweight (&lt;18.5) | Normal (18.5-24.9) | Overweight (25-29.9) | Obese (≥30)</p>
        </ToolResult>
      ) : (
        <p className="text-sm text-error">Please enter valid height and weight values.</p>
      )}
    </ToolLayout>
  );
}
