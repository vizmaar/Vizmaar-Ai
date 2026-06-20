"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolGrid, StatBox } from "./ToolLayout";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const result = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    if (monthlyRate === 0) {
      const emi = principal / months;
      return { emi, totalPayment: principal, totalInterest: 0 };
    }
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;
    return { emi, totalPayment, totalInterest };
  }, [principal, rate, tenure]);

  return (
    <ToolLayout>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="principal">Loan Amount ($)</Label>
          <Input id="principal" type="number" min="0" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="rate">Interest Rate (% p.a.)</Label>
          <Input id="rate" type="number" min="0" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="tenure">Tenure (years)</Label>
          <Input id="tenure" type="number" min="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
        </div>
      </div>
      <ToolGrid>
        <StatBox label="Monthly EMI" value={`$${result.emi.toFixed(2)}`} />
        <StatBox label="Total Payment" value={`$${result.totalPayment.toFixed(0)}`} />
        <StatBox label="Total Interest" value={`$${result.totalInterest.toFixed(0)}`} />
      </ToolGrid>
    </ToolLayout>
  );
}
