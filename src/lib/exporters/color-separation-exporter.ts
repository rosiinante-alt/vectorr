import { BaseExporter, type ExportOptions } from './base-exporter';
import { extractShapes, getDimensions, getSvg, normalizeColor, type SvgShape } from './svg-utils';
const AdmZip = require('adm-zip');

export interface ColorSeparationOptions extends ExportOptions {
  /** Include black color in separation (default: true) */
  includeBlack?: boolean;
  /** Use CMYK separation mode instead of RGB (default: false) */
  cmykMode?: boolean;
  /** Color grouping threshold in hex distance (default: 10) */
  threshold?: number;
  /** Base filename for separated files (default: 'separated') */
  baseName?: string;
}

interface ColorLayer {
  color: string;
  colorName: string;
  shapes: SvgShape[];
}

/**
 * Converts a hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  return {
    r: Number.parseInt(cleaned.slice(0, 2), 16),
    g: Number.parseInt(cleaned.slice(2, 4), 16),
    b: Number.parseInt(cleaned.slice(4, 6), 16),
  };
}

/**
 * Converts RGB to CMYK
 */
function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rPrime = r / 255;
  const gPrime = g / 255;
  const bPrime = b / 255;

  const k = 1 - Math.max(rPrime, gPrime, bPrime);
  const c = k === 1 ? 0 : (1 - rPrime - k) / (1 - k);
  const m = k === 1 ? 0 : (1 - gPrime - k) / (1 - k);
  const y = k === 1 ? 0 : (1 - bPrime - k) / (1 - k);

  return { c, m, y, k };
}

/**
 * Calculates the Euclidean distance between two colors in RGB space
 */
function colorDistance(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

/**
 * Groups colors within a threshold distance
 */
function groupColors(colors: string[], threshold: number): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  const processed = new Set<string>();

  for (const color of colors) {
    if (processed.has(color)) continue;

    const group: string[] = [color];
    processed.add(color);

    for (const otherColor of colors) {
      if (processed.has(otherColor)) continue;
      if (colorDistance(color, otherColor) <= threshold) {
        group.push(otherColor);
        processed.add(otherColor);
      }
    }

    groups.set(color, group);
  }

  return groups;
}

/**
 * Generates a human-readable color name
 */
function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  
  // Check for grayscale
  const isGrayscale = Math.abs(rgb.r - rgb.g) < 10 && Math.abs(rgb.g - rgb.b) < 10;
  if (isGrayscale) {
    if (rgb.r < 50) return 'black';
    if (rgb.r > 200) return 'white';
    return 'gray';
  }

  // Dominant color detection
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const diff = max - min;

  if (diff < 30) return 'gray';

  if (rgb.r === max) {
    if (rgb.g > rgb.b) return 'orange';
    return rgb.b > 100 ? 'magenta' : 'red';
  }
  if (rgb.g === max) {
    return rgb.b > rgb.r ? 'cyan' : 'green';
  }
  return rgb.r > rgb.g ? 'purple' : 'blue';
}

/**
 * Generates SVG content for a single color layer
 */
