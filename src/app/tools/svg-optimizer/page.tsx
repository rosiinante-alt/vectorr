'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function SvgOptimizerPage() {
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [status, setStatus] = useState<'idle' | 'optimizing' | 'complete'>('idle');
  const [exportId, setExportId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalSize(file.size);
    setStatus('optimizing');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('outputFormat', 'svg');
      formData.append('optimize', 'true');

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      setExportId(result.exportId);

      // Fetch the optimized file to get its size
      const exportResponse = await fetch(`/api/exports/${result.exportId}`);
      const blob = await exportResponse.blob();
      setOptimizedSize(blob.size);

      setStatus('complete');
    } catch (error) {
      console.error('Optimization failed:', error);
      setStatus('idle');
      alert('Optimization failed. Please try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setOriginalSize(0);
    setOptimizedSize(0);
    setExportId(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const savingsPercent = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">
            Tools
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">SVG Optimizer</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            SVG Optimizer
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Reduce SVG file size by removing metadata, simplifying paths, and collapsing redundant groups.
            Perfect for web performance and production workflows.
          </p>
        </header>

        {status === 'idle' && (
          <div>
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-strong rounded-2xl cursor-pointer bg-white hover:bg-bg-secondary transition-colors"
            >
              <div className="text-center">
                <svg
                  className="mx-auto mb-4 w-12 h-12 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-[1rem] font-medium mb-1">Click to upload SVG</p>
                <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
              </div>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept=".svg,image/svg+xml"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {status === 'optimizing' && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-border-subtle">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[1rem] font-medium">Optimizing {fileName}...</p>
          </div>
        )}

        {status === 'complete' && (
          <div>
            <div className="mb-8 p-8 rounded-2xl bg-white border border-border-subtle">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Original Size</p>
                  <p className="text-[2rem] font-bold">{(originalSize / 1024).toFixed(1)} KB</p>
                </div>
                <div>
                  <p className="text-[0.875rem] text-text-tertiary mb-1">Optimized Size</p>
                  <p className="text-[2rem] font-bold text-green-600">
                    {(optimizedSize / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[0.875rem] text-text-tertiary">File size reduction</span>
                  <span className="text-[1.125rem] font-semibold text-green-600">
                    {savingsPercent.toFixed(1)}% smaller
                  </span>
                </div>
                <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${savingsPercent}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {exportId && (
                  <a
                    href={`/api/exports/${exportId}`}
                    download={fileName.replace(/\.svg$/i, '-optimized.svg')}
                    className="flex-1 inline-flex items-center justify-center h-11 rounded-full bg-accent text-white font-semibold hover:bg-accent-hover transition-colors"
                  >
                    Download Optimized SVG
                  </a>
                )}
                <button
                  onClick={reset}
                  className="px-6 h-11 rounded-full border border-border-strong font-semibold hover:bg-bg-secondary transition-colors"
                >
                  Optimize Another
                </button>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1.125rem] font-semibold mb-3">What was optimized?</h3>
              <ul className="space-y-2 text-[0.9375rem] text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Removed editor metadata and comments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Reduced decimal precision in path coordinates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Collapsed redundant groups and transforms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Merged duplicate styles and definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Removed unused IDs and classes</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
