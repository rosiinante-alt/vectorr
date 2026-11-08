'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, FolderInput, Layers } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

type OutputFormat = 'svg' | 'dxf' | 'eps' | 'pdf';
type JobStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

interface BatchResult {
  batchId: string;
  totalFiles: number;
  creditCost: number;
  remainingBalance: number;
}

const FORMAT_LABELS: Record<OutputFormat, string> = {
  svg: 'SVG — Web & Design',
  dxf: 'DXF — CAD / CNC',
  eps: 'EPS — Print / Adobe',
  pdf: 'PDF — Print',
};

export default function BatchPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('svg');
  const [removeBg, setRemoveBg] = useState(false);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BatchResult | null>(null);

  const creditCost = files.length * (CREDIT_COSTS.VECTORIZE + (removeBg ? CREDIT_COSTS.REMOVE_BG : 0));

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    const valid = fileArray.filter((f) => allowed.includes(f.type) && f.size <= 50 * 1024 * 1024);
    
    if (valid.length !== fileArray.length) {
      setError('Some files were skipped (wrong format or >50MB)');
    } else {
      setError(null);
    }
    
    setFiles(valid);
    setStatus('idle');
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleBatch = async () => {
    if (files.length === 0) return;
    setStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('outputFormat', outputFormat);
      formData.append('preprocessing', JSON.stringify({ removeBg, upscale: undefined }));

      const res = await fetch('/api/batch', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Batch conversion failed');
        setStatus('failed');
        return;
      }

      setResult({
        batchId: data.id,
        totalFiles: files.length,
        creditCost: data.creditCost || creditCost,
        remainingBalance: data.remainingBalance || 0,
      });
      setStatus('completed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setStatus('failed');
    }
  };

  const reset = () => {
    setFiles([]);
    setStatus('idle');
    setError(null);
    setResult(null);
  };

  const isProcessing = status === 'uploading' || status === 'processing';

  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main" className="flex-1 py-12 sm:py-16">
        <div className="wrap">
          <div className="mx-auto max-w-[860px]">

            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[13px] font-medium text-accent">
                <FolderInput className="h-3.5 w-3.5" />
                Batch Converter
              </div>
              <h1 className="display text-[clamp(28px,4vw,44px)]">
                Convert hundreds of images at once
              </h1>
              <p className="mt-3 text-[clamp(15px,1.6vw,17px)] text-text-secondary">
                Upload multiple images and convert them all to SVG, DXF, EPS, or PDF in one go.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

              <div className="space-y-4">

                {files.length === 0 ? (
                  <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={[
                      'flex min-h-[240px] w-full cursor-pointer flex-col items-center justify-center gap-3',
                      'rounded-[var(--radius-xl)] border-2 border-dashed',
                      'transition-colors duration-150',
                      isDragging
                        ? 'border-accent bg-accent-wash'
                        : 'border-[var(--border-strong)] bg-bg-secondary hover:border-accent hover:bg-accent-wash',
                    ].join(' ')}
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="sr-only"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />
                    <FolderInput className="h-8 w-8 text-text-tertiary" />
                    <div className="text-center">
                      <p className="text-[15px] font-medium text-text-primary">
                        Drop multiple images here
                      </p>
                      <p className="mt-1 text-[13px] text-text-tertiary">
                        PNG, JPG, WEBP · Max 50 images · 50 MB each
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
                    <div className="p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-[14px] font-medium text-text-primary">
                          {files.length} file{files.length !== 1 ? 's' : ''} selected
                        </p>
                        <button
                          onClick={reset}
                          className="text-[13px] text-text-secondary hover:text-text-primary"
                        >
                          Clear all
                        </button>
                      </div>

                      <div className="max-h-[300px] space-y-2 overflow-y-auto">
                        {files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 rounded-[var(--radius-md)] bg-bg-primary px-3 py-2"
                          >
                            <Layers className="h-4 w-4 text-text-tertiary" />
                            <span className="flex-1 truncate text-[13px] text-text-primary">
                              {file.name}
                            </span>
                            <span className="text-[12px] text-text-tertiary">
                              {(file.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {status === 'completed' && result && (
                      <div className="border-t border-[var(--border)] p-4">
                        <div className="mb-3 flex items-center gap-2 text-accent">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-[14px] font-medium">Batch created successfully</span>
                        </div>
                        <p className="mb-3 text-[13px] text-text-secondary">
                          Converting {result.totalFiles} file{result.totalFiles !== 1 ? 's' : ''}. Track progress on your{' '}
                          <Link href="/dashboard" className="text-accent hover:underline">
                            dashboard
                          </Link>.
                        </p>
                        <p className="mb-3 text-[13px] text-text-secondary">
                          {result.remainingBalance.toFixed(2)} credits remaining
                        </p>
                        <button
                          onClick={reset}
                          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-[14px] font-medium text-text-primary hover:bg-bg-tertiary"
                        >
                          Convert another batch
                        </button>
                      </div>
                    )}

                    {status === 'failed' && (
                      <div className="border-t border-[var(--border)] p-4">
                        <div className="mb-3 flex items-center gap-2 text-error">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-[14px] font-medium">Failed</span>
                        </div>
                        <p className="mb-3 text-[13px] text-text-secondary">{error}</p>
                        <button
                          onClick={reset}
                          className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-[14px] font-medium text-text-primary hover:bg-bg-tertiary"
                        >
                          Try again
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {status === 'idle' && error && (
                  <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] bg-error-wash px-4 py-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-error" />
                    <p className="text-[14px] text-error">{error}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                  <p className="mb-4 text-[14px] font-medium text-text-primary">Output format</p>

                  <div className="mb-5 space-y-2">
                    {(Object.keys(FORMAT_LABELS) as OutputFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        aria-pressed={outputFormat === fmt}
                        className={[
                          'w-full rounded-[var(--radius-md)] border px-3 py-2 text-left transition-colors',
                          outputFormat === fmt
                            ? 'border-accent bg-accent/10 text-accent'
                            : 'border-[var(--border)] text-text-primary hover:border-accent/50',
                        ].join(' ')}
                      >
                        <div className="text-[13px] font-medium">{FORMAT_LABELS[fmt]}</div>
                      </button>
                    ))}
                  </div>

                  <label className="mb-4 flex items-center gap-2 text-[13px]">
                    <input
                      type="checkbox"
                      checked={removeBg}
                      onChange={(e) => setRemoveBg(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--border)] text-accent focus:ring-accent"
                    />
                    <span className="text-text-primary">Remove backgrounds (+{CREDIT_COSTS.REMOVE_BG} credit/image)</span>
                  </label>

                  <div className="mb-4 flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">Total credit cost</span>
                    <span className="font-medium text-text-primary">{creditCost.toFixed(2)} credits</span>
                  </div>

                  <button
                    onClick={handleBatch}
                    disabled={files.length === 0 || isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <FolderInput className="h-4 w-4" />
                        Convert batch
                      </>
                    )}
                  </button>

                  {files.length === 0 && (
                    <p className="mt-2 text-center text-[12px] text-text-tertiary">
                      Upload images to continue
                    </p>
                  )}
                </div>

                <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                  <p className="mb-3 text-[13px] font-medium text-text-primary">How batches work</p>
                  <ul className="space-y-1.5 text-[13px] text-text-secondary">
                    <li>✓ Upload 1–50 images at once</li>
                    <li>✓ All images convert in parallel</li>
                    <li>✓ Track progress on dashboard</li>
                    <li>✓ Download all results as a ZIP</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
