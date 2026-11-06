'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface ConversionJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress?: number;
  outputFormat: string;
  exportId?: string;
  error?: string;
}

export default function BatchConverterPage() {
  const [jobs, setJobs] = useState<ConversionJob[]>([]);
  const [outputFormat, setOutputFormat] = useState('svg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newJobs: ConversionJob[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      fileName: file.name,
      status: 'pending',
      outputFormat,
    }));

    setJobs((prev) => [...prev, ...newJobs]);

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const job = newJobs[i];

      try {
        // Update status to processing
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, status: 'processing' as const } : j))
        );

        const formData = new FormData();
        formData.append('file', file);
        formData.append('outputFormat', outputFormat);

        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, status: 'complete' as const, exportId: result.exportId }
              : j
          )
        );
      } catch (error) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, status: 'error' as const, error: (error as Error).message }
              : j
          )
        );
      }
    }
  };

  const downloadAll = () => {
    jobs.forEach((job) => {
      if (job.status === 'complete' && job.exportId) {
        const link = document.createElement('a');
        link.href = `/api/exports/${job.exportId}`;
        link.download = job.fileName.replace(/\.[^.]+$/, `.${outputFormat}`);
        link.click();
      }
    });
  };

  const clearAll = () => {
    setJobs([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
          <span className="text-[#4A5568]">Batch Converter</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Batch File Converter
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Upload multiple images and convert them all at once. Automatically optimized for web, print, or
            production use.
          </p>
        </header>

        {/* Settings */}
        <div className="mb-8 p-6 rounded-xl bg-white border border-border-subtle">
          <label className="block mb-3 text-[0.9375rem] font-medium">Output Format</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg border border-border-strong bg-white text-[0.9375rem] focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="svg">SVG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
            <option value="dxf">DXF</option>
            <option value="eps">EPS</option>
            <option value="stl">STL (3D)</option>
            <option value="dst">DST (Embroidery)</option>
            <option value="pes">PES (Embroidery)</option>
          </select>
        </div>

        {/* Upload Zone */}
        <div className="mb-8">
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
              <p className="text-[1rem] font-medium mb-1">Click to upload files</p>
              <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
              <p className="mt-2 text-[0.8125rem] text-text-tertiary">
                JPG, PNG, SVG, PDF, AI, EPS — no file size limit
              </p>
            </div>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              multiple
              accept="image/*,.pdf,.eps,.ai,.svg"
              className="hidden"
              onChange={handleFileSelect}
            />
          </label>
        </div>

        {/* Jobs List */}
        {jobs.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[1.25rem] font-semibold">
                {jobs.length} file{jobs.length === 1 ? '' : 's'}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={downloadAll}
                  disabled={!jobs.some((j) => j.status === 'complete')}
                  className="px-4 py-2 text-[0.875rem] font-medium rounded-lg bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
                >
                  Download All
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-[0.875rem] font-medium rounded-lg border border-border-strong hover:bg-bg-secondary transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg bg-white border border-border-subtle flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-[0.9375rem] font-medium truncate">{job.fileName}</p>
                    <p className="text-[0.8125rem] text-text-tertiary">
                      {job.status === 'pending' && 'Waiting...'}
                      {job.status === 'processing' && 'Converting...'}
                      {job.status === 'complete' && `Converted to ${job.outputFormat.toUpperCase()}`}
                      {job.status === 'error' && `Error: ${job.error}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {job.status === 'complete' && job.exportId && (
                      <a
                        href={`/api/exports/${job.exportId}`}
                        download={job.fileName.replace(/\.[^.]+$/, `.${job.outputFormat}`)}
                        className="px-3 py-1.5 text-[0.8125rem] font-medium rounded-md bg-bg-secondary border border-border-strong hover:bg-bg-tertiary transition-colors"
                      >
                        Download
                      </a>
                    )}
                    {job.status === 'processing' && (
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    )}
                    {job.status === 'error' && (
                      <span className="text-[0.8125rem] text-red-600">✗</span>
                    )}
                    {job.status === 'complete' && (
                      <span className="text-[0.8125rem] text-green-600">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
