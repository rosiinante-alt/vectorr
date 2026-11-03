import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { vectorizeQueue, removeBgQueue, upscaleQueue } from '@/lib/queue/queues';
import { CREDIT_COSTS } from '@/lib/credits/constants';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  const file = formData.get('file');
  const removeBg = formData.get('removeBg') === 'true';
  const upscale = formData.get('upscale') as '2x' | '4x' | null;
  const outputFormat = (formData.get('outputFormat') as string) || 'svg';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Use PNG, JPG, or WEBP.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large (max 50 MB)' }, { status: 400 });
  }

  // Calculate total credit cost
  let totalCost = CREDIT_COSTS.VECTORIZE;
  if (removeBg) totalCost += CREDIT_COSTS.REMOVE_BG;
  if (upscale === '2x') totalCost += CREDIT_COSTS.UPSCALE_2X;
  if (upscale === '4x') totalCost += CREDIT_COSTS.UPSCALE_4X;

  // Check credit balance
  const { data: profile } = await supabase
    .from('users')
    .select('credit_balance')
    .eq('id', user.id)
    .single();

  const balance = profile?.credit_balance ?? 0;
  if (balance < totalCost) {
    return NextResponse.json(
      { error: 'Insufficient credits', required: totalCost, balance },
      { status: 402 },
    );
  }

  // Upload original file to Supabase Storage
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.type.split('/')[1];
  const storagePath = `conversions/${user.id}/${Date.now()}-original.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('conversions')
    .upload(storagePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage
    .from('conversions')
    .getPublicUrl(storagePath);

  const originalFileUrl = urlData.publicUrl;

  // Create conversion record
  const { data: conversion, error: dbError } = await supabase
    .from('conversions')
    .insert({
      user_id: user.id,
      original_file_url: originalFileUrl,
      original_filename: file.name,
      original_file_size: file.size,
      output_format: outputFormat,
      preprocessing: { removeBg, upscale },
      status: 'pending',
      credit_cost: totalCost,
    })
    .select()
    .single();

  if (dbError || !conversion) {
    await supabase.storage.from('conversions').remove([storagePath]);
    return NextResponse.json({ error: 'Failed to create conversion record' }, { status: 500 });
  }

  // Deduct credits optimistically
  await supabase.rpc('deduct_credits', {
    p_user_id: user.id,
    p_amount: totalCost,
    p_reason: 'conversion',
    p_reference_id: conversion.id,
  });

  // Queue the vectorization job
  const job = await vectorizeQueue.add('vectorize', {
    conversionId: conversion.id,
    userId: user.id,
    originalFileUrl,
    preprocessing: { removeBg, upscale },
    outputFormat,
  });

  // Update conversion with job ID
  await supabase
    .from('conversions')
    .update({ job_id: job.id, status: 'queued' })
    .eq('id', conversion.id);

  return NextResponse.json({
    conversionId: conversion.id,
    jobId: job.id,
    creditCost: totalCost,
    remainingBalance: balance - totalCost,
  }, { status: 201 });
}
