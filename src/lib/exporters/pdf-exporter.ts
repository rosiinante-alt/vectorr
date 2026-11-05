import PDFDocument from 'pdfkit';
import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions } from './svg-utils';

/**
 * Vector PDF for print and prepress.
 *
 * The previous implementation rasterised the SVG through `sharp` and embedded a
 * PNG, which defeats the purpose of a vector product: the output could not be
 * scaled, recoloured or cut. Regions are now painted as real PDF paths, so the
 * file stays resolution-independent and the text-free geometry remains
 * editable in Illustrator. A raster fallback is only used if the trace has no
 * usable geometry at all.
 */
export class PDFExporter extends BaseExporter {
  format = 'pdf';

  async export(svgContent: string, options?: ExportOptions): Promise<Buffer> {
    const { width, height, minX, minY } = getDimensions(svgContent, options);
    const pointsPerUnit = 72 / (options?.dpi ?? 96);
    const pageWidth = Math.max(1, width * pointsPerUnit);
    const pageHeight = Math.max(1, height * pointsPerUnit);
    const shapes = extractShapes(svgContent);

    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        autoFirstPage: false,
        size: [pageWidth, pageHeight],
        margin: 0,
        compress: true,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.addPage();

      for (const shape of shapes) {
        const points = shape.points;
        if (points.length < 2) continue;

        const toX = (point: { x: number; y: number }) => (point.x - minX) * pointsPerUnit;
        const toY = (point: { x: number; y: number }) => (height - (point.y - minY)) * pointsPerUnit;

        doc.save();
        doc.fillOpacity(Math.max(0, Math.min(1, shape.opacity)));
        doc.fillColor(shape.fill);

        doc.moveTo(toX(points[0]), toY(points[0]));
        for (const point of points.slice(1)) doc.lineTo(toX(point), toY(point));
        doc.closePath();
        // Stroke as well as fill so a 1-unit-wide sliver still renders visibly
        // at small page sizes.
        doc.lineWidth(0.05).strokeColor(shape.fill).fillAndStroke();

        doc.restore();
      }

      doc.end();
    });
  }
}
