"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";

const UNITS: Record<string, { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }> = {
  m: { name: "Meters", toBase: (v) => v, fromBase: (v) => v },
  km: { name: "Kilometers", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  cm: { name: "Centimeters", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
  mm: { name: "Millimeters", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  mi: { name: "Miles", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
  yd: { name: "Yards", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
  ft: { name: "Feet", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
  in: { name: "Inches", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  kg: { name: "Kilograms", toBase: (v) => v, fromBase: (v) => v },
  g: { name: "Grams", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
  lb: { name: "Pounds", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
  oz: { name: "Ounces", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
};

const CATEGORIES = {
  length: ["m", "km", "cm", "mm", "mi", "yd", "ft", "in"],
  weight: ["kg", "g", "lb", "oz"],
};

export default function UnitConverter() {
  const [category, setCategory] = useState<"length" | "weight">("length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState(1);

  const result = useMemo(() => {
    const base = UNITS[fromUnit].toBase(value);
    return UNITS[toUnit].fromBase(base);
  }, [fromUnit, toUnit, value]);

  const units = CATEGORIES[category];

  return (
    <ToolLayout>
      <div>
        <Label>Category</Label>
        <div className="flex gap-2">
          {(["length", "weight"] as const).map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); const catUnits = CATEGORIES[cat]; setFromUnit(catUnits[0]); setToUnit(catUnits[1] || catUnits[0]); }} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${category === cat ? "bg-brand text-white" : "bg-surface-hover text-muted"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="from-value">Value</Label>
          <Input id="from-value" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="from-unit">From</Label>
          <select id="from-unit" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {units.map((u) => <option key={u} value={u}>{UNITS[u].name}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="to-unit">To</Label>
          <select id="to-unit" value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {units.map((u) => <option key={u} value={u}>{UNITS[u].name}</option>)}
          </select>
        </div>
      </div>
      <ToolResult label="Result">
        <p className="text-2xl font-bold text-brand">{result.toFixed(6)} {UNITS[toUnit].name}</p>
        <p className="text-sm text-muted mt-1">{value} {UNITS[fromUnit].name} = {result.toFixed(4)} {UNITS[toUnit].name}</p>
      </ToolResult>
    </ToolLayout>
  );
}
