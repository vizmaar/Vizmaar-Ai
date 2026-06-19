import { generateSEO } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/site-config";
import { Card } from "@/components/ui/Card";

export const metadata = generateSEO({
  title: "About Us",
  description: `Learn about ${SITE_CONFIG.name} — our mission to provide free, privacy-first online tools for everyone.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">About VIZMAAR</h1>
      <div className="prose-vizmaar">
        <p>
          VIZMAAR was built with a simple belief: powerful online tools should be free, fast, and respect your privacy. In a world where most utilities require accounts, subscriptions, or upload your files to unknown servers, we took a different approach.
        </p>
        <p>
          Every tool on VIZMAAR runs entirely in your browser. Your documents, images, and data never leave your device. There are no API calls, no backend storage, and no tracking of your file contents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
        {[
          { value: "20+", label: "Free Tools" },
          { value: "100%", label: "Client-Side" },
          { value: "0", label: "Data Stored" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-brand">{stat.value}</p>
            <p className="text-sm text-muted mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="prose-vizmaar mt-10">
        <h2>Our Mission</h2>
        <p>
          We aim to democratize access to professional-grade utilities. Whether you are a freelancer creating invoices, a student merging PDFs, or a developer formatting JSON, VIZMAAR gives you the tools you need without barriers.
        </p>
        <h2>What Makes Us Different</h2>
        <p>
          Unlike cloud-based alternatives, VIZMAAR processes everything locally using modern web technologies. This means faster performance, complete privacy, and the ability to work offline once pages are loaded.
        </p>
      </div>
    </div>
  );
}
