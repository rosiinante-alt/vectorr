import { createSupabaseServerClient } from '@/lib/supabase/server';

export type TeamRole = 'owner' | 'editor' | 'viewer';

export interface TeamMember {
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
}

export class TeamManager {
  async createTeam(ownerId: string, name: string, description?: string) {
    const supabase = await createSupabaseServerClient();
    const { data: team, error } = await supabase
      .from('teams')
      .insert({ name, owner_id: ownerId })
      .select()
      .single();
    if (error) throw error;

    const { error: memberError } = await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: ownerId,
      role: 'admin',
    });
    if (memberError) {
      await supabase.from('teams').delete().eq('id', team.id);
      throw memberError;
    }
    return { ...team, description: description ?? null };
  }

  async addMember(teamId: string, userId: string, role: Exclude<TeamRole, 'owner'> = 'editor') {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('team_members')
      .insert({ team_id: teamId, user_id: userId, role })
      .select().single();
    if (error) throw error;
    return data;
  }

  async getTeamMembers(teamId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('team_members')
      .select('team_id,user_id,role,joined_at').eq('team_id', teamId);
    if (error) throw error;
    return data ?? [];
  }

  async getUserTeams(userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('team_members')
      .select('team_id,user_id,role,joined_at').eq('user_id', userId);
    if (error) throw error;
    const memberships = data ?? [];
    const teams = await Promise.all(memberships.map(async (membership) => {
      const { data: team, error: teamError } = await supabase.from('teams')
        .select('*').eq('id', membership.team_id).maybeSingle();
      if (teamError) throw teamError;
      return { ...membership, team };
    }));
    return teams;
  }

  async removeMember(teamId: string, userId: string) {
    const supabase = await createSupabaseServerClient();
    const { data: team, error: teamError } = await supabase.from('teams')
      .select('owner_id').eq('id', teamId).maybeSingle();
    if (teamError) throw teamError;
    if (team?.owner_id === userId) throw new Error('The team owner cannot be removed');
    const { error } = await supabase.from('team_members').delete()
      .eq('team_id', teamId).eq('user_id', userId);
    if (error) throw error;
  }

  async updateMemberRole(teamId: string, userId: string, role: Exclude<TeamRole, 'owner'>) {
    const supabase = await createSupabaseServerClient();
    const { data: team } = await supabase.from('teams').select('owner_id').eq('id', teamId).maybeSingle();
    if (team?.owner_id === userId) throw new Error('The team owner role cannot be changed');
    const { error } = await supabase.from('team_members').update({ role })
      .eq('team_id', teamId).eq('user_id', userId);
    if (error) throw error;
  }

  async isTeamOwner(teamId: string, userId: string): Promise<boolean> {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('teams').select('owner_id')
      .eq('id', teamId).maybeSingle();
    if (error) throw error;
    return data?.owner_id === userId;
  }
}

export const teamManager = new TeamManager();
