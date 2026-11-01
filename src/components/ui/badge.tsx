import type { ReactNode } from "react";

import { cn } from "@/lib/ui";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "error";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-bg-tertiary text-text-secondary",
  accent: "bg-accent-wash text-accent",
  success: "bg-success-wash text-success-text",
  warning: "bg-warning-wash text-warning",
  error: "bg-error-wash text-error",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12.5px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
