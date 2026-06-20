"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Globe, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "All processing happens in your browser. Your files and data never leave your device.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "No server uploads or API calls. Get instant results with zero latency.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Use on any device with a modern browser. No installation required.",
  },
  {
    icon: Lock,
    title: "No Account Needed",
    description: "Start using tools immediately. No signup, no login, no subscriptions.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Why Choose VIZMAAR?</h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">Built for professionals who value speed, privacy, and quality.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="h-full text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light">
                  <feature.icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
