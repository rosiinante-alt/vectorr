import { ColorSeparationExporter } from '../src/lib/exporters/color-separation-exporter';
import { describe, it, expect } from '@jest/globals';

describe('ColorSeparationExporter', () => {
  const exporter = new ColorSeparationExporter();

  const multiColorSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <path d="M 10,10 L 30,10 L 30,30 L 10,30 Z" fill="#ff0000" />
      <path d="M 40,10 L 60,10 L 60,30 L 40,30 Z" fill="#00ff00" />
      <path d="M 70,10 L 90,10 L 90,30 L 70,30 Z" fill="#0000ff" />
      <path d="M 10,40 L 30,40 L 30,60 L 10,60 Z" fill="#ff0000" />
      <path d="M 40,40 L 60,40 L 60,60 L 40,60 Z" fill="#000000" />
    </svg>
  `;

  it('should have correct format identifier', () => {
    expect(exporter.format).toBe('color-separation');
  });

  it('should export multi-color SVG as a zip buffer', async () => {
    const result = await exporter.export(multiColorSvg);
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should separate colors into layers', async () => {
    const layers = await exporter.exportLayers(multiColorSvg);
    
    // Should have at least 4 unique colors: red, green, blue, black
    expect(layers.length).toBeGreaterThanOrEqual(4);
    
    // Each layer should have proper structure
    for (const layer of layers) {
      expect(layer.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(typeof layer.colorName).toBe('string');
      expect(layer.svg).toContain('<?xml');
      expect(layer.svg).toContain('<svg');
      expect(layer.filename).toMatch(/\.svg$/);
    }
  });

  it('should support RGB separation mode by default', async () => {
    const layers = await exporter.exportLayers(multiColorSvg);
    
    // In RGB mode, each unique color gets its own layer
    const colors = new Set(layers.map(l => l.color));
    expect(colors.size).toBeGreaterThanOrEqual(4);
  });

  it('should support CMYK separation mode', async () => {
    const layers = await exporter.exportLayers(multiColorSvg, { cmykMode: true });
    
    // In CMYK mode, we should have at most 4 layers (C, M, Y, K)
    expect(layers.length).toBeLessThanOrEqual(4);
    
    // Check that layer names match CMYK channels
    const names = layers.map(l => l.colorName);
    for (const name of names) {
      expect(['cyan', 'magenta', 'yellow', 'black']).toContain(name);
    }
  });

  it('should exclude black when includeBlack is false', async () => {
    const layers = await exporter.exportLayers(multiColorSvg, { includeBlack: false });
    
    // Should not have a black layer
    const hasBlack = layers.some(l => l.colorName === 'black' || l.color === '#000000');
    expect(hasBlack).toBe(false);
  });

  it('should use custom base name', async () => {
    const layers = await exporter.exportLayers(multiColorSvg, { baseName: 'custom' });
    
    // All filenames should start with the custom base name
    for (const layer of layers) {
      expect(layer.filename).toMatch(/^custom-/);
    }
  });

  it('should handle SVG with no shapes gracefully', async () => {
    const emptySvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';
    
    await expect(exporter.export(emptySvg)).rejects.toThrow('No shapes found in SVG');
  });

  it('should group similar colors based on threshold', async () => {
    const similarColorsSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
        <path d="M 10,10 L 30,10 L 30,30 L 10,30 Z" fill="#ff0000" />
        <path d="M 40,10 L 60,10 L 60,30 L 40,30 Z" fill="#ff0001" />
        <path d="M 70,10 L 90,10 L 90,30 L 70,30 Z" fill="#ff0002" />
      </svg>
    `;
    
    // With high threshold, similar colors should be grouped together
    const layers = await exporter.exportLayers(similarColorsSvg, { threshold: 10 });
    
    // Should have only 1 layer since colors are very similar
    expect(layers.length).toBe(1);
  });

  it('should generate valid SVG for each layer', async () => {
    const layers = await exporter.exportLayers(multiColorSvg);
    
    for (const layer of layers) {
      // Check SVG structure
      expect(layer.svg).toContain('<?xml version="1.0"');
      expect(layer.svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(layer.svg).toContain('viewBox="0 0 100 100"');
      expect(layer.svg).toContain('<path');
      expect(layer.svg).toContain('fill=');
    }
  });

  it('should preserve original dimensions', async () => {
    const layers = await exporter.exportLayers(multiColorSvg);
    
    for (const layer of layers) {
      expect(layer.svg).toContain('viewBox="0 0 100 100"');
      expect(layer.svg).toContain('width="100"');
      expect(layer.svg).toContain('height="100"');
    }
  });
});
