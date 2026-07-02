"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Cpu,
  Zap,
  Database,
  AlertTriangle,
  ChevronRight,
  FileText,
  DollarSign,
} from "lucide-react";

interface ModelData {
  id: string;
  name: string;
  score: number;
  context_length: number;
  modality: string;
  pricing: { prompt: string; completion: string };
  description: string;
  benchmarks?: {
    intelligence_index?: number;
    coding_index?: number;
    agentic_index?: number;
    [key: string]: number | undefined;
  };
  provider?: string;
  model_id?: string;
  max_output?: number;
  ttft?: number;
  throughput?: number;
  reliability?: string;
  use_cases?: string[];
  verdict?: string;
}

interface NeuralPipelineHUDProps {
  models: ModelData[];
  onSelectModelForModal: (model: ModelData) => void;
  language: string;
  t: (key: string) => string;
}

type DataGroupId = "market_intel" | "coding_dev" | "agentic_auto" | "daily_runtimes" | "cost_nano" | "max_context" | "search_query";

interface DataGroupConfig {
  id: DataGroupId;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

// Hacker ASCII cipher character set
const CIPHER_CHARS = "01#$@%&*<>?/\\[]{}=+-~^0xABCDEF";

const useDecryptedText = (targetText: string, trigger: any, speed: number = 20) => {
  const [display, setDisplay] = useState(targetText);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = targetText.length * 2;
    const interval = setInterval(() => {
      setDisplay((prev) =>
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 2) {
              return targetText[index];
            }
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join("")
      );
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplay(targetText);
      }
      iteration += 1;
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, trigger, speed]);

  return display;
};

