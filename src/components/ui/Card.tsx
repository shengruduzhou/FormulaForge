import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <section className={`rounded-lg border border-lens-line bg-white shadow-sm ${className}`} {...props}>
      {children}
    </section>
  );
}

export function CardHeader({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`border-b border-lens-line px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children, ...props }: CardProps) {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
