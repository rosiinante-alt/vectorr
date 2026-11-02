import { BaseExporter, type ExportOptions } from './base-exporter';
import { DXFExporter } from './dxf-exporter';
import { EmbroideryExporter } from './embroidery-exporter';
import { EPSExporter } from './eps-exporter';
import { GcodeExporter } from './gcode-exporter';
import { PDFExporter } from './pdf-exporter';
import { SVGExporter } from './svg-exporter';

const exporters: Record<string, BaseExporter> = {
  svg: new SVGExporter(), dxf: new DXFExporter(), eps: new EPSExporter(), gcode: new GcodeExporter(),
  pdf: new PDFExporter(), dst: new EmbroideryExporter('dst'), pes: new EmbroideryExporter('pes'), jef: new EmbroideryExporter('jef'),
};

export async function exportFile(format: string, svgContent: string, options?: ExportOptions): Promise<Buffer | string> {
  const exporter = exporters[format.toLowerCase()];
  if (!exporter) throw new Error(`Unsupported export format: ${format}`);
  return exporter.export(svgContent, options);
}

export { BaseExporter };
