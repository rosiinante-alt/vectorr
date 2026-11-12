"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

interface SearchResult {
  title: string;
  href: string;
  description: string;
  category: string;
}

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setActiveIndex(0);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        if (results[activeIndex]) {
          window.location.href = results[activeIndex].href;
        }
      }
    },
    [results, activeIndex]
  );

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border)] px-2.5 py-1.5 text-[13px] text-text-tertiary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary sm:inline-flex"
        aria-label="Search"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden md:inline">Search…</span>
        <kbd className="ml-1 hidden rounded bg-bg-tertiary px-1.5 py-0.5 font-mono text-[11px] md:inline">⌘K</kbd>
      </button>

      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] sm:hidden"
        aria-label="Search"
      >
        <Search className="h-4.5 w-4.5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          ref={containerRef}
        >
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-[var(--radius-xl)] border border-[var(--border)] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.15)]">
            {/* Input row */}
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
              <Search className="h-4.5 w-4.5 shrink-0 text-text-tertiary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tools, guides, converters…"
                className="flex-1 bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-tertiary"
              />
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-text-tertiary hover:text-text-primary"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
              {query.trim().length < 2 && (
                <div className="px-3 py-8 text-center text-[14px] text-text-tertiary">
                  Type at least 2 characters to search
                </div>
              )}

              {query.trim().length >= 2 && !loading && results.length === 0 && (
                <div className="px-3 py-8 text-center text-[14px] text-text-tertiary">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {loading && (
                <div className="px-3 py-8 text-center text-[14px] text-text-tertiary">
                  Searching…
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-1">
                  {Object.entries(grouped).map(([category, items]) => (
                    <div key={category}>
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                        {category}
                      </p>
                      {items.map((item) => {
                        flatIndex++;
                        const idx = flatIndex;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center justify-between rounded-[var(--radius-sm)] px-3 py-2.5 transition-colors ${
                              idx === activeIndex
                                ? "bg-bg-tertiary"
                                : "hover:bg-[rgba(0,0,0,0.04)]"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[14px] font-medium text-text-primary">
                                {item.title}
                              </p>
                              <p className="truncate text-[12.5px] text-text-tertiary">
                                {item.description}
                              </p>
                            </div>
                            <span className="ml-2 shrink-0 text-[12px] text-text-tertiary">
                              ↵
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2.5">
              <div className="flex items-center gap-3 text-[11.5px] text-text-tertiary">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-bg-tertiary px-1 py-0.5 font-mono">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-bg-tertiary px-1 py-0.5 font-mono">↵</kbd>
                  Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-bg-tertiary px-1 py-0.5 font-mono">Esc</kbd>
                  Close
                </span>
              </div>
              <p className="text-[11.5px] text-text-tertiary">
                {results.length > 0 && `${results.length} result${results.length === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
