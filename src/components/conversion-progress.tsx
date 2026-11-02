"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

interface ConversionProgressProps {
  jobId: string;
  pollInterval?: number;
}

type JobState = "waiting" | "active" | "completed" | "failed" | "delayed" | "unknown";

export function ConversionProgress({ jobId, pollInterval = 1000 }: ConversionProgressProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<JobState>("waiting");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const response = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`);
        if (!response.ok) throw new Error("Could not retrieve conversion status.");
        const result = await response.json();
        if (disposed) return;

        const state = result.state as JobState;
        setStatus(state);
        setProgress(Math.max(0, Math.min(100, Number(result.progress) || 0)));
        setError(state === "failed" ? result.failedReason || "Conversion failed." : null);

        const url = result.returnvalue?.convertedFileUrl;
        if (state === "completed" && typeof url === "string") setDownloadUrl(url);
        if (state !== "completed" && state !== "failed") timer = setTimeout(poll, pollInterval);
      } catch (cause) {
        if (!disposed) {
          setError(cause instanceof Error ? cause.message : "Could not retrieve conversion status.");
          timer = setTimeout(poll, pollInterval);
        }
      }
    };

    void poll();
    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, [jobId, pollInterval]);

  const finished = status === "completed" || status === "failed";
  const title = status === "completed" ? "Conversion complete" : status === "failed" ? "Conversion failed" : "Converting…";

  return (
    <Card className="p-5 sm:p-6" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold">{title}</h2>
        {status === "completed" ? <CheckCircle2 className="h-5 w-5 text-success-text" aria-hidden="true" /> : status === "failed" ? <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" /> : <LoaderCircle className="h-5 w-5 animate-spin text-accent" aria-hidden="true" />}
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-tertiary" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-2 text-right text-[13px] tabular text-text-secondary">{progress}%</p>
      {error && <p role="alert" className="mt-2 text-[14px] text-error">{error}</p>}
      {downloadUrl && <a href={downloadUrl} download className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover">Download result</a>}
      {!finished && !error && <span className="visually-hidden">Conversion is in progress</span>}
    </Card>
  );
}
