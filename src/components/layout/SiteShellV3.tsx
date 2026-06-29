"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { StickyNav } from "./StickyNav";
import { BurnStream } from "@/components/ui/BurnStream";
import { BentoGrid } from "./Bento";
import { OSCard } from "@/components/ui/OSCard";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { DeploymentCanvas } from "@/components/ui/DeploymentCanvas";
import { DeploymentGlobe } from "@/components/ui/DeploymentGlobe";
import CpuIcon from "@/components/ui/cpu-icon";
import GearIcon from "@/components/ui/gear-icon";
import PlugConnectedIcon from "@/components/ui/plug-connected-icon";
import DoubleCheckIcon from "@/components/ui/double-check-icon";
import UserIcon from "@/components/ui/user-icon";
import LinkIcon from "@/components/ui/link-icon";
import HeadsetIcon from "@/components/ui/headset-icon";
import ShieldCheck from "@/components/ui/shield-check";
import CodeXmlIcon from "@/components/ui/code-xml-icon";
import { AnimatedIconHandle } from "@/components/ui/types";
import { FallingPattern } from "@/components/visual/FallingPattern";
import { useTheme } from "@/lib/theme";
import { useLanguage, useSiteCopyV4 } from "@/lib/language";
import { Language } from "@/data/site-translations";
import { EvilRadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, Dot, ActiveDot } from "@/components/evilcharts/charts/radar-chart";
import { GuanFrontispiece } from "@/components/visual/GuanFrontispiece";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
const KairmaHero = dynamic(() => import("@/components/3d/KairmaHero"), { ssr: false });
gsap.registerPlugin(useGSAP, ScrollTrigger);



