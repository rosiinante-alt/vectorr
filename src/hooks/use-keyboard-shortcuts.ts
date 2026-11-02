import { useEffect } from "react";

export interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  callback: () => void;
  preventDefault?: boolean;
  /**
   * If true, the shortcut will trigger even if the user is in a text input.
   * Useful for global shortcuts like Escape.
   */
  ignoreTextInput?: boolean;
}

/**
 * Registers keyboard shortcuts globally or within a focused element.
 * Automatically ignores shortcuts when the user is in text inputs unless
 * the shortcut has ignoreTextInput set to true.
 */
export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts while typing in an input/textarea unless explicitly allowed
      const isInTextInput = 
        (event.target instanceof HTMLInputElement && event.target.type === "text") ||
        event.target instanceof HTMLTextAreaElement;

      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = (event.ctrlKey || event.metaKey) === (shortcut.ctrlKey || shortcut.metaKey);
        const matchesShift = event.shiftKey === (shortcut.shiftKey ?? false);
        const matchesAlt = event.altKey === (shortcut.altKey ?? false);

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          // Skip text input check if ignoreTextInput is true
          if (isInTextInput && !shortcut.ignoreTextInput) {
            continue;
          }

          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          shortcut.callback();
          break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
