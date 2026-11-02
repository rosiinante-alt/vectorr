'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Play } from 'lucide-react';

const TRIGGER_TYPES = [
  { id: 'file-added', name: 'File Added to Folder' },
  { id: 'scheduled', name: 'Scheduled' },
  { id: 'manual', name: 'Manual' },
];

const ACTION_TYPES = [
  { id: 'convert', name: 'Vectorize' },
  { id: 'remove-bg', name: 'Remove Background' },
  { id: 'upscale', name: 'Upscale' },
  { id: 'style-transfer', name: 'Style Transfer' },
  { id: 'batch-ai', name: 'Batch AI Edit' },
  { id: 'export', name: 'Export' },
];

interface WorkflowBuilderProps {
  onSave?: (workflow: any) => void;
}

export function WorkflowBuilder({ onSave }: WorkflowBuilderProps) {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState(TRIGGER_TYPES[0].id);
  const [actions, setActions] = useState<string[]>([]);
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>({});

  const handleAddAction = () => {
    setActions([...actions, ACTION_TYPES[0].id]);
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (actions.length === 0) {
      alert('Please add at least one action');
      return;
    }

    if (trigger === 'file-added' && !triggerConfig.watchPath) {
      alert('Please enter a folder path to watch');
      return;
    }

    const workflow = {
      name,
      trigger: {
        type: trigger,
        config: triggerConfig,
      },
      actions: actions.map((actionId) => ({
        type: actionId,
        config: {},
      })),
    };

    onSave?.(workflow);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workflow Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Auto-vectorize PNG uploads"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Trigger */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">When</h3>
        <select
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {TRIGGER_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {trigger === 'file-added' && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="/path/to/watch (e.g., ~/Downloads)"
              value={triggerConfig.watchPath || ''}
              onChange={(e) =>
                setTriggerConfig({ ...triggerConfig, watchPath: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Watches for PNG, JPG, JPEG, WebP, and GIF files
            </p>
          </div>
        )}

        {trigger === 'scheduled' && (
          <div className="mt-2">
            <input
              type="text"
              placeholder="Cron expression (e.g., 0 0 * * *)"
              value={triggerConfig.schedule || ''}
              onChange={(e) =>
                setTriggerConfig({ ...triggerConfig, schedule: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              Phase 2 feature - coming soon
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Then</h3>
        <div className="space-y-2 mb-4">
          {actions.map((action, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
              <select
                value={action}
                onChange={(e) => {
                  const newActions = [...actions];
                  newActions[index] = e.target.value;
                  setActions(newActions);
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {ACTION_TYPES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleRemoveAction(index)}
                className="text-red-500 hover:text-red-700 p-2"
                aria-label="Remove action"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <Button onClick={handleAddAction} variant="secondary" className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Action
        </Button>
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={handleSave} className="flex-1">
          Save Workflow
        </Button>
        <Button variant="secondary" className="flex-1" disabled>
          <Play className="w-4 h-4 mr-2" />
          Test (Coming Soon)
        </Button>
      </div>
    </Card>
  );
}
