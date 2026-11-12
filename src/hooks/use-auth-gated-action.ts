'use client';

import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useCallback, useEffect, useState } from 'react';

/**
 * State saved to localStorage before redirecting to login.
 * Restored after successful auth.
 */
interface SavedToolState {
  file: {
    name: string;
    type: string;
    size: number;
    dataUrl: string; // base64-encoded file
  };
  settings: Record<string, unknown>;
  timestamp: number;
}

const STORAGE_KEY_PREFIX = 'vectroy_pending_';
const STATE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Hook for auth-gated tool actions.
 * 
 * Usage:
 * ```ts
 * const { checkAuthAndRun, restorePendingState } = useAuthGatedAction('/upscale');
 * 
 * // On mount: restore state if user just logged in
 * useEffect(() => {
 *   const restored = restorePendingState();
 *   if (restored) {
 *     // Set file and settings from restored state
 *     // Auto-submit the conversion
 *   }
 * }, []);
 * 
 * // On button click: check auth, save state, redirect if needed
 * const handleConvert = async () => {
 *   await checkAuthAndRun(
 *     { file, settings: { upscale, removeBg } },
 *     async () => {
 *       // This runs only if authenticated
 *       await fetch('/api/convert', { ... });
 *     }
 *   );
 * };
 * ```
 */
export function useAuthGatedAction(toolPath: string) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  const storageKey = `${STORAGE_KEY_PREFIX}${toolPath.replace(/\//g, '_')}`;

  /**
   * Check if user is authenticated. If not, save state and redirect to login.
   * If yes, run the action immediately.
   */
  const checkAuthAndRun = useCallback(
    async (
      state: { file: File; settings: Record<string, unknown> },
      action: () => Promise<void>,
    ): Promise<boolean> => {
      setIsCheckingAuth(true);

      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Not authenticated: save state and redirect
          const reader = new FileReader();
          reader.onload = () => {
            const savedState: SavedToolState = {
              file: {
                name: state.file.name,
                type: state.file.type,
                size: state.file.size,
                dataUrl: reader.result as string,
              },
              settings: state.settings,
              timestamp: Date.now(),
            };

            localStorage.setItem(storageKey, JSON.stringify(savedState));
            
            // Redirect to login with return path
            router.push(`/login?next=${encodeURIComponent(toolPath)}`);
          };
          reader.readAsDataURL(state.file);
          
          return false; // Action not run
        }

        // Authenticated: run the action
        await action();
        return true; // Action completed
      } finally {
        setIsCheckingAuth(false);
      }
    },
    [router, storageKey, toolPath],
  );

  /**
   * Restore state saved before login redirect.
   * Returns null if no valid state found.
   * Clears state after restoration.
   */
  const restorePendingState = useCallback((): {
    file: File;
    settings: Record<string, unknown>;
  } | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;

      const saved: SavedToolState = JSON.parse(raw);

      // Check if state is expired
      if (Date.now() - saved.timestamp > STATE_TTL_MS) {
        localStorage.removeItem(storageKey);
        return null;
      }

      // Convert dataUrl back to File
      const byteString = atob(saved.file.dataUrl.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: saved.file.type });
      const file = new File([blob], saved.file.name, { type: saved.file.type });

      // Clear state after restoration
      localStorage.removeItem(storageKey);

      return {
        file,
        settings: saved.settings,
      };
    } catch (err) {
      console.error('Failed to restore pending state:', err);
      localStorage.removeItem(storageKey);
      return null;
    }
  }, [storageKey]);

  /**
   * Clear any pending state (useful for manual cleanup).
   */
  const clearPendingState = useCallback(() => {
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    checkAuthAndRun,
    restorePendingState,
    clearPendingState,
    isCheckingAuth,
  };
}
