'use client';

import { WorkflowBuilder } from '@/components/workflow-builder';
import { WorkflowList } from '@/components/workflow-list';

export default function WorkflowsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workflow Automation</h1>
          <p className="mt-2 text-gray-600">
            Automate your image processing with custom workflows
          </p>
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Workflow
            </h2>
            <WorkflowBuilder
              onSave={async (workflow) => {
                const res = await fetch('/api/workflows', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(workflow),
                });

                if (res.ok) {
                  alert('Workflow created successfully!');
                  window.location.reload();
                } else {
                  alert('Failed to create workflow');
                }
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Workflows
            </h2>
            <WorkflowList />
          </div>
        </div>
      </div>
    </div>
  );
}
