/**
 * SVG optimization using SVGO with per-plugin attribution.
 */
import { optimize } from 'svgo';

export interface OptimizationDetail {
  id: string;
  label: string;
  savedBytes: number;
  count: number;
}

export interface OptimizationResult {
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  savedBytes: number;
  savedPercent: number;
  optimizations: OptimizationDetail[];
  optimizedSvg: string;
}

/**
 * Size cap for synchronous optimization (SVGO 4 on 1MB takes ~1.6s).
 * Above this, return 413 Payload Too Large.
 */
export const MAX_OPTIMIZE_SIZE_BYTES = 1024 * 1024; // 1MB

/**
 * Plugin subset for leave-one-out attribution.
 * These empirically produce the largest deltas in real-world SVGs.
 */
const ATTRIBUTION_PLUGINS = [
  'convertPathData',
  'cleanupIds',
  'removeComments',
  'removeMetadata',
  'collapseGroups',
  'mergePaths',
  'convertColors',
  'cleanupNumericValues',
] as const;

/**
 * Human-readable labels for plugins.
 */
const PLUGIN_LABELS: Record<string, string> = {
  convertPathData: 'Path precision',
  cleanupIds: 'ID cleanup',
  removeComments: 'Comment removal',
  removeMetadata: 'Metadata stripping',
  collapseGroups: 'Group collapsing',
  mergePaths: 'Path merging',
  convertColors: 'Color optimization',
  cleanupNumericValues: 'Numeric precision',
  other: 'Other optimizations',
};

/**
 * Optimize an SVG and produce a per-plugin attribution report.
 * 
 * @param svg - The original SVG string
 * @param precision - Decimal precision for path coordinates (default: 3)
 * @returns Optimization result with per-plugin breakdown
 * @throws Error if the SVG is invalid or too large
 */
export async function optimizeSVG(
  svg: string,
  precision = 3
): Promise<OptimizationResult> {
  const originalBytes = Buffer.byteLength(svg, 'utf8');

  if (originalBytes > MAX_OPTIMIZE_SIZE_BYTES) {
    throw new Error(
      `File too large for synchronous optimization (${(originalBytes / 1024).toFixed(0)}KB > ${(MAX_OPTIMIZE_SIZE_BYTES / 1024).toFixed(0)}KB)`
    );
  }

  // Run full optimization
  const fullResult = optimize(svg, {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // Configure convertPathData with the user's precision
            convertPathData: {
              floatPrecision: precision,
              transformPrecision: precision,
            },
          },
        },
      },
    ],
    js2svg: { pretty: false },
  });

  const optimizedBytes = Buffer.byteLength(fullResult.data, 'utf8');
  const totalSaved = originalBytes - optimizedBytes;

  // Leave-one-out attribution for top plugins
  const deltas: Array<{ plugin: string; delta: number }> = [];
  
  for (const plugin of ATTRIBUTION_PLUGINS) {
    try {
      const result = optimize(svg, {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                [plugin]: false,
                convertPathData:
                  plugin === 'convertPathData'
                    ? false
                    : {
                        floatPrecision: precision,
                        transformPrecision: precision,
                      },
              },
            },
          },
        ],
        js2svg: { pretty: false },
      });

      const bytesWithoutPlugin = Buffer.byteLength(result.data, 'utf8');
      const delta = bytesWithoutPlugin - optimizedBytes;
      
      if (delta > 0) {
        deltas.push({ plugin, delta });
      }
    } catch {
      // Plugin might not be applicable; skip it
      continue;
    }
  }

  // Sort by impact (largest first)
  deltas.sort((a, b) => b.delta - a.delta);

  // Build the optimization breakdown
  const optimizations: OptimizationDetail[] = deltas.map(({ plugin, delta }) => ({
    id: plugin,
    label: PLUGIN_LABELS[plugin] || plugin,
    savedBytes: delta,
    count: 1, // SVGO doesn't expose per-plugin occurrence counts
  }));

  // Compute residual (other optimizations not attributed)
  const attributedTotal = deltas.reduce((sum, { delta }) => sum + delta, 0);
  const residual = totalSaved - attributedTotal;

  if (residual > 0) {
    optimizations.push({
      id: 'other',
      label: PLUGIN_LABELS.other,
      savedBytes: residual,
      count: 1,
    });
  }

  return {
    originalSizeBytes: originalBytes,
    optimizedSizeBytes: optimizedBytes,
    savedBytes: totalSaved,
    savedPercent: totalSaved > 0 ? (totalSaved / originalBytes) * 100 : 0,
    optimizations,
    optimizedSvg: fullResult.data,
  };
}
