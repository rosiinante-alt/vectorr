import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = {
  title: "Free SVG Templates | Cricut, Laser Cutting, Embroidery | Vectroy",
  description:
    "Download free SVG templates for Cricut, laser cutting, embroidery, and print-on-demand. Ready-to-use designs for makers and crafters.",
  keywords: [
    "svg templates",
    "free svg files",
    "cricut templates",
    "laser cutting templates",
    "embroidery svg",
    "print on demand templates",
  ],
  openGraph: {
    title: "Free SVG Templates for Makers",
    description: "Download ready-to-use SVG templates for Cricut, laser cutting, embroidery, and more.",
    type: "website",
  },
};

export default function TemplatesPage() {
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
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="py-16 text-center sm:py-20">
          <div className="wrap">
            <h1 className="display mx-auto max-w-[760px] text-[clamp(32px,5vw,52px)]">
              Free SVG Templates for Makers
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-text-secondary">
              Download production-ready SVG templates for Cricut, laser cutting,
              embroidery, and print-on-demand. All files optimized and tested.
            </p>
          </div>
        </section>

        {/* ── Templates Grid ─────────────────────────────────── */}
        <TemplatesClient />

        {/* ── Why use templates? ─────────────────────────────── */}
        <section className="py-20 bg-bg-secondary" aria-labelledby="why-heading">
          <div className="wrap">
            <h2
              id="why-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Start your next project faster.
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Every template is pre-optimized for its intended use case. No
              cleanup, no compatibility issues—just download and start making.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Production-ready",
                  body: "Files are tested with Cricut Design Space, Lightburn, and professional embroidery machines.",
                },
                {
                  title: "Multiple formats",
                  body: "Download as SVG, DXF, PNG, or EPS—whatever your tool needs.",
                },
                {
                  title: "Fully editable",
                  body: "Customize colors, resize, and modify paths in any vector editor or design software.",
                },
                {
                  title: "Commercial license",
                  body: "Use templates for client work, product listings, and commercial projects without attribution.",
                },
                {
                  title: "Regular updates",
                  body: "New templates added weekly across all categories. Subscribe to get notified.",
                },
                {
                  title: "Community tested",
                  body: "Each template is validated by our maker community before publishing.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-text-secondary">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-[15px] text-text-secondary">
                Need custom templates?{" "}
                <Link
                  href="/done-for-you"
                  className="text-accent-ink underline underline-offset-[3px] hover:text-accent"
                >
                  Commission our design team
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
