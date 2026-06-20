import dynamic from "next/dynamic";
import { ComponentType } from "react";

const toolComponents: Record<string, ComponentType> = {
<<<<<<< HEAD
=======
  "website-audit": dynamic(() => import("./WebsiteAuditTool")),
  "resume-builder": dynamic(() => import("./ResumeBuilder")),
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309
  "invoice-generator": dynamic(() => import("./InvoiceGenerator")),
  "qr-code-generator": dynamic(() => import("./QRCodeGenerator")),
  "pdf-merger": dynamic(() => import("./PDFMerger")),
  "pdf-splitter": dynamic(() => import("./PDFSplitter")),
  "image-compressor": dynamic(() => import("./ImageCompressor")),
  "image-resizer": dynamic(() => import("./ImageResizer")),
  "word-counter": dynamic(() => import("./WordCounter")),
  "password-generator": dynamic(() => import("./PasswordGenerator")),
  "text-case-converter": dynamic(() => import("./TextCaseConverter")),
  "json-formatter": dynamic(() => import("./JSONFormatter")),
  "url-encoder-decoder": dynamic(() => import("./URLEncoderDecoder")),
  "color-palette-generator": dynamic(() => import("./ColorPaletteGenerator")),
  "lorem-ipsum-generator": dynamic(() => import("./LoremIpsumGenerator")),
  "age-calculator": dynamic(() => import("./AgeCalculator")),
  "unit-converter": dynamic(() => import("./UnitConverter")),
  "emi-calculator": dynamic(() => import("./EMICalculator")),
  "percentage-calculator": dynamic(() => import("./PercentageCalculator")),
  "discount-calculator": dynamic(() => import("./DiscountCalculator")),
  "bmi-calculator": dynamic(() => import("./BMICalculator")),
  "currency-converter": dynamic(() => import("./CurrencyConverter")),
};

export function getToolComponent(slug: string): ComponentType | null {
  return toolComponents[slug] || null;
}

export { toolComponents };
