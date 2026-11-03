/**
 * Style transfer presets.
 *
 * A preset couples a Replicate model with the parameters it expects. Presets are
 * declarative data so the UI, the API and the worker all read the same list, and
 * custom presets can be registered without touching any of them.
 */

export type StyleCategory = 'artistic' | 'photographic' | 'technical' | 'pattern';

export const STYLE_CATEGORIES: readonly StyleCategory[] = [
  'artistic',
  'photographic',
  'technical',
  'pattern',
];

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  /** Replicate model identifier, either `owner/name` or `owner/name:version`. */
  replicateModel: ReplicateModelId;
  params: Record<string, unknown>;
  previewImage?: string;
  category: StyleCategory;
}

/** Replicate's `run()` only accepts `owner/name` or `owner/name:version`. */
export type ReplicateModelId = `${string}/${string}` | `${string}/${string}:${string}`;

/**
 * Default Replicate model for image-to-image restyling. Accepts an image URL plus
 * a text prompt and a strength multiplier.
 */
const IMAGE_TO_IMAGE_MODEL: ReplicateModelId = 'fofr/sdxl-emoji';

/**
 * All built-in presets. Every entry is image-to-image, so `image` is supplied by
 * the caller and never stored here.
 */
export const STYLE_PRESETS: readonly StylePreset[] = [
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    description: 'Classic oil painting style with visible brush strokes',
    replicateModel: IMAGE_TO_IMAGE_MODEL,
    params: {
      prompt: 'oil painting, thick impasto brush strokes, rich pigments, canvas texture',
      negative_prompt: 'photo, low quality, blurry',
      prompt_strength: 0.8,
      num_inference_steps: 30,
    },
    category: 'artistic',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft watercolor washes with paper grain',
    replicateModel: IMAGE_TO_IMAGE_MODEL,
    params: {
      prompt: 'watercolor painting, soft washes, wet edges, paper texture',
      negative_prompt: 'photo, hard edges, low quality',
      prompt_strength: 0.7,
      num_inference_steps: 30,
    },
    category: 'artistic',
  },
  {
    id: 'ink-sketch',
    name: 'Ink Sketch',
    description: 'Black ink line drawing on white paper',
    replicateModel: IMAGE_TO_IMAGE_MODEL,
    params: {
      prompt: 'black ink sketch, line art, hatching, white background',
      negative_prompt: 'color, photo, gradients',
      prompt_strength: 0.9,
      num_inference_steps: 25,
    },
    category: 'technical',
  },
  {
    id: 'geometric',
    name: 'Geometric Pattern',
    description: 'Clean geometric shapes in a flat palette',
    replicateModel: IMAGE_TO_IMAGE_MODEL,
    params: {
      prompt: 'geometric abstraction, clean vector shapes, flat colors, minimal',
      negative_prompt: 'photo, noise, texture',
      prompt_strength: 0.8,
      num_inference_steps: 25,
    },
    category: 'pattern',
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    description: 'Colorful mosaic tiles with visible grout',
    replicateModel: IMAGE_TO_IMAGE_MODEL,
    params: {
      prompt: 'mosaic artwork, colorful ceramic tiles, visible grout, tesserae',
      negative_prompt: 'photo, blurry, smooth',
      prompt_strength: 0.75,
      num_inference_steps: 30,
    },
    category: 'pattern',
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Bright neon tubes glowing against a dark background',
    replicateModel: IMAGE_TO_IMAGE_MODEL,
    params: {
      prompt: 'neon glow, bright emissive tubes, cyberpunk lighting, dark background',
      negative_prompt: 'flat lighting, daylight, low contrast',
      prompt_strength: 0.8,
      num_inference_steps: 30,
    },
    category: 'photographic',
  },
];

export function getPreset(id: string): StylePreset | undefined {
  return STYLE_PRESETS.find((preset) => preset.id === id);
}

export function getPresetsByCategory(category: StyleCategory): StylePreset[] {
  return STYLE_PRESETS.filter((preset) => preset.category === category);
}

export function isStylePresetId(value: unknown): value is string {
  return typeof value === 'string' && getPreset(value) !== undefined;
}