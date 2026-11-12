import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Star, ArrowRight, Quote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews & Case Studies | Vectroy",
  description:
    "Real testimonials and case studies from Etsy sellers, print shops, and agencies using Vectroy for automated vectorization.",
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: "Vectroy Reviews — From Etsy Sellers, Print Shops & Agencies",
    description:
      "See how Vectroy saves hours every week for makers, shops, and studios.",
    type: "website",
    url: "/reviews",
  },
};

const TESTIMONIALS = [
  {
    name: "Morgan L.",
    role: "Etsy Seller",
    shop: "CraftedByMorgan",
    stars: 5,
    quote:
      "I used to spend 20 minutes tracing each design manually. With Vectroy I do 50 listings in an afternoon. The SVG quality is better than what I was getting from Illustrator live trace.",
    stat: "50 listings/afternoon",
  },
  {
    name: "Jake R.",
    role: "Owner",
    shop: "Ridgeline Print Co.",
    stars: 5,
    quote:
      "Our screen printers were rejecting half the customer files we got. Now we run everything through batch convert and 95% pass on the first try. Saved us at least $400 a month in rework.",
    stat: "$400/mo saved",
  },
  {
    name: "Priya S.",
    role: "Brand Designer",
    shop: "Soma Studio",
    stars: 5,
    quote:
      "Client logo cleanup used to eat my Fridays. I drop 30 files in, grab a coffee, and they're all done. The path count is legitimately better than what I'd hand-trace.",
    stat: "30 logos in one coffee break",
  },
  {
    name: "Chris W.",
    role: "Laser Cutter",
    shop: "WorkshopWithChris",
    stars: 5,
    quote:
      "Glowforge-ready files every time. No stray nodes, no open paths. I stopped manually cleaning paths six months ago and the cut quality actually went up.",
    stat: "Zero failed cuts",
  },
  {
    name: "Ana T.",
    role: "DTF Printer",
    shop: "ThreadHaus Apparel",
    stars: 5,
    quote:
      "Background removal + vectorize in one step. The API integration took two hours and now we process 200 orders a day without touching a single file manually.",
    stat: "200 orders/day automated",
  },
  {
    name: "Ben K.",
    role: "Creative Director",
    shop: "Kilo Creative",
    stars: 5,
    quote:
      "We onboarded three clients with large logo archives — a few thousand files each. Vectroy chewed through them overnight. That's work that would have been weeks.",
    stat: "3 archives, 1 night",
  },
];

const CASE_STUDIES = [
  {
    title: "How Ridgeline Print Co. cut rework costs by 60%",
    category: "Print Shop",
    result: "60% less rework",
    summary:
      "Ridgeline was manually cleaning customer-submitted art before every screen-print job. After integrating Vectroy's batch API into their order intake flow, file rejection dropped from 50% to under 5%.",
    steps: [
      "Connected Vectroy API to their Shopify order form",
      "Auto-convert and validate on submission",
      "Flag-only files that still need attention",
    ],
  },
  {
    title: "ThreadHaus scales to 200 DTF orders/day without hiring",
    category: "DTF Apparel",
    result: "200 orders/day",
    summary:
      "ThreadHaus was printing 40 DTF transfers a day and needed to scale without adding headcount. Vectroy's remove-background + vectorize pipeline meant zero manual art prep.",
    steps: [
      "Webhook on order confirmation triggers Vectroy batch",
      "Background removed and file vectorized in parallel",
      "Print-ready file returned to their RIP software automatically",
    ],
  },
  {
    title: "CraftedByMorgan triples Etsy listing volume in a month",
    category: "Etsy / POD",
    result: "3× listing volume",
    summary:
      "Morgan was limited by how many designs she could prep per week. Switching from manual Illustrator tracing to Vectroy freed up 15 hours a week — enough to triple her listing pace.",
    steps: [
      "Sketch or commission art",
      "Drop into Vectroy batch",
      "Upload SVG and PNG exports directly to Etsy listing",
    ],
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
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
              <Star className="h-3.5 w-3.5 fill-accent" />
              Trusted by makers, shops & studios
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Real results from real users
            </h1>
            <p className="text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Etsy sellers, screen printers, laser cutters, and agencies share what
              changed after switching to Vectroy.
            </p>
          </div>

          {/* Testimonials */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <Stars count={t.stars} />
                  <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-[12px] font-semibold text-accent">
                    {t.stat}
                  </span>
                </div>
                <Quote className="mb-3 h-5 w-5 text-text-tertiary" />
                <p className="mb-4 text-[14.5px] leading-relaxed text-text-secondary">
                  {t.quote}
                </p>
                <div>
                  <p className="text-[14px] font-semibold">{t.name}</p>
                  <p className="text-[13px] text-text-tertiary">
                    {t.role} · {t.shop}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Case Studies */}
          <div className="mt-24">
            <h2 className="mb-2 text-center text-[clamp(24px,3vw,36px)] font-semibold">
              Case studies
            </h2>
            <p className="mb-12 text-center text-text-secondary">
              A closer look at how teams integrated Vectroy into real workflows.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              {CASE_STUDIES.map((cs) => (
                <div
                  key={cs.title}
                  className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary p-7"
                >
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[12px] text-text-tertiary">
                    {cs.category}
                  </span>
                  <h3 className="mt-3 text-[17px] font-semibold leading-snug">
                    {cs.title}
                  </h3>
                  <p className="mt-1 text-[13px] font-semibold text-accent">
                    Result: {cs.result}
                  </p>
                  <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                    {cs.summary}
                  </p>
                  <ol className="mt-4 grid gap-1.5">
                    {cs.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-[13.5px] text-text-secondary">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(24px,3vw,32px)] font-semibold">
              Join thousands of makers and studios
            </h2>
            <p className="mt-3 text-text-secondary">
              Start with 10 free credits. No card required.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/convert"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
              >
                Try it free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pro"
                className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-6 py-3 text-[15px] font-medium hover:bg-bg-tertiary"
              >
                See Pro pricing
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
