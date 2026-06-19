"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { ToolLayout, ToolResult } from "./ToolLayout";
import { downloadBlob } from "@/lib/utils";

export default function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setError("");
    }
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }
      const mergedBytes = await mergedPdf.save();
      downloadBlob(new Blob([mergedBytes.buffer as ArrayBuffer], { type: "application/pdf" }), "merged.pdf");
    } catch {
      setError("Failed to merge PDFs. Ensure all files are valid PDFs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout>
      <div>
        <Label htmlFor="pdf-merge">Select PDF Files (2 or more)</Label>
        <input id="pdf-merge" type="file" accept=".pdf" multiple onChange={handleFiles} className="mt-1 block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-hover cursor-pointer" />
      </div>
      {files.length > 0 && (
        <ToolResult label={`${files.length} file(s) selected`}>
          <ul className="text-sm text-muted space-y-1">
            {files.map((f, i) => (
              <li key={i}>{i + 1}. {f.name}</li>
            ))}
          </ul>
        </ToolResult>
      )}
      {error && <p className="text-sm text-error">{error}</p>}
      <Button onClick={mergePDFs} disabled={loading || files.length < 2}>
        {loading ? "Merging..." : "Merge & Download"}
      </Button>
    </ToolLayout>
  );
}
