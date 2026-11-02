import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

export class DXFExporter extends BaseExporter {
  format = 'dxf';
  async export(svgContent: string, options?: ExportOptions): Promise<string> {
    const dims = getDimensions(svgContent, options);
    const scale = (options?.dpi ?? 96) / 25.4;
    const shapes = extractShapes(svgContent);
    const pair = (code: number, value: string | number) => `${code}\n${value}\n`;
    let body = '';
    for (const shape of shapes) {
      body += pair(0, 'LWPOLYLINE') + pair(100, 'AcDbEntity') + pair(8, '0') + pair(100, 'AcDbPolyline') + pair(90, shape.points.length) + pair(70, shape.closed ? 1 : 0);
      for (const point of shape.points) {
        body += pair(10, ((point.x - dims.minX) * scale).toFixed(4)) + pair(20, ((dims.height - (point.y - dims.minY)) * scale).toFixed(4));
      }
    }
    return `0\nSECTION\n2\nHEADER\n9\n$INSUNITS\n70\n4\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n${body}0\nENDSEC\n0\nEOF\n`;
  }
}
