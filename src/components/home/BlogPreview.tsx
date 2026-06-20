"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedPosts } from "@/lib/blog-data";
import { formatDate } from "@/lib/utils";

export function BlogPreview() {
  const posts = getFeaturedPosts().slice(0, 3);

  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">From the Blog</h2>
            <p className="mt-2 text-muted">Tips, guides, and insights for productivity.</p>
          </div>
          <Link href="/blog" className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover transition-colors">
            View all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card hover className="h-full group">
                  <Badge>{post.category}</Badge>
                  <h3 className="mt-3 text-lg font-semibold text-foreground group-hover:text-brand transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted line-clamp-3 leading-relaxed">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDate(post.date)}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} min read</span>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
