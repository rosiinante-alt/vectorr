import { NextResponse, type NextRequest } from 'next/server';

import { badRequest, forbidden, serverError, unauthorized } from '@/lib/http';
import { teamManager } from '@/lib/teams/team-manager';
import { authenticate, createSupabaseAdminClient } from '@/lib/supabase/server';
import { isValidUuid } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  const { id } = await params;
  if (!isValidUuid(id)) return badRequest('Invalid team id');
  const { data: membership } = await supabase.from('team_members').select('team_id')
    .eq('team_id', id).eq('user_id', user.id).maybeSingle();
  const { data: team } = await supabase.from('teams').select('owner_id').eq('id', id).maybeSingle();
  if (!membership && team?.owner_id !== user.id) return forbidden();
  try {
    const members = await teamManager.getTeamMembers(id);
    const admin = createSupabaseAdminClient();
    const emails = new Map<string, string>();
    for (let page = 1; ; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw error;
      for (const account of data.users) {
        if (members.some((member) => member.user_id === account.id)) {
          emails.set(account.id, account.email ?? '');
        }
      }
      if (data.users.length < 1000 || members.every((member) => emails.has(member.user_id))) break;
    }
    return NextResponse.json({ members: members.map((member) => ({
      ...member, user: { email: emails.get(member.user_id) ?? '' },
    })) });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not load members');
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const { user, supabase } = await authenticate();
  if (!user || !supabase) return unauthorized();
  const { id } = await params;
  if (!isValidUuid(id)) return badRequest('Invalid team id');
  if (!(await teamManager.isTeamOwner(id, user.id))) return forbidden();
  let body: { email?: unknown; role?: unknown };
  try { body = await request.json(); } catch { return badRequest('Invalid JSON body'); }
  if (typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return badRequest('A valid email address is required');
  }
  const role = body.role ?? 'editor';
  if (role !== 'editor' && role !== 'viewer') return badRequest('Role must be editor or viewer');
  try {
    const admin = createSupabaseAdminClient();
    const email = body.email.toLowerCase();
    let page = 1;
    let invited: { id: string; email?: string } | undefined;
    while (!invited) {
      const { data, error: lookupError } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (lookupError) throw lookupError;
      invited = data.users.find((candidate) => candidate.email?.toLowerCase() === email);
      if (data.users.length < 1000) break;
      page += 1;
    }
    if (!invited) return NextResponse.json({ error: 'No account found for that email' }, { status: 404 });
    const member = await teamManager.addMember(id, invited.id, role);
    return NextResponse.json({ member: { ...member, user: { email: invited.email ?? email } } }, { status: 201 });
  } catch (error) {
    return serverError(error instanceof Error ? error.message : 'Could not add team member');
  }
}
