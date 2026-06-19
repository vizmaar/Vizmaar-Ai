"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { ToolLayout } from "./ToolLayout";

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export default function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [output, setOutput] = useState("");

  const generate = () => {
    const sentences = LOREM.split(". ").map((s) => s.trim()).filter(Boolean);
    const words = LOREM.split(/\s+/);

    if (type === "paragraphs") {
      const paragraphs = Array.from({ length: count }, () => LOREM);
      setOutput(paragraphs.join("\n\n"));
    } else if (type === "sentences") {
      const result = Array.from({ length: count }, (_, i) => sentences[i % sentences.length] + ".");
      setOutput(result.join(" "));
    } else {
      const result = Array.from({ length: count }, (_, i) => words[i % words.length]);
      setOutput(result.join(" "));
    }
  };

  return (
    <ToolLayout>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lorem-count">Count</Label>
          <Input id="lorem-count" type="number" min="1" max="50" value={count} onChange={(e) => setCount(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="lorem-type">Type</Label>
          <select id="lorem-type" value={type} onChange={(e) => setType(e.target.value as typeof type)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm">
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>
      </div>
      <Button onClick={generate}>Generate</Button>
      {output && (
        <Textarea value={output} readOnly rows={8} />
      )}
    </ToolLayout>
  );
}
