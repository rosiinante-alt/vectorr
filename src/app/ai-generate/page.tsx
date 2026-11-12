'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Image as ImageIcon } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

const IMAGE_STYLES = [
  { id: 'photorealistic', label: 'Photorealistic', desc: 'Lifelike, detailed photography' },
  { id: 'illustration', label: 'Illustration', desc: 'Hand-drawn, artistic' },
  { id: 'digital_art', label: 'Digital Art', desc: 'Concept art, vibrant' },
  { id: 'watercolor', label: 'Watercolor', desc: 'Soft washes, painterly' },
  { id: 'oil_painting', label: 'Oil Painting', desc: 'Rich textures, classical' },
  { id: 'sketch', label: 'Sketch', desc: 'Pencil or pen drawing' },
  { id: 'pixel_art', label: 'Pixel Art', desc: 'Retro 8-bit / 16-bit' },
  { id: 'comic_book', label: 'Comic', desc: 'Bold lines, halftone shading' },
] as const;

const DIMENSIONS = [
  { label: 'Square (1:1)', width: 1024, height: 1024 },
  { label: 'Landscape (16:9)', width: 1024, height: 576 },
  { label: 'Portrait (9:16)', width: 576, height: 1024 },
  { label: 'Wide (2:1)', width: 1024, height: 512 },
] as const;

type ImageStyle = (typeof IMAGE_STYLES)[number]['id'];

export default function AiGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [style, setStyle] = useState<ImageStyle>('photorealistic');
  const [dimIndex, setDimIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageUrl: string; prompt: string; creditCost: number } | null>(null);

  const creditCost = CREDIT_COSTS.AI_IMAGE;
  const dim = DIMENSIONS[dimIndex];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe the image you want to generate');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'general',
          prompt: prompt.trim(),
          imageStyle: style,
          negativePrompt: negativePrompt.trim() || undefined,
          width: dim.width,
          height: dim.height,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Generation failed');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      <SiteHeader />
      <main className="flex-1 wrap py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
            >
              <ImageIcon className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
                AI Image Generator
              </span>
            </div>
            <h1 className="display mb-4">Generate Any Image with AI</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Describe your vision in plain language and generate high-quality images instantly
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {creditCost} credits per generation
            </p>
          </div>

          {/* Form */}
          <div
            className="rounded-[var(--radius-xl)] p-8 mb-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}
          >
            <div className="space-y-6">
              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Image Description <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A serene forest clearing at golden hour, rays of light filtering through tall pine trees"
                  rows={4}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg resize-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {prompt.length}/1000 — Be specific: include lighting, mood, colors, composition
                </p>
              </div>

              {/* Negative prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Negative Prompt{' '}
                  <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                    (optional — what to avoid)
                  </span>
                </label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="e.g. blurry, low quality, text, watermark"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium mb-3">Art Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {IMAGE_STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className="p-3 rounded-lg text-left transition-all"
                      style={{
                        background: style === s.id ? 'var(--accent)' : 'var(--bg-primary)',
                        border: `1px solid ${style === s.id ? 'var(--accent)' : 'var(--border)'}`,
                        color: style === s.id ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      <div className="font-medium text-sm">{s.label}</div>
                      <div className="text-xs opacity-75 mt-1">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-sm font-medium mb-3">Dimensions</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {DIMENSIONS.map((d, i) => (
                    <button
                      key={d.label}
                      onClick={() => setDimIndex(i)}
                      className="p-3 rounded-lg text-left transition-all"
                      style={{
                        background: dimIndex === i ? 'var(--accent)' : 'var(--bg-primary)',
                        border: `1px solid ${dimIndex === i ? 'var(--accent)' : 'var(--border)'}`,
                        color: dimIndex === i ? 'white' : 'var(--text-primary)',
                      }}
                    >
                      <div className="font-medium text-sm">{d.label}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {d.width}×{d.height}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="mt-6 p-4 rounded-lg flex items-start gap-3"
                style={{ background: 'var(--error-wash)', border: '1px solid var(--error)' }}
              >
                <span style={{ color: 'var(--error)' }}>⚠</span>
                <span style={{ color: 'var(--error)' }}>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-6 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating image…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Image ({creditCost} credits)
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div
              className="rounded-[var(--radius-xl)] p-8"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}
            >
              <h2 className="text-xl font-semibold mb-4">Your Generated Image</h2>
              <div className="rounded-lg overflow-hidden mb-4" style={{ background: 'var(--bg-primary)' }}>
                <img src={result.imageUrl} alt="AI generated" className="w-full" />
              </div>
              <div className="flex gap-3">
                <a
                  href={result.imageUrl}
                  download="ai-generated.png"
                  className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Download className="w-5 h-5" />
                  Download Image
                </a>
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  Generate Another
                </button>
              </div>
              <p className="text-xs mt-4" style={{ color: 'var(--text-tertiary)' }}>
                Prompt used: {result.prompt}
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
