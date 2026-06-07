"use client";

import React from "react";

type GroupId = "problem" | "system" | "moats" | "story" | "begin";

interface HeaderProps {
  activeGroups: GroupId[];
  onToggleGroup: (group: GroupId | "reset") => void;
  onOpenPilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeGroups,
  onToggleGroup,
  onOpenPilot,
}) => {
  const navItemClass = (groupId: GroupId) => {
    const isActive = activeGroups.includes(groupId);
    return `text-xs md:text-sm tracking-[0.18em] font-mono uppercase font-bold cursor-pointer transition-colors duration-200 select-none outline-none focus-visible:text-theme-accent flex items-center gap-1.5 ${
      isActive 
        ? "text-theme-accent" 
        : "text-theme-text-muted hover:text-theme-text"
    }`;
  };

  const renderNavButton = (groupId: GroupId, label: string) => {
    const isActive = activeGroups.includes(groupId);
    return (
      <button
        onClick={() => onToggleGroup(groupId)}
        className={navItemClass(groupId)}
        aria-label={`Toggle ${label} workspace group`}
      >
        <span className="relative py-1 flex items-center gap-1.5 group select-none">
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
          )}
          <span>{label}</span>
          <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-theme-accent transition-transform duration-200 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
          }`} />
        </span>
      </button>
    );
  };

  const renderMobileNavButton = (groupId: GroupId, label: string) => {
    const isActive = activeGroups.includes(groupId);
    return (
      <button
        onClick={() => onToggleGroup(groupId)}
        className={`flex items-center gap-1 font-bold uppercase text-[10px] sm:text-xs tracking-[0.18em] transition-colors duration-200 focus-visible:text-theme-accent outline-none select-none ${
          isActive ? "text-theme-accent" : "text-theme-text-muted"
        }`}
        aria-label={`Toggle ${label} group`}
      >
        <span className="text-[10px] sm:text-xs leading-none transition-colors duration-200 select-none">
          {isActive ? "●" : "○"}
        </span>
        <span>{label}</span>
      </button>
    );
  };

  return (
    <>
      <header
        className="sticky top-2.5 z-40 h-12 w-full flex items-center justify-between px-4 border border-theme-border/60 bg-theme-void/85 backdrop-blur-md rounded-sm transition-all duration-300 font-mono shadow-md"
      >
        {/* Left Section */}
        <div className="flex items-center gap-4 md:gap-6 flex-1">
          {/* Desktop Nav on Left */}
          <div className="hidden lg:flex items-center gap-4 md:gap-6">
            {renderNavButton("problem", "Problem")}
            {renderNavButton("system", "System")}
            {renderNavButton("moats", "Moats")}
          </div>

          {/* Mobile Wordmark on Left */}
          <div 
            onClick={() => onToggleGroup("reset")}
            className="flex lg:hidden flex-col items-start justify-center cursor-pointer select-none group focus-visible:ring-1 focus-visible:ring-theme-accent py-1"
            role="button"
            tabIndex={0}
            aria-label="Reset workspace to home"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onToggleGroup("reset");
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
            onClick={() => onToggleGroup("reset")}
            className="flex flex-col items-center justify-center cursor-pointer select-none group focus-visible:ring-1 focus-visible:ring-theme-accent px-4 py-1"
            role="button"
            tabIndex={0}
            aria-label="Reset workspace to home"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onToggleGroup("reset");
              }
            }}
          >
            <span className="font-gothic text-2xl md:text-3xl text-theme-text tracking-normal transition-colors duration-200 group-hover:text-theme-accent font-blackletter">
              Kairma
            </span>
            <span className="text-[9px] text-theme-text-muted tracking-[0.25em] uppercase font-mono leading-none -mt-1 select-none">
              operating system
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-5 flex-1 justify-end">
          {/* Desktop Nav on Right */}
          <div className="hidden lg:flex items-center gap-4 md:gap-5">
            {renderNavButton("story", "Story")}
            {renderNavButton("begin", "Begin")}
            <div className="w-[1px] h-4 bg-theme-border/60" />
          </div>

          {/* Actions (Always Visible) */}
          <a
            href="/KAIRMA Business Deck 2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.18em] text-theme-text-muted hover:text-theme-text uppercase font-semibold inline-flex items-center gap-1 select-none focus-visible:text-theme-accent"
          >
            Brief ↗
          </a>

          {/* CTA Button */}
          <button
            onClick={onOpenPilot}
            className="px-3.5 py-1.5 md:px-4 md:py-2 text-xs tracking-[0.18em] font-bold uppercase border border-theme-border bg-theme-void/85 text-theme-text hover:border-theme-accent hover:text-theme-accent transition-all duration-200 select-none cursor-pointer rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-theme-accent"
            aria-label="Open Request a Pilot dialog"
          >
            Begin →
          </button>
        </div>
      </header>

      {/* Sticky Mobile Bottom Nav Bar */}
      <nav
        className="fixed bottom-5 left-5 right-5 z-40 lg:hidden h-12 border border-theme-border/60 bg-theme-void/90 backdrop-blur-md rounded-sm flex items-center justify-around px-2 font-mono text-[9px] sm:text-xs shadow-lg"
      >
        {renderMobileNavButton("problem", "Problem")}
        {renderMobileNavButton("system", "System")}
        {renderMobileNavButton("moats", "Moats")}
        {renderMobileNavButton("story", "Story")}
        {renderMobileNavButton("begin", "Begin")}
      </nav>
    </>
  );
};

export default Header;
