"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MAX_BATCH_FILE_BYTES, MAX_BATCH_FILES } from "@/lib/batch/types";
import { batchCreditCost, CREDITS_PER_BATCH_FILE } from "@/lib/batch/validation";
import { cn, formatBytes } from "@/lib/ui";

const ACCEPTED = /\.(png|jpe?g|webp)$/i;

export interface BatchUploadProps {
  onBatchCreate?: (batchId: string) => void;
}

function fileProblem(file: File): string | null {
  if (!ACCEPTED.test(file.name)) return `${file.name}: only PNG, JPEG and WebP are supported.`;
  if (file.size === 0) return `${file.name}: that file is empty.`;
  if (file.size > MAX_BATCH_FILE_BYTES) {
    return `${file.name}: ${formatBytes(file.size)} exceeds the 10 MB per-file limit.`;
  }
  return null;
}

export function BatchUpload({ onBatchCreate }: BatchUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const handleFileSelect = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;

      const problems = incoming.map(fileProblem).filter((problem): problem is string => Boolean(problem));
      const valid = incoming.filter((file) => fileProblem(file) === null);

      setFiles((current) => {
        const merged = [...current, ...valid];
        if (merged.length > MAX_BATCH_FILES) {
          setError(`A batch holds up to ${MAX_BATCH_FILES} files. You already had ${current.length}.`);
          return current;
        }
        setError(problems[0] ?? null);
        return merged;
      });
    },
    [],
  );

  const handleRemoveFile = (index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Select at least one file.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const body = new FormData();
      for (const file of files) body.append("files", file);
      body.append("preprocessing", JSON.stringify({ removeBg: false, upscale: false }));
      body.append("outputFormat", "svg");

      const response = await fetch("/api/batch", { method: "POST", body });
      const payload = (await response.json().catch(() => ({}))) as { id?: string; error?: string };

      if (!response.ok || !payload.id) {
        throw new Error(payload.error ?? "Could not start the batch.");
      }

      setBatchId(payload.id);
      onBatchCreate?.(payload.id);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  if (batchId) {
    return (
      <Card className="p-6 text-center">
        <CardTitle as="h3">Batch started</CardTitle>
        <CardDescription className="mt-2">
          {batchId ? (
            <a className="text-accent hover:underline" href={`/batch/${batchId}`}>
              Track progress and download results
            </a>
          ) : null}
        </CardDescription>
        <div className="mt-4">
          <Button variant="secondary" onClick={() => setBatchId(null)}>
            Start another batch
          </Button>
        </div>
      </Card>
    );
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const inputId = "batch-file-input";

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h3">Batch upload ({files.length}/{MAX_BATCH_FILES})</CardTitle>
        <CardDescription>
          {CREDITS_PER_BATCH_FILE} credits per file — {batchCreditCost(files.length)} for this batch.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          role="button"
          tabIndex={isUploading ? -1 : 0}
          aria-label="Choose image files or drop them here"
          aria-describedby={`${inputId}-hint`}
          aria-disabled={isUploading}
          onClick={() => !isUploading && inputRef.current?.click()}
          onKeyDown={(event) => {
            if (isUploading) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragEnter={(event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (isUploading) return;
            dragDepth.current += 1;
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (dragDepth.current === 0) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            dragDepth.current = 0;
            setDragging(false);
            if (isUploading) return;
            handleFileSelect(Array.from(event.dataTransfer.files ?? []));
          }}
          className={cn(
            "rounded-[var(--radius-xl)] border-2 border-dashed px-6 py-8 text-center transition-colors",
            "focus-visible:outline-2.5",
            dragging
              ? "border-accent bg-accent-wash"
              : "border-[var(--border-strong)] bg-bg-secondary hover:border-accent hover:bg-accent-wash/40",
            isUploading && "cursor-not-allowed opacity-60",
          )}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp,image/png,image/jpeg,image/webp"
            className="visually-hidden"
            disabled={isUploading}
            onChange={(event) => {
              handleFileSelect(Array.from(event.target.files ?? []));
              // Reset so re-picking the same file still fires onChange.
              event.target.value = "";
            }}
          />
          <p className="text-[16.5px] font-semibold">Drop images here</p>
          <p id={`${inputId}-hint`} className="mt-1 text-[14px] text-text-tertiary">
            or click to browse · PNG, JPEG, WebP · up to {MAX_BATCH_FILES} files · 10 MB each
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-3 rounded-[var(--radius-md)] bg-error-wash px-3 py-2 text-[14.5px] text-error"
          >
            {error}
          </p>
        )}

        {files.length > 0 && (
          <ul className="mt-4 max-h-64 space-y-1.5 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-bg-secondary px-3 py-2"
              >
                <span className="truncate text-[14.5px]">{file.name}</span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="text-[13px] text-text-tertiary">{formatBytes(file.size)}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    disabled={isUploading}
                    className="text-[13px] font-semibold text-error hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button
            onClick={handleUpload}
            disabled={files.length === 0 || isUploading}
          >
            {isUploading
              ? "Uploading…"
              : `Convert ${files.length} file${files.length === 1 ? "" : "s"}`}
          </Button>

          {files.length > 0 && (
            <Badge tone="neutral">{formatBytes(totalBytes)} total</Badge>
          )}

          {files.length > 0 && !isUploading && (
            <Button variant="ghost" onClick={() => setFiles([])}>
              Clear
            </Button>
          )}
        </div>

        {isUploading && (
          <div className="mt-4" role="status" aria-live="polite">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-bg-tertiary">
              <div className="h-full w-1/2 animate-pulse rounded-full bg-accent" />
            </div>
            <p className="mt-1.5 text-[13.5px] text-text-tertiary">
              Uploading {files.length} file{files.length === 1 ? "" : "s"}…
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}