"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatedIconHandle } from "@/components/ui/types";

export interface MoatMetric {
  label: string;
  value: string;
  subtext?: string;
  change?: string;
}

export interface MoatItem {
  title: string;
  description: string;
  tag: string;
  Icon: React.ComponentType<{ ref?: React.Ref<AnimatedIconHandle>; size?: number; color?: string; className?: string }>;
  /** Optional artwork rendered as a theme-duotone backdrop. */
  image?: string;
  /** Terminal readout lines typed once when the panel activates. */
  readout?: string[];
  /** Quantitative performance metrics displayed in the Mini-Bento HUD on the right side. */
  metrics?: MoatMetric[];
}

const DEFAULT_MOAT_METRICS: MoatMetric[][] = [
  // 01 LOGIC
  [
    { label: "LOGIC RETENTION", value: "+340%", change: "+42%/RUN", subtext: "Compound intelligence gain" },
    { label: "ROUTING LATENCY", value: "< 12ms", change: "LIVE", subtext: "Deterministic execution check" },
    { label: "SELF-HEALING EDGE", value: "99.8%", change: "AUTO", subtext: "Automatic workflow correction" },
    { label: "CONTEXT CAPACITY", value: "2.4M", change: "EXPANDED", subtext: "Persistent task memory pool" },
  ],
  // 02 PEOPLE
  [
    { label: "AUTOMATED PIPELINE", value: "80.4%", change: "FDE SPEC", subtext: "Pre-built autonomous infra" },
    { label: "TIME-TO-DEPLOY", value: "4.2x Faster", change: "-76% TIME", subtext: "Vs traditional enterprise dev" },
    { label: "SQUAD CALIBRATION", value: "24/7 Live", change: "ACTIVE", subtext: "Continuous swarm alignment" },
    { label: "INTEGRATION DEPTH", value: "100% Core", change: "ZERO GAP", subtext: "Direct operational ownership" },
  ],
  // 03 DEPLOYMENT / MEMORY
  [
    { label: "SLA TARGET UPTIME", value: "99.99%", change: "TIER-1", subtext: "Multi-region active failover" },
    { label: "MODEL ARBITRAGE", value: "-42% Cost", change: "LIVE OPT", subtext: "Real-time model routing gains" },
    { label: "FLYWHEEL SPEED", value: "< 8ms Sync", change: "INSTANT", subtext: "Cross-run memory propagation" },
    { label: "COLD-START DELAY", value: "0 ms", change: "WARMED", subtext: "Persistent model context layer" },
  ],
  // 04 SOVEREIGNTY
  [
    { label: "DATA EXFILTRATION", value: "0 Bytes", change: "VERIFIED", subtext: "Complete air-gapped isolation" },
    { label: "AUDIT COMPLIANCE", value: "SOC2 / ISO", change: "SEALED", subtext: "Verifiable cryptographic trail" },
    { label: "LOCAL INFERENCE", value: "100% On-Prem", change: "SECURED", subtext: "Zero cloud telemetry leakage" },
    { label: "CRYPTO INTEGRITY", value: "SHA-256", change: "IMMUTABLE", subtext: "End-to-end sovereign vault" },
  ],
];

/* Backdrop mask: art lives top-right, fades to nothing toward the
   bottom-left where the copy sits. */
const ART_MASK =
  "linear-gradient(to bottom left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0) 78%)";

/* Static accent-tinted scanlines — surface texture, no motion. */
const SCANLINES =
  "repeating-linear-gradient(0deg, transparent 0px, transparent 3px, var(--theme-border) 3px, var(--theme-border) 4px)";

/** One-shot typewriter: mounted fresh each time its panel activates, types
 *  once, then rests. Near-instant under prefers-reduced-motion. */
const Readout: React.FC<{ lines: string[] }> = ({ lines }) => {
  const full = lines.join("\n");
  const [n, setN] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = reduced ? full.length : 2;
    let count = 0;
    const iv = setInterval(() => {
      count += step;
      setN(Math.min(count, full.length));
      if (count >= full.length) clearInterval(iv);
    }, 12);
    return () => clearInterval(iv);
  }, [full]);

  const done = n >= full.length;
  return (
    <pre className="font-mono text-xs leading-relaxed text-theme-text-muted/80 whitespace-pre-wrap">
      {full.slice(0, n)}
      <span
        className={`inline-block w-[7px] h-[13px] align-[-2px] bg-theme-accent ml-0.5 ${done ? "animate-pulse" : ""}`}
      />
    </pre>
  );
};

/**
 * Accordion Spotlight for the Four Moats section.
 * Intent-driven motion only: panels expand on hover/click/focus — no idle
 * loops, keeping this section a visual rest between the carousel and the
 * leaderboard canvas.
 */
