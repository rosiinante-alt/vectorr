import Replicate from 'replicate';

/**
 * Typed wrapper around the Replicate API for the three AI operations the
 * vectorizer pipeline uses: raster→SVG tracing, upscaling, and background
 * removal.
 *
 * Model versions are pinned by name (`owner/name`), which Replicate resolves to
 * the model's latest version. Pin an exact version hash instead when a model's
 * output shape or pricing must stay stable across releases.
 */

// ---------------------------------------------------------------------------
// Model registry
// ---------------------------------------------------------------------------

export const REPLICATE_MODELS = {
  /** Raster → SVG. Output is a single URI pointing at the .svg file. */
  vectorize: 'recraft-ai/recraft-vectorize',
  /** GAN upscaler with optional GFPGAN face enhancement. */
  upscale: 'nightmareai/real-esrgan',
  /** U^2-Net based background removal. */
  removeBg: 'cjwbw/rembg',
} as const;

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface VectorizationResult {
  /** SVG markup, fetched from the model's output URL. */
  svg: string;
  /** Remote URL of the generated .svg file. */
  outputUrl: string;
}

export interface UpscaleResult {
  outputUrl: string;
  /** Scale factor actually applied. */
  scale: number;
}

export interface RemoveBgResult {
  outputUrl: string;
}

export type VectorizeOptions = {
  /** Emit an SVG, or a second SVG holding the background separately. */
  variant?: 'svg' | 'svg-with-background';
};

export type UpscaleOptions = {
  /** Run GFPGAN face restoration alongside upscaling. */
  faceEnhance?: boolean;
};

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ReplicateError extends Error {
  readonly model: string;

  constructor(model: string, message: string, options?: { cause?: unknown }) {
    super(`[${model}] ${message}`, options);
    this.name = 'ReplicateError';
    this.model = model;
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const globalForReplicate = globalThis as typeof globalThis & {
  vectorrReplicate?: Replicate;
};

/** Lazily constructed so importing this module never requires the token. */
function getClient(): Replicate {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new ReplicateError(
      'config',
      'Missing REPLICATE_API_TOKEN. Add it to .env.local (see .env.example).',
    );
  }

  // Reuse one client across hot reloads to avoid leaking HTTP agents.
  return (globalForReplicate.vectorrReplicate ??= new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  }));
}

/**
 * Replicate emits different shapes per model: a bare URI string, an array of
 * URIs, or a `Stream`/`FileOutput`. Normalize to a plain URL string.
 */
function toUrl(output: unknown): string {
  const first = Array.isArray(output) ? output[0] : output;

  if (typeof first === 'string') return first;

  // FileOutput / Stream expose a string form that is the download URL.
  if (first && typeof first === 'object') {
    const candidate = first as { url?: unknown; toString?: () => string };
    if (typeof candidate.url === 'function') {
      const resolved = candidate.url();
      if (typeof resolved === 'string') return resolved;
    }
    if (typeof candidate.url === 'string') return candidate.url;
    if (typeof candidate.toString === 'function') {
      const text = candidate.toString();
      if (/^https?:\/\//.test(text)) return text;
    }
  }

  throw new ReplicateError('output', 'Replicate returned no usable output URL');
}

// ---------------------------------------------------------------------------
// Operations
// ---------------------------------------------------------------------------

/**
 * Trace a raster image into an SVG.
 *
 * `imageUrl` must be publicly reachable by Replicate. For objects in a private
 * Supabase bucket, pass a signed URL rather than the bucket path.
 */
export async function vectorizeImage(
  imageUrl: string,
  options: VectorizeOptions = {},
): Promise<VectorizationResult> {
  const model = REPLICATE_MODELS.vectorize;

  let output: unknown;
  try {
    output = await getClient().run(model, {
      input: {
        image: imageUrl,
        ...(options.variant && options.variant !== 'svg' ? { variant: options.variant } : {}),
      },
    });
  } catch (error) {
    throw new ReplicateError(model, 'Vectorization request failed', { cause: error });
  }

  const outputUrl = toUrl(output);

  // The model returns a link to the .svg file, not the markup itself. Fetch it
  // so callers can upload the SVG directly to storage.
  const response = await fetch(outputUrl);
  if (!response.ok) {
    throw new ReplicateError(
      model,
      `Could not download generated SVG (HTTP ${response.status})`,
    );
  }

  const svg = await response.text();
  if (!svg.includes('<svg')) {
    throw new ReplicateError(model, 'Model output was not valid SVG markup');
  }

  return { svg, outputUrl };
}

/** Upscale an image by integer factor. */
export async function upscaleImage(
  imageUrl: string,
  scale: 2 | 4 = 2,
  options: UpscaleOptions = {},
): Promise<UpscaleResult> {
  const model = REPLICATE_MODELS.upscale;

  try {
    const output = await getClient().run(model, {
      input: {
        image: imageUrl,
        scale,
        face_enhance: options.faceEnhance ?? false,
      },
    });

    return { outputUrl: toUrl(output), scale };
  } catch (error) {
    if (error instanceof ReplicateError) throw error;
    throw new ReplicateError(model, 'Upscale request failed', { cause: error });
  }
}

/** Remove the background, returning a transparent PNG URL. */
export async function removeBackground(imageUrl: string): Promise<RemoveBgResult> {
  const model = REPLICATE_MODELS.removeBg;

  try {
    const output = await getClient().run(model, {
      input: { image: imageUrl },
    });

    return { outputUrl: toUrl(output) };
  } catch (error) {
    if (error instanceof ReplicateError) throw error;
    throw new ReplicateError(model, 'Background removal request failed', { cause: error });
  }
}

export { getClient as getReplicateClient };