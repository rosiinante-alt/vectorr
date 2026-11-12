import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { ShoppingBag, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Etsy SVG Optimizer | Compress & Prep SVG Files for Etsy | Vectroy",
  description:
    "Optimize and compress SVG files for Etsy digital downloads. Reduce file size, clean paths, and ensure compatibility with Cricut Design Space and Silhouette Studio.",
  alternates: { canonical: "/etsy-svg-optimizer" },
  openGraph: {
    title: "Etsy SVG Optimizer — Prep SVG Files for Digital Download Listings",
    description:
      "Clean, compress, and validate SVG files before uploading to Etsy. Passes Cricut and Silhouette Studio import tests.",
    type: "website",
    url: "/etsy-svg-optimizer",
  },
};

const CHECKLIST = [
  "Removes invisible elements and empty groups",
  "Collapses redundant transforms",
  "Strips editor metadata (Illustrator, Inkscape, Affinity)",
  "Validates for Cricut Design Space import",
  "Validates for Silhouette Studio import",
  "Closes open paths that cause cut issues",
  "Reports path count and node density",
  "Packages ZIP with SVG, PNG, and PDF",
];

const STEPS = [
  {
    step: "1",
    title: "Upload your SVG",
    body: "Drag in a single file or select from your computer. Up to 50 files at once on a Pro plan.",
  },
  {
    step: "2",
    title: "Vectroy optimizes it",
    body: "Paths are simplified, metadata stripped, and compatibility checked automatically.",
  },
  {
    step: "3",
    title: "Download listing package",
    body: "Get a ZIP with an optimized SVG, a preview PNG, and a PDF — everything buyers expect.",
  },
];

export default function EtsySvgOptimizerPage() {
  return (
    <div className="flex min-h-svh flex-col">
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

      <main id="main" className="flex-1 py-12 sm:py-16 lg:py-20">
        <div className="wrap">
          {/* Hero */}
          <div className="mx-auto max-w-[700px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <ShoppingBag className="h-3.5 w-3.5" />
              Etsy sellers
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Optimize SVG files for Etsy digital downloads
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Compress, clean, and validate your SVG designs before listing. Fewer
              buyer complaints. Better reviews. More sales.
            </p>
            <Link
              href="/svg-optimizer?source=etsy"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Optimize my SVG <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Problem/solution */}
          <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="rounded-[var(--radius-xl)] border border-red-200/40 bg-red-50/10 p-7">
              <h2 className="mb-4 text-[18px] font-semibold">Common buyer complaints</h2>
              <ul className="grid gap-2.5">
                {[
                  '"It won\'t import into Cricut Design Space"',
                  '"The cut lines are all wrong"',
                  '"The file is huge / takes forever"',
                  '"It opens blank in Silhouette"',
                  '"There are extra shapes I don\'t want"',
                ].map((item) => (
                  <li key={item} className="text-[14px] text-text-secondary">
                    ❌ {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-xl)] border border-green-200/40 bg-green-50/10 p-7">
              <h2 className="mb-4 text-[18px] font-semibold">After Vectroy optimization</h2>
              <ul className="grid gap-2.5">
                {[
                  "Imports cleanly into Cricut and Silhouette",
                  "Correct, closed cut paths every time",
                  "File size 60–90% smaller",
                  "No invisible garbage elements",
                  "ZIP includes SVG + PNG + PDF",
                ].map((item) => (
                  <li key={item} className="text-[14px] text-text-secondary">
                    ✓ {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Checklist */}
          <div className="mt-20 mx-auto max-w-[820px]">
            <h2 className="mb-8 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              What the optimizer does
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {CHECKLIST.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-[var(--radius-lg)] bg-bg-secondary px-4 py-3 text-[14px]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              How it works
            </h2>
            <div className="mx-auto grid max-w-[800px] gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.step} className="text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[16px] font-bold text-white">
                    {s.step}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Stop getting bad reviews about broken SVGs
            </h2>
            <p className="mt-3 text-text-secondary">
              Run every design through the optimizer before listing. 10 free credits to start.
            </p>
            <Link
              href="/svg-optimizer?source=etsy"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Optimize now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
