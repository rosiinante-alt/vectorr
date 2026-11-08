'use client';

import { useState, useCallback } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle, Download, Layers, Sparkles } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

type JobStatus = 'idle' | 'uploading' | 'queued' | 'processing' | 'completed' | 'failed';

interface ConversionResult {
  conversionId: string;
  jobId: string;
  creditCost: number;
  remainingBalance: number;
}

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<JobStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const creditCost = CREDIT_COSTS.REMOVE_BG;

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

  const handleRemoveBackground = async () => {
    if (!file) return;
    setStatus('uploading');
    setError(null);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', 'svg');
      formData.append('removeBg', 'true');

      const res = await fetch('/api/convert', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Background removal failed');
        setStatus('failed');
        return;
      }

      setResult(data);
      setStatus('queued');

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
          setError(job.failedReason ?? 'Background removal failed');
        }
      }, 1500);

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
    <div className="flex min-h-svh flex-col">
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />

      <main id="main" className="flex-1 py-12 sm:py-16">
        <div className="wrap">
          <div className="mx-auto max-w-[860px]">

            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-[13px] font-medium text-accent">
                <Layers className="h-3.5 w-3.5" />
                Background Remover
              </div>
              <h1 className="display text-[clamp(28px,4vw,44px)]">
                Remove backgrounds with AI precision
              </h1>
              <p className="mt-3 text-[clamp(15px,1.6vw,17px)] text-text-secondary">
                Isolate your subject automatically. Perfect for product photos, stickers, and transparent PNGs.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

              <div className="space-y-4">

                {!file ? (
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
                    <div className="relative">
                      <div className="bg-[repeating-conic-gradient(#e8e8ed_0%_25%,transparent_0%_50%)] bg-[length:20px_20px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preview || ''}
                          alt="Uploaded image preview"
                          className="mx-auto max-h-[360px] object-contain p-4"
                        />
                      </div>
                    </div>

                    {status === 'completed' && (
                      <div className="border-t border-[var(--border)] p-4">
                        <div className="mb-3 flex items-center gap-2 text-accent">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-[14px] font-medium">Background removed successfully</span>
                        </div>
                        {result && (
                          <p className="mb-3 text-[13px] text-text-secondary">
                            {result.remainingBalance.toFixed(2)} credits remaining
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {downloadUrl && (
                            <a
                              href={downloadUrl}
                              download
                              className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 py-2 text-[14px] font-medium text-white hover:bg-accent/90"
                            >
                              <Download className="h-4 w-4" />
                              Download PNG
                            </a>
                          )}
                          <button
                            onClick={reset}
                            className="inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] px-4 py-2 text-[14px] font-medium text-text-primary hover:bg-bg-tertiary"
                          >
                            Remove another
                          </button>
                        </div>
                      </div>
                    )}

                    {isProcessing && (
                      <div className="border-t border-[var(--border)] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
                          <span className="text-[14px] font-medium text-text-primary">
                            {status === 'uploading' && 'Uploading…'}
                            {status === 'queued' && 'Queued…'}
                            {status === 'processing' && 'Removing background…'}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-bg-tertiary">
                          <div
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="mt-2 text-[12px] text-text-tertiary">{progress}% complete</p>
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
                  <p className="mb-4 text-[14px] font-medium text-text-primary">Remove background</p>

                  <div className="mb-4 flex items-center justify-between text-[13px]">
                    <span className="text-text-secondary">Credit cost</span>
                    <span className="font-medium text-text-primary">{creditCost} credit</span>
                  </div>

                  <button
                    onClick={handleRemoveBackground}
                    disabled={!file || isProcessing}
                    className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 py-2.5 text-[14px] font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Remove background
                      </>
                    )}
                  </button>

                  {!file && (
                    <p className="mt-2 text-center text-[12px] text-text-tertiary">
                      Upload an image to continue
                    </p>
                  )}
                </div>

                <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                  <p className="mb-3 text-[13px] font-medium text-text-primary">Perfect for</p>
                  <ul className="space-y-1.5 text-[13px] text-text-secondary">
                    <li>✓ Product photos</li>
                    <li>✓ Stickers and decals</li>
                    <li>✓ T-shirt graphics</li>
                    <li>✓ Transparent PNGs for print</li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius-xl)] bg-bg-secondary p-5 shadow-[var(--shadow-1)]">
                  <p className="mb-3 text-[13px] font-medium text-text-primary">What you get</p>
                  <ul className="space-y-1.5 text-[13px] text-text-secondary">
                    <li>✓ Clean alpha channel</li>
                    <li>✓ Precise edge detection</li>
                    <li>✓ Transparent PNG output</li>
                    <li>✓ Ready for any background color</li>
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
