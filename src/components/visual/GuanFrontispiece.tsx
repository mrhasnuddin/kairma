"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { guanCodex, GuanQuote } from "@/data/guan-codex";
import { useLanguage } from "@/lib/language";
import { motion, AnimatePresence } from "framer-motion";

// Web Audio API synthesizer for clean mechanical typewriter sound clicks (0kb downloads, works offline)
let audioCtx: AudioContext | null = null;
let lastClickTime = 0;

function playKeystrokeClick() {
  if (typeof window === "undefined") return;

  const nowMs = Date.now();
  if (nowMs - lastClickTime < 65) return; // Throttle to maintain typewriter rhythm and avoid digital clipping
  lastClickTime = nowMs;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    const ctx = audioCtx;
    const now = ctx.currentTime;

    // 1. High frequency mechanical tap (noise snap)
    const noiseBufferSize = ctx.sampleRate * 0.015; // 15ms transient
    const noiseBuffer = ctx.createBuffer(1, noiseBufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1500 + Math.random() * 400, now);
    noiseFilter.Q.setValueAtTime(6, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Platen housing impact body (low frequency resonance)
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(140 + Math.random() * 30, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.035);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.12, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noiseSource.start(now);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch (e) {
    console.warn("AudioContext failed to initialize:", e);
  }
}

interface ScrambleTextProps {
  text: string;
  duration?: number;
  delay?: number;
  cursor?: boolean;
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, duration = 2500, delay = 200, cursor = true }) => {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [showCursor, setShowCursor] = useState(cursor);

  // Blinking cursor effect
  useEffect(() => {
    if (!cursor) return;
    const cursorInterval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(cursorInterval);
  }, [cursor]);

  // Split text into tokens (words and spaces)
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  
  // Assign a global index to every non-space character
  const { charData, charCount } = useMemo(() => {
    let globalCharIndex = 0;
    const data = tokens.map((token: string) => {
      if (token.trim().length === 0) {
        return { isWord: false, token, chars: [] };
      }
      const chars = token.split("").map((char: string) => {
        const index = globalCharIndex++;
        return { char, index };
      });
      return { isWord: true, token, chars };
    });
    return { charData: data, charCount: globalCharIndex };
  }, [tokens]);

  useEffect(() => {
    const indices = Array.from({ length: charCount }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const revealOrder = indices;
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    let lastRevealedCount = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      if (elapsed < delay) {
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      const activeElapsed = elapsed - delay;
      const progress = Math.min(activeElapsed / duration, 1);
      const charsToReveal = Math.floor(progress * charCount);

      if (charsToReveal > lastRevealedCount) {
        setRevealedIndices(prev => {
          const next = new Set(prev);
          for (let i = 0; i < charsToReveal; i++) {
            next.add(revealOrder[i]);
          }
          return next;
        });
        lastRevealedCount = charsToReveal;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [duration, delay, charCount]);

  return (
    <span>
      {charData.map((group, i) => {
        if (!group.isWord) {
          return <span key={i}>{group.token}</span>;
        }
        return (
          <span key={i} className="whitespace-nowrap">
            {group.chars.map((c) => (
              <span
                key={c.index}
                className="transition-opacity duration-75"
                style={{ opacity: revealedIndices.has(c.index) ? 1 : 0 }}
              >
                {c.char}
              </span>
            ))}
          </span>
        );
      })}
      {cursor && (
        <span 
          className={`inline-block ml-[2px] font-light transition-opacity duration-75 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
        >
          |
        </span>
      )}
    </span>
  );
};


export function GuanFrontispiece({ onComplete }: { onComplete: () => void }) {
  const [quote] = useState<GuanQuote>(() => guanCodex[Math.floor(Math.random() * 15)]);
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
         <div className="thumb-duotone w-full aspect-square max-w-[300px] md:max-w-[360px] mx-auto rounded-2xl overflow-hidden mb-8 border border-theme-border/50 relative shadow-xl">
            <img 
               src={`/quotes/thumbnail/${quote.quoteNo.toString().padStart(2, '0')}.jpg`} 
               alt={`Quote ${quote.quoteNo}`} 
               className="absolute inset-0 w-full h-full object-cover" 
               onError={(e) => {
                 // Fallback for when image isn't generated yet
                 e.currentTarget.style.display = 'none';
               }}
            />
         </div>
        
        {/* Original Text */}
        {quote.original && (
          <p className="text-theme-text text-lg md:text-xl font-serif mb-4 leading-relaxed tracking-wide drop-shadow-sm text-center">
            <ScrambleText text={quote.original} duration={1500} delay={400} />
          </p>
        )}
        
        {/* English */}
        <p className="text-theme-text-muted text-sm md:text-base font-serif mb-8 leading-relaxed drop-shadow-sm text-center">
           <ScrambleText text={`English: ${quote.english}`} duration={2000} delay={quote.original ? 1500 : 400} cursor={!quote.original} />
        </p>
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
