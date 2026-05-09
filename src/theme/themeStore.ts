import { create } from "zustand";

export type ThemeMode = "light" | "dark" | "system";

const themeKey = "formulaForge.theme";

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

function prefersDark() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

function applyTheme(theme: ThemeMode) {
  const isDark = theme === "dark" || (theme === "system" && prefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}

function getInitialTheme(): ThemeMode {
  const stored = window.localStorage.getItem(themeKey);
  if (stored === "dark" || stored === "light" || stored === "system") return stored;
  return "light";
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    window.localStorage.setItem(themeKey, theme);
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    window.localStorage.setItem(themeKey, next);
    applyTheme(next);
    set({ theme: next });
  },
}));
