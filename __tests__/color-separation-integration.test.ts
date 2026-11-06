import { exportFile } from '../src/lib/exporters';
import { describe, it, expect } from '@jest/globals';

describe('Color Separation Integration', () => {
  const testSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <path d="M 10,10 L 30,10 L 30,30 L 10,30 Z" fill="#ff0000" />
      <path d="M 40,10 L 60,10 L 60,30 L 40,30 Z" fill="#00ff00" />
      <path d="M 70,10 L 90,10 L 90,30 L 70,30 Z" fill="#0000ff" />
    </svg>
  `;

  it('should export color-separation format via exportFile', async () => {
    const result = await exportFile('color-separation', testSvg);
    
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle unknown format gracefully', async () => {
    await expect(exportFile('unknown-format', testSvg)).rejects.toThrow('Unsupported export format');
  });

  it('should pass options through to exporter', async () => {
    const result = await exportFile('color-separation', testSvg, { 
      includeBlack: false,
      threshold: 5,
      baseName: 'custom',
    });
    
    expect(Buffer.isBuffer(result)).toBe(true);
  });
});
