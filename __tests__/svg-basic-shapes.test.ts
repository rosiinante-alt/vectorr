import { extractShapes } from '@/lib/exporters/svg-utils';
import { DXFExporter } from '@/lib/exporters/dxf-exporter';
import { EPSExporter } from '@/lib/exporters/eps-exporter';
import { EmbroideryExporter } from '@/lib/exporters/embroidery-exporter';

/**
 * Traced artwork is all `<path>`, but hand-written and Illustrator-exported
 * SVGs use basic geometry. Every exporter reads shapes through `extractShapes`,
 * so a gap there silently produced empty files.
 */
const BASIC_SHAPES_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect x="10" y="10" width="50" height="30" fill="#123456"/>
  <circle cx="140" cy="60" r="25" fill="#abcdef"/>
  <ellipse cx="60" cy="140" rx="40" ry="20" fill="#00ff00"/>
  <line x1="0" y1="190" x2="200" y2="190" stroke="#000"/>
  <polyline points="120,120 150,150 180,120" fill="#ff0000"/>
</svg>`;

describe('extractShapes — basic geometry', () => {
  const shapes = extractShapes(BASIC_SHAPES_SVG);

  it('reads rect, circle, ellipse, line and polyline elements', () => {
    // rect, circle, ellipse, line, polyline
    expect(shapes).toHaveLength(5);
  });

  it('keeps each element fill colour', () => {
    expect(shapes.map((shape) => shape.fill)).toEqual([
      '#123456',
      '#abcdef',
      '#00ff00',
      '#000000',
      '#ff0000',
    ]);
  });

  it('marks closed vs open geometry', () => {
    // rect, circle, ellipse closed; line, polyline open
    expect(shapes.map((shape) => shape.closed)).toEqual([true, true, true, false, false]);
  });

  it('builds a four-point rectangle at the expected coordinates', () => {
    expect(shapes[0].points).toEqual([
      { x: 10, y: 10 },
      { x: 60, y: 10 },
      { x: 60, y: 40 },
      { x: 10, y: 40 },
    ]);
  });

  it('approximates a circle with a closed polygon around its radius', () => {
    const circle = shapes[1];
    expect(circle.points.length).toBeGreaterThanOrEqual(32);
    expect(circle.points[0].x).toBeCloseTo(165, 5);
    expect(circle.points[0].y).toBeCloseTo(60, 5);
  });

  it('drops degenerate geometry', () => {
    const degenerate = extractShapes(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
        <rect x="0" y="0" width="0" height="5" fill="#000"/>
        <circle cx="5" cy="5" r="0" fill="#000"/>
        <rect x="0" y="0" width="5" height="5" fill="none"/>
      </svg>`,
    );
    expect(degenerate).toHaveLength(0);
  });
});

describe('basic geometry survives export', () => {
  it('DXF emits geometry for an SVG of shapes', async () => {
    const out = await new DXFExporter().export(BASIC_SHAPES_SVG);
    expect(out.toString()).toContain('SECTION');
    expect(out.toString().length).toBeGreaterThan(200);
  });

  it('EPS emits geometry for an SVG of shapes', async () => {
    const out = await new EPSExporter().export(BASIC_SHAPES_SVG);
    expect(out.toString()).toContain('%!PS-Adobe');
  });

  it('embroidery no longer fails with "no shapes found"', async () => {
    await expect(new EmbroideryExporter('pes').export(BASIC_SHAPES_SVG)).resolves.toBeInstanceOf(
      Buffer,
    );
  });
});
