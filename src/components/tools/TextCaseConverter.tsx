"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ToolLayout } from "./ToolLayout";

const cases = {
  uppercase: (t: string) => t.toUpperCase(),
  lowercase: (t: string) => t.toLowerCase(),
  title: (t: string) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
  sentence: (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase(),
  camel: (t: string) => t.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => (i === 0 ? w.toLowerCase() : w.toUpperCase())).replace(/\s+/g, ""),
  snake: (t: string) => t.trim().toLowerCase().replace(/\s+/g, "_"),
  kebab: (t: string) => t.trim().toLowerCase().replace(/\s+/g, "-"),
};

export default function TextCaseConverter() {
  const [text, setText] = useState("");

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="case-text">Enter text</Label>
        <Textarea id="case-text" value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="Type or paste text..." />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(cases).map(([name, fn]) => (
          <Button key={name} variant="secondary" size="sm" onClick={() => setText(fn(text))} className="capitalize">
            {name} Case
          </Button>
        ))}
      </div>
    </ToolLayout>
  );
}
