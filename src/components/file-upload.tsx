"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { analyzeSvg, readSvgText, type SvgEstimate } from "@/lib/svg-estimate";
import { cn, formatBytes, formatCount } from "@/lib/ui";

export const MAX_SVG_BYTES = 10 * 1024 * 1024;

export interface SelectedFile {
  file: File;
  estimate: SvgEstimate;
  text: string;
  previewUrl: string;
}

export type UploadPhase = "idle" | "checking" | "ready" | "uploading" | "uploaded" | "error";

export interface FileUploadProps {
  /** Called once a file passes local validation. */
  onSelect: (selected: SelectedFile) => void;
  /** Runs the real upload; only supplied when the user is signed in. */
  onUpload?: (file: File) => Promise<void>;
  isSignedIn: boolean;
  disabled?: boolean;
}

function validate(file: File): string | null {
  if (!/\.svg$/i.test(file.name)) {
    return "Only SVG files are supported. Pick a .svg file.";
  }
  if (file.size === 0) {
    return "That file is empty.";
  }
  if (file.size > MAX_SVG_BYTES) {
    return `That file is ${formatBytes(file.size)}. The limit is 10 MB.`;
  }
  return null;
}

export function FileUpload({ onSelect, onUpload, isSignedIn, disabled }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  useEffect(() => {
    return () => {
      if (selected) URL.revokeObjectURL(selected.previewUrl);
    };
  }, [selected]);

  const handleFile = useCallback(
    async (file: File) => {
      const problem = validate(file);
      if (problem) {
        setError(problem);
        setPhase("error");
        return;
      }

      setError(null);
      setPhase("checking");

      try {
        const text = await readSvgText(file);
        const estimate = analyzeSvg(text, file.size);
        const previewUrl = URL.createObjectURL(
          new Blob([text], { type: "image/svg+xml" }),
        );

        setSelected((previous) => {
          if (previous) URL.revokeObjectURL(previous.previewUrl);
          return { file, estimate, text, previewUrl };
        });
        setPhase("ready");
        onSelect({ file, estimate, text, previewUrl });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not read that file.");
        setPhase("error");
      }
    },
    [onSelect],
  );

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  };

  const beginUpload = async () => {
    if (!selected || !onUpload) return;
    setPhase("uploading");
    setError(null);
    try {
      await onUpload(selected.file);
      setPhase("uploaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
      setPhase("error");
    }
  };

  const reset = () => {
    if (selected) URL.revokeObjectURL(selected.previewUrl);
    setSelected(null);
    setPhase("idle");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const inputId = "svg-file-input";

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Choose an SVG file or drop one here"
        aria-describedby={`${inputId}-hint`}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) return;
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={onDrop}
        className={cn(
          "rounded-[var(--radius-xl)] border-2 border-dashed px-6 py-10 text-center transition-colors",
          "focus-visible:outline-2.5",
          dragging
            ? "border-accent bg-accent-wash"
            : "border-[var(--border-strong)] bg-bg-secondary hover:border-accent hover:bg-accent-wash/40",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".svg,image/svg+xml"
          className="visually-hidden"
          disabled={disabled}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />

        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="mx-auto mb-3 h-7 w-7 text-text-tertiary"
        >
          <path d="M12 16V4" />
          <path d="M7 9l5-5 5 5" />
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
        </svg>

        <p className="text-[16.5px] font-semibold">
          {selected ? selected.file.name : "Drop an SVG here"}
        </p>
        <p id={`${inputId}-hint`} className="mt-1 text-[14px] text-text-tertiary">
          {selected
            ? `${formatBytes(selected.file.size)} · ${formatCount(selected.estimate.nodes)} nodes`
            : "or click to browse · .svg only · up to 10 MB"}
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] bg-error-wash px-3 py-2 text-[14.5px] text-error"
        >
          <span aria-hidden="true">⚠</span>
          {error}
        </p>
      )}

      {selected && phase !== "error" && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isSignedIn && phase !== "uploaded" ? (
            <Button onClick={beginUpload} disabled={phase === "uploading"}>
              {phase === "uploading" ? "Uploading…" : "Upload and optimize"}
            </Button>
          ) : null}

          {!isSignedIn && <Badge tone="accent">Estimate — sign in to optimize</Badge>}

          {phase === "uploaded" && (
            <Badge tone="success">
              <span aria-hidden="true">✓</span> Uploaded
            </Badge>
          )}

          <Button variant="ghost" onClick={reset}>
            Choose another file
          </Button>
        </div>
      )}

      {phase === "uploading" && (
        <div className="mt-4" role="status" aria-live="polite">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
          </div>
          <p className="mt-1.5 text-[13.5px] text-text-tertiary">
            Uploading to storage…
          </p>
        </div>
      )}
    </div>
  );
}
