import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-lens-primary text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800",
  secondary:
    "border border-lens-line bg-white text-lens-ink hover:border-indigo-200 hover:bg-indigo-50/60 dark:bg-slate-950 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10",
  ghost: "text-lens-muted hover:bg-indigo-50/70 hover:text-lens-ink dark:hover:bg-indigo-500/10",
  danger: "border border-red-200 bg-white text-lens-danger hover:bg-red-50 dark:bg-slate-950 dark:hover:bg-red-950/30",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-lens-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
