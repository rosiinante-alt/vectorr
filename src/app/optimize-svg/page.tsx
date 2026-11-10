'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { Zap, Upload, Download, AlertCircle, RotateCcw, Check } from 'lucide-react';

type Status = 'idle' | 'optimizing' | 'done' | 'error';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function OptimizeSvgPage() {
  const [status, setStatus] = useState<Status>('idle');
  const [fileName, setFileName] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [exportId, setExportId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saving = originalSize > 0 ? Math.round((1 - optimizedSize / originalSize) * 100) : 0;

  async function handleFile(file: File) {
    if (!file.name.toLowerCase().endsWith('.svg')) {
      setError('Please upload an SVG file.');
      setStatus('error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be under 10 MB.');
      setStatus('error');
      return;
    }

    setFileName(file.name);
    setOriginalSize(file.size);
    setStatus('optimizing');
    setError(null);
    setExportId(null);

    try {
      const form = new FormData();
      form.append('file', file);
      form.append('outputFormat', 'svg');

      const res = await fetch('/api/convert', { method: 'POST', body: form });
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json() as { conversionId?: string };
      const id = data.conversionId;
      if (!id) throw new Error('No conversion ID returned');
      setExportId(id);

      // Poll for completion
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        const poll = await fetch(`/api/jobs/${id}`);
        if (!poll.ok) continue;
        const job = await poll.json() as { status?: string; outputUrl?: string };
        if (job.status === 'complete' && job.outputUrl) {
          const blob = await fetch(job.outputUrl).then((r) => r.blob());
          setOptimizedSize(blob.size);
          setStatus('done');
          return;
        }
        if (job.status === 'failed') throw new Error('Optimization failed on the server');
      }
      throw new Error('Timed out waiting for optimization');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed. Please try again.');
      setStatus('error');
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function reset() {
    setStatus('idle');
    setFileName('');
    setOriginalSize(0);
    setOptimizedSize(0);
    setExportId(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main" className="flex-1 py-12 sm:py-16">
        <div className="wrap">
          <div className="mx-auto max-w-[680px]">

            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[13px] font-medium text-accent">
                <Zap className="h-3.5 w-3.5" />
                SVG Optimizer — Free
              </div>
              <h1 className="display text-[clamp(28px,4vw,44px)]">
                Shrink your SVG files instantly
              </h1>
              <p className="mt-3 text-[clamp(15px,1.6vw,17px)] text-text-secondary">
                Remove hidden metadata, inline styles, and redundant paths. No quality loss — just
                smaller files that load faster and embed cleaner.
              </p>
            </div>

            {/* Drop zone */}
            {status === 'idle' && (
              <div
                role="button"
                tabIndex={0}
                aria-label="Drop SVG file here or click to browse"
                className="group cursor-pointer rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border)] bg-bg-secondary p-12 text-center transition-colors hover:border-accent/50 hover:bg-bg-tertiary focus-visible:outline-2 focus-visible:outline-accent"
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-text-tertiary group-hover:text-accent" />
                <p className="text-[16px] font-medium text-text-primary">Drop an SVG here</p>
                <p className="mt-1 text-[14px] text-text-tertiary">or click to browse — max 10 MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg,image/svg+xml"
                  className="sr-only"
                  onChange={onInputChange}
                  aria-hidden
                />
              </div>
            )}

            {/* Optimizing */}
            {status === 'optimizing' && (
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-10 text-center shadow-[var(--shadow-1)]">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
                <p className="text-[16px] font-medium text-text-primary">Optimizing {fileName}…</p>
                <p className="mt-1 text-[13px] text-text-tertiary">Stripping metadata and cleaning paths</p>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8 shadow-[var(--shadow-1)]">
                <div className="mb-4 flex items-center gap-2.5 rounded-[var(--radius-md)] bg-error-wash px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0 text-error" />
                  <p className="text-[14px] text-error">{error}</p>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-[14px] font-medium text-text-secondary hover:bg-bg-tertiary"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            )}

            {/* Result */}
            {status === 'done' && (
              <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-8 shadow-[var(--shadow-1)]">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10">
                    <Check className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-[15px] font-medium text-text-primary">Optimized — {saving}% smaller</p>
                    <p className="text-[13px] text-text-tertiary">{fileName}</p>
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-[var(--radius-md)] bg-bg-primary p-3">
                    <p className="text-[12px] text-text-tertiary">Original</p>
                    <p className="text-[16px] font-semibold text-text-primary">{formatBytes(originalSize)}</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] bg-accent/10 p-3">
                    <p className="text-[12px] text-accent">Saved</p>
                    <p className="text-[16px] font-semibold text-accent">−{saving}%</p>
                  </div>
                  <div className="rounded-[var(--radius-md)] bg-bg-primary p-3">
                    <p className="text-[12px] text-text-tertiary">Optimized</p>
                    <p className="text-[16px] font-semibold text-text-primary">{formatBytes(optimizedSize)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {exportId && (
                    <a
                      href={`/api/exports/${exportId}`}
                      download
                      className="flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 py-2 text-[14px] font-medium text-white hover:bg-accent/90"
                    >
                      <Download className="h-4 w-4" />
                      Download SVG
                    </a>
                  )}
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-[14px] font-medium text-text-secondary hover:bg-bg-tertiary"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Optimize another
                  </button>
                </div>
              </div>
            )}

            {/* What gets removed */}
            <div className="mt-10 rounded-[var(--radius-xl)] bg-bg-secondary p-6 shadow-[var(--shadow-1)]">
              <h2 className="mb-4 text-[15px] font-semibold text-text-primary">What gets stripped</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ['Editor metadata', 'Inkscape, Illustrator, Sketch IDs'],
                  ['Unused definitions', 'Hidden defs, dead gradients'],
                  ['Empty groups', 'Wrapper <g> tags with no style'],
                  ['Whitespace', 'Excess newlines and indentation'],
                  ['Redundant attributes', 'Default values that add no effect'],
                  ['Comments', 'Generator comments and author notes'],
                ].map(([title, detail]) => (
                  <div key={title} className="flex gap-2 text-[13px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <strong className="font-medium text-text-primary">{title}</strong>
                      <span className="text-text-tertiary"> — {detail}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center text-[13px] text-text-tertiary">
              Need more tools?{' '}
              <Link href="/tools" className="text-accent hover:underline">Browse all free tools</Link>
              {' '}or{' '}
              <Link href="/convert" className="text-accent hover:underline">convert a raster image to SVG</Link>.
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
