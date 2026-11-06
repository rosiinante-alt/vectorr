import { Metadata } from "next";
import Link from "next/link";
import { COMPARISONS } from "@/lib/comparisons";

export const metadata: Metadata = {
  title: "Best Vector Converters Comparison 2026 | Vectorr vs Competitors",
  description:
    "Honest comparison of the top vector conversion tools. Find the best solution for converting your images to scalable vectors. Compare Vectorr with Vectosolve, Vectorizer.ai, Adobe Illustrator, and more.",
  keywords: [
    "vector converter comparison",
    "best vectorization tool",
    "PNG to SVG converter",
    "Vectorr vs Vectosolve",
    "vector conversion tools",
    "AI vectorization",
  ],
  openGraph: {
    title: "Best Vector Converters Comparison 2026",
    description:
      "Compare Vectorr with leading vector conversion tools. AI-powered vectorization, batch processing, and more.",
    type: "website",
  },
};

// Main competitors for the comparison table
const mainCompetitors = [
  {
    name: "Vectorr",
    pricing: "From $9/mo",
    badge: "Best Value",
    features: {
      aiPowered: true,
      batchProcessing: true,
      colorEditing: true,
      apiAccess: true,
      noWatermarks: true,
      unlimitedExports: true,
      pdfExport: true,
      epsExport: true,
      backgroundRemoval: true,
      logoOptimized: true,
    },
  },
  {
    name: "Vectosolve",
    pricing: "From $6.99",
    features: {
      aiPowered: true,
      batchProcessing: false,
      colorEditing: true,
      apiAccess: false,
      noWatermarks: true,
      unlimitedExports: true,
      pdfExport: true,
      epsExport: true,
      backgroundRemoval: true,
      logoOptimized: true,
    },
  },
  {
    name: "Vectorizer.ai",
    pricing: "$9.99/mo",
    features: {
      aiPowered: true,
      batchProcessing: false,
      colorEditing: true,
      apiAccess: true,
      noWatermarks: false,
      unlimitedExports: false,
      pdfExport: true,
      epsExport: true,
      backgroundRemoval: false,
      logoOptimized: true,
    },
  },
  {
    name: "Adobe Illustrator",
    pricing: "$22.99/mo",
    features: {
      aiPowered: false,
      batchProcessing: true,
      colorEditing: true,
      apiAccess: false,
      noWatermarks: true,
      unlimitedExports: true,
      pdfExport: true,
      epsExport: true,
      backgroundRemoval: false,
      logoOptimized: false,
    },
  },
];

const featureLabels = {
  aiPowered: "AI-Powered Vectorization",
  batchProcessing: "Batch Processing",
  colorEditing: "Color Editing",
  apiAccess: "API Access",
  noWatermarks: "No Watermarks",
  unlimitedExports: "Unlimited Exports",
  pdfExport: "PDF Export",
  epsExport: "EPS Export",
  backgroundRemoval: "Background Removal",
  logoOptimized: "Logo Optimized",
};

