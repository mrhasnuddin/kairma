"use client";

import React, { useEffect, useState } from "react";
import { guanCodex, GuanQuote } from "@/data/guan-codex";
import { useLanguage } from "@/lib/language";
import { motion, AnimatePresence } from "framer-motion";

export function GuanFrontispiece({ onComplete }: { onComplete: () => void }) {
  const [quote, setQuote] = useState<GuanQuote | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [step, setStep] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    // Pick a random quote
    const randomQuote = guanCodex[Math.floor(Math.random() * guanCodex.length)];
    setQuote(randomQuote);

    // Boot sequence steps
    const t1 = setTimeout(() => setStep(1), 500); // logo flickers in
    const t2 = setTimeout(() => setStep(2), 1500); // terminal types

    // Fade out after 4 seconds
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 4000);

    // Unmount after 5 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isVisible || !quote) return null;

  const isCjk = language === "zh-CN" || language === "zh-TW";
  const displayQuote = (isCjk && quote.original) ? quote.original : quote.quote;

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-theme-void transition-opacity duration-1000 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="max-w-3xl w-full px-8 md:px-12 text-center flex flex-col items-center z-10 relative mt-[-10vh]">
        {/* The Quote */}
        <p className="text-theme-text text-2xl md:text-4xl font-normal md:font-medium tracking-wide md:tracking-wider leading-relaxed md:leading-loose mb-8 md:mb-12 font-serif text-balance drop-shadow-sm">
          {displayQuote}
        </p>
        
        {/* Attribution & Label */}
        <div className="flex flex-col items-center gap-2 opacity-90 drop-shadow-sm">
          <p className="text-xs md:text-sm font-mono font-medium md:font-semibold text-theme-accent uppercase tracking-[0.2em] md:tracking-[0.3em]">
            — {quote.attribution}
          </p>
          <p className="text-[10px] md:text-xs font-mono font-medium text-theme-text-muted tracking-widest">
            观 · № 0{quote.chamber}
          </p>
        </div>
      </div>

      {/* Boot Sequence Overlay at bottom */}
      <div className="absolute bottom-16 md:bottom-24 left-0 right-0 flex flex-col items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {step >= 1 && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", times: [0, 0.4, 0.6, 1] }}
              className="w-32 md:w-48 h-8 md:h-12 bg-theme-text mb-6"
              style={{
                WebkitMaskImage: 'url(/kairma-logo.svg)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/kairma-logo.svg)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}
            />
          )}
        </AnimatePresence>

        <div className="h-8 flex items-center justify-center">
          <AnimatePresence>
            {step >= 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-[10px] md:text-sm tracking-widest text-theme-accent"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.05 }}
                >
                  {"INITIALIZING KAIRMA OS...".split("").map((char, i) => (
                    <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{char}</motion.span>
                  ))}
                </motion.span>
                <motion.span 
                  animate={{ opacity: [1, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 md:w-2 h-3 md:h-4 bg-theme-accent ml-1 md:ml-2 align-middle"
                />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
