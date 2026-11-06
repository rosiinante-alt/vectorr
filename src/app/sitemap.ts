import type { MetadataRoute } from "next";
import { BLOG_SLUGS } from "@/lib/blog-configs";
import { COMPARISON_SLUGS } from "@/lib/comparisons";
import { CONVERTER_PAGES } from "@/lib/converter-configs";
import { RESOURCE_SLUGS } from "@/lib/resource-configs";
import { WORKFLOW_SLUGS } from "@/lib/workflow-configs";
import { DESIGNERS_WORKFLOWS } from "@/lib/designers-workflow-configs";
import { SHOPS_WORKFLOWS } from "@/lib/shops-workflow-configs";
import { FREE_TOOLS } from "@/lib/tools-configs";

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

  // Add blog article pages
  const blogPages = BLOG_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Add workflow pages (crafters)
  const workflowPages = WORKFLOW_SLUGS.map((slug) => ({
    url: `${baseUrl}/for-crafters/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Add shops workflow pages
  const shopsPages = SHOPS_WORKFLOWS.map((w) => ({
    url: `${baseUrl}/for-shops/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Add designers workflow pages
  const designersPages = DESIGNERS_WORKFLOWS.map((w) => ({
    url: `${baseUrl}/for-designers/${w.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Tools pages
  const toolPages = [
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    ...FREE_TOOLS.map((tool) => ({
      url: `${baseUrl}/tools/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // Hub pages, so the section roots are indexed alongside their children.
  // /resources already lives in mainPages below.
  const hubPages = [
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-crafters`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-shops`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-designers`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ];

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

  return [
    ...mainPages,
    ...converterPages,
    ...comparisonPages,
    ...resourcePages,
    ...workflowPages,
    ...shopsPages,
    ...designersPages,
    ...blogPages,
    ...toolPages,
    ...hubPages,
  ];
}
