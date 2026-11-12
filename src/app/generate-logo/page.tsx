'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Wand2 } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

const LOGO_STYLES = [
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean lines, simple shapes, modern' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro, distressed, letterpress feel' },
  { id: 'modern', label: 'Modern', desc: 'Sleek, professional, contemporary' },
  { id: 'geometric', label: 'Geometric', desc: 'Bold angles, symmetrical' },
  { id: 'playful', label: 'Playful', desc: 'Rounded, bright, friendly' },
  { id: 'bold', label: 'Bold', desc: 'High contrast, striking' },
  { id: 'elegant', label: 'Elegant', desc: 'Serif typography, luxury' },
] as const;

export default function GenerateLogoPage() {
  const [prompt, setPrompt] = useState('');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState<string>('modern');
  const [colorPalette, setColorPalette] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageUrl: string; prompt: string; creditCost: number } | null>(null);

  const creditCost = CREDIT_COSTS.AI_GENERATE;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your logo');
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
          type: 'logo',
          prompt: prompt.trim(),
          logoStyle: style,
          brandName: brandName.trim() || undefined,
          industry: industry.trim() || undefined,
          colorPalette: colorPalette.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Generation failed');
        setIsGenerating(false);
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <Wand2 className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>AI Logo Generator</span>
            </div>
            <h1 className="display mb-4">Generate Your Logo with AI</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Describe your brand and let AI create a professional logo in seconds
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {creditCost} credit per generation
            </p>
          </div>

          {/* Form */}
          <div className="rounded-[var(--radius-xl)] p-8 mb-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}>
            <div className="space-y-6">
              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Logo Description <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A mountain peak with a sunrise, symbolizing growth and adventure"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {prompt.length}/1000
                </p>
              </div>

              {/* Brand Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Brand Name (optional)</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Your brand or company name"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-medium mb-2">Industry (optional)</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. tech startup, coffee shop, fitness"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium mb-3">Logo Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {LOGO_STYLES.map((s) => (
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

              {/* Color Palette */}
              <div>
                <label className="block text-sm font-medium mb-2">Color Palette (optional)</label>
                <input
                  type="text"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  placeholder="e.g. blue and gold, earth tones, vibrant"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 rounded-lg flex items-start gap-3" style={{ background: 'var(--error-wash)', border: '1px solid var(--error)' }}>
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
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Logo ({creditCost} credit)
                </>
              )}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="rounded-[var(--radius-xl)] p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}>
              <h2 className="text-xl font-semibold mb-4">Your Logo</h2>
              <div className="rounded-lg overflow-hidden mb-4" style={{ background: 'white' }}>
                <img src={result.imageUrl} alt="Generated logo" className="w-full" />
              </div>
              <div className="flex gap-3">
                <a
                  href={result.imageUrl}
                  download="logo.png"
                  className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Download className="w-5 h-5" />
                  Download Logo
                </a>
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
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
