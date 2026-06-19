"use client";

import { useState, useCallback } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = "";
    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) return;
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const result = Array.from(array, (x) => chars[x % chars.length]).join("");
    setPassword(result);
    setCopied(false);
  }, [length, options]);

  const copy = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="pw-length">Length: {length}</Label>
        <input id="pw-length" type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-brand" />
      </div>
      <div className="flex flex-wrap gap-3">
        {(["uppercase", "lowercase", "numbers", "symbols"] as const).map((key) => (
          <label key={key} className="flex items-center gap-2 text-sm text-muted cursor-pointer">
            <input type="checkbox" checked={options[key]} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} className="accent-brand" />
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </label>
        ))}
      </div>
      <Button onClick={generate}><RefreshCw className="h-4 w-4" /> Generate Password</Button>
      {password && (
        <ToolResult label="Generated Password">
          <div className="flex items-center gap-2">
            <Input value={password} readOnly className="font-mono" />
            <Button variant="secondary" size="sm" onClick={copy}>
              <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </ToolResult>
      )}
    </ToolLayout>
  );
}
