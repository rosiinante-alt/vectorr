# Vectorr Workflow Automation System

## Overview

The Vectorr workflow automation system enables users to automate image vectorization and processing tasks through configurable workflows with triggers and actions.

## Architecture

### Core Components

1. **WorkflowEngine** (`/src/lib/workflows/workflow-engine.ts`)
   - Manages workflow CRUD operations
   - Executes workflows by routing actions to BullMQ queues
   - Handles action sequencing and result chaining

2. **FolderWatcher** (`/src/lib/workflows/folder-watcher.ts`)
   - Monitors filesystem directories for new files
   - Triggers workflows automatically when files are added
   - Uses chokidar for cross-platform file watching

3. **UI Components**
   - `WorkflowBuilder`: Visual workflow creation interface
   - `WorkflowList`: Displays and manages existing workflows

4. **API Routes** (`/src/app/api/workflows/`)
   - `GET /api/workflows` - List all workflows for authenticated user
   - `POST /api/workflows` - Create a new workflow
   - `PATCH /api/workflows/[id]/toggle` - Enable/disable workflow
   - `DELETE /api/workflows/[id]` - Delete workflow

## Workflow Concepts

### Triggers

Workflows are initiated by triggers. Phase 1 supports:

- **file-added**: Watches a folder and triggers when new files are added
  - Config: `{ watchPath: "/path/to/folder" }`
  - Supported formats: PNG, JPG, JPEG, WebP, GIF
  
- **manual**: Workflow must be triggered manually via API or UI
  - Config: `{}`

Phase 2 (Future):
- **git-push**: Trigger on Git webhook events
- **scheduled**: Cron-based scheduling

### Actions

Actions are processing steps executed in sequence. Available actions:

1. **convert**: Vectorize image to SVG
   - Routes to: `vectorizeQueue`
   - Config: `{ quality, colors, threshold }`

2. **remove-bg**: Remove background from image
   - Routes to: `removeBgQueue`
   - Config: `{}`

3. **upscale**: Upscale image resolution
   - Routes to: `upscaleQueue`
   - Config: `{ scale: 2 | 4 }`

4. **style-transfer**: Apply artistic style transfer
   - Routes to: `styleTransferQueue`
   - Config: `{ presetId: string }`

5. **batch-ai**: Batch AI editing operations
   - Routes to: `batchQueue`
   - Config: `{ aiConfig: {...} }`

6. **export**: Export to specific format
   - Routes to: `exportQueue`
   - Config: `{ format: "svg" | "dxf" | "eps" | ... }`

### Workflow Structure

```typescript
interface Workflow {
  id: string;
  user_id: string;
  name: string;
  enabled: boolean;
  trigger: {
    type: 'file-added' | 'git-push' | 'scheduled' | 'manual';
    config: Record<string, any>;
  };
  actions: Array<{
    type: 'convert' | 'style-transfer' | 'upscale' | 'remove-bg' | 'export' | 'batch-ai';
    config: Record<string, any>;
  }>;
  created_at: string;
}
```

## Database Schema

The workflows system requires these tables (add to migrations):

```sql
-- Workflows table
create table if not exists public.workflows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  enabled boolean not null default true,
  trigger jsonb not null,  -- { type, config }
  actions jsonb not null,  -- [{ type, config }, ...]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index workflows_user_id_idx on public.workflows(user_id);
create index workflows_enabled_idx on public.workflows(enabled) where enabled = true;

-- Workflow execution log (optional, for debugging)
create table if not exists public.workflow_executions (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  trigger_data jsonb not null,
  status text not null check (status in ('pending', 'running', 'completed', 'failed')),
  result jsonb,
  error text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index workflow_executions_workflow_id_idx on public.workflow_executions(workflow_id);
create index workflow_executions_status_idx on public.workflow_executions(status);
```

## Usage Examples

### Creating a Workflow

#### Via UI

