import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, forbidden, serverError, unauthorized } from '@/lib/http';
import { authenticate } from '@/lib/supabase/server';
import { teamManager } from '@/lib/teams/team-manager';
import { isValidUuid } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string; userId: string }> };

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  const { id, userId } = await params;
  if (!isValidUuid(id) || !isValidUuid(userId)) return badRequest('Invalid team or user id');
  if (!(await teamManager.isTeamOwner(id, user.id))) return forbidden();
  try {
    await teamManager.removeMember(id, userId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not remove member');
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  const { id, userId } = await params;
  if (!isValidUuid(id) || !isValidUuid(userId)) return badRequest('Invalid team or user id');
  if (!(await teamManager.isTeamOwner(id, user.id))) return forbidden();
  let body: { role?: unknown };
  try { body = await request.json(); } catch { return badRequest('Invalid JSON body'); }
  if (body.role !== 'editor' && body.role !== 'viewer') return badRequest('Role must be editor or viewer');
  try {
    await teamManager.updateMemberRole(id, userId, body.role);
    return NextResponse.json({ success: true });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not update member');
  }
}
