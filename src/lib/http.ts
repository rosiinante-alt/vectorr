import { NextResponse } from 'next/server';
import type { ApiError } from './types';

export function jsonError(error: string, status: number, details?: unknown): NextResponse<ApiError> {
  return NextResponse.json(details === undefined ? { error } : { error, details }, { status });
}

export const unauthorized = () => jsonError('Unauthorized', 401);
export const badRequest = (message: string, details?: unknown) => jsonError(message, 400, details);
export const notFound = (message = 'Not found') => jsonError(message, 404);
export const tooManyRequests = (retryAfterSeconds: number) =>
  NextResponse.json<ApiError>(
    { error: 'Rate limit exceeded. Try again later.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
  );
export const serverError = (message = 'Internal server error') => jsonError(message, 500);

/**
 * Reads a JSON body, tolerating an empty body or a non-JSON content type.
 * Returns an empty object in those cases so `{ format = 'svg' }`-style defaults
 * keep working.
 */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text();
    if (!text.trim()) return {};
    const parsed: unknown = JSON.parse(text);
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
