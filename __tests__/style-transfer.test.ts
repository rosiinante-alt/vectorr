import { normalizeOutput } from '@/lib/ai/style-transfer-service';
import {
  getPreset,
  getPresetsByCategory,
  isStylePresetId,
  STYLE_CATEGORIES,
  STYLE_PRESETS,
} from '@/lib/ai/style-transfer-presets';

describe('STYLE_PRESETS', () => {
  it('has unique ids', () => {
    const ids = STYLE_PRESETS.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses declared categories', () => {
    for (const preset of STYLE_PRESETS) {
      expect(STYLE_CATEGORIES).toContain(preset.category);
    }
  });

  it('uses owner/name model identifiers and never supplies image itself', () => {
    for (const preset of STYLE_PRESETS) {
      expect(preset.replicateModel).toMatch(/^[^/]+\/[^/:]+(:[^/]+)?$/);
      expect(preset.params).not.toHaveProperty('image');
    }
  });
});

describe('preset helpers', () => {
  it('finds a preset by id', () => {
    expect(getPreset('watercolor')?.name).toBe('Watercolor');
    expect(getPreset('nope')).toBeUndefined();
  });

  it('filters by category', () => {
    const artistic = getPresetsByCategory('artistic');
    expect(artistic.length).toBeGreaterThan(0);
    expect(artistic.every((preset) => preset.category === 'artistic')).toBe(true);
  });

  it('validates preset ids', () => {
    expect(isStylePresetId('oil-painting')).toBe(true);
    expect(isStylePresetId('')).toBe(false);
    expect(isStylePresetId(null)).toBe(false);
  });
});

describe('normalizeOutput', () => {
  it('accepts a plain URL string', () => {
    expect(normalizeOutput('https://example.com/a.png')).toBe('https://example.com/a.png');
  });

  it('accepts an array and picks the first URL', () => {
    expect(normalizeOutput(['https://example.com/a.png', 'https://example.com/b.png'])).toBe(
      'https://example.com/a.png',
    );
  });

  it('accepts a FileOutput-like object exposing url()', () => {
    const output = { url: () => new URL('https://example.com/file.png') };
    expect(normalizeOutput(output)).toBe('https://example.com/file.png');
  });

  it('throws when there is no image URL', () => {
    expect(() => normalizeOutput('not-a-url')).toThrow(/no image URL/);
    expect(() => normalizeOutput([])).toThrow(/no image URL/);
    expect(() => normalizeOutput({})).toThrow(/no image URL/);
  });
});