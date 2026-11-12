import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { FileImage, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG to PNG Converter | Rasterize SVG Files | Vectroy",
  description:
    "Convert SVG to PNG at any resolution with transparent background support. Perfect for social media, previews, and print mockups.",
  alternates: { canonical: "/svg-to-png" },
  openGraph: {
    title: "SVG to PNG Converter — Rasterize Vector Files",
    description:
      "Turn SVG files into crisp PNGs at any resolution, with optional transparency.",
    type: "website",
    url: "/svg-to-png",
  },
};

const SIZES = [
  { label: "512 × 512", use: "Favicons, avatars" },
  { label: "1024 × 1024", use: "Social media posts" },
  { label: "2048 × 2048", use: "Presentations, hero art" },
  { label: "4096 × 4096", use: "Large-format print" },
];

export default function SvgToPngPage() {
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
          <div className="mx-auto max-w-[680px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <FileImage className="h-3.5 w-3.5" />
              SVG to PNG
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Convert SVG to PNG
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Rasterize vector files into crisp PNGs at any resolution — with
              transparent backgrounds and exact dimensions.
            </p>
            <Link
              href="/convert?format=png&source=svg-to-png"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert SVG to PNG <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Output sizes */}
          <div className="mt-16 mx-auto max-w-[820px]">
            <h2 className="mb-8 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              Export sizes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SIZES.map((s) => (
                <div
                  key={s.label}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 text-center shadow-[var(--shadow-1)]"
                >
                  <p className="text-[18px] font-bold">{s.label}</p>
                  <p className="mt-1 text-[13px] text-text-tertiary">{s.use}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why */}
          <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-[clamp(24px,3vw,32px)] font-semibold">
                Why rasterize an SVG?
              </h2>
              <p className="mt-3 text-text-secondary">
                SVG is the better format for almost every use. But some places
                only accept raster images, and some workflows need a fixed
                pixel size they can paste straight in.
              </p>
            </div>
            <ul className="grid gap-3">
              {[
                "Platforms that reject SVG uploads",
                "Email signatures and HTML email blocks",
                "Sticker marketplaces that want PNG previews",
                "Social posts at platform-specific pixel sizes",
                "Quick mockups without opening a design tool",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14.5px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              Three steps
            </h2>
            <div className="mx-auto grid max-w-[800px] gap-6 md:grid-cols-3">
              {[
                { title: "Upload your SVG", body: "Drop in a single file or a batch of them." },
                { title: "Pick the size", body: "Choose a preset or set exact pixel dimensions." },
                { title: "Download the PNG", body: "Save with or without a transparent background." },
              ].map((s, i) => (
                <div key={s.title} className="text-center">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-[16px] font-bold text-white">
                    {i + 1}
                  </span>
                  <h3 className="mt-3 text-[16px] font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[14px] text-text-secondary">{s.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Rasterize your first SVG
            </h2>
            <p className="mt-3 text-text-secondary">
              No install, no account needed to try it.
            </p>
            <Link
              href="/convert?format=png&source=svg-to-png"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Convert now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
