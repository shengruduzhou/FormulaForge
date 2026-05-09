import { Github, Languages, Microscope, Moon, Sun } from "lucide-react";
import { useI18nStore, uiText } from "../../i18n";
import { useThemeStore } from "../../theme/themeStore";
import { Button } from "../ui/Button";

const GITHUB_URL = "https://github.com/shengruduzhou/FormulaForge";

export function Header() {
  const { language, toggleLanguage } = useI18nStore();
  const { theme, toggleTheme } = useThemeStore();
  const text = uiText[language];

  return (
    <header className="sticky top-0 z-30 border-b border-lens-line bg-white/90 backdrop-blur dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a className="flex items-center gap-2 font-semibold text-lens-ink" href="/">
          <span className="grid size-9 place-items-center rounded-lg bg-lens-primary text-white">
            <Microscope size={19} strokeWidth={2.2} />
          </span>
          <span>FormulaForge</span>
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          <a className="rounded-lg px-3 py-2 text-sm font-medium text-lens-muted hover:bg-slate-100 hover:text-lens-ink dark:hover:bg-slate-900" href="/app">
            {text.workspace}
          </a>
          <a
            className="rounded-lg px-3 py-2 text-sm font-medium text-lens-muted hover:bg-slate-100 hover:text-lens-ink dark:hover:bg-slate-900"
            href="/examples"
          >
            {text.examples}
          </a>
          <a className="rounded-lg px-3 py-2 text-sm font-medium text-lens-muted hover:bg-slate-100 hover:text-lens-ink dark:hover:bg-slate-900" href="/docs">
            {text.docs}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button className="px-3" variant="secondary" onClick={toggleLanguage} aria-label="Toggle language">
            <Languages size={16} />
            <span className="hidden sm:inline">{language === "en" ? "中文" : "EN"}</span>
          </Button>
          <Button className="px-3" variant="secondary" onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
          </Button>
          <Button className="hidden sm:inline-flex" variant="secondary" onClick={() => window.open(GITHUB_URL, "_blank")}>
            <Github size={16} />
            {text.github}
          </Button>
        </div>
      </div>
    </header>
  );
}
