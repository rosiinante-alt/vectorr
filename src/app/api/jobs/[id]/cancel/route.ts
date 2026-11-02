import { NextResponse, type NextRequest } from 'next/server';

import { notFound, serverError, unauthorized } from '@/lib/http';
import { vectorizeQueue } from '@/lib/queue/queues';
import { authenticate } from '@/lib/supabase/server';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  const { id } = await params;

  try {
    const job = await vectorizeQueue.getJob(id);
    if (!job || job.data.userId !== user.id) return notFound('Job not found');

    await job.remove();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to cancel job:', error);
    return serverError('Failed to cancel job');
  }
}
