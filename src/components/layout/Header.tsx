"use client";

import React from "react";
import { useLanguage } from "@/lib/language";

export type FocusId = "solutions" | "about" | "ecosystem" | "community";

const navTranslations = {
  en: {
    solutions: "Solutions",
    about: "About",
    ecosystem: "Ecosystem",
    community: "Community",
    brief: "Brief",
    begin: "Begin",
    os: "operating system"
  },
  "zh-CN": {
    solutions: "解决方案",
    about: "关于",
    ecosystem: "生态系统",
    community: "社区",
    brief: "简报",
    begin: "开始",
    os: "操作系统"
  },
  "zh-TW": {
    solutions: "解決方案",
    about: "關於",
    ecosystem: "生態系統",
    community: "社群",
    brief: "簡報",
    begin: "開始",
    os: "作業系統"
  },
  vi: {
    solutions: "Giải pháp",
    about: "Giới thiệu",
    ecosystem: "Hệ sinh thái",
    community: "Cộng đồng",
    brief: "Tóm tắt",
    begin: "Bắt đầu",
    os: "Hệ điều hành"
  }
};

interface HeaderProps {
  activePanels: FocusId[];
  onTogglePanel: (focus: FocusId | "reset") => void;
  onOpenPilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePanels,
  onTogglePanel,
  onOpenPilot,
}) => {
  const { language } = useLanguage();
  const t = navTranslations[language as keyof typeof navTranslations] || navTranslations.en;
  const navItemClass = (focusId: FocusId) => {
    const isActive = activePanels.includes(focusId);
    return `text-xs md:text-sm tracking-[0.18em] font-mono uppercase font-bold cursor-pointer transition-colors duration-200 select-none outline-none focus-visible:text-theme-accent flex items-center gap-2 ${
      isActive 
        ? "text-theme-accent" 
        : "text-theme-text-muted hover:text-theme-text"
    }`;
  };

  const renderNavButton = (focusId: FocusId, label: string) => {
    const isActive = activePanels.includes(focusId);
    return (
      <button
        onClick={() => onTogglePanel(focusId)}
        className={navItemClass(focusId)}
        aria-label={`Toggle ${label} workspace focus`}
      >
        <span className="relative py-2.5 flex items-center gap-2 group select-none">
          {isActive && (
            <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
          )}
          <span>{label}</span>
          <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-theme-accent transition-transform duration-200 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
          }`} />
        </span>
      </button>
    );
  };

  const renderMobileNavButton = (focusId: FocusId, label: string) => {
    const isActive = activePanels.includes(focusId);
    return (
      <button
        onClick={() => onTogglePanel(focusId)}
        className={`flex items-center gap-1.5 font-bold uppercase text-xs sm:text-sm tracking-[0.18em] transition-colors duration-200 focus-visible:text-theme-accent outline-none select-none ${
          isActive ? "text-theme-accent" : "text-theme-text-muted"
        }`}
        aria-label={`Toggle ${label} focus`}
      >
        <span className="text-xs sm:text-sm leading-none transition-colors duration-200 select-none">
          {isActive ? "●" : "○"}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      <header
        className="sticky lg:relative lg:top-0 top-4 z-40 h-16 w-full flex items-center justify-between px-6 md:px-8 border border-theme-border/60 bg-theme-void/85 backdrop-blur-md rounded-sm transition-all duration-300 font-mono shadow-md"
      >
        {/* Left Section */}
        <div className="flex items-center gap-6 md:gap-8 flex-1">
          {/* Desktop Nav on Left */}
          <div className="hidden lg:flex items-center gap-6 md:gap-8">
            {renderNavButton("solutions", t.solutions)}
            {renderNavButton("about", t.about)}
          </div>

          {/* Mobile Wordmark on Left */}
          <div 
            onClick={() => onTogglePanel("reset")}
            className="flex lg:hidden flex-col items-start justify-center cursor-pointer select-none group focus-visible:ring-1 focus-visible:ring-theme-accent py-1"
            role="button"
            tabIndex={0}
            aria-label="Reset workspace to home"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onTogglePanel("reset");
              }
            }}
          >
            <span className="font-gothic text-xl text-theme-text tracking-normal transition-colors duration-200 group-hover:text-theme-accent font-blackletter">
              Kairma
            </span>
          </div>
        </div>

        {/* Center Section (Desktop Only) */}
        <div className="hidden lg:flex flex-col items-center justify-center flex-1">
          <div 
            onClick={() => onTogglePanel("reset")}
            className="flex flex-col items-center justify-center cursor-pointer select-none group focus-visible:ring-1 focus-visible:ring-theme-accent px-6 py-2"
            role="button"
            tabIndex={0}
            aria-label="Reset workspace to home"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onTogglePanel("reset");
              }
            }}
          >
            <span className="font-gothic text-2xl md:text-3xl text-theme-text tracking-normal transition-colors duration-200 group-hover:text-theme-accent font-blackletter">
              Kairma
            </span>
            <span className="text-[11px] md:text-xs text-theme-text-muted tracking-[0.25em] uppercase font-mono leading-none -mt-1 select-none">
              {t.os}
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6 md:gap-8 flex-1 justify-end">
          {/* Desktop Nav on Right */}
          <div className="hidden lg:flex items-center gap-6 md:gap-8">
            {renderNavButton("ecosystem", t.ecosystem)}
            {renderNavButton("community", t.community)}
            <div className="w-[1px] h-5 bg-theme-border/60" />
          </div>

          {/* Actions (Always Visible) */}
          <a
            href="/KAIRMA Business Deck 2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.18em] text-theme-text-muted hover:text-theme-text uppercase font-semibold inline-flex items-center gap-1.5 select-none focus-visible:text-theme-accent"
          >
            {t.brief} ↗
          </a>

          {/* CTA Button */}
          <button
            onClick={onOpenPilot}
            className="px-4 py-2 md:px-5 md:py-2.5 text-xs tracking-[0.18em] font-bold uppercase border border-theme-border bg-theme-void/85 text-theme-text hover:border-theme-accent hover:text-theme-accent transition-all duration-200 select-none cursor-pointer rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-theme-accent"
            aria-label="Open Request a Pilot dialog"
          >
            {t.begin} →
          </button>
        </div>
      </header>

      {/* Sticky Mobile Bottom Nav Bar */}
      <nav
        className="fixed bottom-4 left-4 right-4 z-40 lg:hidden h-16 border border-theme-border/60 bg-theme-void/90 backdrop-blur-md rounded-sm flex items-center justify-around px-4 font-mono text-[9px] sm:text-xs shadow-lg"
      >
        {renderMobileNavButton("solutions", t.solutions)}
        {renderMobileNavButton("about", t.about)}
        {renderMobileNavButton("ecosystem", t.ecosystem)}
        {renderMobileNavButton("community", t.community)}
      </nav>
    </>
  );
};

export default Header;
