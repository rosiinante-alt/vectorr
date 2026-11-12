import { type NextRequest } from 'next/server';

import { CREDIT_COSTS } from '@/lib/credits/constants';
import { creditManager } from '@/lib/credits/credit-manager';
import { badRequest, json, serverError, unauthorized } from '@/lib/http';
import { clientKey, LIMITS, rateLimit } from '@/lib/rate-limit';
import { authenticate, createSupabaseAdminClient } from '@/lib/supabase/server';
import {
  animateSvg,
  validateSvg,
  type AnimationTier,
} from '@/lib/ai/svg-animation-service';

/**
 * POST /api/ai/animate
 *
 * Animates an SVG by rewriting it with CSS keyframes. Fully programmatic —
 * no external model or service.
 *
 * Request body:
 * {
 *   svg: string;          // raw SVG markup (max 500KB)
 *   tier: 'eco' | 'standard' | 'pro';
 *   duration?: number;    // seconds, 1-10 (default 2)
 *   loop?: boolean;       // default false
 *   respectReducedMotion?: boolean; // default true
 * }
 *
 * Credit cost:
 *   - eco:      0.00 (free)
 *   - standard: 0.25
 *   - pro:      0.50
 */
export async function POST(request: NextRequest) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  const limiter = rateLimit(
    clientKey(request, 'ai-animate'),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return json({ error: 'Too many animation requests. Try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { svg, tier, duration, loop, respectReducedMotion } = body;

  if (typeof svg !== 'string' || svg.trim().length === 0) {
    return badRequest('svg is required');
  }
  if (svg.length > 500_000) {
    return badRequest('SVG must be 500KB or smaller');
  }

  const validTiers: AnimationTier[] = ['eco', 'standard', 'pro'];
  const animationTier: AnimationTier = validTiers.includes(tier as AnimationTier)
    ? (tier as AnimationTier)
    : 'eco';

  const validation = validateSvg(svg);
  if (!validation.valid) {
    return badRequest(validation.error ?? 'Invalid SVG');
  }

  const costMap: Record<AnimationTier, number> = {
    eco: CREDIT_COSTS.ANIMATE_ECO,
    standard: CREDIT_COSTS.ANIMATE_STANDARD,
    pro: CREDIT_COSTS.ANIMATE_PRO,
  };
  const cost = costMap[animationTier];

  // Deduct credits before the operation (skip for free tier).
  if (cost > 0) {
    const adminSupabase = createSupabaseAdminClient();
    const charged = await creditManager.deductCredits(
      adminSupabase,
      user.id,
      cost,
      'ai_generation',
    );
    if (!charged) {
      return json({ error: 'Insufficient credits', creditsRequired: cost }, { status: 402 });
    }
  }

  try {
    const result = animateSvg({
      svg,
      tier: animationTier,
      ...(typeof duration === 'number' && { duration }),
      ...(typeof loop === 'boolean' && { loop }),
      ...(typeof respectReducedMotion === 'boolean' && { respectReducedMotion }),
    });

    return json({
      animatedSvg: result.animatedSvg,
      tier: result.tier,
      effects: result.effects,
      elementCount: result.elementCount,
      creditCost: cost,
    });
  } catch (err) {
    // Refund on error (only if credits were deducted).
    if (cost > 0) {
      const adminSupabase = createSupabaseAdminClient();
      await creditManager.deductCredits(adminSupabase, user.id, -cost, 'refund');
    }
    console.error('[ai/animate]', err);
    return serverError('SVG animation failed. Credits have been refunded.');
  }
}
