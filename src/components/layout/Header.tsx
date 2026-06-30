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
        className={`flex items-center gap-1.5 font-bold uppercase text-xs sm:text-sm tracking-[0.18em] transition-colors duration-200 focus-visible:text-theme-accent outline-none select-none flex-shrink-0 whitespace-nowrap ${
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
        className="sticky lg:relative lg:top-0 top-4 z-40 h-16 w-full flex items-center justify-between px-6 md:px-8 border border-theme-border/60 bg-theme-void/85 backdrop-blur-md rounded-sm transition-all duration-300 font-mono flex-shrink-0"
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

          {/* Actions removed for now per request */}
        </div>
      </header>
    </>
  );
};

export const MobileNav: React.FC<HeaderProps> = ({
  activePanels,
  onTogglePanel,
}) => {
  const { language } = useLanguage();
  const t = navTranslations[language as keyof typeof navTranslations] || navTranslations.en;

  const renderMobileNavButton = (focusId: FocusId, label: string) => {
    const isActive = activePanels.includes(focusId);
    return (
      <button
        onClick={() => onTogglePanel(focusId)}
        className={`flex items-center gap-1 font-bold uppercase text-[10px] tracking-[0.12em] transition-colors duration-200 focus-visible:text-theme-accent outline-none select-none ${
          isActive ? "text-theme-accent" : "text-theme-text-muted"
        }`}
        aria-label={`Toggle ${label} focus`}
      >
        <span className="text-[10px] leading-none transition-colors duration-200 select-none">
          {isActive ? "●" : "○"}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <nav
      className="lg:hidden w-full h-14 flex-shrink-0 border border-theme-border/60 bg-theme-void/90 backdrop-blur-md rounded-sm flex items-center justify-evenly px-2"
    >
      {renderMobileNavButton("solutions", t.solutions)}
      {renderMobileNavButton("about", t.about)}
      {renderMobileNavButton("ecosystem", t.ecosystem)}
      {renderMobileNavButton("community", t.community)}
    </nav>
  );
};

export default Header;
