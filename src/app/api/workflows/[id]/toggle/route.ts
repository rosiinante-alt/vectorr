import { NextRequest, NextResponse } from 'next/server';
import { workflowEngine } from '@/lib/workflows/workflow-engine';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { enabled } = await request.json();

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'enabled must be a boolean' },
        { status: 400 }
      );
    }

    const workflow = await workflowEngine.toggleWorkflow(id, enabled);
    return NextResponse.json(workflow);
  } catch (error) {
    console.error('Error toggling workflow:', error);
    return NextResponse.json(
      { error: 'Failed to toggle workflow' },
      { status: 500 }
    );
  }
}
