import type { MetadataRoute } from "next";

/**
 * robots.txt — allows crawling of public content, blocks auth/app surfaces.
 * Served at /robots.txt; the sitemap URL follows NEXT_PUBLIC_SITE_URL so it
 * never drifts from the deployed domain.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://vectroy.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/login", "/batch/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
