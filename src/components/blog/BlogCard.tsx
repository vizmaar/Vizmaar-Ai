import Link from "next/link";
import { Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BlogPost } from "@/lib/blog-data";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card hover className="h-full group">
        <Badge>{post.category}</Badge>
        <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted line-clamp-3 leading-relaxed">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{formatDate(post.date)}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} min</span>
        </div>
      </Card>
    </Link>
  );
}
