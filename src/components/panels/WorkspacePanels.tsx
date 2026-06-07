"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { siteCopy } from "@/data/site-copy";
import PanelFrame from "./PanelFrame";
import Button from "../ui/Button";
import SealedBoxVisual from "../visual/SealedBoxVisual";
import ArchitectureArrows from "../visual/ArchitectureArrows";
import { useTheme } from "@/lib/theme";
import { kairmaEase } from "@/lib/animation";

// ==========================================
// 1. PERSISTENT PANELS
// ==========================================

interface HeroPanelProps {
  isCompact: boolean;
  onOpenPilot: () => void;
  onNavigateToGroup: (group: "problem" | "system" | "moats" | "story" | "begin") => void;
}

export const HeroPanel: React.FC<HeroPanelProps> = ({
  isCompact,
  onOpenPilot,
  onNavigateToGroup,
}) => {
  const c = siteCopy.hero;

  if (isCompact) {
    return (
      <PanelFrame
        title="KAIRMA OS"
        subtitle="IDENTITY_STRIP.SYS"
        status="active"
        terminalStyle={false}
        corners={true}
        className="h-full min-h-[120px]"
      >
        <div className="flex items-center justify-between h-full select-none py-1 px-1">
          <div className="flex flex-col justify-center gap-1">
            <h1 className="font-gothic text-3xl text-theme-text font-normal tracking-wide text-left font-blackletter">
              Kairma
            </h1>
            <p className="font-serif text-[11px] font-bold text-theme-text-muted leading-tight">
              {c.tagline}
            </p>
          </div>
          
          {/* Animated Gothic Sigil */}
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-theme-border bg-theme-void/60 rounded-xs relative">
            <svg className="w-6 h-6 text-theme-accent animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" />
              <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 50 50)" />
              <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 pointer-events-none border-[0.5px] border-theme-border/30 rounded-xs" />
          </div>
        </div>
      </PanelFrame>
    );
  }

  // Type: CTA Panel
  return (
    <PanelFrame
      title="HERO CORE"
      subtitle="SYSTEM_PROLOGUE.SH"
      terminalStyle={true}
      corners={true}
      status="active"
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-2 flex-1 min-h-[300px]">
        {/* Top Kicker */}
        <div className="text-xs md:text-sm font-mono text-theme-accent uppercase tracking-[0.18em] font-bold">
          {c.kicker}
        </div>

        {/* Main branding & Taglines */}
        <div className="my-auto flex flex-col gap-5 py-4">
          <h1 className="font-gothic text-6xl md:text-8xl text-theme-text font-normal tracking-wide text-left py-2 font-blackletter border-b border-theme-border/20 max-w-fit pr-8 select-all">
            Kairma
          </h1>

          <div className="flex flex-col gap-3 max-w-xl">
            <p className="font-serif text-3xl md:text-4xl font-bold tracking-tight text-theme-text leading-tight">
              {c.tagline}
            </p>
            <p className="font-mono text-xs md:text-sm uppercase tracking-[0.18em] text-theme-accent font-bold mt-2.5">
              ◆ {c.subTagline}
            </p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-theme-border/30 pt-4 mt-auto gap-4 font-mono">
          <div className="flex items-center gap-4">
            <Button 
              variant="primary" 
              size="md" 
              onClick={onOpenPilot}
              className="font-bold border-theme-accent"
            >
              {c.cta.begin}
            </Button>
            
            <Button 
              variant="outline" 
              size="md" 
              onClick={() => onNavigateToGroup("system")}
              className="font-semibold text-theme-text-muted"
            >
              [ {c.cta.architecture} ]
            </Button>
          </div>

          <div className="text-[10px] text-theme-text-muted tracking-widest animate-bounce mt-1.5 md:mt-0">
            {c.scrollText}
          </div>
        </div>
      </div>
    </PanelFrame>
  );
};

