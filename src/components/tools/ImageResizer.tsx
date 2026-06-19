"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";
import { downloadDataUrl } from "@/lib/utils";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalSize, setOriginalSize] = useState({ w: 0, h: 0 });
  const [resized, setResized] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => {
      setOriginalSize({ w: img.width, h: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (maintainAspect && originalSize.w) {
      setHeight(Math.round(w * (originalSize.h / originalSize.w)));
    }
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (maintainAspect && originalSize.h) {
      setWidth(Math.round(h * (originalSize.w / originalSize.h)));
    }
  };

  const resize = () => {
    if (!preview) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, width, height);
      setResized(canvas.toDataURL("image/png"));
    };
    img.src = preview;
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="img-resize">Select Image</Label>
        <input id="img-resize" type="file" accept="image/*" onChange={handleFile} className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer" />
      </div>
      {originalSize.w > 0 && (
        <p className="text-sm text-muted">Original: {originalSize.w} × {originalSize.h}px</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width (px)</Label>
          <Input id="width" type="number" min="1" value={width} onChange={(e) => handleWidthChange(Number(e.target.value))} />
        </div>
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input id="height" type="number" min="1" value={height} onChange={(e) => handleHeightChange(Number(e.target.value))} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted cursor-pointer">
        <input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="accent-brand" />
        Maintain aspect ratio
      </label>
      <Button onClick={resize} disabled={!preview}>Resize Image</Button>
      {resized && (
        <ToolResult label={`Resized: ${width} × ${height}px`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resized} alt="Resized" className="max-w-full h-auto rounded-lg border border-border mx-auto" />
          <div className="mt-4 text-center">
            <Button onClick={() => downloadDataUrl(resized, `resized-${file?.name || "image.png"}`)}>Download</Button>
          </div>
        </ToolResult>
      )}
    </ToolLayout>
  );
}
