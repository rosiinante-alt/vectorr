import { NextResponse } from 'next/server';

/** GET /api/health — liveness probe, used by the Postman collection and deploys. */
export function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'vectorr-api',
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  });
}
