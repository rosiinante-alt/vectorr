/**
 * Workflow pages configuration
 * Niche-specific guides for crafters, makers, and professionals
 */

export interface WorkflowConfig {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  category: string;
  tools: string[];
  formats: string[];
  content: string;
}

// Load workflow data from JSON
const workflowsData = require('../../public/data/workflows.json') as WorkflowConfig[];

export const WORKFLOWS = workflowsData.reduce(
  (acc, workflow) => {
    acc[workflow.slug] = workflow;
    return acc;
  },
  {} as Record<string, WorkflowConfig>
);

export const WORKFLOW_SLUGS = workflowsData.map((w) => w.slug);

export function getWorkflow(slug: string): WorkflowConfig | undefined {
  return WORKFLOWS[slug];
}

export function getWorkflowsByCategory(category: string): WorkflowConfig[] {
  return workflowsData.filter((w) => w.category === category);
}
