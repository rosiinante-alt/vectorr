export interface ExportOptions {
  width?: number;
  height?: number;
  quality?: number;
  dpi?: number;
}

export abstract class BaseExporter {
  abstract format: string;
  abstract export(svgContent: string, options?: ExportOptions): Promise<Buffer | string>;
}
