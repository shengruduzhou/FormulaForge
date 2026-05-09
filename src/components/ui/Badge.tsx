import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-indigo-100 bg-indigo-50 px-2 py-1 text-xs font-semibold text-lens-primary dark:border-indigo-500/30 dark:bg-indigo-500/15">
      {children}
    </span>
  );
}
