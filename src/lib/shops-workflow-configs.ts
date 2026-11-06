/**
 * For-Shops Workflow Configurations
 * Production-focused guides for print shops, embroidery services, and manufacturing operations
 */

import shopsWorkflowsData from '../../public/data/shops-workflows.json';

export interface ShopsWorkflow {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  category: string;
  tools: string[];
  formats: string[];
  content: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  schema: {
    '@context': string;
    '@graph': Array<{
      '@type': string;
      [key: string]: unknown;
    }>;
  };
}

export const SHOPS_WORKFLOWS: ShopsWorkflow[] = shopsWorkflowsData as ShopsWorkflow[];

export const SHOPS_WORKFLOWS_MAP = new Map(
  SHOPS_WORKFLOWS.map((w) => [w.slug, w])
);

/** Get all unique categories across shops workflows */
export function getShopsCategories(): string[] {
  const categories = new Set(SHOPS_WORKFLOWS.map((w) => w.category));
  return Array.from(categories).sort();
}

/** Get workflows for a specific category */
export function getShopsWorkflowsByCategory(category: string): ShopsWorkflow[] {
  return SHOPS_WORKFLOWS.filter((w) => w.category === category);
}

/** FAQ JSON-LD schema for a specific workflow */
export function shopsFaqSchema(workflow: ShopsWorkflow) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: workflow.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
