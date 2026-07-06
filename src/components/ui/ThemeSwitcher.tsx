"use client";

import React from "react";
import { useTheme } from "@/lib/theme";
import { Moon, Sun } from "lucide-react";

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 border border-theme-border/50 p-1 rounded-xl bg-theme-void/80 w-full max-w-full select-none backdrop-blur-sm">
      
      {/* Dark Theme (Matrix / Red) */}
      <button
        onClick={() => setTheme("matrix-mode")}
        className={`group relative flex-1 flex items-center justify-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 outline-none select-none ${
          theme === "matrix-mode"
            ? "border border-theme-border/40 bg-theme-void text-theme-accent shadow-sm"
            : "border border-transparent text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10"
        }`}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      </button>

      {/* Light Theme (Xuan / Green) */}
      <button
        onClick={() => setTheme("xuan-mode")}
        className={`group relative flex-1 flex items-center justify-center py-2 px-3 rounded-lg cursor-pointer transition-all duration-300 outline-none select-none ${
          theme === "xuan-mode"
            ? "border border-theme-border/40 bg-theme-void text-theme-accent shadow-sm"
            : "border border-transparent text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10"
        }`}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
      </button>

    </div>
  );
};

export default ThemeSwitcher;
