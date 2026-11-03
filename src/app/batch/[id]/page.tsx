import type { Metadata } from "next";

import { BatchStatusView } from "@/components/batch-status-view";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Batch progress — Vectorr",
  description: "Track a batch conversion and download the resulting vectors.",
  robots: { index: false, follow: false },
};

export default async function BatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main" className="flex-1 py-10 sm:py-14">
        <div className="wrap max-w-[820px]">
          <BatchStatusView batchId={id} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}