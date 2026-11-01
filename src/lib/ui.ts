import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a byte count using binary units, matching what the platform reports
 * for file sizes. Keeps one decimal below 10 so "1.4 MB" reads precisely.
 */
export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes)) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value < 10 ? 1 : 0;
  return `${value.toFixed(digits)} ${units[unit]}`;
}

/** Thousands-separated integer, e.g. 41203 -> "41,203". */
export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "—";
  return value.toLocaleString("en-US");
}

/** Percentage saved, guarding against a zero-byte original. */
export function percentSaved(before: number, after: number): number {
  if (!Number.isFinite(before) || before <= 0) return 0;
  return Math.max(0, Math.round(((before - after) / before) * 1000) / 10);
}
