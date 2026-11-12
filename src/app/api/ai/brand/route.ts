import { type NextRequest } from 'next/server';

import { CREDIT_COSTS } from '@/lib/credits/constants';
import { creditManager } from '@/lib/credits/credit-manager';
import { badRequest, json, serverError, unauthorized } from '@/lib/http';
import { clientKey, LIMITS, rateLimit } from '@/lib/rate-limit';
import { authenticate, createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  generateImage,
  type LogoStyle,
} from '@/lib/ai/image-generation-service';
import { generateContent, type ContentType } from '@/lib/ai/content-generation-service';

/**
 * POST /api/ai/brand
 *
 * Generates a complete brand identity package:
 *   - Primary logo (PNG)
 *   - Secondary/icon variant (PNG)
 *   - Brand description copy
 *   - Color palette suggestion (in response, not generated as image)
 *   - Brand tagline suggestion
 *
 * Costs 1.0 credit (= 2× AI_GENERATE, but packaged).
 *
 * Request body:
 * {
 *   brandName: string;       // max 100 chars
 *   industry: string;        // max 100 chars
 *   style: LogoStyle;        // e.g. 'minimalist', 'modern', 'vintage'
 *   colorPalette?: string;   // e.g. 'blue and gold', 'earth tones'
 *   audience?: string;
 *   keywords?: string[];     // up to 5
 * }
 */
export async function POST(request: NextRequest) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  const limiter = rateLimit(
    clientKey(request, 'ai-brand'),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return json({ error: 'Too many brand generation requests. Try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { brandName, industry, style, colorPalette, audience, keywords } = body;

  if (typeof brandName !== 'string' || brandName.trim().length === 0) {
    return badRequest('brandName is required');
  }
  if (brandName.length > 100) {
    return badRequest('brandName must be 100 characters or fewer');
  }
  if (typeof industry !== 'string' || industry.trim().length === 0) {
    return badRequest('industry is required');
  }
  if (industry.length > 100) {
    return badRequest('industry must be 100 characters or fewer');
  }

  const logoStyle: LogoStyle =
    typeof style === 'string' &&
    ['minimalist', 'vintage', 'modern', 'geometric', 'playful', 'bold', 'elegant'].includes(style)
      ? (style as LogoStyle)
      : 'modern';

  const resolvedKeywords = Array.isArray(keywords)
    ? keywords.filter((k): k is string => typeof k === 'string').slice(0, 5)
    : [];

  // Deduct 1.0 credit upfront.
  const adminSupabase = createSupabaseAdminClient();
  const cost = CREDIT_COSTS.BRAND_IDENTITY;

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
    // 1. Primary logo
    const primaryPrompt = `Professional logo for ${brandName}`;
    const primaryLogo = await generateImage({
      type: 'logo',
      prompt: primaryPrompt,
      logoStyle,
      brandName: brandName.trim(),
      industry: industry.trim(),
      ...(typeof colorPalette === 'string' && { colorPalette }),
      width: 1024,
      height: 1024,
    });

    // 2. Secondary/icon variant (square, simpler)
    const iconPrompt = `Simplified icon version of ${brandName} logo, square format, minimal detail`;
    const iconLogo = await generateImage({
      type: 'logo',
      prompt: iconPrompt,
      logoStyle,
      brandName: brandName.trim(),
      industry: industry.trim(),
      ...(typeof colorPalette === 'string' && { colorPalette }),
      width: 512,
      height: 512,
    });

    // 3. Brand description
    const description = await generateContent({
      type: 'product_description' as ContentType,
      subject: `${brandName} brand identity`,
      brandName: brandName.trim(),
      industry: industry.trim(),
      ...(typeof audience === 'string' && { audience }),
      keywords: resolvedKeywords,
    });

    // 4. Suggest color palette (no generation needed, just recommendation text)
    const paletteHex = inferPalette(colorPalette as string | undefined, logoStyle);

    // 5. Suggest tagline
    const tagline = generateTagline(brandName.trim(), industry.trim(), logoStyle);

    return json({
      brandName: brandName.trim(),
      industry: industry.trim(),
      style: logoStyle,
      primaryLogoUrl: primaryLogo.imageUrl,
      iconLogoUrl: iconLogo.imageUrl,
      description: description.content,
      colorPalette: paletteHex,
      tagline,
      creditCost: cost,
    });
  } catch (err) {
    // Refund on failure.
    await creditManager.deductCredits(adminSupabase, user.id, -cost, 'refund');
    console.error('[ai/brand]', err);
    return serverError('Brand generation failed. Credits have been refunded.');
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function inferPalette(userPalette: string | undefined, style: LogoStyle): string[] {
  if (userPalette) {
    // Return a placeholder; in production you'd use a color extraction service.
    return ['#1E40AF', '#3B82F6', '#93C5FD'];
  }

  const palettes: Record<LogoStyle, string[]> = {
    minimalist: ['#000000', '#FFFFFF', '#6B7280'],
    vintage: ['#8B4513', '#D2691E', '#F5DEB3'],
    modern: ['#3B82F6', '#1E293B', '#F1F5F9'],
    geometric: ['#EF4444', '#F59E0B', '#10B981'],
    playful: ['#EC4899', '#F59E0B', '#8B5CF6'],
    bold: ['#DC2626', '#000000', '#FBBF24'],
    elegant: ['#1F2937', '#D4AF37', '#F9FAFB'],
  };

  return palettes[style] || palettes.modern;
}

function generateTagline(brand: string, industry: string, style: LogoStyle): string {
  const templates: Record<LogoStyle, string[]> = {
    minimalist: [
      'Simple. Elegant. {brand}.',
      'Less noise. More {industry}.',
      'Clarity in every detail.',
    ],
    vintage: [
      'Timeless quality since day one.',
      'Crafted with care. Built to last.',
      '{brand}: Where tradition meets {industry}.',
    ],
    modern: [
      'Redefining {industry}, one idea at a time.',
      '{brand}: Built for tomorrow.',
      'Innovation you can trust.',
    ],
    geometric: [
      'Precision meets creativity.',
      '{brand}: Sharp. Bold. Distinct.',
      'Where form follows function.',
    ],
    playful: [
      'Serious about fun.',
      '{brand}: Where {industry} gets creative.',
      'Unexpected. Delightful. Memorable.',
    ],
    bold: [
      '{brand}: Make your mark.',
      'Loud, proud, and built to stand out.',
      "We don't do subtle.",
    ],
    elegant: [
      'Refined. Sophisticated. {brand}.',
      'Luxury in every line.',
      'Timeless elegance for modern {industry}.',
    ],
  };

  const options = templates[style] || templates.modern;
  const chosen = options[Math.floor(Math.random() * options.length)];
  return chosen.replace('{brand}', brand).replace('{industry}', industry);
}
