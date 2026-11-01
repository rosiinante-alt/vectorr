"use client";

import { Badge } from "@/components/ui/badge";
import type { OptimizationReport } from "@/lib/api";
import { formatBytes, formatCount, percentSaved } from "@/lib/ui";

export interface SavingsReportProps {
  report: OptimizationReport;
  /** True when the figures are a local estimate, not a completed optimization. */
  estimated?: boolean;
}

function Stat({
  label,
  before,
  after,
  format,
}: {
  label: string;
  before: number | null;
  after: number | null;
  format: (value: number | null) => string;
}) {
  const improved =
    before !== null && after !== null && Number.isFinite(before) && Number.isFinite(after)
      ? after < before
      : null;

  return (
    <div className="border-t border-[var(--border)] py-3.5 first:border-t-0">
      <dt className="text-[13px] font-medium text-text-tertiary">{label}</dt>
      <dd className="mt-1 flex flex-wrap items-baseline gap-2">
        <span className="tabular font-mono text-[15px] text-text-secondary line-through decoration-[var(--border-strong)]">
          {format(before)}
        </span>
        <span aria-hidden="true" className="text-text-tertiary">
          →
        </span>
        <span className="tabular font-mono text-[17px] font-semibold text-text-primary">
          {format(after)}
        </span>
        {improved === true && (
          <span className="visually-hidden">reduced from {format(before)}</span>
        )}
      </dd>
    </div>
  );
}

/**
 * The optimization report: the thing users screenshot.
 *
 * Figures are monospace and tabular so the before/after columns line up like a
 * benchmark scorecard rather than a toast. `estimated` switches the framing from
 * "this is your result" to "this is what we measured" so the two never blur.
 */
export function SavingsReport({ report, estimated = false }: SavingsReportProps) {
  const saved = report.original_bytes - report.optimized_bytes;
  const percent = percentSaved(report.original_bytes, report.optimized_bytes);

  const breakdown = report.breakdown
    .filter((entry) => entry.saved_bytes > 0)
    .sort((a, b) => b.saved_bytes - a.saved_bytes);

  const breakdownTotal = breakdown.reduce((sum, entry) => sum + entry.saved_bytes, 0);

  return (
    <section
      aria-labelledby="report-heading"
      className="overflow-hidden rounded-[var(--radius-xl)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--border)] px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="report-heading" className="text-[19px] font-semibold tracking-[-0.022em]">
              {estimated ? "Estimated savings" : "Savings report"}
            </h2>
            <Badge tone={estimated ? "warning" : "success"}>
              {estimated ? "Estimate" : "Optimized"}
            </Badge>
          </div>
          <p className="mt-1.5 text-[14.5px] text-text-secondary">
            {estimated
              ? "Measured in your browser from the file you dropped. Sign in to run the real optimization."
              : "Measured on the server. Every figure below is from this file."}
          </p>
        </div>

        <div className="text-right">
          <p className="tabular font-mono text-[34px] font-bold leading-none tracking-[-0.03em] text-success-text">
            −{percent}%
          </p>
          <p className="tabular mt-1 font-mono text-[13px] text-text-tertiary">
            {formatBytes(saved)} saved
          </p>
        </div>
      </div>

      <div className="grid gap-x-10 px-6 py-2 sm:grid-cols-2">
        <dl>
          <Stat
            label="File size"
            before={report.original_bytes}
            after={report.optimized_bytes}
            format={formatBytes}
          />
          <Stat
            label="Nodes"
            before={report.nodes_before}
            after={report.nodes_after}
            format={formatCount}
          />
        </dl>
        <dl>
          <Stat
            label="Paths"
            before={report.paths_before}
            after={report.paths_after}
            format={formatCount}
          />
          <Stat
            label="Distinct colors"
            before={report.colors_before}
            after={report.colors_after}
            format={formatCount}
          />
        </dl>
      </div>

      {breakdown.length > 0 && (
        <div className="border-t border-[var(--border)] px-6 py-5">
          <h3 className="text-[14px] font-semibold text-text-secondary">
            Where the bytes went
          </h3>
          <ul className="mt-3.5 grid gap-3">
            {breakdown.map((entry) => {
              const share = breakdownTotal > 0 ? (entry.saved_bytes / breakdownTotal) * 100 : 0;
              return (
                <li key={entry.rule}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[14.5px] text-text-primary">{entry.rule}</span>
                    <span className="tabular font-mono text-[13.5px] text-text-secondary">
                      {formatBytes(entry.saved_bytes)}
                    </span>
                  </div>
                  <div
                    className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bg-tertiary"
                    role="img"
                    aria-label={`${entry.rule}: ${Math.round(share)} percent of savings`}
                  >
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${Math.max(2, share)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
