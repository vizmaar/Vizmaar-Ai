"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Contact Us</h1>
      <p className="text-muted mb-8">Have a question or feedback? We would love to hear from you.</p>

      {submitted ? (
        <Card className="text-center py-12">
          <p className="text-lg font-semibold text-foreground">Thank you for your message!</p>
          <p className="text-muted mt-2">We will get back to you as soon as possible.</p>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" required placeholder="Your name" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required placeholder="How can we help?" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" required rows={5} placeholder="Your message..." />
            </div>
            <Button type="submit"><Send className="h-4 w-4" /> Send Message</Button>
          </form>
        </Card>
      )}

      <p className="text-sm text-muted mt-6 text-center">
        Or email us directly at{" "}
        <a href="mailto:hello@vizmaar.com" className="text-brand hover:underline">hello@vizmaar.com</a>
      </p>
    </div>
  );
}
