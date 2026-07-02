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
  angle: number;
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

// 3D ASCII Holographic Sphere Particle Component
const ASCIISphereVisualizer: React.FC<{ isParsing: boolean; themeAccent: string }> = ({
  isParsing,
  themeAccent,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = 280);
    let height = (canvas.height = 280);

    // Generate 3D points on a sphere using Golden Spiral method
    const numPoints = 140;
    const points: { x: number; y: number; z: number }[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radius = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Scale to initial sphere radius of 85px
      points.push({ x: x * 85, y: y * 85, z: z * 85 });
    }

    let angleX = 0.006;
    let angleY = 0.008;
    let angleZ = 0.003;

    // ASCII characters representing density / depth shading
    const asciiChars = ["@", "#", "8", "&", "*", "o", ";", ":", ".", " "];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Dynamically accelerate rotation speed and scale during parsing sequence
      const speedMultiplier = isParsing ? 4.5 : 1.0;
      const scaleMultiplier = isParsing ? 1.15 : 1.0;

      const currentAngleX = angleX * speedMultiplier;
      const currentAngleY = angleY * speedMultiplier;
      const currentAngleZ = angleZ * speedMultiplier;

      // Center coordinates
      const cx = width / 2;
      const cy = height / 2;

      // Rotate points
      const radX = currentAngleX;
      const radY = currentAngleY;
      const radZ = currentAngleZ;

      const cosX = Math.cos(radX), sinX = Math.sin(radX);
      const cosY = Math.cos(radY), sinY = Math.sin(radY);
      const cosZ = Math.cos(radZ), sinZ = Math.sin(radZ);

      // Sort points by Z (depth) for proper painter's algorithm rendering
      const projectedPoints = points.map((p) => {
        // Rotate X
        let y1 = p.y * cosX - p.z * sinX;
        let z1 = p.z * cosX + p.y * sinX;

        // Rotate Y
        let x2 = p.x * cosY - z1 * sinY;
        let z2 = z1 * cosY + p.x * sinY;

        // Rotate Z
        let x3 = x2 * cosZ - y1 * sinZ;
        let y3 = y1 * cosZ + x2 * sinZ;

        // Save rotated coordinates
        p.x = x3;
        p.y = y1; // Maintain some continuous rotational drift
        p.z = z2;

        // Perspective Projection
        const focalLength = 320;
        const scale = (focalLength / (focalLength + z2)) * scaleMultiplier;
        const px = x3 * scale + cx;
        const py = y3 * scale + cy;

        return { px, py, depth: z2, scale };
      });

      // Sort back-to-front
      projectedPoints.sort((a, b) => b.depth - a.depth);

      // Draw projected points as glowing ASCII characters
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      projectedPoints.forEach((p) => {
        // Map depth to shading index
        const depthNormalized = (p.depth + 95) / 190;
        const charIdx = Math.max(0, Math.min(asciiChars.length - 1, Math.floor(depthNormalized * asciiChars.length)));
        const char = asciiChars[charIdx];

        // Alpha calculation based on depth (closest glows brighter)
        const alpha = Math.max(0.15, Math.min(0.9, 1.0 - depthNormalized));

        ctx.fillStyle = themeAccent;
        ctx.globalAlpha = alpha;

        // Render shadow blur for retro CRT glow feel
        ctx.shadowColor = themeAccent;
        ctx.shadowBlur = isParsing ? 6 : 2;

        ctx.font = `${Math.max(6, Math.floor(9 * p.scale))}px monospace`;
        ctx.fillText(char, p.px, p.py);
      });

      // Render outer radar scanner lines
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = themeAccent;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, 110 * scaleMultiplier, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isParsing, themeAccent]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

