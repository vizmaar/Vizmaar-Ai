import { generateSEO, generateFAQSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Card } from "@/components/ui/Card";

const faqs = [
  {
    question: "Is VIZMAAR really free?",
    answer: "Yes, all 20+ tools on VIZMAAR are completely free to use. There are no hidden fees, subscriptions, or premium tiers.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No. VIZMAAR requires no signup, no login, and no personal information. Simply visit any tool and start using it immediately.",
  },
  {
    question: "Are my files uploaded to your servers?",
    answer: "No. All tools process data entirely in your browser using client-side JavaScript. Your files, text, and data never leave your device.",
  },
  {
    question: "Does VIZMAAR use any APIs?",
    answer: "No. VIZMAAR does not use OpenAI, Gemini, or any external paid APIs. All tool functionality runs locally in your browser without network requests for processing.",
  },
  {
    question: "Can I use VIZMAAR for commercial purposes?",
    answer: "Yes. You may use our tools for both personal and commercial purposes, including generating invoices, compressing images for websites, and merging business documents.",
  },
  {
    question: "Which browsers are supported?",
    answer: "VIZMAAR works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.",
  },
  {
    question: "Are the currency exchange rates live?",
    answer: "No. Our currency converter uses static reference rates for planning and estimation purposes. For actual transactions, consult your bank or financial institution for live rates.",
  },
  {
    question: "Can I use VIZMAAR offline?",
    answer: "Once pages are loaded, most tools work offline since all processing is client-side. However, you need an internet connection for the initial page load.",
  },
];

export const metadata = generateSEO({
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about VIZMAAR's free online tools, privacy, and usage.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <JsonLd data={generateFAQSchema(faqs)} />
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">FAQ</h1>
      <p className="text-muted mb-8">Common questions about VIZMAAR and our tools.</p>
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.question}>
            <h2 className="text-lg font-semibold text-foreground">{faq.question}</h2>
            <p className="mt-2 text-sm text-muted leading-relaxed">{faq.answer}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
