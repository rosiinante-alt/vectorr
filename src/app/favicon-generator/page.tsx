import { Suspense } from "react";
import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { FaviconGeneratorClient } from "./generator-client";

export const metadata: Metadata = {
  title: "Free Favicon Generator | Create Multi-Size Icons | Vectroy",
  description:
    "Generate favicons in all required sizes instantly. Upload your logo and download 16×16, 32×32, Apple Touch, Android, and PWA icons.",
  keywords: [
    "favicon generator",
    "create favicon",
    "favicon.ico",
    "apple touch icon",
    "pwa icons",
    "website icon generator",
  ],
  openGraph: {
    title: "Free Favicon Generator - All Sizes",
    description: "Generate favicons in all required sizes from your logo. Free online favicon maker.",
    type: "website",
  },
};

export default function FaviconGeneratorPage() {
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
              Free Favicon Generator
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-text-secondary">
              Upload your logo and instantly generate favicons in all required
              sizes for web, iOS, Android, and PWA.
            </p>
          </div>
        </section>

        {/* ── Generator ──────────────────────────────────────── */}
        <FaviconGeneratorClient />

        {/* ── Why favicons matter ────────────────────────────── */}
        <section className="py-20 bg-bg-secondary" aria-labelledby="why-heading">
          <div className="wrap">
            <h2
              id="why-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Why favicons matter for SEO and branding.
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Favicons appear in browser tabs, bookmarks, search results, and
              home screens. A professional favicon builds trust and brand
              recognition.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Browser tab identity",
                  body: "Users recognize your site instantly among dozens of open tabs. A missing favicon looks unprofessional.",
                },
                {
                  title: "Mobile home screen",
                  body: "iOS and Android use 180×180 and 192×192 icons when users add your site to their home screen.",
                },
                {
                  title: "Bookmark visibility",
                  body: "Bookmarks with favicons stand out in bookmark bars and lists, increasing return visits.",
                },
                {
                  title: "Search result trust",
                  body: "Google shows favicons in mobile search results. A recognizable icon improves click-through rates.",
                },
                {
                  title: "PWA requirements",
                  body: "Progressive Web Apps require 192×192 and 512×512 icons to pass installation checks.",
                },
                {
                  title: "Brand consistency",
                  body: "Maintain visual identity across every touchpoint, from browser tabs to task switchers.",
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
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
