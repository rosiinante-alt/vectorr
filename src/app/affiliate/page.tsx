import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { DollarSign, Users, TrendingUp, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program | Earn 30% Recurring | Vectroy",
  description:
    "Earn 30% recurring commission on every Vectroy subscription you refer. Perfect for makers, designers, and content creators.",
  alternates: { canonical: "/affiliate" },
  openGraph: {
    title: "Vectroy Affiliate Program — 30% Recurring Commission",
    description:
      "Refer customers to Vectroy and earn 30% recurring commission every month they stay.",
    type: "website",
    url: "/affiliate",
  },
};

const TIERS = [
  {
    name: "Starter",
    threshold: "1–10 referrals",
    commission: "30%",
    payout: "Monthly",
    perks: ["Custom link", "Real-time dashboard", "30-day cookie"],
  },
  {
    name: "Pro",
    threshold: "11–50 referrals",
    commission: "35%",
    payout: "Monthly",
    perks: ["Everything in Starter", "Co-marketing opportunities", "Dedicated contact"],
  },
  {
    name: "Partner",
    threshold: "50+ referrals",
    commission: "40%",
    payout: "Monthly",
    perks: [
      "Everything in Pro",
      "Custom landing page",
      "Early feature access",
      "Revenue share on enterprise deals",
    ],
  },
];

const STEPS = [
  {
    step: "1",
    title: "Apply",
    body: "Fill out a short form. We approve most applications within 24 hours.",
  },
  {
    step: "2",
    title: "Share your link",
    body: "Post it on your blog, YouTube, newsletter, or Etsy store banner.",
  },
  {
    step: "3",
    title: "Earn commissions",
    body: "Get paid every month for every active subscriber you referred.",
  },
];

export default function AffiliatePage() {
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
              <DollarSign className="h-3.5 w-3.5" />
              Affiliate program
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Earn 30% recurring commission
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Refer your audience to Vectroy and collect a commission every month
              they stay subscribed. No cap, no expiry.
            </p>
            <Link
              href="/login?next=dashboard"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {[
              { icon: DollarSign, label: "Commission", value: "30–40%" },
              { icon: Users, label: "Cookie window", value: "30 days" },
              { icon: TrendingUp, label: "Payout", value: "Monthly" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 text-center shadow-[var(--shadow-1)]"
              >
                <Icon className="mx-auto mb-3 h-6 w-6 text-accent" />
                <p className="text-[28px] font-bold">{value}</p>
                <p className="text-[14px] text-text-tertiary">{label}</p>
              </div>
            ))}
          </div>

          {/* How it works */}
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

          {/* Tiers */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              Commission tiers
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary p-7"
                >
                  <h3 className="text-[18px] font-bold">{tier.name}</h3>
                  <p className="mt-0.5 text-[13px] text-text-tertiary">{tier.threshold}</p>
                  <p className="mt-4 text-[36px] font-bold text-accent">{tier.commission}</p>
                  <p className="text-[13px] text-text-tertiary">recurring · {tier.payout}</p>
                  <ul className="mt-5 grid gap-2">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-[14px] text-text-secondary">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Ready to earn?
            </h2>
            <p className="mt-3 text-text-secondary">
              Most affiliates earn $200–$800 per month within the first 90 days.
            </p>
            <Link
              href="/login?next=dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