interface StatusPanelProps {
  activeGroups: string[];
  onToggleGroup: (group: any) => void;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({
  activeGroups,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const themeDisplay = theme === "matrix-dark" ? "matrix dark" : "korea light";

  // Type: Status Panel (Key/Value rows only, maximum 6 rows)
  return (
    <PanelFrame
      title="SYSTEM STATUS"
      subtitle="WORKSPACE_MONITOR.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none font-mono text-xs gap-4 min-h-[220px]">
        {/* Indicators List - 6 Rows Max */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b border-theme-border/20 pb-1.5">
            <span className="text-theme-text-muted uppercase tracking-wider">data mode</span>
            <span className="text-theme-text font-semibold">local</span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/20 pb-1.5">
            <span className="text-theme-text-muted uppercase tracking-wider">model route</span>
            <span className="text-theme-text font-semibold">cloud</span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/20 pb-1.5">
            <span className="text-theme-text-muted uppercase tracking-wider">raw data</span>
            <span className="text-red-500 font-bold tracking-wider">SEALED</span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/20 pb-1.5">
            <span className="text-theme-text-muted uppercase tracking-wider">active groups</span>
            <span className="text-theme-accent font-bold truncate max-w-[120px] text-right">
              {activeGroups.length === 0 ? "none" : activeGroups.join(" / ")}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-theme-border/20 pb-1.5">
            <span className="text-theme-text-muted uppercase tracking-wider">theme</span>
            <span className="text-theme-text uppercase font-semibold">{themeDisplay}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-theme-text-muted uppercase tracking-wider">clock</span>
            <span className="text-theme-text tabular-nums font-semibold">{timeStr || "12:00:00"}</span>
          </div>
        </div>

        {/* Actions switcher */}
        <div className="flex flex-col gap-2 mt-auto border-t border-theme-border/30 pt-3">
          <button
            onClick={toggleTheme}
            className="w-full py-1.5 px-3 border border-theme-border hover:border-theme-accent bg-theme-void/60 text-theme-text hover:text-theme-accent transition-colors duration-150 text-[10px] uppercase font-bold tracking-[0.18em] rounded-xs cursor-pointer text-center"
          >
            Toggle theme: {theme === "matrix-dark" ? "Matrix ↔ Korea" : "Korea ↔ Matrix"}
          </button>
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 2. GROUP: PROBLEM PANELS
// ==========================================

export const ProblemNumPanel: React.FC = () => {
  const cp = siteCopy.problem;
  const [statVal, setStatVal] = useState(0.0);

  useEffect(() => {
    let start = 0.0;
    const end = 1.5;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = progress * (2 - progress);
      const currentVal = start + easeProgress * (end - start);
      setStatVal(currentVal);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setStatVal(end);
      }
    };
    requestAnimationFrame(animate);
  }, []);

  // Type: Statement Panel (Headline + number + short line)
  return (
    <PanelFrame
      title="THE PROBLEM"
      subtitle="LABOR_SCALING_INEFFICIENCY.SYS"
      status="warning"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col justify-between h-full p-1 select-none gap-4">
        <div>
          <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
            {cp.title}
          </div>
          <h3 className="font-serif text-xl md:text-2xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            {cp.heading}
          </h3>
        </div>

        <div className="my-2 py-3 border-y border-theme-border/20">
          <div className="font-mono text-5xl md:text-6xl font-bold tracking-tighter text-red-500 tabular-nums">
            ${statVal.toFixed(1)}T
          </div>
          <div className="text-xs font-serif font-bold text-theme-text mt-1.5 uppercase tracking-wider">
            {cp.stat.label.split("burned")[0]} burned globally annually on operations labor.
          </div>
        </div>
      </div>
    </PanelFrame>
  );
};

export const PainPointsPanel: React.FC = () => {
  const cp = siteCopy.problem;
  const shortLabels = [
    "01 · PIPELINE_LEAKS.SYS",
    "02 · PLATFORM_SILOS.SYS",
    "03 · LINEAR_SCALING.SYS",
  ];
  const alertTypes = ["WARNING: LEAK", "ALERT: SILO", "ERROR: COST"];
  const alertColors = [
    "text-amber-500 border-amber-500/30",
    "text-orange-500 border-orange-500/30",
    "text-red-500 border-red-500/30",
  ];
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // Type: Diagram/Signal Panel (System-error strips, interactive click-to-expand details)
  return (
    <PanelFrame
      title="PAIN POINTS"
      subtitle="PIPELINE_LEAKAGES.SYS"
      status="warning"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col gap-2.5 font-mono text-xs p-1 select-none h-full justify-center">
        {cp.painPoints.map((point, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setExpandedIdx(idx)}
              onMouseLeave={() => setExpandedIdx(null)}
              onClick={() => setExpandedIdx(isExpanded ? null : idx)}
              className={`p-2.5 border rounded-xs transition-all duration-300 cursor-help flex flex-col gap-1 relative overflow-hidden bg-theme-void/50 ${
                isExpanded ? "border-theme-accent" : "border-theme-border/40"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 border rounded-sm ${alertColors[idx]}`}>
                  {alertTypes[idx]}
                </span>
                <span className="text-[10px] text-theme-text font-bold">
                  {shortLabels[idx]}
                </span>
              </div>
              <div className="text-[11px] text-theme-text-muted mt-1 leading-relaxed min-h-[16px] transition-opacity duration-150">
                {isExpanded ? point.split(" · ")[1] : "Click to decode telemetry..."}
              </div>
              <div className="absolute bottom-1 right-2 text-[7px] text-theme-text-muted/40 font-mono tracking-widest uppercase">
                {isExpanded ? "[DECODED]" : "[ENCRYPTED]"}
              </div>
            </div>
          );
        })}
      </div>
    </PanelFrame>
  );
};

export const WhyNowPanel: React.FC = () => {
  const cwn = siteCopy.whyNow;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const shortTitles = [
    "MODEL COST",
    "EDGE Inference",
    "SOVEREIGN LAW",
    "DEV SUBSIDY"
  ];

  const stats = [
    "1/20x",
    "10x CHPR",
    "MANDATE",
    "RECORD"
  ];

  // Type: Diagram/Signal Panel (2x2 grid of signals, interactive hover detail)
  return (
    <PanelFrame
      title="WHY NOW"
      subtitle="CONVERGING_CURVES_2026.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2">
        <div>
          <div className="text-xs text-theme-text-muted font-bold uppercase tracking-[0.18em] font-mono">
            {cwn.title}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-1 font-mono text-xs">
          {cwn.curves.map((curve, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={curve.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(isHovered ? null : idx)}
                className={`p-2 border rounded-xs transition-all duration-200 cursor-help flex flex-col justify-between min-h-[85px] relative overflow-hidden bg-theme-void/50 ${
                  isHovered ? "border-theme-accent" : "border-theme-border/60"
                }`}
              >
                <div className="flex justify-between items-center text-[9px] text-theme-accent font-bold tracking-[0.1em]">
                  <span>[{curve.num}]</span>
                  <span>{shortTitles[idx]}</span>
                </div>
                
                <div className="my-1 text-center">
                  <span className={`text-sm font-bold tracking-tighter ${isHovered ? "text-theme-accent" : "text-theme-text"}`}>
                    {isHovered ? "[READ]" : stats[idx]}
                  </span>
                </div>

                <div className="text-[9px] text-theme-text-muted leading-tight transition-opacity duration-150">
                  {isHovered ? curve.desc : curve.title}
                </div>

                <div className="absolute bottom-0.5 right-1 text-[6px] text-theme-text-muted/40 uppercase">
                  {isHovered ? "less" : "info"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PanelFrame>
  );
};

export const InsightPanel: React.FC = () => {
  const ci = siteCopy.insight;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Type: Diagram/Signal Panel (3 columns, interactive details)
  return (
    <PanelFrame
      title="THE INSIGHT"
      subtitle="MACRO_SOVEREIGNTY_MOATS.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2">
        <div>
          <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
            {ci.title}
          </div>
          <h3 className="font-serif text-base font-bold tracking-tight text-theme-text leading-tight mt-0.5">
            {ci.heading}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 my-1">
          {ci.insights.map((ins, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={ins.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(isHovered ? null : idx)}
                className={`p-2.5 border bg-theme-void/85 hover:border-theme-accent transition-all duration-200 rounded-xs flex flex-col justify-between min-h-[110px] relative font-mono cursor-help ${
                  isHovered ? "border-theme-accent" : "border-theme-border"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <div className="text-[9px] text-theme-accent font-bold tracking-[0.1em]">
                    INSIGHT_0{ins.num}
                  </div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.1em] text-theme-text border-b border-theme-border/20 pb-1">
                    {ins.title.split(" ").slice(0, 3).join(" ")}...
                  </h4>
                  <p className="text-[10px] text-theme-text-muted leading-tight mt-1 select-none">
                    {isHovered ? ins.desc : ins.title}
                  </p>
                </div>
                
                <div className="mt-1 text-[8px] text-theme-chrome uppercase tracking-[0.1em] font-bold">
                  <span className="opacity-55">ANCHOR:</span> {ins.anchor.split(" · ")[0]}
                </div>

                <div className="absolute bottom-1 right-1.5 text-[6px] text-theme-text-muted/40 uppercase">
                  {isHovered ? "close" : "details"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 3. GROUP: SYSTEM PANELS
// ==========================================

export const FourLayersPanel: React.FC = () => {
  const cwk = siteCopy.whatKairmaIs;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // Type: Diagram Panel (Stacked architecture block diagram, hover details)
  return (
    <PanelFrame
      title="WHAT KAIRMA IS"
      subtitle="MODULAR_COMPACT_OS_LAYERS.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2">
        <div>
          <div className="text-xs text-theme-text-muted font-bold uppercase tracking-[0.18em] font-mono">
            {cwk.title}
          </div>
        </div>

        {/* Stacked Architecture Block Diagram */}
        <div className="flex flex-col gap-1.5 my-1.5 select-none relative font-mono">
          {cwk.layers.map((layer, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={layer.id}
                onMouseEnter={() => setSelectedIdx(idx)}
                onMouseLeave={() => setSelectedIdx(null)}
                onClick={() => setSelectedIdx(isSelected ? null : idx)}
                className={`p-2 border transition-all duration-300 rounded-xs flex flex-col cursor-help relative group ${
                  isSelected 
                    ? "border-theme-accent bg-theme-accent/5 translate-x-1" 
                    : "border-theme-border bg-theme-void/70 hover:border-theme-accent/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-theme-accent border border-theme-border/60 px-1 py-0.2 rounded-xs select-none">
                      {layer.id}
                    </span>
                    <span className="text-[10px] font-bold text-theme-text uppercase tracking-[0.18em]">
                      {layer.title}
                    </span>
                  </div>
                  <span className="text-[8px] text-theme-text-muted/50 uppercase">
                    {isSelected ? "[DECODING]" : "[READ]"}
                  </span>
                </div>
                
                {isSelected && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="text-[10px] text-theme-text-muted mt-1.5 leading-relaxed pt-1 border-t border-theme-border/20"
                  >
                    {layer.desc}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-[9px] text-theme-accent font-mono uppercase tracking-[0.18em] pt-1 border-t border-theme-border/30 mt-auto select-none">
          ◆ {cwk.footer.split(".").slice(0, 2).join(".")}.
        </div>
      </div>
    </PanelFrame>
  );
};

export const ArchitecturePanel: React.FC = () => {
  // Type: Visual Asset/Diagram Panel
  return (
    <PanelFrame
      title="ARCHITECTURE"
      subtitle="ROUTING_MATRIX_OVERVIEW.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3">
        <div>
          <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
            § 05 · ARCHITECTURE
          </div>
        </div>

        <div className="my-1">
          <ArchitectureArrows />
        </div>
      </div>
    </PanelFrame>
  );
};

export const HowItWorksPanel: React.FC = () => {
  const chi = siteCopy.howItWorks;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Type: Diagram Panel (flywheel stages, hover/click details)
  return (
    <PanelFrame
      title="HOW IT WORKS"
      subtitle="COMPOUNDING_VALUE_FLYWHIEL.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2">
        <div>
          <div className="text-xs text-theme-text-muted font-bold uppercase tracking-[0.18em] font-mono">
            {chi.title}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-between gap-2 py-1 select-none relative z-10 my-1 font-mono">
          {chi.steps.map((step, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={step.num}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setHoveredIdx(isHovered ? null : idx)}
                className={`flex-1 flex flex-col items-center text-center p-2 border rounded-xs transition-all duration-200 cursor-help relative min-h-[85px] bg-theme-void ${
                  isHovered ? "border-theme-accent bg-theme-accent/5" : "border-theme-border/60"
                }`}
              >
                <div className="w-5 h-5 rounded-full border border-theme-border flex items-center justify-center text-theme-accent font-bold text-[9px] select-none">
                  {step.num}
                </div>
                <div className="text-[9px] font-bold text-theme-text uppercase mt-1 tracking-[0.1em]">
                  {step.name}
                </div>
                <div className="text-[9px] text-theme-text-muted mt-1 max-w-[110px] leading-tight select-none transition-opacity duration-150">
                  {isHovered ? step.desc : "[details]"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PanelFrame>
  );
};

export const LocalChamberPanel: React.FC = () => {
  // Type: Visual Asset Panel (1 main visual, 1 short caption)
  return (
    <PanelFrame
      title="LOCAL CHAMBER"
      subtitle="ON_PREMISE_HARDWARE.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex-1 flex flex-col justify-between p-1 gap-2">
        <SealedBoxVisual />
        <div className="text-[10px] text-theme-text-muted leading-relaxed px-0.5 font-mono select-none mt-1 text-center">
          Schrödinger Core: Data remains unobserved and fully secure locally.
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 4. GROUP: MOATS PANELS
// ==========================================

export const DefensibilitySummaryPanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  // Type: Statement Panel
  return (
    <PanelFrame
      title="DEFENSIBILITY SUMMARY"
      subtitle="MARKET_MOATS_OVERVIEW.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none gap-2">
        <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
          {cd.title}
        </div>
        <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight">
          {cd.heading}
        </h3>
        <p className="text-xs text-theme-text-muted font-mono leading-relaxed mt-1">
          KAIRMA OS defensive moats compound over operational cycles. Pure software represents shallow, leaking endpoints.
        </p>
      </div>
    </PanelFrame>
  );
};

export const SopEnginePanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[0];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="MOAT_01"
      subtitle="SOP_ENGINE_DATA_LAKE.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? moat.desc : "[click to decode details]"}
          </p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-1.5 text-[9px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

export const AgentLibraryPanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[1];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="MOAT_02"
      subtitle="AGENT_LIBRARY_TELEMETRY.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? moat.desc : "[click to decode details]"}
          </p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-1.5 text-[9px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

export const MsAlignmentPanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[2];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="MOAT_03"
      subtitle="MICROSOFT_ALIGNMENT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? moat.desc : "[click to decode details]"}
          </p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-1.5 text-[9px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

export const AssetLightHardwarePanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[3];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="MOAT_04"
      subtitle="ASSET_LIGHT_SHENZHEN.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? moat.desc : "[click to decode details]"}
          </p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-1.5 text-[9px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 5. GROUP: STORY PANELS
// ==========================================

export const Web3LabsPanel: React.FC = () => {
  const cs = siteCopy.story;
  const sec = cs.sections[0];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="ORIGIN_01"
      subtitle="PARENT_WEB3LABS_NETWORK.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold uppercase tracking-[0.18em]">{sec.kicker}</div>
          <h4 className="text-xs font-bold uppercase text-theme-text tracking-[0.18em]">{sec.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? sec.desc : "[click to decode parent lineage]"}
          </p>
        </div>
      </div>
    </PanelFrame>
  );
};

export const MicrosoftPanel: React.FC = () => {
  const cs = siteCopy.story;
  const sec = cs.sections[1];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="ORIGIN_02"
      subtitle="MICROSOFT_ALIGNMENT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold uppercase tracking-[0.18em]">{sec.kicker}</div>
          <h4 className="text-xs font-bold uppercase text-theme-text tracking-[0.18em]">{sec.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? sec.desc : "[click to decode parent lineage]"}
          </p>
        </div>
      </div>
    </PanelFrame>
  );
};

export const YZiLabsPanel: React.FC = () => {
  const cs = siteCopy.story;
  const sec = cs.sections[2];
  const [hovered, setHovered] = useState(false);
  // Type: Statement Panel with hover detail
  return (
    <PanelFrame
      title="ORIGIN_03"
      subtitle="BUILDER_COHORT_ALPHA.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div 
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered(!hovered)}
        className="flex flex-col h-full justify-between p-1 select-none gap-2 font-mono cursor-help"
      >
        <div className="flex flex-col gap-1">
          <div className="text-[9px] text-theme-accent font-bold uppercase tracking-[0.18em]">{sec.kicker}</div>
          <h4 className="text-xs font-bold uppercase text-theme-text tracking-[0.18em]">{sec.title}</h4>
          <p className="text-[10px] text-theme-text-muted leading-relaxed mt-0.5">
            {hovered ? sec.desc : "[click to decode parent lineage]"}
          </p>
        </div>
      </div>
    </PanelFrame>
  );
};

export const InMotionPanel: React.FC = () => {
  const cp = siteCopy.partners;
  // Type: Visual Asset Panel (1 main visual, 1 short caption)
  return (
    <PanelFrame
      title="ECOSYSTEM IN MOTION"
      subtitle="PARTNER_MARKS_PENDING.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3 font-mono">
        <div>
          <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em]">§ 09 · IN MOTION</div>
        </div>
        <div className="flex-1 flex items-center justify-center p-3 border border-dashed border-theme-border/60 bg-theme-void/35 my-1 min-h-[70px] relative">
          <span className="text-[9px] text-theme-text-muted tracking-[0.18em] font-bold uppercase">[ MARKS PENDING ]</span>
          <div className="absolute top-1 left-1 text-theme-border text-[8px]">+</div>
          <div className="absolute top-1 right-1 text-theme-border text-[8px]">+</div>
          <div className="absolute bottom-1 left-1 text-theme-border text-[8px]">+</div>
          <div className="absolute bottom-1 right-1 text-theme-border text-[8px]">+</div>
        </div>
        <p className="text-[9px] text-theme-text-muted leading-relaxed select-none text-center">
          {cp.heading}
        </p>
      </div>
    </PanelFrame>
  );
};

export const ProvenanceSummaryPanel: React.FC = () => {
  const cf = siteCopy.footer;
  // Type: Statement Panel
  return (
    <PanelFrame
      title="PROVENANCE SUMMARY"
      subtitle="ECOSYSTEM_PROVENANCE_STAT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none gap-2 font-mono">
        <div className="text-[9px] text-theme-accent font-bold uppercase tracking-widest">// INTEGRATION ROOT</div>
        <div className="p-2 border border-theme-border bg-theme-void/45 rounded-xs text-[10px] text-theme-text-muted leading-relaxed flex flex-col gap-1">
          <div>▸ {cf.provenance.spinOut}</div>
          <div className="h-[1px] bg-theme-border/20 my-0.5" />
          <div className="flex gap-2 text-[9px] text-theme-accent">
            {cf.provenance.partners.map((p) => (
              <div key={p}>▪ {p}</div>
            ))}
          </div>
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 6. GROUP: BEGIN PANELS
// ==========================================

interface BeginPanelProps {
  onOpenPilot: () => void;
}

export const BeginEnterprisePanel: React.FC<BeginPanelProps> = ({ onOpenPilot }) => {
  const cb = siteCopy.begin;
  const [showSpecs, setShowSpecs] = useState(false);

  // Type: CTA Panel (Headline + short body + button, specs toggled hidden)
  return (
    <PanelFrame
      title="ENTERPRISE DOOR"
      subtitle="SOVEREIGN_DEPLOYMENT_CHASSIS.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3 min-h-[190px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-theme-accent uppercase font-bold tracking-[0.18em] font-mono">
            {cb.enterprise.title}
          </span>
          <h3 className="font-serif text-base font-bold tracking-tight text-theme-text leading-tight mt-0.5">
            {cb.enterprise.subtitle}
          </h3>
          
          <button 
            onClick={() => setShowSpecs(!showSpecs)}
            className="text-left text-[9px] text-theme-accent uppercase font-mono tracking-widest mt-2 hover:underline cursor-pointer"
          >
            {showSpecs ? "Hide specifications ▲" : "Show specifications ▼"}
          </button>
          
          {showSpecs && (
            <ul className="flex flex-col gap-1 mt-2 font-mono text-[10px] text-theme-text-muted list-none pl-0">
              {cb.enterprise.features.map((feat) => (
                <li key={feat} className="flex items-start gap-1.5">
                  <span className="text-theme-accent font-bold">▪</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-auto border-t border-theme-border/30 pt-2 font-mono">
          <Button 
            variant="primary" 
            size="md" 
            onClick={onOpenPilot}
            className="font-bold border-theme-accent text-xs py-1.5"
          >
            {cb.enterprise.cta}
          </Button>
          <span className="text-[10px] text-theme-text-muted">
            email: <a href={`mailto:${cb.enterprise.email}`} className="text-theme-accent hover:underline">{cb.enterprise.email}</a>
          </span>
        </div>
      </div>
    </PanelFrame>
  );
};

export const BeginBuildersPanel: React.FC = () => {
  const cb = siteCopy.begin;
  const [showSpecs, setShowSpecs] = useState(false);

  // Type: CTA Panel (Headline + short body + button, specs toggled hidden)
  return (
    <PanelFrame
      title="BUILDER DOOR"
      subtitle="OPEN_SDK_COLLABORATION.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3 min-h-[190px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-theme-text-muted uppercase font-bold tracking-[0.18em] font-mono">
            {cb.builders.title}
          </span>
          <h3 className="font-serif text-base font-bold tracking-tight text-theme-text leading-tight mt-0.5">
            {cb.builders.subtitle}
          </h3>
          
          <button 
            onClick={() => setShowSpecs(!showSpecs)}
            className="text-left text-[9px] text-theme-chrome uppercase font-mono tracking-widest mt-2 hover:underline cursor-pointer"
          >
            {showSpecs ? "Hide specifications ▲" : "Show specifications ▼"}
          </button>
          
          {showSpecs && (
            <ul className="flex flex-col gap-1 mt-2 font-mono text-[10px] text-theme-text-muted list-none pl-0">
              {cb.builders.features.map((feat) => (
                <li key={feat} className="flex items-start gap-1.5">
                  <span className="text-theme-chrome/60 font-bold">▪</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-auto border-t border-theme-border/30 pt-2 font-mono">
          <a 
            href="https://discord.gg/kairma" 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-1.5 text-xs uppercase tracking-[0.18em] font-mono bg-transparent text-theme-text border border-theme-border hover:border-theme-accent hover:bg-theme-accent/5 transition-all duration-200 select-none rounded-xs flex items-center justify-center font-bold"
          >
            {cb.builders.cta}
          </a>
          <span className="text-[10px] text-theme-text-muted">
            GitHub: <a href={`https://${cb.builders.github}`} target="_blank" rel="noreferrer" className="text-theme-chrome hover:text-theme-accent hover:underline">{cb.builders.github}</a>
          </span>
        </div>
      </div>
    </PanelFrame>
  );
};

export const ClosingStatementPanel: React.FC = () => {
  const cc = siteCopy.closing;
  // Type: Statement Panel
  return (
    <PanelFrame
      title="CAUSAL TERMINATION"
      subtitle="ZEN_OPERATIONAL_STATEMENT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full items-center justify-center text-center p-3 gap-2 relative select-none min-h-[140px]">
        <div className="text-theme-accent text-xs font-mono select-none opacity-40">
          ◆ ───────────────────── ◆
        </div>
        <div className="flex flex-col gap-1 select-none">
          <p className="font-serif text-lg md:text-xl italic font-normal tracking-wide text-theme-text leading-relaxed">
            {cc.text}
          </p>
          <span className="font-mono text-[10px] text-theme-accent uppercase tracking-[0.18em] font-bold">
            {cc.sub}
          </span>
        </div>
        <div className="text-theme-accent text-xs font-mono select-none opacity-40">
          ◆ ───────────────────── ◆
        </div>
      </div>
    </PanelFrame>
  );
};

export const ContactPanel: React.FC = () => {
  const cf = siteCopy.footer;
  // Type: Statement Panel
  return (
    <PanelFrame
      title="CONTACT"
      subtitle="SYS_COMM_ROOT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none font-mono text-[11px] gap-1">
        <span className="text-theme-accent font-bold uppercase tracking-[0.18em]">// ROOT EMAIL</span>
        <a 
          href={`mailto:${cf.email}`} 
          className="text-xs text-theme-text font-bold hover:text-theme-accent transition-colors duration-150 mt-0.5"
        >
          {cf.email}
        </a>
        <div className="text-[9px] text-theme-text-muted mt-1">
          {cf.copyright}
        </div>
      </div>
    </PanelFrame>
  );
};

export const LocationsPanel: React.FC = () => {
  const cf = siteCopy.footer;
  // Type: Diagram Panel (horizontal cities node node row)
  return (
    <PanelFrame
      title="LOCATIONS"
      subtitle="GLOBAL_CHASSIS_NODES.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none font-mono text-[11px] gap-1">
        <span className="text-theme-accent font-bold uppercase tracking-[0.18em]">// NODES</span>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-0.5 text-[10px] text-theme-text-muted font-bold">
          {cf.locations.map((loc) => (
            <span key={loc} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
              {loc}
            </span>
          ))}
        </div>
      </div>
    </PanelFrame>
  );
};

export const ProvenancePanel: React.FC = () => {
  const cf = siteCopy.footer;
  // Type: Statement Panel
  return (
    <PanelFrame
      title="PROVENANCE"
      subtitle="SYSTEM_PROVENANCE_ROOT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none font-mono text-[11px] gap-1">
        <span className="text-theme-accent font-bold uppercase tracking-[0.18em]">// SPIN OUT</span>
        <div className="text-[10px] text-theme-text-muted leading-relaxed">
          {cf.provenance.spinOut} · {cf.provenance.partners.join(" · ")}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 7. MINI BEGIN CTA PANEL
// ==========================================

export const MiniBeginPanel: React.FC<BeginPanelProps> = ({ onOpenPilot }) => {
  // Type: CTA Panel
  return (
    <PanelFrame
      title="PILOT DEPLOYMENT"
      subtitle="BEGIN_CTAS_MINI.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-center"
    >
      <div className="flex flex-col justify-center items-center h-full p-2 select-none gap-2 text-center">
        <h4 className="font-serif text-base font-bold text-theme-text leading-tight">
          Ready to deploy a sovereign AI workforce?
        </h4>
        <Button 
          variant="primary" 
          size="md" 
          onClick={onOpenPilot}
          className="font-bold border-theme-accent text-xs px-5 py-1.5 cursor-pointer uppercase tracking-[0.18em] mt-1"
        >
          Request a Pilot →
        </Button>
      </div>
    </PanelFrame>
  );
};
