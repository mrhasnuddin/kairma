"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { guanCodex, GuanQuote } from "@/data/guan-codex";
import { useLanguage } from "@/lib/language";
import { motion, AnimatePresence } from "framer-motion";

import { AsciiGlitchRipple } from "@/components/ui/ascii-glitch-ripple";


export function GuanFrontispiece({ onComplete }: { onComplete: () => void }) {
  const [quote, setQuote] = useState<GuanQuote | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [step, setStep] = useState(0);

  const triggerSkip = () => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 1000);
  };

  useEffect(() => {
    // Picking a random quote from the first 15 (indices 0 to 14) since we have 15 thumbnails generated
    const randomQuote = guanCodex[Math.floor(Math.random() * 15)];
    setQuote(randomQuote);

    // Boot sequence steps
    const t1 = setTimeout(() => setStep(1), 500); // logo flickers in
    const t2 = setTimeout(() => setStep(2), 1500); // terminal types

    // Fade out after 7 seconds to accommodate reading time
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 7000);

    // Unmount after 8 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 8000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isVisible || !quote) return null;

  return (
    <div 
      className={`fixed inset-0 z-[1000] flex flex-col items-center bg-theme-void transition-opacity duration-1000 overflow-y-auto ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-xl px-6 pt-12 pb-8 z-10 relative">
        {/* Thumbnail Image */}
        <div className="w-full aspect-square max-w-[300px] md:max-w-[360px] mx-auto bg-theme-void rounded-sm overflow-hidden mb-8 border border-theme-border/50 relative">
           <img 
              src={`/quotes/thumbnail/${quote.quoteNo.toString().padStart(2, '0')}.jpg`} 
              alt={`Quote ${quote.quoteNo}`} 
              className="absolute inset-0 w-full h-full object-cover" 
              onError={(e) => {
                // Fallback for when image isn't generated yet
                e.currentTarget.style.display = 'none';
              }}
           />
           {/* Scanline / Dither Overlay — sits on top of image, subtle */}
           <div 
             className="absolute inset-0 pointer-events-none opacity-[0.12]" 
             style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.4) 1px, rgba(0,0,0,0.4) 2px)' }} 
           />
           {/* Soft bottom fade */}
           <div className="absolute inset-0 bg-gradient-to-t from-theme-void/60 via-transparent to-transparent pointer-events-none" />
        </div>
        
        {/* Original Text */}
        {quote.original && (
          <p className="text-theme-text text-lg md:text-xl font-serif mb-4 leading-relaxed tracking-wide drop-shadow-sm text-center">
            <AsciiGlitchRipple as="span" dur={1000} autoPlay autoPlayDelay={400}>{quote.original}</AsciiGlitchRipple>
            <span className="inline-block ml-[2px] font-light animate-pulse">|</span>
          </p>
        )}
        
        {/* English */}
        <p className="text-theme-text-muted text-sm md:text-base font-serif mb-8 leading-relaxed drop-shadow-sm text-center">
           <AsciiGlitchRipple as="span" dur={1000} autoPlay autoPlayDelay={quote.original ? 1500 : 400}>{`English: ${quote.english}`}</AsciiGlitchRipple>
           {!quote.original && <span className="inline-block ml-[2px] font-light animate-pulse">|</span>}
        </p>
        
        {/* Source - Stylized Box */}
        <div className="text-theme-text-muted/70 text-xs md:text-sm font-mono mt-4 p-4 border border-theme-border/40 bg-theme-void/60 rounded-sm flex flex-col gap-2 relative mx-auto text-center items-center backdrop-blur-sm">
           <div className="absolute -top-[1px] -left-[1px] w-3 h-[1px] bg-theme-accent" />
           <div className="absolute -top-[1px] -left-[1px] w-[1px] h-3 bg-theme-accent" />
           <div className="absolute -bottom-[1px] -right-[1px] w-3 h-[1px] bg-theme-accent" />
           <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-3 bg-theme-accent" />
           
           <AsciiGlitchRipple 
             as="span"
             dur={1000} 
             autoPlay
             autoPlayDelay={quote.original ? 3000 : 2000}
           >
             {`SOURCE: ${quote.source}`}
           </AsciiGlitchRipple>
           <AsciiGlitchRipple 
             as="span"
             dur={1000} 
             autoPlay
             autoPlayDelay={quote.original ? 3200 : 2200}
           >
             {`ORIGIN: ${quote.language}`}
           </AsciiGlitchRipple>
        </div>
      </div>

      {/* Boot Sequence Overlay at bottom */}
      <div className="flex flex-col items-center justify-center w-full pb-12 shrink-0 pointer-events-none">
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
