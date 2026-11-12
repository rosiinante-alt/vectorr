'use client';

import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface FaviconSize {
  width: number;
  height: number;
  label: string;
  filename: string;
}

const FAVICON_SIZES: FaviconSize[] = [
  { width: 16, height: 16, label: '16×16 (favicon.ico)', filename: 'favicon-16x16.png' },
  { width: 32, height: 32, label: '32×32 (Standard)', filename: 'favicon-32x32.png' },
  { width: 180, height: 180, label: '180×180 (Apple Touch)', filename: 'apple-touch-icon.png' },
  { width: 192, height: 192, label: '192×192 (Android)', filename: 'android-chrome-192x192.png' },
  { width: 512, height: 512, label: '512×512 (PWA)', filename: 'android-chrome-512x512.png' },
];

export function FaviconGeneratorClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedFavicons, setGeneratedFavicons] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setOriginalImage(dataUrl);
      generateFavicons(dataUrl);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const generateFavicons = useCallback(async (imageDataUrl: string) => {
    setIsGenerating(true);
    const img = new Image();
    img.onload = async () => {
      const favicons: Record<string, string> = {};

      for (const size of FAVICON_SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, size.width, size.height);
          favicons[size.filename] = canvas.toDataURL('image/png');
        }
      }

      setGeneratedFavicons(favicons);
      setIsGenerating(false);
    };
    img.src = imageDataUrl;
  }, []);

  const downloadFavicon = useCallback((filename: string, dataUrl: string) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }, []);

  const downloadAll = useCallback(() => {
    Object.entries(generatedFavicons).forEach(([filename, dataUrl]) => {
      setTimeout(() => downloadFavicon(filename, dataUrl), 100);
    });
  }, [generatedFavicons, downloadFavicon]);

  const htmlSnippet = `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  return (
    <section className="pb-20" aria-labelledby="generator-heading">
      <div className="wrap">
        <h2 id="generator-heading" className="visually-hidden">
          Favicon Generator
        </h2>

        {!originalImage ? (
          /* Upload zone */
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="
              mx-auto max-w-2xl rounded-[var(--radius-xl)] border-2 border-dashed border-[var(--border)]
              bg-bg-secondary p-12 text-center cursor-pointer
              hover:border-accent hover:bg-bg-tertiary transition-colors
            "
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center gap-4">
              <svg
                viewBox="0 0 24 24"
                className="h-16 w-16 text-text-tertiary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <div>
                <p className="text-[18px] font-semibold">
                  Drop your logo here or click to upload
                </p>
                <p className="mt-2 text-[14px] text-text-tertiary">
                  PNG, JPG, or SVG · Square images work best
                </p>
              </div>
              <Button variant="primary" size="lg">
                Choose file
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        ) : (
          /* Results */
          <div className="space-y-8">
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  setOriginalImage(null);
                  setGeneratedFavicons({});
                }}
                variant="secondary"
                size="md"
              >
                Upload new image
              </Button>
              {Object.keys(generatedFavicons).length > 0 && (
                <Button onClick={downloadAll} variant="primary" size="md">
                  Download all ({FAVICON_SIZES.length} files)
                </Button>
              )}
            </div>

            {/* Preview grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FAVICON_SIZES.map((size) => {
                const dataUrl = generatedFavicons[size.filename];
                return (
                  <div
                    key={size.filename}
                    className="rounded-[var(--radius-lg)] bg-white p-6 shadow-[0_0_0_0.5px_var(--border),0_1px_2px_rgba(0,0,0,0.04)]"
                  >
                    <div className="mb-4 flex items-center justify-center bg-bg-secondary rounded-lg p-6 aspect-square">
                      {dataUrl ? (
                        <img
                          src={dataUrl}
                          alt={size.label}
                          style={{ width: size.width, height: size.height }}
                          className="pixelated"
                        />
                      ) : (
                        <div className="text-text-tertiary text-[14px]">
                          Generating...
                        </div>
                      )}
                    </div>
                    <h3 className="text-[15px] font-semibold mb-1">
                      {size.label}
                    </h3>
                    <p className="text-[13px] text-text-tertiary mb-3">
                      {size.width}×{size.height}px
                    </p>
                    {dataUrl && (
                      <Button
                        onClick={() => downloadFavicon(size.filename, dataUrl)}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        Download
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* HTML snippet */}
            {Object.keys(generatedFavicons).length > 0 && (
              <div className="rounded-[var(--radius-xl)] bg-code-background p-6 border border-[var(--border)]">
                <h3 className="text-[16px] font-semibold mb-3 text-code-foreground">
                  Add to your HTML &lt;head&gt;
                </h3>
                <pre className="text-[13px] font-mono text-code-foreground overflow-x-auto">
                  <code>{htmlSnippet}</code>
                </pre>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(htmlSnippet);
                  }}
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                >
                  Copy code
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
