/**
 * Rate limiter with swappable backends (in-memory for local dev, external store for production).
 * 
 * Set RATE_LIMIT_DRIVER to 'memory' (default) or 'upstash' in .env.
 * The Upstash implementation is a stub; production deployment needs a real Redis client.
 */
import type { NextRequest } from 'next/server';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string, limit: number, windowMs: number): RateLimitResult;
  reset?: () => void;
}

// ============================================================================
// In-memory implementation (suitable for single-instance local dev)
// ============================================================================
interface Bucket {
  count: number;
  resetAt: number;
}

class InMemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, Bucket>();

  check(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      this.buckets.set(key, { count: 1, resetAt: now + windowMs });
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
    return {
      allowed: true,
      remaining: limit - existing.count,
      retryAfterSeconds: 0,
    };
  }

  reset(): void {
    this.buckets.clear();
  }
}

// ============================================================================
// Upstash Redis stub (not implemented; needs a real Upstash client)
// ============================================================================
class UpstashRateLimiter implements RateLimiter {
  check(): RateLimitResult {
    throw new Error(
      'Upstash rate limiter is not configured. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env, then implement this class with @upstash/ratelimit.'
    );
  }

  reset(): void {
    throw new Error('Upstash rate limiter is not configured.');
  }
}

// ============================================================================
// Factory
// ============================================================================
const DRIVER = process.env.RATE_LIMIT_DRIVER || 'memory';

let instance: RateLimiter;

function getRateLimiter(): RateLimiter {
  if (instance) return instance;

  if (DRIVER === 'upstash') {
    instance = new UpstashRateLimiter();
  } else {
    instance = new InMemoryRateLimiter();
  }

  return instance;
}

// ============================================================================
// Public API (backwards-compatible with existing callers)
// ============================================================================
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const limiter = getRateLimiter();
  return limiter.check(key, limit, windowMs);
}

export function resetRateLimits(): void {
  const limiter = getRateLimiter();
  if (limiter.reset) {
    limiter.reset();
  }
}

// ============================================================================
// Helpers for route handlers
// ============================================================================
export function clientKey(request: NextRequest, scope: string): string {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  return `${scope}:${ip}`;
}

export const LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  upload: { limit: 10, windowMs: 60 * 1000 }, // 10 uploads per minute
  export: { limit: 20, windowMs: 60 * 1000 }, // 20 exports per minute
};
