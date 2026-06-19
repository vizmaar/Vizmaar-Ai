import Link from "next/link";
import { TOOLS, TOOL_CATEGORIES } from "@/lib/tools-data";
import { generateSEO } from "@/lib/seo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = generateSEO({
  title: "Free Online Tools",
  description:
    "Browse 20+ free online tools — PDF utilities, image editors, calculators, text tools, and more. All client-side, no signup required.",
  path: "/tools",
  keywords: ["online tools", "free utilities", "PDF tools", "calculators"],
});

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          All <span className="gradient-text">Tools</span>
        </h1>
        <p className="mt-4 text-muted max-w-2xl mx-auto text-lg">
          20 free, privacy-first tools that work entirely in your browser.
        </p>
      </div>

      {TOOL_CATEGORIES.map((category) => {
        const categoryTools = TOOLS.filter((t) => t.category === category);
        if (categoryTools.length === 0) return null;
        return (
          <section key={category} className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-4">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryTools.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                  <Card hover className="h-full group">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-light group-hover:bg-brand transition-colors">
                        <tool.icon className="h-5 w-5 text-brand group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{tool.name}</h3>
                        <Badge className="mt-1">{tool.category}</Badge>
                        <p className="mt-2 text-sm text-muted">{tool.description}</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
