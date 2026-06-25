"use client";

import React, { useState } from "react";
import VoidBackground from "../visual/VoidBackground";
import GothicGrid from "../visual/GothicGrid";
import { StickyNav } from "./StickyNav";
import { BentoGrid, BentoBox } from "./Bento";

// Placeholder for the sections we are building
const HeroBento = () => (
  <BentoBox className="col-span-1 md:col-span-3 lg:col-span-4 h-[60vh] md:h-[80vh] flex flex-col items-center justify-center relative bg-black/40">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-10" />
    <h1 className="text-4xl md:text-7xl font-gothic text-[#1FAA68] mb-4 z-20">KAIRMA OS</h1>
    <p className="text-sm md:text-base font-mono tracking-widest text-[#1FAA68]/70 z-20 uppercase">
      The AI workforce for cross-border brands
    </p>
  </BentoBox>
);

const ShiftBento = () => (
  <BentoBox className="col-span-1 md:col-span-3 lg:col-span-4 p-8 md:p-16 flex flex-col justify-center min-h-[40vh]" withGlow>
    <h2 className="text-3xl md:text-5xl font-mono font-bold uppercase tracking-tighter mb-6 text-white max-w-4xl leading-tight">
      The paradigm has shifted. Your employees are bound to no single mind.
    </h2>
    <p className="font-mono text-sm md:text-lg text-[#C0C0C8]/70 max-w-2xl">
      $1.5T burned globally every year on cross-border brand operations labor. The window closes Q4 2027.
    </p>
  </BentoBox>
);

const FoundryBento = () => (
  <BentoBox className="col-span-1 md:col-span-2 lg:col-span-2 h-[50vh] p-6 flex flex-col overflow-hidden relative" withGlow>
    <div className="flex justify-between items-center mb-6">
      <h3 className="font-mono font-bold uppercase tracking-widest text-white">THE FOUNDRY</h3>
      <div className="w-2 h-2 rounded-full bg-[#1FAA68] animate-pulse" />
    </div>
    <p className="font-mono text-xs text-[#1FAA68] mb-4 uppercase">Live OpenRouter Leaderboard</p>
    <div className="flex-1 overflow-y-auto no-scrollbar border-t border-[#C0C0C8]/20 pt-4">
      <div className="flex flex-col gap-2">
        {["Claude 3.5 Sonnet", "GPT-4o", "DeepSeek Coder", "Qwen Max"].map((model, i) => (
          <div key={model} className="flex justify-between font-mono text-sm p-3 hover:bg-[#1FAA68]/10 border border-transparent hover:border-[#1FAA68]/30 transition-all cursor-pointer">
            <span className={i === 0 ? "text-[#1FAA68]" : "text-[#C0C0C8]"}>{model}</span>
            <span className="text-[#C0C0C8]/50">#{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  </BentoBox>
);

const OsArchitectureBento = () => (
  <BentoBox className="col-span-1 md:col-span-1 lg:col-span-2 h-[50vh] p-6" withGlow>
    <h3 className="font-mono font-bold uppercase tracking-widest text-white mb-2">THE OS</h3>
    <p className="font-mono text-xs text-[#C0C0C8]/60 mb-6 uppercase">Architecture Diagram</p>
    <div className="w-full h-full border border-[#C0C0C8]/10 bg-black/20 flex items-center justify-center">
      <span className="font-mono text-[#1FAA68]/40">[ DIAGRAM STUB ]</span>
    </div>
  </BentoBox>
);

const BeliefBento = () => (
  <BentoBox mode="xuan" className="col-span-1 md:col-span-3 lg:col-span-4 p-8 md:p-24 flex flex-col items-center text-center">
    <h2 className="text-3xl md:text-5xl font-serif italic mb-8 max-w-3xl leading-snug">
      We believe the spark, <br/>re-cast as data.
    </h2>
    <p className="font-sans text-lg max-w-2xl opacity-80 leading-relaxed">
      Whoever encodes an operating playbook into machine workflow owns the customer. The brand methodology is the moat.
    </p>
  </BentoBox>
);

const GalleryBento = () => (
  <>
    <BentoBox mode="xuan" className="col-span-1 md:col-span-2 h-[40vh] md:h-[60vh] bg-[#af3621]/5 group cursor-pointer relative overflow-hidden p-0">
      <img src="/gallery_creation_adam.png" alt="Creation of Adam PCB" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f3eee7] via-[#f3eee7]/90 to-transparent translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="font-serif italic font-bold text-xl">Sacred Circuitry I</p>
        <p className="font-mono text-xs uppercase mt-2 opacity-60">after Michelangelo, c.1512</p>
      </div>
    </BentoBox>
    <BentoBox mode="xuan" className="col-span-1 md:col-span-2 h-[40vh] md:h-[60vh] bg-[#af3621]/5 group cursor-pointer relative overflow-hidden p-0">
      <img src="/gallery_dunhuang_apsara.png" alt="Dunhuang Apsara PCB" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f3eee7] via-[#f3eee7]/90 to-transparent translate-y-[120%] group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <p className="font-serif italic font-bold text-xl">Dunhuang Apsara</p>
        <p className="font-mono text-xs uppercase mt-2 opacity-60">Circuit intaglio, c.Tang Dynasty</p>
      </div>
    </BentoBox>
  </>
);

export const SiteShellV2: React.FC = () => {
  return (
    <div className="w-full min-h-[100dvh] bg-theme-void relative font-mono text-theme-text overflow-x-hidden">
      <VoidBackground className="fixed inset-0 pointer-events-none" />
      <GothicGrid opacity={0.05} />

      <main className="relative z-10 w-full flex flex-col gap-24 pb-32">
        {/* ZONE 1: MATRIX MODE */}
        <section id="os" className="w-full pt-4 md:pt-6">
          <BentoGrid>
            <HeroBento />
            <ShiftBento />
            <OsArchitectureBento />
            <FoundryBento />
          </BentoGrid>
        </section>

        {/* ZONE 2: XUAN MODE */}
        <section id="museum" className="w-full py-24 bg-[#f3eee7] transition-colors duration-1000">
          <BentoGrid>
            <BeliefBento />
            <GalleryBento />
          </BentoGrid>
        </section>
        
        {/* ZONE 3: DISPATCHES (MATRIX) */}
        <section id="dispatches" className="w-full py-24">
          <BentoGrid>
            <BentoBox className="col-span-1 md:col-span-3 lg:col-span-4 p-12 text-center" withGlow>
              <h2 className="text-3xl font-mono font-bold uppercase tracking-widest mb-4">Dispatches</h2>
              <p className="text-[#C0C0C8]/60 mb-8">Where the guild gathers.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {[1,2,3].map(i => (
                  <div key={i} className="aspect-[3/4] bg-black/40 border border-[#C0C0C8]/20 rounded-xl flex items-center justify-center group cursor-pointer hover:border-[#1FAA68]/50 transition-all">
                     <span className="text-xs uppercase opacity-40 group-hover:text-[#1FAA68] group-hover:opacity-100 transition-colors">[ POSTER {i} ]</span>
                  </div>
                ))}
              </div>
            </BentoBox>
          </BentoGrid>
        </section>
      </main>

      <StickyNav />
    </div>
  );
};

export default SiteShellV2;
