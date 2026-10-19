"use client";

import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useCopyV7, useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import type { Language } from "@/data/site-translations";
import { Wordmark, scrollToId } from "./ui";

export const SECTIONS = ["shift", "keep", "moats", "roster", "models", "build"] as const;

export const LOCALES: { id: Language; short: string; name: string }[] = [
  { id: "en", short: "EN", name: "English" },
  { id: "zh-TW", short: "繁", name: "繁體中文" },
  { id: "ja", short: "JP", name: "日本語" },
  { id: "ko", short: "KR", name: "한국어" },
  { id: "vi", short: "VI", name: "Tiếng Việt" },
  { id: "ms", short: "MY", name: "Bahasa Melayu" },
];

const cell = "flex h-full items-center border-r border-k-line px-4 md:px-5";

export function Header({ onPilot }: { onPilot: () => void }) {
  const c = useCopyV7();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const labels: Record<(typeof SECTIONS)[number], string> = {
    shift: c.nav.shift, keep: c.nav.keep, moats: c.nav.moats,
    roster: c.nav.workforce, models: c.nav.models, build: c.nav.build,
  };

  // Highlight the section currently under the header.
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => !langRef.current?.contains(e.target as Node) && setLangOpen(false);
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [langOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };
  const current = LOCALES.find((l) => l.id === language) ?? LOCALES[0];

  return (
    <>
      <header
        data-k-header
        className="fixed inset-x-(--k-inset) top-0 z-50 flex h-(--k-header-h) border-x border-b border-k-line bg-k-paper/90 backdrop-blur-md"
      >
        <button type="button" onClick={() => go("top")} className={`${cell} text-k-ink`} aria-label="Kairma">
          <Wordmark className="h-5 w-20 md:h-6 md:w-24" />
        </button>

        <nav aria-label="Sections" className="hidden h-full lg:flex">
          {SECTIONS.map((id, i) => (
            <button
              key={id}
              type="button"
              onClick={() => go(id)}
              aria-current={active === id ? "true" : undefined}
              className={`${cell} group relative gap-2 k-label transition-colors duration-300 ${
                active === id ? "text-k-ink" : "text-k-ink-3 hover:text-k-ink"
              }`}
            >
              <span className="text-k-ink-4">0{i + 1}</span>
              {labels[id]}
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-k-accent transition-transform duration-500 ease-k-out ${
                  active === id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex-1 border-r border-k-line" />

        <div ref={langRef} className="relative hidden h-full md:block">
          <button
            type="button"
            onClick={() => setLangOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={langOpen}
            aria-label={c.nav.language}
            className={`${cell} k-label text-k-ink-3 hover:text-k-ink`}
          >
            {current.short}
          </button>
          {langOpen && (
            <ul role="listbox" aria-label={c.nav.language} className="absolute right-0 top-full mt-2 min-w-44 overflow-hidden rounded-k-field border border-k-line bg-k-surface p-1 shadow-lg">
              {LOCALES.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={l.id === language}
                    onClick={() => { setLanguage(l.id); setLangOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-[calc(var(--k-radius-field)-4px)] px-3 py-2 text-left k-body transition-colors hover:bg-k-ink/5 ${
                      l.id === language ? "text-k-accent-text" : "text-k-ink-2"
                    }`}
                  >
                    {l.name}
                    <span className="k-label text-k-ink-4">{l.short}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" onClick={toggleTheme} aria-label={c.nav.theme} className={`${cell} hidden text-k-ink-3 hover:text-k-ink md:flex`}>
          {theme === "xuan-mode" ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          type="button"
          onClick={onPilot}
          className="hidden h-full items-center bg-k-accent px-5 k-label text-k-on-accent transition-opacity hover:opacity-90 md:flex"
        >
          {c.nav.pilot}
        </button>

        <button type="button" onClick={() => setMenuOpen(true)} className="flex h-full items-center px-4 k-label text-k-ink lg:hidden" aria-expanded={menuOpen}>
          {c.nav.menu}
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-k-paper px-(--k-inset) lg:hidden" role="dialog" aria-modal="true" aria-label={c.nav.menu}>
          <div className="flex h-(--k-header-h) items-stretch border-x border-b border-k-line">
            <div className={`${cell} flex-1 text-k-ink`}><Wordmark className="h-5 w-20" /></div>
            <button type="button" onClick={() => setMenuOpen(false)} className="px-4 k-label text-k-ink">{c.nav.close}</button>
          </div>
          <nav aria-label="Sections" className="flex flex-1 flex-col border-x border-k-line">
            {SECTIONS.map((id, i) => (
              <button key={id} type="button" onClick={() => go(id)} className="flex items-baseline gap-4 border-b border-k-line px-5 py-5 text-left">
                <span className="k-label text-k-ink-4">0{i + 1}</span>
                <span className="k-title text-k-ink">{labels[id]}</span>
              </button>
            ))}
            <div className="flex flex-wrap gap-2 px-5 py-5">
              {LOCALES.map((l) => (
                <button key={l.id} type="button" onClick={() => setLanguage(l.id)}
                  className={`rounded-k-control border px-3 py-1.5 k-label ${l.id === language ? "border-k-accent text-k-accent-text" : "border-k-line text-k-ink-3"}`}>
                  {l.short}
                </button>
              ))}
              <button type="button" onClick={toggleTheme} aria-label={c.nav.theme} className="rounded-k-control border border-k-line px-3 py-1.5 text-k-ink-3">
                {theme === "xuan-mode" ? <Moon size={14} /> : <Sun size={14} />}
              </button>
            </div>
          </nav>
          <div className="border-x border-b border-k-line p-5">
            <button type="button" onClick={() => { setMenuOpen(false); onPilot(); }} className="w-full rounded-k-control bg-k-accent px-5 py-3.5 k-label text-k-on-accent">
              {c.nav.pilot} →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
