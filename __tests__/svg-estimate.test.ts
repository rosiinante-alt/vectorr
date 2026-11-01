/**
 * @jest-environment jsdom
 */
import { TextEncoder as NodeTextEncoder } from 'util';

import { analyzeSvg, readSvgText } from '@/lib/svg-estimate';

// jsdom 29's window has no TextEncoder; the browser does, so polyfill it here
// rather than weakening the module under test.
if (!global.TextEncoder) {
  global.TextEncoder = NodeTextEncoder as unknown as typeof TextEncoder;
}

const CLEAN = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L10 10"/></svg>';

describe('analyzeSvg', () => {
  it('counts drawing elements and colours', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 L1 1" fill="#FF0000"/>
      <rect x="0" y="0" width="1" height="1" fill="#ff0000"/>
      <circle cx="1" cy="1" r="1" stroke="#00FF00"/>
      <text x="0" y="0">hi</text>
    </svg>`;

    const estimate = analyzeSvg(svg, 500);

    expect(estimate.nodes).toBe(4);
    expect(estimate.paths).toBe(1);
    // #FF0000 and #ff0000 collapse to one colour; #00FF00 is the second.
    expect(estimate.colors).toBe(2);
  });

  it('ignores none and currentColor when counting colours', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0" fill="none"/>
      <path d="M0 0" fill="currentColor"/>
    </svg>`;

    expect(analyzeSvg(svg, 200).colors).toBeNull();
  });

  it('returns null counts when there are no drawing elements', () => {
    const estimate = analyzeSvg('<svg xmlns="http://www.w3.org/2000/svg"/>', 60);

    expect(estimate.nodes).toBeNull();
    expect(estimate.paths).toBeNull();
    expect(estimate.colors).toBeNull();
  });

  it('measures removable metadata bytes', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><!-- editor: Illustrator --><path d="M0 0"/></svg>`;

    expect(analyzeSvg(svg, 500).metadataBytes).toBe('<!-- editor: Illustrator -->'.length);
  });

  it('counts surplus decimal precision as savings', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0.123456 0.654321 L1.111111 2.222222"/></svg>';
    const estimate = analyzeSvg(svg, 4000);

    expect(estimate.estimatedSavingsRatio).toBeGreaterThan(0);
    // Each of the 4 numbers has 6 decimals, so 4 surplus digits each = 16 bytes
    // out of 4000.
    expect(estimate.estimatedSavingsRatio).toBeCloseTo(16 / 4000, 4);
  });

  it('caps the savings estimate at 60%', () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg"><path d="M${'0.123456 '.repeat(200)}"/></svg>`;
    expect(analyzeSvg(svg, 100).estimatedSavingsRatio).toBeLessThanOrEqual(0.6);
  });

  it('never reports a negative ratio', () => {
    expect(analyzeSvg(CLEAN, 5000).estimatedSavingsRatio).toBe(0);
  });

  it('rejects malformed XML via the parsererror document', () => {
    const estimate = analyzeSvg('<svg><path d="M0 0"</svg>', 400);

    expect(estimate.nodes).toBeNull();
    expect(estimate.estimatedSavingsRatio).toBe(0);
  });

  it('rejects a non-svg root element', () => {
    expect(analyzeSvg('<html><body/></html>', 400).nodes).toBeNull();
  });

  it('short-circuits empty and oversized input', () => {
    expect(analyzeSvg(CLEAN, 0).nodes).toBeNull();
    expect(analyzeSvg(CLEAN, 11 * 1024 * 1024).nodes).toBeNull();
  });

  it('preserves the original byte count', () => {
    expect(analyzeSvg(CLEAN, 1234).originalBytes).toBe(1234);
  });
});

describe('readSvgText', () => {
  // jsdom's Blob predates File.text(), so build a minimal File-shaped object
  // with the two members readSvgText actually uses.
  function fileOf(content: string, name = 'a.svg'): File {
    return {
      name,
      type: 'image/svg+xml',
      text: async () => content,
    } as unknown as File;
  }

  it('returns the text for a valid svg', async () => {
    await expect(readSvgText(fileOf(CLEAN))).resolves.toBe(CLEAN);
  });

  it('throws when the root element is missing', async () => {
    await expect(readSvgText(fileOf('<html>nope</html>'))).rejects.toThrow(/<svg> root/);
  });

  it('only sniffs the first 4KB', async () => {
    const padded = `${'x'.repeat(5000)}<svg xmlns="http://www.w3.org/2000/svg"/>`;
    await expect(readSvgText(fileOf(padded))).rejects.toThrow();
  });
});
