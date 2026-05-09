import { Github, Microscope } from "lucide-react";
import { Button } from "../ui/Button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-lens-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-2 font-semibold text-lens-ink" href="/">
          <span className="grid size-9 place-items-center rounded-lg bg-lens-primary text-white">
            <Microscope size={19} strokeWidth={2.2} />
          </span>
          <span>FormulaForge</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          <a className="rounded-lg px-3 py-2 text-sm font-medium text-lens-muted hover:bg-slate-100 hover:text-lens-ink" href="/app">
            Workspace
          </a>
          <a
            className="rounded-lg px-3 py-2 text-sm font-medium text-lens-muted hover:bg-slate-100 hover:text-lens-ink"
            href="/examples"
          >
            Examples
          </a>
          <a className="rounded-lg px-3 py-2 text-sm font-medium text-lens-muted hover:bg-slate-100 hover:text-lens-ink" href="/docs">
            Docs
          </a>
        </nav>
        <Button className="hidden sm:inline-flex" variant="secondary" onClick={() => window.open("https://github.com", "_blank")}>
          <Github size={16} />
          GitHub
        </Button>
      </div>
    </header>
  );
}
