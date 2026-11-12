import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { AuthSlot } from "@/components/auth-slot";

export const metadata: Metadata = {
  title: "Vectroy API — Vectorization API Docs | Vectroy",
  description:
    "Integrate Vectroy vectorization into your app. REST API for PNG/JPG to SVG conversion, background removal, upscaling, and batch jobs.",
  alternates: { canonical: "/api" },
  openGraph: {
    title: "Vectroy API — Vectorization API Docs",
    description: "REST API for automated vectorization, background removal, and upscaling.",
    type: "website",
    url: "/api",
  },
};

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/convert",
    title: "Vectorize an image",
    body: "Upload a PNG, JPG, or WEBP and get back an SVG. Supports removeBg and upscale options in the same call.",
    auth: "Session or Bearer token",
  },
  {
    method: "POST",
    path: "/api/batch/create",
    title: "Create a batch job",
    body: "Queue many files at once. Returns a job id you poll for progress and per-file result URLs.",
    auth: "Session or Bearer token",
  },
  {
    method: "GET",
    path: "/api/jobs/[id]",
    title: "Poll job status",
    body: "Returns state, progress, and the converted file URL at returnvalue.convertedFileUrl once complete.",
    auth: "Session or Bearer token",
  },
  {
    method: "GET",
    path: "/api/credits",
    title: "Check credit balance",
    body: "Current remaining credits for the authenticated account, plus the cost table for each operation.",
    auth: "Session or Bearer token",
  },
];

const CODE_EXAMPLE = `curl -X POST https://vectroy.com/api/convert \\
  -H "Authorization: Bearer $VECTROY_API_KEY" \\
  -F "file=@logo.png" \\
  -F "removeBg=true" \\
  -F "upscale=2x"

# → { "jobId": "job_...", "state": "queued" }

curl https://vectroy.com/api/jobs/job_...

# → {
#      "state": "completed",
#      "progress": 100,
#      "returnvalue": { "convertedFileUrl": "https://.../result.svg" }
#    }`;

const FEATURES = [
  {
    title: "One endpoint, every tool",
    body: "Vectorize, remove backgrounds, and upscale in a single request instead of chaining three services.",
  },
  {
    title: "Credit-cost transparent",
    body: "Every operation has a published credit cost. Check the balance before you start a job.",
  },
  {
    title: "Async by default",
    body: "Every conversion returns a job id. Poll it, or subscribe to webhooks for push notifications.",
  },
  {
    title: "Plain REST",
    body: "Multipart form uploads in, JSON out. Works with curl, fetch, axios, and anything that speaks HTTP.",
  },
];

export default function DeveloperPage() {
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
          <div className="mx-auto max-w-[760px] text-center mb-16">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5 text-[13px] font-medium text-accent">
              REST API
            </div>
            <h1 className="display mb-4 text-[clamp(32px,5vw,54px)] leading-tight">
              Vectorization as an API
            </h1>
            <p className="mb-8 text-[clamp(16px,1.8vw,18px)] text-text-secondary">
              One HTTP endpoint converts raster artwork into production-ready
              vectors. Perfect for storefronts, print servers, and automated
              pipelines.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
              >
                Get an API key
              </Link>
              <Link
                href="/convert"
                className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-border px-6 py-3 font-medium text-text-primary hover:border-accent transition-colors"
              >
                Try the web app
              </Link>
            </div>
          </div>

          {/* Code example */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-8">
              One request, done
            </h2>
            <pre className="overflow-x-auto rounded-[var(--radius-xl)] bg-bg-secondary p-6 text-sm font-mono text-text-secondary leading-relaxed">
              <code>{CODE_EXAMPLE}</code>
            </pre>
          </section>

          {/* Endpoints */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              Endpoints
            </h2>
            <div className="space-y-4">
              {ENDPOINTS.map((ep) => (
                <article
                  key={ep.path}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded font-mono ${
                        ep.method === "GET"
                          ? "bg-sky-500/10 text-sky-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm text-text-primary">
                      {ep.path}
                    </code>
                  </div>
                  <h3 className="font-semibold text-text-primary mb-1.5">
                    {ep.title}
                  </h3>
                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                    {ep.body}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Auth: {ep.auth}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-20">
            <h2 className="text-[clamp(22px,3vw,32px)] font-semibold text-text-primary text-center mb-10">
              Built for pipelines
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-[var(--radius-xl)] bg-bg-secondary p-6"
                >
                  <h3 className="font-semibold text-text-primary mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center">
            <h2 className="display text-[clamp(24px,3.5vw,36px)] mb-3">
              Need higher volume?
            </h2>
            <p className="text-text-secondary mb-6 max-w-[560px] mx-auto">
              Team Pro and Enterprise include advanced API access, custom
              integrations, and priority support.
            </p>
            <Link
              href="/pro"
              className="inline-flex items-center gap-2 rounded-[var(--radius-lg)] bg-accent px-6 py-3 font-medium text-bg-primary hover:opacity-90 transition-opacity"
            >
              See Pro pricing
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
