import { Suspense } from "react";
import type { Metadata } from "next";

import { BatchStatusView } from "@/components/batch-status-view";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Batch progress — Vectorr",
  description: "Track a batch conversion and download the resulting vectors.",
  robots: { index: false, follow: false },
};

/**
 * `params` is runtime data, so it must be read inside a Suspense boundary for
 * the route to prerender its shell instead of blocking on it.
 */
async function BatchContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BatchStatusView batchId={id} />;
}

export default function BatchPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 py-10 sm:py-14">
        <div className="wrap max-w-[820px]">
          <Suspense
            fallback={
              <div className="rounded-[var(--radius-xl)] border border-[var(--border)] p-6">
                <p className="text-[15px] text-text-secondary" role="status">
                  Loading batch…
                </p>
              </div>
            }
          >
            <BatchContent params={params} />
          </Suspense>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}