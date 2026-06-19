import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { BLOG_POSTS, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { JsonLd } from "@/components/seo/JsonLd";
import { generateSEO, generateArticleSchema } from "@/lib/seo";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return generateSEO({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.modifiedDate,
    keywords: post.keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, post.category);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <JsonLd
        data={generateArticleSchema({
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          date: post.date,
          modifiedDate: post.modifiedDate,
          category: post.category,
        })}
      />

      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>

      <header className="mb-8">
        <Badge>{post.category}</Badge>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground leading-tight">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readTime} min read</span>
        </div>
      </header>

      <div className="prose-vizmaar">
        {post.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted">
          Explore our free tools:{" "}
          <Link href="/tools/invoice-generator" className="text-brand hover:underline">Invoice Generator</Link>
          {" · "}
          <Link href="/tools/pdf-merger" className="text-brand hover:underline">PDF Merger</Link>
          {" · "}
          <Link href="/tools" className="text-brand hover:underline">All Tools</Link>
        </p>
      </div>

      <RelatedArticles posts={related} />
    </article>
  );
}
