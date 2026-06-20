"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const format = (indent: number) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="json-input">JSON Input</Label>
        <Textarea id="json-input" value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder='{"key": "value"}' className="font-mono text-xs" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => format(2)}>Format</Button>
        <Button variant="secondary" onClick={() => format(4)}>Format (4 spaces)</Button>
        <Button variant="secondary" onClick={minify}>Minify</Button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {output && (
        <ToolResult label="Output">
          <Textarea value={output} readOnly rows={8} className="font-mono text-xs" />
          <Button variant="secondary" size="sm" onClick={copy} className="mt-2">
            <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
          </Button>
        </ToolResult>
      )}
    </ToolLayout>
  );
}
