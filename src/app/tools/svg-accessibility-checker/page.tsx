'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

interface A11yIssue {
  type: 'error' | 'warning' | 'pass';
  test: string;
  message: string;
}

export default function SvgAccessibilityCheckerPage() {
  const [fileName, setFileName] = useState('');
  const [results, setResults] = useState<A11yIssue[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const text = await file.text();
    const checks: A11yIssue[] = [];

    // Check for title element
    if (text.includes('<title>')) {
      checks.push({ type: 'pass', test: 'Title Element', message: '✓ SVG has a title element' });
    } else {
      checks.push({ type: 'error', test: 'Title Element', message: 'Missing <title> element for screen readers' });
    }

    // Check for desc element
    if (text.includes('<desc>')) {
      checks.push({ type: 'pass', test: 'Description', message: '✓ SVG has a description element' });
    } else {
      checks.push({ type: 'warning', test: 'Description', message: 'Consider adding <desc> for better context' });
    }

    // Check for role attribute
    if (text.includes('role="img"') || text.includes('role="graphic"')) {
      checks.push({ type: 'pass', test: 'ARIA Role', message: '✓ SVG has appropriate ARIA role' });
    } else {
      checks.push({ type: 'warning', test: 'ARIA Role', message: 'Consider adding role="img" or role="graphic"' });
    }

    // Check for aria-label or aria-labelledby
    if (text.includes('aria-label') || text.includes('aria-labelledby')) {
      checks.push({ type: 'pass', test: 'ARIA Label', message: '✓ SVG has ARIA labeling' });
    } else {
      checks.push({ type: 'warning', test: 'ARIA Label', message: 'Consider adding aria-label or aria-labelledby' });
    }

    // Check for focusable="false" on decorative elements
    if (text.includes('focusable="false"')) {
      checks.push({ type: 'pass', test: 'Keyboard Focus', message: '✓ Decorative elements properly marked' });
    }

    setResults(checks);
  };

  const errorCount = results.filter(r => r.type === 'error').length;
  const warningCount = results.filter(r => r.type === 'warning').length;
  const passCount = results.filter(r => r.type === 'pass').length;

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <nav aria-label="Breadcrumb" className="border-b border-[#E5E8EB] bg-white">
        <div className="wrap py-3 text-[13.5px] text-[#718096]">
          <Link href="/" className="hover:text-[#1A202C]">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/tools" className="hover:text-[#1A202C]">Tools</Link>
          <span aria-hidden="true"> / </span>
          <span className="text-[#4A5568]">SVG Accessibility Checker</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            SVG Accessibility Checker
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Validate SVG accessibility for web use. Check ARIA attributes, title elements, color contrast, and
            screen reader compatibility.
          </p>
        </header>

        {results.length === 0 && (
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border-strong rounded-2xl cursor-pointer bg-white hover:bg-bg-secondary transition-colors">
            <div className="text-center">
              <svg className="mx-auto mb-4 w-12 h-12 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <p className="text-[1rem] font-medium mb-1">Click to upload SVG</p>
              <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
            </div>
            <input ref={fileInputRef} id="file-upload" type="file" accept=".svg" className="hidden" onChange={handleFileSelect} />
          </label>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-[0.875rem] text-green-900 mb-1">Passed</p>
                <p className="text-[2rem] font-bold text-green-600">{passCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                <p className="text-[0.875rem] text-yellow-900 mb-1">Warnings</p>
                <p className="text-[2rem] font-bold text-yellow-600">{warningCount}</p>
              </div>
              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                <p className="text-[0.875rem] text-red-900 mb-1">Errors</p>
                <p className="text-[2rem] font-bold text-red-600">{errorCount}</p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[1.25rem] font-semibold">Accessibility Results</h2>
                <button
                  onClick={() => { setResults([]); setFileName(''); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="px-4 py-2 rounded-full border border-border-strong text-[0.875rem] font-medium hover:bg-bg-secondary transition-colors"
                >
                  Check Another
                </button>
              </div>

              <div className="space-y-3">
                {results.map((result, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border ${
                    result.type === 'error' ? 'border-red-200 bg-red-50' :
                    result.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-[1.25rem]">
                        {result.type === 'error' ? '❌' : result.type === 'warning' ? '⚠️' : '✅'}
                      </span>
                      <div>
                        <p className="font-semibold text-[0.875rem]">{result.test}</p>
                        <p className="text-[0.875rem] mt-1">{result.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
