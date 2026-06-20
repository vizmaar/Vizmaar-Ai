"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolGrid, StatBox } from "./ToolLayout";

export default function WordCounter() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { chars, charsNoSpaces, words, sentences, paragraphs, readingTime };
  }, [text]);

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="word-text">Enter or paste your text</Label>
        <Textarea id="word-text" value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Start typing or paste text here..." />
      </div>
      <ToolGrid>
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Characters" value={stats.chars} />
        <StatBox label="No Spaces" value={stats.charsNoSpaces} />
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
        <StatBox label="Reading Time (min)" value={stats.readingTime} />
      </ToolGrid>
    </ToolLayout>
  );
}
