import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import {
  blogFaqSchema,
  BLOG_SLUGS,
  getBlogPost,
  getBlogSections,
  prepareBlogHtml,
} from "@/lib/blog-configs";
import { CONVERTER_CONFIGS } from "@/lib/converter-configs";

interface RouteParams {
  slug: string;
}

interface PageProps {
  params: Promise<RouteParams>;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  return BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Article Not Found — Vectorr",
      description: "This article is not available.",
    };
  }

  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle,
      description: post.seoDescription,
    },
  };
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sections = getBlogSections(post.content);
  const body = prepareBlogHtml(post.content);
  const faqLd = blogFaqSchema(post);

  const related = (post.relatedPosts ?? [])
    .map((s) => getBlogPost(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  const converters = (post.relatedConverters ?? [])
    .map((s) => ({ slug: s, config: CONVERTER_CONFIGS[s] }))
    .filter((c) => c.config);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: "Vectorr" },
    publisher: { "@type": "Organization", name: "Vectorr" },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        {faqLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}

        <div className="wrap py-10 sm:py-14">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[13.5px] text-text-tertiary"
          >
            <Link href="/" className="transition-colors hover:text-text-primary">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors hover:text-text-primary">
              Blog
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-text-secondary">{post.title}</span>
          </nav>

          <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            <article className="mx-auto w-full max-w-3xl lg:mx-0">
              <header>
                <h1 className="display text-[clamp(30px,4.4vw,46px)]">
                  {post.title}
                </h1>
                <p className="mt-5 text-[17.5px] leading-[1.65] text-text-secondary">
                  {post.excerpt}
                </p>
                <p className="mt-5 text-[13.5px] text-text-tertiary">
                  {dateFormatter.format(new Date(post.publishedAt))} ·{" "}
                  {post.readingMinutes} min read
                </p>
              </header>

              <div
                className="resource-prose mt-10"
                dangerouslySetInnerHTML={{ __html: body }}
              />

              {post.faqs && post.faqs.length > 0 && (
                <section className="mt-14" aria-labelledby="faq-heading">
                  <h2
                    id="faq-heading"
                    className="text-[22px] font-semibold tracking-[-0.02em]"
                  >
                    Frequently asked questions
                  </h2>
                  <div className="mt-5 divide-y divide-[var(--border)] border-y border-[var(--border)]">
                    {post.faqs.map((faq) => (
                      <details key={faq.question} className="group py-4">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-medium">
                          {faq.question}
                          <span
                            aria-hidden="true"
                            className="text-text-tertiary transition-transform group-open:rotate-45"
                          >
                            +
                          </span>
                        </summary>
                        <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

              {post.sources && post.sources.length > 0 && (
                <section className="mt-12" aria-labelledby="sources-heading">
                  <h2
                    id="sources-heading"
                    className="text-[13px] font-semibold uppercase tracking-[0.1em] text-text-tertiary"
                  >
                    Sources
                  </h2>
                  <ul className="mt-3 grid gap-2 text-[14px] text-text-secondary">
                    {post.sources.map((source) => (
                      <li key={source.href}>
                        <a
                          href={source.href}
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                          className="underline decoration-[var(--border-strong)] underline-offset-[3px] hover:text-text-primary"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {converters.length > 0 && (
                <section className="mt-12" aria-labelledby="converters-heading">
                  <h2
                    id="converters-heading"
                    className="text-[19px] font-semibold tracking-[-0.02em]"
                  >
                    Convert files for this workflow
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {converters.map(({ slug: cslug, config }) => (
                      <li key={cslug}>
                        <Link
                          href={`/convert/${cslug}`}
                          className="inline-flex items-center rounded-full border border-[var(--border-strong)] px-3.5 py-1.5 text-[13.5px] font-medium transition-colors hover:bg-bg-secondary"
                        >
                          {config!.inputFormat} → {config!.outputFormat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <div className="mt-12 rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary p-7">
                <h2 className="text-[19px] font-semibold tracking-[-0.02em]">
                  Try it on your own file
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                  Drop in an image or an SVG and see the result before you pay.
                  No signup is required to preview.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/convert"
                    className="inline-flex h-10 items-center rounded-full bg-text-primary px-5 text-[14px] font-semibold text-white transition-colors hover:bg-black"
                  >
                    Open the converter
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex h-10 items-center rounded-full border border-[var(--border-strong)] px-5 text-[14px] font-semibold text-text-primary transition-colors hover:bg-[rgba(0,0,0,0.045)]"
                  >
                    All articles
                  </Link>
                </div>
              </div>

              {related.length > 0 && (
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
                          href={`/blog/${item.slug}`}
                          className="block h-full rounded-[var(--radius-lg)] border border-[var(--border)] p-4 text-[14.5px] font-medium leading-snug transition-colors hover:bg-bg-secondary"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
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