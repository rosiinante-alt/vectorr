import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface Comment {
  id: string;
  conversion_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  parent_id?: string | null;
  replies?: Comment[];
}

export class CommentManager {
  async addComment(conversionId: string, userId: string, content: string, parentCommentId?: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('conversion_comments').insert({
      conversion_id: conversionId,
      user_id: userId,
      content,
      parent_id: parentCommentId ?? null,
    }).select('*').single();
    if (error) throw error;
    return data;
  }

  async getComments(conversionId: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('conversion_comments').select('*')
      .eq('conversion_id', conversionId).is('parent_id', null)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const comments = data ?? [];
    const ids = comments.map((comment) => comment.id);
    if (!ids.length) return comments;
    const { data: replies, error: repliesError } = await supabase.from('conversion_comments')
      .select('*').in('parent_id', ids).order('created_at', { ascending: true });
    if (repliesError) throw repliesError;
    return comments.map((comment) => ({
      ...comment,
      replies: (replies ?? []).filter((reply) => reply.parent_id === comment.id),
    }));
  }

  async updateComment(commentId: string, content: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from('conversion_comments')
      .update({ content }).eq('id', commentId).select('*').single();
    if (error) throw error;
    return data;
  }

  async deleteComment(commentId: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('conversion_comments').delete().eq('id', commentId);
    if (error) throw error;
  }
}

export const commentManager = new CommentManager();
