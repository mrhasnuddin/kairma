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
}

const ScrambleText: React.FC<ScrambleTextProps> = ({ text, duration = 2500, delay = 200 }) => {
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  // Split text into tokens (words and spaces)
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const wordIndices = useMemo(() => {
    return tokens.map((t: string, i: number) => (t.trim().length > 0 ? i : -1)).filter((i: number) => i !== -1);
  }, [tokens]);

  const revealOrder = useMemo(() => {
    const shuffled = [...wordIndices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [wordIndices]);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    let lastRevealedCount = 0;
    const totalWords = wordIndices.length;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      if (elapsed < delay) {
        animationFrameId = requestAnimationFrame(step);
        return;
      }

      const activeElapsed = elapsed - delay;
      const progress = Math.min(activeElapsed / duration, 1);
      const wordsToReveal = Math.floor(progress * totalWords);

      if (wordsToReveal > lastRevealedCount) {
        // play click for each new word revealed
        const newlyRevealedCount = wordsToReveal - lastRevealedCount;
        for (let i = 0; i < newlyRevealedCount; i++) {
          playKeystrokeClick();
        }

        setRevealedIndices(prev => {
          const next = new Set(prev);
          for (let i = 0; i < wordsToReveal; i++) {
            next.add(revealOrder[i]);
          }
          return next;
        });
        lastRevealedCount = wordsToReveal;
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [duration, delay, revealOrder, wordIndices.length]);

  return (
    <span>
      {tokens.map((token: string, i: number) => {
        const isWord = wordIndices.includes(i);
        const isRevealed = revealedIndices.has(i);
        return (
          <span
            key={i}
            className={isWord ? "transition-opacity duration-75" : ""}
            style={{ opacity: isWord ? (isRevealed ? 1 : 0) : 1 }}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
};


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

    // Fade out after 4.5 seconds to accommodate the full typing animation length
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 4500);

    // Unmount after 5.5 seconds
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!isVisible || !quote) return null;

  const isCjk = language === "zh-TW";
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
          <ScrambleText text={displayQuote} duration={2500} delay={400} />
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