1. Navigate to the workflows page
2. Click "Create Workflow"
3. Enter workflow name (e.g., "Auto-vectorize Downloads")
4. Select trigger type: "File Added to Folder"
5. Enter watch path: `/Users/username/Downloads`
6. Add actions:
   - Remove Background
   - Vectorize
   - Export to SVG
7. Click "Save Workflow"

#### Via API

```typescript
const response = await fetch('/api/workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Auto-vectorize Downloads',
    trigger: {
      type: 'file-added',
      config: { watchPath: '/Users/username/Downloads' }
    },
    actions: [
      { type: 'remove-bg', config: {} },
      { type: 'convert', config: { quality: 'high' } },
      { type: 'export', config: { format: 'svg' } }
    ]
  })
});

const workflow = await response.json();
```

### Starting Folder Watcher

```typescript
import { folderWatcher } from '@/lib/workflows/folder-watcher';

// Start watching a folder for a workflow
folderWatcher.watchFolder(
  '/Users/username/Downloads',
  workflowId,
  userId
);

// Check if watching
const isActive = folderWatcher.isWatching(userId, workflowId);

// Stop watching
folderWatcher.stopWatching(userId, workflowId);

// Stop all watchers (e.g., on server shutdown)
folderWatcher.stopAllWatching();
```

### Manual Workflow Execution

```typescript
import { workflowEngine } from '@/lib/workflows/workflow-engine';

await workflowEngine.executeWorkflow(workflowId, {
  files: ['/path/to/image.png'],
  triggerType: 'manual'
});
```

## Batch AI Editing

The batch-ai action enables processing multiple files with AI-powered operations:

```typescript
{
  type: 'batch-ai',
  config: {
    operation: 'enhance' | 'stylize' | 'recolor',
    options: {
      // operation-specific options
      style: 'watercolor',
      colorScheme: 'pastel'
    }
  }
}
```

When triggered, files are sent to the `batchQueue` for parallel processing.

## Folder Watcher Configuration

### Best Practices

1. **Watch Specific Directories**: Don't watch root or system directories
2. **File Patterns**: FolderWatcher automatically filters for supported image formats
3. **Stability Threshold**: Files are processed after 2 seconds of stability (no writes)
4. **Resource Management**: Stop watchers when workflows are disabled

### Security Considerations

- Validate watch paths are within user's home directory or designated upload folders
- Don't watch system directories or sensitive locations
- Implement rate limiting for file-triggered workflows
- Validate file types and sizes before processing

### Performance

- FolderWatcher uses chokidar's `awaitWriteFinish` to prevent partial file reads
- Multiple workflows can watch the same folder
- Each watcher runs in the same process (not spawned)
- Watchers automatically restart when workflow is re-enabled

## Error Handling

### Workflow Execution Errors

- Failed actions log errors but don't halt the workflow
- Check BullMQ job status for detailed error information
- Workflow engine catches and logs execution errors

### Folder Watcher Errors

- File system errors are logged but don't stop the watcher
- Invalid file types are silently ignored
- Permission errors are logged to console

## Monitoring & Debugging

### Check Active Watchers

```typescript
const activeWatchers = folderWatcher.getActiveWatchers();
console.log('Active watchers:', activeWatchers);
// Output: ['userId1_workflowId1', 'userId2_workflowId2']
```

### Logs

FolderWatcher logs events to console:
- `[FolderWatcher] Watching {path} for workflow {id}`
- `[FolderWatcher] File added: {path} → triggering workflow {id}`
- `[FolderWatcher] Error watching {path}: {error}`

## Future Enhancements (Phase 2)

### Git Integration

```typescript
{
  trigger: {
    type: 'git-push',
    config: {
      repository: 'org/repo',
      branch: 'main',
      pathFilter: 'assets/**/*.png'
    }
  }
}
```

- Webhook endpoint for GitHub/GitLab
- Process files from commits
- Post results as PR comments

