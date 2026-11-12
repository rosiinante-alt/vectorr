import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Handshake, Globe, Zap, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners | Integrations & Reseller Partnerships | Vectroy",
  description:
    "Build with Vectroy. Technology integrations, platform partnerships, and white-label programs for print-on-demand, e-commerce, and design platforms.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Vectroy Partner Program",
    description:
      "Technology integrations and strategic partnerships for platforms, marketplaces, and software companies.",
    type: "website",
    url: "/partners",
  },
};

const PARTNERSHIP_TYPES = [
  {
    icon: Globe,
    title: "Platform integration",
    body: "Embed Vectroy vectorization directly into your design tool, e-commerce platform, or print-on-demand service. We provide a documented REST API and webhook support.",
    cta: "See API docs",
    href: "/api",
  },
  {
    icon: Zap,
    title: "White-label",
    body: "Run Vectroy infrastructure under your own brand. Custom domain, your logo, your pricing. Full feature parity with our hosted product.",
    cta: "Talk to us",
    href: "/done-for-you",
  },
  {
    icon: Handshake,
    title: "Reseller",
    body: "Bundle Vectroy credits with your existing SaaS or service offering. Volume pricing and a dedicated partner dashboard.",
    cta: "Apply",
    href: "/login?next=dashboard",
  },
];

const INTEGRATION_FEATURES = [
  "REST API with webhook callbacks",
  "Batch processing up to 500 files",
  "Per-format output control (SVG, PDF, EPS, PNG)",
  "Transparent background + upscale pipeline",
  "Sandbox environment for staging",
  "SLA-backed response times for enterprise",
  "SDK in JavaScript, Python, PHP",
  "Dedicated integration engineer for Enterprise tier",
];

const CURRENT_PARTNERS = [
  "Printify compatible",
  "Printful compatible",
  "Shopify App",
  "WooCommerce plugin",
  "Zapier integration",
  "Make (Integromat) module",
];

export default function PartnersPage() {
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
              <Handshake className="h-3.5 w-3.5" />
              Partnerships
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Build with Vectroy
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              We partner with platforms, marketplaces, and software companies to
              bring automated vectorization where creators already work.
            </p>
            <Link
              href="mailto:partners@vectroy.com"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Start a conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Partnership types */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {PARTNERSHIP_TYPES.map((pt) => (
              <div
                key={pt.title}
                className="rounded-[var(--radius-xl)] bg-bg-secondary p-7 shadow-[var(--shadow-1)]"
              >
                <pt.icon className="mb-4 h-7 w-7 text-accent" />
                <h2 className="text-[18px] font-semibold">{pt.title}</h2>
                <p className="mt-2 text-[14.5px] leading-relaxed text-text-secondary">
                  {pt.body}
                </p>
                <Link
                  href={pt.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-accent hover:underline"
                >
                  {pt.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Integration capabilities */}
          <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 className="text-[clamp(24px,3vw,32px)] font-semibold">
                What you get with the API
              </h2>
              <p className="mt-3 text-text-secondary">
                Every partnership includes full API access with the same feature
                set our direct customers use.
              </p>
              <ul className="mt-6 grid gap-2.5">
                {INTEGRATION_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[14.5px]">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-7 shadow-[var(--shadow-1)]">
              <h3 className="text-[17px] font-semibold">Current integrations</h3>
              <ul className="mt-4 grid gap-2">
                {CURRENT_PARTNERS.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-[14px] text-text-secondary"
                  >
                    <Check className="h-4 w-4 text-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-[var(--radius-md)] bg-bg-tertiary p-4">
                <p className="text-[13.5px] text-text-secondary">
                  Your platform not listed? We build new integrations for active
                  partners on a 4–6 week timeline.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Ready to partner?
            </h2>
            <p className="mt-3 text-text-secondary">
              Tell us about your platform and we&apos;ll get back within two business days.
            </p>
            <Link
              href="mailto:partners@vectroy.com"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Email partners@vectroy.com <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
