import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";
import { GraduationCap, ArrowRight, Check, BookOpen, Layers } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education Program | Free Vectorization for Students & Teachers | Vectroy",
  description:
    "Free and discounted Vectroy access for students, educators, and nonprofit makerspaces. Apply for the education program.",
  alternates: { canonical: "/education" },
  openGraph: {
    title: "Vectroy Education Program — Free for Students & Educators",
    description:
      "Students and educators get free or heavily discounted access to Vectroy for coursework, classroom projects, and research.",
    type: "website",
    url: "/education",
  },
};

const TIERS = [
  {
    name: "Student",
    price: "Free",
    note: "50 credits/month",
    perks: [
      "50 free credits every month",
      "All conversion formats",
      "Batch processing (up to 10 files)",
      "Priority support via email",
    ],
    eligible: "Enrolled at any accredited institution with a .edu email or student ID.",
  },
  {
    name: "Educator",
    price: "Free",
    note: "250 credits/month",
    perks: [
      "250 free credits every month",
      "Class workspace (up to 30 students)",
      "All Pro features",
      "Curriculum materials on request",
    ],
    eligible: "Teachers and professors at K–12 schools, colleges, and vocational programs.",
  },
  {
    name: "Makerspace",
    price: "50% off",
    note: "Any paid plan",
    perks: [
      "50% discount on any paid plan",
      "Multi-seat workspace",
      "API access",
      "Dedicated onboarding call",
    ],
    eligible: "Nonprofit makerspaces, libraries, and community fabrication labs.",
  },
];

const RESOURCES = [
  {
    icon: BookOpen,
    title: "Intro to vector graphics",
    description: "What vectors are, why they matter, and when to use them. Perfect for a first-week design class.",
    href: "/svg-vs-png",
  },
  {
    icon: Layers,
    title: "Raster vs. vector guide",
    description: "A visual comparison with real examples. Use in lectures or assign as pre-reading.",
    href: "/vector-vs-raster",
  },
  {
    icon: GraduationCap,
    title: "Maker workflow tutorials",
    description: "Step-by-step guides for laser cutting, vinyl cutting, and embroidery prep.",
    href: "/how-to",
  },
];

export default function EducationPage() {
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
              <GraduationCap className="h-3.5 w-3.5" />
              Education program
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,52px)] leading-tight">
              Free vectorization for students and educators
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              We believe every maker deserves professional tools. Students,
              teachers, and nonprofit makerspaces get free or deeply discounted
              access.
            </p>
            <Link
              href="mailto:education@vectroy.com"
              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Tiers */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-[var(--radius-xl)] border border-[var(--border)] bg-bg-secondary p-7"
              >
                <h2 className="text-[18px] font-bold">{tier.name}</h2>
                <p className="mt-1 text-[13px] text-text-tertiary">{tier.eligible}</p>
                <div className="my-4 border-t border-[var(--border)]" />
                <p className="text-[32px] font-bold">{tier.price}</p>
                <p className="text-[13px] text-text-tertiary">{tier.note}</p>
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

          {/* Free resources */}
          <div className="mt-20">
            <h2 className="mb-10 text-center text-[clamp(24px,3vw,32px)] font-semibold">
              Free teaching resources
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {RESOURCES.map((r) => (
                <Link
                  key={r.title}
                  href={r.href}
                  className="group rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-2)]"
                >
                  <r.icon className="mb-3 h-6 w-6 text-accent" />
                  <h3 className="text-[16px] font-semibold group-hover:underline">{r.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-text-secondary">
                    {r.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Apply */}
          <div className="mt-20 rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
            <h2 className="text-[clamp(22px,3vw,30px)] font-semibold">
              Apply for the education program
            </h2>
            <p className="mt-3 text-text-secondary">
              Email us from your institution address. We respond within 1 business day.
            </p>
            <Link
              href="mailto:education@vectroy.com"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-6 py-3 text-[15px] font-medium text-white hover:bg-accent/90"
            >
              Email education@vectroy.com <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
