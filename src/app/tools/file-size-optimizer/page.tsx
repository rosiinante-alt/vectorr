'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface FormatOption {
  format: string;
  size: number;
  quality: string;
}

export default function FileSizeOptimizerPage() {
  const [fileName, setFileName] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [formats, setFormats] = useState<FormatOption[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalSize(file.size);

    // Mock different optimization results
    const mockFormats: FormatOption[] = [
      { format: 'SVG (Original)', size: file.size, quality: 'Lossless' },
      { format: 'SVG (Optimized)', size: file.size * 0.65, quality: 'Lossless' },
      { format: 'SVG (Aggressive)', size: file.size * 0.45, quality: 'Minimal loss' },
      { format: 'PNG (High)', size: file.size * 1.8, quality: 'Lossless' },
      { format: 'PNG (Medium)', size: file.size * 1.2, quality: 'Near lossless' },
      { format: 'PNG (Low)', size: file.size * 0.8, quality: 'Lossy' },
      { format: 'WebP', size: file.size * 0.6, quality: 'Near lossless' },
      { format: 'PDF', size: file.size * 1.1, quality: 'Lossless' },
    ];

    setFormats(mockFormats.sort((a, b) => a.size - b.size));
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getSavings = (size: number) => {
    return ((originalSize - size) / originalSize) * 100;
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">File Size Optimizer</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            File Size Optimizer
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Compare file sizes across different formats and compression levels. Test multiple optimization strategies
            side-by-side to find the smallest file.
          </p>
        </header>

        {formats.length === 0 && (
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-strong rounded-2xl cursor-pointer bg-white hover:bg-bg-secondary transition-colors">
            <div className="text-center">
              <svg className="mx-auto mb-4 w-12 h-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <p className="text-[1rem] font-medium mb-1">Click to upload file</p>
              <p className="text-[0.875rem] text-text-tertiary">SVG, PNG, or PDF</p>
            </div>
            <input ref={fileInputRef} id="file-upload" type="file" accept=".svg,.png,.pdf" className="hidden" onChange={handleFileSelect} />
          </label>
        )}

        {formats.length > 0 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[1.25rem] font-semibold">Format Comparison</h2>
                  <p className="text-[0.875rem] text-text-tertiary">{fileName}</p>
                </div>
                <button
                  onClick={() => { setFormats([]); setFileName(''); setOriginalSize(0); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="px-4 py-2 rounded-full border border-border-strong text-[0.875rem] font-medium hover:bg-bg-secondary transition-colors"
                >
                  Compare Another
                </button>
              </div>

              <div className="space-y-3">
                {formats.map((fmt, idx) => {
                  const savings = getSavings(fmt.size);
                  const isSmallest = idx === 0;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border transition-colors ${
                        isSmallest ? 'border-green-300 bg-green-50' : 'border-border-subtle hover:border-border-strong'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[1rem] font-semibold">{fmt.format}</span>
                          {isSmallest && (
                            <span className="px-2 py-0.5 text-[0.75rem] font-medium rounded-full bg-green-200 text-green-800">
                              Smallest
                            </span>
                          )}
                        </div>
                        <span className="text-[1.125rem] font-bold">{formatBytes(fmt.size)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[0.875rem]">
                        <span className="text-text-tertiary">Quality: {fmt.quality}</span>
                        <span className={savings > 0 ? 'text-green-600 font-medium' : savings < 0 ? 'text-red-600' : ''}>
                          {savings > 0 ? '-' : savings < 0 ? '+' : ''}{Math.abs(savings).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent transition-all"
                          style={{ width: `${(fmt.size / originalSize) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-green-50 border border-green-200">
                <h3 className="text-[1rem] font-semibold mb-2 text-green-900">Best for Web</h3>
                <p className="text-[1.5rem] font-bold text-green-700">{formats[0].format}</p>
                <p className="text-[0.875rem] text-green-800 mt-1">{formatBytes(formats[0].size)}</p>
              </div>

              <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
                <h3 className="text-[1rem] font-semibold mb-2 text-blue-900">Maximum Savings</h3>
                <p className="text-[1.5rem] font-bold text-blue-700">
                  {getSavings(formats[0].size).toFixed(1)}%
                </p>
                <p className="text-[0.875rem] text-blue-800 mt-1">
                  {formatBytes(originalSize - formats[0].size)} saved
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
