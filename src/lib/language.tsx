"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { siteTranslations, Language } from "@/data/site-translations";
import { SiteCopyType } from "@/data/site-copy";
import { siteTranslationsV4 } from "@/data/site-translations-v4";
import { SiteCopyTypeV4 } from "@/data/site-copy-v4";
import { siteTranslationsV6 } from "@/data/site-translations-v6";
import { SiteCopyTypeV6 } from "@/data/site-copy-v6";

export const LANGUAGE_KEY = "kairma-language";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (saved === "en" || saved === "zh-TW" || saved === "vi" || saved === "ms" || saved === "ko" || saved === "ja") {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

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
