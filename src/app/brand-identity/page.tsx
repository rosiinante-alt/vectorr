'use client';

import { useState } from 'react';
import { Layers, Loader2, Download, ExternalLink } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CREDIT_COSTS } from '@/lib/credits/constants';

const BRAND_STYLES = [
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean, modern, whitespace-led' },
  { id: 'modern', label: 'Modern', desc: 'Professional, contemporary' },
  { id: 'vintage', label: 'Vintage', desc: 'Retro, heritage, timeless' },
  { id: 'geometric', label: 'Geometric', desc: 'Bold shapes, symmetrical' },
  { id: 'playful', label: 'Playful', desc: 'Rounded, bright, friendly' },
  { id: 'elegant', label: 'Elegant', desc: 'Luxury, serif, refined' },
] as const;

type BrandStyle = (typeof BRAND_STYLES)[number]['id'];

interface BrandResult {
  primaryLogo: string;
  iconLogo: string;
  brandDescription: string;
  tagline: string;
  colorPalette: string[];
  fontSuggestions: { primary: string; secondary: string };
  creditCost: number;
}

export default function BrandIdentityPage() {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [style, setStyle] = useState<BrandStyle>('modern');
  const [colorPalette, setColorPalette] = useState('');
  const [audience, setAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BrandResult | null>(null);

  const creditCost = CREDIT_COSTS.BRAND_IDENTITY;

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      setError('Brand name is required');
      return;
    }
    if (!industry.trim()) {
      setError('Industry is required');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const keywordsArray = keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
        .slice(0, 5);

      const res = await fetch('/api/ai/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brandName.trim(),
          industry: industry.trim(),
          style,
          colorPalette: colorPalette.trim() || undefined,
          audience: audience.trim() || undefined,
          keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Brand generation failed');
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
              <Layers className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
                Brand Identity Generator
              </span>
            </div>
            <h1 className="display mb-4">Complete Brand Identity in Seconds</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Get a full brand package: logo, icon, tagline, color palette, and copy — all at once
            </p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              {creditCost} credits per brand package
            </p>
          </div>

          {/* What you get */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: '🖼', label: 'Primary Logo', desc: 'Full-colour PNG' },
              { icon: '⬟', label: 'Icon/Mark', desc: 'Square icon variant' },
              { icon: '✏️', label: 'Tagline', desc: 'Brand positioning line' },
              { icon: '🎨', label: 'Color Palette', desc: 'Curated brand colors' },
            ].map((item) => (
              <div
                key={item.label}
                className="p-4 rounded-xl text-center"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            className="rounded-[var(--radius-xl)] p-8 mb-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Brand name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Brand Name <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Oakwood Studio"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Industry <span style={{ color: 'var(--error)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. handmade furniture, tech startup"
                    maxLength={100}
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* Style */}
              <div>
                <label className="block text-sm font-medium mb-3">Brand Style</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BRAND_STYLES.map((s) => (
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Color palette */}
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Colors (optional)</label>
                  <input
                    type="text"
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                    placeholder="e.g. forest green and gold"
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Audience */}
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience (optional)</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. eco-conscious homeowners"
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Keywords{' '}
                    <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                      (up to 5, comma-separated)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. natural, craft, bespoke"
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
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
              disabled={isGenerating || !brandName.trim() || !industry.trim()}
              className="w-full mt-6 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating brand identity… (this may take 30–60s)
                </>
              ) : (
                <>
                  <Layers className="w-5 h-5" />
                  Generate Brand Identity ({creditCost} credits)
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
              <h2 className="text-2xl font-semibold mb-8">Your Brand Identity</h2>

              {/* Logos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Primary Logo
                  </h3>
                  <div className="rounded-lg overflow-hidden p-4" style={{ background: 'white' }}>
                    <img src={result.primaryLogo} alt={`${brandName} primary logo`} className="w-full" />
                  </div>
                  <a
                    href={result.primaryLogo}
                    download={`${brandName.toLowerCase().replace(/\s+/g, '-')}-logo.png`}
                    className="mt-3 w-full px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'var(--accent)', color: 'white' }}
                  >
                    <Download className="w-4 h-4" />
                    Download Primary Logo
                  </a>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Icon / Mark
                  </h3>
                  <div
                    className="rounded-lg overflow-hidden p-4 flex items-center justify-center"
                    style={{ background: 'white', minHeight: '200px' }}
                  >
                    <img
                      src={result.iconLogo}
                      alt={`${brandName} icon`}
                      className="max-w-[200px] max-h-[200px]"
                    />
                  </div>
                  <a
                    href={result.iconLogo}
                    download={`${brandName.toLowerCase().replace(/\s+/g, '-')}-icon.png`}
                    className="mt-3 w-full px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <Download className="w-4 h-4" />
                    Download Icon
                  </a>
                </div>
              </div>

              {/* Tagline */}
              <div
                className="p-6 rounded-xl mb-6"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Tagline
                </h3>
                <p className="text-xl font-semibold italic">{result.tagline}</p>
              </div>

              {/* Color palette */}
              {result.colorPalette && result.colorPalette.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Color Palette
                  </h3>
                  <div className="flex gap-3 flex-wrap">
                    {result.colorPalette.map((color, i) => (
                      <div key={i} className="text-center">
                        <div
                          className="w-16 h-16 rounded-lg border"
                          style={{ background: color, borderColor: 'var(--border)' }}
                        />
                        <p className="text-xs mt-1 font-mono" style={{ color: 'var(--text-tertiary)' }}>
                          {color}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Font suggestions */}
              {result.fontSuggestions && (
                <div
                  className="p-6 rounded-xl mb-6"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Suggested Fonts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Headings</p>
                      <p className="font-semibold mt-1">{result.fontSuggestions.primary}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Body</p>
                      <p className="font-semibold mt-1">{result.fontSuggestions.secondary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Brand description */}
              <div
                className="p-6 rounded-xl mb-6"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Brand Description
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {result.brandDescription}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  Generate Another Brand
                </button>
                <a
                  href="/convert"
                  className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all"
                  style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Convert to SVG
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
