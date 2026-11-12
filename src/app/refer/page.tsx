import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { Gift, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Friend | Get 25 Free Credits | Vectroy",
  description:
    "Share Vectroy with a friend and both of you get 25 free credits when they sign up and run their first conversion.",
  alternates: { canonical: "/refer" },
  openGraph: {
    title: "Vectroy Referral Program — Give 25 Credits, Get 25 Credits",
    description:
      "Invite a friend to Vectroy. You both get 25 free credits when they complete their first conversion.",
    type: "website",
    url: "/refer",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Copy your link",
    body: "Find your personal referral link in your dashboard under Account → Referrals.",
  },
  {
    step: "2",
    title: "Share it",
    body: "Send it to anyone who works with images — designers, crafters, print shops, Etsy sellers.",
  },
  {
    step: "3",
    title: "Both earn credits",
    body: "When they sign up and complete their first conversion, you both get 25 credits instantly.",
  },
];

const FAQ = [
  {
    q: "Is there a limit on how many people I can refer?",
    a: "No limit. You earn 25 credits for every person you refer who completes a conversion.",
  },
  {
    q: "When do credits appear?",
    a: "Within minutes of your referral completing their first conversion. No waiting period.",
  },
  {
    q: "Do credits expire?",
    a: "Credits earned through referrals last 12 months from the date they were issued.",
  },
  {
    q: "Can I refer someone who already has an account?",
    a: "Only new signups count. The referral link must be used before the account is created.",
  },
];

export default function ReferPage() {
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
          <div className="mx-auto max-w-[620px] text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              <Gift className="h-3.5 w-3.5" />
              Referral program
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Give 25 credits. Get 25 credits.
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              Share Vectroy with a friend. When they sign up and run their first
              conversion, you both pocket 25 free credits.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Get my referral link <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* How it works */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              How it works
            </h2>
            <div className="mx-auto grid max-w-[800px] gap-6 md:grid-cols-3">
              {HOW_IT_WORKS.map((s) => (
                <div
                  key={s.step}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6 text-center shadow-[var(--shadow-1)]"
                >
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

          {/* FAQ */}
          <div className="mx-auto mt-20 max-w-[720px]">
            <h2 className="mb-8 text-center text-[clamp(22px,3vw,28px)] font-semibold">
              Common questions
            </h2>
            <div className="grid gap-4">
              {FAQ.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-[15px] font-medium">
                    {item.q}
                    <Check className="h-4 w-4 shrink-0 text-accent opacity-0 group-open:opacity-100" />
                  </summary>
                  <p className="border-t border-[var(--border)] px-5 pb-5 pt-4 text-[14.5px] leading-relaxed text-text-secondary">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Start referring today
            </h2>
            <p className="mt-3 text-text-secondary">
              Log in to find your unique referral link.
            </p>
            <Link
              href="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Go to dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
