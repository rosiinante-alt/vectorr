import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

export class EPSExporter extends BaseExporter {
  format = 'eps';
  async export(svgContent: string, options?: ExportOptions): Promise<string> {
    const { width, height, minX, minY } = getDimensions(svgContent, options);
    const scale = 72 / (options?.dpi ?? 96);
    const lines = [`%!PS-Adobe-3.0 EPSF-3.0`, `%%BoundingBox: 0 0 ${Math.ceil(width * scale)} ${Math.ceil(height * scale)}`, '%%Title: Vector Image', '%%Creator: Vectorr', '%%Pages: 1', '1 setlinejoin 1 setlinecap'];
    for (const shape of extractShapes(svgContent)) {
      const points = shape.points;
      if (!points.length) continue;
      lines.push('newpath', `${((points[0].x-minX)*scale).toFixed(3)} ${((height-(points[0].y-minY))*scale).toFixed(3)} moveto`);
      for (const point of points.slice(1)) lines.push(`${((point.x-minX)*scale).toFixed(3)} ${((height-(point.y-minY))*scale).toFixed(3)} lineto`);
      if (shape.closed) lines.push('closepath');
      lines.push('stroke');
    }
    lines.push('showpage', '%%EOF');
    return lines.join('\n') + '\n';
  }
}
