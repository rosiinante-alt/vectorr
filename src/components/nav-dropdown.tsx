"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavDropdownProps {
  label: string;
  groups: NavGroup[];
}

export function NavDropdown({ label, groups }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-0.5 rounded-[var(--radius-sm)] px-3 py-2 text-[14px] font-medium text-text-secondary transition-colors hover:bg-[rgba(0,0,0,0.045)] hover:text-text-primary"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-[320px] rounded-[var(--radius-xl)] border border-[var(--border)] bg-white p-3 shadow-[var(--shadow-1)]">
          {groups.map((group) => (
            <div key={group.label} className="mb-3 last:mb-0">
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col rounded-[var(--radius-sm)] px-2.5 py-2 transition-colors hover:bg-bg-secondary"
                  >
                    <span className="text-[13.5px] font-medium text-text-primary">
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="mt-0.5 text-[12px] text-text-tertiary">
                        {item.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
