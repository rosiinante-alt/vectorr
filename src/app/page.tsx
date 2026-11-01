import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

const features = [
  {
    title: "Optimize",
    body: "SVGO's plugin chain, run in a fixed conservative order. Path precision, redundant groups, unused defs and dead attributes — trimmed without touching the curves you drew.",
    detail: "2 · 3 · 5 decimal precision",
    icon: (
      <>
        <path d="M4 20L12 4l8 16z" />
        <path d="M8.5 20L12 13l3.5 7" />
      </>
    ),
  },
  {
    title: "Attribute",
    body: "Every plugin is measured by removing it and re-running the file, so each byte saved is attributed to the pass that actually saved it. The remainder is reported honestly, never inflated.",
    detail: "Per-plugin byte deltas",
    icon: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 3.5v17M3.5 12h17" />
      </>
    ),
  },
  {
    title: "Export",
    body: "Download the optimized SVG with the report that produced it, so you can prove what changed before anything ships. PNG and PDF are on the roadmap, not in the product yet.",
    detail: "SVG today · PNG & PDF next",
    icon: (
      <>
        <path d="M12 3v12" />
        <path d="M7 10l5 5 5-5" />
        <path d="M4 19h16" />
      </>
    ),
  },
];

const breakdown = [
  { rule: "Path data precision", bytes: "641 KB", share: 62 },
  { rule: "Editor metadata", bytes: "207 KB", share: 20 },
  { rule: "Redundant groups", bytes: "114 KB", share: 11 },
  { rule: "Unused definitions", bytes: "72 KB", share: 7 },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1">
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
          <div className="wrap">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-bg-secondary py-1.5 pr-3.5 pl-1.5 text-[13.5px] font-medium text-text-secondary">
              <span className="rounded-full bg-text-primary px-2.5 py-0.5 text-[12px] font-semibold text-white">
                New
              </span>
              Per-plugin savings report — see where every byte went
            </p>

            <h1 className="display mx-auto max-w-[880px] text-[clamp(38px,6.4vw,74px)]">
              Your SVG is 2.4 MB.
              <br />
              <span className="text-accent">Find the 1 MB you can cut.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-[620px] text-[clamp(17px,1.9vw,20px)] leading-relaxed text-text-secondary">
              Vector-to-vector optimization that shows its work. Drop an SVG, read
              exactly where the bytes went, and download a smaller file that renders
              the same.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/dashboard" size="lg">
                Optimize your first file
              </ButtonLink>
              <ButtonLink href="/#how" size="lg" variant="secondary">
                See the report
              </ButtonLink>
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-[14px] font-medium text-text-tertiary">
              <li>No signup to preview</li>
              <li>No credit card</li>
              <li>Failed jobs are never charged</li>
            </ul>
          </div>
        </section>

        {/* ── Report preview ─────────────────────────────────── */}
        <section className="pb-20 sm:pb-28" aria-labelledby="report-preview">
          <div className="wrap">
            <div className="mx-auto max-w-[760px] overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-[0_0_0_0.5px_var(--border),0_2px_6px_rgba(0,0,0,0.05),0_18px_40px_-14px_rgba(0,0,0,0.16)]">
              <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] px-6 py-5 text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="report-preview"
                      className="text-[19px] font-semibold tracking-[-0.022em]"
                    >
                      Savings report
                    </h2>
                    <Badge tone="success">Optimized</Badge>
                  </div>
                  <p className="mt-1.5 text-[14.5px] text-text-secondary">
                    logo-lockup-final-v14.svg
                  </p>
                </div>
                <div className="text-right">
                  <p className="tabular font-mono text-[34px] leading-none font-bold tracking-[-0.03em] text-success-text">
                    −41.9%
                  </p>
                  <p className="tabular mt-1 font-mono text-[13px] text-text-tertiary">
                    1,034 KB saved
                  </p>
                </div>
              </div>

              <dl className="grid gap-x-10 px-6 py-4 text-left sm:grid-cols-2">
                {[
                  { label: "File size", before: "2,468 KB", after: "1,434 KB" },
                  { label: "Coordinate precision", before: "6 decimals", after: "3 decimals" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="border-t border-[var(--border)] py-3.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
                  >
                    <dt className="text-[13px] font-medium text-text-tertiary">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-baseline gap-2">
                      <span className="tabular font-mono text-[15px] text-text-secondary line-through decoration-[var(--border-strong)]">
                        {stat.before}
                      </span>
                      <span aria-hidden="true" className="text-text-tertiary">
                        →
                      </span>
                      <span className="tabular font-mono text-[17px] font-semibold">
                        {stat.after}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-[var(--border)] px-6 py-5 text-left">
                <h3 className="text-[14px] font-semibold text-text-secondary">
                  Where the bytes went
                </h3>
                <ul className="mt-3.5 grid gap-3">
                  {breakdown.map((entry) => (
                    <li key={entry.rule}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[14.5px]">{entry.rule}</span>
                        <span className="tabular font-mono text-[13.5px] text-text-secondary">
                          {entry.bytes}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${entry.share}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-4 max-w-[620px] text-center text-[14px] text-text-tertiary">
              Every figure is measured on your file. No other tool tells you where
              the bytes went.
            </p>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────── */}
        <section
          id="how"
          className="scroll-mt-20 bg-bg-secondary py-20 sm:py-28"
          aria-labelledby="how-heading"
        >
          <div className="wrap">
            <div className="max-w-[760px]">
              <h2
                id="how-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                Clean up the vectors you already have.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                Vectorr does not trace photos. Tracing is a solved, cheap,
                commoditized problem. The unsolved one is the 2.4 MB SVG sitting in
                your repo that makes Figma stutter — so that is what we fix.
              </p>
            </div>

            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <li
                  key={feature.title}
                  className="rounded-[var(--radius-xl)] bg-white p-7 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="grid h-9 w-9 place-items-center rounded-[var(--radius-md)] bg-accent-wash text-accent"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {feature.icon}
                      </svg>
                    </span>
                    <h3 className="text-[20px] font-semibold tracking-[-0.024em]">
                      <span className="visually-hidden">Step {index + 1}: </span>
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[15.5px] leading-relaxed text-text-secondary">
                    {feature.body}
                  </p>
                  <p className="tabular mt-5 border-t border-[var(--border)] pt-4 font-mono text-[12.5px] text-text-tertiary">
                    {feature.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Comparison ─────────────────────────────────────── */}
        <section className="py-20 sm:py-28" aria-labelledby="compare-heading">
          <div className="wrap">
            <div className="max-w-[760px]">
              <h2
                id="compare-heading"
                className="display text-[clamp(30px,4.4vw,50px)]"
              >
                Optimization, not tracing.
              </h2>
              <p className="mt-5 text-[clamp(17px,1.7vw,20px)] leading-relaxed text-text-secondary">
                Everyone else converts images. Nobody sells a readable report on the
                vector you already own.
              </p>
            </div>

            <div className="mt-12 overflow-x-auto rounded-[var(--radius-lg)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <caption className="visually-hidden">
                  Comparison of vector optimization tools
                </caption>
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      Tool
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-accent-wash px-4 py-3.5 text-[13.5px] font-semibold text-accent-ink whitespace-nowrap"
                    >
                      Vectorr
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      SVGO
                    </th>
                    <th
                      scope="col"
                      className="border-b border-[var(--border)] bg-bg-secondary px-4 py-3.5 text-[13.5px] font-semibold text-text-secondary whitespace-nowrap"
                    >
                      Figma export
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Vector → vector", a: "Yes", b: "Yes, CLI only", c: "No" },
                    { label: "Savings report", a: "Yes", b: "No", c: "No" },
                    { label: "Color audit", a: "Soon", b: "Partial", c: "No" },
                    { label: "Batch icon sets", a: "Soon", b: "Scripted", c: "No" },
                    { label: "Runs in a browser", a: "Yes", b: "No", c: "Yes" },
                    { label: "Measured before / after", a: "Yes", b: "No", c: "No" },
                  ].map((row) => (
                    <tr key={row.label}>
                      <th
                        scope="row"
                        className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] font-semibold text-text-primary"
                      >
                        {row.label}
                      </th>
                      <td className="border-b border-[var(--border)] bg-accent-wash/60 px-4 py-3.5 text-[15px] font-medium text-text-primary">
                        {row.a}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {row.b}
                      </td>
                      <td className="border-b border-[var(--border)] px-4 py-3.5 text-[15px] text-text-secondary">
                        {row.c}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Final CTA ──────────────────────────────────────── */}
        <section className="pb-24 sm:pb-32" aria-labelledby="cta-heading">
          <div className="wrap">
            <div className="rounded-[var(--radius-xl)] bg-bg-secondary px-6 py-14 text-center sm:px-10">
              <h2
                id="cta-heading"
                className="display mx-auto max-w-[620px] text-[clamp(30px,4.6vw,52px)]"
              >
                Find out what your SVG is really carrying.
              </h2>
              <p className="mx-auto mt-5 max-w-[480px] text-[17px] text-text-secondary">
                Three optimizations a month free. No signup to see the estimate.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/dashboard" size="lg">
                  Optimize a file
                </ButtonLink>
                <ButtonLink href="/pricing" size="lg" variant="secondary">
                  See pricing
                </ButtonLink>
              </div>
              <p className="mt-5 text-[13.5px] text-text-tertiary">
                Free for 3 files a month · No signup to preview ·{" "}
                <Link
                  href="/pricing"
                  className="text-accent-ink underline underline-offset-[3px]"
                >
                  See what Pro will add
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
