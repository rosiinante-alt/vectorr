import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/ui";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em] " +
  "transition-[background-color,transform,box-shadow] duration-200 cursor-pointer " +
  "disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] " +
    "hover:bg-accent-hover hover:-translate-y-px active:translate-y-0 " +
    "disabled:hover:translate-y-0 disabled:hover:bg-accent",
  secondary:
    "bg-white text-text-primary shadow-[inset_0_0_0_1px_var(--border-strong)] " +
    "hover:bg-bg-secondary hover:-translate-y-px active:translate-y-0 " +
    "disabled:hover:translate-y-0 disabled:hover:bg-white",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary " +
    "hover:bg-[rgba(0,0,0,0.045)]",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-4 text-[15px] rounded-[999px]",
  lg: "h-12 px-6 text-[16px] rounded-[999px]",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </a>
  );
}
