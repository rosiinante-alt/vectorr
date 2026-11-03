'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, Download, Zap, Image, Layers } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

type OutputFormat = 'svg' | 'dxf' | 'eps' | 'pdf';
type UpscaleOption = '2x' | '4x' | false;
type JobStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';

interface ConversionResult {
  conversionId: string;
  jobId: string;
  creditCost: number;
  remainingBalance: number;
}

const FORMAT_LABELS: Record<OutputFormat, string> = {
  svg: 'SVG — Web & Design',
  dxf: 'DXF — CAD / CNC',
  eps: 'EPS — Print / Adobe',
  pdf: 'PDF — Print',
};

export default function ConvertPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('svg');
  const [removeBg, setRemoveBg] = useState(false);
  const [upscale, setUpscale] = useState<UpscaleOption>(false);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const creditCost =
    CREDIT_COSTS.VECTORIZE +
    (removeBg ? CREDIT_COSTS.REMOVE_BG : 0) +
    (upscale === '2x' ? CREDIT_COSTS.UPSCALE_2X : 0) +
    (upscale === '4x' ? CREDIT_COSTS.UPSCALE_4X : 0);

  const handleFile = useCallback((f: File) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowed.includes(f.type)) {
      setError('Please use a PNG, JPG, or WEBP file.');
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setError('File must be smaller than 50 MB.');
      return;
    }
    setError(null);
    setFile(f);
    setStatus('idle');
    setResult(null);
    setDownloadUrl(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const handleConvert = async () => {
    if (!file) return;
    setStatus('uploading');
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', outputFormat);
      formData.append('removeBg', String(removeBg));
      if (upscale) formData.append('upscale', upscale);

      const res = await fetch('/api/convert', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Conversion failed');
        setStatus('failed');
        return;
      }

      setResult(data);
      setStatus('queued');

      // Poll for job completion
      const interval = setInterval(async () => {
        const jobRes = await fetch(`/api/jobs/${data.jobId}`);
        if (!jobRes.ok) return;
        const job = await jobRes.json();

        setProgress(job.progress ?? 0);

        if (job.state === 'active') setStatus('processing');
        if (job.state === 'completed') {
          clearInterval(interval);
          setStatus('completed');
          setProgress(100);
          if (job.returnvalue?.convertedFileUrl) {
            setDownloadUrl(job.returnvalue.convertedFileUrl);
          }
        }
        if (job.state === 'failed') {
          clearInterval(interval);
          setStatus('failed');
          setError(job.failedReason ?? 'Conversion failed');
        }
      }, 1500);

      // Safety timeout — clear after 5 minutes
      setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
      setStatus('failed');
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setStatus('idle');
    setError(null);
    setResult(null);
    setDownloadUrl(null);
    setProgress(0);
  };

  const isProcessing = status === 'uploading' || status === 'queued' || status === 'processing';

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main" className="flex-1 py-12 sm:py-16">
        <div className="wrap">
          <div className="mx-auto max-w-[860px]">

            {/* Heading */}
            <div className="mb-10 text-center">
              <h1 className="display text-[clamp(28px,4vw,44px)]">
                Convert image to vector
              </h1>
              <p className="mt-3 text-[clamp(15px,1.6vw,17px)] text-text-secondary">
                PNG, JPG, or WEBP → SVG, DXF, EPS, PDF. Powered by AI.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

              {/* Left: upload + result */}
              <div className="space-y-4">

                {/* Drop zone */}
                {!file ? (
                  <label
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={[
                      'flex flex-col items-center justify-center gap-3 w-full min-h-[240px]',
                      'rounded-[var(--radius-xl)] border-2 border-dashed cursor-pointer',
                      'transition-colors duration-150',
                      isDragging
                        ? 'border-accent bg-accent-wash'
                        : 'border-[var(--border-strong)] bg-bg-secondary hover:border-accent hover:bg-accent-wash',
                    ].join(' ')}
                  >
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <Upload className="h-8 w-8 text-text-tertiary" />
                    <div className="text-center">
                      <p className="text-[15px] font-medium text-text-primary">
                        Drop your image here
                      </p>
                      <p className="mt-1 text-[13px] text-text-tertiary">
                        PNG, JPG, WEBP · Max 50 MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="overflow-hidden rounded-[var(--radius-xl)] bg-bg-secondary shadow-[var(--shadow-1)]">
                    {/* Image preview */}
                    <div className="relative bg-[repeating-conic-gradient(#e8e8ed_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
                      {preview && (
                        <img
                          src={preview}
                          alt="Preview"
                          className="mx-auto max-h-[300px] w-auto object-contain p-4"
                        />
                      )}
                      <button
                        onClick={reset}
                        className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-[12px] font-medium text-text-secondary shadow-[var(--shadow-1)] hover:text-error"
                      >
                        Change
                      </button>
                    </div>

                    {/* File info */}
                    <div className="border-t border-[var(--border)] px-5 py-3">
                      <p className="text-[14px] font-medium text-text-primary truncate">{file.name}</p>
                      <p className="text-[13px] text-text-tertiary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] bg-error-wash px-4 py-3">
                    <AlertCircle className="h-4 w-4 shrink-0 text-error" />
                    <p className="text-[14px] text-error">{error}</p>
                  </div>
                )}

                {/* Progress */}
                {isProcessing && (
                  <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        <span className="text-[14px] font-medium text-text-primary">
                          {status === 'uploading' ? 'Uploading…' : status === 'queued' ? 'Queued…' : 'Converting…'}
                        </span>
                      </div>
                      <span className="text-[13px] text-text-tertiary">{progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${Math.max(progress, status === 'uploading' ? 10 : 25)}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Success */}
                {status === 'completed' && (
                  <div className="rounded-[var(--radius-xl)] bg-success-wash p-5 shadow-[var(--shadow-1)]">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle className="h-5 w-5 text-success-text" />
                      <span className="text-[15px] font-semibold text-success-text">Conversion complete!</span>
                    </div>
                    {downloadUrl ? (
                      <a
                        href={downloadUrl}
                        download={`${file?.name.replace(/\.[^.]+$/, '')}.${outputFormat}`}
                        className="flex items-center justify-center gap-2 w-full rounded-[var(--radius-md)] bg-success-text px-4 py-2.5 text-[14px] font-semibold text-white hover:opacity-90 transition-opacity"
                      >
                        <Download className="h-4 w-4" />
                        Download {outputFormat.toUpperCase()}
                      </a>
                    ) : (
                      <p className="text-[14px] text-text-secondary">
                        Your file is ready. Check your dashboard to download.
                      </p>
                    )}
                    {result && (
                      <p className="mt-3 text-[13px] text-text-tertiary text-center">
                        {result.creditCost.toFixed(2)} credits used · {result.remainingBalance.toFixed(2)} remaining
                      </p>
                    )}
                    <button
                      onClick={reset}
                      className="mt-3 w-full text-center text-[13px] text-text-tertiary hover:text-text-primary"
                    >
                      Convert another file →
                    </button>
                  </div>
                )}
              </div>

              {/* Right: settings + convert button */}
              <div className="space-y-4">

                {/* Output format */}
                <div className="rounded-[var(--radius-xl)] bg-white p-5 shadow-[var(--shadow-1)]">
                  <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-text-tertiary">
                    Output Format
                  </h2>
                  <div className="space-y-1.5">
                    {(Object.entries(FORMAT_LABELS) as [OutputFormat, string][]).map(([fmt, label]) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={[
                          'w-full rounded-[var(--radius-md)] px-3.5 py-2.5 text-left text-[14px] font-medium transition-colors',
                          outputFormat === fmt
                            ? 'bg-accent text-white'
                            : 'text-text-primary hover:bg-bg-secondary',
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI options */}
                <div className="rounded-[var(--radius-xl)] bg-white p-5 shadow-[var(--shadow-1)]">
                  <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-text-tertiary">
                    AI Enhancements
                  </h2>

                  {/* Remove background */}
                  <label className="flex items-center justify-between gap-3 cursor-pointer py-2">
                    <div className="flex items-center gap-2.5">
                      <Image className="h-4 w-4 text-text-tertiary" />
                      <div>
                        <p className="text-[14px] font-medium text-text-primary">Remove background</p>
                        <p className="text-[12px] text-text-tertiary">+{CREDIT_COSTS.REMOVE_BG} credits</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setRemoveBg(!removeBg)}
                      className={[
                        'relative h-5 w-9 rounded-full transition-colors cursor-pointer',
                        removeBg ? 'bg-accent' : 'bg-bg-tertiary',
                      ].join(' ')}
                    >
                      <span className={[
                        'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                        removeBg ? 'translate-x-4' : 'translate-x-0.5',
                      ].join(' ')} />
                    </div>
                  </label>

                  {/* Upscale */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2.5 mb-2">
                      <Layers className="h-4 w-4 text-text-tertiary" />
                      <p className="text-[14px] font-medium text-text-primary">Upscale before convert</p>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {([false, '2x', '4x'] as const).map((opt) => (
                        <button
                          key={String(opt)}
                          onClick={() => setUpscale(opt)}
                          className={[
                            'rounded-[var(--radius-md)] py-1.5 text-[13px] font-medium transition-colors',
                            upscale === opt
                              ? 'bg-accent text-white'
                              : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary',
                          ].join(' ')}
                        >
                          {opt === false ? 'None' : opt}
                          {opt !== false && (
                            <span className="ml-1 text-[11px] opacity-70">
                              +{opt === '2x' ? CREDIT_COSTS.UPSCALE_2X : CREDIT_COSTS.UPSCALE_4X}cr
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Cost summary + convert button */}
                <div className="rounded-[var(--radius-xl)] bg-white p-5 shadow-[var(--shadow-1)]">
                  <div className="mb-4 space-y-1.5">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-text-secondary">Vectorize</span>
                      <span className="font-mono text-text-primary">{CREDIT_COSTS.VECTORIZE} cr</span>
                    </div>
                    {removeBg && (
                      <div className="flex justify-between text-[14px]">
                        <span className="text-text-secondary">Remove background</span>
                        <span className="font-mono text-text-primary">+{CREDIT_COSTS.REMOVE_BG} cr</span>
                      </div>
                    )}
                    {upscale && (
                      <div className="flex justify-between text-[14px]">
                        <span className="text-text-secondary">Upscale {upscale}</span>
                        <span className="font-mono text-text-primary">
                          +{upscale === '2x' ? CREDIT_COSTS.UPSCALE_2X : CREDIT_COSTS.UPSCALE_4X} cr
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-[var(--border)] pt-2 text-[14px] font-semibold">
                      <span>Total</span>
                      <span className="font-mono text-accent">{creditCost.toFixed(2)} credits</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConvert}
                    disabled={!file || isProcessing || status === 'completed'}
                    className={[
                      'flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] px-4 py-3',
                      'text-[15px] font-semibold transition-all',
                      !file || isProcessing || status === 'completed'
                        ? 'cursor-not-allowed bg-bg-tertiary text-text-tertiary'
                        : 'bg-accent text-white hover:bg-accent-hover active:scale-[0.98]',
                    ].join(' ')}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Converting…
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Convert to {outputFormat.toUpperCase()}
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-[12px] text-text-tertiary">
                    Need credits?{' '}
                    <Link href="/pricing" className="text-accent-ink underline underline-offset-2">
                      View plans
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
