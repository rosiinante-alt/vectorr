import { Suspense } from "react";
import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { SVGEditorClient } from "./editor-client";

export const metadata: Metadata = {
  title: "Free SVG Editor | Edit SVG Code Online | Vectroy",
  description:
    "Edit SVG files directly in your browser. View, modify, and download SVG code with live preview. Free online SVG code editor with syntax validation.",
  keywords: [
    "svg editor",
    "edit svg online",
    "svg code editor",
    "svg xml editor",
    "free svg editor",
    "online svg tool",
  ],
  openGraph: {
    title: "Free SVG Editor - Edit SVG Code Online",
    description: "Edit SVG files directly in your browser with live preview and validation.",
    type: "website",
  },
};

export default function SVGEditorPage() {
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
              Free SVG Code Editor
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[17px] text-text-secondary">
              Edit SVG files directly in your browser. View source code, make
              changes, and see live preview updates instantly.
            </p>
          </div>
        </section>

        {/* ── Editor ─────────────────────────────────────────── */}
        <SVGEditorClient />

        {/* ── Why edit SVG? ──────────────────────────────────── */}
        <section className="py-20 bg-bg-secondary" aria-labelledby="why-heading">
          <div className="wrap">
            <h2
              id="why-heading"
              className="display max-w-[760px] text-[clamp(28px,4vw,44px)]"
            >
              Why edit SVG code directly?
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-text-secondary">
              Editing SVG XML gives you precise control over every element,
              attribute, and style. Perfect for optimization, troubleshooting,
              and fine-tuning.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Fine-tune paths",
                  body: "Edit path data, adjust coordinates, and optimize shapes for smaller file sizes.",
                },
                {
                  title: "Fix rendering issues",
                  body: "Debug viewBox problems, fix clipping paths, and resolve namespace conflicts.",
                },
                {
                  title: "Add IDs and classes",
                  body: "Prepare SVGs for CSS styling, JavaScript animation, or design system integration.",
                },
                {
                  title: "Remove metadata",
                  body: "Strip out editor-specific tags, comments, and hidden layers to reduce file size.",
                },
                {
                  title: "Inline styles",
                  body: "Convert external stylesheets to inline styles for self-contained SVG files.",
                },
                {
                  title: "Batch find & replace",
                  body: "Change colors, stroke widths, or class names across multiple elements at once.",
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
