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
        <div className="flex flex-col justify-center h-full select-none gap-1 py-1 px-1">
          <h1 className="font-gothic text-3xl text-theme-text font-normal tracking-wide text-left font-blackletter">
            Kairma
          </h1>
          <p className="font-serif text-sm font-bold text-theme-text mt-0.5 leading-tight">
            {c.tagline}
          </p>
          <p className="font-mono text-[10px] text-theme-accent uppercase tracking-[0.18em] font-bold mt-1">
            {c.subTagline}
          </p>
        </div>
      </PanelFrame>
    );
  }

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
  onToggleGroup,
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
        {/* Indicators List */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center border-b border-theme-border/20 pb-1.5">
            <span className="text-theme-text-muted uppercase tracking-wider">KAIRMA OS</span>
            <span className="text-theme-accent font-bold">v1.0.0</span>
          </div>

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
            {cp.stat.label}
          </div>
        </div>
      </div>
    </PanelFrame>
  );
};

export const PainPointsPanel: React.FC = () => {
  const cp = siteCopy.problem;
  return (
    <PanelFrame
      title="PAIN POINTS"
      subtitle="PIPELINE_LEAKAGES.SYS"
      status="warning"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col gap-3 font-mono text-xs md:text-sm p-1 select-none h-full justify-center">
        {cp.painPoints.map((point, idx) => (
          <div
            key={idx}
            className="p-3 border border-theme-border/40 bg-theme-void/45 rounded-xs hover:border-theme-accent transition-colors duration-200"
          >
            {point}
          </div>
        ))}
      </div>
    </PanelFrame>
  );
};