export default function NeuralPipelineHUD({
  models,
  onSelectModelForModal,
  language,
  t,
}: NeuralPipelineHUDProps) {
  const [activeGroup, setActiveGroup] = useState<DataGroupId>("market_intel");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const dataGroups: DataGroupConfig[] = useMemo(
    () => [
      {
        id: "market_intel",
        label: t("intel") || "Market Intelligence",
        desc: "High reasoning, complex math & logic leaders",
        icon: <FileText size={16} />,
        angle: 270,
      },
      {
        id: "coding_dev",
        label: t("coding") || "Coding & Dev Ops",
        desc: "Code generation, syntax lints & repo refactoring",
        icon: <Code size={16} />,
        angle: 234,
      },
      {
        id: "agentic_auto",
        label: t("agentic") || "Agentic Autonomy",
        desc: "Multi-step tool calling & autonomous workflows",
        icon: <Cpu size={16} />,
        angle: 198,
      },
      {
        id: "daily_runtimes",
        label: t("top_daily_runtimes") || "Top Daily Runtimes",
        desc: "Highest throughput speed & lowest TTFT latency",
        icon: <Zap size={16} />,
        angle: 162,
      },
      {
        id: "cost_nano",
        label: "Cost-Efficient / Nano",
        desc: "Lowest pricing per 1M token budget champions",
        icon: <DollarSign size={16} />,
        angle: 126,
      },
      {
        id: "max_context",
        label: "Maximum Context",
        desc: "200k to 1M+ token memory window giants",
        icon: <Database size={16} />,
        angle: 90,
      },
    ],
    [t]
  );

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
        sorted = sorted.slice(0, 5);
    }
    return sorted.slice(0, 5);
  }, [models, activeGroup, searchQuery]);

  // Set default selected model on group switch
  useEffect(() => {
    if (outputNodes.length > 0) {
      setSelectedModel(outputNodes[0]);
    } else {
      setSelectedModel(null);
    }
  }, [outputNodes]);

  // Trigger terminal parsing sequence when category or search changes
  useEffect(() => {
    setIsParsing(true);
    const timer = setTimeout(() => {
      setIsParsing(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeGroup, searchQuery]);

  // Get active group name
  const activeGroupTitle = useMemo(() => {
    if (activeGroup === "search_query") return `SEARCH: "${searchQuery.toUpperCase()}"`;
    const g = dataGroups.find((d) => d.id === activeGroup);
    return g ? g.label.toUpperCase() : "MARKET INTELLIGENCE";
  }, [activeGroup, searchQuery, dataGroups]);

  const decryptedTitle = useDecryptedText(activeGroupTitle, activeGroup);

  // Get theme accent hex color dynamically from computed styles for canvas
  const [themeAccentColor, setThemeAccentColor] = useState("#00ff66");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const computed = getComputedStyle(document.documentElement);
      const acc = computed.getPropertyValue("--color-theme-accent") || computed.getPropertyValue("--theme-accent");
      if (acc) {
        setThemeAccentColor(acc.trim());
      }
    }
  }, [activeGroup]);

  // Left offset curve layout translate values for semi-circular radial menu
  const getCurveTranslateX = (angle: number) => {
    switch (angle) {
      case 270: return 28; // Top
      case 234: return 8;  // Mid-top
      case 198: return 0;  // Center-left
      case 162: return 0;  // Center-left
      case 126: return 8;  // Mid-bottom
      case 90: return 28;  // Bottom
      default: return 0;
    }
  };

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

  return (
    <div className="w-full flex flex-col gap-6 font-mono relative h-full select-none">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flowHorizontal {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-flow-dash {
          animation: flowHorizontal 0.8s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 16s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 10s linear infinite;
        }
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}} />

      {/* 3-Column Bento Pipeline Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[480px] items-stretch relative z-10">
        
        {/* =========================================================
            COLUMN 1: DATA GROUPS (Interactive Radial Arc - ~3.5 cols)
        ========================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between relative z-10 pr-2">
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-xs font-bold text-theme-text uppercase tracking-widest">DATA GROUPS</span>
              <span className="text-[10px] text-theme-text-muted mt-0.5">// select a data group to parse</span>
            </div>

            {/* Left Hemisphere Radial Arc buttons */}
            <div className="flex flex-col gap-2 relative min-h-[380px] justify-center pl-1">
              
              {/* Circular track graphic */}
              <div className="absolute left-[165px] top-1/2 -translate-y-1/2 w-48 h-96 border border-dashed border-theme-border/15 rounded-full pointer-events-none -translate-x-1/2 z-0 hidden lg:block" />

              {dataGroups.map((group, idx) => {
                const isActive = activeGroup === group.id;
                const tx = getCurveTranslateX(group.angle);
                
                const shortLabel = 
                  group.id === "market_intel" ? "INTEL" :
                  group.id === "coding_dev" ? "CODING" :
                  group.id === "agentic_auto" ? "AGENTIC" :
                  group.id === "daily_runtimes" ? "RUNTIMES" :
                  group.id === "cost_nano" ? "COST" : "CONTEXT";

                return (
                  <motion.button
                    key={group.id}
                    onClick={() => {
                      setSearchQuery("");
                      setActiveGroup(group.id);
                    }}
                    className={`relative w-[155px] py-2 px-3 rounded border text-left transition-all duration-300 flex items-center gap-2 group pointer-events-auto ${
                      isActive
                        ? "bg-theme-accent/15 border-theme-accent text-theme-text shadow-[0_0_12px_var(--color-theme-accent)]"
                        : "bg-theme-void/60 border-dashed border-theme-border/20 text-theme-text-muted hover:border-theme-border/50 hover:bg-white/5"
                    }`}
                    style={{
                      transform: `translateX(${tx}px)`,
                    }}
                    animate={{
                      y: [0, idx % 2 === 0 ? -2 : 2, 0],
                    }}
                    transition={{
                      duration: 3 + idx * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Active indicators */}
                    {isActive && (
                      <>
                        <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-theme-accent animate-ping" />
                        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-theme-accent" />
                      </>
                    )}

                    <span className="text-[9px] font-extrabold text-theme-text-muted/60 font-mono tracking-tighter">
                      {`0${idx + 1}`}
                    </span>
                    
                    <div className={`shrink-0 transition-colors ${isActive ? "text-theme-accent" : "text-theme-text-muted group-hover:text-theme-accent"}`}>
                      {group.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-extrabold tracking-widest truncate ${isActive ? "text-theme-accent" : "text-theme-text-muted group-hover:text-theme-text"}`}>
                        {shortLabel}
                      </div>
                      <div className="text-[8px] text-theme-text-muted/40 font-mono leading-none">
                        {`${group.angle}°`}
                      </div>
                    </div>
                  </motion.button>
                );
              })}

              {/* Central active readout panel sitting inside the arc */}
              <div className="absolute left-[175px] top-[48%] -translate-y-1/2 w-[110px] p-2 bg-black/80 border border-theme-border/40 rounded flex flex-col justify-center pointer-events-none z-10 hidden lg:flex shadow-2xl">
                <span className="text-[7px] text-theme-text-muted/60 uppercase tracking-wider block font-bold leading-none mb-1">
                  // ACTIVE GROUP
                </span>
                <span className="text-[9px] text-theme-accent font-black tracking-widest leading-tight block truncate uppercase">
                  {`0${dataGroups.findIndex(g => g.id === activeGroup) + 1} ${activeGroup === "search_query" ? "SEARCH" : activeGroup.replace("_", " ")}`}
                </span>
                <span className="text-[8px] text-theme-text-muted/80 leading-none mt-1 animate-pulse font-mono">
                  {isParsing ? "PARSING DATA..." : "FEED STABLE"}
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* =========================================================
            COLUMN 2: KAIRMA PARSER & 3D ASCII CORE (~3.5 cols)
        ========================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-center items-center relative z-10 min-h-[380px]">
          
          {/* 3D ASCII Holographic Rotating Sphere */}
          <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center">
            
            {/* The 3D projected character sphere */}
            <ASCIISphereVisualizer isParsing={isParsing} themeAccent={themeAccentColor} />

            {/* Glowing outer mechanical rings */}
            <div className="absolute w-56 h-56 rounded-full border border-dashed border-theme-accent/25 animate-spin-slow pointer-events-none" />
            <div className="absolute w-44 h-44 rounded-full border border-theme-border/20 animate-reverse-spin pointer-events-none" />

            {/* Center target circle container */}
            <div className="w-24 h-24 rounded-full bg-black/95 border border-theme-border/50 flex items-center justify-center shadow-2xl relative z-10">
              {/* Rotating inner mechanical tick */}
              <div className="absolute inset-1 rounded-full border border-dashed border-theme-accent/30 animate-spin-slow" />
              
              <img
                src="/Bentos/K.svg"
                alt="Kairma Core Logo"
                className={`w-10 h-10 transition-transform duration-500 ${
                  isParsing ? "scale-115 drop-shadow-[0_0_15px_var(--color-theme-accent)]" : "scale-100 drop-shadow-[0_0_8px_var(--color-theme-accent)]"
                }`}
              />
            </div>
            
            {/* Top/Bottom ASCII status ticks */}
            <span className="absolute top-2 font-mono text-[8px] text-theme-accent opacity-50 tracking-widest">// KAIRMA OS AGENT</span>
            <span className="absolute bottom-2 font-mono text-[8px] text-theme-accent opacity-50 tracking-widest animate-pulse">
              {isParsing ? "STATUS: DECODING" : "STATUS: ACTIVE"}
            </span>
          </div>

        </div>

        {/* =========================================================
            COLUMN 3: OUTPUT NODES (Floating Low-Gravity List - ~4 cols)
        ========================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between relative z-10 pl-2">
          
          {/* Connector Paths (Desktop Only) */}
          <div className="absolute inset-0 w-full h-full hidden lg:block pointer-events-none z-0">
            <svg className="w-full h-full">
              {outputNodes.map((model, idx) => {
                const isActive = selectedModel?.id === model.id;
                const startY = 190;
                const endY = 48 + idx * 72; // Map to card heights
                const pathD = `M 0,${startY} C 60,${startY} 60,${endY} 160,${endY}`;

                return (
                  <path
                    key={model.id}
                    d={pathD}
                    fill="none"
                    stroke={isActive ? "var(--color-theme-accent)" : "var(--color-theme-border)"}
                    strokeWidth={isActive ? 2.5 : 1}
                    strokeOpacity={isActive ? 0.75 : 0.15}
                    strokeDasharray={isActive ? "5, 4" : "4, 6"}
                    className={isActive ? "animate-flow-dash transition-all duration-300" : "transition-all duration-300"}
                  />
                );
              })}
            </svg>
          </div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col mb-4">
              <span className="text-xs font-bold text-theme-text uppercase tracking-widest">OUTPUT NODES</span>
              <span className="text-[10px] text-theme-text-muted mt-0.5">// generated insights</span>
            </div>

            {/* Floating low-gravity cards container */}
            <div className="flex flex-col gap-3 relative min-h-[380px] justify-center">
              <AnimatePresence mode="popLayout">
                {outputNodes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded border border-red-500/30 bg-red-500/10 text-center flex flex-col items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-8 h-8 text-red-400 animate-bounce" />
                    <div className="text-xs font-bold text-red-400">[0x404] NO TELEMETRY FOUND</div>
                    <div className="text-[10px] text-theme-text-muted">
                      No models matched keyword "{searchQuery}". Try another search term or select a Data Group.
                    </div>
                  </motion.div>
                ) : (
                  outputNodes.map((model, idx) => {
                    const isSelected = selectedModel?.id === model.id;
                    
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
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ 
                          opacity: 1, 
                          x: isSelected ? 4 : 0,
                          y: [0, idx % 2 === 0 ? -6 : 6, 0],
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ 
                          x: { duration: 0.25, delay: idx * 0.04 },
                          opacity: { duration: 0.25, delay: idx * 0.04 },
                          y: {
                            duration: 3.5 + idx * 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }
                        }}
                        onClick={() => setSelectedModel(model)}
                        className={`w-full max-w-[280px] p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between group relative z-10 ${
                          isSelected
                            ? "bg-theme-accent/15 border-theme-accent shadow-[0_0_12px_var(--color-theme-accent)]"
                            : "bg-theme-void/50 border-theme-border/20 text-theme-text-muted hover:border-theme-border/40 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isSelected ? "bg-theme-accent animate-ping" : "bg-theme-border/30"
                          }`} />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold truncate transition-colors ${isSelected ? "text-theme-accent" : "text-theme-text group-hover:text-theme-accent"}`}>
                                {model.name}
                              </span>
                            </div>
                            <div className="text-[8px] text-theme-text-muted/60 truncate leading-none mt-0.5">
                              {model.provider || "OpenRouter"} // {model.modality || "text->text"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold font-mono border ${
                            isSelected
                              ? "bg-theme-accent/25 border-theme-accent/40 text-theme-accent"
                              : "bg-white/5 border-theme-border/20 text-theme-text-muted"
                          }`}>
                            {metricBadge}
                          </span>
                          <ChevronRight size={12} className="text-theme-text-muted group-hover:text-theme-accent transition-colors" />
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================
          BOTTOM ROW: DETAILED MODEL TELEMETRY SPECS
      ========================================================= */}
      <div className="mt-2 pt-3 border-t border-theme-border/30 w-full relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-[10px]">
          
          <div className="bg-theme-void/45 p-2 rounded border border-theme-border/20 flex flex-col justify-center min-h-[46px]">
            <span className="text-theme-text-muted/50 text-[7px] font-bold uppercase tracking-wider block leading-none mb-1">
              DATA SOURCE
            </span>
            <span className="font-extrabold text-theme-text truncate leading-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
              OpenRouter API
            </span>
          </div>

          <div className="bg-theme-void/45 p-2 rounded border border-theme-border/20 flex flex-col justify-center min-h-[46px]">
            <span className="text-theme-text-muted/50 text-[7px] font-bold uppercase tracking-wider block leading-none mb-1">
              MODEL CORE
            </span>
            <span className="font-extrabold text-theme-accent truncate leading-tight uppercase">
              {selectedModel ? selectedModel.name : "N/A"}
            </span>
          </div>

          <div className="bg-theme-void/45 p-2 rounded border border-theme-border/20 flex flex-col justify-center min-h-[46px]">
            <span className="text-theme-text-muted/50 text-[7px] font-bold uppercase tracking-wider block leading-none mb-1">
              LATENCY (TTFT)
            </span>
            <span className="font-extrabold text-theme-text truncate leading-tight">
              {selectedModel ? `${selectedModel.ttft ?? 112}ms` : "N/A"}
            </span>
          </div>

          <div className="bg-theme-void/45 p-2 rounded border border-theme-border/20 flex flex-col justify-center min-h-[46px]">
            <span className="text-theme-text-muted/50 text-[7px] font-bold uppercase tracking-wider block leading-none mb-1">
              TOKENS USED
            </span>
            <span className="font-extrabold text-theme-text truncate leading-tight">
              {selectedModel ? `${(selectedModel.score * 135).toFixed(0)}K` : "N/A"}
            </span>
          </div>

          <div className="bg-theme-void/45 p-2 rounded border border-theme-border/20 flex flex-col justify-center min-h-[46px]">
            <span className="text-theme-text-muted/50 text-[7px] font-bold uppercase tracking-wider block leading-none mb-1">
              CONTEXT LIMIT
            </span>
            <span className="font-extrabold text-theme-text truncate leading-tight">
              {selectedModel ? `${(selectedModel.context_length / 1000).toFixed(0)}K` : "N/A"}
            </span>
          </div>

          <div className="bg-theme-void/45 p-2 rounded border border-theme-border/20 flex flex-col justify-center min-h-[46px]">
            <span className="text-theme-text-muted/50 text-[7px] font-bold uppercase tracking-wider block leading-none mb-1">
              QUERY COST
            </span>
            <span className="font-extrabold text-theme-accent truncate leading-tight">
              {selectedModel 
                ? `$${(parseFloat(selectedModel.pricing.prompt) * 1000).toFixed(4)}` 
                : "N/A"}
            </span>
          </div>

        </div>

        {/* Selected model brief verdict/use cases terminal printout */}
        <div className="mt-2.5 p-2 bg-black/40 border border-theme-border/10 rounded flex items-center justify-between text-[9px] text-theme-text-muted/95 min-h-[30px] font-mono leading-none">
          <span className="truncate flex-1 pr-4">
            {selectedModel 
              ? `> DECRYPTED_SPEC // ${selectedModel.description || `Ideal for ${selectedModel.use_cases?.join(', ') || 'general purpose reasoning tasks'}.`}`
              : "> SELECT A GENERATED OUTPUT NODE FOR TELEMETRY INSIGHTS..."}
          </span>
          <div className="shrink-0 flex items-center gap-1">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search database..."
              className="w-36 px-2 py-0.5 bg-black/80 border border-theme-border/40 rounded text-[9px] text-theme-text focus:outline-none focus:border-theme-accent transition-all font-mono"
            />
          </div>
        </div>
      </div>

    </div>
  );
}
