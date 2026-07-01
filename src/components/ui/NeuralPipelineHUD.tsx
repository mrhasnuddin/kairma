"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Code,
  Cpu,
  Shield,
  Zap,
  Activity,
  ExternalLink,
  Search,
  Database,
  Radio,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  BarChart2,
  Layers,
  Sparkles,
  Filter,
  FileText,
  Calendar,
  UserCheck,
  DollarSign,
  Lock,
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
  const [parserLogs, setParserLogs] = useState<string[]>([]);
  const [parseTime, setParseTime] = useState("0.42");

  const dataGroups: DataGroupConfig[] = useMemo(
    () => [
      {
        id: "market_intel",
        label: t("intel") || "Market Intelligence",
        desc: "High reasoning, complex math & logic leaders",
        icon: <FileText size={16} className="text-emerald-400" />,
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
        icon: <Cpu size={16} className="text-purple-400" />,
      },
      {
        id: "daily_runtimes",
        label: t("top_daily_runtimes") || "Top Daily Runtimes",
        desc: "Highest throughput speed & lowest TTFT latency",
        icon: <Zap size={16} className="text-amber-400" />,
      },
      {
        id: "cost_nano",
        label: "Cost-Efficient / Nano",
        desc: "Lowest pricing per 1M token budget champions",
        icon: <DollarSign size={16} className="text-cyan-400" />,
      },
      {
        id: "max_context",
        label: "Maximum Context",
        desc: "200k to 1M+ token memory window giants",
        icon: <Database size={16} className="text-pink-400" />,
      },
    ],
    [t]
  );

  // Trigger terminal parsing sequence when category or search changes
  useEffect(() => {
    setIsParsing(true);
    const start = performance.now();
    
    setParserLogs([
      "> Fetching live OpenRouter telemetry... [OK]",
      "> Initializing neural data pipeline...",
    ]);

    const t1 = setTimeout(() => {
      setParserLogs((prev) => [
        ...prev,
        `> Filtering by category: [${activeGroup.toUpperCase()}]... [OK]`,
        "> Running KAIRMA reasoning parser...",
      ]);
    }, 150);

    const t2 = setTimeout(() => {
      const elapsed = ((performance.now() - start) / 1000).toFixed(2);
      setParseTime(elapsed);
      setParserLogs((prev) => [
        ...prev,
        "> Routing verified telemetry nodes... [OK]",
        `> PIPELINE SEALED // Completed in ${elapsed}s`,
      ]);
      setIsParsing(false);
    }, 380);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
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

  return (
    <div className="w-full flex flex-col gap-6 font-mono relative h-full">
      {/* 3-Column Bento Pipeline Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px] items-stretch">
        
        {/* =========================================================
            COLUMN 1: DATA GROUPS (~3 cols on lg, ~25%)
        ========================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3 bg-black/30 border border-theme-border/30 rounded-lg p-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-theme-text-muted mb-3 uppercase tracking-wider pb-2 border-b border-theme-border/20">
              <span>DATA GROUPS</span>
              <span className="text-[10px] text-theme-accent">[SELECT 1]</span>
            </div>

            <div className="flex flex-col gap-2">
              {dataGroups.map((group) => {
                const isActive = activeGroup === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      setSearchQuery("");
                      setActiveGroup(group.id);
                    }}
                    className={`relative p-3 rounded-lg border text-left transition-all duration-300 cursor-pointer flex items-start gap-3 group ${
                      isActive
                        ? "bg-theme-void/95 border-theme-accent text-theme-text shadow-[0_0_20px_rgba(31,170,104,0.2)] translate-x-1"
                        : "bg-theme-void/40 border-theme-border/30 text-theme-text-muted hover:border-theme-border/60 hover:text-theme-text hover:bg-white/5"
                    }`}
                  >
                    {/* Active Glowing Dot / Node on right edge */}
                    {isActive && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-ping" />
                    )}

                    <div className="mt-0.5 shrink-0">{group.icon}</div>
                    <div className="flex-1 min-w-0 pr-4">
                      <div className={`text-xs font-bold truncate ${isActive ? "text-theme-accent" : "group-hover:text-theme-text"}`}>
                        {group.label}
                      </div>
                      <div className="text-[10px] text-theme-text-muted/80 leading-tight mt-0.5 line-clamp-1">
                        {group.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-theme-border/20 text-[10px] text-theme-text-muted flex items-center justify-between">
            <span>TOTAL INDEXED: <strong className="text-theme-text">{models.length} NODES</strong></span>
            <span className="text-theme-accent">+ ADD CUSTOM</span>
          </div>
        </div>

        {/* =========================================================
            COLUMN 2: KAIRMA PARSER & HEXAGON CORE (~5 cols on lg, ~42%)
        ========================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-black/40 border border-theme-border/40 rounded-lg p-5 relative overflow-hidden">
          
          {/* Background Matrix Grid Subtle Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#00FF66_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-theme-text-muted mb-4 uppercase tracking-wider pb-2 border-b border-theme-border/20">
              <span>KAIRMA PARSER</span>
              <span className="text-[10px] text-emerald-400">// REASONING CORE</span>
            </div>

            {/* Glowing Hexagon Core Display */}
            <div className="my-6 flex flex-col items-center justify-center relative min-h-[220px]">
              
              {/* Outer Orbit Rings */}
              <div className="absolute w-44 h-44 md:w-52 md:h-52 rounded-full border border-theme-accent/20 animate-spin-slow pointer-events-none" />
              <div className="absolute w-36 h-36 md:w-40 md:h-40 rounded-full border border-dashed border-emerald-400/30 animate-reverse-spin pointer-events-none" />

              {/* Cyber Hexagon Shape */}
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                {/* Glowing Hexagon Border */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_25px_var(--color-theme-accent)]">
                  <polygon
                    points="50 3, 93 25, 93 75, 50 97, 7 75, 7 25"
                    fill="rgba(0, 0, 0, 0.85)"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-theme-accent transition-all duration-500"
                  />
                  <polygon
                    points="50 8, 88 28, 88 72, 50 92, 12 72, 12 28"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    className="animate-pulse"
                  />
                </svg>

                {/* Center K Logo */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <img
                    src="/Bentos/K.svg"
                    alt="Kairma Core"
                    className={`w-10 h-10 md:w-12 md:h-12 transition-transform duration-500 ${
                      isParsing ? "scale-110 drop-shadow-[0_0_20px_#00FF66]" : "scale-100 drop-shadow-[0_0_10px_var(--color-theme-accent)]"
                    }`}
                  />
                </div>

                {/* Orbiting LED Dots */}
                <span className="absolute top-0 right-1/4 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#00FF66] animate-ping" />
                <span className="absolute bottom-2 left-1/4 w-1.5 h-1.5 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]" />
              </div>

              {/* Status Badge below core */}
              <div className="mt-6 px-3 py-1 rounded-full border border-theme-accent/40 bg-theme-void/90 text-[11px] font-bold text-theme-accent tracking-widest flex items-center gap-2 shadow-lg">
                <span className={`w-2 h-2 rounded-full ${isParsing ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                <span>{isParsing ? "PARSER: DECODING..." : `CORE: [${decryptedTitle}]`}</span>
              </div>
            </div>
          </div>

          {/* Bottom Live Console Log Box */}
          <div className="relative z-10 bg-black/80 border border-theme-border/50 rounded-lg p-3.5 text-[11px] font-mono leading-relaxed shadow-inner">
            <div className="flex justify-between items-center text-[10px] text-theme-text-muted mb-2 border-b border-theme-border/20 pb-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Terminal size={12} /> KAIRMA_OS // TELEMETRY LOG
              </span>
              <span>PID: 4092</span>
            </div>
            
            <div className="space-y-1 text-theme-text-muted/90 min-h-[64px] flex flex-col justify-end">
              {parserLogs.map((log, i) => (
                <div key={i} className={log.includes("OK") || log.includes("SEALED") ? "text-emerald-400 font-bold" : ""}>
                  {log}
                </div>
              ))}
            </div>

            {/* Bottom Register Stats Row */}
            <div className="grid grid-cols-4 gap-2 mt-3 pt-2 border-t border-theme-border/20 text-[10px]">
              <div className="bg-white/5 p-1.5 rounded border border-theme-border/20">
                <div className="text-theme-text-muted text-[8px] uppercase">TOKENS USED</div>
                <div className="font-bold text-theme-text">24.8K</div>
              </div>
              <div className="bg-white/5 p-1.5 rounded border border-theme-border/20">
                <div className="text-theme-text-muted text-[8px] uppercase">MODEL CORE</div>
                <div className="font-bold text-theme-accent truncate">KAIRMA-V3</div>
              </div>
              <div className="bg-white/5 p-1.5 rounded border border-theme-border/20">
                <div className="text-theme-text-muted text-[8px] uppercase">AVG LATENCY</div>
                <div className="font-bold text-emerald-400">112ms</div>
              </div>
              <div className="bg-white/5 p-1.5 rounded border border-theme-border/20">
                <div className="text-theme-text-muted text-[8px] uppercase">QUERY COST</div>
                <div className="font-bold text-theme-text">$0.0024</div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            COLUMN 3: OUTPUT NODES (~4 cols on lg, ~33%)
        ========================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between bg-black/30 border border-theme-border/30 rounded-lg p-4 relative overflow-hidden">
          
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
                            ? "bg-theme-void/95 border-theme-accent shadow-[0_0_15px_rgba(31,170,104,0.15)] hover:border-theme-accent hover:scale-[1.02]"
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

          <div className="mt-3 pt-3 border-t border-theme-border/20 text-[10px] text-theme-text-muted flex items-center justify-between">
            <span>CLICK NODE TO VIEW RAW SPECIFICATIONS</span>
            <span className="text-theme-accent font-bold">JSON ↓</span>
          </div>
        </div>

      </div>

      {/* =========================================================
          BOTTOM COMMAND SEARCH & FILTER BAR
      ========================================================= */}
      <div className="pt-4 border-t border-theme-border/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-theme-accent">
            <span className="font-extrabold mr-1.5">{">.."}</span>
            <Search size={14} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search OpenRouter database by keyword, LLM name, provider, or capability..."
            className="w-full pl-12 pr-4 py-2.5 bg-black/60 border border-theme-border/50 rounded-lg text-xs text-theme-text placeholder:text-theme-text-muted/60 focus:outline-none focus:border-theme-accent focus:ring-1 focus:ring-theme-accent transition-all font-mono"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveGroup("market_intel");
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-theme-text-muted hover:text-theme-accent font-bold cursor-pointer"
            >
              [ CLEAR ]
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 text-xs">
          <button
            onClick={() => {
              if (outputNodes.length > 0) {
                onSelectModelForModal(outputNodes[0]);
              }
            }}
            className="px-4 py-2.5 bg-theme-accent text-theme-void font-extrabold uppercase tracking-widest rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_15px_var(--color-theme-accent)] cursor-pointer"
          >
            <span>VIEW TOP SPEC</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
