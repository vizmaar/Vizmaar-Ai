"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge className="mb-6">20+ Free Tools &middot; No Signup Required</Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Premium Tools for{" "}
            <span className="gradient-text">Modern Workflows</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            {SITE_CONFIG.description}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/tools">
              <Button size="lg">
                Explore All Tools <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="secondary" size="lg">Read Our Blog</Button>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted">
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-brand" /> 100% Private</span>
            <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand" /> Instant Results</span>
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-brand" /> Always Free</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
