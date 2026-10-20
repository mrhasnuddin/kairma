"use client";

import React, { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useCopyV8, useLanguage } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import type { Language } from "@/data/site-translations";
import { Roll, Wordmark, scrollToId } from "./ui";

export const LOCALES: { id: Language; short: string; name: string }[] = [
  { id: "en", short: "EN", name: "English" },
  { id: "zh-TW", short: "繁", name: "繁體中文" },
  { id: "ja", short: "JP", name: "日本語" },
  { id: "ko", short: "KR", name: "한국어" },
  { id: "vi", short: "VI", name: "Tiếng Việt" },
  { id: "ms", short: "MY", name: "Bahasa Melayu" },
];

type Item = { id: string; label: string; dialog?: boolean };
const cell = "flex h-full items-center border-r border-k-line px-4 md:px-5";

/* Heron's boxed header: logo cell, four nav cells, then locale, theme and the
   one accent action. Below lg it collapses to logo + Menu. */
export function Header({ onPilot, onDeploy }: { onPilot: () => void; onDeploy: () => void }) {
  const c = useCopyV8();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [onFooter, setOnFooter] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  const items: Item[] = [
    { id: "platform", label: c.nav.platform },
    { id: "deploy", label: c.nav.deploy, dialog: true },
    { id: "why", label: c.nav.why },
    { id: "workforce", label: c.nav.workforce },
  ];

  // Mark the section under the middle of the viewport.
  useEffect(() => {
    const els = ["platform", "why", "workforce"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Over the footer the header takes the footer's colours (.k-invert).
  useEffect(() => {
    const runway = document.querySelector("[data-footer-runway]");
    const header = document.querySelector("[data-k-header]");
    if (!runway || !header) return;
    let frame = 0;
    const check = () => { frame = 0; setOnFooter(runway.getBoundingClientRect().top <= header.getBoundingClientRect().height); };
    const queue = () => { if (!frame) frame = requestAnimationFrame(check); };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); };
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => !langRef.current?.contains(e.target as Node) && setLangOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setLangOpen(false);
    window.addEventListener("mousedown", close);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("mousedown", close); window.removeEventListener("keydown", esc); };
  }, [langOpen]);

  // Mobile menu: Escape closes, focus moves in and returns to the button.
  useEffect(() => {
    if (!menuOpen) return;
    const button = menuButton.current;
    menuRef.current?.querySelector<HTMLElement>("button")?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", esc);
    return () => { window.removeEventListener("keydown", esc); button?.focus(); };
  }, [menuOpen]);

  const go = (item: Item) => {
    setMenuOpen(false);
    if (item.dialog) onDeploy();
    else scrollToId(item.id);
  };
  const current = LOCALES.find((l) => l.id === language) ?? LOCALES[0];
  const ThemeIcon = theme === "xuan-mode" ? Moon : Sun;

  return (
    <>
      <a href="#main" className="sr-only z-[70] k-label focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-k-accent focus:px-4 focus:py-2 focus:text-k-on-accent">
        {c.nav.skip}
      </a>
      <header
        data-k-header
        className={`fixed inset-x-(--k-inset) top-0 z-50 flex h-(--k-header-h) border-x border-b border-k-line bg-k-paper/92 text-k-ink backdrop-blur-md transition-[background-color,border-color,color] duration-300 ${onFooter ? "k-invert" : ""}`}
      >
        <button type="button" onClick={() => scrollToId("top")} className={`${cell} text-k-ink`} aria-label={c.nav.home}>
          <Wordmark className="h-5 w-20 md:h-6 md:w-24" />
        </button>

        <nav aria-label="Primary" className="hidden h-full lg:flex">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item)}
              aria-current={active === item.id ? "location" : undefined}
              aria-haspopup={item.dialog ? "dialog" : undefined}
              className={`${cell} k-fx k-label ${
                active === item.id ? "text-k-ink" : "text-k-ink-3 hover:text-k-ink"
              }`}
            >
              <Roll>{item.label}</Roll>
              <span
                aria-hidden
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-k-accent transition-transform duration-300 ease-k-ui ${
                  active === item.id ? "scale-x-100" : "scale-x-0"
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
            aria-expanded={langOpen}
            aria-controls="k-lang-menu"
            aria-label={`${c.nav.language}: ${current.name}`}
            className={`${cell} k-fx k-label text-k-ink-3`}
          >
            <Roll>{current.short}</Roll>
          </button>
          {langOpen && (
            <ul id="k-lang-menu" aria-label={c.nav.language} className="absolute right-0 top-full mt-2 min-w-44 origin-top-right overflow-hidden rounded-k-field border border-k-line bg-k-surface p-1 shadow-lg motion-safe:animate-[k-pop_var(--k-dur-enter)_var(--k-ease-ui)]">
              {LOCALES.map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    lang={l.id}
                    aria-current={l.id === language ? "true" : undefined}
                    onClick={() => { setLanguage(l.id); setLangOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-[calc(var(--k-radius-field)-4px)] px-3 py-2 text-left k-body transition-colors hover:bg-k-ink/5 ${
                      l.id === language ? "text-k-accent-text" : "text-k-ink-2"
                    }`}
                  >
                    {l.name}
                    <span className="k-label text-k-ink-3">{l.short}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="button" onClick={toggleTheme} aria-label={c.nav.theme} className={`${cell} k-fx hidden text-k-ink-3 md:flex`}>
          <ThemeIcon size={16} aria-hidden />
        </button>

        <button
          type="button"
          onClick={onPilot}
          className="k-fx k-fx-press hidden h-full items-center bg-k-accent px-5 k-label text-k-on-accent md:flex"
        >
          <Roll>{c.nav.pilot}</Roll>
        </button>

        <button
          ref={menuButton}
          type="button"
          onClick={() => setMenuOpen(true)}
          className="k-fx flex h-full items-center gap-3 px-4 k-label text-k-ink lg:hidden"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
        >
          {c.nav.menu}
          <span aria-hidden className="flex w-5 flex-col gap-1"><span className="h-px bg-current" /><span className="h-px bg-current" /></span>
        </button>
      </header>

      {menuOpen && (
        <div ref={menuRef} className="fixed inset-0 z-[60] flex flex-col bg-k-paper px-(--k-inset) lg:hidden" role="dialog" aria-modal="true" aria-label={c.nav.menu}>
          <div className="flex h-(--k-header-h) items-stretch border-x border-b border-k-line">
            <div className={`${cell} flex-1 text-k-ink`}><Wordmark className="h-5 w-20" /></div>
            <button type="button" onClick={() => setMenuOpen(false)} className="px-4 k-label text-k-ink">{c.nav.close}</button>
          </div>
          <nav aria-label="Primary" className="flex flex-1 flex-col overflow-y-auto border-x border-k-line">
            {items.map((item, i) => (
              <button key={item.id} type="button" onClick={() => go(item)} className="flex items-baseline gap-4 border-b border-k-line px-5 py-5 text-left">
                <span className="k-label text-k-ink-3">0{i + 1}</span>
                <span className="k-title text-k-ink">{item.label}</span>
              </button>
            ))}
            <div className="flex flex-wrap gap-2 px-5 py-5" role="group" aria-label={c.nav.language}>
              {LOCALES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  lang={l.id}
                  aria-pressed={l.id === language}
                  aria-label={l.name}
                  onClick={() => setLanguage(l.id)}
                  className={`min-h-11 min-w-11 rounded-k-control border px-3 k-label ${l.id === language ? "border-k-accent text-k-accent-text" : "border-k-line text-k-ink-3"}`}
                >
                  {l.short}
                </button>
              ))}
              <button type="button" onClick={toggleTheme} aria-label={c.nav.theme} className="grid min-h-11 min-w-11 place-items-center rounded-k-control border border-k-line text-k-ink-3">
                <ThemeIcon size={14} aria-hidden />
              </button>
            </div>
          </nav>
          <div className="border-x border-b border-k-line p-5">
            <button type="button" onClick={() => { setMenuOpen(false); onPilot(); }} className="w-full rounded-k-control bg-k-accent px-5 py-3.5 k-label text-k-on-accent active:scale-[0.98]">
              {c.nav.pilot} →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
