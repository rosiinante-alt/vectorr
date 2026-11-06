import type { MetadataRoute } from "next";
import { COMPARISON_SLUGS } from "@/lib/comparisons";
import { CONVERTER_PAGES } from "@/lib/converter-configs";
import { RESOURCE_SLUGS } from "@/lib/resource-configs";
import { WORKFLOW_SLUGS } from "@/lib/workflow-configs";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Add converter pages
  const converterPages = CONVERTER_PAGES.map((format) => ({
    url: `${baseUrl}/convert/${format}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Add competitor comparison pages
  const comparisonPages = COMPARISON_SLUGS.map((slug) => ({
    url: `${baseUrl}/compare/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Add resource guide pages
  const resourcePages = RESOURCE_SLUGS.map((slug) => ({
    url: `${baseUrl}/resources/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Add workflow pages
  const workflowPages = WORKFLOW_SLUGS.map((slug) => ({
    url: `${baseUrl}/for-crafters/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Add main pages
  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/convert`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

  return [...mainPages, ...converterPages, ...comparisonPages, ...resourcePages, ...workflowPages];
}
