import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

function rgbOf(hex: string): [number, number, number] {
  const value = Number.parseInt(hex.slice(1), 16);
  return [((value >> 16) & 0xff) / 255, ((value >> 8) & 0xff) / 255, (value & 0xff) / 255];
}

/**
 * Encapsulated PostScript for Illustrator, CorelDRAW and print shops.
 *
 * The previous version emitted *stroked* outlines, which draws every traced
 * region as a hairline — the artwork came out as a ghost of itself. Traced SVG
 * paints regions with `fill`, so each region is emitted as a filled path with
 * `eofill` (even-odd, matching SVG's default fill rule).
 *
 * Also fixes the coordinate space: the old `72/96` scale produced coordinates
 * outside the declared BoundingBox, so page-fitting tools cropped the art. Here
 * the page is sized from the viewBox in points and every coordinate lands
 * inside it.
 */
export class EPSExporter extends BaseExporter {
  format = 'eps';

  async export(svgContent: string, options?: ExportOptions): Promise<string> {
    const { width, height, minX, minY } = getDimensions(svgContent, options);
    const pointsPerUnit = 72 / (options?.dpi ?? 96);
    const pageWidth = width * pointsPerUnit;
    const pageHeight = height * pointsPerUnit;
    const shapes = extractShapes(svgContent);

    const lines: string[] = [
      '%!PS-Adobe-3.0 EPSF-3.0',
      `%%BoundingBox: 0 0 ${Math.ceil(pageWidth)} ${Math.ceil(pageHeight)}`,
      '%%Title: Vector Image',
      '%%Creator: Vectroy',
      '%%LanguageLevel: 2',
      '%%Pages: 1',
      '%%EndComments',
      '%%BeginProlog',
      '/v { newpath moveto } bind def',
      '/l { lineto } bind def',
      '/f { eofill } bind def',
      '%%EndProlog',
    ];

    for (const shape of shapes) {
      const points = shape.points;
      if (points.length < 2) continue;

      const x = (point: { x: number; y: number }) => (point.x - minX) * pointsPerUnit;
      const y = (point: { x: number; y: number }) => (height - (point.y - minY)) * pointsPerUnit;

      const [r, g, b] = rgbOf(shape.fill);
      lines.push(
        `gsave ${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} setrgbcolor`,
        `${x(points[0]).toFixed(3)} ${y(points[0]).toFixed(3)} v`,
      );
      for (const point of points.slice(1)) {
        lines.push(`${x(point).toFixed(3)} ${y(point).toFixed(3)} l`);
      }
      lines.push('closepath f grestore');
    }

    lines.push('showpage', '%%EOF');
    return lines.join('\n') + '\n';
  }
}
