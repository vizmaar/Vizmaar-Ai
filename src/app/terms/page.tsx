import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata = generateSEO({
  title: "Terms of Service",
  description: `Read the ${SITE_CONFIG.name} terms of service for using our free online tools platform.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
      <p className="text-sm text-muted-foreground mb-8">Last updated: June 1, 2026</p>
      <div className="prose-vizmaar">
        <h2>Acceptance of Terms</h2>
        <p>By accessing and using VIZMAAR, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
        <h2>Description of Service</h2>
        <p>VIZMAAR provides free online tools that operate entirely in your web browser. Tools include but are not limited to PDF utilities, image editors, calculators, and text processing tools.</p>
        <h2>Use of Tools</h2>
        <p>You may use our tools for personal and commercial purposes free of charge. You are responsible for ensuring your use complies with applicable laws and regulations.</p>
        <h2>No Warranties</h2>
        <p>Tools are provided &quot;as is&quot; without warranties of any kind. While we strive for accuracy, we do not guarantee that calculator results, conversions, or generated documents meet specific legal or professional requirements.</p>
        <h2>Limitation of Liability</h2>
        <p>VIZMAAR shall not be liable for any damages arising from the use of our tools, including but not limited to data loss, financial decisions based on calculator results, or document formatting issues.</p>
        <h2>Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.</p>
      </div>
    </div>
  );
}
