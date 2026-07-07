"use client";

import React from "react";
import { useSiteCopyV6 } from "@/lib/language";

/** Height of the fixed footer layer AND of the scroll runway that uncovers
 *  it — the two must match for the curtain reveal to land exactly. */
export const FOOTER_REVEAL_HEIGHT = "100svh";

/**
 * Hermes-agent style reveal footer: a fixed layer sitting UNDER the content
 * curtain (z-0 vs the content wrapper's z-10). The page's final scroll
 * runway uncovers it — no JS, the parallax is pure layering.
 */
export const KairmaFooter: React.FC = () => {
  const siteCopy = useSiteCopyV6();

  // Same jump-and-flash behavior as the sticky nav's Apply.
  const requestPilot = () => {
    const el = document.getElementById("deploy");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("kairma-nav-flash", { detail: "deploy" }));
    }, 700);
  };

  return (
    <footer
      aria-label="Kairma"
      className="fixed bottom-0 inset-x-0 z-0 bg-theme-accent overflow-hidden transition-colors duration-500"
      style={{ height: FOOTER_REVEAL_HEIGHT }}
    >
      {/* Giant ghost wordmark behind the illustration (NOUS PORTAL analog). */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none">
        <div
          className="w-[min(82vw,1200px)] h-[42svh] bg-white opacity-[0.06]"
          style={{
            WebkitMaskImage: "url(/kairma-logo.svg)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/kairma-logo.svg)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
      </div>

      {/* Subtle CRT scanlines — lines only, low contrast. */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)",
        }}
      />

      {/* Center column: words · logo · description · CTA · illustration. */}
      <div className="relative z-10 h-full flex flex-col items-center pt-8 md:pt-12 px-6">
        {/* The three words — Canterbury (gothic). */}
        <div className="font-gothic text-xl md:text-2xl text-white/90 flex items-center gap-3 md:gap-4 text-center">
          <span>Cause</span>
          <span className="opacity-40 font-mono text-sm">|</span>
          <span>Effect</span>
          <span className="opacity-40 font-mono text-sm">|</span>
          <span>Acknowledged Debt</span>
        </div>

        {/* Kairma wordmark. */}
        <div
          className="mt-5 md:mt-7 h-10 md:h-14 w-[220px] md:w-[300px] bg-white"
          style={{
            WebkitMaskImage: "url(/kairma-logo.svg)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/kairma-logo.svg)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />

        {/* Headline — Gloock (serif). */}
        <h2 className="mt-4 md:mt-5 max-w-3xl text-center font-serif text-2xl md:text-[34px] leading-tight text-white">
          {siteCopy.hero_left.h1}
        </h2>

        {/* Short description — CourierPrime (mono). */}
        <p className="mt-3 max-w-xl text-center font-mono text-xs md:text-sm font-bold text-white/85 leading-relaxed uppercase tracking-wider">
          {siteCopy.hero_left.sub}
        </p>

        {/* CTA. */}
        <button
          onClick={requestPilot}
          className="mt-5 md:mt-6 bg-white text-theme-accent font-mono text-xs md:text-sm font-bold uppercase tracking-widest px-7 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          {siteCopy.hero_left.cta_1 || "Request a pilot →"}
        </button>

        {/* Placeholder illustration (duotone follows the theme accent). */}
        <div
          className="thumb-duotone relative mt-6 md:mt-8 rounded-2xl overflow-hidden shrink min-h-0"
          style={{ height: "min(40svh, 380px)", aspectRatio: "1 / 1" }}
        >
          <img src="/quotes/thumbnail/02.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Bottom-left: the closing line. */}
      <div className="absolute bottom-5 left-6 z-10 font-mono text-xs uppercase tracking-widest text-white/80 max-w-[50vw]">
        {siteCopy.footer.closing}
      </div>

      {/* Bottom-right: K mark + version. */}
      <div className="absolute bottom-5 right-6 z-10 flex flex-col items-center gap-1.5">
        <div
          className="w-8 h-8 bg-white"
          style={{
            WebkitMaskImage: "url(/Bentos/K.svg)",
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: "url(/Bentos/K.svg)",
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />
        <span className="font-mono text-xs uppercase tracking-widest text-white/80">
          Kairma OS v1.0
        </span>
      </div>
    </footer>
  );
};
