import {
  FileText,
  QrCode,
  Merge,
  Split,
  ImageDown,
  ImageIcon,
  Type,
  KeyRound,
  CaseSensitive,
  Braces,
  Link2,
  Palette,
  AlignLeft,
  Calendar,
  Ruler,
  Calculator,
  Percent,
  Tag,
  Activity,
  DollarSign,
  LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "PDF"
  | "Image"
  | "Text"
  | "Calculator"
  | "Developer"
  | "Business";

export interface Tool {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  category: ToolCategory;
  icon: LucideIcon;
  keywords: string[];
  featured?: boolean;
}

export const TOOLS: Tool[] = [
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Create professional invoices and export to PDF instantly.",
    longDescription:
      "Generate polished, client-ready invoices with line items, tax calculations, and your branding. Export as PDF — no account required, all processing happens in your browser.",
    category: "Business",
    icon: FileText,
    keywords: ["invoice", "PDF", "billing", "freelance"],
    featured: true,
  },
  {
    slug: "qr-code-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for URLs, text, WiFi, and more.",
    longDescription:
      "Create high-quality QR codes for websites, contact info, WiFi credentials, and plain text. Download as PNG instantly with customizable size.",
    category: "Business",
    icon: QrCode,
    keywords: ["QR code", "barcode", "scan"],
    featured: true,
  },
  {
    slug: "pdf-merger",
    name: "PDF Merger",
    description: "Combine multiple PDF files into one document.",
    longDescription:
      "Merge any number of PDF files into a single document. Drag to reorder pages, then download — fully client-side with zero uploads to servers.",
    category: "PDF",
    icon: Merge,
    keywords: ["PDF merge", "combine PDF"],
    featured: true,
  },
  {
    slug: "pdf-splitter",
    name: "PDF Splitter",
    description: "Split PDF files into separate pages or ranges.",
    longDescription:
      "Extract individual pages or page ranges from any PDF. Split large documents into manageable files without leaving your browser.",
    category: "PDF",
    icon: Split,
    keywords: ["PDF split", "extract pages"],
    featured: true,
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Reduce image file size without visible quality loss.",
    longDescription:
      "Compress JPG, PNG, and WebP images to reduce file size for web, email, or storage. Adjust quality slider for the perfect balance.",
    category: "Image",
    icon: ImageDown,
    keywords: ["compress image", "optimize", "reduce size"],
    featured: true,
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize images to exact dimensions or percentages.",
    longDescription:
      "Resize photos to specific pixel dimensions or scale by percentage. Maintain aspect ratio or set custom width and height.",
    category: "Image",
    icon: ImageIcon,
    keywords: ["resize image", "scale", "dimensions"],
  },
  {
    slug: "word-counter",
    name: "Word Counter",
    description: "Count words, characters, sentences, and reading time.",
    longDescription:
      "Analyze any text for word count, character count (with and without spaces), sentences, paragraphs, and estimated reading time.",
    category: "Text",
    icon: Type,
    keywords: ["word count", "character count", "reading time"],
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate strong, secure random passwords.",
    longDescription:
      "Create cryptographically secure passwords with customizable length and character sets. Copy with one click — never stored anywhere.",
    category: "Developer",
    icon: KeyRound,
    keywords: ["password", "security", "random"],
    featured: true,
  },
  {
    slug: "text-case-converter",
    name: "Text Case Converter",
    description: "Convert text between uppercase, lowercase, title case, and more.",
    longDescription:
      "Transform text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case instantly.",
    category: "Text",
    icon: CaseSensitive,
    keywords: ["case converter", "uppercase", "lowercase"],
  },
  {
    slug: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON data.",
    longDescription:
      "Paste raw JSON to beautify, validate syntax, minify, or copy formatted output. Perfect for developers and API debugging.",
    category: "Developer",
    icon: Braces,
    keywords: ["JSON", "format", "validate", "prettify"],
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    description: "Encode and decode URLs and URI components.",
    longDescription:
      "Encode special characters for safe URL transmission or decode percent-encoded strings back to readable text.",
    category: "Developer",
    icon: Link2,
    keywords: ["URL encode", "URL decode", "percent encoding"],
  },
  {
    slug: "color-palette-generator",
    name: "Color Palette Generator",
    description: "Generate beautiful color palettes from a base color.",
    longDescription:
      "Pick a base color and generate complementary, analogous, triadic, and monochromatic palettes. Copy hex codes with one click.",
    category: "Developer",
    icon: Palette,
    keywords: ["color palette", "hex", "design"],
  },
  {
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text for designs and mockups.",
    longDescription:
      "Create lorem ipsum placeholder text by paragraphs, sentences, or words. Perfect for wireframes, mockups, and design previews.",
    category: "Text",
    icon: AlignLeft,
    keywords: ["lorem ipsum", "placeholder text", "dummy text"],
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Calculate exact age from birth date to today.",
    longDescription:
      "Enter your birth date to get your exact age in years, months, days, and total days lived. Includes next birthday countdown.",
    category: "Calculator",
    icon: Calendar,
    keywords: ["age calculator", "birth date", "how old"],
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature, and more.",
    longDescription:
      "Convert between metric and imperial units for length, weight, temperature, area, and volume with instant results.",
    category: "Calculator",
    icon: Ruler,
    keywords: ["unit converter", "metric", "imperial"],
  },
  {
    slug: "emi-calculator",
    name: "EMI Calculator",
    description: "Calculate monthly loan EMI with interest breakdown.",
    longDescription:
      "Compute Equated Monthly Installments for home, car, or personal loans. View total interest, payment schedule, and principal breakdown.",
    category: "Calculator",
    icon: Calculator,
    keywords: ["EMI", "loan calculator", "mortgage"],
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Calculate percentages, increases, and decreases.",
    longDescription:
      "Find what percent X is of Y, calculate percentage increase/decrease, and solve common percentage problems instantly.",
    category: "Calculator",
    icon: Percent,
    keywords: ["percentage", "percent calculator"],
  },
  {
    slug: "discount-calculator",
    name: "Discount Calculator",
    description: "Calculate sale prices after discounts.",
    longDescription:
      "Enter original price and discount percentage to get the final sale price and amount saved. Supports multiple discount tiers.",
    category: "Calculator",
    icon: Tag,
    keywords: ["discount", "sale price", "savings"],
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate Body Mass Index and health category.",
    longDescription:
      "Calculate your BMI using height and weight in metric or imperial units. View health category and ideal weight range.",
    category: "Calculator",
    icon: Activity,
    keywords: ["BMI", "body mass index", "health"],
  },
  {
    slug: "currency-converter",
    name: "Currency Converter",
    description: "Convert currencies using static reference rates.",
    longDescription:
      "Convert between 15+ world currencies using reference exchange rates. Fast, free, and works entirely offline in your browser.",
    category: "Calculator",
    icon: DollarSign,
    keywords: ["currency converter", "exchange rate", "forex"],
    featured: true,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return TOOLS.filter((t) => t.featured);
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "PDF",
  "Image",
  "Text",
  "Calculator",
  "Developer",
  "Business",
];
