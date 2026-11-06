import { BaseExporter, type ExportOptions } from './base-exporter';
import { DXFExporter } from './dxf-exporter';
import { EmbroideryExporter } from './embroidery-exporter';
import { EPSExporter } from './eps-exporter';
import { GcodeExporter } from './gcode-exporter';
import { PDFExporter } from './pdf-exporter';
import { SVGExporter } from './svg-exporter';
import { ColorSeparationExporter } from './color-separation-exporter';
import { ThreeMFExporter, STLExporter, OBJExporter } from './3d-exporter';

const exporters: Record<string, BaseExporter> = {
  svg: new SVGExporter(), 
  dxf: new DXFExporter(), 
  eps: new EPSExporter(), 
  gcode: new GcodeExporter(),
  pdf: new PDFExporter(), 
  dst: new EmbroideryExporter('dst'), 
  pes: new EmbroideryExporter('pes'), 
  jef: new EmbroideryExporter('jef'),
  'color-separation': new ColorSeparationExporter(),
  '3mf': new ThreeMFExporter(),
  stl: new STLExporter(),
  obj: new OBJExporter(),
};

export async function exportFile(format: string, svgContent: string, options?: ExportOptions): Promise<Buffer | string> {
  const exporter = exporters[format.toLowerCase()];
  if (!exporter) throw new Error(`Unsupported export format: ${format}`);
  return exporter.export(svgContent, options);
}

export { BaseExporter };
export { ColorSeparationExporter } from './color-separation-exporter';
export type { ColorSeparationOptions } from './color-separation-exporter';
export * from './base-exporter';
export * from './svg-exporter';
export * from './dxf-exporter';
export * from './eps-exporter';
export * from './pdf-exporter';
export * from './gcode-exporter';
export * from './embroidery-exporter';
export * from './color-separation-exporter';
export * from './3d-exporter';
export * from './svg-utils';
