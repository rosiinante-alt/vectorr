'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Palette } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

const PATTERN_STYLES = [
  { id: 'floral', label: 'Floral', desc: 'Hand-drawn flowers, botanical' },
  { id: 'geometric', label: 'Geometric', desc: 'Abstract shapes, symmetrical' },
  { id: 'abstract', label: 'Abstract', desc: 'Organic forms, flowing lines' },
  { id: 'botanical', label: 'Botanical', desc: 'Leaves, plants, nature' },
  { id: 'retro', label: 'Retro', desc: '70s inspired, groovy' },
  { id: 'minimal', label: 'Minimal', desc: 'Subtle, clean geometry' },
  { id: 'folk', label: 'Folk Art', desc: 'Traditional motifs, vibrant' },
] as const;

export default function GeneratePatternPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<string>('geometric');
  const [colorPalette, setColorPalette] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageUrl: string; prompt: string; creditCost: number } | null>(null);

  const creditCost = CREDIT_COSTS.AI_GENERATE;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your pattern');
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
          type: 'pattern',
          prompt: prompt.trim(),
          patternStyle: style,
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <Palette className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>AI Pattern Generator</span>
            </div>
            <h1 className="display mb-4">Generate Seamless Patterns</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Create tileable surface patterns for fabric, wallpaper, and print-on-demand
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {creditCost} credit per generation
            </p>
          </div>

          <div className="rounded-[var(--radius-xl)] p-8 mb-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Pattern Description <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Delicate cherry blossoms on branches, soft pink petals"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {prompt.length}/1000
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Pattern Style</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {PATTERN_STYLES.map((s) => (
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

              <div>
                <label className="block text-sm font-medium mb-2">Color Palette (optional)</label>
                <input
                  type="text"
                  value={colorPalette}
                  onChange={(e) => setColorPalette(e.target.value)}
                  placeholder="e.g. pastel pink and green, monochrome black"
                  className="w-full px-4 py-3 rounded-lg"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 rounded-lg flex items-start gap-3" style={{ background: 'var(--error-wash)', border: '1px solid var(--error)' }}>
                <span style={{ color: 'var(--error)' }}>⚠</span>
                <span style={{ color: 'var(--error)' }}>{error}</span>
              </div>
            )}

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
                  Generate Pattern ({creditCost} credit)
                </>
              )}
            </button>
          </div>

          {result && (
            <div className="rounded-[var(--radius-xl)] p-8" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}>
              <h2 className="text-xl font-semibold mb-4">Your Pattern</h2>
              <div className="rounded-lg overflow-hidden mb-4" style={{ background: 'white' }}>
                <img src={result.imageUrl} alt="Generated pattern" className="w-full" />
              </div>
              <div className="flex gap-3">
                <a
                  href={result.imageUrl}
                  download="pattern.png"
                  className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Download className="w-5 h-5" />
                  Download Pattern
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
