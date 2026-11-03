import Replicate from 'replicate';

import { getPreset } from './style-transfer-presets';

let client: Replicate | undefined;

/**
 * Created lazily so that importing this module (e.g. from a route that
 * validates input before enqueuing) does not require a token at build time.
 */
function getReplicate(): Replicate {
  const auth = process.env.REPLICATE_API_TOKEN;
  if (!auth) {
    throw new Error('Missing required environment variable: REPLICATE_API_TOKEN');
  }
  client ??= new Replicate({ auth });
  return client;
}

/**
 * Replicate returns one of several shapes depending on the model: a URL string,
 * a `FileOutput` stream exposing `.url()`, or an array of either. Normalize to a
 * single URL string.
 */
function toUrl(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value.startsWith('http') ? value : undefined;
  }
  if (value && typeof value === 'object' && 'url' in value) {
    const url = (value as { url: unknown }).url;
    if (typeof url === 'function') {
      const resolved = url.call(value) as unknown;
      return resolved instanceof URL ? resolved.toString() : undefined;
    }
    if (typeof url === 'string') return url;
  }
  return undefined;
}

export function normalizeOutput(output: unknown): string {
  const candidates = Array.isArray(output) ? output : [output];
  for (const candidate of candidates) {
    const url = toUrl(candidate);
    if (url) return url;
  }
  throw new Error('Style transfer model returned no image URL');
}

export interface StyleTransferOptions {
  imageUrl: string;
  presetId: string;
  customParams?: Record<string, unknown>;
  /** Forwarded to Replicate so a slow model can be bounded. */
  signal?: AbortSignal;
  onProgress?: (percent: number) => void;
}

/**
 * Restyles a single image. `customParams` are merged over the preset's params, so
 * callers can override a strength or prompt without redefining the preset.
 */
export async function applyStyleTransfer({
  imageUrl,
  presetId,
  customParams,
  signal,
  onProgress,
}: StyleTransferOptions): Promise<string> {
  const preset = getPreset(presetId);
  if (!preset) {
    throw new Error(`Unknown style preset: ${presetId}`);
  }

  const input = { ...preset.params, ...customParams, image: imageUrl };

  const output = await getReplicate().run(preset.replicateModel, { input, signal }, (prediction) => {
    if (prediction.status === 'processing') onProgress?.(50);
  });

  return normalizeOutput(output);
}

/**
 * Applies one preset across many images. Sequential rather than `Promise.all`:
 * Replicate rate-limits per account, and a fan-out of every image at once tends
 * to trip it and fail the whole batch.
 */
export async function batchApplyStyle(
  imageUrls: string[],
  presetId: string,
  customParams?: Record<string, unknown>,
  onItemComplete?: (index: number, resultUrl: string) => void,
): Promise<string[]> {
  const results: string[] = [];
  for (const [index, imageUrl] of imageUrls.entries()) {
    const result = await applyStyleTransfer({ imageUrl, presetId, customParams });
    results.push(result);
    onItemComplete?.(index, result);
  }
  return results;
}