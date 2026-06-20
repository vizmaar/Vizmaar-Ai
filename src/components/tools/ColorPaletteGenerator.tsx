"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout } from "./ToolLayout";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [copied, setCopied] = useState("");

  const palettes = useMemo(() => {
    const [h, s, l] = hexToHsl(baseColor);
    return {
      complementary: [baseColor, hslToHex((h + 180) % 360, s, l)],
      analogous: [hslToHex((h - 30 + 360) % 360, s, l), baseColor, hslToHex((h + 30) % 360, s, l)],
      triadic: [baseColor, hslToHex((h + 120) % 360, s, l), hslToHex((h + 240) % 360, s, l)],
      monochromatic: [hslToHex(h, s, Math.min(l + 20, 90)), baseColor, hslToHex(h, s, Math.max(l - 20, 10))],
    };
  }, [baseColor]);

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="base-color">Base Color</Label>
        <div className="flex items-center gap-3">
          <input id="base-color" type="color" value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="h-10 w-14 rounded-lg border border-border cursor-pointer" />
          <Input value={baseColor} onChange={(e) => setBaseColor(e.target.value)} className="font-mono w-32" />
        </div>
      </div>
      {Object.entries(palettes).map(([name, colors]) => (
        <div key={name}>
          <p className="text-sm font-medium text-foreground capitalize mb-2">{name}</p>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => copyColor(color)}
                className="group relative h-16 w-16 rounded-lg border border-border transition-transform hover:scale-105"
                style={{ backgroundColor: color }}
                title={`Copy ${color}`}
                aria-label={`Copy color ${color}`}
              >
                <span className="absolute inset-x-0 bottom-1 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 drop-shadow">
                  {copied === color ? "Copied!" : color}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </ToolLayout>
  );
}
