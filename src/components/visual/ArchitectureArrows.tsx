"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { kairmaEase } from "@/lib/animation";
import { useSiteCopy } from "@/lib/language";

export const ArchitectureArrows: React.FC = () => {
  const siteCopy = useSiteCopy();
  const c = siteCopy.architecture;
  const [activeTab, setActiveTab] = useState<"lake" | "sop" | "cloud" | null>(null);

  return (
    <div className="w-full h-full min-h-[320px] flex flex-col justify-between p-4 border border-theme-border bg-theme-void/30 rounded-2xl select-none text-xs font-mono">
      
      {/* Node Layout */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-6 my-auto relative">
        
        {/* CUSTOMER PREMISE (Local) */}
        <div className="w-full md:w-5/12 p-3 border border-theme-border bg-theme-void/85 rounded-xl relative flex flex-col gap-2">
          <div className="absolute top-0.5 left-2 text-[9px] text-theme-accent tracking-[0.18em] font-semibold font-mono uppercase">
            // LOCAL
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text mt-1 select-none">
            {c.premise.title}
          </h4>
          <div className="h-[1px] bg-theme-border my-0.5" />
          <div className="flex flex-col gap-1.5 text-[11px] text-theme-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
              <span className="font-bold text-theme-text">{c.premise.box}</span>
              <span className="text-[9px] opacity-75 font-mono px-1 py-0.2 border border-theme-border rounded-md">{c.premise.specs}</span>
            </div>
            
            {/* Interactive Data Lake Node */}
            <div 
              onMouseEnter={() => setActiveTab("lake")}
              onMouseLeave={() => setActiveTab(null)}
              onClick={() => setActiveTab(activeTab === "lake" ? null : "lake")}
              className={`p-2 border rounded-lg cursor-help transition-all duration-200 ${
                activeTab === "lake" ? "border-theme-accent bg-theme-accent/5" : "border-dashed border-theme-border/60 bg-theme-void/40"
              }`}
            >
              <div className="text-[10px] font-bold text-theme-accent uppercase flex items-center gap-1.5 tracking-[0.1em]">
                <span className="w-1 h-1 rounded-full bg-red-600 animate-pulse" />
                {c.premise.lakeTitle}
              </div>
              <div className="text-[9px] text-theme-text-muted mt-0.5 leading-tight">
                {activeTab === "lake" ? c.premise.lakeDesc : "Click/hover to inspect..."}
              </div>
            </div>

            {/* Interactive SOP Node */}
            <div 
              onMouseEnter={() => setActiveTab("sop")}
              onMouseLeave={() => setActiveTab(null)}
              onClick={() => setActiveTab(activeTab === "sop" ? null : "sop")}
              className={`p-2 border rounded-lg cursor-help transition-all duration-200 ${
                activeTab === "sop" ? "border-theme-accent bg-theme-accent/5" : "border-theme-border bg-theme-void/40"
              }`}
            >
              <div className="text-[10px] font-bold text-theme-text uppercase tracking-[0.1em]">
                SOP ENGINE & RPA
              </div>
              <div className="text-[9px] text-theme-text-muted mt-0.5 leading-tight flex flex-col gap-0.5">
                {activeTab === "sop" ? (
                  <>
                    <span>▸ {c.premise.engine}</span>
                    <span>▸ {c.premise.router}</span>
                    <span>▸ {c.premise.rpa}</span>
                  </>
                ) : (
                  "Click/hover to check specs..."
                )}
              </div>
            </div>
          </div>
        </div>

        {/* CONNECTING ARROWS AREA */}
        <div className="flex-1 h-20 md:h-full w-full md:w-auto relative flex flex-col justify-center items-center gap-4 z-10">
          
          {/* Top Arrow: Tasks (Left-to-Right) */}
          <div className="w-full flex flex-col items-center gap-1 relative px-1">
            <div className="flex justify-between w-full text-[9px] text-theme-accent uppercase font-bold tracking-[0.1em]">
              <span className="invisible md:visible">ROUTE</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {c.arrows.top}
              </motion.span>
              <span className="invisible md:visible">▲</span>
            </div>
            
            <svg className="w-full h-3 text-theme-accent" fill="none" preserveAspectRatio="none" viewBox="0 0 100 20">
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
          <div className="w-full flex flex-col items-center gap-1 relative px-1">
            <div className="flex justify-between w-full text-[9px] text-red-600 uppercase font-bold tracking-[0.18em]">
              <span className="invisible md:visible">RESTRICT</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                LOCKED
              </motion.span>
              <span className="invisible md:visible">■</span>
            </div>
            
            <svg className="w-full h-3 text-theme-chrome" fill="none" preserveAspectRatio="none" viewBox="0 0 100 20">
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
        <div 
          onMouseEnter={() => setActiveTab("cloud")}
          onMouseLeave={() => setActiveTab(null)}
          onClick={() => setActiveTab(activeTab === "cloud" ? null : "cloud")}
          className={`w-full md:w-5/12 p-3 border bg-theme-void/85 rounded-xl relative flex flex-col gap-1.5 cursor-help transition-all duration-200 ${
            activeTab === "cloud" ? "border-theme-accent" : "border-theme-border"
          }`}
        >
          <div className="absolute top-0.5 left-2 text-[9px] text-theme-text-muted tracking-[0.1em] font-semibold font-mono uppercase">
            // API LAYER
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-theme-text mt-1 select-none">
            {c.cloud.title}
          </h4>
          <div className="h-[1px] bg-theme-border my-0.5" />
          
          <div className="grid grid-cols-3 gap-1 text-[10px] text-theme-text font-mono font-bold select-none">
            {c.cloud.models.map((m) => (
              <div 
                key={m} 
                className="py-0.5 border border-theme-border bg-theme-void/60 text-center rounded-md"
              >
                {m}
              </div>
            ))}
          </div>

          <div className="text-[9px] text-theme-text-muted mt-1 leading-tight font-mono select-none">
            {activeTab === "cloud" ? c.cloud.desc : "Click/hover to check routing..."}
          </div>
        </div>

      </div>

      {/* Source data never leaves the premise footer line */}
      <div className="border-t border-theme-border/60 pt-1.5 text-center text-[10px] text-theme-accent uppercase font-bold tracking-[0.18em] font-mono">
        ◆ DATA LOCAL · ROUTED TASKS
      </div>
    </div>
  );
};

export default ArchitectureArrows;
