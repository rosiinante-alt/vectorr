import { NextRequest } from 'next/server';
import { authenticate } from '@/lib/supabase/server';
import { json, unauthorized, notFound, badRequest, forbidden } from '@/lib/http';
import { optimizeSVG, MAX_OPTIMIZE_SIZE_BYTES } from '@/lib/optimize';

const FREE_TIER_LIMIT = 3;

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/files/:id/optimize
 * 
 * Run SVG optimization on the stored file and return a savings breakdown.
 */
export async function POST(
  req: NextRequest,
  { params }: RouteContext
) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();

  const { id: fileId } = await params;

  // Parse request body
  let precision = 3;
  try {
    const body = await req.json();
    if (body.precision !== undefined) {
      precision = Number(body.precision);
      if (!Number.isFinite(precision) || precision < 0 || precision > 10) {
        return badRequest('precision must be a number between 0 and 10');
      }
    }
  } catch {
    // Empty body is fine
  }

  // Check quota
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
  const { data: quota } = await supabase
    .from('optimization_quota')
    .select('count')
    .eq('user_id', user.id)
    .eq('year_month', currentMonth)
    .single();

  const used = quota?.count ?? 0;
  if (used >= FREE_TIER_LIMIT) {
    return forbidden(
      `Monthly optimization limit exceeded (${used}/${FREE_TIER_LIMIT}). Upgrade to unlock unlimited optimizations.`
    );
  }

  // Fetch the file
  const { data: file, error: fileError } = await supabase
    .from('files')
    .select('id, user_id, file_path, original_size_bytes, metadata')
    .eq('id', fileId)
    .single();

  if (fileError || !file) return notFound('File not found');
  if (file.user_id !== user.id) return forbidden();

  // Download the SVG from storage
  const { data: blob, error: downloadError } = await supabase.storage
    .from('vector-files')
    .download(file.file_path);

  if (downloadError || !blob) {
    return json({ error: 'Failed to download file from storage' }, { status: 500 });
  }

  const svgContent = await blob.text();
  const originalBytes = Buffer.byteLength(svgContent, 'utf8');

  // Check size cap
  if (originalBytes > MAX_OPTIMIZE_SIZE_BYTES) {
    return json(
      {
        error: `File too large for optimization (${(originalBytes / 1024).toFixed(0)}KB exceeds ${(MAX_OPTIMIZE_SIZE_BYTES / 1024).toFixed(0)}KB limit)`,
      },
      { status: 413 }
    );
  }

  // Run optimization
  let result;
  try {
    result = await optimizeSVG(svgContent, precision);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Optimization failed';
    return json({ error: message }, { status: 500 });
  }

  // Store optimized version as a new export record
  const optimizedPath = file.file_path.replace(/\.svg$/, `-optimized-${Date.now()}.svg`);
  
  const { error: uploadError } = await supabase.storage
    .from('vector-files')
    .upload(optimizedPath, result.optimizedSvg, {
      contentType: 'image/svg+xml',
      upsert: false,
    });

  if (uploadError) {
    return json({ error: 'Failed to store optimized file' }, { status: 500 });
  }

  // Create export record
  const { data: exportRecord, error: exportError } = await supabase
    .from('exports')
    .insert({
      file_id: fileId,
      format: 'svg',
      file_path: optimizedPath,
      file_size_bytes: result.optimizedSizeBytes,
    })
    .select()
    .single();

  if (exportError || !exportRecord) {
    // Rollback storage upload
    await supabase.storage.from('vector-files').remove([optimizedPath]);
    return json({ error: 'Failed to create export record' }, { status: 500 });
  }

  // Update file metadata with optimization report
  const updatedMetadata = {
    ...((file.metadata as Record<string, unknown>) || {}),
    optimization: {
      originalSizeBytes: result.originalSizeBytes,
      optimizedSizeBytes: result.optimizedSizeBytes,
      savedBytes: result.savedBytes,
      savedPercent: result.savedPercent,
      optimizations: result.optimizations,
      exportId: exportRecord.id,
      optimizedAt: new Date().toISOString(),
      precision,
    },
  };

  const { error: updateError } = await supabase
    .from('files')
    .update({
      optimized_size_bytes: result.optimizedSizeBytes,
      metadata: updatedMetadata,
    })
    .eq('id', fileId);

  if (updateError) {
    // Non-fatal; the export is already created
    console.error('Failed to update file metadata:', updateError);
  }

  // Increment quota counter
  await supabase
    .from('optimization_quota')
    .upsert(
      {
        user_id: user.id,
        year_month: currentMonth,
        count: used + 1,
      },
      { onConflict: 'user_id,year_month' }
    );

  // Audit log
  await supabase.from('audit_log').insert({
    user_id: user.id,
    action: 'optimize_file',
    resource_id: fileId,
  });

  return json({
    fileId,
    exportId: exportRecord.id,
    originalSizeBytes: result.originalSizeBytes,
    optimizedSizeBytes: result.optimizedSizeBytes,
    savedBytes: result.savedBytes,
    savedPercent: Math.round(result.savedPercent * 10) / 10,
    optimizations: result.optimizations,
    status: 'optimized',
  });
}
