"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "matrix-dark" | "korea-light";

export const THEME_KEY = "kairma-theme";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("matrix-dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    let initialTheme: Theme = "matrix-dark";

    if (saved === "matrix-dark" || saved === "korea-light") {
      initialTheme = saved;
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      initialTheme = prefersLight ? "korea-light" : "matrix-dark";
    }

    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "matrix-dark" ? "korea-light" : "matrix-dark";
    setTheme(nextTheme);
  }, [theme, setTheme]);

  // Use React.createElement to keep the file as a clean .ts file (no JSX needed)
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
      var theme = 'matrix-dark';
      if (saved === 'matrix-dark' || saved === 'korea-light') {
        theme = saved;
      } else {
        var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        theme = prefersLight ? 'korea-light' : 'matrix-dark';
      }
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {}
  })();
`;
