'use client';

import { useState } from 'react';
import { FileText, Loader2, Copy, Check } from 'lucide-react';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';

const CONTENT_TYPES = [
  {
    id: 'alt_text' as const,
    label: 'Alt Text',
    desc: 'Accessible image descriptions for web',
    placeholder: 'e.g. A minimalist mountain logo with blue gradient',
  },
  {
    id: 'etsy_listing' as const,
    label: 'Etsy Listing',
    desc: 'SEO-optimised product listing copy',
    placeholder: 'e.g. Hand-drawn floral wreath SVG for Cricut',
  },
  {
    id: 'product_description' as const,
    label: 'Product Description',
    desc: 'Marketing copy for any product',
    placeholder: 'e.g. Vector pack of 50 vintage botanical illustrations',
  },
  {
    id: 'blog_intro' as const,
    label: 'Blog Intro',
    desc: 'Engaging opening paragraph for articles',
    placeholder: 'e.g. How to use SVG files for laser cutting on a Glowforge',
  },
  {
    id: 'svg_description' as const,
    label: 'SVG Description',
    desc: 'Technical description of an SVG asset',
    placeholder: 'e.g. A geometric lion head with Celtic knotwork details',
  },
] as const;

type ContentType = (typeof CONTENT_TYPES)[number]['id'];

export default function AiDescribePage() {
  const [contentType, setContentType] = useState<ContentType>('alt_text');
  const [subject, setSubject] = useState('');
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [audience, setAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ content: string; type: ContentType } | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedType = CONTENT_TYPES.find((t) => t.id === contentType)!;

  const handleGenerate = async () => {
    if (!subject.trim()) {
      setError('Please describe the subject');
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
        .slice(0, 10);

      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: contentType,
          subject: subject.trim(),
          brandName: brandName.trim() || undefined,
          industry: industry.trim() || undefined,
          audience: audience.trim() || undefined,
          keywords: keywordsArray.length > 0 ? keywordsArray : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Generation failed');
        return;
      }

      setResult({ content: data.content, type: contentType });
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
              <FileText className="w-4 h-4" style={{ color: 'var(--text-accent)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-accent)' }}>
                AI Content Generator
              </span>
            </div>
            <h1 className="display mb-4">Generate Content &amp; Descriptions</h1>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Alt text, Etsy listings, product descriptions, and blog intros — all free
            </p>
            <div
              className="inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-accent)' }}
            >
              ✦ Always free — no credits required
            </div>
          </div>

          {/* Content type selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {CONTENT_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setContentType(t.id)}
                className="p-4 rounded-xl text-left transition-all"
                style={{
                  background: contentType === t.id ? 'var(--accent)' : 'var(--bg-secondary)',
                  border: `2px solid ${contentType === t.id ? 'var(--accent)' : 'var(--border)'}`,
                  color: contentType === t.id ? 'white' : 'var(--text-primary)',
                }}
              >
                <div className="font-semibold text-sm">{t.label}</div>
                <div className="text-xs opacity-75 mt-1">{t.desc}</div>
              </button>
            ))}
          </div>

          {/* Form */}
          <div
            className="rounded-[var(--radius-xl)] p-8 mb-8"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-1)' }}
          >
            <div className="space-y-5">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subject / Topic <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={selectedType.placeholder}
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-lg resize-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                />
                <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  {subject.length}/200
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Brand / Shop Name (optional)</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Your brand name"
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
                  <label className="block text-sm font-medium mb-2">Industry / Niche (optional)</label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Cricut crafting, digital art"
                    className="w-full px-4 py-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Audience */}
                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience (optional)</label>
                  <input
                    type="text"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. DIY crafters, small business owners"
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
                      (comma-separated, up to 10)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. SVG, vector, digital download"
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
              disabled={isGenerating || !subject.trim()}
              className="w-full mt-6 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Generate {selectedType.label} (Free)
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated {selectedType.label}</h2>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: copied ? 'var(--bg-primary)' : 'var(--accent)',
                    color: copied ? 'var(--text-primary)' : 'white',
                    border: `1px solid ${copied ? 'var(--border)' : 'transparent'}`,
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              <div
                className="p-6 rounded-lg whitespace-pre-wrap text-sm leading-relaxed"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              >
                {result.content}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  Generate Another
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
