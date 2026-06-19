"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";
import { downloadBlob } from "@/lib/utils";

export default function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [ranges, setRanges] = useState("1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setError("");
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch {
      setError("Invalid PDF file.");
      setPageCount(0);
    }
  };

  const parseRanges = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    input.split(",").forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.includes("-")) {
        const [start, end] = trimmed.split("-").map(Number);
        for (let i = start; i <= Math.min(end, max); i++) {
          if (i >= 1) pages.add(i - 1);
        }
      } else {
        const num = Number(trimmed);
        if (num >= 1 && num <= max) pages.add(num - 1);
      }
    });
    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const bytes = await file.arrayBuffer();
      const srcPdf = await PDFDocument.load(bytes);
      const indices = parseRanges(ranges, pageCount);
      if (indices.length === 0) {
        setError("Invalid page range.");
        setLoading(false);
        return;
      }
      const newPdf = await PDFDocument.create();
      const pages = await newPdf.copyPages(srcPdf, indices);
      pages.forEach((p) => newPdf.addPage(p));
      const newBytes = await newPdf.save();
      downloadBlob(new Blob([newBytes.buffer as ArrayBuffer], { type: "application/pdf" }), "split.pdf");
    } catch {
      setError("Failed to split PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="pdf-split">Select PDF File</Label>
        <input id="pdf-split" type="file" accept=".pdf" onChange={handleFile} className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer" />
      </div>
      {pageCount > 0 && (
        <ToolResult label="Document Info">
          <p className="text-sm text-muted">{file?.name} — {pageCount} pages</p>
        </ToolResult>
      )}
      <div>
        <Label htmlFor="ranges">Page Range (e.g., 1-3, 5, 7-10)</Label>
        <Input id="ranges" value={ranges} onChange={(e) => setRanges(e.target.value)} placeholder="1-3, 5, 7" />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      <Button onClick={splitPDF} disabled={loading || !file}>
        {loading ? "Splitting..." : "Split & Download"}
      </Button>
    </ToolLayout>
  );
}
