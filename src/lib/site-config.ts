export const SITE_CONFIG = {
  name: "VIZMAAR",
  tagline: "Premium Free Online Tools for Everyone",
  description:
    "VIZMAAR offers 22+ free, privacy-first online tools — website audits, resume builder, PDF utilities, invoicing, calculators, and AI-powered productivity helpers.",
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
    { href: "/tools/website-audit", label: "Website Audit Tool" },
    { href: "/tools/resume-builder", label: "Resume Builder" },
    { href: "/tools/invoice-generator", label: "Invoice Generator" },
    { href: "/tools/pdf-merger", label: "PDF Merger" },
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
