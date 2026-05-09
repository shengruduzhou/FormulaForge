import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-lens-paper">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
