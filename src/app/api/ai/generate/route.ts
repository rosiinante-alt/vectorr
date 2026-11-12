import { type NextRequest } from 'next/server';

import { CREDIT_COSTS } from '@/lib/credits/constants';
import { creditManager } from '@/lib/credits/credit-manager';
import { badRequest, json, serverError, unauthorized } from '@/lib/http';
import { clientKey, LIMITS, rateLimit } from '@/lib/rate-limit';
import { authenticate, createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  generateImage,
  type GenerationOptions,
  type GenerationType,
  type LogoStyle,
  type PatternStyle,
  type ImageStyle,
} from '@/lib/ai/image-generation-service';

/**
 * POST /api/ai/generate
 *
 * Generates an image (logo, SVG illustration, pattern, or general) using
 * FLUX Schnell via Replicate. Synchronous — returns the image URL in one
 * response.
 *
 * Request body:
 * {
 *   type: 'logo' | 'svg_illustration' | 'pattern' | 'general';
 *   prompt: string;         // max 1000 chars
 *   logoStyle?: LogoStyle;
 *   patternStyle?: PatternStyle;
 *   imageStyle?: ImageStyle;
 *   brandName?: string;
 *   industry?: string;
 *   colorPalette?: string;
 *   width?: number;         // 512 | 768 | 1024 (default 1024)
 *   height?: number;
 * }
 */
export async function POST(request: NextRequest) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  const limiter = rateLimit(
    clientKey(request, 'ai-generate'),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return json({ error: 'Too many AI generation requests. Try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const {
    type,
    prompt,
    logoStyle,
    patternStyle,
    imageStyle,
    brandName,
    industry,
    colorPalette,
    width,
    height,
  } = body;

  if (typeof prompt !== 'string' || prompt.trim().length === 0) {
    return badRequest('prompt is required');
  }
  if (prompt.length > 1000) {
    return badRequest('prompt must be 1000 characters or fewer');
  }

  const validTypes: GenerationType[] = ['logo', 'svg_illustration', 'pattern', 'general'];
  const generationType: GenerationType = validTypes.includes(type as GenerationType)
    ? (type as GenerationType)
    : 'general';

  const validDimensions = [512, 768, 1024];
  const resolvedWidth = validDimensions.includes(Number(width)) ? Number(width) : 1024;
  const resolvedHeight = validDimensions.includes(Number(height)) ? Number(height) : 1024;

  // Deduct credits before the potentially slow model call.
  const adminSupabase = createSupabaseAdminClient();
  const cost = CREDIT_COSTS.AI_GENERATE;

  const charged = await creditManager.deductCredits(
    adminSupabase,
    user.id,
    cost,
    'ai_generation',
  );
  if (!charged) {
    return json({ error: 'Insufficient credits', creditsRequired: cost }, { status: 402 });
  }

  try {
    const opts: GenerationOptions = {
      type: generationType,
      prompt: prompt.trim(),
      ...(typeof logoStyle === 'string' && { logoStyle: logoStyle as LogoStyle }),
      ...(typeof patternStyle === 'string' && { patternStyle: patternStyle as PatternStyle }),
      ...(typeof imageStyle === 'string' && { imageStyle: imageStyle as ImageStyle }),
      ...(typeof brandName === 'string' && { brandName }),
      ...(typeof industry === 'string' && { industry }),
      ...(typeof colorPalette === 'string' && { colorPalette }),
      width: resolvedWidth,
      height: resolvedHeight,
    };

    const result = await generateImage(opts);

    return json({
      imageUrl: result.imageUrl,
      prompt: result.prompt,
      type: generationType,
      creditCost: cost,
    });
  } catch (err) {
    // Refund on model failure.
    await creditManager.deductCredits(
      adminSupabase,
      user.id,
      -cost,
      'refund',
    );
    console.error('[ai/generate]', err);
    return serverError('Image generation failed. Credits have been refunded.');
  }
}