export default function ComparePage() {
  // Group comparisons by category
  const categories = {
    converters: COMPARISONS.filter((c) =>
      [
        "vectosolve",
        "vectorizer-ai",
        "vector-magic",
        "convertio",
        "autotracer",
      ].includes(c.slug)
    ),
    design: COMPARISONS.filter((c) =>
      [
        "adobe-illustrator",
        "figma",
        "canva",
        "affinity-designer",
        "coreldraw",
        "inkscape",
      ].includes(c.slug)
    ),
    craft: COMPARISONS.filter((c) =>
      ["cricut-design-space", "silhouette-studio"].includes(c.slug)
    ),
    raster: COMPARISONS.filter((c) => ["gimp", "photopea"].includes(c.slug)),
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">
          Best Vector Converters
          <br />
          <span className="text-primary">Comparison 2026</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Honest comparison of the top vectorization tools. Find the best
          solution for converting your images to scalable vectors.
        </p>
      </div>

      {/* Competitor Cards Section */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainCompetitors.map((competitor) => (
            <div
              key={competitor.name}
              className="border rounded-lg p-6 relative bg-card hover:shadow-lg transition-shadow"
            >
              {competitor.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {competitor.badge}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{competitor.name}</h3>
              <p className="text-2xl font-bold text-primary mb-4">
                {competitor.pricing}
              </p>
              {competitor.name === "Vectorr" && (
                <p className="text-sm text-muted-foreground mb-4">
                  Free previews, batch processing
                </p>
              )}
              {competitor.name === "Vectosolve" && (
                <p className="text-sm text-muted-foreground mb-4">
                  Free previews, no signup
                </p>
              )}
              {competitor.name === "Vectorizer.ai" && (
                <p className="text-sm text-muted-foreground mb-4">
                  Limited free tier
                </p>
              )}
              {competitor.name === "Adobe Illustrator" && (
                <p className="text-sm text-muted-foreground mb-4">
                  7-day trial, full suite
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto mb-16 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-semibold">Feature</th>
              {mainCompetitors.map((competitor) => (
                <th key={competitor.name} className="text-center p-4">
                  <div className="font-semibold">{competitor.name}</div>
                  {competitor.badge && (
                    <div className="text-xs text-primary mt-1">
                      {competitor.badge}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b bg-muted/30">
              <td className="p-4 font-medium">Pricing</td>
              {mainCompetitors.map((competitor) => (
                <td key={competitor.name} className="text-center p-4">
                  {competitor.pricing}
                </td>
              ))}
            </tr>
            {Object.entries(featureLabels).map(([key, label]) => (
              <tr key={key} className="border-b hover:bg-muted/30">
                <td className="p-4">{label}</td>
                {mainCompetitors.map((competitor) => (
                  <td key={competitor.name} className="text-center p-4">
                    {competitor.features[
                      key as keyof typeof competitor.features
                    ] ? (
                      <span className="text-green-600 text-xl">✓</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed Analysis Section */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Detailed Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mainCompetitors.map((competitor) => (
            <div key={competitor.name} className="border rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">{competitor.name}</h3>

              <div className="mb-4">
                <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                <ul className="space-y-1">
                  {competitor.name === "Vectorr" && (
                    <>
                      <li className="text-sm">
                        + AI-powered with batch processing
                      </li>
                      <li className="text-sm">+ API access included</li>
                      <li className="text-sm">
                        + Comprehensive format support
                      </li>
                      <li className="text-sm">+ Fast, modern platform</li>
                    </>
                  )}
                  {competitor.name === "Vectosolve" && (
                    <>
                      <li className="text-sm">+ Lowest entry price</li>
                      <li className="text-sm">+ Good quality output</li>
                      <li className="text-sm">+ Unused credits roll over</li>
                      <li className="text-sm">+ Simple interface</li>
                    </>
                  )}
                  {competitor.name === "Vectorizer.ai" && (
                    <>
                      <li className="text-sm">+ Excellent quality output</li>
                      <li className="text-sm">+ API available</li>
                      <li className="text-sm">+ Granular output controls</li>
                    </>
                  )}
                  {competitor.name === "Adobe Illustrator" && (
                    <>
                      <li className="text-sm">+ Industry standard</li>
                      <li className="text-sm">+ Full design suite</li>
                      <li className="text-sm">+ Manual control</li>
                      <li className="text-sm">+ Professional workflows</li>
                    </>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                <ul className="space-y-1">
                  {competitor.name === "Vectorr" && (
                    <>
                      <li className="text-sm">- Newer in market</li>
                    </>
                  )}
                  {competitor.name === "Vectosolve" && (
                    <>
                      <li className="text-sm">- No batch processing</li>
                      <li className="text-sm">- No API access</li>
                      <li className="text-sm">- Limited to basic conversion</li>
                    </>
                  )}
                  {competitor.name === "Vectorizer.ai" && (
                    <>
                      <li className="text-sm">- No batch processing</li>
                      <li className="text-sm">- Watermarks on free tier</li>
                      <li className="text-sm">- No background removal</li>
                    </>
                  )}
                  {competitor.name === "Adobe Illustrator" && (
                    <>
                      <li className="text-sm">- Very expensive</li>
                      <li className="text-sm">- Steep learning curve</li>
                      <li className="text-sm">- Manual tracing required</li>
                      <li className="text-sm">
                        - Overkill for simple conversions
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {competitor.name === "Vectorr" && (
                <Link
                  href="/pricing"
                  className="mt-6 block text-center bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Try Vectorr Free
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Vectorr Section */}
      <div className="max-w-4xl mx-auto mb-16 bg-primary/5 rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Why Choose Vectorr?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="font-bold mb-2">Fastest AI</h3>
            <p className="text-sm text-muted-foreground">
              Convert in 2-5 seconds with cutting-edge AI
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="font-bold mb-2">Best Value</h3>
            <p className="text-sm text-muted-foreground">
              From $9/mo with batch processing and API access
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-bold mb-2">Batch Processing</h3>
            <p className="text-sm text-muted-foreground">
              Convert hundreds of files at once
            </p>
          </div>
        </div>
        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Detailed Comparisons Section */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Detailed Comparisons
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Dive deeper into how Vectorr compares to specific competitors with our
          detailed comparison pages.
        </p>

        {/* Vector Converters */}
        {categories.converters.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Vector Converters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.converters.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Comparison
                    </span>
                    <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded font-semibold">
                      Vectorr Wins
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {comparison.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {comparison.seoDescription.slice(0, 120)}...
                  </p>
                  <div className="text-primary text-sm font-semibold">
                    View full comparison →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Design Tools */}
        {categories.design.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Design Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.design.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Comparison
                    </span>
                    <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded font-semibold">
                      Vectorr Wins
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {comparison.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {comparison.seoDescription.slice(0, 120)}...
                  </p>
                  <div className="text-primary text-sm font-semibold">
                    View full comparison →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Craft Tools */}
        {categories.craft.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Craft Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.craft.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Comparison
                    </span>
                    <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded font-semibold">
                      Vectorr Wins
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {comparison.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {comparison.seoDescription.slice(0, 120)}...
                  </p>
                  <div className="text-primary text-sm font-semibold">
                    View full comparison →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Raster Editors */}
        {categories.raster.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Raster Editors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.raster.map((comparison) => (
                <Link
                  key={comparison.slug}
                  href={`/compare/${comparison.slug}`}
                  className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-card group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      Comparison
                    </span>
                    <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded font-semibold">
                      Vectorr Wins
                    </span>
                  </div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {comparison.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {comparison.seoDescription.slice(0, 120)}...
                  </p>
                  <div className="text-primary text-sm font-semibold">
                    View full comparison →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="font-bold mb-2">
              What is the best free PNG to SVG converter?
            </h3>
            <p className="text-muted-foreground">
              Vectorr offers free watermarked previews with no signup required.
              You can test the quality before purchasing credits. For unlimited
              conversions without watermarks, plans start at $9/month with batch
              processing and API access.
            </p>
          </div>
          <div className="border-b pb-6">
            <h3 className="font-bold mb-2">
              Is Vectorr better than Vectosolve?
            </h3>
            <p className="text-muted-foreground">
              Both offer excellent AI-powered vectorization. Vectorr includes
              batch processing, API access, and more export formats at $9/mo,
              while Vectosolve starts at $6.99/mo for single conversions. Choose
              based on whether you need advanced features or just basic
              conversion.
            </p>
          </div>
          <div className="border-b pb-6">
            <h3 className="font-bold mb-2">
              Do I need Adobe Illustrator to convert PNG to SVG?
            </h3>
            <p className="text-muted-foreground">
              No! While Illustrator can trace images, it requires manual work,
              design skills, and costs $22.99/mo. AI-powered tools like Vectorr
              do it automatically in seconds at a much lower cost with
              comparable or better quality.
            </p>
          </div>
          <div className="pb-6">
            <h3 className="font-bold mb-2">
              Can I use Vectorr for batch conversions?
            </h3>
            <p className="text-muted-foreground">
              Yes! Vectorr includes batch processing on all paid plans, allowing
              you to convert hundreds of files at once. This is a major
              advantage over competitors like Vectosolve and Vectorizer.ai which
              only support single-file conversion.
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto text-center mt-16 pt-16 border-t">
        <p className="text-sm text-muted-foreground">
          © 2026 Vectorr. All rights reserved.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated: November 2026
        </p>
      </div>
    </div>
  );
}
