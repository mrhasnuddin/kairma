"use client";

import React from "react";
import { useTheme } from "@/lib/theme";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 border border-theme-border p-0.5 rounded-sm bg-theme-void/80 font-mono text-[9px]">
      <button
        onClick={() => setTheme("matrix-dark")}
        className={`px-2 py-1 uppercase tracking-widest cursor-pointer transition-colors duration-150 rounded-xs select-none outline-none ${
          theme === "matrix-dark"
            ? "bg-theme-accent text-theme-void font-bold"
            : "text-theme-text-muted hover:text-theme-text"
        }`}
        aria-label="Switch to Matrix Dark Theme"
      >
        Matrix
      </button>
      <div className="w-[1px] h-3 bg-theme-border/60 self-center" />
      <button
        onClick={() => setTheme("korea-light")}
        className={`px-2 py-1 uppercase tracking-widest cursor-pointer transition-colors duration-150 rounded-xs select-none outline-none ${
          theme === "korea-light"
            ? "bg-theme-accent text-theme-void font-bold"
            : "text-theme-text-muted hover:text-theme-text"
        }`}
        aria-label="Switch to Korea Light Theme"
      >
        Korea
      </button>
    </div>
  );
};

export default ThemeSwitcher;
