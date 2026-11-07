import Replicate from 'replicate';

/**
 * Typed wrapper around the Replicate API for the three AI operations the
 * vectorizer pipeline uses: raster→SVG tracing, upscaling, and background
 * removal.
 *
 * Two operational details drive the shape of this module:
 *
 * 1. Predictions are created through the *versioned* endpoint
 *    (`POST /v1/predictions` with a pinned version hash). The
 *    `POST /v1/models/{owner}/{name}/predictions` shortcut currently answers
 *    404 for these models even though their metadata is readable, so the
 *    version hashes below are pinned deliberately.
 * 2. Low-credit accounts are throttled to 6 prediction creations per minute
 *    with a burst of 1, which means concurrent worker slots will hit 429s. The
 *    wrapper retries those with backoff honouring `retry_after`.
 */

// ---------------------------------------------------------------------------
// Model registry
// ---------------------------------------------------------------------------

export interface ReplicateModel {
  /** `owner/name` slug, used for logging and error messages. */
  id: string;
  /** Immutable version hash the prediction runs against. */
  version: string;
  /** Approximate billed cost per successful run, in USD. */
  costUsd: number;
}

export const REPLICATE_MODELS = {
  /** Raster → SVG. Output is a single URI pointing at the .svg file. */
  vectorize: {
    id: 'recraft-ai/recraft-vectorize',
    version: '060005b7c1316233bd3a4fc353fc23dcc0675fade3ad880b7d8d1d44e99f400e',
    costUsd: 0.01,
  },
  /** GAN upscaler with optional GFPGAN face enhancement. */
  upscale: {
    id: 'nightmareai/real-esrgan',
    version: 'b3ef194191d13140337468c916c2c5b96dd0cb06dffc032a022a31807f6a5ea8',
    costUsd: 0.0021,
  },
  /** Fast tracer_b7 based background removal (~2s on T4, 13x cheaper than rembg). */
  removeBg: {
    id: 'lucataco/remove-bg',
    version: '95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1',
    costUsd: 0.00034,
  },
} as const satisfies Record<string, ReplicateModel>;

export type ReplicateOperation = keyof typeof REPLICATE_MODELS;

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

export type UpscaleOptions = {
  /** Run GFPGAN face restoration alongside upscaling. */
  faceEnhance?: boolean;
};

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class ReplicateError extends Error {
  readonly model: string;
  readonly status?: number;
  readonly retryAfterSeconds?: number;

  constructor(
    model: string,
    message: string,
    options: { cause?: unknown; status?: number; retryAfterSeconds?: number } = {},
  ) {
    super(`[${model}] ${message}`, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'ReplicateError';
    this.model = model;
    this.status = options.status;
    this.retryAfterSeconds = options.retryAfterSeconds;
  }

  /** True for the low-credit throttle, which is worth retrying later. */
  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

const globalForReplicate = globalThis as typeof globalThis & {
  vectroyReplicate?: Replicate;
};

/** Lazily constructed so importing this module never requires the token. */
export function getReplicateClient(): Replicate {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new ReplicateError(
      'config',
      'Missing REPLICATE_API_TOKEN. Add it to .env.local (see .env.example).',
    );
  }

  // Reuse one client across hot reloads to avoid leaking HTTP agents.
  return (globalForReplicate.vectroyReplicate ??= new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  }));
}

const MAX_RATE_LIMIT_RETRIES = 4;
const DEFAULT_RETRY_AFTER_SECONDS = 10;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readStatus(error: unknown): number | undefined {
  const candidate = error as { status?: unknown; response?: { status?: unknown } };
  const status = candidate?.response?.status ?? candidate?.status;
  return typeof status === 'number' ? status : undefined;
}

function readRetryAfter(error: unknown): number | undefined {
  const candidate = error as {
    retry_after?: unknown;
    response?: { data?: { retry_after?: unknown } };
  };
  const value = candidate?.response?.data?.retry_after ?? candidate?.retry_after;
  return typeof value === 'number' ? value : undefined;
}

/**
 * Runs a model and returns the raw prediction output, retrying the low-credit
 * throttle. Non-429 failures throw immediately so the worker's own retry policy
 * decides what happens next.
 */
async function runModel<T>(model: ReplicateModel, input: Record<string, unknown>): Promise<T> {
  const client = getReplicateClient();

  for (let attempt = 0; ; attempt += 1) {
    try {
      const prediction = await client.predictions.create({
        version: model.version,
        input,
        // Block until the prediction finishes so the worker sees a result.
        wait: 60,
      });

      if (prediction.status !== 'succeeded') {
        throw new ReplicateError(
          model.id,
          prediction.error?.toString() || `Prediction ended with status "${prediction.status}"`,
        );
      }

      return prediction.output as T;
    } catch (error) {
      if (error instanceof ReplicateError) throw error;

      const status = readStatus(error);

      if (status === 429 && attempt < MAX_RATE_LIMIT_RETRIES) {
        const retryAfter = readRetryAfter(error) ?? DEFAULT_RETRY_AFTER_SECONDS;
        await sleep(Math.min(retryAfter, 60) * 1000 + 500);
        continue;
      }

      throw new ReplicateError(model.id, 'Replicate request failed', {
        cause: error,
        status,
        retryAfterSeconds: readRetryAfter(error),
      });
    }
  }
}

/**
 * Replicate emits different shapes per model: a bare URI string, an array of
 * URIs, or a `FileOutput` object. Normalize to a plain URL string.
 */
function toUrl(output: unknown, model: ReplicateModel): string {
  const first = Array.isArray(output) ? output[0] : output;

  if (typeof first === 'string') return first;

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

  throw new ReplicateError(model.id, 'Replicate returned no usable output URL');
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
export async function vectorizeImage(imageUrl: string): Promise<VectorizationResult> {
  const model = REPLICATE_MODELS.vectorize;

  const output = await runModel<unknown>(model, { image: imageUrl });
  const outputUrl = toUrl(output, model);

  // The model returns a link to the .svg file, not the markup itself. Fetch it
  // so callers can upload the SVG straight to storage.
  const response = await fetch(outputUrl);
  if (!response.ok) {
    throw new ReplicateError(
      model.id,
      `Could not download generated SVG (HTTP ${response.status})`,
      { status: response.status },
    );
  }

  const svg = await response.text();
  if (!svg.includes('<svg')) {
    throw new ReplicateError(model.id, 'Model output was not valid SVG markup');
  }

  return { svg, outputUrl };
}

/** Upscale an image by an integer factor. */
export async function upscaleImage(
  imageUrl: string,
  scale: 2 | 4 = 2,
  options: UpscaleOptions = {},
): Promise<UpscaleResult> {
  const model = REPLICATE_MODELS.upscale;

  const output = await runModel<unknown>(model, {
    image: imageUrl,
    scale,
    face_enhance: options.faceEnhance ?? false,
  });

  return { outputUrl: toUrl(output, model), scale };
}

/** Remove the background, returning a transparent PNG URL. */
export async function removeBackground(imageUrl: string): Promise<RemoveBgResult> {
  const model = REPLICATE_MODELS.removeBg;

  const output = await runModel<unknown>(model, { image: imageUrl });

  return { outputUrl: toUrl(output, model) };
}

/** Estimated USD cost of one run of `operation`. */
export function operationCost(operation: ReplicateOperation): number {
  return REPLICATE_MODELS[operation].costUsd;
}

export { getReplicateClient as replicate };