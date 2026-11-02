import { BaseExporter, type ExportOptions } from './base-exporter';
import { getSvg } from './svg-utils';

export class SVGExporter extends BaseExporter {
  format = 'svg';
  async export(svgContent: string, _options?: ExportOptions): Promise<string> {
    getSvg(svgContent);
    return svgContent;
  }
}
