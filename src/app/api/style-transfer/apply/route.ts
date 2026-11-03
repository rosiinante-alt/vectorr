import { NextResponse, type NextRequest } from 'next/server';

import { creditManager, CREDIT_COSTS } from '@/lib/credits/credit-manager';
import { badRequest, jsonError, serverError, unauthorized } from '@/lib/http';
import { styleTransferQueue } from '@/lib/queue/queues';
import { clientKey, LIMITS, rateLimit } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';
import { isStylePresetId, STYLE_PRESETS } from '@/lib/ai/style-transfer-presets';

const MAX_CUSTOM_PARAMS_BYTES = 4096;

/**
 * POST /api/style-transfer/apply
 * { imageUrl: string, presetId: string, customParams?: object }
 *
 * Creates an `ai_generations` row of type `style_transfer`, charges the preset
 * cost, and enqueues the job. The charge is refunded if enqueuing fails.
 */
export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  const limiter = rateLimit(
    clientKey(request, 'style-transfer'),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return jsonError('Too many style transfers. Try again later.', 429, {
      retryAfterSeconds: limiter.retryAfterSeconds,
    });
  }

  let body: { imageUrl?: unknown; presetId?: unknown; customParams?: unknown };
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { imageUrl, presetId, customParams } = body;

  if (typeof imageUrl !== 'string' || !/^https?:\/\//i.test(imageUrl)) {
    return badRequest('imageUrl must be an http(s) URL');
  }
  if (!isStylePresetId(presetId)) {
    return badRequest(
      `Unknown presetId. Available: ${STYLE_PRESETS.map((p) => p.id).join(', ')}`,
    );
  }
  if (customParams !== undefined) {
    if (customParams === null || typeof customParams !== 'object' || Array.isArray(customParams)) {
      return badRequest('customParams must be an object');
    }
    if (JSON.stringify(customParams).length > MAX_CUSTOM_PARAMS_BYTES) {
      return badRequest('customParams is too large');
    }
  }

  const hasCredits = await creditManager.hasEnoughCredits(
    supabase,
    user.id,
    CREDIT_COSTS.STYLE_TRANSFER,
  );
  if (!hasCredits) {
    return jsonError('Insufficient credits', 402);
  }

  const { data: transfer, error } = await supabase
    .from('ai_generations')
    .insert({
      user_id: user.id,
      type: 'style_transfer',
      preset: presetId,
      input_file_url: imageUrl,
      credits_used: CREDIT_COSTS.STYLE_TRANSFER,
      status: 'pending',
      metadata: customParams ? { customParams } : {},
    })
    .select('id')
    .single();

  if (error || !transfer) {
    return serverError(error?.message ?? 'Could not create style transfer');
  }

  // `deduct_credits` re-checks under a row lock, so this can still fail here
  // even though the advisory check above passed.
  const charged = await creditManager.deductCredits(
    supabase,
    user.id,
    CREDIT_COSTS.STYLE_TRANSFER,
    'ai_generation',
  );

  if (!charged) {
    await supabase.from('ai_generations').delete().eq('id', transfer.id);
    return jsonError('Insufficient credits', 402);
  }

  try {
    const job = await styleTransferQueue.add('style-transfer', {
      styleTransferId: transfer.id,
      userId: user.id,
      imageUrl,
      presetId,
      customParams: customParams as Record<string, unknown> | undefined,
    });

    await supabase
      .from('ai_generations')
      .update({ job_id: String(job.id), status: 'pending' })
      .eq('id', transfer.id);

    return NextResponse.json({ id: transfer.id, jobId: job.id }, { status: 202 });
  } catch (queueError) {
    // Never leave a paid job that will not run.
    await creditManager.addCredits(supabase, user.id, CREDIT_COSTS.STYLE_TRANSFER, 'refund');
    await supabase
      .from('ai_generations')
      .update({
        status: 'failed',
        error_message:
          queueError instanceof Error ? queueError.message : 'Could not enqueue style transfer',
      })
      .eq('id', transfer.id);

    return serverError('Could not enqueue style transfer');
  }
}