'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

type Channel = 'cyan' | 'magenta' | 'yellow' | 'black' | 'composite';

export default function ColorSeparationPage() {
  const [activeChannel, setActiveChannel] = useState<Channel>('composite');
  const [imageData, setImageData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageData(dataUrl);
      setActiveChannel('composite');
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImageData(null);
    setFileName('');
    setActiveChannel('composite');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderPreview = () => {
    if (!imageData || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      if (activeChannel === 'composite') {
        // Show original image
        return;
      }

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Simple CMYK simulation (RGB to CMYK)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        const k = 1 - Math.max(r, g, b);
        const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
        const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
        const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

        // Show only the selected channel
        if (activeChannel === 'cyan') {
          data[i] = 0;
          data[i + 1] = Math.round((1 - c) * 255);
          data[i + 2] = Math.round((1 - c) * 255);
        } else if (activeChannel === 'magenta') {
          data[i] = Math.round((1 - m) * 255);
          data[i + 1] = 0;
          data[i + 2] = Math.round((1 - m) * 255);
        } else if (activeChannel === 'yellow') {
          data[i] = Math.round((1 - y) * 255);
          data[i + 1] = Math.round((1 - y) * 255);
          data[i + 2] = 0;
        } else if (activeChannel === 'black') {
          const gray = Math.round((1 - k) * 255);
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };
    img.src = imageData;
  };

  // Re-render preview when channel changes
  if (imageData && canvasRef.current) {
    setTimeout(renderPreview, 0);
  }

  const channels: { id: Channel; label: string; color: string }[] = [
    { id: 'composite', label: 'Composite', color: '#6B7280' },
    { id: 'cyan', label: 'Cyan', color: '#06B6D4' },
    { id: 'magenta', label: 'Magenta', color: '#EC4899' },
    { id: 'yellow', label: 'Yellow', color: '#FCD34D' },
    { id: 'black', label: 'Black', color: '#1F2937' },
  ];

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
          <span className="text-[#4A5568]">Color Separation</span>
        </div>
      </nav>

      <div className="wrap py-12">
        <header className="mb-8">
          <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-bold mb-3 tracking-[-0.02em]">
            Color Separation Preview
          </h1>
          <p className="text-[1.0625rem] text-text-secondary max-w-2xl">
            Preview CMYK color separations for screen printing and offset printing. See each color plate
            individually and check registration alignment.
          </p>
        </header>

        {!imageData && (
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
                <p className="text-[1rem] font-medium mb-1">Click to upload image</p>
                <p className="text-[0.875rem] text-text-tertiary">or drag and drop</p>
                <p className="mt-2 text-[0.8125rem] text-text-tertiary">
                  JPG, PNG, SVG, or PDF
                </p>
              </div>
              <input
                ref={fileInputRef}
                id="file-upload"
                type="file"
                accept="image/*,.pdf,.svg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </div>
        )}

        {imageData && (
          <div>
            {/* Channel Selector */}
            <div className="mb-6 p-4 rounded-xl bg-white border border-border-subtle">
              <div className="flex flex-wrap gap-3">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`px-4 py-2 rounded-lg text-[0.875rem] font-medium transition-all ${
                      activeChannel === channel.id
                        ? 'bg-accent text-white'
                        : 'bg-bg-secondary border border-border-strong hover:bg-bg-tertiary'
                    }`}
                    style={
                      activeChannel === channel.id
                        ? { backgroundColor: channel.color, borderColor: channel.color }
                        : {}
                    }
                  >
                    {channel.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Canvas */}
            <div className="mb-6 p-4 rounded-xl bg-white border border-border-subtle">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[1rem] font-semibold">{fileName}</h3>
                <span className="text-[0.875rem] text-text-tertiary">
                  {activeChannel === 'composite' ? 'Original' : `${channels.find(c => c.id === activeChannel)?.label} Plate`}
                </span>
              </div>
              <div className="relative bg-[#F3F4F6] rounded-lg overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-auto max-h-[600px] object-contain" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="px-6 h-11 rounded-full border border-border-strong font-semibold hover:bg-bg-secondary transition-colors"
              >
                Upload Another
              </button>
            </div>

            {/* Info */}
            <div className="mt-8 p-6 rounded-xl bg-bg-secondary border border-border-subtle">
              <h3 className="text-[1.125rem] font-semibold mb-3">About Color Separations</h3>
              <p className="text-[0.9375rem] text-text-secondary leading-relaxed mb-4">
                This preview simulates CMYK color separations by converting RGB values to CMYK. Each button
                shows one color plate (cyan, magenta, yellow, or black). In screen printing, each plate
                corresponds to one screen; in offset printing, one printing plate.
              </p>
              <p className="text-[0.875rem] text-text-tertiary leading-relaxed">
                Note: This is a basic simulation for previewing separations. For production files, use
                professional RIP software that supports spot colors, underbase, and halftone screening.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
