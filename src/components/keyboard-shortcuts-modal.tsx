"use client";

import { useCallback, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{
    keys: string[];
    description: string;
  }>;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "Navigation & Canvas",
    shortcuts: [
      { keys: ["Space"], description: "Pan the canvas (hold and drag)" },
      { keys: ["+"], description: "Zoom in" },
      { keys: ["−"], description: "Zoom out" },
      { keys: ["0"], description: "Reset zoom" },
    ],
  },
  {
    title: "General",
    shortcuts: [
      { keys: ["?"], description: "Show keyboard shortcuts" },
      { keys: ["Esc"], description: "Close this dialog" },
    ],
  },
];

/**
 * Modal displaying all available keyboard shortcuts, organized by category.
 * Accessible via keyboard (Escape to close, Tab to navigate).
 */
export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        role="presentation"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby="shortcuts-title"
        aria-modal="true"
        tabIndex={-1}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl)] bg-white shadow-lg"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <h1 id="shortcuts-title" className="text-[19px] font-semibold tracking-[-0.022em]">
            Keyboard Shortcuts
          </h1>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-secondary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <div className="grid gap-6 sm:grid-cols-2">
            {SHORTCUT_GROUPS.map((group) => (
              <section key={group.title}>
                <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.02em] text-text-tertiary">
                  {group.title}
                </h2>
                <ul className="space-y-2.5">
                  {group.shortcuts.map((shortcut) => (
                    <li key={shortcut.description} className="flex items-start justify-between gap-3">
                      <span className="text-[14px] text-text-secondary">
                        {shortcut.description}
                      </span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, idx) => (
                          <span key={idx} className="flex items-center gap-1">
                            <kbd className="inline-flex min-w-[28px] items-center justify-center rounded-[4px] border border-[var(--border)] bg-bg-secondary px-1.5 py-1 text-[11px] font-medium text-text-secondary font-mono">
                              {key}
                            </kbd>
                            {idx < shortcut.keys.length - 1 && (
                              <span className="text-[12px] text-text-tertiary">+</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        {/* Footer hint */}
        <div className="border-t border-[var(--border)] px-6 py-3 text-center">
          <p className="text-[12px] text-text-tertiary">
            Press <kbd className="inline-flex items-center justify-center rounded-[3px] border border-[var(--border)] bg-bg-secondary px-1.5 py-0.5 text-[10px] font-mono">Esc</kbd> to close
          </p>
        </div>
      </div>
    </>
  );
}
