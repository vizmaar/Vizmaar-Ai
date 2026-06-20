import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BlogPost } from "@/lib/blog-data";

export function RelatedArticles({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card hover className="h-full group">
              <Badge>{post.category}</Badge>
              <h3 className="mt-2 font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
