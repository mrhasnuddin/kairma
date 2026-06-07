"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/lib/theme";

export const SealedBoxVisual: React.FC = () => {
  const { theme } = useTheme();
  
  // Custom easing matching brand rules
  const kairmaEase = [0.16, 1, 0.3, 1];

  return (
    <div className="relative w-full h-full min-h-[280px] flex items-center justify-center overflow-hidden bg-theme-void/25 border border-theme-border rounded-sm backdrop-blur-xs select-none">
      {/* Abstract orbital background lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <svg className="w-4/5 h-4/5 text-theme-chrome" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" />
          <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.25" />
          <path d="M 60,200 L 340,200" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2 10" />
          <path d="M 200,60 L 200,340" stroke="currentColor" strokeWidth="0.25" strokeDasharray="2 10" />
        </svg>
      </div>

      {/* Sealed Box Monolith */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Back glow shadow */}
        <motion.div 
          className="absolute w-36 h-36 rounded-full bg-theme-accent/5 blur-xl pointer-events-none"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* 3D-ish Etched Box Outline */}
        <div className="relative w-36 h-36 bg-theme-void/90 border-2 border-theme-chrome/40 rounded-sm shadow-2xl flex flex-col justify-between p-3 select-none">
          {/* Internal corner brackets inside the box */}
          <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-theme-accent/80" />
          <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-theme-accent/80" />
          <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-theme-accent/80" />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-theme-accent/80" />

          {/* Top panel: status text */}
          <div className="flex items-center justify-between text-[8px] font-mono tracking-widest text-theme-text-muted">
            <span>MODEL: KB-X86</span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-theme-accent animate-ping" />
              <span className="text-theme-accent">SEALED</span>
            </span>
          </div>

          {/* Center visual: Schrödinger's superposition sigil (abstract cat/box sigil) */}
          <div className="flex-1 flex items-center justify-center my-2 relative">
            <svg className="w-16 h-16 text-theme-text opacity-90" viewBox="0 0 100 100" fill="none">
              {/* Outer diamond */}
              <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" stroke="currentColor" strokeWidth="0.75" />
              {/* Inner circle */}
              <circle cx="50" cy="50" r="18" stroke="var(--theme-accent)" strokeWidth="0.75" strokeDasharray="3 3" />
              {/* Core void node */}
              <circle cx="50" cy="50" r="4" fill="currentColor" />
              {/* Cat sigil stylized subtle ears (architectural points) */}
              <path d="M 40,30 L 44,38 L 36,38 Z" fill="currentColor" opacity="0.8" />
              <path d="M 60,30 L 56,38 L 64,38 Z" fill="currentColor" opacity="0.8" />
              {/* Quantum superposition curves */}
              <path d="M 20,50 Q 50,20 80,50" stroke="currentColor" strokeWidth="0.25" opacity="0.5" />
              <path d="M 20,50 Q 50,80 80,50" stroke="currentColor" strokeWidth="0.25" opacity="0.5" />
            </svg>
          </div>

          {/* Bottom panel: Local Data indicators */}
          <div className="border-t border-theme-border/40 pt-1.5 flex justify-between text-[7px] font-mono tracking-tight text-theme-text-muted">
            <div className="flex flex-col">
              <span>DATA LAKE: LOCAL</span>
              <span>CIPHER: AES-256</span>
            </div>
            <div className="text-right flex flex-col justify-end">
              <span className="text-theme-accent font-bold">100% SECURE</span>
            </div>
          </div>
        </div>

        {/* Orbiting particles/indicator nodes (restrained, no excessive animation) */}
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-theme-accent"
          style={{ x: 0, y: 0 }}
          animate={{
            x: [90, 0, -90, 0, 90],
            y: [0, 90, 0, -90, 0],
            z: [0, 1, 0, -1, 0]
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute w-1.5 h-1.5 rounded-full bg-theme-chrome"
          style={{ x: 0, y: 0 }}
          animate={{
            x: [-75, 0, 75, 0, -75],
            y: [0, -75, 0, 75, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Telemetry captions inside panel */}
      <div className="absolute bottom-2 left-3 text-[8px] font-mono text-theme-text-muted opacity-80 flex flex-col select-none">
        <span>PREMISE APP: KAIRMA.EXE</span>
        <span>STATUS: STEADY STATE</span>
      </div>
      <div className="absolute bottom-2 right-3 text-[8px] font-mono text-theme-text-muted opacity-80 flex flex-col text-right select-none">
        <span>ANTENNA: DUPLEX_OFF</span>
        <span>TEMPLE_CLK: 1400mhz</span>
      </div>
    </div>
  );
};

export default SealedBoxVisual;
