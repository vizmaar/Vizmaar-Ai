"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";
import { downloadDataUrl } from "@/lib/utils";

export default function ImageCompressor() {
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);
  const [quality, setQuality] = useState(0.8);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal({ url, size: file.size, name: file.name });
    compressImage(url, quality, file.type);
  };

  const compressImage = (src: string, q: number, type: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const mime = type.includes("png") ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mime, q);
      const base64 = dataUrl.split(",")[1];
      const size = Math.round((base64.length * 3) / 4);
      setCompressed({ url: dataUrl, size });
    };
    img.src = src;
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (original) compressImage(original.url, q, "image/jpeg");
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="img-compress">Select Image</Label>
        <input id="img-compress" type="file" accept="image/*" onChange={handleFile} className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer" />
      </div>
      {original && (
        <div>
          <Label>Quality: {Math.round(quality * 100)}%</Label>
          <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => handleQualityChange(Number(e.target.value))} className="w-full accent-brand" />
        </div>
      )}
      {original && compressed && (
        <ToolResult label="Comparison">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted mb-2">Original ({formatSize(original.size)})</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={original.url} alt="Original" className="max-w-full h-auto rounded-lg border border-border mx-auto" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted mb-2">Compressed ({formatSize(compressed.size)}) — saved {Math.round((1 - compressed.size / original.size) * 100)}%</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={compressed.url} alt="Compressed" className="max-w-full h-auto rounded-lg border border-border mx-auto" />
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button onClick={() => downloadDataUrl(compressed.url, `compressed-${original.name}`)}>Download Compressed</Button>
          </div>
        </ToolResult>
      )}
    </ToolLayout>
  );
}
