import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { use } from "react";
import { CONVERTER_CONFIGS, CONVERTER_PAGES } from "@/lib/converter-configs";

interface RouteParams {
  format: string;
}

interface PageProps {
  params: Promise<RouteParams>;
}

/**
 * Generate static params for all 67 converter pages
 * This pre-renders all converter pages at build time
 */
export async function generateStaticParams(): Promise<RouteParams[]> {
  return CONVERTER_PAGES.map((format) => ({
    format,
  }));
}

/**
 * Generate dynamic metadata for each converter page
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { format } = await params;
  const config = CONVERTER_CONFIGS[format];

  if (!config) {
    return {
      title: "Converter Not Found",
      description: "This converter is not available.",
    };
  }

  return {
    title: config.seoTitle,
    description: config.seoDescription,
    keywords: config.keywords,
    openGraph: {
      title: config.seoTitle,
      description: config.seoDescription,
      type: "website",
      url: `/convert/${format}`,
    },
    twitter: {
      card: "summary_large_image",
      title: config.seoTitle,
      description: config.seoDescription,
    },
  };
}

/**
 * Convert Schema.org HowTo markup
 */
function generateHowToSchema(config: (typeof CONVERTER_CONFIGS)[string]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: config.schema.toolName,
    description: `How to convert ${config.schema.inputName} to ${config.schema.outputName}`,
    step: config.schema.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Organization schema for SEO
 */
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vectorr",
    url: "https://vectorr.com",
    logo: "https://vectorr.com/logo.png",
    description:
      "Free online vector conversion and optimization tools for designers, makers, and professionals.",
  };
}

export default function ConvertPage({ params }: PageProps) {
  const { format } = use(params);
  const config = CONVERTER_CONFIGS[format];

  if (!config) {
    notFound();
  }

  const howToSchema = generateHowToSchema(config);
  const orgSchema = generateOrganizationSchema();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Schema.org markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Breadcrumb navigation for SEO */}
        <nav className="mb-8 flex items-center space-x-2 text-sm text-slate-400">
          <a href="/" className="hover:text-slate-300">
            Home
          </a>
          <span>/</span>
          <a href="/convert" className="hover:text-slate-300">
            Converters
          </a>
          <span>/</span>
          <span className="text-slate-300">{config.title}</span>
        </nav>

        {/* Main content */}
        <article className="prose prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: config.content }}
            className="mb-12 space-y-6 text-slate-300"
          />
        </article>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">
            Ready to convert {config.inputFormat} to {config.outputFormat}?
          </h2>
          <p className="mb-6 text-slate-400">
            Try our free converter today. No signup required for preview.
          </p>
          <a
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Start Converting Now
          </a>
        </div>

        {/* Related converters */}
        <div className="mt-16">
          <h3 className="mb-6 text-xl font-bold text-white">
            Related Converters
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {config.useCases.map((useCase, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-700 bg-slate-800/30 p-4 transition-colors hover:bg-slate-800/50"
              >
                <p className="text-slate-300">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
