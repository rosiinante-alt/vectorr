import { NextResponse, type NextRequest } from 'next/server';

import { notFound, serverError, unauthorized } from '@/lib/http';
import { vectorizeQueue } from '@/lib/queue/queues';
import { authenticate } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await authenticate();
  if (!user) return unauthorized();

  const { id } = await params;

  try {
    const job = await vectorizeQueue.getJob(id);
    if (!job || job.data.userId !== user.id) return notFound('Job not found');

    return NextResponse.json({
      id: job.id,
      state: await job.getState(),
      progress: job.progress,
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    });
  } catch (error) {
    console.error('Failed to get job status:', error);
    return serverError('Failed to get job status');
  }
}
