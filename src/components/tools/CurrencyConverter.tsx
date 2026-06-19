"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";
import { CURRENCY_RATES, CURRENCY_CODES } from "@/lib/currency-rates";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const result = useMemo(() => {
    const fromRate = CURRENCY_RATES[from].rate;
    const toRate = CURRENCY_RATES[to].rate;
    const converted = (amount / fromRate) * toRate;
    return converted;
  }, [amount, from, to]);

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input id="amount" type="number" min="0" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="from-currency">From</Label>
          <select id="from-currency" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {CURRENCY_CODES.map((c) => (
              <option key={c} value={c}>{c} — {CURRENCY_RATES[c].name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="to-currency">To</Label>
          <select id="to-currency" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            {CURRENCY_CODES.map((c) => (
              <option key={c} value={c}>{c} — {CURRENCY_RATES[c].name}</option>
            ))}
          </select>
        </div>
      </div>
      <ToolResult label="Converted Amount">
        <p className="text-3xl font-bold text-brand">{result.toFixed(2)} {to}</p>
        <p className="text-sm text-muted mt-1">{amount} {from} = {result.toFixed(4)} {to}</p>
        <p className="text-xs text-muted-foreground mt-3">Rates are static reference values for planning purposes only.</p>
      </ToolResult>
    </ToolLayout>
  );
}
