import chokidar, { type FSWatcher } from 'chokidar';
import { workflowEngine } from './workflow-engine';

export class FolderWatcher {
  private watchers: Map<string, FSWatcher> = new Map();

  watchFolder(
    watchPath: string,
    workflowId: string,
    userId: string,
    filePattern: string = '**/*.{png,jpg,jpeg,webp,gif}'
  ) {
    const watcher = chokidar.watch(watchPath, {
      ignored: /(^|[\\/])\../, // ignore dotfiles
      persistent: true,
      awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100,
      },
    });

    watcher.on('add', async (filePath: string) => {
      // Check if file matches pattern
      const extension = filePath.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
      
      if (!extension || !allowedExtensions.includes(extension)) {
        return;
      }

      console.log(`[FolderWatcher] File added: ${filePath} → triggering workflow ${workflowId}`);

      try {
        // File added, trigger workflow
        await workflowEngine.executeWorkflow(workflowId, {
          files: [filePath],
          triggerType: 'file-added',
          filePath,
        });
      } catch (error) {
        console.error(`[FolderWatcher] Error executing workflow ${workflowId}:`, error);
      }
    });

    watcher.on('error', (error) => {
      console.error(`[FolderWatcher] Error watching ${watchPath}:`, error);
    });

    watcher.on('ready', () => {
      console.log(`[FolderWatcher] Watching ${watchPath} for workflow ${workflowId}`);
    });

    const key = `${userId}_${workflowId}`;
    this.watchers.set(key, watcher);
  }

  stopWatching(userId: string, workflowId: string) {
    const key = `${userId}_${workflowId}`;
    const watcher = this.watchers.get(key);

    if (watcher) {
      watcher.close();
      this.watchers.delete(key);
      console.log(`[FolderWatcher] Stopped watching for workflow ${workflowId}`);
    }
  }

  stopAllWatching() {
    this.watchers.forEach((watcher) => watcher.close());
    this.watchers.clear();
    console.log('[FolderWatcher] Stopped all watchers');
  }

  isWatching(userId: string, workflowId: string): boolean {
    const key = `${userId}_${workflowId}`;
    return this.watchers.has(key);
  }

  getActiveWatchers(): string[] {
    return Array.from(this.watchers.keys());
  }
}

export const folderWatcher = new FolderWatcher();
