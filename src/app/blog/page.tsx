"use client";

import { useState } from "react";
import { BLOG_POSTS, BLOG_CATEGORIES, BlogPost } from "@/lib/blog-data";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSearch } from "@/components/blog/BlogSearch";

export default function BlogPage() {
  const [filtered, setFiltered] = useState<BlogPost[]>(BLOG_POSTS);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const featured = BLOG_POSTS.filter((p) => p.featured);

  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    if (category === "All") {
      setFiltered(BLOG_POSTS);
    } else {
      setFiltered(BLOG_POSTS.filter((p) => p.category === category));
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          VIZMAAR <span className="gradient-text">Blog</span>
        </h1>
        <p className="mt-4 text-muted max-w-2xl mx-auto text-lg">
          Expert guides on productivity, digital tools, and modern workflows.
        </p>
      </div>

      {featured.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <BlogSearch posts={BLOG_POSTS} onFilter={(posts) => { setFiltered(posts); setActiveCategory("All"); }} />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => filterByCategory("All")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === "All" ? "bg-brand text-white" : "bg-surface-hover text-muted"}`}
          >
            All
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => filterByCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeCategory === cat ? "bg-brand text-white" : "bg-surface-hover text-muted"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-muted py-12">No articles found. Try a different search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
