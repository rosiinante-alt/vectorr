import { type NextRequest } from 'next/server';

import { badRequest, json, unauthorized } from '@/lib/http';
import { clientKey, LIMITS, rateLimit } from '@/lib/rate-limit';
import { authenticate } from '@/lib/supabase/server';
import {
  generateContent,
  type ContentOptions,
  type ContentType,
} from '@/lib/ai/content-generation-service';

/**
 * POST /api/ai/content
 *
 * Generates marketing copy: Etsy listings, alt text, blog intros, product
 * descriptions, and SVG descriptions. This operation is **free** — no
 * credit is deducted.
 *
 * Request body:
 * {
 *   type: 'etsy_listing' | 'alt_text' | 'blog_intro' | 'product_description' | 'svg_description';
 *   subject: string;    // max 200 chars — the product or image being described
 *   brandName?: string;
 *   industry?: string;
 *   audience?: string;
 *   keywords?: string[];  // up to 10
 * }
 */
export async function POST(request: NextRequest) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  const limiter = rateLimit(
    clientKey(request, 'ai-content'),
    LIMITS.export.limit,
    LIMITS.export.windowMs,
  );
  if (!limiter.allowed) {
    return json({ error: 'Too many content generation requests. Try again later.' }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body');
  }

  const { type, subject, brandName, industry, audience, keywords } = body;

  if (typeof subject !== 'string' || subject.trim().length === 0) {
    return badRequest('subject is required');
  }
  if (subject.length > 200) {
    return badRequest('subject must be 200 characters or fewer');
  }

  const validTypes: ContentType[] = [
    'etsy_listing',
    'alt_text',
    'blog_intro',
    'product_description',
    'svg_description',
  ];
  const contentType: ContentType = validTypes.includes(type as ContentType)
    ? (type as ContentType)
    : 'product_description';

  const resolvedKeywords = Array.isArray(keywords)
    ? keywords.filter((k): k is string => typeof k === 'string').slice(0, 10)
    : [];

  try {
    const opts: ContentOptions = {
      type: contentType,
      subject: subject.trim(),
      ...(typeof brandName === 'string' && { brandName }),
      ...(typeof industry === 'string' && { industry }),
      ...(typeof audience === 'string' && { audience }),
      keywords: resolvedKeywords,
    };

    const result = await generateContent(opts);

    return json({
      type: contentType,
      title: result.title,
      content: result.content,
      tags: result.tags ?? [],
      creditCost: 0,
    });
  } catch (err) {
    console.error('[ai/content]', err);
    return json({ error: 'Content generation failed. Please try again.' }, { status: 500 });
  }
}
