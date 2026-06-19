"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getFeaturedTools } from "@/lib/tools-data";

export function ToolsGrid() {
  const tools = getFeaturedTools();

  return (
    <section className="py-20 sm:py-24 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Popular Tools</h2>
            <p className="mt-2 text-muted">Free, fast, and privacy-first utilities.</p>
          </div>
          <Link href="/tools" className="flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover transition-colors">
            View all tools <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/tools/${tool.slug}`}>
                <Card hover className="h-full group">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-light group-hover:bg-brand group-hover:text-white transition-colors">
                      <tool.icon className="h-5 w-5 text-brand group-hover:text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">{tool.name}</h3>
                      </div>
                      <Badge className="mt-1">{tool.category}</Badge>
                      <p className="mt-2 text-sm text-muted leading-relaxed">{tool.description}</p>
                    </div>
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