export default function NeuralPipelineHUD({
  models,
  onSelectModelForModal,
  language,
  t,
}: NeuralPipelineHUDProps) {
  const [activeGroup, setActiveGroup] = useState<DataGroupId>("market_intel");
  const [searchQuery, setSearchQuery] = useState("");
  const [isParsing, setIsParsing] = useState(false);

  const dataGroups: DataGroupConfig[] = useMemo(
    () => [
      {
        id: "market_intel",
        label: t("intel") || "Market Intelligence",
        desc: "High reasoning, complex math & logic leaders",
        icon: <FileText size={16} className="text-theme-accent" />,
      },
      {
        id: "coding_dev",
        label: t("coding") || "Coding & Dev Ops",
        desc: "Code generation, syntax lints & repo refactoring",
        icon: <Code size={16} className="text-theme-accent" />,
      },
      {
        id: "agentic_auto",
        label: t("agentic") || "Agentic Autonomy",
        desc: "Multi-step tool calling & autonomous workflows",
        icon: <Cpu size={16} className="text-theme-accent" />,
      },
      {
        id: "daily_runtimes",
        label: t("top_daily_runtimes") || "Top Daily Runtimes",
        desc: "Highest throughput speed & lowest TTFT latency",
        icon: <Zap size={16} className="text-theme-accent" />,
      },
      {
        id: "cost_nano",
        label: "Cost-Efficient / Nano",
        desc: "Lowest pricing per 1M token budget champions",
        icon: <DollarSign size={16} className="text-theme-accent" />,
      },
      {
        id: "max_context",
        label: "Maximum Context",
        desc: "200k to 1M+ token memory window giants",
        icon: <Database size={16} className="text-theme-accent" />,
      },
    ],
    [t]
  );

  // Trigger terminal parsing sequence when category or search changes
  useEffect(() => {
    setIsParsing(true);
    const timer = setTimeout(() => {
      setIsParsing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeGroup, searchQuery]);

  // Handle keyword search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) {
      setActiveGroup("search_query");
    } else if (activeGroup === "search_query") {
      setActiveGroup("market_intel");
    }
  };

  // Filter and sort models based on active group or search query
  const outputNodes = useMemo(() => {
    if (activeGroup === "search_query" && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return models.filter((m) => {
        const matchName = m.name.toLowerCase().includes(q);
        const matchProv = (m.provider || "").toLowerCase().includes(q);
        const matchDesc = (m.description || "").toLowerCase().includes(q);
        const matchCases = (m.use_cases || []).some((uc) => uc.toLowerCase().includes(q));
        return matchName || matchProv || matchDesc || matchCases;
      });
    }

    let sorted = [...models];
    switch (activeGroup) {
      case "market_intel":
        sorted = sorted
          .filter((m) => m.benchmarks?.intelligence_index != null)
          .sort((a, b) => (b.benchmarks?.intelligence_index ?? 0) - (a.benchmarks?.intelligence_index ?? 0));
        break;
      case "coding_dev":
        sorted = sorted
          .filter((m) => m.benchmarks?.coding_index != null)
          .sort((a, b) => (b.benchmarks?.coding_index ?? 0) - (a.benchmarks?.coding_index ?? 0));
        break;
      case "agentic_auto":
        sorted = sorted
          .filter((m) => m.benchmarks?.agentic_index != null)
          .sort((a, b) => (b.benchmarks?.agentic_index ?? 0) - (a.benchmarks?.agentic_index ?? 0));
        break;
      case "daily_runtimes":
        sorted = sorted.sort((a, b) => {
          const speedA = a.throughput ?? (a.ttft ? 1000 / a.ttft : 50);
          const speedB = b.throughput ?? (b.ttft ? 1000 / b.ttft : 50);
          return speedB - speedA;
        });
        break;
      case "cost_nano":
        sorted = sorted.sort((a, b) => {
          const costA = parseFloat(a.pricing.prompt) + parseFloat(a.pricing.completion);
          const costB = parseFloat(b.pricing.prompt) + parseFloat(b.pricing.completion);
          return costA - costB;
        });
        break;
      case "max_context":
        sorted = sorted.sort((a, b) => b.context_length - a.context_length);
        break;
      default:
        sorted = sorted.slice(0, 8);
    }
    return sorted.slice(0, 8);
  }, [models, activeGroup, searchQuery]);

  const activeGroupTitle = useMemo(() => {
    if (activeGroup === "search_query") return `SEARCH: "${searchQuery.toUpperCase()}"`;
    const g = dataGroups.find((d) => d.id === activeGroup);
    return g ? g.label.toUpperCase() : "MARKET INTELLIGENCE";
  }, [activeGroup, searchQuery, dataGroups]);

  const decryptedTitle = useDecryptedText(activeGroupTitle, activeGroup);

  // Map Data Group index/id to radial angles along the left hemisphere (270° down to 90°)
  const activeAngle = useMemo(() => {
    switch (activeGroup) {
      case "market_intel": return 270;    // 01
      case "coding_dev": return 234;      // 02
      case "agentic_auto": return 198;     // 03
      case "daily_runtimes": return 162;  // 04
      case "cost_nano": return 126;       // 05
      case "max_context": return 90;      // 06
      default: return 270;
    }
  }, [activeGroup]);

  // Helper to render individual dotted/cyber node blocks
  const renderNode = (index: number) => {
    const group = dataGroups[index];
    const isActive = activeGroup === group.id;
    
    const shortLabel = 
      group.id === "market_intel" ? "INTEL" :
      group.id === "coding_dev" ? "CODING" :
      group.id === "agentic_auto" ? "AGENTIC" :
      group.id === "daily_runtimes" ? "RUNTIMES" :
      group.id === "cost_nano" ? "COST" : "CONTEXT";

    return (
      <button
        key={group.id}
        onClick={() => {
          setSearchQuery("");
          setActiveGroup(group.id);
        }}
        className={`relative w-full aspect-[1.1] rounded-lg border flex flex-col items-center justify-center p-2 group transition-all duration-300 ${
          isActive
            ? "bg-theme-accent/15 border-theme-accent text-theme-text shadow-[0_0_15px_var(--color-theme-accent)] scale-[1.02] z-10"
            : "bg-theme-void/60 border-dashed border-theme-border/30 text-theme-text-muted hover:border-theme-border/60 hover:text-theme-text hover:bg-white/5"
        }`}
      >
        {/* Corner Cyber Brackets for Active Node */}
        {isActive && (
          <>
            <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-theme-accent" />
            <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-theme-accent" />
            <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-theme-accent" />
            <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-theme-accent" />
            <div className="absolute w-8 h-8 rounded-full border border-dashed border-theme-accent/20 animate-spin-slow pointer-events-none" />
          </>
        )}

        {/* Node Status Indicator Dot */}
        <span className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${
          isActive 
            ? "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-pulse" 
            : "bg-theme-border/30"
        }`} />

        {/* Icon */}
        <div className={`shrink-0 mb-1.5 transition-transform duration-300 ${isActive ? "text-theme-accent scale-110" : "text-theme-text-muted/70 group-hover:text-theme-accent group-hover:scale-105"}`}>
          {group.icon}
        </div>

        {/* Short Cyber Label */}
        <div className={`text-[10px] font-extrabold tracking-widest leading-none ${isActive ? "text-theme-accent" : "text-theme-text-muted group-hover:text-theme-text"}`}>
          {shortLabel}
        </div>

        {/* Description Label / Number */}
        <div className="absolute bottom-1 text-[8px] text-theme-text-muted/30 font-mono scale-90">
          {group.id === "market_intel" ? "01" :
           group.id === "coding_dev" ? "02" :
           group.id === "agentic_auto" ? "03" :
           group.id === "daily_runtimes" ? "04" :
           group.id === "cost_nano" ? "05" : "06"}
        </div>
      </button>
    );
  };

  // Helper to render horizontal grid lines with animated data packet flow
  const renderHorizontalConnector = (fromIdx: number, toIdx: number) => {
    const fromGroup = dataGroups[fromIdx];
    const toGroup = dataGroups[toIdx];
    const isLineActive = activeGroup === fromGroup.id || activeGroup === toGroup.id;

    return (
      <div className="relative w-full h-[2px] flex items-center justify-center">
        {/* Background line */}
        <div className={`w-full h-[2px] border-t border-dashed transition-colors duration-500 ${
          isLineActive ? "border-theme-accent/60" : "border-theme-border/20"
        }`} />
        
        {/* Flowing animated dot */}
        {isLineActive && (
          <div className={`absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] ${
            activeGroup === toGroup.id ? "animate-flow-horizontal-rev" : "animate-flow-horizontal"
          }`} />
        )}
      </div>
    );
  };

  // Helper to render vertical grid lines with animated data packet flow
  const renderVerticalConnector = (fromIdx: number, toIdx: number) => {
    const fromGroup = dataGroups[fromIdx];
    const toGroup = dataGroups[toIdx];
    const isLineActive = activeGroup === fromGroup.id || activeGroup === toGroup.id;

    return (
      <div className="relative w-full h-8 flex justify-center">
        {/* Background line */}
        <div className={`w-[2px] h-full border-l border-dashed transition-colors duration-500 ${
          isLineActive ? "border-theme-accent/60" : "border-theme-border/20"
        }`} />

        {/* Flowing animated dot */}
        {isLineActive && (
          <div className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] ${
            activeGroup === toGroup.id ? "animate-flow-vertical-rev" : "animate-flow-vertical"
          }`} />
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col font-mono relative min-h-[520px]">
      {/* Background Matrix Grid Subtle Pattern covering the entire unified canvas */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(var(--color-theme-accent)_1px,transparent_1px)] [background-size:16px_16px] z-0" />

      {/* Dynamic Keyframes Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowHorizontal {
          0% { left: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes flowHorizontalRev {
          0% { right: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { right: 100%; opacity: 0; }
        }
        @keyframes flowVertical {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes flowVerticalRev {
          0% { bottom: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; }
        }
        .animate-flow-horizontal {
          animation: flowHorizontal 1.8s linear infinite;
        }
        .animate-flow-horizontal-rev {
          animation: flowHorizontalRev 1.8s linear infinite;
        }
        .animate-flow-vertical {
          animation: flowVertical 1.8s linear infinite;
        }
        .animate-flow-vertical-rev {
          animation: flowVerticalRev 1.8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Subtle CRT Screen Effects */
        .crt-canvas::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.12) 50%
          );
          background-size: 100% 4px;
          z-index: 40;
          pointer-events: none;
          opacity: 0.35;
        }
        .crt-vignette {
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.45);
        }
        @keyframes crt-flicker {
          0% { opacity: 0.99; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        .crt-flicker {
          animation: crt-flicker 0.2s infinite;
        }
      `}} />

      {/* Inter-Column Horizontal Connections (Desktop Only) */}
      {/* 1. Data Groups (Col 1) ➔ Parser Core (Col 2) */}
      <div className="absolute top-[48%] left-[23.5%] w-[12.5%] h-[2px] hidden lg:block pointer-events-none z-20">
        <div className={`w-full h-full border-t border-dashed transition-colors duration-500 ${
          activeGroup !== "search_query" ? "border-theme-accent/60" : "border-theme-border/20"
        }`} />
        {activeGroup !== "search_query" && (
          <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-flow-horizontal" />
        )}
      </div>

      {/* 2. Parser Core (Col 2) ➔ Output Nodes (Col 3) */}
      <div className="absolute top-[48%] left-[55.5%] w-[11.5%] h-[2px] hidden lg:block pointer-events-none z-20">
        <div className={`w-full h-full border-t border-dashed transition-colors duration-500 ${
          activeGroup !== "search_query" ? "border-theme-accent/60" : "border-theme-border/20"
        }`} />
        {activeGroup !== "search_query" && (
          <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-flow-horizontal" />
        )}
      </div>

      {/* 3-Column Bento Pipeline Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px] items-stretch relative z-10">
        
        {/* =========================================================
            COLUMN 1: DATA GROUPS (~3 cols on lg, ~25%)
        ========================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-theme-text-muted mb-3 uppercase tracking-wider pb-2 border-b border-theme-border/20">
              <span>DATA GROUPS</span>
              <span className="text-[10px] text-theme-accent">[SELECT 1]</span>
            </div>

            {/* Connected Node Grid Map Layout */}
            <div className="grid grid-cols-[1fr_24px_1fr] items-center gap-y-0 mt-2">
              {/* Row 1 */}
              {renderNode(0)}
              {renderHorizontalConnector(0, 1)}
              {renderNode(1)}

              {/* Row 2 */}
              {renderVerticalConnector(0, 2)}
              <div />
              {renderVerticalConnector(1, 3)}

              {/* Row 3 */}
              {renderNode(2)}
              {renderHorizontalConnector(2, 3)}
              {renderNode(3)}

              {/* Row 4 */}
              {renderVerticalConnector(2, 4)}
              <div />
              {renderVerticalConnector(3, 5)}

              {/* Row 5 */}
              {renderNode(4)}
              {renderHorizontalConnector(4, 5)}
              {renderNode(5)}
            </div>

            {/* Description telemetry pane */}
            <div className="mt-4 p-3 bg-theme-void/25 border border-theme-border/20 rounded-lg min-h-[64px] flex flex-col justify-center transition-all duration-300">
              <span className="text-[9px] text-theme-accent font-extrabold tracking-wider block mb-1">
                // SYSTEM_SPEC // GROUP_DETAIL
              </span>
              <p className="text-[10px] text-theme-text-muted leading-relaxed">
                {activeGroup === "search_query"
                  ? `Active search filter: "${searchQuery}" querying all telemetry tables.`
                  : dataGroups.find((g) => g.id === activeGroup)?.desc || ""}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-theme-border/20 text-[10px] text-theme-text-muted flex items-center justify-between">
            <span>TOTAL INDEXED: <strong className="text-theme-text">{models.length} NODES</strong></span>
            <span className="text-theme-accent">+ ADD CUSTOM</span>
          </div>
        </div>

        {/* =========================================================
            COLUMN 2: KAIRMA PARSER & RADIAL MENU CORE (~5 cols on lg, ~42%)
        ========================================================= */}
        <div className="lg:col-span-5 flex flex-col relative z-10">
          
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-bold text-theme-text-muted mb-4 uppercase tracking-wider pb-2 border-b border-theme-border/20 shrink-0">
              <span>KAIRMA PARSER</span>
              <span className="text-[10px] text-theme-accent">// RADIAL DIAGNOSTICS</span>
            </div>

            {/* Glowing Radial Menu Core centered vertically & horizontally */}
            <div className="flex-1 flex flex-col items-center justify-center relative my-auto min-h-[350px]">
              
              {/* 8-bit Dithered Phosphor Aura (AI Parser Glow) behind the dial */}
              <motion.div 
                className="absolute w-64 h-64 md:w-72 md:h-72 flex items-center justify-center pointer-events-none"
                animate={{ rotate: activeAngle }}
                transition={{ type: "spring", stiffness: 60, damping: 14 }}
              >
                {/* Glow layer pointing to the active angle */}
                <div 
                  className={`absolute top-1/2 left-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-theme-accent/35 blur-xl transition-all duration-500 ${
                    isParsing ? "scale-[1.4] opacity-95 animate-pulse" : "scale-100 opacity-60"
                  }`} 
                  style={{ transform: "translate(-50%, -50%) translate(105px, 0px)" }}
                />
                
                {/* Pixelated Dither Mask Pattern Overlay */}
                <div className="absolute inset-0 w-full h-full mix-blend-overlay opacity-80" style={{ 
                  backgroundImage: "radial-gradient(rgba(0,0,0,0.95) 16%, transparent 16%)", 
                  backgroundSize: "4px 4px" 
                }} />
              </motion.div>

              {/* Dial Outer Ring Layout */}
              <div className="w-60 h-60 md:w-64 md:h-64 rounded-full border border-theme-border/20 flex items-center justify-center relative z-10">
                
                {/* Dotted Tick ring */}
                <div className="absolute inset-2 rounded-full border border-dashed border-theme-border/10 animate-spin-slow" />

                {/* Left Hemisphere Radial Node Indicators (01 to 06) */}
                {[270, 234, 198, 162, 126, 90].map((angle, idx) => {
                  const isActive = activeAngle === angle;
                  return (
                    <div 
                      key={idx}
                      className="absolute w-8 h-8 flex flex-col items-center justify-center font-mono text-[10px] tracking-wider z-20 pointer-events-none transition-colors duration-300"
                      style={{
                        transform: `rotate(${angle}deg) translate(105px) rotate(-${angle}deg)`
                      }}
                    >
                      <span className={`${
                        isActive 
                          ? "text-theme-accent font-extrabold shadow-[0_0_8px_var(--color-theme-accent)] scale-110" 
                          : "text-theme-text-muted/60"
                      }`}>
                        {`0${idx + 1}`}
                      </span>
                      <span className={`w-1 h-1 rounded-full mt-0.5 ${
                        isActive ? "bg-theme-accent animate-ping" : "bg-theme-border/30"
                      }`} />
                    </div>
                  );
                })}

                {/* Mechanical Needle Pointer (Rotates dynamically) */}
                <motion.div 
                  className="absolute inset-0 w-full h-full pointer-events-none z-10"
                  animate={{ rotate: activeAngle }}
                  transition={{ type: "spring", stiffness: 85, damping: 14 }}
                >
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-y-1/2 w-[98px] origin-left flex items-center justify-end"
                    style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
                  >
                    {/* Glowing needle line */}
                    <div className="w-full h-[1px] bg-theme-accent/70 shadow-[0_0_6px_var(--color-theme-accent)]" />
                    {/* Mechanical target arrow */}
                    <div className="w-2.5 h-2.5 rounded-sm bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] rotate-45 -mr-1 transition-transform duration-300" />
                  </div>
                </motion.div>

                {/* Central Circle Core Container (Wrapped in circle) */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-black/90 border border-theme-border/40 flex items-center justify-center shadow-2xl relative z-20">
                  <div className="absolute inset-1 rounded-full border border-dashed border-theme-accent/25 animate-reverse-spin pointer-events-none" />
                  <img
                    src="/Bentos/K.svg"
                    alt="Kairma Core Logo"
                    className={`w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 ${
                      isParsing ? "scale-110 drop-shadow-[0_0_15px_var(--color-theme-accent)]" : "scale-100 drop-shadow-[0_0_8px_var(--color-theme-accent)]"
                    }`}
                  />
                </div>
              </div>

              {/* Status Badge below core */}
              <div className="mt-8 px-4 py-1.5 rounded-full border border-theme-accent/40 bg-theme-void/90 text-xs font-bold text-theme-accent tracking-widest flex items-center gap-2 shadow-lg relative z-20">
                <span className={`w-2 h-2 rounded-full ${isParsing ? "bg-amber-400 animate-ping" : "bg-theme-accent"}`} />
                <span>{isParsing ? "PARSER: DECODING..." : `CORE: [${decryptedTitle}]`}</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            COLUMN 3: OUTPUT NODES (~4 cols on lg, ~33%)
        ========================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between relative z-10">
          
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-theme-text-muted mb-3 uppercase tracking-wider pb-2 border-b border-theme-border/20">
              <span>OUTPUT NODES</span>
              <span className="text-[10px] text-theme-accent font-mono">
                {outputNodes.length > 0 ? `[${outputNodes.length} GENERATED]` : "[0 NODES]"}
              </span>
            </div>

            {/* Output Cards List */}
            <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
              <AnimatePresence mode="popLayout">
                {outputNodes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-lg border border-red-500/30 bg-red-500/10 text-center flex flex-col items-center justify-center gap-2 my-auto"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-400 animate-bounce" />
                    <div className="text-xs font-bold text-red-400">[0x404] NO TELEMETRY FOUND</div>
                    <div className="text-[11px] text-theme-text-muted">
                      No models matched keyword "{searchQuery}". Try another search term or select a Data Group.
                    </div>
                  </motion.div>
                ) : (
                  outputNodes.map((model, idx) => {
                    const rank = idx + 1;
                    const isTop = rank === 1;
                    
                    // Display score or appropriate metric for category
                    let metricBadge = `${model.benchmarks?.intelligence_index ?? model.score}%`;
                    if (activeGroup === "daily_runtimes") {
                      metricBadge = `${model.ttft ?? 110}ms TTFT`;
                    } else if (activeGroup === "cost_nano") {
                      const cost = (parseFloat(model.pricing.prompt) * 1000000).toFixed(2);
                      metricBadge = `$${cost}/1M`;
                    } else if (activeGroup === "max_context") {
                      metricBadge = `${(model.context_length / 1000).toFixed(0)}k CTX`;
                    }

                    return (
                      <motion.div
                        key={model.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: idx * 0.04 }}
                        onClick={() => onSelectModelForModal(model)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                          isTop
                            ? "bg-theme-accent/10 border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)] hover:border-theme-accent hover:scale-[1.02]"
                            : "bg-theme-void/50 border-theme-border/30 hover:border-theme-border/70 hover:bg-white/5 hover:scale-[1.01]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {/* Rank Circle */}
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold shrink-0 ${
                            isTop ? "bg-theme-accent text-theme-void" : "bg-white/10 text-theme-text-muted"
                          }`}>
                            #{rank}
                          </span>

                          <div className="min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-theme-text truncate group-hover:text-theme-accent transition-colors">
                                {model.name}
                              </span>
                            </div>
                            <div className="text-[10px] text-theme-text-muted/80 truncate mt-0.5">
                              {model.provider || "OpenRouter"} // {model.modality || "text->text"}
                            </div>
                          </div>
                        </div>

                        {/* Right Metric Pill */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2 py-1 rounded text-xs font-extrabold font-mono tracking-tight border ${
                            isTop
                              ? "bg-theme-accent/20 border-theme-accent/40 text-theme-accent"
                              : "bg-white/5 border-theme-border/30 text-theme-text"
                          }`}>
                            {metricBadge}
                          </span>
                          <ChevronRight size={14} className="text-theme-text-muted group-hover:text-theme-accent group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Search Bar inside Column 3 */}
          <div className="mt-3 pt-3 border-t border-theme-border/20">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-theme-accent">
                <span className="font-extrabold text-xs tracking-wider">{">_"}</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search database (keyword, LLM, provider)..."
                className="w-full pl-8 pr-14 py-2 bg-black/60 border border-theme-border/50 rounded-lg text-xs text-theme-text placeholder:text-theme-text-muted/60 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all font-mono"
              />
              {searchQuery.length > 0 && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveGroup("market_intel");
                  }}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[10px] text-theme-text-muted hover:text-theme-accent font-bold cursor-pointer"
                >
                  [CLEAR]
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
