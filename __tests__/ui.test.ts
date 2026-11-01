import { formatBytes, formatCount, percentSaved, cn } from '@/lib/ui';

describe('cn', () => {
  it('merges class names and resolves tailwind conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c');
  });
});

describe('formatBytes', () => {
  it('formats bytes below 1KB without a unit conversion', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(512)).toBe('512 B');
  });

  it('uses one decimal below 10 units and none above', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(50 * 1024)).toBe('50 KB');
  });

  it('climbs to MB and GB', () => {
    expect(formatBytes(2.41 * 1024 * 1024)).toBe('2.4 MB');
    expect(formatBytes(3 * 1024 * 1024 * 1024)).toBe('3.0 GB');
  });

  it('returns an em dash for missing or invalid input', () => {
    expect(formatBytes(null)).toBe('—');
    expect(formatBytes(undefined)).toBe('—');
    expect(formatBytes(Number.NaN)).toBe('—');
  });
});

describe('formatCount', () => {
  it('thousands-separates integers', () => {
    expect(formatCount(41203)).toBe('41,203');
    expect(formatCount(0)).toBe('0');
  });

  it('returns an em dash for missing input', () => {
    expect(formatCount(null)).toBe('—');
    expect(formatCount(undefined)).toBe('—');
  });
});

describe('percentSaved', () => {
  it('rounds to one decimal', () => {
    expect(percentSaved(1000, 250)).toBe(75);
    expect(percentSaved(3, 2)).toBe(33.3);
  });

  it('never reports a negative saving', () => {
    expect(percentSaved(100, 150)).toBe(0);
  });

  it('guards against a zero or invalid original', () => {
    expect(percentSaved(0, 0)).toBe(0);
    expect(percentSaved(Number.NaN, 5)).toBe(0);
  });
});
