'use client';

import { useState, useRef } from 'react';
import { Zap, Loader2, Download, Play, ChevronDown, ChevronUp } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

interface TierConfig {
  id: 'eco' | 'standard' | 'pro';
  label: string;
  desc: string;
  creditKey: 'ANIMATE_ECO' | 'ANIMATE_STANDARD' | 'ANIMATE_PRO';
  badge?: string;
  features: string[];
}

const TIERS: TierConfig[] = [
  {
    id: 'eco' as const,
    label: 'Eco',
    desc: 'Smooth fade-in entrance animation',
    creditKey: 'ANIMATE_ECO' as const,
    badge: 'Free',
    features: ['Fade-in entrance', 'Opacity transition', '1 credit'],
  },
  {
    id: 'standard' as const,
    label: 'Standard',
    desc: 'Stroke drawing + staggered entrances',
    creditKey: 'ANIMATE_STANDARD' as const,
    features: ['Stroke path drawing', 'Staggered element entrance', 'Scale + fade effects'],
  },
  {
    id: 'pro' as const,
    label: 'Pro',
    desc: 'Morph, parallax, and looping sequences',
    creditKey: 'ANIMATE_PRO' as const,
    badge: 'Most detailed',
    features: ['Morphing shapes', 'Parallax layers', 'Looping sequences', 'Color transitions'],
  },
] as const;

type Tier = (typeof TIERS)[number]['id'];

export default function AiAnimatePage() {
  const [svgInput, setSvgInput] = useState('');
  const [tier, setTier] = useState<Tier>('eco');
  const [duration, setDuration] = useState(2);
  const [loop, setLoop] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ animatedSvg: string; tier: Tier; creditCost: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTier = TIERS.find((t) => t.id === tier)!;
  const creditCost = CREDIT_COSTS[selectedTier.creditKey];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      setError('Please upload an SVG file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setSvgInput((evt.target?.result as string) ?? '');
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleAnimate = async () => {
    if (!svgInput.trim()) {
      setError('Please paste or upload an SVG');
      return;
    }

    setIsAnimating(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/animate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg: svgInput.trim(),
          tier,
          duration,
          loop,
          respectReducedMotion: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Animation failed');
        return;
      }

      setResult(data);
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsAnimating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.animatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animated-${tier}.svg`;
    a.click();
    URL.revokeObjectURL(url);
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
              <Zap className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
                SVG Animation
              </span>
            </div>
            <h1 className="display mb-4">Animate Your SVGs</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Add CSS animations to any SVG — from simple fade-ins to complex morphing sequences
            </p>
          </div>

          {/* Tier selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {TIERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTier(t.id)}
                className="p-6 rounded-[var(--radius-xl)] text-left transition-all relative"
                style={{
                  background: tier === t.id ? 'var(--accent)' : 'var(--bg-secondary)',
                  border: `2px solid ${tier === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  color: tier === t.id ? 'white' : 'var(--text-primary)',
                }}
              >
                {t.badge && (
                  <span
                    className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: tier === t.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-primary)',
                      color: tier === t.id ? 'white' : 'var(--text-accent)',
                    }}
                  >
                    {t.badge}
                  </span>
                )}
                <div className="font-semibold text-lg mb-1">{t.label}</div>
                <div className="text-sm opacity-80 mb-3">{t.desc}</div>
                <div className="font-semibold text-sm">
                  {`${CREDIT_COSTS[t.creditKey]} ${CREDIT_COSTS[t.creditKey] === (1 as number) ? 'credit' : 'credits'}`}
                </div>
                <ul className="mt-3 space-y-1">
                  {t.features.map((f) => (
                    <li
                      key={f}
                      className="text-xs flex items-center gap-1.5"
                      style={{ opacity: tier === t.id ? 1 : 0.7 }}
                    >
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="rounded-[var(--radius-xl)] p-8 mb-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}
          >
            <div className="space-y-6">
              {/* SVG input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium">
                    SVG Content <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm px-3 py-1 rounded-lg transition-all"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Upload .svg file
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".svg,image/svg+xml"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
                <textarea
                  value={svgInput}
                  onChange={(e) => setSvgInput(e.target.value)}
                  placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">\n  <circle cx="50" cy="50" r="40" fill="currentColor"/>\n</svg>'}
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg resize-none font-mono text-sm"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Paste SVG markup directly or upload a .svg file. Max 500 KB.
                </p>
              </div>

              {/* Advanced options */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-medium transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Advanced options
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Duration: {duration}s
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.5}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        <span>1s</span>
                        <span>10s</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={loop}
                          onChange={(e) => setLoop(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div
                          className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            background: loop ? 'var(--accent)' : 'var(--border)',
                          }}
                        />
                      </label>
                      <span className="text-sm font-medium">Loop animation</span>
                    </div>
                  </div>
                )}
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
              onClick={handleAnimate}
              disabled={isAnimating || !svgInput.trim()}
              className="w-full mt-6 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              {isAnimating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Animating…
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Animate SVG
                  {` (${creditCost} ${creditCost === (1 as number) ? 'credit' : 'credits'})`}
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
              <h2 className="text-xl font-semibold mb-4">Animated SVG Preview</h2>

              {/* Live SVG preview */}
              <div
                className="rounded-lg p-8 mb-6 flex items-center justify-center"
                style={{ background: 'white', minHeight: '300px' }}
                // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted animated SVG returned from our own API
                dangerouslySetInnerHTML={{ __html: result.animatedSvg }}
              />

              {/* SVG source */}
              <details className="mb-6">
                <summary
                  className="cursor-pointer text-sm font-medium"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  View SVG source
                </summary>
                <pre
                  className="mt-3 p-4 rounded-lg overflow-x-auto text-xs font-mono"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  {result.animatedSvg}
                </pre>
              </details>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'var(--accent)', color: 'white' }}
                >
                  <Download className="w-5 h-5" />
                  Download Animated SVG
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  Animate Another
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
