"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTA() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl gradient-bg p-8 sm:p-12 lg:p-16 text-center"
        >
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Ready to Boost Your Productivity?</h2>
            <p className="mt-4 text-white/80 max-w-xl mx-auto text-lg">
              Access 20+ premium tools completely free. No signup, no limits, no compromises.
            </p>
            <Link href="/tools" className="inline-block mt-8">
              <Button size="lg" variant="secondary" className="bg-white text-brand hover:bg-white/90">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
