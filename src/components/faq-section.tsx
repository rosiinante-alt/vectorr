"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What file formats can I convert?",
    answer: "You can upload PNG, JPG, GIF, WEBP, or BMP files. We convert them to SVG, PDF, EPS, DXF, or G-code depending on your needs.",
  },
  {
    question: "What makes Vectroy different from other vectorizers?",
    answer: "We rebuild real geometry instead of just outlining pixels. Our AI detects circles, ellipses, smooth curves, and sharp corners—so you get editable paths, not node soup.",
  },
  {
    question: "How does the free trial work?",
    answer: "New users get 5 free credits. Each conversion costs 1 credit. No payment required, no expiration. Start converting immediately.",
  },
  {
    question: "Can I use the vectors for commercial work?",
    answer: "Yes. Vectors you create belong to you 100%. Use them on products, in print, for clients, or resale—no restrictions.",
  },
  {
    question: "Which format should I use for laser cutting?",
    answer: "SVG works great for most laser cutters. DXF is preferred for some CNC machines. PDF works universally. We include all three with every conversion.",
  },
  {
    question: "Can I batch convert multiple files?",
    answer: "Yes. Upload 1-100 files at once with our batch converter. Perfect for converting entire product catalogs or logo libraries.",
  },
  {
    question: "How accurate is the vectorization?",
    answer: "Accuracy depends on image quality. High-contrast images vectorize perfectly. Photos convert to detailed illustrations. Our preview shows exactly what you'll get before download.",
  },
  {
    question: "What if the result isn't perfect?",
    answer: "Adjust settings in the preview: trace tightness, color count, smoothing. Preview updates in real-time. Download only when happy.",
  },
];

export function FAQSection() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className="py-20 sm:py-28" aria-labelledby="faq-heading">
      <div className="wrap max-w-[800px]">
        <div className="mb-12">
          <h2 id="faq-heading" className="display text-[clamp(30px,4.4vw,50px)]">
            Common questions.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === idx ? null : idx)}
                className="w-full text-left px-6 py-4 hover:bg-bg-secondary transition-colors flex items-center justify-between"
                aria-expanded={expanded === idx}
              >
                <span className="font-medium text-text-primary">{faq.question}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`flex-shrink-0 text-text-tertiary transition-transform ${
                    expanded === idx ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {expanded === idx && (
                <div className="px-6 py-4 bg-bg-secondary text-text-secondary border-t border-border text-[15px] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
