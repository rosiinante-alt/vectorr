/**
 * Fixed-window in-memory rate limiter.
 *
 * Suitable for a single instance / local dev. On Vercel's serverless runtime
 * each invocation may get a fresh process, so production should swap this for
 * an Upstash Redis or Vercel KV counter — the interface below is intentionally
 * small enough to reimplement against any store.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

export function resetRateLimits(): void {
  buckets.clear();
}

/** Best-effort client identity for rate-limit keys. */
export function clientKey(request: Request, scope: string, userId?: string): string {
  if (userId) return `${scope}:user:${userId}`;
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  return `${scope}:ip:${ip}`;
}

export const LIMITS = {
  login: { limit: 5, windowMs: 60_000 },
  upload: { limit: 20, windowMs: 60_000 },
  export: { limit: 30, windowMs: 60_000 },
} as const;
