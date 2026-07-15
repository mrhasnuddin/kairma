"use client";

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { guanCodex, GuanQuote } from "@/data/guan-codex";
import { useLanguage } from "@/lib/language";
import { motion, AnimatePresence } from "framer-motion";

// Web Audio API synthesizer for clean mechanical typewriter sound clicks
let audioCtx: AudioContext | null = null;
let lastClickTime = 0;

function playKeystrokeClick() {
  if (typeof window === "undefined") return;

  const nowMs = Date.now();
  if (nowMs - lastClickTime < 65) return;
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

    const noiseBufferSize = ctx.sampleRate * 0.015;
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

  useEffect(() => {
    if (!cursor) return;
    const cursorInterval = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(cursorInterval);
  }, [cursor]);

  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  
  const { charData, charCount } = useMemo(() => {
    let count = 0;
    const data = tokens.map((token) => {
      if (/^\s+$/.test(token)) {
        return { isSpace: true, token, chars: [] };
      }
      const chars = token.split("").map((char) => {
        const idx = count++;
        return { char, idx };
      });
      return { isSpace: false, token, chars };
    });
    return { charData: data, charCount: count };
  }, [tokens]);

  useEffect(() => {
    if (charCount === 0) return;

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      const allIndices = Array.from({ length: charCount }, (_, i) => i);
      const shuffled = [...allIndices].sort(() => Math.random() - 0.5);
      let currentStep = 0;

      const charsPerStep = Math.max(3, Math.ceil(charCount / 20));
      const stepTime = Math.max(12, Math.floor(duration / Math.ceil(charCount / charsPerStep)));

      intervalId = setInterval(() => {
        if (currentStep < shuffled.length) {
          setRevealedIndices((prev) => {
            const next = new Set(prev);
            for (let k = 0; k < charsPerStep && currentStep < shuffled.length; k++) {
              next.add(shuffled[currentStep]);
              currentStep++;
            }
            return next;
          });
          playKeystrokeClick();
        } else {
          clearInterval(intervalId);
        }
      }, stepTime);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [charCount, duration, delay]);

  const getRandomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789§±!@#$%^&*()_+-=[]{}|;:,.<>?";
    return chars[Math.floor(Math.random() * chars.length)];
  };

  return (
    <span className="inline-block tracking-wide">
      {charData.map((tokenObj, tIdx) => {
        if (tokenObj.isSpace) {
          return <span key={tIdx}>{tokenObj.token}</span>;
        }
        return (
          <span key={tIdx} className="inline-block">
            {tokenObj.chars.map(({ char, idx }) => {
              const isRevealed = revealedIndices.has(idx);
              return (
                <span
                  key={idx}
                  className={`inline-block transition-colors duration-150 ${
                    isRevealed ? "text-inherit font-inherit" : "text-theme-accent font-light opacity-80 font-mono"
                  }`}
                >
                  {isRevealed ? char : getRandomChar()}
                </span>
              );
            })}
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
  // Random quote from bank
  const [quote] = useState<GuanQuote>(() => guanCodex[Math.floor(Math.random() * guanCodex.length)]);
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [step, setStep] = useState(0);

  const totalFrames = 201;
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(totalFrames + 1).fill(null));

  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const hasTriggeredComplete = useRef(false);

  const triggerEnterOS = useCallback(() => {
    if (hasTriggeredComplete.current) return;
    hasTriggeredComplete.current = true;
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 800);
  }, [onComplete]);

  // Preload frames sequence into memory
  useEffect(() => {
    let mounted = true;
    let count = 0;

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const paddedNum = i.toString().padStart(4, "0");
      img.src = `/videos/quote/frames/frame_${paddedNum}.webp`;

      img.onload = () => {
        if (!mounted) return;
        imagesRef.current[i] = img;
        count++;
        setLoadedCount(count);

        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      };

      img.onerror = () => {
        if (!mounted) return;
        count++;
        setLoadedCount(count);
      };
    }

    return () => {
      mounted = false;
    };
  }, [totalFrames]);

  // Scroll listener directly on fixed overflow container (`containerRef.current`)
  useEffect(() => {
    let animFrameId: number | null = null;
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      // Calculate scroll progress inside el (`overflow-y-auto`)
      const maxScroll = el.scrollHeight - el.clientHeight;
      if (maxScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, el.scrollTop / maxScroll));
      setScrollProgress(progress);

      const frameIdx = Math.max(1, Math.min(totalFrames, Math.floor(progress * (totalFrames - 1)) + 1));

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[frameIdx];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      });

      // When user scrolls all the way through the sequence (`>= 98%`), unlock and enter OS
      if (progress >= 0.98 && !hasTriggeredComplete.current) {
        triggerEnterOS();
      }
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [totalFrames, triggerEnterOS]);

  // Boot sequence steps for text/logo
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 400);
    const t2 = setTimeout(() => setStep(2), 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!isVisible || !quote) return null;

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-[1000] bg-theme-void transition-opacity duration-800 overflow-y-auto ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Scroll Runway Container */}
      <div className="w-full min-h-[320vh] relative">
        {/* Sticky Viewport Window */}
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between px-6 py-6 md:py-8 max-w-4xl mx-auto overflow-hidden">
          
          {/* Top Bar (Skip action only, "KAIRMA BOOT SEQUENCE" removed) */}
          <div className="w-full flex items-center justify-end z-20 shrink-0">
            <button
              onClick={triggerEnterOS}
              className="px-4 py-1.5 rounded-full border border-theme-border/40 bg-theme-void/80 hover:border-theme-accent hover:text-theme-accent text-theme-text font-mono text-[11px] uppercase tracking-wider transition-all duration-200 shadow-sm"
            >
              Skip to OS →
            </button>
          </div>

          {/* Main Content Area: Duotone Canvas Scrubber + Reduced & Differentiated Typography */}
          <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl py-2 z-10 relative">
            {/* Duotone Canvas Scrubber Container (Commanding primary focus size) */}
            <div className="thumb-duotone w-full aspect-square max-w-[340px] md:max-w-[440px] mx-auto rounded-3xl overflow-hidden mb-6 border border-theme-border/60 relative shadow-2xl flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={848}
                height={848}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Preloading Indicator */}
              {loadedCount < 40 && (
                <div className="absolute inset-0 bg-theme-void/90 backdrop-blur-sm flex flex-col items-center justify-center z-20 font-mono text-[10px] text-theme-accent gap-2">
                  <span>BUFFERING QUOTE STREAM... {Math.round((loadedCount / totalFrames) * 100)}%</span>
                </div>
              )}
            </div>
            
            {/* Quote Container: fixed min/max width & min height with structured left alignment */}
            <div className="w-full min-w-[300px] md:min-w-[440px] max-w-[480px] md:max-w-[560px] min-h-[100px] md:min-h-[120px] flex flex-col items-start justify-center gap-2 px-4 mx-auto border-l-2 border-theme-accent/40 pl-5 my-1">
              {quote.original && (
                <p className="text-theme-text text-sm md:text-base font-serif font-normal leading-relaxed tracking-normal drop-shadow-sm text-left w-full">
                  <ScrambleText text={quote.original} duration={550} delay={150} />
                </p>
              )}
              
              {/* English Translation / Language */}
              <p className="text-theme-text-muted/70 text-xs md:text-sm font-serif font-light italic leading-relaxed drop-shadow-sm text-left w-full">
                <ScrambleText 
                  text={quote.original ? `English ${quote.english}` : quote.english} 
                  duration={650} 
                  delay={quote.original ? 350 : 150} 
                  cursor={!quote.original} 
                />
              </p>
            </div>
          </div>

          {/* Boot Sequence Overlay & Ultra-Minimal Scroll Indicator at bottom */}
          <div className="flex flex-col items-center justify-center w-full shrink-0 pointer-events-none z-20 pb-2">
            <AnimatePresence mode="wait">
              {step >= 1 && (
                <motion.div
                  key="logo"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", times: [0, 0.4, 0.6, 1] }}
                  className="w-24 md:w-32 h-5 md:h-7 bg-theme-text mb-2"
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

            <div className="h-5 flex items-center justify-center mb-3">
              <AnimatePresence>
                {step >= 2 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-[10px] md:text-xs tracking-widest text-theme-accent"
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
                      className="inline-block w-1.5 h-3 bg-theme-accent ml-1.5 align-middle"
                    />
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Ultra-Minimal Scroll Progress Bar + % */}
            <div className="flex flex-col items-center gap-1.5 font-mono">
              <span className="text-[11px] md:text-xs text-theme-accent font-bold tracking-widest">
                {Math.round(scrollProgress * 100)}%
              </span>
              <div className="w-40 md:w-52 h-1 bg-theme-border/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-theme-accent transition-all duration-150 shadow-[0_0_6px_var(--theme-accent)]"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