export const WhyNowPanel: React.FC = () => {
  const cwn = siteCopy.whyNow;
  return (
    <PanelFrame
      title="WHY NOW"
      subtitle="CONVERGING_CURVES_2026.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3">
        <div>
          <div className="text-xs text-theme-text-muted font-bold uppercase tracking-[0.18em] font-mono">
            {cwn.title}
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            {cwn.heading}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-2 my-1.5">
          {cwn.curves.map((curve) => (
            <div
              key={curve.num}
              className="p-2.5 border border-theme-border/80 bg-theme-void/50 hover:border-theme-accent transition-colors duration-200 rounded-xs flex flex-col gap-0.5"
            >
              <div className="text-xs font-mono font-bold text-theme-accent uppercase flex items-center gap-1.5 tracking-[0.18em]">
                <span className="opacity-60">[{curve.num}]</span>
                {curve.title}
              </div>
              <div className="text-[11px] text-theme-text-muted leading-relaxed font-mono mt-0.5">
                {curve.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelFrame>
  );
};

export const InsightPanel: React.FC = () => {
  const ci = siteCopy.insight;
  return (
    <PanelFrame
      title="THE INSIGHT"
      subtitle="MACRO_SOVEREIGNTY_MOATS.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3">
        <div>
          <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
            {ci.title}
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            {ci.heading}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-1.5">
          {ci.insights.map((ins) => (
            <div
              key={ins.num}
              className="p-3 border border-theme-border bg-theme-void/85 hover:border-theme-accent transition-all duration-200 rounded-xs flex flex-col justify-between gap-3 font-mono"
            >
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] text-theme-accent font-bold font-mono tracking-[0.18em]">
                  INSIGHT_0{ins.num}
                </div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-theme-text border-b border-theme-border/20 pb-1.5">
                  {ins.title}
                </h4>
                <p className="text-[11px] text-theme-text-muted leading-relaxed">
                  {ins.desc}
                </p>
              </div>
              
              <div className="mt-2 border-t border-dashed border-theme-border/40 pt-1.5 text-[10px] text-theme-accent uppercase tracking-[0.18em] font-bold">
                <span className="opacity-55 font-normal">ANCHOR:</span> {ins.anchor}
              </div>
            </div>
          ))}
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
  return (
    <PanelFrame
      title="WHAT KAIRMA IS"
      subtitle="MODULAR_COMPACT_OS_LAYERS.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3">
        <div>
          <div className="text-xs text-theme-text-muted font-bold uppercase tracking-[0.18em] font-mono">
            {cwk.title}
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            {cwk.heading}
          </h3>
        </div>

        <div className="flex flex-col gap-2 my-1.5">
          {cwk.layers.map((layer) => (
            <div
              key={layer.id}
              className="p-2.5 border border-theme-border bg-theme-void/70 hover:border-theme-accent transition-all duration-200 rounded-xs flex items-center gap-2.5 relative group"
            >
              <div className="text-xs font-mono font-bold text-theme-accent border border-theme-border/60 px-1.5 py-0.5 rounded-sm select-none">
                {layer.id}
              </div>
              <div className="flex-1 flex flex-col font-mono text-[11px] md:text-xs">
                <span className="font-bold text-theme-text uppercase tracking-[0.18em]">
                  {layer.title}
                </span>
                <span className="text-theme-text-muted mt-0.5 leading-relaxed">
                  {layer.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-theme-accent font-bold uppercase tracking-[0.18em] pt-1.5 border-t border-theme-border/30 mt-auto">
          ◆ {cwk.footer}
        </div>
      </div>
    </PanelFrame>
  );
};

export const ArchitecturePanel: React.FC = () => {
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
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            Data local. Models cloud. Tasks routed.
          </h3>
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
  return (
    <PanelFrame
      title="HOW IT WORKS"
      subtitle="COMPOUNDING_VALUE_FLYWHIEL.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-3">
        <div>
          <div className="text-xs text-theme-text-muted font-bold uppercase tracking-[0.18em] font-mono">
            {chi.title}
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            {chi.heading}
          </h3>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4 py-2 select-none relative z-10 my-2">
          {chi.steps.map((step) => (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center font-mono select-none relative">
              <div className="w-8 h-8 rounded-full border border-theme-border bg-theme-void flex items-center justify-center text-theme-accent font-bold text-[11px] select-none hover:border-theme-accent transition-colors duration-150">
                {step.num}
              </div>
              <div className="text-xs font-bold text-theme-text uppercase mt-2 tracking-[0.18em]">
                {step.name}
              </div>
              <div className="text-[11px] text-theme-text-muted mt-1 max-w-[130px] leading-relaxed select-none">
                {step.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PanelFrame>
  );
};

export const LocalChamberPanel: React.FC = () => {
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
        <div className="text-[11px] text-theme-text-muted leading-relaxed px-0.5 font-mono select-none mt-2">
          Schrödinger Superposition: Data remains unobserved and fully secure locally inside the hardware chassis.
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
  return (
    <PanelFrame
      title="DEFENSIBILITY SUMMARY"
      subtitle="MARKET_MOATS_OVERVIEW.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2">
        <div>
          <div className="text-xs text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
            {cd.title}
          </div>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-1">
            {cd.heading}
          </h3>
        </div>
        <div className="text-xs text-theme-text-muted font-mono leading-relaxed mt-2 p-3 border border-theme-border/40 bg-theme-void/35 rounded-xs">
          KAIRMA OS defensive moats compound over operational cycles. Pure-software SaaS layers represent shallow, highly-leaking endpoints, whereas local edge alignment locked on-premise compounds faster.
        </div>
      </div>
    </PanelFrame>
  );
};

export const SopEnginePanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[0];
  return (
    <PanelFrame
      title="MOAT_01"
      subtitle="SOP_ENGINE_DATA_LAKE.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{moat.desc}</p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-2 text-[10px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

export const AgentLibraryPanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[1];
  return (
    <PanelFrame
      title="MOAT_02"
      subtitle="AGENT_LIBRARY_telemetry.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{moat.desc}</p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-2 text-[10px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

export const MsAlignmentPanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[2];
  return (
    <PanelFrame
      title="MOAT_03"
      subtitle="MICROSOFT_ALIGNMENT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{moat.desc}</p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-2 text-[10px] text-theme-chrome/80 font-semibold mt-auto">
          {moat.comparison}
        </div>
      </div>
    </PanelFrame>
  );
};

export const AssetLightHardwarePanel: React.FC = () => {
  const cd = siteCopy.defensibility;
  const moat = cd.moats[3];
  return (
    <PanelFrame
      title="MOAT_04"
      subtitle="ASSET_LIGHT_SHENZHEN.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-theme-accent font-bold tracking-[0.18em]">MOAT_0{moat.num}</div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-theme-text">{moat.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{moat.desc}</p>
        </div>
        <div className="border-t border-dashed border-theme-border/40 pt-2 text-[10px] text-theme-chrome/80 font-semibold mt-auto">
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
  return (
    <PanelFrame
      title="ORIGIN_01"
      subtitle="PARENT_WEB3LABS_NETWORK.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] text-theme-accent font-bold uppercase tracking-[0.18em]">{sec.kicker}</div>
          <h4 className="text-sm font-bold uppercase text-theme-text tracking-[0.18em]">{sec.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{sec.desc}</p>
        </div>
      </div>
    </PanelFrame>
  );
};

export const MicrosoftPanel: React.FC = () => {
  const cs = siteCopy.story;
  const sec = cs.sections[1];
  return (
    <PanelFrame
      title="ORIGIN_02"
      subtitle="MICROSOFT_ALIGNMENT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] text-theme-accent font-bold uppercase tracking-[0.18em]">{sec.kicker}</div>
          <h4 className="text-sm font-bold uppercase text-theme-text tracking-[0.18em]">{sec.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{sec.desc}</p>
        </div>
      </div>
    </PanelFrame>
  );
};

export const YZiLabsPanel: React.FC = () => {
  const cs = siteCopy.story;
  const sec = cs.sections[2];
  return (
    <PanelFrame
      title="ORIGIN_03"
      subtitle="BUILDER_COHORT_ALPHA.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2.5 font-mono">
        <div className="flex flex-col gap-1.5">
          <div className="text-[10px] text-theme-accent font-bold uppercase tracking-[0.18em]">{sec.kicker}</div>
          <h4 className="text-sm font-bold uppercase text-theme-text tracking-[0.18em]">{sec.title}</h4>
          <p className="text-xs text-theme-text-muted leading-relaxed mt-0.5">{sec.desc}</p>
        </div>
      </div>
    </PanelFrame>
  );
};

export const InMotionPanel: React.FC = () => {
  const cp = siteCopy.partners;
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
          <p className="text-xs text-theme-text-muted mt-1.5 leading-relaxed">{cp.heading}</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-3 border border-dashed border-theme-border/60 bg-theme-void/35 my-1 min-h-[70px] relative">
          <span className="text-[10px] text-theme-text-muted tracking-[0.18em] font-bold uppercase">[ ECOSYSTEM MARKS PENDING ]</span>
          <div className="absolute top-1 left-1 text-theme-border text-[8px]">+</div>
          <div className="absolute top-1 right-1 text-theme-border text-[8px]">+</div>
          <div className="absolute bottom-1 left-1 text-theme-border text-[8px]">+</div>
          <div className="absolute bottom-1 right-1 text-theme-border text-[8px]">+</div>
        </div>
      </div>
    </PanelFrame>
  );
};

export const ProvenanceSummaryPanel: React.FC = () => {
  const cf = siteCopy.footer;
  return (
    <PanelFrame
      title="PROVENANCE SUMMARY"
      subtitle="Ecosystem_PROVENANCE_STAT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-2 font-mono">
        <div className="text-[10px] text-theme-accent font-bold uppercase tracking-widest">// INTEGRATION ROOT</div>
        <div className="p-3 border border-theme-border bg-theme-void/45 rounded-xs text-xs text-theme-text-muted leading-relaxed flex flex-col gap-2">
          <div>▸ {cf.provenance.spinOut}</div>
          <div className="h-[1px] bg-theme-border/20 my-0.5" />
          <div className="flex flex-col gap-1 pl-2 border-l border-theme-accent/35 text-[11px]">
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
  return (
    <PanelFrame
      title="ENTERPRISE DOOR"
      subtitle="SOVEREIGN_DEPLOYMENT_CHASSIS.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-4 min-h-[220px]">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-theme-accent uppercase font-bold tracking-[0.18em] font-mono">
            {cb.enterprise.title}
          </span>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-0.5">
            {cb.enterprise.subtitle}
          </h3>
          
          <ul className="flex flex-col gap-1.5 mt-3 font-mono text-xs text-theme-text-muted list-none pl-0">
            {cb.enterprise.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2">
                <span className="text-theme-accent font-bold">▪</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-auto border-t border-theme-border/30 pt-3 font-mono">
          <Button 
            variant="primary" 
            size="md" 
            onClick={onOpenPilot}
            className="font-bold border-theme-accent text-xs"
          >
            {cb.enterprise.cta}
          </Button>
          <span className="text-[11px] text-theme-text-muted mt-1.5 sm:mt-0">
            or email: <a href={`mailto:${cb.enterprise.email}`} className="text-theme-accent hover:underline">{cb.enterprise.email}</a>
          </span>
        </div>
      </div>
    </PanelFrame>
  );
};

export const BeginBuildersPanel: React.FC = () => {
  const cb = siteCopy.begin;
  return (
    <PanelFrame
      title="BUILDER DOOR"
      subtitle="OPEN_SDK_COLLABORATION.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full justify-between p-1 select-none gap-4 min-h-[220px]">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-theme-text-muted uppercase font-bold tracking-[0.18em] font-mono">
            {cb.builders.title}
          </span>
          <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-0.5">
            {cb.builders.subtitle}
          </h3>
          
          <ul className="flex flex-col gap-1.5 mt-3 font-mono text-xs text-theme-text-muted list-none pl-0">
            {cb.builders.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2">
                <span className="text-theme-chrome/60 font-bold">▪</span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-auto border-t border-theme-border/30 pt-3 font-mono">
          <a 
            href="https://discord.gg/kairma" 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 text-xs uppercase tracking-[0.18em] font-mono bg-transparent text-theme-text border border-theme-border hover:border-theme-accent hover:bg-theme-accent/5 transition-all duration-200 select-none rounded-xs flex items-center justify-center font-bold"
          >
            {cb.builders.cta}
          </a>
          <span className="text-[11px] text-theme-text-muted mt-1.5 sm:mt-0">
            or visit: <a href={`https://${cb.builders.github}`} target="_blank" rel="noreferrer" className="text-theme-chrome hover:text-theme-accent hover:underline">{cb.builders.github}</a>
          </span>
        </div>
      </div>
    </PanelFrame>
  );
};

export const ClosingStatementPanel: React.FC = () => {
  const cc = siteCopy.closing;
  return (
    <PanelFrame
      title="CAUSAL TERMINATION"
      subtitle="ZEN_OPERATIONAL_STATEMENT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col h-full items-center justify-center text-center p-3 gap-4 relative select-none min-h-[140px]">
        <div className="text-theme-accent text-xs font-mono select-none opacity-60">
          ◆ ───────────────────── ◆
        </div>
        <div className="flex flex-col gap-2 select-none">
          <p className="font-serif text-xl md:text-2xl italic font-normal tracking-wide text-theme-text leading-relaxed">
            {cc.text}
          </p>
          <span className="font-mono text-xs text-theme-accent uppercase tracking-[0.18em] font-bold">
            {cc.sub}
          </span>
        </div>
        <div className="text-theme-accent text-xs font-mono select-none opacity-60">
          ◆ ───────────────────── ◆
        </div>
      </div>
    </PanelFrame>
  );
};

export const ContactPanel: React.FC = () => {
  const cf = siteCopy.footer;
  return (
    <PanelFrame
      title="CONTACT"
      subtitle="SYS_COMM_ROOT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none font-mono text-xs gap-1.5">
        <span className="text-theme-accent font-bold uppercase tracking-[0.18em]">// ROOT EMAIL</span>
        <a 
          href={`mailto:${cf.email}`} 
          className="text-sm text-theme-text font-bold hover:text-theme-accent transition-colors duration-150 mt-1"
        >
          {cf.email}
        </a>
        <div className="text-[10px] text-theme-text-muted mt-2">
          {cf.copyright}
        </div>
      </div>
    </PanelFrame>
  );
};

export const LocationsPanel: React.FC = () => {
  const cf = siteCopy.footer;
  return (
    <PanelFrame
      title="LOCATIONS"
      subtitle="GLOBAL_CHASSIS_NODES.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none font-mono text-xs gap-1.5">
        <span className="text-theme-accent font-bold uppercase tracking-[0.18em]">// OPERATIONAL HUBS</span>
        <div className="grid grid-cols-2 gap-2 mt-1 text-xs text-theme-text-muted font-bold">
          {cf.locations.map((loc) => (
            <span key={loc} className="flex items-center gap-1.5">
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
  return (
    <PanelFrame
      title="PROVENANCE"
      subtitle="SYSTEM_PROVENANCE_ROOT.SYS"
      status="idle"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full justify-center p-1 select-none font-mono text-xs gap-1.5">
        <span className="text-theme-accent font-bold uppercase tracking-[0.18em]">// SPIN OUT PATH</span>
        <div className="text-xs text-theme-text-muted leading-relaxed">
          {cf.provenance.spinOut}
        </div>
        <div className="text-[10px] text-theme-chrome/80 mt-1">
          {cf.provenance.partners.join(" · ")}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 7. MINI BEGIN CTA PANEL
// ==========================================

export const MiniBeginPanel: React.FC<BeginPanelProps> = ({ onOpenPilot }) => {
  return (
    <PanelFrame
      title="PILOT DEPLOYMENT"
      subtitle="BEGIN_CTAS_MINI.SYS"
      status="active"
      terminalStyle={true}
      corners={true}
      className="h-full flex flex-col justify-center"
    >
      <div className="flex flex-col justify-center items-center h-full p-2 select-none gap-3 text-center">
        <h4 className="font-serif text-base font-bold text-theme-text leading-tight">
          Ready to deploy a sovereign AI workforce?
        </h4>
        <Button 
          variant="primary" 
          size="md" 
          onClick={onOpenPilot}
          className="font-bold border-theme-accent text-xs px-6 py-2 cursor-pointer uppercase tracking-[0.18em]"
        >
          Request a Pilot →
        </Button>
      </div>
    </PanelFrame>
  );
};
