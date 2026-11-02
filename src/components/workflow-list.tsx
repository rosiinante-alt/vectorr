'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  enabled: boolean;
  trigger: { type: string; config: Record<string, any> };
  actions: any[];
}

export function WorkflowList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/workflows');
      
      if (!res.ok) {
        throw new Error(`Failed to fetch workflows: ${res.statusText}`);
      }
      
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError(err instanceof Error ? err.message : 'Failed to load workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (workflowId: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/workflows/${workflowId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (!res.ok) {
        throw new Error('Failed to toggle workflow');
      }

      await fetchWorkflows();
    } catch (err) {
      console.error('Error toggling workflow:', err);
      alert('Failed to toggle workflow. Please try again.');
    }
  };

  const handleDelete = async (workflowId: string) => {
    if (!confirm('Delete this workflow? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete workflow');
      }

      await fetchWorkflows();
    } catch (err) {
      console.error('Error deleting workflow:', err);
      alert('Failed to delete workflow. Please try again.');
    }
  };

  const formatTriggerType = (type: string) => {
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-3 text-red-600">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <h3 className="font-semibold">Error loading workflows</h3>
            <p className="text-sm mt-1">{error}</p>
            <Button
              variant="secondary"
              onClick={fetchWorkflows}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">
                  {formatTriggerType(workflow.trigger.type)}
                </span>
                {workflow.trigger.type === 'file-added' && workflow.trigger.config.watchPath && (
                  <span className="text-gray-500">
                    {' '}
                    • {workflow.trigger.config.watchPath}
                  </span>
                )}
                {' '}→ {workflow.actions.length} action
                {workflow.actions.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge tone={workflow.enabled ? 'success' : 'neutral'}>
                {workflow.enabled ? 'Active' : 'Inactive'}
              </Badge>

              <button
                onClick={() => handleToggle(workflow.id, workflow.enabled)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                aria-label={workflow.enabled ? 'Disable workflow' : 'Enable workflow'}
              >
                {workflow.enabled ? (
                  <ToggleRight className="w-6 h-6" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => handleDelete(workflow.id)}
                className="text-red-500 hover:text-red-700 transition-colors p-1"
                aria-label="Delete workflow"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}

      {workflows.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            No workflows yet. Create one to get started with automation.
          </p>
        </Card>
      )}
    </div>
  );
}
