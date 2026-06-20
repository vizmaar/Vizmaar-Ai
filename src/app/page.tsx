import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { ToolsGrid } from "@/components/home/ToolsGrid";
import { BlogPreview } from "@/components/home/BlogPreview";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ToolsGrid />
      <BlogPreview />
      <CTA />
    </>
  );
}
