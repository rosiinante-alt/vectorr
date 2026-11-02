import { createSupabaseServerClient } from '@/lib/supabase/server';

export interface WorkflowTrigger {
  type: 'file-added' | 'git-push' | 'scheduled' | 'manual';
  config: Record<string, any>;
}

export interface WorkflowAction {
  type: 'convert' | 'style-transfer' | 'upscale' | 'remove-bg' | 'export' | 'batch-ai';
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  user_id: string;
  name: string;
  enabled: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  created_at: string;
}

export class WorkflowEngine {
  async createWorkflow(
    userId: string,
    name: string,
    trigger: WorkflowTrigger,
    actions: WorkflowAction[]
  ) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: userId,
        name,
        trigger,
        actions,
        enabled: true,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getWorkflows(userId: string) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async executeWorkflow(workflowId: string, triggerData: Record<string, any>) {
    const supabase = await createSupabaseServerClient();

    const { data: workflow } = await supabase
      .from('workflows')
      .select('*')
      .eq('id', workflowId)
      .single();

    if (!workflow || !workflow.enabled) {
      throw new Error('Workflow not found or disabled');
    }

    // Execute each action in sequence
    let result: any = triggerData;
    for (const action of workflow.actions) {
      result = await this.executeAction(action, result, workflow.user_id);
    }

    return result;
  }

  private async executeAction(
    action: WorkflowAction,
    input: Record<string, any>,
    userId: string
  ): Promise<any> {
    // Route to appropriate worker queue
    const { batchQueue, styleTransferQueue, removeBgQueue, upscaleQueue, vectorizeQueue, exportQueue } = await import('@/lib/queue/queues');

    switch (action.type) {
      case 'batch-ai':
        return await batchQueue.add('batch-ai', {
          userId,
          inputs: input.files,
          aiConfig: action.config,
        });

      case 'style-transfer':
        return await styleTransferQueue.add('style-transfer', {
          userId,
          imageUrl: input.imageUrl,
          presetId: action.config.presetId,
        });

      case 'convert':
        return await vectorizeQueue.add('vectorize', {
          userId,
          fileUrl: input.imageUrl || input.files?.[0],
          config: action.config,
        });

      case 'remove-bg':
        return await removeBgQueue.add('remove-bg', {
          userId,
          fileUrl: input.imageUrl || input.files?.[0],
        });

      case 'upscale':
        return await upscaleQueue.add('upscale', {
          userId,
          fileUrl: input.imageUrl || input.files?.[0],
          scale: action.config.scale || 2,
        });

      case 'export':
        return await exportQueue.add('export', {
          userId,
          fileUrl: input.imageUrl || input.files?.[0],
          format: action.config.format || 'svg',
        });

      default:
        throw new Error(`Unsupported action type: ${action.type}`);
    }
  }

  async toggleWorkflow(workflowId: string, enabled: boolean) {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('workflows')
      .update({ enabled })
      .eq('id', workflowId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteWorkflow(workflowId: string) {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('workflows')
      .delete()
      .eq('id', workflowId);

    if (error) throw error;
  }
}

export const workflowEngine = new WorkflowEngine();