function generateLayerSvg(
  shapes: SvgShape[],
  width: number,
  height: number,
  minX: number,
  minY: number,
  color: string
): string {
  const pathElements = shapes
    .map((shape) => {
      const points = shape.points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');
      const d = `M ${points}${shape.closed ? ' Z' : ''}`;
      return `  <path d="${d}" fill="${color}" opacity="${shape.opacity}" />`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${width} ${height}" width="${width}" height="${height}">
${pathElements}
</svg>`;
}

/**
 * Assigns shapes to CMYK layers based on their color
 */
function separateToCmyk(shapes: SvgShape[]): Map<string, SvgShape[]> {
  const cmykLayers = new Map<string, SvgShape[]>([
    ['cyan', []],
    ['magenta', []],
    ['yellow', []],
    ['black', []],
  ]);

  for (const shape of shapes) {
    if (shape.fill === 'none') continue;

    const rgb = hexToRgb(shape.fill);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    // Assign to the dominant CMYK channel
    const dominant = Math.max(cmyk.c, cmyk.m, cmyk.y, cmyk.k);
    
    if (cmyk.k === dominant && cmyk.k > 0.3) {
      cmykLayers.get('black')!.push(shape);
    } else if (cmyk.c === dominant && cmyk.c > 0.3) {
      cmykLayers.get('cyan')!.push(shape);
    } else if (cmyk.m === dominant && cmyk.m > 0.3) {
      cmykLayers.get('magenta')!.push(shape);
    } else if (cmyk.y === dominant && cmyk.y > 0.3) {
      cmykLayers.get('yellow')!.push(shape);
    } else {
      // If no strong dominance, assign to black
      cmykLayers.get('black')!.push(shape);
    }
  }

  return cmykLayers;
}

export class ColorSeparationExporter extends BaseExporter {
  format = 'color-separation';

  /**
   * Exports SVG as separate color layers
   * Returns a ZIP file containing one SVG per color
   */
  async export(svgContent: string, options?: ColorSeparationOptions): Promise<Buffer> {
    const {
      includeBlack = true,
      cmykMode = false,
      threshold = 10,
      baseName = 'separated',
    } = options ?? {};

    // Parse SVG and extract shapes
    const shapes = extractShapes(svgContent);
    const dimensions = getDimensions(svgContent);

    if (shapes.length === 0) {
      throw new Error('No shapes found in SVG');
    }

    const zip = new AdmZip();
    const layers: ColorLayer[] = [];

    if (cmykMode) {
      // CMYK separation mode
      const cmykLayers = separateToCmyk(shapes);
      const cmykColors = {
        cyan: '#00ffff',
        magenta: '#ff00ff',
        yellow: '#ffff00',
        black: '#000000',
      };

      for (const [name, layerShapes] of Array.from(cmykLayers.entries())) {
        if (layerShapes.length === 0) continue;
        if (name === 'black' && !includeBlack) continue;

        layers.push({
          color: cmykColors[name as keyof typeof cmykColors],
          colorName: name,
          shapes: layerShapes,
        });
      }
    } else {
      // RGB separation mode - group by actual colors
      const colorMap = new Map<string, SvgShape[]>();

      for (const shape of shapes) {
        if (shape.fill === 'none') continue;
        if (shape.fill === '#000000' && !includeBlack) continue;

        const existing = colorMap.get(shape.fill) ?? [];
        existing.push(shape);
        colorMap.set(shape.fill, existing);
      }

      // Group similar colors based on threshold
      const uniqueColors = Array.from(colorMap.keys());
      const colorGroups = groupColors(uniqueColors, threshold);

      for (const [representativeColor, groupedColors] of Array.from(colorGroups.entries())) {
        const groupShapes: SvgShape[] = [];
        for (const color of groupedColors) {
          groupShapes.push(...(colorMap.get(color) ?? []));
        }

        if (groupShapes.length > 0) {
          layers.push({
            color: representativeColor,
            colorName: getColorName(representativeColor),
            shapes: groupShapes,
          });
        }
      }
    }

    // Sort layers by shape count (descending)
    layers.sort((a, b) => b.shapes.length - a.shapes.length);

    // Generate SVG files for each layer
    for (const layer of layers) {
      const layerSvg = generateLayerSvg(
        layer.shapes,
        dimensions.width,
        dimensions.height,
        dimensions.minX,
        dimensions.minY,
        layer.color
      );

      const filename = `${baseName}-${layer.colorName}.svg`;
      zip.addFile(filename, Buffer.from(layerSvg, 'utf-8'));
    }

    // Generate a composite reference SVG (all layers together)
    zip.addFile(`${baseName}-composite.svg`, Buffer.from(svgContent, 'utf-8'));

    // Generate a manifest file
    const manifest = {
      mode: cmykMode ? 'CMYK' : 'RGB',
      layers: layers.map(l => ({
        color: l.color,
        name: l.colorName,
        shapeCount: l.shapes.length,
      })),
      dimensions: {
        width: dimensions.width,
        height: dimensions.height,
      },
    };

    zip.addFile('manifest.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf-8'));

    return zip.toBuffer();
  }

  /**
   * Exports color separation without zipping (returns array of layer data)
   */
  async exportLayers(
    svgContent: string,
    options?: ColorSeparationOptions
  ): Promise<Array<{ color: string; colorName: string; svg: string; filename: string }>> {
    const {
      includeBlack = true,
      cmykMode = false,
      threshold = 10,
      baseName = 'separated',
    } = options ?? {};

    const shapes = extractShapes(svgContent);
    const dimensions = getDimensions(svgContent);

    if (shapes.length === 0) {
      throw new Error('No shapes found in SVG');
    }

    const layers: ColorLayer[] = [];

    if (cmykMode) {
      const cmykLayers = separateToCmyk(shapes);
      const cmykColors = {
        cyan: '#00ffff',
        magenta: '#ff00ff',
        yellow: '#ffff00',
        black: '#000000',
      };

      for (const [name, layerShapes] of Array.from(cmykLayers.entries())) {
        if (layerShapes.length === 0) continue;
        if (name === 'black' && !includeBlack) continue;

        layers.push({
          color: cmykColors[name as keyof typeof cmykColors],
          colorName: name,
          shapes: layerShapes,
        });
      }
    } else {
      const colorMap = new Map<string, SvgShape[]>();

      for (const shape of shapes) {
        if (shape.fill === 'none') continue;
        if (shape.fill === '#000000' && !includeBlack) continue;

        const existing = colorMap.get(shape.fill) ?? [];
        existing.push(shape);
        colorMap.set(shape.fill, existing);
      }

      const uniqueColors = Array.from(colorMap.keys());
      const colorGroups = groupColors(uniqueColors, threshold);

      for (const [representativeColor, groupedColors] of Array.from(colorGroups.entries())) {
        const groupShapes: SvgShape[] = [];
        for (const color of groupedColors) {
          groupShapes.push(...(colorMap.get(color) ?? []));
        }

        if (groupShapes.length > 0) {
          layers.push({
            color: representativeColor,
            colorName: getColorName(representativeColor),
            shapes: groupShapes,
          });
        }
      }
    }

    layers.sort((a, b) => b.shapes.length - a.shapes.length);

    return layers.map((layer) => ({
      color: layer.color,
      colorName: layer.colorName,
      svg: generateLayerSvg(
        layer.shapes,
        dimensions.width,
        dimensions.height,
        dimensions.minX,
        dimensions.minY,
        layer.color
      ),
      filename: `${baseName}-${layer.colorName}.svg`,
    }));
  }
}
