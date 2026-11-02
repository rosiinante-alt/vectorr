import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface VersionEntry {
  id: string;
  conversion_id: string;
  created_by: string | null;
  checkpoint_name: string;
  metadata?: Record<string, unknown>;
  file_url: string;
  created_at: string;
}

export class VersionHistoryManager {
  async recordVersion(conversionId: string, userId: string, action: string,
    metadata?: Record<string, unknown>, fileUrl?: string) {
    if (!fileUrl) throw new Error('A file URL is required to create a version checkpoint');
    const supabase = await createSupabaseServerClient();
    const { data: latest, error: latestError } = await supabase.from('conversion_versions')
      .select('version_number').eq('conversion_id', conversionId)
      .order('version_number', { ascending: false }).limit(1).maybeSingle();
    if (latestError) throw latestError;
    const { data, error } = await supabase.from('conversion_versions').insert({
      conversion_id: conversionId,
      version_number: (latest?.version_number ?? 0) + 1,
      checkpoint_name: action,
      metadata: metadata ?? {},
      file_url: fileUrl,
      created_by: userId,
    }).select('*').single();
    if (error) throw error;
    return data;
  }

  async getVersions(conversionId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('conversion_versions').select('*')
      .eq('conversion_id', conversionId).order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async revertToVersion(conversionId: string, versionId: string) {
    const supabase = await createSupabaseServerClient();
    const { data: version, error: versionError } = await supabase.from('conversion_versions')
      .select('*').eq('id', versionId).eq('conversion_id', conversionId).maybeSingle();
    if (versionError) throw versionError;
    if (!version) throw new Error('Version not found');
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) throw new Error('Unauthorized');
    const { error: updateError } = await supabase.from('conversions')
      .update({ converted_file_url: version.file_url }).eq('id', conversionId);
    if (updateError) throw updateError;
    return this.recordVersion(conversionId, authData.user.id, 'Reverted',
      { reverted_to: versionId }, version.file_url);
  }
}

export const versionHistoryManager = new VersionHistoryManager();
