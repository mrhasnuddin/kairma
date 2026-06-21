"use client";

import React from "react";
import { useTheme } from "@/lib/theme";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 border border-theme-border/50 p-1 rounded-full bg-theme-void/80 font-mono text-[10px] w-full max-w-[150px] select-none">
      <button
        onClick={() => setTheme("xuan-mode")}
        className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full cursor-pointer transition-all duration-150 outline-none select-none ${
          theme === "xuan-mode"
            ? "bg-theme-accent text-theme-void font-bold"
            : "text-theme-text-muted hover:text-theme-text"
        }`}
        aria-label="Switch to Xuan Mode Theme"
      >
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <span>LIGHT</span>
      </button>
      <button
        onClick={() => setTheme("matrix-mode")}
        className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-full cursor-pointer transition-all duration-150 outline-none select-none ${
          theme === "matrix-mode"
            ? "bg-theme-accent text-theme-void font-bold"
            : "text-theme-text-muted hover:text-theme-text"
        }`}
        aria-label="Switch to Matrix Mode Theme"
      >
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
        <span>DARK</span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;