export const MoatsAccordion: React.FC<{ items: MoatItem[] }> = ({ items }) => {
  const [active, setActive] = useState(0);
  const iconRefs = useRef<(AnimatedIconHandle | null)[]>([]);

  const activate = (idx: number) => {
    if (idx === active) return;
    iconRefs.current[active]?.stopAnimation?.();
    setActive(idx);
    iconRefs.current[idx]?.startAnimation?.();
  };

  return (
    <>
      {/* Desktop: horizontal accordion — active panel grows, others become spines. */}
      <div className="hidden md:flex items-stretch gap-3 h-full min-h-[340px] flex-1">
        {items.map((moat, idx) => {
          const isActive = idx === active;
          return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onMouseEnter={() => activate(idx)}
              onFocus={() => activate(idx)}
              onClick={() => activate(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") activate(idx);
              }}
              style={{ flexGrow: isActive ? 3.2 : 0.6, flexBasis: 0 }}
              className={`relative min-w-0 overflow-hidden rounded-2xl border bg-theme-void/80 backdrop-blur-sm cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-theme-accent transition-[flex-grow,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isActive
                  ? "border-theme-accent/70 bg-theme-accent/[0.04]"
                  : "border-theme-border/50 hover:border-theme-border"
              }`}
            >
              {/* Duotone artwork backdrop — follows the theme, masked away
                  from the copy. Opacity animates on the wrapper, so the
                  accent backdrop stays inside the compositing group and the
                  duotone holds during the transition. */}
              {moat.image && (
                <div
                  className={`thumb-duotone absolute inset-0 pointer-events-none transition-opacity duration-500 motion-reduce:transition-none ${
                    isActive ? "opacity-90" : "opacity-30"
                  }`}
                  style={{ WebkitMaskImage: ART_MASK, maskImage: ART_MASK }}
                >
                  <img src={moat.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Static CRT scanlines — terminal surface texture, no motion. */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                  isActive ? "opacity-40" : "opacity-20"
                }`}
                style={{ backgroundImage: SCANLINES }}
              />

              {/* Collapsed spine: number top, vertical title, icon bottom. */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-between py-5 transition-opacity duration-300 motion-reduce:transition-none ${
                  isActive ? "opacity-0 pointer-events-none" : "opacity-100 delay-150"
                }`}
              >
                <span className="font-mono text-xs font-bold text-theme-accent/70">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-text-muted [writing-mode:vertical-rl] whitespace-nowrap max-h-[200px] overflow-hidden">
                  {moat.title}
                </span>
                <span className="text-theme-text-muted">
                  <moat.Icon size={18} color="currentColor" />
                </span>
              </div>

              {/* Expanded content: Clean single-column layout (Number, Readout, Title + Copy, Tag) */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-7 transition-opacity duration-300 motion-reduce:transition-none ${
                  isActive ? "opacity-100 delay-200" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <span className="font-mono text-2xl font-bold text-theme-accent">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="w-10 h-10 rounded-xl border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center text-theme-accent shrink-0">
                    <moat.Icon
                      ref={(el: AnimatedIconHandle | null) => {
                        iconRefs.current[idx] = el;
                      }}
                      size={20}
                      color="var(--theme-accent)"
                    />
                  </span>
                </div>
                {/* Terminal readout */}
                {moat.readout && isActive && (
                  <div className="w-full">
                    <Readout lines={moat.readout} />
                  </div>
                )}
                <div className="w-full">
                  <h4 className="font-serif font-medium text-lg lg:text-xl text-theme-text mb-1.5 tracking-normal">
                    {moat.title}
                  </h4>
                  <p className="font-mono text-xs text-theme-text-muted leading-relaxed">
                    {moat.description}
                  </p>
                </div>
                <div className="font-mono text-xs tracking-widest uppercase font-bold text-theme-accent">
                  [ {moat.tag} ]
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical accordion — tap a row to expand it. */}
      <div className="md:hidden flex flex-col gap-2">
        {items.map((moat, idx) => {
          const isActive = idx === active;
          return (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              onClick={() => activate(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") activate(idx);
              }}
              className={`relative overflow-hidden rounded-2xl border bg-theme-void/80 cursor-pointer outline-none transition-colors duration-300 ${
                isActive ? "border-theme-accent/70 bg-theme-accent/[0.04]" : "border-theme-border/50"
              }`}
            >
              {moat.image && (
                <div
                  className={`thumb-duotone absolute inset-0 pointer-events-none transition-opacity duration-500 motion-reduce:transition-none ${
                    isActive ? "opacity-40" : "opacity-0"
                  }`}
                  style={{ WebkitMaskImage: ART_MASK, maskImage: ART_MASK }}
                >
                  <img src={moat.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="relative z-10 flex items-center gap-3 p-4 min-h-[52px]">
                <span className={`font-mono text-xs font-bold ${isActive ? "text-theme-accent" : "text-theme-accent/60"}`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className={`font-mono text-xs font-bold flex-1 truncate ${isActive ? "text-theme-accent" : "text-theme-text"}`}>
                  {moat.title}
                </span>
                <span className={isActive ? "text-theme-accent" : "text-theme-text-muted"}>
                  <moat.Icon size={18} color="currentColor" />
                </span>
              </div>
              <div
                className={`relative z-10 grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 flex flex-col gap-3">
                    {moat.readout && (
                      <pre className="font-mono text-xs leading-relaxed text-theme-text-muted/80 whitespace-pre-wrap">
                        {moat.readout.join("\n")}
                      </pre>
                    )}
                    <p className="font-mono text-xs text-theme-text-muted leading-relaxed">
                      {moat.description}
                    </p>
                    <div className="font-mono text-xs tracking-widest uppercase font-bold text-theme-accent">
                      [ {moat.tag} ]
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
