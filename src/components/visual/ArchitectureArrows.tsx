"use client";

import React from "react";
import { motion } from "framer-motion";
import { kairmaEase } from "@/lib/animation";
import { siteCopy } from "@/data/site-copy";

export const ArchitectureArrows: React.FC = () => {
  const c = siteCopy.architecture;

  return (
    <div className="w-full h-full min-h-[320px] flex flex-col justify-between p-4 border border-theme-border bg-theme-void/30 rounded-sm select-none text-xs font-mono">
      
      {/* Node Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-8 my-auto relative">
        
        {/* CUSTOMER PREMISE (Local) */}
        <div className="w-full md:w-5/12 p-4 border border-theme-border bg-theme-void/85 rounded-sm relative flex flex-col gap-2.5">
          <div className="absolute top-0.5 left-2 text-[10px] text-theme-accent tracking-[0.18em] font-semibold font-mono uppercase">
            // LOCAL CHAMBER
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-theme-text mt-1 select-none">
            {c.premise.title}
          </h4>
          <div className="h-[1px] bg-theme-border my-1" />
          <div className="flex flex-col gap-1.5 text-xs text-theme-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
              <span className="font-bold text-theme-text">{c.premise.box}</span>
              <span className="text-xs opacity-75 font-mono px-1.5 py-0.5 border border-theme-border rounded-sm">{c.premise.specs}</span>
            </div>
            
            <div className="p-2 border border-dashed border-theme-border/60 bg-theme-void/40 rounded-xs mt-1">
              <div className="text-xs font-bold text-theme-accent uppercase flex items-center gap-1.5 tracking-[0.18em]">
                <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
                {c.premise.lakeTitle}
              </div>
              <div className="text-xs text-theme-text-muted mt-0.5">
                {c.premise.lakeDesc}
              </div>
            </div>

            <div className="flex flex-col gap-1 text-xs mt-1 pl-1.5 border-l border-theme-accent/35">
              <div>▸ {c.premise.engine}</div>
              <div>▸ {c.premise.router}</div>
              <div>▸ {c.premise.rpa}</div>
            </div>
          </div>
        </div>

        {/* CONNECTING ARROWS AREA */}
        <div className="flex-1 h-28 md:h-full w-full md:w-auto relative flex flex-col justify-center items-center gap-6 z-10">
          
          {/* Top Arrow: Tasks (Left-to-Right) */}
          <div className="w-full flex flex-col items-center gap-1.5 relative px-2">
            <div className="flex justify-between w-full text-[10px] text-theme-accent uppercase font-bold tracking-[0.18em]">
              <span className="invisible md:visible">ROUTE</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                {c.arrows.top}
              </motion.span>
              <span className="invisible md:visible">▲ TASK</span>
            </div>
            
            <svg className="w-full h-4 text-theme-accent" fill="none" preserveAspectRatio="none" viewBox="0 0 100 20">
              <motion.path
                d="M 5,10 L 95,10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: kairmaEase }}
              />
              <motion.polygon
                points="93,5 98,10 93,15"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.2 }}
              />
            </svg>
          </div>

          {/* Bottom Arrow: Lock (Right-to-Left block / Circular loop back) */}
          <div className="w-full flex flex-col items-center gap-1.5 relative px-2">
            <div className="flex justify-between w-full text-[10px] text-red-600 uppercase font-bold tracking-[0.18em]">
              <span className="invisible md:visible">RESTRICT</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
              >
                {c.arrows.bottom}
              </motion.span>
              <span className="invisible md:visible">■ LOCKED</span>
            </div>
            
            <svg className="w-full h-4 text-theme-chrome" fill="none" preserveAspectRatio="none" viewBox="0 0 100 20">
              <motion.path
                d="M 95,10 L 5,10"
                stroke="currentColor"
                strokeWidth="1.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: kairmaEase }}
              />
              <motion.polygon
                points="7,5 2,10 7,15"
                fill="currentColor"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.2 }}
              />
              {/* Lock sigil in the middle */}
              <rect x="46" y="2" width="8" height="16" fill="var(--theme-void)" stroke="currentColor" strokeWidth="1" />
              <line x1="50" y1="6" x2="50" y2="12" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* CLOUD MODELS (Remote) */}
        <div className="w-full md:w-5/12 p-4 border border-theme-border bg-theme-void/85 rounded-sm relative flex flex-col gap-2">
          <div className="absolute top-0.5 left-2 text-[10px] text-theme-text-muted tracking-[0.18em] font-semibold font-mono uppercase">
            // API LAYER
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-theme-text mt-1 select-none">
            {c.cloud.title}
          </h4>
          <div className="h-[1px] bg-theme-border my-1" />
          
          <div className="grid grid-cols-3 gap-1.5 text-xs text-theme-text font-mono font-bold select-none">
            {c.cloud.models.map((m, idx) => (
              <div 
                key={m} 
                className="py-1 px-1.5 border border-theme-border bg-theme-void/60 text-center rounded-xs hover:border-theme-accent transition-colors duration-200"
              >
                {m}
              </div>
            ))}
          </div>

          <div className="text-xs text-theme-text-muted mt-2 border-t border-theme-border/30 pt-1.5 font-mono">
            {c.cloud.desc}
          </div>
        </div>

      </div>

      {/* Source data never leaves the premise footer line */}
      <div className="border-t border-theme-border/60 pt-2 text-center text-xs text-theme-accent uppercase font-bold tracking-[0.18em] font-mono">
        ◆ {c.footer}
      </div>
    </div>
  );
};

export default ArchitectureArrows;
