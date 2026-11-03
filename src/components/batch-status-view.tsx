"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BatchStatus, BatchStatusResponse } from "@/lib/batch/types";
import { cn, formatCount } from "@/lib/ui";

const POLL_INTERVAL_MS = 2000;
const TERMINAL: readonly BatchStatus[] = ["complete", "failed", "partial"];

const statusTone: Record<BatchStatus, "neutral" | "accent" | "success" | "error" | "warning"> = {
  pending: "neutral",
  processing: "accent",
  complete: "success",
  partial: "warning",
  failed: "error",
};

const fileTone: Record<string, "neutral" | "accent" | "success" | "error"> = {
  pending: "neutral",
  processing: "accent",
  complete: "success",
  failed: "error",
};

export function BatchStatusView({ batchId }: { batchId: string }) {
  const [batch, setBatch] = useState<BatchStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = useRef(false);

  const fetchBatch = useCallback(async () => {
    try {
      const response = await fetch(`/api/batch/${batchId}`, { cache: "no-store" });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Could not load this batch.");
      }
      const next = (await response.json()) as BatchStatusResponse;
      done.current = TERMINAL.includes(next.status);
      setBatch(next);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load this batch.");
    } finally {
      setLoading(false);
    }
  }, [batchId]);

  useEffect(() => {
    let cancelled = false;

    // A self-rescheduling timeout rather than setInterval: a slow response can
    // never stack requests, and polling stops as soon as the batch finishes.
    const poll = async () => {
      await fetchBatch();
      if (cancelled || done.current) return;
      timer.current = setTimeout(poll, POLL_INTERVAL_MS);
    };

    void poll();

    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [fetchBatch]);

  if (loading) {
    return (
      <Card className="p-6">
        <p className="text-[15px] text-text-secondary" role="status">
          Loading batch…
        </p>
      </Card>
    );
  }

  if (!batch) {
    return (
      <Card className="p-6">
        <p className="text-[15px] text-error" role="alert">
          {error ?? "Batch not found."}
        </p>
      </Card>
    );
  }

  const done = TERMINAL.includes(batch.status);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle as="h1">Batch {batch.id.slice(0, 8)}</CardTitle>
            <Badge tone={statusTone[batch.status]}>{batch.status.toUpperCase()}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Total files" value={formatCount(batch.totalFiles)} />
            <Metric label="Converted" value={formatCount(batch.completedFiles)} />
            <Metric label="Failed" value={formatCount(batch.failedFiles)} />
            <Metric label="Format" value={batch.outputFormat.toUpperCase()} />
          </dl>

          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-[13.5px] text-text-secondary">
              <span>Progress</span>
              <span>{batch.progress}%</span>
            </div>
            <div
              className="h-2 w-full overflow-hidden rounded-full bg-bg-tertiary"
              role="progressbar"
              aria-valuenow={batch.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  batch.status === "failed" ? "bg-error" : "bg-accent",
                )}
                style={{ width: `${batch.progress}%` }}
              />
            </div>
            {!done && (
              <p className="mt-2 text-[13.5px] text-text-tertiary" role="status" aria-live="polite">
                Converting files one at a time — this page updates automatically.
              </p>
            )}
          </div>

          {error && (
            <p className="mt-4 text-[13.5px] text-warning" role="alert">
              {error} Retrying…
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle as="h2">Files</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {batch.files.map((file, index) => (
              <li
                key={file.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] bg-bg-secondary px-3 py-2.5"
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="text-[13px] text-text-tertiary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[14.5px]">{sourceName(file.resultUrl, file.id)}</span>
                </span>

                <span className="flex items-center gap-3">
                  {file.errorMessage && (
                    <span className="max-w-[16rem] truncate text-[13px] text-error" title={file.errorMessage}>
                      {file.errorMessage}
                    </span>
                  )}
                  <Badge tone={fileTone[file.status] ?? "neutral"}>{file.status}</Badge>
                  {file.status === "complete" && file.resultUrl && (
                    <a
                      href={file.resultUrl}
                      download
                      className="text-[13.5px] font-semibold text-accent hover:underline"
                    >
                      Download
                    </a>
                  )}
                </span>
              </li>
            ))}
          </ul>
          {batch.files.length === 0 && (
            <p className="text-[14.5px] text-text-tertiary">No files recorded for this batch.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[13.5px] text-text-secondary">{label}</dt>
      <dd className="mt-0.5 text-[22px] font-semibold tracking-[-0.02em]">{value}</dd>
    </div>
  );
}

/** Derives a readable name from a result key, e.g. `.../results/<uuid>.svg`. */
function sourceName(resultUrl: string | null, id: string): string {
  const path = resultUrl?.split("?")[0] ?? "";
  const decoded = decodeURIComponent(path.split("/").pop() ?? "");
  return decoded && decoded.includes(".") ? decoded : id.slice(0, 8);
}