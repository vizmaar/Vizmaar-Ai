"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { ToolLayout } from "./ToolLayout";

export default function URLEncoderDecoder() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const process = () => {
    try {
      if (mode === "encode") {
        setText(encodeURIComponent(text));
      } else {
        setText(decodeURIComponent(text));
      }
    } catch {
      setText("Error: Invalid encoded string");
    }
  };

  return (
    <ToolLayout>
      <div className="flex gap-2">
        <Button variant={mode === "encode" ? "primary" : "secondary"} size="sm" onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "primary" : "secondary"} size="sm" onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <div>
        <Label htmlFor="url-text">{mode === "encode" ? "Text to encode" : "URL to decode"}</Label>
        <Textarea id="url-text" value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder={mode === "encode" ? "Hello World!" : "Hello%20World%21"} />
      </div>
      <Button onClick={process}>{mode === "encode" ? "Encode" : "Decode"}</Button>
    </ToolLayout>
  );
}
