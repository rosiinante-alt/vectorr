import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { FAQ_ITEMS, buildFAQSchema } from "@/lib/faq-configs";
import type { FAQItem } from "@/lib/faq-configs";

export const metadata: Metadata = {
  title: "FAQ — Vectorization Questions Answered | Vectroy",
  description:
    "Answers to common questions about vectorization, SVG conversion, credits, formats, quality, batch processing, and more.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQ — Vectorization Questions Answered",
    description: "Common questions about Vectroy and vectorization workflows.",
    type: "website",
    url: "/faq",
  },
};

function FAQAccordion({ item }: { item: FAQItem }) {
  return (
    <details className="group rounded-[var(--radius-md)] bg-bg-secondary overflow-hidden">
      <summary className="flex items-center justify-between cursor-pointer p-5 text-base font-medium text-text-primary hover:bg-bg-tertiary transition-colors list-none">
        <span>{item.question}</span>
        <svg
          className="h-5 w-5 text-text-tertiary transition-transform group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
        {item.answer}
      </div>
    </details>
  );
}

export default function FAQPage() {
  const schema = buildFAQSchema();
  const categories = [...new Set(FAQ_ITEMS.map((f) => f.category))];

  return (
    <div className="flex min-h-svh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          {/* Hero */}
          <div className="mx-auto max-w-[720px] text-center mb-12">
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Everything you need to know about vectorization, credits, formats,
              and workflows.
            </p>
          </div>

          {/* Quick nav */}
          <nav aria-label="FAQ categories" className="mb-10">
            <ul className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <li key={cat}>
                  <a
                    href={`#category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-4 py-1.5 rounded-full text-sm font-medium border border-border text-text-secondary hover:border-accent hover:text-text-primary transition-colors"
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* FAQ by category */}
          <div className="space-y-12 max-w-[800px] mx-auto">
            {categories.map((cat) => {
              const items = FAQ_ITEMS.filter((f) => f.category === cat);
              return (
                <section
                  key={cat}
                  id={`category-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="scroll-mt-20"
                >
                  <h2 className="text-[clamp(20px,2.5vw,28px)] font-semibold text-text-primary mb-5 pb-2 border-b border-border">
                    {cat}
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <FAQAccordion key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
