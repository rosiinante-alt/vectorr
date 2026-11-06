import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { WORKFLOWS, WORKFLOW_SLUGS } from "@/lib/workflow-configs";

export const metadata: Metadata = {
  title: "For Crafters — File Guides for Cricut, Laser, Embroidery and 3D Printing",
  description:
    "Workflow guides for Cricut Design Space, Silhouette Cameo, laser engraving, embroidery digitizing, 3D printing and screen printing. What each machine needs, and how to prepare artwork that cuts and stitches cleanly.",
  alternates: { canonical: "/for-crafters" },
};

export default function ForCraftersPage() {
  const workflows = WORKFLOW_SLUGS.map((slug) => WORKFLOWS[slug]).filter(Boolean);
  const categories = [...new Set(workflows.map((workflow) => workflow.category))];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        <section className="py-14 sm:py-20">
          <div className="wrap">
            <h1 className="display max-w-[820px] text-[clamp(32px,5vw,56px)]">
              File guides for the machines you actually run.
            </h1>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Every cutter, laser, embroidery machine and 3D printer wants a
              different file — and each one fails in its own way when it gets
              the wrong one. These guides cover what the machine needs, and how
              to prepare artwork that runs the first time.
            </p>
          </div>
        </section>

        {categories.map((category) => (
          <section key={category} className="pb-14" aria-label={category}>
            <div className="wrap">
              <h2 className="mb-5 text-[13px] font-semibold uppercase tracking-[0.12em] text-text-tertiary">
                {category}
              </h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {workflows
                  .filter((workflow) => workflow.category === category)
                  .map((workflow) => (
                    <li key={workflow.slug}>
                      <Link
                        href={`/for-crafters/${workflow.slug}`}
                        className="flex h-full flex-col rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]"
                      >
                        <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                          {workflow.title}
                        </h3>
                        <p className="mt-2.5 text-[14.5px] leading-relaxed text-text-secondary">
                          {workflow.seoDescription}
                        </p>
                        <span className="mt-4 flex flex-wrap gap-1.5">
                          {workflow.formats.slice(0, 3).map((format) => (
                            <span
                              key={format}
                              className="rounded-full bg-[var(--surface-2,#F0F2F5)] px-2.5 py-0.5 text-[12px] font-medium text-text-secondary"
                            >
                              {format}
                            </span>
                          ))}
                        </span>
                        <span className="mt-4 text-[13.5px] font-medium text-accent">
                          Read guide
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        ))}
      </main>

      <SiteFooter />
    </>
  );
}
