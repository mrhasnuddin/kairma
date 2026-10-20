"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { siteTranslations, Language } from "@/data/site-translations";
import { SiteCopyType } from "@/data/site-copy";
import { siteTranslationsV4 } from "@/data/site-translations-v4";
import { SiteCopyTypeV4 } from "@/data/site-copy-v4";
import { siteTranslationsV6 } from "@/data/site-translations-v6";
import { SiteCopyTypeV6 } from "@/data/site-copy-v6";
import { COPY_V7, type CopyV7 } from "@/data/site-copy-v7";
import { COPY_V8, type CopyV8 } from "@/data/site-copy-v8";

export const LANGUAGE_KEY = "kairma-language";

// Google Fonts family per CJK locale: Plex where IBM drew the script, Noto
// Sans TC for Traditional Chinese (Plex has no TC on Google Fonts).
const CJK_FONTS: Partial<Record<Language, string>> = {
  "zh-TW": "Noto+Sans+TC:wght@400..700",
  ja: "IBM+Plex+Sans+JP:wght@400;500;600",
  ko: "IBM+Plex+Sans+KR:wght@400;500;600",
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
      if (saved === "en" || saved === "zh-TW" || saved === "vi" || saved === "ms" || saved === "ko" || saved === "ja") {
        setLanguageState(saved);
      }
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Keep <html lang> in sync: screen readers pick pronunciation from it, and
  // the v4 type tokens use :lang() to choose region-correct CJK glyphs.
  // CJK locales also pull their Noto Sans face from Google Fonts here, once,
  // so latin-script visitors never download it.
  useEffect(() => {
    document.documentElement.lang = language;
    const family = CJK_FONTS[language];
    const id = `cjk-font-${language}`;
    if (!family || document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
    document.head.appendChild(link);
  }, [language]);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem(LANGUAGE_KEY, newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <div className={mounted ? "language-loaded" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useSiteCopy(): SiteCopyType {
  const { language } = useLanguage();
  return siteTranslations[language] || siteTranslations["en"];
}

export function useSiteCopyV4(): SiteCopyTypeV4 {
  const { language } = useLanguage();
  return siteTranslationsV4[language] || siteTranslationsV4["en"];
}

export function useSiteCopyV6(): SiteCopyTypeV6 {
  const { language } = useLanguage();
  return siteTranslationsV6[language] || siteTranslationsV6["en"];
}

export function useCopyV7(): CopyV7 {
  const { language } = useLanguage();
  return COPY_V7[language] || COPY_V7.en;
}

export function useCopyV8(): CopyV8 {
  const { language } = useLanguage();
  return COPY_V8[language] || COPY_V8.en;
}
