"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolGrid, StatBox } from "./ToolLayout";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    if (birth > today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, daysUntilBirthday };
  }, [birthDate]);

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="birth-date">Date of Birth</Label>
        <Input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} max={new Date().toISOString().split("T")[0]} />
      </div>
      {result && (
        <>
          <ToolGrid>
            <StatBox label="Years" value={result.years} />
            <StatBox label="Months" value={result.months} />
            <StatBox label="Days" value={result.days} />
            <StatBox label="Total Days" value={result.totalDays.toLocaleString()} />
            <StatBox label="Days Until Birthday" value={result.daysUntilBirthday} />
          </ToolGrid>
          <p className="text-sm text-muted text-center">
            You are <strong className="text-foreground">{result.years} years, {result.months} months, and {result.days} days</strong> old.
          </p>
        </>
      )}
    </ToolLayout>
  );
}
