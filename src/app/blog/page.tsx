import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { BLOG_CATEGORIES, sortedPosts } from "@/lib/blog-configs";

export const metadata: Metadata = {
  title: "Blog — File Formats, Machine Workflows and Vectorization Guides",
  description:
    "Practical guides for people who convert artwork for cutters, lasers, embroidery machines and 3D printers. File format internals, machine constraints, and the exact steps that stop a job failing.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Vectroy Blog",
    description:
      "Practical guides to vector files, machine workflows, and production-ready artwork.",
    type: "website",
    url: "/blog",
  },
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export default function BlogIndexPage() {
  const posts = sortedPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader
        authSlot={
          <Suspense fallback={null}>
            <AuthSlot />
          </Suspense>
        }
      />

      <main id="main" className="flex-1">
        <section className="py-14 sm:py-20">
          <div className="wrap">
            <h1 className="display max-w-[820px] text-[clamp(32px,5vw,56px)]">
              Guides written for the machine, not the demo.
            </h1>
            <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-text-secondary">
              Each guide starts from a constraint that actually breaks files —
              a bend radius, a node limit, a white ink requirement — and works
              backwards to what your artwork has to contain.
            </p>
          </div>
        </section>

        {featured && (
          <section className="pb-14" aria-label="Featured article">
            <div className="wrap">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid gap-8 rounded-[var(--radius-xl)] bg-white p-7 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)] md:grid-cols-[1.2fr_1fr] md:p-10"
              >
                <div>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-accent">
                    Latest
                  </span>
                  <h2 className="mt-3 text-[clamp(24px,3vw,34px)] font-semibold leading-tight tracking-[-0.025em]">
                    {featured.title}
                  </h2>
                  <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-text-secondary">
                    {featured.excerpt}
                  </p>
                  <p className="mt-6 text-[13.5px] text-text-tertiary">
                    {dateFormatter.format(new Date(featured.publishedAt))} ·{" "}
                    {featured.readingMinutes} min read
                  </p>
                </div>
                <div className="hidden md:block" aria-hidden="true">
                  <div className="h-full min-h-[180px] rounded-[var(--radius-lg)] bg-[radial-gradient(circle_at_30%_30%,var(--accent),transparent_60%)] opacity-20" />
                </div>
              </Link>
            </div>
          </section>
        )}

        <section className="pb-6" aria-label="Browse by topic">
          <div className="wrap">
            <ul className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <span className="inline-flex items-center rounded-full bg-bg-secondary px-3.5 py-1.5 text-[13px] font-medium text-text-secondary">
                    {cat.label}
                    <span className="ml-1.5 text-text-tertiary">
                      {posts.filter((p) => p.category === cat.id).length}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {BLOG_CATEGORIES.map((category) => {
          const categoryPosts = posts.filter((p) => p.category === category.id);
          if (categoryPosts.length === 0) return null;

          return (
            <section key={category.id} className="pb-14" aria-label={category.label}>
              <div className="wrap">
                <div className="mb-5 flex items-baseline justify-between gap-4">
                  <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                    {category.label}
                  </h2>
                </div>
                <p className="mb-6 max-w-[56ch] text-[14.5px] text-text-secondary">
                  {category.blurb}
                </p>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex h-full flex-col rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]"
                      >
                        <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.02em]">
                          {post.title}
                        </h3>
                        <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-text-secondary">
                          {post.excerpt}
                        </p>
                        <p className="mt-4 text-[13px] text-text-tertiary">
                          {post.readingMinutes} min read
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </main>

      <SiteFooter />
    </>
  );
}