const InteractiveBootBox: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  triggerCrt: () => void;
  getLangLabel: (lang: Language) => string;
  className?: string;
}> = ({ language, setLanguage, triggerCrt, getLangLabel, className }) => {
  const { theme } = useTheme();

  const handleNormalLanguage = (l: Language) => {
    setLanguage(l);
    triggerCrt();
  };

  return (
    <OSCard className={`relative flex flex-col min-h-[300px] md:min-h-[350px] bg-theme-void text-theme-accent font-mono border-theme-border shadow-[inset_0_0_100px_rgba(31,170,104,0.05)] overflow-hidden ${className || ""}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-10" />
      <motion.div 
        className={`absolute inset-0 h-[60px] bg-gradient-to-b from-transparent via-theme-accent/20 to-transparent pointer-events-none z-10 ${
          theme === "xuan-mode" ? "mix-blend-multiply" : "mix-blend-screen"
        }`}
        initial={{ top: "-60px" }}
        animate={{ top: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-20 flex-1 flex flex-col w-full mx-auto p-8 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-6 w-full font-mono select-none my-auto animate-in fade-in duration-500">
          <div className="text-sm md:text-base font-bold tracking-widest text-theme-accent/80 leading-relaxed uppercase">
            KAIRMA OS BIOS v1.0<br/>LOCALE SETTINGS:
          </div>
          <div className="flex flex-col gap-2 text-sm md:text-base font-bold">
            {(["en", "zh-TW", "zh-CN", "vi", "ms"] as Language[]).map(l => (
              <button 
                key={l}
                onClick={() => handleNormalLanguage(l)}
                className={`text-left p-2.5 transition-all border focus:outline-none ${language === l ? 'text-[#2aff9b] bg-theme-accent/10 border-theme-accent/30' : 'text-theme-accent hover:text-[#2aff9b] hover:bg-theme-accent/10 border-transparent hover:border-theme-accent/30'}`}
              >
                {"> [ " + getLangLabel(l).toUpperCase() + " ]"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </OSCard>
  );
};

export const SiteShellV3: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const siteCopy = useSiteCopyV4();
  const [langOpen, setLangOpen] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [compareModel, setCompareModel] = useState<string>("gpt4o");
  const [selectedModelForModal, setSelectedModelForModal] = useState<any | null>(null);
  
  // Live OpenRouter models state
  const [openRouterModels, setOpenRouterModels] = useState<any[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [chartMetric, setChartMetric] = useState<"intelligence_index" | "coding_index" | "agentic_index">("intelligence_index");

  // AI Employees icon refs
  const kolIconRef = useRef<AnimatedIconHandle>(null);
  const contentIconRef = useRef<AnimatedIconHandle>(null);
  const customerIconRef = useRef<AnimatedIconHandle>(null);
  const complianceIconRef = useRef<AnimatedIconHandle>(null);
  const codeIconRef = useRef<AnimatedIconHandle>(null);
  const shieldCtaIconRef = useRef<AnimatedIconHandle>(null);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [crtFlash, setCrtFlash] = useState(false);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [ipLocation, setIpLocation] = useState<{city: string, region: string, country: string, timezone: string} | null>(null);
  const [bootPhase, setBootPhase] = useState<"guan" | "terminal" | "ready">("guan");
  const [isDeployHovered, setIsDeployHovered] = useState(false);
  const handleGuanComplete = useCallback(() => setBootPhase("ready"), []);
  const handleBootComplete = useCallback(() => setBootPhase("ready"), []);

  const [pipelineState, setPipelineState] = useState<number>(0);
  const iconRefs = useRef<any[]>([]);

  // Loop for the Shift pipeline beam animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineState((prev) => (prev + 1) % 8);
    }, 1500); // 1.5 seconds per state
    return () => clearInterval(interval);
  }, []);

  // Sync icon animations with pipeline state
  useEffect(() => {
    if (pipelineState === 0) iconRefs.current[0]?.startAnimation();
    else iconRefs.current[0]?.stopAnimation();

    if (pipelineState === 2) iconRefs.current[1]?.startAnimation();
    else iconRefs.current[1]?.stopAnimation();

    if (pipelineState === 4) iconRefs.current[2]?.startAnimation();
    else iconRefs.current[2]?.stopAnimation();

    if (pipelineState === 6) iconRefs.current[3]?.startAnimation();
    else iconRefs.current[3]?.stopAnimation();
  }, [pipelineState]);

  const SHOW_LINEAGE = false;

  useEffect(() => {
    // Fetch IP-based location
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.timezone) {
          setIpLocation({
            city: data.city || data.region,
            region: data.continent_code || data.country_name,
            country: data.country_name || '',
            timezone: data.timezone
          });
        }
      })
      .catch(e => console.error('IP location fetch failed:', e));
      
    setMounted(true);
    setTime(new Date());
    const interval = setInterval(() => setTime(new Date()), 1000);

    const handler = () => {
      setCrtFlash(true);
      setTimeout(() => setCrtFlash(false), 300);
    };
    window.addEventListener('crt-flash', handler);
    return () => {
      window.removeEventListener('crt-flash', handler);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function getModels() {
      try {
        setModelsLoading(true);
        const res = await fetch("/api/openrouter");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (active) {
          setOpenRouterModels(data.data || []);
          if (data.data && data.data.length > 0) {
            // Find first model with benchmarks for the default baseline
            const hasBenchmarks = data.data.find((m: any) => m.benchmarks && m.benchmarks.intelligence_index != null);
            if (hasBenchmarks) {
              setExpandedModel(hasBenchmarks.id);
            }
            // Set comparison model to the second model with benchmarks if available
            const secondBenchmark = data.data.filter((m: any) => m.benchmarks && m.benchmarks.intelligence_index != null)[1];
            if (secondBenchmark) {
              setCompareModel(secondBenchmark.id);
            }
          }
        }
      } catch (err) {
        if (active) {
          setModelsError(err instanceof Error ? err.message : "Error");
        }
      } finally {
        if (active) {
          setModelsLoading(false);
        }
      }
    }
    getModels();
    return () => {
      active = false;
    };
  }, []);

  const triggerCrt = () => {
    window.dispatchEvent(new CustomEvent('crt-flash'));
  };
  const handleThemeToggle = () => {
    triggerCrt();
    toggleTheme();
  };

  const staticFallbackModels = [
    { 
      id: "sakana-fugu-ultra", 
      name: "Sakana: Fugu Ultra", 
      score: 96, 
      context_length: 1000000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000005", completion: "0.00003" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Top-tier agentic routing model." : "顶级的Agentic路由调度模型。", 
      benchmarks: { intelligence_index: 85, coding_index: 80, agentic_index: 92 },
      provider: "Sakana AI",
      model_id: "sakana/fugu-ultra",
      max_output: 4096,
      ttft: 110,
      throughput: 145,
      reliability: "99.99%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Agentic Routing", "Vision BD Outreach"] : ["Agentic 路由", "视觉 BD 拓展"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Recommended for fast-path routing and multi-modal pipeline operations." : "推荐用于快路径路由和多模态流水线操作。"
    },
    { 
      id: "google-gemini-3.1-flash-image", 
      name: "Gemini 3.1 Flash Image", 
      score: 92, 
      context_length: 1000000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000000075", completion: "0.0000003" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Superfast multimodal vision model." : "超快的多模态视觉大模型。", 
      benchmarks: { intelligence_index: 88, coding_index: 85, agentic_index: 78 },
      provider: "Google",
      model_id: "google/gemini-3.1-flash-image",
      max_output: 8192,
      ttft: 85,
      throughput: 220,
      reliability: "99.98%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Vision Verification", "High-frequency Scraping"] : ["视觉验证", "高频爬取"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Highly recommended for vision checks and high-volume background tasks due to its speed and low pricing." : "由于其极高的速度和极低的价格，强烈推荐用于视觉校验和海量后台任务。"
    },
    { 
      id: "cohere-north-mini-code-free", 
      name: "Cohere: North Mini Code", 
      score: 88, 
      context_length: 128000, 
      modality: "text->text", 
      pricing: { prompt: "0", completion: "0" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Highly efficient coding model (free)." : "高效的开源代码模型 (免费)。", 
      benchmarks: { intelligence_index: 80, coding_index: 95, agentic_index: 84 },
      provider: "Cohere",
      model_id: "cohere/north-mini-code",
      max_output: 4096,
      ttft: 95,
      throughput: 180,
      reliability: "99.99%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Automated Coding", "Syntax Lints"] : ["自动代码生成", "语法校验"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Perfect for code linting and standard text-based agent loops." : "非常适合代码规范校验和标准的文本智能体循环操作。"
    },
    { 
      id: "z-ai-glm-5.2", 
      name: "Z.ai: GLM 5.2", 
      score: 85, 
      context_length: 128000, 
      modality: "text->text", 
      pricing: { prompt: "0.0000001", completion: "0.0000002" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Leading reasoning and multilingual model." : "领先的推理与多语言大模型。", 
      benchmarks: { intelligence_index: 90, coding_index: 88, agentic_index: 89 },
      provider: "Z.ai",
      model_id: "z-ai/glm-5.2",
      max_output: 4096,
      ttft: 120,
      throughput: 110,
      reliability: "99.95%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Bilingual Translation", "Structured Reasoning"] : ["双语翻译", "结构化推理"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Excellent balanced model for localized tasks and multi-agent coordination." : "优秀的平衡大模型，适用于本地化任务 and 多智能体协作协调。"
    },
    { 
      id: "moonshotai-kimi-k2.7-code", 
      name: "Moonshot: Kimi K2.7 Code", 
      score: 82, 
      context_length: 200000, 
      modality: "text->text", 
      pricing: { prompt: "0.000001", completion: "0.000002" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Chinese code generation benchmark leader." : "中文代码生成与长文本理解专家。", 
      benchmarks: { intelligence_index: 82, coding_index: 91, agentic_index: 81 },
      provider: "Moonshot",
      model_id: "moonshot/kimi-k2.7-code",
      max_output: 8192,
      ttft: 130,
      throughput: 95,
      reliability: "99.96%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Chinese Dev Operations", "Long Codebases"] : ["中文开发运维", "长代码仓库解析"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Recommended for long-context analysis of complex Chinese codebases." : "推荐用于对复杂的中文长代码仓库进行深入分析与理解。"
    },
    { 
      id: "anthropic-claude-fable-latest", 
      name: "Claude Fable Latest", 
      score: 79, 
      context_length: 200000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000003", completion: "0.000015" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Anthropic's next-gen reasoning agent." : "Anthropic新一代推理Agent model。", 
      benchmarks: { intelligence_index: 98, coding_index: 96, agentic_index: 97 },
      provider: "Anthropic",
      model_id: "anthropic/claude-fable-latest",
      max_output: 8192,
      ttft: 145,
      throughput: 85,
      reliability: "99.99%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Complex System Design", "Strategic Autonomy"] : ["复杂系统设计", "战略性自主规划"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Frontier intelligence. Ideal for high-level decision tasks and complex agent architectures." : "前沿的顶级智能。最适合高级决策任务和复杂的智能体架构设计。"
    },
    { 
      id: "anthropic-claude-fable-5", 
      name: "Claude Fable 5", 
      score: 76, 
      context_length: 200000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000003", completion: "0.000015" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Anthropic's core reasoning flagship." : "Anthropic核心推理旗舰模型。", 
      benchmarks: { intelligence_index: 96, coding_index: 94, agentic_index: 95 },
      provider: "Anthropic",
      model_id: "anthropic/claude-fable-5",
      max_output: 8192,
      ttft: 150,
      throughput: 90,
      reliability: "99.99%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Architectural Planning", "System Evaluation"] : ["架构规划", "系统级深度评估"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Standard flagship. Delivers high logic performance and agentic reliability." : "旗舰级标准。具有极高的逻辑表现和可靠的智能体操作执行率。"
    },
    { 
      id: "nex-agi-nex-n2-pro", 
      name: "Nex AGI: Nex-N2-Pro", 
      score: 68, 
      context_length: 64000, 
      modality: "text->text", 
      pricing: { prompt: "0.0000015", completion: "0.0000045" }, 
      description: (language !== 'zh-CN' && language !== 'zh-TW') ? "Frontier agentic workflow logic model." : "前沿Agentic工作流逻辑模型。", 
      benchmarks: { intelligence_index: 70, coding_index: 68, agentic_index: 85 },
      provider: "Nex AGI",
      model_id: "nex-agi/nex-n2-pro",
      max_output: 4096,
      ttft: 165,
      throughput: 75,
      reliability: "99.92%",
      use_cases: (language !== 'zh-CN' && language !== 'zh-TW') ? ["Workflow Execution", "Logic Branching"] : ["工作流执行", "逻辑分支决策"],
      verdict: (language !== 'zh-CN' && language !== 'zh-TW') ? "Niche logic model optimized for branching workflows and direct execution commands." : "专为分支工作流和命令直接执行优化的小众逻辑模型。"
    }
  ];

  const activeModels = openRouterModels.length > 0 ? openRouterModels : staticFallbackModels;

  const getModelSpecs = (model: any) => {
    const isFallback = staticFallbackModels.find(m => m.id === model.id);
    
    let provider = model.provider || "OpenRouter";
    if (model.name.toLowerCase().includes("google") || model.id.toLowerCase().includes("google") || model.id.toLowerCase().includes("gemini")) provider = "Google";
    else if (model.name.toLowerCase().includes("anthropic") || model.id.toLowerCase().includes("claude")) provider = "Anthropic";
    else if (model.name.toLowerCase().includes("sakana") || model.id.toLowerCase().includes("fugu")) provider = "Sakana AI";
    else if (model.name.toLowerCase().includes("cohere") || model.id.toLowerCase().includes("north")) provider = "Cohere";
    else if (model.name.toLowerCase().includes("z-ai") || model.id.toLowerCase().includes("glm")) provider = "Z.ai";
    else if (model.name.toLowerCase().includes("moonshot") || model.id.toLowerCase().includes("kimi")) provider = "Moonshot";
    else if (model.name.toLowerCase().includes("nex")) provider = "Nex AGI";

    return {
      provider,
      model_id: model.model_id || model.id,
      max_output: model.max_output || (isFallback?.max_output) || 4096,
      ttft: model.ttft || (isFallback?.ttft) || 120,
      throughput: model.throughput || (isFallback?.throughput) || 95,
      reliability: model.reliability || (isFallback?.reliability) || "99.98%",
      use_cases: model.use_cases || (isFallback?.use_cases) || ((language !== 'zh-CN' && language !== 'zh-TW') ? ["Reasoning Tasks", "Text Generation"] : ["推理任务", "文本生成"]),
      verdict: model.verdict || (isFallback?.verdict) || ((language !== 'zh-CN' && language !== 'zh-TW') ? "Highly capable general runtime. Suitable for standard OS workflows." : "高效的通用运行环境。适用于标准OS工作流。")
    };
  };

  const getLangLabel = (lang: Language) => {
    if (lang === "en") return "EN";
    if (lang === "zh-CN") return "简";
    if (lang === "zh-TW") return "繁";
    if (lang === "vi") return "VI";
    if (lang === "ms") return "MY";
    return "EN";
  };

  return (
    <div className={`relative w-full min-h-[100dvh] transition-colors duration-1000 ${theme === "matrix-mode" ? "bg-theme-void" : "bg-theme-void"}`}>
      
      {/* Background Matrix Rain */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FallingPattern opacity={0.3} />
      </div>

      {/* Global CRT Noise Overlay */}
      <div className="pointer-events-none fixed inset-0 z-[998] opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <AnimatePresence>
        {bootPhase === "guan" && <GuanFrontispiece onComplete={handleGuanComplete} />}
      </AnimatePresence>

      {crtFlash && (
        <div className="fixed inset-0 z-[999] pointer-events-none mix-blend-screen bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-pulse opacity-80" />
      )}

      {/* --- Main Bento Grid --- */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={bootPhase === "ready" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1600px] w-full pt-8 md:pt-16 pb-32"
      >
        
        {bootPhase === "ready" && (
          <div className="flex flex-col gap-12 md:gap-24 fade-in">
        <BentoGrid>
          {/* Row 1 */}
          {/* 00: The Anchor (Hero Command Card) */}
          <OSCard className="col-span-1 row-span-1 flex flex-col justify-between p-6 bg-theme-accent/5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-theme-accent/10 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10">
              <div 
                className="w-48 md:w-56 h-12 mb-6 bg-theme-text"
                style={{
                  WebkitMaskImage: 'url(/kairma-logo.svg)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'left center',
                  maskImage: 'url(/kairma-logo.svg)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                }}
              />
              <p className="font-mono text-sm tracking-tight text-theme-text font-bold mb-4">
                {siteCopy.hero.h1}
              </p>
              <p className="font-mono text-xs text-theme-text-muted leading-relaxed">
                {siteCopy.hero.sub}
              </p>
            </div>
            
            <div className="mt-6 relative z-10 flex flex-col justify-between flex-1">
              <div className="group/cta">
                <button 
                  onMouseEnter={() => setIsDeployHovered(true)}
                  onMouseLeave={() => setIsDeployHovered(false)}
                  onClick={() => setPilotOpen(true)}
                  className="relative w-full py-3 mb-2 bg-theme-accent text-[#0B0E0B] font-mono text-xs font-bold uppercase tracking-widest rounded transition-all hover:scale-[1.02] hover:shadow-[0_0_15px_var(--color-theme-accent)] overflow-hidden group/btn"
                >
                  <span className="relative z-10 group-hover/btn:hidden">{siteCopy.hero.cta_primary}</span>
                  <span className="relative z-10 hidden group-hover/btn:inline-flex items-center gap-1">
                    DEPLOYMENT REQUEST PREPARED<span className="w-1.5 h-3 bg-[#0B0E0B] animate-pulse" />
                  </span>
                </button>
                <button className="w-full py-2 border border-theme-border/50 text-theme-text font-mono text-xs uppercase tracking-widest rounded hover:border-theme-accent transition-colors mb-6">
                  {siteCopy.hero.cta_secondary}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="px-4 py-1.5 rounded-full border border-theme-border/30 text-[10px] md:text-xs font-mono uppercase flex items-center gap-2 select-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse shadow-[0_0_5px_var(--color-theme-accent)]" />
                  {(language !== "zh-CN" && language !== "zh-TW") ? "System: Online" : "系统状态: 在线"}
                </div>
                <ThemeSwitcher />
              </div>
            </div>
          </OSCard>

          {/* 01: Main Hero Canvas */}
          <OSCard className="col-span-1 md:col-span-3 row-span-1 p-0 overflow-hidden relative min-h-[400px]">
            <div className="w-full h-full flex flex-col md:flex-row relative">
              
              {/* Top-Right Mini Status */}
              <div className="absolute top-4 right-6 z-30 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1 bg-theme-void/80 backdrop-blur-sm border border-theme-accent/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                <span className="font-mono text-[9px] md:text-xs uppercase tracking-widest text-theme-accent">OPENROUTER SYNC: LIVE</span>
              </div>

              {/* Left 55%: Copy and System Status */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between relative z-20 pointer-events-none">
                
                <div className="pointer-events-none">
                  <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-tight mb-4 leading-tight text-theme-text drop-shadow-xl text-balance">
                    {siteCopy.hero.sub}
                  </h1>
                  
                  <p className="font-mono text-sm text-theme-text-muted leading-relaxed drop-shadow-md mb-8 max-w-xl">
                    {siteCopy.hero.bio}
                  </p>
                </div>

                {/* Status List */}
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] md:text-xs uppercase tracking-widest pt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-theme-accent rounded-full animate-pulse shadow-[0_0_5px_var(--color-theme-accent)]" />
                    <span className="text-theme-accent font-bold">Agent OS online</span>
                  </div>
                  <span className="text-theme-border/50 select-none">/</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-theme-text-muted">Data routing</span>
                  </div>
                  <span className="text-theme-border/50 select-none">/</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-theme-text-muted">Workflow sync</span>
                  </div>
                  <span className="text-theme-border/50 select-none">/</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-theme-text-muted">Runtime sealed</span>
                  </div>
                </div>
              </div>

              {/* Right 45%: Globe */}
              <div className="w-full md:w-[45%] h-[400px] relative z-10 flex items-center justify-center">
                <DeploymentGlobe theme={theme} />
              </div>
            </div>
          </OSCard>

          {/* Row 2 */}
          {/* 02: The Boot (Interactive Box) - 1x1 */}
          <InteractiveBootBox 
            language={language}
            setLanguage={setLanguage}
            triggerCrt={triggerCrt}
            getLangLabel={getLangLabel}
            className="col-span-1 md:col-span-1 row-span-1"
          />

          {/* Section 1: The Shift - 2x1 */}
          <OSCard className="col-span-1 md:col-span-2 row-span-1 relative overflow-hidden group">
            
            {/* Absolute background torus image hugging the right side with fade-out masks */}
            <div className="absolute top-0 right-0 bottom-0 w-[50%] md:w-[46%] pointer-events-none z-0 select-none">
              <img 
                src={theme === "xuan-mode" ? "/Bentos/d2-xuan.png" : "/Bentos/d2.png"} 
                alt="Deployment Torus" 
                className={`w-full h-full object-fill transition-opacity duration-1000 ${
                  theme === "xuan-mode" ? "mix-blend-multiply" : "opacity-45 mix-blend-screen"
                }`} 
                style={{
                  // Soft radial gradient mask centered near the torus to blend perfectly on all sides
                  WebkitMaskImage: "radial-gradient(circle at 90% 75%, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 65%)",
                  maskImage: "radial-gradient(circle at 90% 75%, rgba(0,0,0,1) 10%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 65%)"
                }}
              />
            </div>

            {/* Left Column Content: 65% width to overlay on top of bg with padding */}
            <div className="w-full md:w-[65%] p-6 md:p-8 flex flex-col justify-between min-h-[300px] relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                  <span className="font-mono text-[10px] md:text-xs text-theme-accent uppercase tracking-widest">
                    {(language !== 'zh-CN' && language !== 'zh-TW') ? 'The Shift' : '转移'}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight text-theme-text mb-6">
                {siteCopy.s01_problem.heading}
                </h2>
              </div>

              {/* Pipeline Node Flow Layout */}
              <div className="relative w-full flex items-center justify-between my-6 py-2 px-1">
                
                {/* Node 0: Model Capability */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 0 
                        ? 'border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]' 
                        : 'border-theme-border/50'
                    }`}
                  >
                    <CpuIcon 
                      ref={(el) => { iconRefs.current[0] = el; }} 
                      size={20} 
                      color={pipelineState === 0 ? "var(--theme-accent)" : "var(--theme-text-muted)"} 
                    />
                  </div>
                  <span className={`font-mono text-[8px] md:text-xs uppercase tracking-widest text-center transition-colors duration-500 ${
                    pipelineState === 0 ? 'text-theme-text font-bold' : 'text-theme-text-muted'
                  } mt-1`}>
                    Model
                  </span>
                </div>

                {/* Connector Line 0 */}
                <div className="flex-1 h-[2px] bg-theme-border/20 relative mx-2">
                  <div className={`absolute inset-0 bg-theme-accent/20 transition-opacity duration-500 ${pipelineState === 1 ? 'opacity-100' : 'opacity-0'}`} />
                  {pipelineState === 1 && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-theme-accent to-transparent shadow-[0_0_8px_var(--color-theme-accent)]"
                      initial={{ left: "-40px" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* Node 1: Workflow */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 2 
                        ? 'border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]' 
                        : 'border-theme-border/50'
                    }`}
                  >
                    <GearIcon 
                      ref={(el) => { iconRefs.current[1] = el; }} 
                      size={20} 
                      color={pipelineState === 2 ? "var(--theme-accent)" : "var(--theme-text-muted)"} 
                    />
                  </div>
                  <span className={`font-mono text-[8px] md:text-xs uppercase tracking-widest text-center transition-colors duration-500 ${
                    pipelineState === 2 ? 'text-theme-text font-bold' : 'text-theme-text-muted'
                  } mt-1`}>
                    Workflow
                  </span>
                </div>

                {/* Connector Line 1 */}
                <div className="flex-1 h-[2px] bg-theme-border/20 relative mx-2">
                  <div className={`absolute inset-0 bg-theme-accent/20 transition-opacity duration-500 ${pipelineState === 3 || pipelineState === 4 ? 'opacity-100' : 'opacity-0'}`} />
                  {pipelineState === 3 && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-theme-accent to-transparent shadow-[0_0_8px_var(--color-theme-accent)]"
                      initial={{ left: "-40px" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* Node 2: Deployment */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 4 
                        ? 'border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]' 
                        : 'border-theme-border/50'
                    }`}
                  >
                    <PlugConnectedIcon 
                      ref={(el) => { iconRefs.current[2] = el; }} 
                      size={20} 
                      color={pipelineState === 4 ? "var(--theme-accent)" : "var(--theme-text-muted)"} 
                    />
                  </div>
                  <span className={`font-mono text-[8px] md:text-xs uppercase tracking-widest text-center transition-colors duration-500 ${
                    pipelineState === 4 ? 'text-theme-text font-bold' : 'text-theme-text-muted'
                  } mt-1`}>
                    Deployment
                  </span>
                </div>

                {/* Connector Line 2 */}
                <div className="flex-1 h-[2px] bg-theme-border/20 relative mx-2">
                  <div className={`absolute inset-0 bg-theme-accent/20 transition-opacity duration-500 ${pipelineState === 5 || pipelineState === 6 ? 'opacity-100' : 'opacity-0'}`} />
                  {pipelineState === 5 && (
                    <motion.div
                      className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-theme-accent to-transparent shadow-[0_0_8px_var(--color-theme-accent)]"
                      initial={{ left: "-40px" }}
                      animate={{ left: "100%" }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                    />
                  )}
                </div>

                {/* Node 3: Outcome */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 6 
                        ? 'border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]' 
                        : 'border-theme-border/50'
                    }`}
                  >
                    <DoubleCheckIcon 
                      ref={(el) => { iconRefs.current[3] = el; }} 
                      size={20} 
                      color={pipelineState === 6 ? "var(--theme-accent)" : "var(--theme-text-muted)"} 
                    />
                  </div>
                  <span className={`font-mono text-[8px] md:text-xs uppercase tracking-widest text-center transition-colors duration-500 ${
                    pipelineState === 6 ? 'text-theme-text font-bold' : 'text-theme-text-muted'
                  } mt-1`}>
                    Outcome
                  </span>
                </div>
              </div>

              <div className="mt-4 font-mono text-sm text-theme-text-muted leading-relaxed whitespace-pre-line">
                {(language !== 'zh-CN' && language !== 'zh-TW') 
                  ? "Models got better.\nBut deployment velocity is\nwhere outcomes compound." 
                  : "模型变得更好了。\n但是部署速度才是\n业务成果产生复利的地方。"}
              </div>
            </div>

          </OSCard>

          {/* Section 3: Forward Deployment */}
          <OSCard className="col-span-1 md:col-span-1 row-span-1 p-6 min-h-[250px] md:min-h-[300px] relative overflow-hidden group">
            <div>
              <h2 className="text-xl font-mono font-bold leading-tight mb-2 text-theme-text">{siteCopy.s05_architecture.heading}</h2>
              <p className="font-mono text-xs text-theme-text-muted leading-relaxed">{siteCopy.s05_architecture.customer_side}</p>
            </div>
          </OSCard>

          {/* Row 3 */}
          {/* 03: The Foundry (Radar Chart replaced with dynamic horizontal bar chart) */}
          <OSCard className="col-span-1 md:col-span-3 row-span-2 p-6 flex flex-col overflow-hidden min-h-[550px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
                <h3 className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm">{siteCopy.s06_moats.heading}</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded text-[9px] md:text-xs font-mono tracking-wider">
                <span className={`w-1.5 h-1.5 rounded-full ${modelsLoading ? "bg-amber-500 animate-pulse" : "bg-theme-accent"}`} />
                <span className="text-theme-text-muted">
                  {modelsLoading ? ((language !== 'zh-CN' && language !== 'zh-TW') ? "SYNCING..." : "同步中...") : ((language !== 'zh-CN' && language !== 'zh-TW') ? "OPENROUTER SYNC: LIVE" : "OPENROUTER同步: 运行中")}
                </span>
              </div>
            </div>

            {modelsLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-theme-text-muted font-mono text-xs uppercase tracking-widest gap-2">
                <div className="w-6 h-6 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
                <span>{(language !== 'zh-CN' && language !== 'zh-TW') ? "FETCHING LATEST RANKINGS..." : "正在获取最新排名..."}</span>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Left: Bar Chart (6 cols) */}
                <div className="lg:col-span-6 flex flex-col justify-between h-full min-h-[300px]">
                  <div>
                    {/* Metric Selector Tabs */}
                    <div className="flex gap-1.5 p-1 bg-theme-void/80 border border-theme-border/20 rounded-md mb-6">
                      {(["intelligence_index", "coding_index", "agentic_index"] as const).map((metric) => {
                        const label = metric === "intelligence_index" 
                          ? ((language !== 'zh-CN' && language !== 'zh-TW') ? "Intel" : "智能")
                          : metric === "coding_index"
                            ? ((language !== 'zh-CN' && language !== 'zh-TW') ? "Coding" : "代码")
                            : ((language !== 'zh-CN' && language !== 'zh-TW') ? "Agentic" : "智能体");
                        const isActive = chartMetric === metric;
                        return (
                          <button
                            key={metric}
                            onClick={() => setChartMetric(metric)}
                            className={`flex-1 text-center py-2 text-xs md:text-sm font-mono font-semibold uppercase tracking-wider rounded transition-all ${
                              isActive 
                                ? 'text-theme-void bg-theme-text font-extrabold shadow-sm' 
                                : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-text/5'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="flex flex-col gap-4">
                      {activeModels
                        .filter(m => m.benchmarks?.[chartMetric] != null)
                        .slice(0, 7)
                        .map((model, idx) => {
                          const val = model.benchmarks?.[chartMetric] ?? 0;
                          const maxVal = Math.max(...activeModels.map(m => m.benchmarks?.[chartMetric] ?? 0), 100);
                          const percent = Math.max(10, Math.min(100, (val / maxVal) * 100));
                          const isBaseline = activeModels.filter(m => m.benchmarks?.[chartMetric] != null)[0]?.id === model.id;
                          const barColor = chartMetric === "intelligence_index" 
                            ? "bg-gradient-to-r from-[#9C5AFF]/40 to-[#9C5AFF]" 
                            : chartMetric === "coding_index" 
                              ? "bg-gradient-to-r from-[#10A37F]/40 to-[#10A37F]" 
                              : "bg-gradient-to-r from-[#D4783A]/40 to-[#D4783A]";

                          return (
                            <div 
                              key={model.id}
                              onClick={() => setSelectedModelForModal(model)}
                              className="flex flex-col gap-1.5 transition-all cursor-pointer group/bar hover:opacity-100 opacity-90"
                            >
                              <div className="flex justify-between items-center text-xs md:text-sm font-mono text-theme-text-muted">
                                <span className={`font-bold ${isBaseline ? "text-theme-accent" : "text-theme-text"} group-hover/bar:text-theme-accent transition-colors`}>
                                  #{idx + 1} {model.name.replace("Google: ", "").replace("Anthropic: ", "").replace("Cohere: ", "").replace("Sakana: ", "")}
                                </span>
                                <span className="font-bold text-theme-text group-hover/bar:text-theme-accent transition-colors">{val}%</span>
                              </div>
                              <div className="h-2.5 w-full bg-theme-void border border-theme-border/20 rounded-full overflow-hidden flex items-center">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 0.8, ease: "easeOut" }}
                                  className={`h-full rounded-full ${barColor} transition-all`}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  
                  <div className="text-[10px] md:text-xs font-mono text-theme-text-muted/60 tracking-wider border-t border-theme-border/20 pt-4 mt-6">
                    {(language !== 'zh-CN' && language !== 'zh-TW') 
                      ? "* BENCHMARKS NORMALIZED BY ARTIFICIAL ANALYSIS LEADERBOARDS." 
                      : "* 基准数据由 ARTIFICIAL ANALYSIS 排行榜标准化。"}
                  </div>
                </div>

                {/* Right: Model list (6 cols) */}
                <div className="lg:col-span-6 flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-theme-border/30 pt-6 lg:pt-0 lg:pl-6">
                  <p className="font-mono text-xs md:text-sm font-semibold text-theme-text-muted mb-4 uppercase tracking-widest shrink-0">
                    {(language !== 'zh-CN' && language !== 'zh-TW') ? "TOP DAILY RUNTIMES" : "每日最热运行环境"}
                  </p>
                  <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
                    <div className="flex flex-col gap-2.5">
                      {activeModels.slice(0, 8).map((model, i) => {
                        const isBaseline = i === 0;
                        const specs = getModelSpecs(model);
                        return (
                          <div 
                            key={model.id} 
                            onClick={() => setSelectedModelForModal(model)}
                            className="flex justify-between items-center font-mono text-xs md:text-sm p-3.5 border border-theme-border/30 hover:border-theme-accent/40 bg-theme-void/40 hover:bg-theme-accent/5 transition-all cursor-pointer rounded group"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                              <span className={`w-4 shrink-0 font-bold ${isBaseline ? "text-theme-accent" : "text-theme-text-muted"}`}>#{i + 1}</span>
                              <span className="truncate font-bold text-theme-text group-hover:text-theme-accent transition-colors">{model.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] md:text-xs text-theme-text-muted/65 uppercase px-2.5 py-0.5 border border-theme-border/40 rounded bg-theme-void/80 font-semibold tracking-wider group-hover:border-theme-accent/30 group-hover:text-theme-accent transition-colors">
                                {specs.provider.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </OSCard>

          {/* Section 2: AI Digital Employees */}
          <OSCard className="col-span-1 md:col-span-1 row-span-2 p-6 flex flex-col justify-between overflow-hidden">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight text-theme-text text-balance">
                {(language !== 'zh-CN' && language !== 'zh-TW') 
                  ? "Your first AI digital employees, deployed – not downloaded." 
                  : "您的第一批AI数字员工，已部署，无需下载。"}
              </h2>
            </div>
            
            <div className="flex flex-col flex-1 gap-4 justify-center">
              {[
                {
                  id: "kol",
                  title: "KOL BD",
                  status: (language !== 'zh-CN' && language !== 'zh-TW') ? "Pilot-ready" : "试点就绪",
                  statusColor: "text-theme-accent",
                  dotColor: "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]",
                  ref: kolIconRef
                },
                {
                  id: "content",
                  title: "Content Ops",
                  status: (language !== 'zh-CN' && language !== 'zh-TW') ? "FDE configured" : "已配置FDE",
                  statusColor: "text-theme-accent",
                  dotColor: "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]",
                  ref: contentIconRef
                },
                {
                  id: "care",
                  title: (language !== 'zh-CN' && language !== 'zh-TW') ? "Customer Care" : "客户服务",
                  status: (language !== 'zh-CN' && language !== 'zh-TW') ? "In development" : "开发中",
                  statusColor: "text-amber-500",
                  dotColor: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                  ref: customerIconRef
                },
                {
                  id: "compliance",
                  title: (language !== 'zh-CN' && language !== 'zh-TW') ? "Compliance" : "合规审查",
                  status: (language !== 'zh-CN' && language !== 'zh-TW') ? "Private runtime" : "私有运行环境",
                  statusColor: "text-theme-accent",
                  dotColor: "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]",
                  ref: complianceIconRef
                }
              ].map((emp) => (
                <div 
                  key={emp.id}
                  onMouseEnter={() => {
                    if (emp.id === "kol") kolIconRef.current?.startAnimation();
                    if (emp.id === "content") contentIconRef.current?.startAnimation();
                    if (emp.id === "care") customerIconRef.current?.startAnimation();
                    if (emp.id === "compliance") complianceIconRef.current?.startAnimation();
                  }}
                  onMouseLeave={() => {
                    if (emp.id === "kol") kolIconRef.current?.stopAnimation();
                    if (emp.id === "content") contentIconRef.current?.stopAnimation();
                    if (emp.id === "care") customerIconRef.current?.stopAnimation();
                    if (emp.id === "compliance") complianceIconRef.current?.stopAnimation();
                  }}
                  className="flex items-stretch rounded border border-theme-border/30 bg-theme-void/50 group/emp hover:bg-theme-accent/5 hover:border-theme-accent/30 transition-all cursor-default overflow-hidden"
                >
                  {/* Left Icon Block */}
                  <div className="flex items-center justify-center w-16 border-r border-theme-border/30 bg-theme-void/80 py-4 shrink-0">
                    {emp.id === "kol" && <UserIcon ref={kolIconRef} size={24} className="text-theme-text-muted group-hover/emp:text-theme-accent transition-colors" />}
                    {emp.id === "content" && <LinkIcon ref={contentIconRef} size={24} className="text-theme-text-muted group-hover/emp:text-theme-accent transition-colors" />}
                    {emp.id === "care" && <HeadsetIcon ref={customerIconRef} size={24} className="text-theme-text-muted group-hover/emp:text-amber-500 transition-colors" />}
                    {emp.id === "compliance" && <ShieldCheck ref={complianceIconRef} size={24} className="text-theme-text-muted group-hover/emp:text-theme-accent transition-colors" />}
                  </div>
                  
                  {/* Label & Status */}
                  <div className="flex-1 flex justify-between items-center px-4 py-3">
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest text-theme-text truncate">
                        {emp.title}
                      </span>
                      <span className={`font-mono text-[10px] md:text-xs tracking-wider truncate ${emp.statusColor}`}>
                        {emp.status}
                      </span>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${emp.dotColor}`} />
                  </div>
                </div>
              ))}
            </div>
          </OSCard>

          {/* Row 4+5: Dual CTA – Developers & Operators (2 separate boxes) */}
          {/* Developers Box */}
          <OSCard className="col-span-1 md:col-span-2 row-span-1 p-0 min-h-[280px] cursor-pointer relative overflow-hidden group"
            onMouseEnter={() => codeIconRef.current?.startAnimation()}
            onMouseLeave={() => codeIconRef.current?.stopAnimation()}
          >
            {/* Full-width container to prevent hard vertical edge cut-off */}
            <div className="absolute inset-0 pointer-events-none z-0 select-none">
              <img 
                src={theme === "xuan-mode" ? "/Bentos/dev-xuan.png" : "/Bentos/dev-matrix.png"} 
                alt="Developers" 
                className={`w-full h-full object-cover object-right transition-opacity duration-1000 ${
                  theme === "xuan-mode" ? "opacity-40 mix-blend-multiply" : "opacity-25 mix-blend-screen"
                }`} 
                style={{
                  WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 65%)",
                  maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 65%)"
                }}
              />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
              <div>
                {/* Eyebrow */}
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-9 h-9 rounded-lg border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center">
                    <CodeXmlIcon ref={codeIconRef} size={18} className="text-theme-accent" />
                  </span>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'For Developers' : '面向开发者'}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight mb-3 text-theme-text">{siteCopy.s04_what.heading}</h2>
                <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-sm">{siteCopy.s04_what.footer}</p>
              </div>
              <button className="self-start mt-6 px-5 py-2.5 border border-theme-text text-theme-text font-mono text-xs uppercase tracking-widest rounded group-hover:bg-theme-text group-hover:text-theme-void transition-colors flex items-center gap-2">
                {(language !== "zh-CN" && language !== "zh-TW") ? "View Docs" : "查看文档"} <span>→</span>
              </button>
            </div>
          </OSCard>

          {/* Operators Box */}
          <OSCard 
            className="col-span-1 md:col-span-2 row-span-1 p-0 min-h-[280px] cursor-pointer relative overflow-hidden group"
            onMouseEnter={() => shieldCtaIconRef.current?.startAnimation()}
            onMouseLeave={() => shieldCtaIconRef.current?.stopAnimation()}
          >
            <div onClick={() => setPilotOpen(true)} className="w-full h-full relative">
              {/* Full-width container to prevent hard vertical edge cut-off */}
              <div className="absolute inset-0 pointer-events-none z-0 select-none">
                <img 
                  src={theme === "xuan-mode" ? "/Bentos/d1-xuan.png" : "/Bentos/d1.png"} 
                  alt="Operators" 
                  className={`w-full h-full object-cover object-right transition-opacity duration-1000 ${
                    theme === "xuan-mode" ? "opacity-50 mix-blend-multiply" : "opacity-30 mix-blend-screen"
                  }`} 
                  style={{
                    WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 65%)",
                    maskImage: "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 65%)"
                  }}
                />
              </div>
              <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
                <div>
                  {/* Eyebrow */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="w-9 h-9 rounded-lg border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center">
                      <ShieldCheck ref={shieldCtaIconRef} size={18} className="text-theme-accent" />
                    </span>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'For Operators' : '面向运营者'}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight mb-3 text-theme-text group-hover:text-theme-accent transition-colors">{siteCopy.s08_howitworks.heading}</h2>
                  <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-sm">{siteCopy.s07_story.heading}</p>
                </div>
                <div className="mt-6">
                  <button className="self-start px-5 py-2.5 bg-theme-accent text-[#0B0E0B] font-mono text-xs font-bold uppercase tracking-widest rounded hover:bg-white transition-colors flex items-center gap-2">
                    {siteCopy.hero.cta_primary} <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </OSCard>
        </BentoGrid>
          </div>
        )}
      </motion.main>

      {/* Model Detail Popup Modal */}
      <AnimatePresence>
        {selectedModelForModal && (() => {
          const model = selectedModelForModal;
          const specs = getModelSpecs(model);
          const baselineModel = activeModels[0];
          const isBaseline = model.id === baselineModel.id;
          
          // Cost ratios
          const modelCost = Number(model.pricing?.prompt ?? 0) + Number(model.pricing?.completion ?? 0);
          const baseCost = Number(baselineModel.pricing?.prompt ?? 0) + Number(baselineModel.pricing?.completion ?? 0);
          const ratioPercent = baseCost > 0 ? Math.round(((baseCost - modelCost) / baseCost) * 100) : 0;
          
          return (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-theme-void/85 backdrop-blur-md z-[999] flex items-center justify-center p-4"
              onClick={() => setSelectedModelForModal(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-theme-void border border-theme-border/60 rounded-2xl w-full max-w-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(31,170,104,0.15)] relative overflow-hidden font-mono"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedModelForModal(null)}
                  className="absolute top-4 right-4 p-2 text-theme-text-muted hover:text-theme-accent transition-colors rounded-full border border-theme-border/40 hover:border-theme-accent/40 bg-theme-void"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>

                {/* Header Section */}
                <div className="mb-8 border-b border-theme-border/20 pb-5 pr-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase font-bold text-theme-accent px-2 py-0.5 border border-theme-accent/30 rounded bg-theme-accent/5">
                      {specs.provider}
                    </span>
                    <span className="text-xs uppercase font-bold text-theme-text-muted px-2 py-0.5 border border-theme-border/40 rounded bg-theme-void">
                      {(language !== 'zh-CN' && language !== 'zh-TW') ? 'Runtime Module' : '运行期模块'}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-theme-text">{model.name}</h3>
                  <p className="text-sm text-theme-text-muted mt-1 select-all">{specs.model_id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
                  {/* Left Column: Tech Specs */}
                  <div className="space-y-5">
                    <h4 className="text-sm uppercase tracking-widest text-theme-accent font-bold">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'Specs & Metrics' : '规格与指标'}</h4>
                    
                    <div className="space-y-3 text-sm text-theme-text">
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'CONTEXT WINDOW' : '上下文窗口'}</span>
                        <span className="font-bold">{(model.context_length ?? 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'MAX COMPLETION' : '最大输出限制'}</span>
                        <span className="font-bold">{(specs.max_output).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'PRICING (PROMPT)' : '计费 (输入)'}</span>
                        <span className="font-mono font-bold">${(Number(model.pricing?.prompt ?? 0) * 1000000).toFixed(2)} / 1M tkn</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'PRICING (COMP)' : '计费 (输出)'}</span>
                        <span className="font-mono font-bold">${(Number(model.pricing?.completion ?? 0) * 1000000).toFixed(2)} / 1M tkn</span>
                      </div>
                    </div>

                    {/* Cost efficiency badge */}
                    {!isBaseline && ratioPercent > 0 && (
                      <div className="p-3 border border-theme-accent/20 bg-theme-accent/5 rounded-lg flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                        <span className="text-xs text-theme-accent font-bold tracking-wide uppercase">
                          {(language !== 'zh-CN' && language !== 'zh-TW') ? `${ratioPercent}% cost savings vs baseline` : `比基线模型节省 ${ratioPercent}% 成本`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Benchmarks */}
                  <div className="space-y-5">
                    <h4 className="text-sm uppercase tracking-widest text-theme-accent font-bold">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'Benchmarks' : '基准测试'}</h4>
                    
                    <div className="space-y-4">
                      {([
                        { key: "intelligence_index", label: (language !== 'zh-CN' && language !== 'zh-TW') ? "Intelligence" : "智能程度", color: "bg-[#9C5AFF]" },
                        { key: "coding_index", label: (language !== 'zh-CN' && language !== 'zh-TW') ? "Coding Speed" : "代码生成速度", color: "bg-[#10A37F]" },
                        { key: "agentic_index", label: (language !== 'zh-CN' && language !== 'zh-TW') ? "Autonomy" : "自主执行力", color: "bg-[#D4783A]" }
                      ] as const).map((b) => {
                        const score = model.benchmarks?.[b.key];
                        const hasScore = score != null && score > 0;
                        return (
                          <div key={b.key} className={`space-y-1.5 ${!hasScore ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-center text-xs text-theme-text-muted">
                              <span className="uppercase">{b.label}</span>
                              <span className="font-bold text-theme-text">
                                {hasScore ? `${score}%` : ((language !== 'zh-CN' && language !== 'zh-TW') ? 'PENDING EVAL' : '等待评测')}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-theme-void border border-theme-border/20 rounded-full overflow-hidden">
                              {hasScore && (
                                <div className={`h-full rounded-full ${b.color}`} style={{ width: `${score}%` }} />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Operational Speeds */}
                <div className="grid grid-cols-3 gap-2.5 p-4 md:p-5 bg-theme-void/50 border border-theme-border/20 rounded-xl mb-8">
                  <div className="text-center">
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-theme-text-muted mb-1">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'LATENCY (TTFT)' : '首字延迟 (TTFT)'}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-text">{specs.ttft}ms</span>
                  </div>
                  <div className="text-center border-x border-theme-border/20">
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-theme-text-muted mb-1">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'THROUGHPUT' : '吞吐速度'}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-text">{specs.throughput} tkn/s</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-theme-text-muted mb-1">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'RELIABILITY' : '稳定性/在线率'}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-accent">{specs.reliability}</span>
                  </div>
                </div>

                {/* Verdict Section */}
                <div className="space-y-3 border-t border-theme-border/20 pt-5 text-sm">
                  <div className="flex gap-2">
                    <span className="text-theme-text-muted uppercase font-bold shrink-0">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'VERDICT:' : '运营结论:'}</span>
                    <span className="text-theme-text leading-relaxed font-bold">{specs.verdict}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-theme-text-muted uppercase font-bold shrink-0 mt-1">{(language !== 'zh-CN' && language !== 'zh-TW') ? 'USE CASES:' : '建议工作流:'}</span>
                    <div className="flex flex-wrap gap-2">
                      {specs.use_cases.map((uc: string, idx: number) => (
                        <span key={idx} className="px-2.5 py-1 border border-theme-border/40 bg-theme-void rounded text-xs text-theme-text font-bold">
                          {uc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <StickyNav />
    </div>
  );
};

export default SiteShellV3;
