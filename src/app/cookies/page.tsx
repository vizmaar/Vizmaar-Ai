import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = generateSEO({
  title: "Cookie Policy",
  description: `Learn about how ${SITE_CONFIG.name} uses cookies and local storage.`,
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Cookie Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 1, 2026</p>
      <div className="prose-vizmaar">
        <h2>What Are Cookies?</h2>
        <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences and improve your experience.</p>
        <h2>How We Use Cookies</h2>
        <p>VIZMAAR uses minimal cookies and local storage exclusively for functional purposes:</p>
        <p><strong>Theme Preference:</strong> We store your light/dark mode choice in localStorage so your preference persists across visits. This data never leaves your device.</p>
        <h2>What We Do Not Do</h2>
        <p>We do not use advertising cookies, tracking cookies, or third-party analytics cookies that follow you across websites. We do not sell cookie data to any third parties.</p>
        <h2>Managing Cookies</h2>
        <p>You can clear cookies and local storage through your browser settings at any time. Clearing storage will reset your theme preference to the system default.</p>
        <h2>Contact</h2>
        <p>Questions about our cookie policy? Email us at hello@vizmaar.com.</p>
      </div>
    </div>
  );
}
