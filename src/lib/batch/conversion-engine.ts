import type { BatchOutputFormat, BatchPreprocessing } from '@/lib/batch/types';

/**
 * The conversion primitives a batch needs. Declared structurally instead of
 * imported from `replicate-client` so the batch worker compiles and is testable
 * on its own — the real module is loaded lazily at runtime.
 */
export interface ConversionEngine {
  removeBackground(url: string): Promise<{ outputUrl: string }>;
  upscaleImage(url: string, scale: 2 | 4): Promise<{ outputUrl: string }>;
  vectorizeImage(url: string): Promise<{ svg: string; outputUrl?: string }>;
}

export interface ConversionInput {
  sourceUrl: string;
  preprocessing: BatchPreprocessing;
  outputFormat: BatchOutputFormat;
}

export interface ConversionResult {
  /** Rendered vector payload; stored as a file in the batch results folder. */
  content: string;
  contentType: string;
}

let enginePromise: Promise<ConversionEngine> | null = null;

/**
 * Resolves the Replicate-backed engine on first use. A plain top-level import
 * would make every batch consumer depend on the AI module's availability.
 */
export function loadConversionEngine(): Promise<ConversionEngine> {
  enginePromise ??= import('@/lib/ai/replicate-client').then(
    (module) => module as unknown as ConversionEngine,
  );
  enginePromise.catch(() => {
    // Allow a later job to retry after a transient module-resolution failure.
    enginePromise = null;
  });
  return enginePromise;
}

/**
 * Runs the preprocessing chain, then vectorizes. Preprocessing order is
 * deliberate: background removal first, then upscaling, so the upscaler never
 * wastes resolution on pixels that are about to be dropped.
 *
 * Only `svg` is produced from vectorization; every other requested format is
 * derived from that SVG by the caller (see `BatchWorker`), keeping this helper
 * focused on a single AI round-trip per file.
 */
export async function convertBatchFile(
  input: ConversionInput,
  engine?: ConversionEngine,
): Promise<ConversionResult> {
  const resolved = engine ?? (await loadConversionEngine());

  let workingUrl = input.sourceUrl;

  if (input.preprocessing.removeBg) {
    const { outputUrl } = await resolved.removeBackground(workingUrl);
    if (!outputUrl) throw new Error('Background removal returned no output');
    workingUrl = outputUrl;
  }

  if (input.preprocessing.upscale === '2x' || input.preprocessing.upscale === '4x') {
    const scale = input.preprocessing.upscale === '4x' ? 4 : 2;
    const { outputUrl } = await resolved.upscaleImage(workingUrl, scale);
    if (!outputUrl) throw new Error('Upscaling returned no output');
    workingUrl = outputUrl;
  }

  const { svg } = await resolved.vectorizeImage(workingUrl);
  if (!svg || !svg.includes('<svg')) throw new Error('Vectorizer returned no SVG');

  return { content: svg, contentType: 'image/svg+xml' };
}