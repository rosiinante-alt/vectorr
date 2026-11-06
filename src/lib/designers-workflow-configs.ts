/**
 * For-Designers Workflow Configurations
 * Design-focused guides for UI/UX designers, brand designers, and design system builders
 */

import designersWorkflowsData from '../../public/data/designers-workflows.json';

export interface DesignersWorkflow {
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

export const DESIGNERS_WORKFLOWS: DesignersWorkflow[] = designersWorkflowsData as DesignersWorkflow[];

export const DESIGNERS_WORKFLOWS_MAP = new Map(
  DESIGNERS_WORKFLOWS.map((w) => [w.slug, w])
);

/** Get all unique categories across designers workflows */
export function getDesignersCategories(): string[] {
  const categories = new Set(DESIGNERS_WORKFLOWS.map((w) => w.category));
  return Array.from(categories).sort();
}

/** Get workflows for a specific category */
export function getDesignersWorkflowsByCategory(category: string): DesignersWorkflow[] {
  return DESIGNERS_WORKFLOWS.filter((w) => w.category === category);
}

/** FAQ JSON-LD schema for a specific workflow */
export function designersFaqSchema(workflow: DesignersWorkflow) {
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
