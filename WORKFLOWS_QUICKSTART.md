# Workflow System Quick Start

## Installation

The workflow system is already installed. Dependencies:
- `chokidar` - File system watcher
- `@types/chokidar` - TypeScript definitions

## Database Setup

Apply the migration to create the workflows tables:

```bash
# Using Supabase CLI
supabase db push migrations/004_workflows.sql

# Or paste the contents of migrations/004_workflows.sql into the Supabase SQL editor
```

This creates:
- `workflows` table - Stores workflow configurations
- `workflow_executions` table - Audit log of workflow runs
- RLS policies - Secure access control

## Usage

### 1. Creating a Workflow (UI)

Visit `/workflows` in your app to access the workflow builder:

1. Enter a workflow name
2. Choose a trigger type (file-added, scheduled, or manual)
3. Add one or more actions
4. Click "Save Workflow"

### 2. Creating a Workflow (API)

```typescript
const response = await fetch('/api/workflows', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Auto-process Downloads',
    trigger: {
      type: 'file-added',
      config: { watchPath: '/Users/myuser/Downloads' }
    },
    actions: [
      { type: 'remove-bg', config: {} },
      { type: 'convert', config: {} }
    ]
  })
});
```

### 3. Starting a Folder Watcher

To activate folder watching for a workflow:

```typescript
import { folderWatcher } from '@/lib/workflows';

// Start watching
folderWatcher.watchFolder(
  '/Users/myuser/Downloads',
  workflowId,
  userId
);

// Check if active
const isActive = folderWatcher.isWatching(userId, workflowId);

// Stop watching
folderWatcher.stopWatching(userId, workflowId);
```

**Note**: Folder watchers must be started programmatically. In production, you would:
1. Start watchers on server startup for enabled file-added workflows
2. Start/stop watchers when workflows are enabled/disabled
3. Restart watchers on server restart

### 4. Manual Workflow Execution

```typescript
import { workflowEngine } from '@/lib/workflows';

await workflowEngine.executeWorkflow(workflowId, {
  files: ['/path/to/image.png'],
  triggerType: 'manual'
});
```

## Available Actions

- **convert**: Vectorize image to SVG
- **remove-bg**: Remove background
- **upscale**: Increase resolution (2x or 4x)
- **style-transfer**: Apply artistic style
- **batch-ai**: Batch AI operations
- **export**: Export to specific format

## Trigger Types

### Phase 1 (Implemented)
- **file-added**: Watch a folder for new files
- **manual**: Trigger via API/UI

### Phase 2 (Future)
- **git-push**: Trigger on Git webhook
- **scheduled**: Cron-based scheduling

## Testing

```bash
# Type check
npm run type-check

# Build
npm run build

# Test folder watcher manually
node -e "
const { folderWatcher } = require('./src/lib/workflows/folder-watcher');
folderWatcher.watchFolder('/tmp/test', 'test-workflow', 'test-user');
console.log('Add a PNG file to /tmp/test to test');
"
```

## Production Considerations

1. **Watcher Lifecycle Management**
   - Start watchers for enabled workflows on server startup
   - Restart watchers on server restart
   - Stop watchers when workflows are disabled

2. **Security**
   - Validate watch paths (no system directories)
   - Implement rate limiting
   - Check file sizes before processing

3. **Monitoring**
   - Log all workflow executions
   - Alert on failed workflows
   - Track active watchers

4. **Resource Management**
   - Limit number of active watchers per user
   - Implement queue priorities
   - Add workflow execution quotas

## Architecture

```
User creates workflow → Database (workflows table)
                      ↓
               Folder watcher activated
                      ↓
               File added to watched folder
                      ↓
               Workflow triggered
                      ↓
          Actions executed via BullMQ queues
                      ↓
                 Result returned
```

## API Routes

- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `PATCH /api/workflows/[id]/toggle` - Enable/disable
- `DELETE /api/workflows/[id]` - Delete workflow

## Components

- `<WorkflowBuilder />` - Create/edit workflows
- `<WorkflowList />` - Display existing workflows

## Full Documentation

See `WORKFLOWS.md` for comprehensive documentation including:
- Detailed architecture
- All configuration options
- Security best practices
- Troubleshooting guide
- Future enhancements