### Scheduled Workflows

```typescript
{
  trigger: {
    type: 'scheduled',
    config: {
      cron: '0 2 * * *',  // 2 AM daily
      timezone: 'America/New_York'
    }
  }
}
```

- Cron-based scheduling
- Process batches of pending files
- Generate reports

### Advanced Action Chaining

- Conditional actions based on previous results
- Parallel action execution
- Sub-workflows
- Error handling strategies (retry, fallback, skip)

### Workflow Templates

Pre-built workflows for common use cases:
- "E-commerce Product Photos" (remove-bg → upscale → convert)
- "Logo Vectorization" (convert → optimize → export multiple formats)
- "Batch Colorization" (batch-ai style-transfer)

## API Reference

### WorkflowEngine

```typescript
class WorkflowEngine {
  async createWorkflow(
    userId: string,
    name: string,
    trigger: WorkflowTrigger,
    actions: WorkflowAction[]
  ): Promise<Workflow>

  async getWorkflows(userId: string): Promise<Workflow[]>

  async executeWorkflow(
    workflowId: string,
    triggerData: Record<string, any>
  ): Promise<any>

  async toggleWorkflow(
    workflowId: string,
    enabled: boolean
  ): Promise<Workflow>

  async deleteWorkflow(workflowId: string): Promise<void>
}
```

### FolderWatcher

```typescript
class FolderWatcher {
  watchFolder(
    watchPath: string,
    workflowId: string,
    userId: string,
    filePattern?: string
  ): void

  stopWatching(userId: string, workflowId: string): void

  stopAllWatching(): void

  isWatching(userId: string, workflowId: string): boolean

  getActiveWatchers(): string[]
}
```

## Testing

```bash
# Run type check
npm run type-check

# Run tests (when implemented)
npm test

# Test folder watcher manually
node -e "
const { folderWatcher } = require('./src/lib/workflows/folder-watcher');
folderWatcher.watchFolder('/tmp/test', 'test-workflow-id', 'test-user-id');
console.log('Watching /tmp/test - add a PNG file to test');
"
```

## Dependencies

```json
{
  "chokidar": "^3.5.3"  // File system watcher
}
```

Install with:
```bash
npm install chokidar
```

## Troubleshooting

### Workflow Not Triggering

1. Check workflow is enabled: `workflow.enabled === true`
2. Verify folder watcher is active: `folderWatcher.isWatching(userId, workflowId)`
3. Check file format is supported (PNG, JPG, JPEG, WebP, GIF)
4. Verify watch path exists and is readable
5. Check console logs for watcher errors

### Actions Not Executing

1. Verify BullMQ queues are running
2. Check worker processes are active
3. Review BullMQ dashboard for failed jobs
4. Check user has sufficient credits
5. Verify action configuration is valid

### Performance Issues

1. Limit number of active watchers per user
2. Implement file size limits
3. Add rate limiting on workflow executions
4. Use queue priorities for important workflows

## Security Checklist

- [ ] Validate user authentication on all API routes
- [ ] Verify user owns workflow before modifications
- [ ] Sanitize watch paths (no system directories)
- [ ] Implement file size limits
- [ ] Add rate limiting on workflow triggers
- [ ] Validate file types before processing
- [ ] Log all workflow executions for audit
- [ ] Implement user quotas for active workflows

## Production Deployment

1. Add database migrations for workflows tables
2. Configure Redis for BullMQ queues
3. Start worker processes for all queue types
4. Set up monitoring for folder watchers
5. Configure log aggregation for workflow events
6. Add health check endpoints
7. Implement workflow execution limits per user tier
8. Set up alerts for failed workflows

## Support & Resources

- Chokidar documentation: https://github.com/paulmillr/chokidar
- BullMQ documentation: https://docs.bullmq.io/
- Workflow examples: `/examples/workflows/`
- API tests: `/__tests__/api/workflows/`
