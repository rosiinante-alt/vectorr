'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#6366f1" stroke="#4f46e5" stroke-width="4"/>
  <text x="100" y="110" font-size="24" text-anchor="middle" fill="white" font-family="sans-serif">
    Edit me!
  </text>
</svg>`;

export function SVGEditorClient() {
  const [code, setCode] = useState(DEFAULT_SVG);
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [svgDimensions, setSvgDimensions] = useState({ width: 200, height: 200 });

  const validateSVG = useCallback((svgCode: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      
      if (parserError) {
        setIsValid(false);
        setErrorMessage('Invalid SVG: XML parsing error');
        return false;
      }

      const svg = doc.querySelector('svg');
      if (!svg) {
        setIsValid(false);
        setErrorMessage('No <svg> root element found');
        return false;
      }

      // Extract dimensions
      const width = svg.getAttribute('width') || svg.getAttribute('viewBox')?.split(' ')[2] || '200';
      const height = svg.getAttribute('height') || svg.getAttribute('viewBox')?.split(' ')[3] || '200';
      setSvgDimensions({ 
        width: parseFloat(width), 
        height: parseFloat(height) 
      });

      setIsValid(true);
      setErrorMessage('');
      return true;
    } catch (err) {
      setIsValid(false);
      setErrorMessage('Invalid SVG: ' + (err instanceof Error ? err.message : 'Unknown error'));
      return false;
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateSVG(code);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [code, validateSVG]);

  const handleLoadFile = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.svg,image/svg+xml';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setCode(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited.svg';
    a.click();
    URL.revokeObjectURL(url);
  }, [code]);

  const handleClear = useCallback(() => {
    setCode(DEFAULT_SVG);
  }, []);

  const handleFormat = useCallback(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'image/svg+xml');
      const serializer = new XMLSerializer();
      const formatted = serializer.serializeToString(doc);
      
      // Basic prettification
      const prettified = formatted
        .replace(/></g, '>\n<')
        .split('\n')
        .map((line, i) => {
          const depth = (line.match(/</g) || []).length - (line.match(/\//g) || []).length;
          return '  '.repeat(Math.max(0, depth)) + line.trim();
        })
        .join('\n');
      
      setCode(prettified);
    } catch (err) {
      console.error('Format error:', err);
    }
  }, [code]);

  return (
    <section className="pb-20" aria-labelledby="editor-heading">
      <div className="wrap">
        <h2 id="editor-heading" className="visually-hidden">
          SVG Editor
        </h2>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Button onClick={handleLoadFile} variant="secondary" size="md">
            Load file
          </Button>
          <Button onClick={handleDownload} variant="secondary" size="md" disabled={!isValid}>
            Download
          </Button>
          <Button onClick={handleFormat} variant="secondary" size="md">
            Format XML
          </Button>
          <Button onClick={handleClear} variant="secondary" size="md">
            Clear
          </Button>
          
          <div className="ml-auto flex items-center gap-4 text-[14px]">
            <span className={`font-medium ${isValid ? 'text-success-text' : 'text-error-text'}`}>
              {isValid ? '✓ Valid SVG' : '✗ Invalid'}
            </span>
            {isValid && (
              <span className="text-text-tertiary">
                {svgDimensions.width} × {svgDimensions.height}
              </span>
            )}
          </div>
        </div>

        {/* Error message */}
        {!isValid && errorMessage && (
          <div className="mb-6 rounded-[var(--radius-lg)] bg-error-bg border border-error-border p-4">
            <p className="text-[14px] text-error-text font-medium">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Split pane */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Code editor */}
          <div className="flex flex-col">
            <label htmlFor="svg-code" className="mb-2 text-[15px] font-semibold">
              SVG Code
            </label>
            <textarea
              id="svg-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="
                flex-1 min-h-[500px] rounded-[var(--radius-lg)] 
                bg-code-background p-4 font-mono text-[13px] leading-relaxed
                text-code-foreground border border-[var(--border)]
                focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                resize-none
              "
              style={{
                tabSize: 2,
              }}
            />
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <div className="mb-2 text-[15px] font-semibold">
              Preview
            </div>
            <div className="
              flex-1 min-h-[500px] rounded-[var(--radius-lg)] 
              bg-bg-secondary border border-[var(--border)]
              flex items-center justify-center overflow-auto p-8
            ">
              {isValid ? (
                <div 
                  dangerouslySetInnerHTML={{ __html: code }}
                  className="max-w-full max-h-full"
                />
              ) : (
                <p className="text-text-tertiary text-[14px]">
                  Fix errors to see preview
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
