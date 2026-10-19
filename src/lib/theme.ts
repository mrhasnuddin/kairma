"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "matrix-mode" | "xuan-mode";

export const THEME_KEY = "kairma-theme";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // v4: light (xuan) is the default. Dark only when the visitor chose it, or
  // their OS explicitly asks for dark.
  const [theme, setThemeState] = useState<Theme>("xuan-mode");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(THEME_KEY) as Theme | null;
      let initialTheme: Theme = "xuan-mode";

      if (saved === "matrix-mode" || saved === "xuan-mode") {
        initialTheme = saved;
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        initialTheme = prefersDark ? "matrix-mode" : "xuan-mode";
      }

      setThemeState(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
      if (initialTheme === "xuan-mode") {
        document.documentElement.classList.add("xuan-mode");
      } else {
        document.documentElement.classList.remove("xuan-mode");
      }
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (newTheme === "xuan-mode") {
      document.documentElement.classList.add("xuan-mode");
    } else {
      document.documentElement.classList.remove("xuan-mode");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const themes: Theme[] = ["matrix-mode", "xuan-mode"];
    const nextIndex = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [theme, setTheme]);

  return React.createElement(
    ThemeContext.Provider,
    { value: { theme, setTheme, toggleTheme } },
    React.createElement("div", { className: mounted ? "theme-loaded" : "" }, children)
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Injected helper script to be put inside the document head (SSR flicker prevention)
export const themeScript = `
  (function() {
    try {
      var saved = localStorage.getItem('${THEME_KEY}');
      var theme = 'xuan-mode';
      if (saved === 'matrix-mode' || saved === 'xuan-mode') {
        theme = saved;
      } else {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'matrix-mode' : 'xuan-mode';
      }
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'xuan-mode') {
        document.documentElement.classList.add("xuan-mode");
      }
    } catch (e) {}
  })();
`;
