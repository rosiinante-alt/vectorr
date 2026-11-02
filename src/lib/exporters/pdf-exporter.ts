import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { BaseExporter, type ExportOptions } from './base-exporter';
import { getDimensions } from './svg-utils';

export class PDFExporter extends BaseExporter {
  format = 'pdf';
  async export(svgContent: string, options?: ExportOptions): Promise<Buffer> {
    const { width, height } = getDimensions(svgContent, options);
    const dpi = options?.dpi ?? 144;
    const png = await sharp(Buffer.from(svgContent)).resize({ width: Math.max(1, Math.round(width * dpi / 96)), height: Math.max(1, Math.round(height * dpi / 96)), fit: 'fill' }).png({ quality: options?.quality }).toBuffer();
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ autoFirstPage: false, size: [width * 72 / 96, height * 72 / 96], margin: 0 });
      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      doc.addPage().image(png, 0, 0, { width: width * 72 / 96, height: height * 72 / 96 });
      doc.end();
    });
  }
}
