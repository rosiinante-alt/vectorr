import { getReplicateClient } from './replicate-client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GenerationType = 'logo' | 'svg_illustration' | 'pattern' | 'general';

export type LogoStyle =
  | 'minimalist'
  | 'vintage'
  | 'modern'
  | 'geometric'
  | 'playful'
  | 'bold'
  | 'elegant';

export type PatternStyle =
  | 'floral'
  | 'geometric'
  | 'abstract'
  | 'botanical'
  | 'retro'
  | 'minimal'
  | 'folk';

export type ImageStyle =
  | 'photorealistic'
  | 'illustration'
  | 'watercolor'
  | 'flat'
  | 'sketch'
  | 'oil_painting'
  | 'pixel_art';

export interface GenerationOptions {
  type: GenerationType;
  prompt: string;
  /** Logo style (only for type=logo) */
  logoStyle?: LogoStyle;
  /** Pattern style (only for type=pattern) */
  patternStyle?: PatternStyle;
  /** General image style (only for type=general) */
  imageStyle?: ImageStyle;
  /** Business name or brand context (optional, used in prompt building) */
  brandName?: string;
  /** Industry or niche context */
  industry?: string;
  /** Target color palette description */
  colorPalette?: string;
  /** Output dimensions (default 1024x1024) */
  width?: number;
  height?: number;
}

export interface GenerationResult {
  /** Public URL of the generated image on Replicate's CDN. */
  imageUrl: string;
  /** The final prompt sent to the model, useful for debugging. */
  prompt: string;
}

// ---------------------------------------------------------------------------
// Prompt builders
// ---------------------------------------------------------------------------

const LOGO_STYLE_DESCRIPTORS: Record<LogoStyle, string> = {
  minimalist: 'minimalist, clean lines, simple shapes, whitespace-focused, modern',
  vintage: 'vintage, retro, distressed texture, letterpress feel, warm tones',
  modern: 'modern, sleek, professional, gradient-accented, contemporary',
  geometric: 'geometric, vector shapes, bold angles, symmetrical composition',
  playful: 'playful, rounded corners, bright colors, friendly, fun typography',
  bold: 'bold, high contrast, strong typography, impactful, striking',
  elegant: 'elegant, serif typography, gold accents, luxury feel, refined',
};

const PATTERN_STYLE_DESCRIPTORS: Record<PatternStyle, string> = {
  floral: 'floral pattern, hand-drawn flowers, botanical, seamless repeat, watercolor',
  geometric: 'geometric pattern, abstract shapes, symmetrical, seamless tile, vector',
  abstract: 'abstract pattern, organic forms, flowing lines, seamless repeat',
  botanical: 'botanical pattern, leaves, plants, nature, seamless surface pattern',
  retro: 'retro pattern, 70s inspired, warm palette, groovy shapes, seamless',
  minimal: 'minimal pattern, subtle, single-color, clean geometry, seamless tile',
  folk: 'folk art pattern, traditional motifs, hand-painted, vibrant colors, seamless',
};

const IMAGE_STYLE_DESCRIPTORS: Record<ImageStyle, string> = {
  photorealistic: 'photorealistic, high detail, dramatic lighting, professional photography',
  illustration: 'digital illustration, editorial style, colorful, vector-inspired',
  watercolor: 'watercolor painting, soft edges, transparent washes, artistic',
  flat: 'flat design, solid colors, no gradients, simple shapes, clean vector style',
  sketch: 'pencil sketch, hand-drawn lines, crosshatching, artistic illustration',
  oil_painting: 'oil painting, thick brushstrokes, rich textures, classical art style',
  pixel_art: 'pixel art, 8-bit retro style, low resolution, colorful, game art',
};

export function buildGenerationPrompt(options: GenerationOptions): string {
  const { type, prompt, brandName, industry, colorPalette } = options;

  const brandContext = brandName ? ` for "${brandName}"` : '';
  const industryContext = industry ? ` in the ${industry} industry` : '';
  const colorContext = colorPalette ? `, ${colorPalette} color palette` : '';

  switch (type) {
    case 'logo': {
      const styleDesc = LOGO_STYLE_DESCRIPTORS[options.logoStyle ?? 'modern'];
      return [
        `Professional logo design${brandContext}${industryContext},`,
        prompt,
        `${styleDesc}${colorContext},`,
        'isolated on white background, no text unless specified, vector art quality,',
        'sharp edges, scalable, high resolution, logo concept',
      ].join(' ');
    }

    case 'svg_illustration': {
      return [
        `SVG illustration, ${prompt}${industryContext}${colorContext},`,
        'clean vector art, flat design, simple shapes, no gradients,',
        'white background, digital illustration, icon-style, scalable graphic',
      ].join(' ');
    }

    case 'pattern': {
      const styleDesc = PATTERN_STYLE_DESCRIPTORS[options.patternStyle ?? 'geometric'];
      return [
        `Seamless tileable surface pattern, ${prompt},`,
        styleDesc,
        `${colorContext},`,
        'repeating tile, textile print, fabric design, top view, flat lay,',
        'no text, pattern design, high resolution',
      ].join(' ');
    }

    case 'general':
    default: {
      const styleDesc = IMAGE_STYLE_DESCRIPTORS[options.imageStyle ?? 'illustration'];
      return [
        prompt,
        styleDesc,
        `${colorContext}${industryContext},`,
        'high quality, detailed',
      ]
        .filter(Boolean)
        .join(', ');
    }
  }
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

/**
 * FLUX Schnell model on Replicate — fast, high-quality image generation.
 * Runs synchronously (wait: 60) to avoid BullMQ queuing for simple generations.
 */
const FLUX_SCHNELL = 'black-forest-labs/flux-schnell' as const;

/**
 * Normalize Replicate's output to a plain URL string.
 * FLUX Schnell returns either a string URL, a FileOutput object, or an array.
 */
function extractUrl(output: unknown): string {
  const candidates = Array.isArray(output) ? output : [output];

  for (const item of candidates) {
    if (typeof item === 'string' && /^https?:\/\//.test(item)) return item;

    if (item && typeof item === 'object') {
      const obj = item as { url?: unknown; toString?: () => string };

      if (typeof obj.url === 'function') {
        const resolved = obj.url() as unknown;
        if (resolved instanceof URL) return resolved.toString();
        if (typeof resolved === 'string') return resolved;
      }
      if (typeof obj.url === 'string') return obj.url;
      if (typeof obj.toString === 'function') {
        const text = obj.toString();
        if (/^https?:\/\//.test(text)) return text;
      }
    }
  }

  throw new Error('FLUX Schnell returned no usable image URL');
}

export async function generateImage(options: GenerationOptions): Promise<GenerationResult> {
  const client = getReplicateClient();
  const prompt = buildGenerationPrompt(options);

  const width = options.width ?? 1024;
  const height = options.height ?? 1024;

  const output = await client.run(FLUX_SCHNELL, {
    input: {
      prompt,
      num_outputs: 1,
      aspect_ratio: width === height ? '1:1' : '16:9',
      output_format: 'webp',
      output_quality: 90,
      num_inference_steps: 4,
    },
  });

  return { imageUrl: extractUrl(output), prompt };
}
