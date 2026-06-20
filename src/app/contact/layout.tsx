import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Contact Us",
  description: "Get in touch with the VIZMAAR team. Send us your questions, feedback, or partnership inquiries.",
  path: "/contact",
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
