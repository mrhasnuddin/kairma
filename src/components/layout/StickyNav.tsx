"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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

/** Magnetic hover: the child is pulled toward the cursor and springs back. */
const Magnetic: React.FC<{ children: React.ReactNode; strength?: number }> = ({
  children,
  strength = 0.35,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 320, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 320, damping: 18, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-flex"
    >
      {children}
    </motion.div>
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
          <Magnetic>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="h-5 w-24 mr-3 bg-theme-accent cursor-pointer"
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
          </Magnetic>

          {NAV_LINKS.map((link) => (
            <Magnetic key={link.key}>
              <button
                onClick={() => jumpToBox(link.target)}
                className="px-2.5 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-theme-text-muted hover:text-theme-accent transition-colors whitespace-nowrap"
              >
                {labelFor(link)}
              </button>
            </Magnetic>
          ))}

          <div className="w-px h-4 bg-theme-border mx-2" />

          <Magnetic>
            <button
              onClick={() => jumpToBox("deploy")}
              className="text-xs font-mono font-bold uppercase tracking-widest text-theme-void bg-theme-accent px-4 py-1.5 rounded-full transition-colors opacity-90 hover:opacity-100"
            >
              Apply
            </button>
          </Magnetic>
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
