import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = generateSEO({
  title: "Privacy Policy",
  description: `Read the ${SITE_CONFIG.name} privacy policy. Learn how we protect your data with 100% client-side processing.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 1, 2026</p>
      <div className="prose-vizmaar">
        <h2>Overview</h2>
        <p>At VIZMAAR, your privacy is our top priority. All tools on our platform process data entirely within your web browser. We do not collect, store, or transmit your files, text, or personal data to our servers.</p>
        <h2>Data Processing</h2>
        <p>When you use our tools — such as PDF merger, image compressor, or invoice generator — all processing occurs locally on your device. Your files never leave your browser and are never uploaded to any server.</p>
        <h2>Information We Collect</h2>
        <p>We may collect anonymous usage analytics such as page views and tool usage counts through standard web analytics. We do not collect personally identifiable information through our tools.</p>
        <h2>Cookies</h2>
        <p>We use minimal cookies to store your theme preference (light/dark mode) in local storage. See our Cookie Policy for details.</p>
        <h2>Third-Party Services</h2>
        <p>VIZMAAR does not use third-party APIs for tool functionality. We do not integrate with OpenAI, Gemini, or any paid external services for processing user data.</p>
        <h2>Contact</h2>
        <p>For privacy-related inquiries, contact us at hello@vizmaar.com.</p>
      </div>
    </div>
  );
}
