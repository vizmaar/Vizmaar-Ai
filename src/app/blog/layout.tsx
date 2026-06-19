import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Blog — Productivity & Tools Guides",
  description:
    "Read expert articles on productivity, PDF tools, business utilities, online tools, and digital workflows from the VIZMAAR team.",
  path: "/blog",
  keywords: ["productivity blog", "PDF guides", "business tools", "digital workflows"],
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
