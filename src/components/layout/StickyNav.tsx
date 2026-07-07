"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { Language } from "@/data/site-translations";

// Grouped nav targets — one link per landmark box (navId on the OSCard).
// Boxes 1–3 (top screen) are reached via the logo.
const NAV_LINKS: { key: string; target: string; label: Record<string, string> }[] = [
  { key: "shift",  target: "shift",  label: { en: "SHIFT",  "zh-TW": "轉變",   vi: "CHUYỂN ĐỔI", ms: "PERALIHAN", ja: "転換",   ko: "전환" } },
  { key: "moats",  target: "moats",  label: { en: "MOATS",  "zh-TW": "護城河", vi: "HÀO LŨY",    ms: "BENTENG",   ja: "堀",     ko: "해자" } },
  { key: "models", target: "models", label: { en: "MODELS", "zh-TW": "模型",   vi: "MÔ HÌNH",    ms: "MODEL",     ja: "モデル", ko: "모델" } },
  { key: "build",  target: "build",  label: { en: "BUILD",  "zh-TW": "開發",   vi: "XÂY DỰNG",   ms: "BINA",      ja: "開発",   ko: "개발" } },
  { key: "deploy", target: "deploy", label: { en: "DEPLOY", "zh-TW": "部署",   vi: "TRIỂN KHAI", ms: "GERAK",     ja: "配備",   ko: "배치" } },
  { key: "roster", target: "roster", label: { en: "ROSTER", "zh-TW": "陣容",   vi: "ĐỘI HÌNH",   ms: "ROSTER",    ja: "ロースター", ko: "로스터" } },
];

// Smooth-scroll to the box, then blink its hover effect twice so the user
// knows "this is the box you were looking for".
const jumpToBox = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  window.setTimeout(() => {
    window.dispatchEvent(new CustomEvent("kairma-nav-flash", { detail: id }));
  }, 700);
};

/** Social-bar style magnetic button: container stays, inner content floats toward cursor with subtle glow overlay. */
const SocialNavButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  isPill?: boolean;
  ariaLabel?: string;
}> = ({ onClick, children, className = "", isPill = false, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        e.currentTarget.style.setProperty("--mx", `${x * 0.45}px`);
        e.currentTarget.style.setProperty("--my", `${y * 0.45}px`);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty("--mx", "0px");
        e.currentTarget.style.setProperty("--my", "0px");
      }}
      className={`group relative flex items-center justify-center py-1.5 px-2.5 rounded-xl cursor-pointer transition-colors duration-300 outline-none select-none overflow-hidden ${
        isPill
          ? "bg-theme-accent text-theme-void rounded-full hover:opacity-100 opacity-90 px-4 py-1.5"
          : "text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10"
      } ${className}`}
    >
      <div
        className="relative flex items-center justify-center px-1 py-0.5"
        style={{
          transform: "translate(var(--mx, 0px), var(--my, 0px))",
          transition: "transform 0.2s cubic-bezier(0.25, 1.25, 0.5, 1)",
        }}
      >
        {children}
        {!isPill && (
          <div className="absolute -inset-x-2 -inset-y-1 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none rounded-xl border border-theme-accent/40 bg-theme-accent/5" />
        )}
      </div>
    </button>
  );
};

export const StickyNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const labelFor = (link: (typeof NAV_LINKS)[number]) =>
    link.label[language as Language] ?? link.label.en;

  return (
    <>
      {/* Desktop Sticky Nav Pill */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] hidden md:flex">
        <div
          className={`flex items-center gap-1 px-5 py-2.5 rounded-full transition-colors duration-500 backdrop-blur-md border ${
            isScrolled
              ? "bg-theme-void/80 border-theme-border shadow-[0_0_20px_var(--color-theme-border-glow)] text-theme-text"
              : "bg-transparent border-transparent text-theme-accent"
          }`}
        >
          <SocialNavButton
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            ariaLabel="Back to top"
            className="mr-2"
          >
            <div
              className="h-5 w-24 bg-theme-accent"
              style={{
                WebkitMaskImage: "url(/kairma-logo.svg)",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "left center",
                maskImage: "url(/kairma-logo.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "left center",
              }}
            />
          </SocialNavButton>

          {NAV_LINKS.map((link) => (
            <SocialNavButton
              key={link.key}
              onClick={() => jumpToBox(link.target)}
            >
              <span className="text-xs font-mono font-bold uppercase tracking-widest whitespace-nowrap relative z-10">
                {labelFor(link)}
              </span>
            </SocialNavButton>
          ))}

          <div className="w-px h-4 bg-theme-border mx-2" />

          <SocialNavButton
            onClick={() => jumpToBox("deploy")}
            isPill
          >
            <span className="text-xs font-mono font-bold uppercase tracking-widest whitespace-nowrap relative z-10">
              Apply
            </span>
          </SocialNavButton>
        </div>
      </div>

      {/* Mobile Sticky Nav Pill (Hamburger) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] md:hidden w-[calc(100%-2rem)] max-w-sm">
        <div className="flex items-center justify-between px-5 py-3 rounded-full bg-theme-void/90 backdrop-blur-md border border-theme-border shadow-lg transition-colors duration-500">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Back to top"
            className="h-4 w-20 bg-theme-accent"
            style={{
              WebkitMaskImage: "url(/kairma-logo.svg)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskImage: "url(/kairma-logo.svg)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "left center",
            }}
          />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-theme-text hover:text-theme-accent transition-colors focus:outline-none"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Full Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[90] bg-theme-void/95 backdrop-blur-lg transition-all duration-500 md:hidden flex flex-col justify-center items-center ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-5 text-center">
          {NAV_LINKS.map((link) => (
            <button
              key={link.key}
              onClick={() => {
                setMobileMenuOpen(false);
                // Let the overlay fade before scrolling so the jump is visible.
                window.setTimeout(() => jumpToBox(link.target), 250);
              }}
              className="text-lg font-mono font-bold uppercase tracking-widest text-theme-text hover:text-theme-accent transition-colors"
            >
              {labelFor(link)}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.setTimeout(() => jumpToBox("deploy"), 250);
            }}
            className="mt-4 text-lg font-mono font-bold uppercase tracking-widest text-theme-void bg-theme-accent px-8 py-3 rounded-full transition-colors opacity-90 hover:opacity-100"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};
