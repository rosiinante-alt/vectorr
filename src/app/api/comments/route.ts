import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, forbidden, notFound, serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';
import { commentManager } from '@/lib/collaboration/comments';
import { isValidUuid } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  let body: { conversionId?: unknown; content?: unknown; parentCommentId?: unknown };
  try { body = await request.json(); } catch { return badRequest('Invalid JSON body'); }
  const { conversionId, content, parentCommentId } = body;
  if (typeof conversionId !== 'string' || !isValidUuid(conversionId)) return badRequest('Invalid conversionId');
  if (typeof content !== 'string' || !content.trim() || content.length > 10000) {
    return badRequest('Comment must contain 1 to 10000 characters');
  }
  if (parentCommentId !== undefined && (typeof parentCommentId !== 'string' || !isValidUuid(parentCommentId))) {
    return badRequest('Invalid parentCommentId');
  }
  try {
    const comment = await commentManager.addComment(conversionId, user.id, content.trim(), parentCommentId as string | undefined);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not add comment');
  }
}

export async function GET(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  const conversionId = request.nextUrl.searchParams.get('conversionId');
  if (!conversionId || !isValidUuid(conversionId)) return badRequest('Valid conversionId is required');
  try {
    return NextResponse.json({ comments: await commentManager.getComments(conversionId) });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not load comments');
  }
}

export async function PATCH(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  let body: { commentId?: unknown; content?: unknown };
  try { body = await request.json(); } catch { return badRequest('Invalid JSON body'); }
  if (typeof body.commentId !== 'string' || !isValidUuid(body.commentId) ||
    typeof body.content !== 'string' || !body.content.trim() || body.content.length > 10000) {
    return badRequest('Valid commentId and content are required');
  }
  const { data: comment, error: findError } = await supabase.from('conversion_comments')
    .select('id,user_id').eq('id', body.commentId).maybeSingle();
  if (findError) return serverError(findError.message);
  if (!comment) return notFound('Comment not found');
  if (comment.user_id !== user.id) return forbidden();
  try {
    return NextResponse.json(await commentManager.updateComment(body.commentId, body.content.trim()));
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not update comment');
  }
}

export async function DELETE(request: NextRequest) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  const commentId = request.nextUrl.searchParams.get('commentId');
  if (!commentId || !isValidUuid(commentId)) return badRequest('Valid commentId is required');
  const { data: comment, error: findError } = await supabase.from('conversion_comments')
    .select('id,user_id').eq('id', commentId).maybeSingle();
  if (findError) return serverError(findError.message);
  if (!comment) return notFound('Comment not found');
  if (comment.user_id !== user.id) return forbidden();
  try {
    await commentManager.deleteComment(commentId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not delete comment');
  }
}
