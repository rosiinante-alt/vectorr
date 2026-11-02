"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InfoIcon } from "lucide-react";

import { FileUpload, type SelectedFile } from "@/components/file-upload";
import { SavingsReport } from "@/components/savings-report";
import { VectorCanvas } from "@/components/vector-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ApiError,
  downloadExport,
  optimizeFile,
  uploadFile,
  type OptimizationReport,
} from "@/lib/api";
import type { SvgEstimate } from "@/lib/svg-estimate";

const PRESETS = [
  { id: "2", label: "2 decimals", hint: "Smaller output; review fine details" },
  { id: "3", label: "3 decimals", hint: "Default precision" },
  { id: "5", label: "5 decimals", hint: "Higher coordinate precision" },
] as const;

type Stage = "empty" | "preview" | "optimizing" | "done";

export interface WorkspaceProps {
  isSignedIn: boolean;
}

/**
 * The core flow: drop a file, preview it, optimize it, read the report, export.
 *
 * Signed out, this stops after the local estimate — nothing is uploaded and
 * nothing claims to have been optimized. Signed in, upload and optimization go
 * through the API and the report renders from the server's real figures.
 */
export function Workspace({ isSignedIn }: WorkspaceProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [uploadedId, setUploadedId] = useState<string | null>(null);
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [stage, setStage] = useState<Stage>("empty");
  const [preset, setPreset] = useState<string>("3");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const reset = () => {
    setSelected(null);
    setUploadedId(null);
    setReport(null);
    setStage("empty");
    setMessage(null);
    setError(null);
  };

  const handleSelect = (next: SelectedFile) => {
    setSelected(next);
    setUploadedId(null);
    setReport(null);
    setError(null);
    setStage("preview");
  };

  const runOptimize = async () => {
    if (!selected) return;
    setError(null);
    setMessage(null);

    try {
      setStage("optimizing");
      // Upload first; the optimizer operates on a stored file.
      let fileId = uploadedId;
      if (!fileId) {
        const record = await uploadFile(selected.file);
        fileId = record.id;
        setUploadedId(record.id);
      }

      setStage("optimizing");
      const result = await optimizeFile(fileId, Number(preset));
      setReport(result);
      setStage("done");
    } catch (err) {
      setStage("preview");
      if (err instanceof ApiError && err.status === 404) {
        setMessage(
          "This file is no longer available. Select it again to upload a new copy.",
        );
      } else if (err instanceof ApiError && err.isUnauthorized) {
        setError("Your session expired. Sign in again to optimize.");
      } else {
        setError(err instanceof Error ? err.message : "Optimization failed.");
      }
    }
  };

  const runExport = async () => {
    if (!report) return;
    setExporting(true);
    setError(null);
    try {
      const blob = await downloadExport(report.exportId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = selected?.file.name.replace(/\.svg$/i, "-optimized.svg") ?? "optimized.svg";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <section aria-labelledby="upload-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="upload-heading" className="text-[19px] font-semibold tracking-[-0.022em]">
            1. Choose a file
          </h2>
          {!isSignedIn && <Badge tone="warning">Signed out</Badge>}
        </div>

        <FileUpload
          isSignedIn={isSignedIn}
          onSelect={handleSelect}
          onUpload={async () => {
            /* Upload is folded into runOptimize so the file is only stored once. */
          }}
        />
      </section>

      {selected && (
        <section aria-labelledby="preset-heading">
          <div className="mb-3 flex items-center gap-2">
            <h2 id="preset-heading" className="text-[19px] font-semibold tracking-[-0.022em]">
              2. Choose coordinate precision
            </h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-5 w-5 items-center justify-center rounded-full text-text-tertiary hover:bg-bg-secondary hover:text-text-secondary transition-colors"
                    aria-label="Learn about coordinate precision"
                  >
                    <InfoIcon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[320px]">
                  <p className="mb-2 font-semibold">What does this control?</p>
                  <p className="mb-2 text-[13px] leading-relaxed">
                    SVG coordinates are rounded to this many decimal places.
                  </p>
                  <ul className="space-y-1.5 text-[13px]">
                    <li>
                      <strong>2 decimals:</strong> Smallest file (e.g., 10.25, 15.75) — good for icons
                    </li>
                    <li>
                      <strong>3 decimals:</strong> Balanced size + quality (e.g., 10.255, 15.752) — recommended
                    </li>
                    <li>
                      <strong>5 decimals:</strong> Highest precision (e.g., 10.25542, 15.75123) — for detailed illustrations
                    </li>
                  </ul>
                  <p className="mt-2 text-[12px] text-gray-300">
                    💡 Lower precision = smaller file, but may slightly simplify curves
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div
            role="radiogroup"
            aria-labelledby="preset-heading"
            className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PRESETS.map((option) => {
              const active = preset === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={stage === "optimizing"}
                  onClick={() => setPreset(option.id)}
                  className={
                    "rounded-[var(--radius-lg)] px-4 py-3.5 text-left transition-colors " +
                    (active
                      ? "bg-accent-wash shadow-[inset_0_0_0_1.5px_var(--accent)]"
                      : "bg-white shadow-[inset_0_0_0_1px_var(--border-strong)] hover:bg-bg-secondary")
                  }
                >
                  <span className="block text-[15.5px] font-semibold">{option.label}</span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-text-tertiary">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {selected && (
        <VectorCanvas
          svgText={selected.text}
          filename={selected.file.name}
          onExport={isSignedIn && report ? runExport : undefined}
          exportLabel={report ? "Download optimized SVG" : "Download SVG"}
          isExporting={exporting}
        />
      )}

      {error && (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] bg-error-wash px-4 py-3 text-[14.5px] text-error"
        >
          {error}
        </p>
      )}
      {message && (
        <p
          role="status"
          className="rounded-[var(--radius-md)] bg-warning-wash px-4 py-3 text-[14.5px] text-warning"
        >
          {message}
        </p>
      )}

      {selected && (
        <div className="flex flex-wrap items-center gap-3">
          {isSignedIn ? (
            <Button
              size="lg"
              onClick={runOptimize}
              disabled={stage === "optimizing"}
            >
              {stage === "optimizing" ? "Optimizing…" : report ? "Optimize again" : "Optimize"}
            </Button>
          ) : (
            <Button size="lg" onClick={() => router.push("/login")}>
              Sign in to optimize
            </Button>
          )}
          <Button variant="ghost" onClick={reset} disabled={stage === "optimizing"}>
            Start over
          </Button>
        </div>
      )}

      {stage === "optimizing" && (
        <div role="status" aria-live="polite">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
          </div>
          <p className="mt-2 text-[13.5px] text-text-tertiary">
            Uploading and running the optimizer…
          </p>
        </div>
      )}

      {report ? (
        <SavingsReport report={report} />
      ) : (
        selected && <EstimatePanel estimate={selected.estimate} />
      )}
    </div>
  );
}

/**
 * Shown before the real optimization runs. Labelled as an estimate everywhere it
 * appears so it can never be mistaken for a result.
 */
function EstimatePanel({ estimate }: { estimate: SvgEstimate }) {
  const rows = [
    { label: "Original size", value: format(estimate.originalBytes) },
    { label: "Nodes detected", value: format(estimate.nodes) },
    { label: "Distinct colors", value: format(estimate.colors) },
    { label: "Footprint we can usually strip", value: format(estimate.metadataBytes) },
  ];

  return (
    <section
      aria-labelledby="estimate-heading"
      className="rounded-[var(--radius-xl)] bg-white shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 id="estimate-heading" className="text-[19px] font-semibold tracking-[-0.022em]">
              Estimated savings
            </h2>
            <Badge tone="warning">Estimate</Badge>
          </div>
          <p className="mt-1.5 text-[14.5px] text-text-secondary">
            Measured in your browser. Sign in to run the real optimization.
          </p>
        </div>
        <div className="text-right">
          <p className="tabular font-mono text-[30px] leading-none font-bold tracking-[-0.03em] text-warning">
            ~{Math.round(estimate.estimatedSavingsRatio * 100)}%
          </p>
          <p className="mt-1 text-[12.5px] text-text-tertiary">likely reduction</p>
        </div>
      </div>

      <dl className="grid gap-x-10 px-6 py-4 sm:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-baseline justify-between gap-3 border-t border-[var(--border)] py-3.5 first:border-t-0 sm:[&:nth-child(2)]:border-t-0"
          >
            <dt className="text-[14px] text-text-secondary">{row.label}</dt>
            <dd className="tabular font-mono text-[15px] font-semibold">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function format(value: number | null): string {
  if (value === null) return "Not detected";
  return value.toLocaleString("en-US");
}
