"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { BlogPost } from "@/lib/blog-data";

interface BlogSearchProps {
  posts: BlogPost[];
  onFilter: (filtered: BlogPost[]) => void;
}

export function BlogSearch({ posts, onFilter }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);
    const q = value.toLowerCase().trim();
    if (!q) {
      onFilter(posts);
      return;
    }
    const filtered = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
    onFilter(filtered);
  };

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search articles..."
        className="pl-10"
        aria-label="Search blog articles"
      />
    </div>
  );
}
