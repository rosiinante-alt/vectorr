import type { Metadata } from "next";

export function generateHomepageMeta(): Metadata {
  return {
    title: "Vectroy — Convert Images to Vectors with AI",
    description:
      "Turn PNG, JPG, WEBP into crisp SVG, PDF, DXF vectors in seconds. AI traces real geometry for Cricut, laser cutting, CNC, embroidery. No signup required.",
    keywords: [
      "image to vector",
      "png to svg",
      "jpg to svg",
      "vectorize image",
      "raster to vector",
      "AI vectorization",
      "vector converter",
      "SVG creator",
    ],
    openGraph: {
      title: "Vectroy — Convert Images to Vectors",
      description:
        "AI-powered vectorization. PNG, JPG, WEBP → SVG, PDF, DXF. Ready for Cricut, laser cutting, embroidery.",
      type: "website",
      url: "https://vectroy.com",
      images: [
        {
          url: "https://vectroy.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Vectroy image to vector converter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Vectroy — Convert Images to Vectors",
      description: "AI traces real geometry. SVG, PDF, DXF for every machine.",
      images: ["https://vectroy.com/og-image.jpg"],
    },
  };
}

export function generateComparisonMeta(
  competitor: string,
  title: string,
  description: string
): Metadata {
  return {
    title: `${title} — Vectroy`,
    description,
    keywords: [`${competitor} vs Vectroy`, `Vectroy vs ${competitor}`],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://vectroy.com/compare/${competitor}`,
    },
  };
}

export function generateBlogMeta(
  title: string,
  description: string,
  slug: string,
  publishedAt: string
): Metadata {
  return {
    title: `${title} — Vectroy Blog`,
    description,
    keywords: [title],
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://vectroy.com/blog/${slug}`,
      publishedTime: publishedAt,
    },
  };
}

// FAQ Schema for rich snippets
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Product schema
export function productSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vectroy",
    applicationCategory: "UtilitiesApplication",
    description: "AI-powered image to vector converter",
    url: "https://vectroy.com",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: "0",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    },
  };
}
