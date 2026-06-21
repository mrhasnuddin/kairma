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
  const [theme, setThemeState] = useState<Theme>("matrix-mode");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) as Theme | null;
    let initialTheme: Theme = "matrix-mode";

    if (saved === "matrix-mode" || saved === "xuan-mode") {
      initialTheme = saved;
    } else {
      const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      initialTheme = prefersLight ? "xuan-mode" : "matrix-mode";
    }

    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    if (initialTheme === "xuan-mode") {
      document.documentElement.classList.add("xuan-mode");
    }
    setMounted(true);
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
    const nextTheme = theme === "matrix-mode" ? "xuan-mode" : "matrix-mode";
    setTheme(nextTheme);
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
      var theme = 'matrix-mode';
      if (saved === 'matrix-mode' || saved === 'xuan-mode') {
        theme = saved;
      } else {
        var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        theme = prefersLight ? 'xuan-mode' : 'matrix-mode';
      }
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'xuan-mode') {
        document.documentElement.classList.add("xuan-mode");
      }
    } catch (e) {}
  })();
`;
