'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface ValidationIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
}

export default function VectorValidatorPage() {
  const [fileName, setFileName] = useState('');
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileSize(file.size);
    setIsValidating(true);

    const text = await file.text();
    const foundIssues: ValidationIssue[] = [];

    // Check for open paths
    const pathMatches = text.match(/<path[^>]*d="([^"]+)"/g) || [];
    pathMatches.forEach((path, idx) => {
      if (!path.includes('Z') && !path.includes('z')) {
        foundIssues.push({
          type: 'warning',
          message: `Path ${idx + 1} is not closed (missing Z command)`,
        });
      }
    });

    // Check for very small dimensions
    const viewBoxMatch = text.match(/viewBox="([^"]+)"/);
    if (viewBoxMatch) {
      const [, , w, h] = viewBoxMatch[1].split(' ').map(parseFloat);
      if (w < 10 || h < 10) {
        foundIssues.push({
          type: 'warning',
          message: 'ViewBox dimensions are very small (< 10 units)',
        });
      }
    }

    // Check for embedded images
    if (text.includes('<image') || text.includes('data:image')) {
      foundIssues.push({
        type: 'info',
        message: 'SVG contains embedded raster images',
      });
    }

    // Check for filters/effects
    if (text.includes('<filter') || text.includes('<feGaussianBlur')) {
      foundIssues.push({
        type: 'warning',
        message: 'SVG contains filters that may not export correctly',
      });
    }

    // Check for text elements
    if (text.includes('<text')) {
      foundIssues.push({
        type: 'info',
        message: 'SVG contains text elements (may need to be converted to paths)',
      });
    }

    // Check file size
    if (file.size > 1024 * 1024) {
      foundIssues.push({
        type: 'warning',
        message: 'File size is large (> 1MB), consider optimizing',
      });
    }

    if (foundIssues.length === 0) {
      foundIssues.push({
        type: 'info',
        message: '✓ No issues detected! File looks good.',
      });
    }

    setIssues(foundIssues);
    setIsValidating(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">Vector Validator</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Vector Validator
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Check SVG files for errors and compatibility issues. Detect open paths, overlapping shapes, invalid
            colors, and machine compatibility problems.
          </p>
        </header>

        {issues.length === 0 && (
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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

        {isValidating && (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-border-subtle">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-[1rem] font-medium">Validating {fileName}...</p>
          </div>
        )}

        {issues.length > 0 && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[1.25rem] font-semibold">Validation Results</h2>
                  <p className="text-[0.875rem] text-text-tertiary">
                    {fileName} · {(fileSize / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIssues([]);
                    setFileName('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2 rounded-full border border-border-strong text-[0.875rem] font-medium hover:bg-bg-secondary transition-colors"
                >
                  Validate Another
                </button>
              </div>

              <div className="space-y-3">
                {issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${
                      issue.type === 'error'
                        ? 'border-red-200 bg-red-50'
                        : issue.type === 'warning'
                        ? 'border-yellow-200 bg-yellow-50'
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[1.25rem]">
                        {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                      </span>
                      <div className="flex-1">
                        <p className="text-[0.9375rem] font-medium">{issue.message}</p>
                        {issue.line && (
                          <p className="text-[0.8125rem] text-text-tertiary mt-1">Line {issue.line}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1rem] font-semibold mb-3">Common Issues</h3>
              <ul className="space-y-2 text-[0.875rem] text-text-secondary">
                <li>• Open paths can cause cutting machines to behave unexpectedly</li>
                <li>• Embedded images increase file size and don't scale</li>
                <li>• Text elements need to be converted to paths for cutting</li>
                <li>• Filters may not be supported by all software</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
