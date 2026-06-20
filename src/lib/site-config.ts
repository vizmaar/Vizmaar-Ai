export const SITE_CONFIG = {
  name: "VIZMAAR",
  tagline: "Premium Free Online Tools for Everyone",
  description:
<<<<<<< HEAD
    "VIZMAAR offers 20+ free, privacy-first online tools — PDF utilities, image editors, calculators, and productivity helpers. No signup, no API, 100% client-side.",
=======
    "VIZMAAR offers 22+ free, privacy-first online tools — website audits, resume builder, PDF utilities, invoicing, calculators, and AI-powered productivity helpers.",
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309
  url: "https://vizmaar.com",
  email: "hello@vizmaar.com",
  twitter: "@vizmaar",
  locale: "en_US",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
] as const;

export const FOOTER_LINKS = {
  tools: [
<<<<<<< HEAD
    { href: "/tools/invoice-generator", label: "Invoice Generator" },
    { href: "/tools/pdf-merger", label: "PDF Merger" },
    { href: "/tools/qr-code-generator", label: "QR Code Generator" },
    { href: "/tools/image-compressor", label: "Image Compressor" },
=======
    { href: "/tools/website-audit", label: "Website Audit Tool" },
    { href: "/tools/resume-builder", label: "Resume Builder" },
    { href: "/tools/invoice-generator", label: "Invoice Generator" },
    { href: "/tools/pdf-merger", label: "PDF Merger" },
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
} as const;
