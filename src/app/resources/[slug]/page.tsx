import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  getResource,
  getSections,
  RESOURCE_SLUGS,
  RESOURCES,
  withHeadingIds,
} from "@/lib/resource-configs";

interface RouteParams {
  slug: string;
}

interface PageProps {
  params: Promise<RouteParams>;
}

/** Pre-render every resource guide at build time. */
export async function generateStaticParams(): Promise<RouteParams[]> {
  return RESOURCE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    return {
      title: "Resource Not Found — Vectorr",
      description: "This resource guide is not available.",
    };
  }

  return {
    title: resource.seoTitle,
    description: resource.seoDescription,
    keywords: resource.keywords,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      title: resource.seoTitle,
      description: resource.seoDescription,
      type: "article",
      url: `/resources/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: resource.seoTitle,
      description: resource.seoDescription,
    },
  };
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const resource = getResource(slug);

  if (!resource) {
    notFound();
  }

  const sections = getSections(resource.content);
  const body = withHeadingIds(resource.content);
  const related = RESOURCES.filter((r) => r.slug !== slug).slice(0, 3);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(resource.schema) }}
        />

        <div className="wrap py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[13.5px] text-text-tertiary"
          >
            <Link href="/" className="transition-colors hover:text-text-primary">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/resources"
              className="transition-colors hover:text-text-primary"
            >
              Resources
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-secondary">{resource.title}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            <article className="mx-auto w-full max-w-3xl lg:mx-0">
              <header>
                <h1 className="display text-[clamp(30px,4.4vw,48px)]">
                  {resource.title}
                </h1>
                <p className="mt-5 text-[17px] leading-[1.65] text-text-secondary">
                  {resource.seoDescription}
                </p>
              </header>

              <div
                className="resource-prose mt-10"
                dangerouslySetInnerHTML={{ __html: body }}
              />

              <div className="mt-14 rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary p-7">
                <h2 className="text-[19px] font-semibold tracking-[-0.02em]">
                  Put this into practice
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                  Upload an SVG and see exactly where the bytes go, or convert a
                  raster image to a clean vector. No signup required to preview.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/convert"
                    className="inline-flex h-10 items-center rounded-full bg-text-primary px-5 text-[14px] font-semibold text-white transition-colors hover:bg-black"
                  >
                    Open the converter
                  </Link>
                  <Link
                    href="/resources"
                    className="inline-flex h-10 items-center rounded-full border border-[var(--border-strong)] px-5 text-[14px] font-semibold text-text-primary transition-colors hover:bg-[rgba(0,0,0,0.045)]"
                  >
                    All resources
                  </Link>
                </div>
              </div>

              <section className="mt-14" aria-labelledby="related-heading">
                <h2
                  id="related-heading"
                  className="text-[19px] font-semibold tracking-[-0.02em]"
                >
                  Keep reading
                </h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/resources/${item.slug}`}
                        className="block h-full rounded-[var(--radius-lg)] border border-[var(--border)] p-4 text-[14.5px] font-medium leading-snug transition-colors hover:bg-bg-secondary"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </article>

            {sections.length >= 2 && (
              <aside className="hidden lg:block">
                <nav
                  aria-label="On this page"
                  className="sticky top-24 border-l border-[var(--border)] pl-5"
                >
                  <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
                    On this page
                  </h2>
                  <ul className="mt-3 grid gap-2.5">
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="block text-[13.5px] leading-snug text-text-secondary transition-colors hover:text-text-primary"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
