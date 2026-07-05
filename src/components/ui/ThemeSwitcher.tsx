"use client";

import React from "react";
import { useTheme } from "@/lib/theme";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 border border-theme-border/50 p-1 rounded-xl bg-theme-void/80 w-full max-w-full select-none backdrop-blur-sm">
      
      {/* Dark Theme (Red/Black) */}
      <button
        onClick={() => setTheme("matrix-mode")}
        className={`relative flex-1 flex items-center justify-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 outline-none select-none ${
          theme === "matrix-mode"
            ? "border border-theme-border/40 bg-theme-void text-theme-accent shadow-sm"
            : "border border-transparent text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10"
        }`}
        aria-label="Dark Mode"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Light Theme (Green/White) */}
      <button
        onClick={() => setTheme("xuan-mode")}
        className={`relative flex-1 flex items-center justify-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 outline-none select-none ${
          theme === "xuan-mode"
            ? "border border-theme-border/40 bg-theme-void text-theme-accent shadow-sm"
            : "border border-transparent text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10"
        }`}
        aria-label="Light Mode"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>

    </div>
  );
};

export default ThemeSwitcher;
