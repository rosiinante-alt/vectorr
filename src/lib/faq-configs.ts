import faqData from "../../public/data/faq.json";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FAQ_ITEMS: FAQItem[] = faqData as FAQItem[];

export const FAQ_CATEGORIES = [
  ...new Set(FAQ_ITEMS.map((f) => f.category)),
];

export function getFAQsByCategory(category: string): FAQItem[] {
  return FAQ_ITEMS.filter((f) => f.category === category);
}

export function buildFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
