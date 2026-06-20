import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getToolBySlug, TOOLS } from "@/lib/tools-data";
import { getToolComponent } from "@/components/tools/ToolRegistry";
import { JsonLd } from "@/components/seo/JsonLd";
<<<<<<< HEAD
import { generateSEO, generateToolSchema } from "@/lib/seo";
=======
import { generateSEO, generateToolSchema, generateBreadcrumbSchema } from "@/lib/seo";
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return generateSEO({
    title: tool.name,
    description: tool.longDescription,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
  });
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  const ToolComponent = getToolComponent(slug);
  if (!ToolComponent) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
<<<<<<< HEAD
      <JsonLd data={generateToolSchema({ name: tool.name, description: tool.description, slug: tool.slug })} />
=======
      <JsonLd data={[
        generateToolSchema({ name: tool.name, description: tool.description, slug: tool.slug }),
        generateBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: tool.name, path: `/tools/${tool.slug}` },
        ]),
      ]} />
>>>>>>> e6edf48e174f6317dd3e103a17e95c97dfc2d309

      <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Tools
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light">
            <tool.icon className="h-6 w-6 text-brand" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{tool.name}</h1>
            <Badge>{tool.category}</Badge>
          </div>
        </div>
        <p className="text-muted max-w-2xl">{tool.longDescription}</p>
      </div>

      <ToolComponent />

      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-lg font-semibold text-foreground mb-4">Related Tools</h2>
        <div className="flex flex-wrap gap-2">
          {TOOLS.filter((t) => t.category === tool.category && t.slug !== tool.slug)
            .slice(0, 4)
            .map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="text-sm text-brand hover:underline">
                {t.name}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
