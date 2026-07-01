"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteCopyV6 } from "@/lib/language";

export const BulletinCarousel: React.FC = () => {
  const siteCopy = useSiteCopyV6();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // =========================================================================
  // POSTER DESIGN & REPLACEMENT INSTRUCTIONS FOR BULLETIN BOARD:
  // 
  // 1. Recommended Box Aspect Ratio: 4:5 (Portrait / Vertical Poster Ratio)
  //    - Why? In Desktop grid, the card width is ~300px and height stretches to ~360px (5:6 or 4:5 ratio).
  //    - In Mobile, it expands to full width (~350px x 430px). 
  //    - Designing at 4:5 ratio guarantees zero awkward cropping on both devices!
  //
  // 2. Recommended Resolution to Design: 800 x 1000 px (or 1080 x 1350 px)
  //
  // 3. How to Replace Placeholders:
  //    - Put your designed poster images into the `/public/posters/` or `/public/Bentos/` folder.
  //    - Update the `image` property for each slide below with your new filename (e.g., "/posters/poster-1.png").
  //    - If your posters already have built-in typography and text, set `title: ""` and `body: ""` below to hide the text overlay!
  // =========================================================================

  const slides = [
    {
      id: 1,
      tag: "BULLETIN 01",
      title: siteCopy.panel_keep.h || "Data local. Models cloud. Only tasks route.",
      body: siteCopy.panel_keep.body || "The Keep — your sealed runtime. Brand data never leaves. SOP engine · model router · RPA / API.",
      image: "/quotes/thumbnail/01.jpg",
    },
    {
      id: 2,
      tag: "BULLETIN 02",
      title: "Sovereign AI Runtime",
      body: "Zero-data leakage architecture. Your custom models run within your enterprise VPC and private infrastructure.",
      image: "/quotes/thumbnail/03.jpg",
    },
    {
      id: 3,
      tag: "BULLETIN 03",
      title: "Multi-Model Routing",
      body: "Dynamically dispatch reasoning tasks across Claude, OpenAI, DeepSeek, and locally fine-tuned Llama models.",
      image: "/quotes/thumbnail/16.jpg",
    },
    {
      id: 4,
      tag: "BULLETIN 04",
      title: "Automated SOP Engine",
      body: "Codify complex operational procedures into autonomous digital employees that execute seamlessly 24/7/365.",
      image: "/quotes/thumbnail/17.jpg",
    },
    {
      id: 5,
      tag: "BULLETIN 05",
      title: "Enterprise RPA & API",
      body: "Seamlessly bridge legacy software interfaces with modern agentic AI workflows and event-driven triggers.",
      image: "/quotes/thumbnail/18.jpg",
    },
  ];

  // Auto-advance loop every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, slides.length]);

  return (
    <div 
      className="relative w-full h-full min-h-[300px] md:min-h-[340px] overflow-hidden select-none group bg-theme-void"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CRT Scanlines Overlay (slightly reduced intensity and opacity) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] opacity-10 pointer-events-none z-30" />
      
      {/* CRT Scanning Bar */}
      <motion.div 
        className="absolute inset-0 h-[80px] bg-gradient-to-b from-transparent via-theme-accent/10 to-transparent pointer-events-none z-30 mix-blend-screen"
        initial={{ top: "-80px" }}
        animate={{ top: "100%" }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Top Left Badge: Bulletin Tag */}
      <div className="absolute top-3 left-3 z-40 flex items-center gap-2 px-3 py-1 rounded border border-theme-accent/60 bg-theme-void/95 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse shadow-[0_0_6px_var(--color-theme-accent)]" />
        <span className="font-mono text-[10px] text-theme-accent font-bold uppercase tracking-widest">
          {slides[currentSlide].tag}
        </span>
      </div>

      {/* Top Right Badge: Slide Counter */}
      <div className="absolute top-3 right-3 z-40 px-2.5 py-1 rounded border border-white/30 bg-black/90 backdrop-blur-md font-mono text-[10px] text-white font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Slide Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Poster Image */}
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Terminal Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black/90 backdrop-blur-md border-t border-white/20 px-3.5 flex items-center justify-between z-40 font-mono text-[10px] select-none shadow-[0_-4px_12px_rgba(0,0,0,0.8)]">
        {/* Left: Terminal Prompt & Status */}
        <div className="flex items-center gap-1.5 text-theme-accent font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse shrink-0 shadow-[0_0_6px_var(--color-theme-accent)]" />
          <span>{">"} SYS.FEED // LIVE</span>
        </div>

        {/* Right: ASCII Block Pagination */}
        <div className="flex items-center gap-0.5">
          <span className="text-white/30 mr-1">[</span>
          {slides.map((_, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 px-0.5 py-0.5 rounded cursor-pointer outline-none text-xs flex items-center justify-center ${
                  isActive
                    ? "text-theme-accent scale-110 drop-shadow-[0_0_6px_var(--color-theme-accent)] animate-pulse"
                    : "text-white/40 hover:text-white"
                }`}
                aria-label={`Go to bulletin slide ${idx + 1}`}
              >
                {isActive ? "■" : "□"}
              </button>
            );
          })}
          <span className="text-white/30 ml-1">]</span>
        </div>
      </div>
    </div>
  );
};
