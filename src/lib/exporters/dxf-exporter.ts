import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

/** AutoCAD colour index for a handful of common trace colours. */
const ACI: Record<string, number> = {
  '#000000': 7, '#ffffff': 7, '#ff0000': 1, '#ffff00': 2, '#00ff00': 3,
  '#00ffff': 4, '#0000ff': 5, '#ff00ff': 6, '#808080': 8, '#c0c0c0': 9,
};

function aciFor(hex: string): number {
  if (ACI[hex]) return ACI[hex];
  const value = Number.parseInt(hex.slice(1), 16);
  const r = (value >> 16) & 0xff;
  const g = (value >> 8) & 0xff;
  const b = value & 0xff;
  // Coarse nearest-match against the standard AutoCAD palette's primaries and
  // greys; a full 256-entry table would not improve laser/cutter use.
  if (Math.abs(r - g) < 24 && Math.abs(g - b) < 24) {
    return [8, 9, 7, 7, 7, 6, 5, 4, 3, 2][Math.min(9, Math.round((r / 255) * 9))];
  }
  if (r > g && r > b) return g > b ? 1 : 6;
  if (g > r && g > b) return r > b ? 3 : 4;
  return r > g ? 5 : 2;
}

/**
 * DXF R12 for CNC, laser and vinyl cutters.
 *
 * Units are millimetres: the artwork's user units are treated as pixels (the
 * convention every SVG→DXF converter uses) and converted at 96 dpi, so a 1000
 * unit-wide trace arrives as 264.6 mm rather than a 1000 mm monster.
 *
 * Each painted region becomes one closed LWPOLYLINE carrying its fill colour as
 * an ACI index. A cut path only needs the outline, but a machine that engraves
 * uses the region, and the outline alone would be indistinguishable between two
 * differently-coloured areas.
 */
export class DXFExporter extends BaseExporter {
  format = 'dxf';

  async export(svgContent: string, options?: ExportOptions): Promise<string> {
    const { height, minX, minY } = getDimensions(svgContent, options);
    const mmPerUnit = 25.4 / (options?.dpi ?? 96);
    const shapes = extractShapes(svgContent);
    const pair = (code: number, value: string | number) => `${code}\n${value}\n`;

    let body = '';
    for (const shape of shapes) {
      if (shape.points.length < 2) continue;
      // DXF y grows upward and SVG y grows downward.
      const points = shape.points.map((point) => ({
        x: (point.x - minX) * mmPerUnit,
        y: (height - (point.y - minY)) * mmPerUnit,
      }));
      const closed = shape.closed || Math.hypot(
        points[0].x - points[points.length - 1].x,
        points[0].y - points[points.length - 1].y,
      ) < mmPerUnit * 0.01;

      body +=
        pair(0, 'LWPOLYLINE') +
        pair(100, 'AcDbEntity') +
        pair(8, '0') +
        pair(62, aciFor(shape.fill)) +
        pair(100, 'AcDbPolyline') +
        pair(90, points.length) +
        pair(70, closed ? 1 : 0) +
        // A constant width makes the line visible when printed/engraved.
        pair(43, '0.0');

      for (const point of points) {
        body += pair(10, point.x.toFixed(4)) + pair(20, point.y.toFixed(4));
      }
    }

    return (
      '0\nSECTION\n2\nHEADER\n' +
      '9\n$ACADVER\n1\nAC1009\n' +
      '9\n$INSUNITS\n70\n4\n' +
      '9\n$MEASUREMENT\n70\n1\n' +
      '0\nENDSEC\n' +
      '0\nSECTION\n2\nENTITIES\n' +
      body +
      '0\nENDSEC\n0\nEOF\n'
    );
  }
}
