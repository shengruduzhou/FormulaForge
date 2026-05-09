import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-28 w-full resize-y rounded-lg border border-lens-line bg-white px-3 py-3 font-mono text-sm leading-6 text-lens-ink outline-none transition placeholder:text-slate-400 focus:border-lens-primary focus:ring-2 focus:ring-indigo-100 ${className}`}
      {...props}
    />
  );
}
