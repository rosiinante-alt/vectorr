import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Newspaper, Download, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Kit | Vectroy Media Resources",
  description:
    "Press kit, logos, screenshots, and company information for journalists and content creators covering Vectroy.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "Vectroy Press Kit",
    description:
      "Logos, screenshots, company facts, and press contacts for media coverage.",
    type: "website",
    url: "/press",
  },
};

const COMPANY_FACTS = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "Remote" },
  { label: "Mission", value: "Make professional vectorization accessible to every maker" },
  { label: "Users", value: "30,000+" },
  { label: "Files processed", value: "2 million+" },
  { label: "Integrations", value: "Shopify, WooCommerce, Zapier, Make" },
];

const COVERAGE = [
  {
    outlet: "Product Hunt",
    headline: "#1 Product of the Day — AI Vectorization",
    year: "2024",
  },
  {
    outlet: "Hacker News",
    headline: "Show HN: I built a vectorizer that generates a readable diff",
    year: "2024",
  },
  {
    outlet: "Etsy Sellers Community",
    headline: "Best new tool for SVG prep in 2025",
    year: "2025",
  },
];

export default function PressPage() {
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
          <div className="mx-auto max-w-[640px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Newspaper className="h-3.5 w-3.5" />
              Press & media
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Press kit
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Logos, screenshots, company facts, and contact info for journalists
              and content creators.
            </p>
            <Link
              href="mailto:press@vectroy.com"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Media enquiries <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Company facts */}
          <div className="mt-16 mx-auto max-w-[720px]">
            <h2 className="mb-6 text-[clamp(22px,3vw,28px)] font-semibold">Company facts</h2>
            <dl className="grid gap-3">
              {COMPANY_FACTS.map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col gap-0.5 rounded-[var(--radius-lg)] bg-bg-secondary px-5 py-3.5 sm:flex-row sm:items-center sm:gap-4"
                >
                  <dt className="min-w-[160px] text-[13px] font-semibold text-text-tertiary">
                    {f.label}
                  </dt>
                  <dd className="text-[14.5px]">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Logo downloads */}
          <div className="mt-16 mx-auto max-w-[720px]">
            <h2 className="mb-6 text-[clamp(22px,3vw,28px)] font-semibold">Logos</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Logo — light background (SVG)", file: "vectroy-logo-dark.svg" },
                { label: "Logo — dark background (SVG)", file: "vectroy-logo-light.svg" },
                { label: "Icon mark (PNG 512px)", file: "vectroy-icon-512.png" },
                { label: "Full press kit (ZIP)", file: "vectroy-press-kit.zip" },
              ].map((asset) => (
                <div
                  key={asset.file}
                  className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-bg-secondary px-5 py-4"
                >
                  <span className="text-[14px]">{asset.label}</span>
                  <Link
                    href={`/press/${asset.file}`}
                    className="flex items-center gap-1.5 text-[13px] font-medium text-accent hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[13px] text-text-tertiary">
              Please do not modify the logo or use it in a way that implies endorsement without prior written permission.
            </p>
          </div>

          {/* Coverage */}
          <div className="mt-16 mx-auto max-w-[720px]">
            <h2 className="mb-6 text-[clamp(22px,3vw,28px)] font-semibold">Coverage</h2>
            <div className="grid gap-4">
              {COVERAGE.map((c) => (
                <div
                  key={c.headline}
                  className="rounded-[var(--radius-lg)] bg-bg-secondary px-5 py-4"
                >
                  <p className="text-[13px] font-semibold text-accent">{c.outlet} · {c.year}</p>
                  <p className="mt-0.5 text-[14.5px]">{c.headline}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="mt-16 mx-auto max-w-[720px] rounded-[var(--radius-xl)] bg-bg-secondary p-8 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[20px] font-semibold">Press contact</h2>
            <p className="mt-2 text-text-secondary">
              For interviews, review access, or additional assets:
            </p>
            <Link
              href="mailto:press@vectroy.com"
              className="mt-4 inline-block text-[15px] font-medium text-accent hover:underline"
            >
              press@vectroy.com
            </Link>
            <p className="mt-1 text-[13px] text-text-tertiary">
              We respond to media enquiries within 24 hours.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
