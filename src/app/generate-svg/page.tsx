'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Download, Code2 } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

const SVG_STYLES = [
  { id: 'flat', label: 'Flat', desc: 'Simple, clean, modern flat style' },
  { id: 'outline', label: 'Outline', desc: 'Line-art, minimal fills' },
  { id: 'isometric', label: 'Isometric', desc: '3D perspective, technical' },
  { id: 'abstract', label: 'Abstract', desc: 'Geometric shapes, artistic' },
  { id: 'nature', label: 'Nature', desc: 'Organic shapes, botanical' },
  { id: 'technical', label: 'Technical', desc: 'Diagrams, blueprint style' },
] as const;

type SvgStyle = (typeof SVG_STYLES)[number]['id'];

export default function GenerateSvgPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<SvgStyle>('flat');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ imageUrl: string; prompt: string; creditCost: number } | null>(null);

  const creditCost = CREDIT_COSTS.AI_GENERATE;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe your SVG illustration');
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
          type: 'svg_illustration',
          prompt: prompt.trim(),
          imageStyle: style,
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
              <Code2 className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
                AI SVG Illustration Generator
              </span>
            </div>
            <h1 className="display mb-4">Generate SVG Illustrations with AI</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Describe a scene or concept and get a clean, scalable illustration
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
                  Illustration Description <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. A mountain landscape with pine trees and a full moon, minimalist flat style"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg resize-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {prompt.length}/1000
                </p>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium mb-3">Illustration Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SVG_STYLES.map((s) => (
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
                  Generating illustration…
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate SVG ({creditCost} credits)
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
              <h2 className="text-xl font-semibold mb-4">Your Illustration</h2>
              <div className="rounded-lg overflow-hidden mb-4" style={{ background: 'white' }}>
                <img src={result.imageUrl} alt="Generated SVG illustration" className="w-full" />
              </div>
              <div className="flex gap-3">
                <a
                  href={result.imageUrl}
                  download="illustration.png"
                  className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Download className="w-5 h-5" />
                  Download Illustration
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
