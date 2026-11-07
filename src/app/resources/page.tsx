import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { RESOURCES } from "@/lib/resource-configs";

export const metadata: Metadata = {
  title: "Vector Resources — Guides for SVG, DXF, Print and Embroidery",
  description:
    "Practical guides to vector file formats, SVG optimization, raster-to-vector tracing, Cricut, laser cutting, embroidery formats, color separation, and batch automation.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
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
              Vector resources, written for people who ship files.
            </h1>
            <p className="mt-5 max-w-[600px] text-[17px] leading-relaxed text-text-secondary">
              What each format stores, where conversion loses fidelity, and how to
              prepare artwork for cutters, presses, and embroidery machines.
            </p>
          </div>
        </section>

        <section className="pb-20" aria-label="All resources">
          <div className="wrap">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {RESOURCES.map((resource) => (
                <li key={resource.slug}>
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="flex h-full flex-col rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-[0_0_0_0.5px_var(--border-strong),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]"
                  >
                    <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
                      {resource.title}
                    </h2>
                    <p className="mt-2.5 text-[14.5px] leading-relaxed text-text-secondary">
                      {resource.seoDescription}
                    </p>
                    <span className="mt-4 text-[13.5px] font-medium text-accent">
                      Read guide
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
