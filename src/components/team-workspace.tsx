'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface TeamMember {
  team_id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'viewer';
  joined_at: string;
  user?: { email: string };
}

interface TeamWorkspaceProps {
  teamId: string;
  isOwner?: boolean;
}

export function TeamWorkspace({ teamId, isOwner = false }: TeamWorkspaceProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = useCallback(async () => {
    const response = await fetch(`/api/teams/${teamId}/members`);
    const result = await response.json();
    if (!response.ok) throw new Error(result.error ?? 'Could not load team members');
    setMembers(result.members ?? []);
  }, [teamId]);

  useEffect(() => {
    let active = true;
    fetch(`/api/teams/${teamId}/members`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? 'Could not load team members');
        if (active) setMembers(result.members ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Could not load team members');
      });
    return () => { active = false; };
  }, [teamId]);

  const handleInvite = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: 'editor' }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not invite member');
      setInviteEmail('');
      await fetchMembers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not invite member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!window.confirm('Remove this member from the team?')) return;
    setError('');
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not remove member');
      await fetchMembers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not remove member');
    }
  };

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users aria-hidden="true" className="h-4 w-4" />
            Team members
          </CardTitle>
          <Badge tone="neutral">{members.length}</Badge>
        </div>

        {error && <p role="alert" className="text-sm text-error">{error}</p>}

        <ul className="divide-y divide-[var(--border)]">
          {members.map((member) => (
            <li key={member.user_id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{member.user?.email || member.user_id}</p>
                <p className="text-xs text-text-secondary">
                  Joined {new Date(member.joined_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={member.role === 'admin' ? 'accent' : 'neutral'}>
                  {member.role === 'admin' ? 'Owner' : member.role}
                </Badge>
                {isOwner && member.role !== 'admin' && (
                  <Button type="button" variant="ghost" aria-label="Remove member"
                    title="Remove member" onClick={() => void handleRemove(member.user_id)}
                    className="h-9 w-9 px-0">
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
          {members.length === 0 && (
            <li className="py-4 text-sm text-text-secondary">No members found.</li>
          )}
        </ul>

        {isOwner && (
          <form onSubmit={handleInvite} className="space-y-3 border-t border-[var(--border)] pt-5">
            <label htmlFor="team-invite-email" className="block text-sm font-medium text-text-primary">
              Invite a member
            </label>
            <div className="flex flex-wrap gap-2">
              <input id="team-invite-email" type="email" required value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="name@example.com"
                className="h-10 min-w-0 flex-1 rounded-md border border-[var(--border-strong)] bg-white px-3 text-sm text-text-primary" />
              <Button type="submit" disabled={loading || !inviteEmail}>
                <Plus aria-hidden="true" className="h-4 w-4" />
                {loading ? 'Inviting' : 'Invite'}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
