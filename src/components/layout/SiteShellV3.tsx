"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { StickyNav } from "./StickyNav";
import { KairmaFooter, FOOTER_REVEAL_HEIGHT } from "./KairmaFooter";
import { BurnStream } from "@/components/ui/BurnStream";
import { BentoGrid } from "./Bento";
import { OSCard } from "@/components/ui/OSCard";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { BulletinCarousel } from "@/components/ui/BulletinCarousel";
import { MoatsAccordion } from "@/components/ui/MoatsAccordion";
import { MoatsBentoContent, RosterBentoContent } from "@/components/ui/ConnectedMoatsRosterMatrix";
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
import { useLanguage, useSiteCopyV6 } from "@/lib/language";
import { Language } from "@/data/site-translations";
import { makeT } from "@/data/ui-strings";
import { getFallbackModels } from "@/data/fallback-models";
import { GuanFrontispiece } from "@/components/visual/GuanFrontispiece";
import { BoxHeadline } from "@/components/ui/BoxHeadline";
import { EyebrowText } from "@/components/ui/EyebrowText";
import { PilotModal } from "@/components/modal/PilotModal";
import { HowDeploymentWorksModal } from "@/components/modal/HowDeploymentWorksModal";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
const KairmaHero = dynamic(() => import("@/components/3d/KairmaHero"), { ssr: false });
import NeuralPipelineHUD from "@/components/ui/NeuralPipelineHUD";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const InteractiveBootBox: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
  triggerCrt: () => void;
  getLangLabel: (lang: Language) => string;
  className?: string;
  reveal?: "left" | "right" | "bottom";
  revealDelay?: number;
}> = ({ language, setLanguage, triggerCrt, getLangLabel, className, reveal, revealDelay }) => {
  const { theme } = useTheme();
  const siteCopy = useSiteCopyV6();

  const handleNormalLanguage = (l: Language) => {
    setLanguage(l);
    triggerCrt();
  };

  return (
    <OSCard reveal={reveal} revealDelay={revealDelay} className={`relative flex flex-col min-h-[300px] md:min-h-[350px] bg-theme-void text-theme-accent font-mono border-theme-border shadow-[inset_0_0_100px_rgba(31,170,104,0.05)] overflow-hidden ${className || ""}`}>
      {/* CRT Scanlines Overlay */}
      <div className={`absolute inset-0 bg-[length:100%_4px] pointer-events-none z-10 ${
        theme === "xuan-mode" 
          ? "bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.35)_50%)] opacity-10" 
          : "bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(255,255,255,0.12)_50%)] opacity-25"
      }`} />
      
      {/* CRT Scanning Bar */}
      <motion.div 
        className={`absolute inset-0 h-[70px] bg-gradient-to-b from-transparent pointer-events-none z-10 ${
          theme === "xuan-mode" 
            ? "via-theme-accent/10 mix-blend-multiply" 
            : "via-theme-accent/35 mix-blend-screen opacity-90"
        }`}
        initial={{ top: "-70px" }}
        animate={{ top: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="relative z-20 flex-1 flex flex-col justify-between w-full h-full mx-auto p-6 md:p-8 overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-between flex-1 gap-4 w-full h-full font-mono select-none animate-in fade-in duration-500">
          <div className="text-sm md:text-base font-normal md:font-medium tracking-widest text-theme-accent/80 leading-relaxed uppercase whitespace-pre-line pb-2 border-b border-theme-border/30">
            <EyebrowText 
              text={siteCopy.bios_locale?.label || "KAIRMA OS BIOS v1.0\nLOCALE SETTINGS:"} 
              className="font-mono text-sm md:text-base font-normal md:font-medium tracking-widest text-theme-accent/80 uppercase whitespace-pre-line" 
              capitalClassName="font-gothic font-normal text-lg md:text-xl tracking-wide text-theme-accent inline" 
            />
          </div>
          <div className="grid grid-cols-2 gap-3 md:gap-4 flex-1 my-2 content-stretch">
            {(["en", "zh-TW", "vi", "ms", "ko", "ja"] as Language[]).map(l => {
              const isActive = language === l;
              return (
                <button 
                  key={l}
                  onClick={() => handleNormalLanguage(l)}
                  className={`group/btn relative flex items-center justify-between px-4 py-3.5 md:py-4 rounded-xl transition-all duration-300 font-mono text-xs md:text-sm font-bold focus:outline-none backdrop-blur-sm ${
                    isActive 
                      ? 'border border-theme-border/70 bg-theme-void text-theme-accent shadow-sm' 
                      : 'border border-transparent text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10 hover:border-theme-border/70'
                  }`}
                >
                  
                  <span>{"> [ " + getLangLabel(l).toUpperCase() + " ]"}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </OSCard>
  );
};

export const SiteShellV3: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const siteCopy = useSiteCopyV6();
  const [langOpen, setLangOpen] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [compareModel, setCompareModel] = useState<string>("gpt4o");
  const [selectedModelForModal, setSelectedModelForModal] = useState<any | null>(null);
  
  // Live OpenRouter models state
  const [openRouterModels, setOpenRouterModels] = useState<any[]>([]);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [modelsError, setModelsError] = useState<string | null>(null);
  const [modelsSyncedAt, setModelsSyncedAt] = useState<Date | null>(null);
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
  const [deploymentWorksOpen, setDeploymentWorksOpen] = useState(false);
  const [ipLocation, setIpLocation] = useState<{city: string, region: string, country: string, timezone: string} | null>(null);
  const [bootPhase, setBootPhase] = useState<"guan" | "terminal" | "ready">("guan");
  // Rain fades out while the reveal footer is uncovered — it shouldn't
  // compete with the footer for focus.
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const [footerInView, setFooterInView] = useState(false);
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
    let initialized = false;
    async function getModels(initial: boolean) {
      try {
        if (initial) setModelsLoading(true);
        const res = await fetch("/api/openrouter", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (active && Array.isArray(data.data) && data.data.length > 0) {
          setOpenRouterModels(data.data);
          setModelsSyncedAt(new Date());
          // Baseline / comparison defaults only on the first successful load —
          // background re-syncs must not reset the user's selections.
          if (!initialized) {
            initialized = true;
            const hasBenchmarks = data.data.find((m: any) => m.benchmarks && m.benchmarks.intelligence_index != null);
            if (hasBenchmarks) {
              setExpandedModel(hasBenchmarks.id);
            }
            const secondBenchmark = data.data.filter((m: any) => m.benchmarks && m.benchmarks.intelligence_index != null)[1];
            if (secondBenchmark) {
              setCompareModel(secondBenchmark.id);
            }
          }
        }
      } catch (err) {
        // Background sync failures keep the last good data silently.
        if (active && initial) {
          setModelsError(err instanceof Error ? err.message : "Error");
        }
      } finally {
        if (active && initial) {
          setModelsLoading(false);
        }
      }
    }
    getModels(true);
    // Keep the leaderboard fresh: re-sync every 5 minutes and on tab focus.
    const interval = setInterval(() => getModels(false), 5 * 60 * 1000);
    const onFocus = () => getModels(false);
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Watch the footer scroll runway; fade the rain while it's on screen.
  useEffect(() => {
    const el = runwayRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFooterInView(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [bootPhase]);

  const triggerCrt = () => {
    window.dispatchEvent(new CustomEvent('crt-flash'));
  };
  const handleThemeToggle = () => {
    triggerCrt();
    toggleTheme();
  };
  const t = makeT(language);

  const staticFallbackModels = getFallbackModels(language);

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
      use_cases: model.use_cases || (isFallback?.use_cases) || ((language !== 'zh-TW') ? ["Reasoning Tasks", "Text Generation"] : ["推理任务", "文本生成"]),
      verdict: model.verdict || (isFallback?.verdict) || ((language !== 'zh-TW') ? "Highly capable general runtime. Suitable for standard OS workflows." : "高效的通用运行环境。适用于标准OS工作流。")
    };
  };

  const getLangLabel = (lang: Language) => {
    if (lang === "en") return "EN";
    if (lang === "zh-TW") return "繁";
    if (lang === "ko") return "KR";
    if (lang === "ja") return "JP";
    if (lang === "vi") return "VI";
    if (lang === "ms") return "MY";
    return "EN";
  };

  return (
    <div className={`relative w-full min-h-[100dvh] transition-colors duration-1000 ${theme === "matrix-mode" ? "bg-theme-void" : "bg-theme-void"}`}>

      {/* Reveal footer — fixed layer UNDER the content curtain (Hermes-style).
          The scroll runway after the curtain uncovers it. */}
      <KairmaFooter />

      {/* Content curtain — opaque layer that scrolls up over the footer. */}
      <div className="relative z-10 bg-theme-void transition-colors duration-1000">

      {/* Background Matrix Rain — fades away while the footer is revealed. */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-700 ${footerInView ? "opacity-0" : "opacity-100"}`}>
        <FallingPattern opacity={0.4} speed={1.15} />
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
        initial={{ opacity: 0 }}
        animate={bootPhase === "ready" ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1600px] w-full pt-8 md:pt-16 pb-32 overflow-x-hidden"
      >
        
        <div className="flex flex-col gap-12 md:gap-24 fade-in">
        <BentoGrid>
          {/* Row 1 */}
          {/* 00: The Anchor (Hero Command Card) */}
          <OSCard cornerAccent="tr-bl" reveal="left" revealDelay={0.15} className="col-span-1 row-span-1 flex flex-col justify-between p-6 bg-theme-accent/5 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-theme-accent/10 via-transparent to-transparent opacity-50 pointer-events-none" />
            <div className="relative z-10 my-2 md:my-4">
              <div 
                className="w-full h-16 md:h-20 lg:h-24 bg-theme-text transition-all duration-500"
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
            </div>
            
            <div className="mt-6 relative z-10 flex flex-col justify-between flex-1">
              <div className="group/cta mb-4">
                <button 
                  onClick={() => setPilotOpen(true)}
                  className="relative w-full py-3 border border-theme-border/70 bg-theme-void/80 text-theme-text font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:border-theme-accent hover:text-theme-accent hover:bg-theme-accent/10 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm shadow-[0_0_15px_rgba(31,170,104,0.1)] hover:shadow-[0_0_20px_var(--color-theme-accent)] cursor-pointer"
                >
                  {siteCopy.hero_left.cta_1}
                </button>
              </div>
              <div className="flex flex-col gap-2 w-full mt-auto">
                <ThemeSwitcher />
                <SocialLinks />
              </div>
            </div>
          </OSCard>

          {/* 01: Main Hero Canvas */}
          <OSCard cornerAccent="tl-br" reveal="right" revealDelay={0.75} overflowVisible={true} className="col-span-1 md:col-span-3 row-span-1 p-0 relative min-h-[400px] z-40">
            <div className="w-full h-full flex flex-col md:flex-row relative">
              
              {/* Top-Right Mini Status */}
              <div className="absolute top-4 right-6 z-30 pointer-events-none hidden md:flex items-center gap-2 px-3 py-1 bg-theme-void/80 backdrop-blur-sm border border-theme-accent/30 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-widest text-theme-accent">OPENROUTER SYNC: LIVE</span>
              </div>

              {/* Left 55%: Copy and System Status */}
              <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-between relative z-20 pointer-events-none">
                
                <div className="pointer-events-none">
                  <h1 className="font-serif font-medium text-theme-text text-box-headline uppercase tracking-wider mb-4 text-balance drop-shadow-xl">
                    <BoxHeadline text={siteCopy.hero_center.h1} />
                  </h1>
                  
                  <p className="font-mono text-sm text-theme-text-muted leading-relaxed drop-shadow-md mb-8 max-w-xl">
                    {siteCopy.hero_center.body}
                  </p>
                </div>

                {/* Status List */}
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs uppercase tracking-widest pt-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-theme-accent rounded-full animate-pulse shadow-[0_0_5px_var(--color-theme-accent)]" />
                    <span className="text-theme-text-muted">Agent OS online</span>
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
            reveal="left"
            revealDelay={0.35}
            className="col-span-1 md:col-span-1 row-span-1"
          />

          {/* Section 1: The Shift - 2x1 */}
          <OSCard cornerAccent="tl-br" navId="shift" reveal="left" revealDelay={1.4} className="col-span-1 md:col-span-2 row-span-1 relative overflow-hidden group">
            
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

            {/* Full Width Content overlay on top of bg with padding */}
            <div className="w-full p-6 md:p-8 flex flex-col justify-between min-h-[320px] relative z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                  <span className="font-mono text-xs text-theme-accent uppercase tracking-widest">
                    <EyebrowText 
                      text={t("the_shift")} 
                      className="font-mono text-xs text-theme-accent uppercase tracking-widest" 
                      capitalClassName="font-gothic font-normal text-sm md:text-base text-theme-accent tracking-wide inline" 
                    />
                  </span>
                </div>
                <h2 className="text-box-headline font-serif font-medium text-theme-text mb-4 uppercase">
                  <BoxHeadline text={siteCopy.shift.h} />
                </h2>
                {siteCopy.shift.stat_strip ? (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 border border-theme-accent/30 bg-theme-accent/10 rounded-xl text-xs font-mono font-bold text-theme-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                    <span>{siteCopy.shift.stat_strip}</span>
                  </div>
                ) : null}
              </div>

              {/* Pipeline Node Flow Layout */}
              <div className="relative w-full flex items-center justify-between my-6 py-4 px-2 sm:px-6 bg-theme-void/80 border border-theme-border/70 rounded-2xl backdrop-blur-md shadow-[0_0_30px_rgba(31,170,104,0.05)]">
                
                {/* Node 0: Model */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 0 || pipelineState === 1
                        ? "border-theme-accent bg-theme-accent/10 shadow-[0_0_20px_var(--color-theme-accent)] scale-110"
                        : "border-theme-border/70 bg-theme-void opacity-70"
                    }`}
                  >
                    <CpuIcon 
                      ref={(el: any) => { iconRefs.current[0] = el; }}
                      size={20} 
                      color={pipelineState === 0 || pipelineState === 1 ? "var(--theme-accent)" : "currentColor"}
                    />
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
                    pipelineState === 0 || pipelineState === 1 ? "text-theme-accent scale-105" : "text-theme-text-muted"
                  }`}>
                    {siteCopy.shift.stepper.split(/→|->/)[0]?.trim() || "Write"}
                  </span>
                </div>

                {/* Connector Line 0 */}
                <div className="flex-1 h-[3px] bg-theme-border/30 relative mx-2 sm:mx-4 overflow-hidden rounded-full">
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-theme-accent/50 via-theme-accent to-theme-accent shadow-[0_0_12px_var(--color-theme-accent)] rounded-full flex justify-end items-center"
                    initial={{ width: "0%" }}
                    animate={{ width: pipelineState >= 1 ? "100%" : "0%" }}
                    transition={{ duration: pipelineState === 0 ? 0 : 1.5, ease: "easeInOut" }}
                  >
                    {pipelineState === 1 && (
                      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_15px_var(--color-theme-accent)] shrink-0 translate-x-1" />
                    )}
                  </motion.div>
                </div>

                {/* Node 1: Ship */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 2 || pipelineState === 3
                        ? "border-theme-accent bg-theme-accent/10 shadow-[0_0_20px_var(--color-theme-accent)] scale-110"
                        : "border-theme-border/70 bg-theme-void opacity-70"
                    }`}
                  >
                    <GearIcon 
                      ref={(el: any) => { iconRefs.current[1] = el; }}
                      size={20} 
                      color={pipelineState === 2 || pipelineState === 3 ? "var(--theme-accent)" : "currentColor"}
                    />
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
                    pipelineState === 2 || pipelineState === 3 ? "text-theme-accent scale-105" : "text-theme-text-muted"
                  }`}>
                    {siteCopy.shift.stepper.split(/→|->/)[1]?.trim() || "Ship"}
                  </span>
                </div>

                {/* Connector Line 1 */}
                <div className="flex-1 h-[3px] bg-theme-border/30 relative mx-2 sm:mx-4 overflow-hidden rounded-full">
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-theme-accent/50 via-theme-accent to-theme-accent shadow-[0_0_12px_var(--color-theme-accent)] rounded-full flex justify-end items-center"
                    initial={{ width: "0%" }}
                    animate={{ width: pipelineState >= 3 ? "100%" : "0%" }}
                    transition={{ duration: pipelineState === 0 ? 0 : 1.5, ease: "easeInOut" }}
                  >
                    {pipelineState === 3 && (
                      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_15px_var(--color-theme-accent)] shrink-0 translate-x-1" />
                    )}
                  </motion.div>
                </div>

                {/* Node 2: Deploy */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 4 || pipelineState === 5
                        ? "border-theme-accent bg-theme-accent/10 shadow-[0_0_20px_var(--color-theme-accent)] scale-110"
                        : "border-theme-border/70 bg-theme-void opacity-70"
                    }`}
                  >
                    <PlugConnectedIcon 
                      ref={(el: any) => { iconRefs.current[2] = el; }}
                      size={20} 
                      color={pipelineState === 4 || pipelineState === 5 ? "var(--theme-accent)" : "currentColor"}
                    />
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
                    pipelineState === 4 || pipelineState === 5 ? "text-theme-accent scale-105" : "text-theme-text-muted"
                  }`}>
                    {siteCopy.shift.stepper.split(/→|->/)[2]?.trim() || "Deploy"}
                  </span>
                </div>

                {/* Connector Line 2 */}
                <div className="flex-1 h-[3px] bg-theme-border/30 relative mx-2 sm:mx-4 overflow-hidden rounded-full">
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-theme-accent/50 via-theme-accent to-theme-accent shadow-[0_0_12px_var(--color-theme-accent)] rounded-full flex justify-end items-center"
                    initial={{ width: "0%" }}
                    animate={{ width: pipelineState >= 5 ? "100%" : "0%" }}
                    transition={{ duration: pipelineState === 0 ? 0 : 1.5, ease: "easeInOut" }}
                  >
                    {pipelineState === 5 && (
                      <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_15px_var(--color-theme-accent)] shrink-0 translate-x-1" />
                    )}
                  </motion.div>
                </div>

                {/* Node 3: Outcome */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center relative transition-all duration-500 ${
                      pipelineState === 6 || pipelineState === 7
                        ? "border-theme-accent bg-theme-accent/10 shadow-[0_0_20px_var(--color-theme-accent)] scale-110"
                        : "border-theme-border/70 bg-theme-void opacity-70"
                    }`}
                  >
                    <DoubleCheckIcon 
                      ref={(el: any) => { iconRefs.current[3] = el; }}
                      size={20} 
                      color={pipelineState === 6 || pipelineState === 7 ? "var(--theme-accent)" : "currentColor"}
                    />
                  </div>
                  <span className={`font-mono text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
                    pipelineState === 6 || pipelineState === 7 ? "text-theme-accent scale-105" : "text-theme-text-muted"
                  }`}>
                    {siteCopy.shift.stepper.split(/→|->/)[3]?.trim() || "Outcome"}
                  </span>
                </div>
              </div>

              <div className="mt-2 font-mono text-sm text-theme-text-muted leading-relaxed whitespace-pre-line max-w-3xl">
                {siteCopy.shift.body}
              </div>
            </div>

          </OSCard>

          {/* Section 3: Bulletin Carousel */}
          <OSCard cornerAccent="tr-bl" reveal="right" revealDelay={2.0} className="col-span-1 md:col-span-1 row-span-1 p-0 min-h-[300px] md:min-h-[340px] relative overflow-hidden group">
            <BulletinCarousel />
          </OSCard>

          {/* Row 3: 60:40 Split Row (60% Interactive Moats Accordion | 40% Vertically Stacked AI Employees) */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 lg:grid-cols-5 gap-3.5 md:gap-4">
            
            {/* Left 60% Bento Box (3 of 5 columns on desktop): Four Moats Expandable Accordion */}
            <OSCard
              cornerAccent="tr-bl"
              navId="moats"
              reveal="left"
              revealInView
              revealDelay={0.1}
              className="col-span-1 lg:col-span-3 p-6 md:p-8 relative overflow-hidden group min-h-[420px] flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-theme-accent/10 via-transparent to-transparent opacity-40 pointer-events-none" />
              <div className="relative z-10 w-full flex flex-col justify-between h-full">
                {/* Header & Contextual Strip filling upper section */}
                <div className="flex flex-col gap-3.5 mb-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-medium text-theme-text text-box-headline uppercase tracking-wider">
                      FOUR MOATS · ORDERED BY DEPTH
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-theme-accent/30 bg-theme-accent/10 font-mono text-xs uppercase tracking-widest text-theme-accent font-bold">
                      SYSTEM DEFENSE LAYER
                    </span>
                  </div>

                  {/* Architectural Context Bar */}
                  <div className="rounded-xl border border-theme-border/40 bg-theme-void/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2.5 text-theme-text-muted">
                      <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse shrink-0" />
                      <span>
                        Compound intelligence infrastructure designed for long-term operational defensibility.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-theme-text font-bold uppercase tracking-wider bg-theme-border/20 px-2 py-0.5 rounded">
                        4 COMPOUNDING LAYERS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Expandable 4 Moats Accordion */}
                <div className="flex-1 flex flex-col justify-end mt-4">
                  <MoatsAccordion
                    items={[
                      {
                        title: siteCopy.moats.card_1.split(/—|-/)[0]?.trim() || "SOP engine + data lake",
                        description: siteCopy.moats.card_1.split(/—|-/)[1]?.trim() || "encoded logic, deepens per run.",
                        tag: "LOGIC",
                        Icon: GearIcon,
                        readout: [
                          "$ keep run --moat 01_LOGIC",
                          "> sop_engine ...... ONLINE",
                          "> data_lake ....... DEEPENS / RUN",
                          "> status .......... HELD",
                        ],
                      },
                      {
                        title: siteCopy.moats.card_2.split(/—|-/)[0]?.trim() || "Automated deployment pipeline",
                        description: siteCopy.moats.card_2.split(/—|-/)[1]?.trim() || "built directly into operational flow.",
                        tag: "PEOPLE",
                        Icon: UserIcon,
                        readout: [
                          "$ keep run --moat 02_PEOPLE",
                          "> agent_roster .... CALIBRATED",
                          "> deployment ...... FORWARD ENGIFIED",
                          "> status .......... LIVE",
                        ],
                      },
                      {
                        title: siteCopy.moats.card_3.split(/—|-/)[0]?.trim() || "Continuous model & task routing",
                        description: siteCopy.moats.card_3.split(/—|-/)[1]?.trim() || "optimizes cost and speed continuously.",
                        tag: "MEMORY",
                        Icon: PlugConnectedIcon,
                        readout: [
                          "$ keep run --moat 03_MEMORY",
                          "> model_router .... MULTI-NODE",
                          "> latency ......... < 12ms SYNC",
                          "> status .......... OPTIMIZED",
                        ],
                      },
                      {
                        title: siteCopy.moats.card_4.split(/—|-/)[0]?.trim() || "Sovereign execution infrastructure",
                        description: siteCopy.moats.card_4.split(/—|-/)[1]?.trim() || "runs inside secure private cloud environments.",
                        tag: "SOVEREIGN",
                        Icon: ShieldCheck,
                        readout: [
                          "$ keep run --moat 04_SOVEREIGN",
                          "> air_gap ......... VERIFIED",
                          "> local_infer ..... 100% SECURE",
                          "> status .......... SEALED",
                        ],
                      },
                    ]}
                  />
                </div>
              </div>
            </OSCard>

            {/* Right 40% Bento Box (2 of 5 columns on desktop): Deployed AI Employees Stack */}
            <OSCard
              cornerAccent="tl-br"
              navId="roster"
              reveal="right"
              revealInView
              revealDelay={0.35}
              className="col-span-1 lg:col-span-2 p-6 md:p-8 relative overflow-hidden group min-h-[420px] flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-theme-accent/10 via-transparent to-transparent opacity-40 pointer-events-none" />
              <div className="relative z-10 w-full h-full">
                <RosterBentoContent
                  rosterHeading={siteCopy.workforce_rail.h}
                  rosterItems={(() => {
                    const descriptions = [
                      "Autonomous Creator & Strategic Partner Business Development Engine",
                      "End-to-End Multi-Channel Content Generation & Editorial Orchestration",
                      "24/7 Intelligent Ticket Resolution & Multi-Tier Escalation Engine",
                      "Automated Regulatory Monitoring, Audit Trail & Policy Adherence",
                    ];
                    return siteCopy.workforce_rail.items.split('·').map((rawItem, idx) => {
                      const cleanItem = rawItem.replace(/[●•]/g, '').trim();
                      const parts = cleanItem.split(/—|–| - /);
                      const role = parts[0]?.trim() || cleanItem;
                      const status = parts[1]?.trim() || "LIVE";
                      return {
                        role,
                        status,
                        description: descriptions[idx] || "Autonomous enterprise agent",
                      };
                    });
                  })()}
                />
              </div>
            </OSCard>

          </div>



          {/* Row 4+5 */}
          {/* 04: The Foundry (Leaderboard) */}
          <OSCard cornerAccent="tl-br" navId="models" reveal="bottom" revealInView className="col-span-1 md:col-span-4 row-span-2 p-6 flex flex-col overflow-hidden min-h-[620px] crt-canvas crt-vignette crt-flicker relative bg-theme-void/95">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
                <h3 className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm">
                  <EyebrowText 
                    text={t("model_leaderboard")} 
                    className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm" 
                    capitalClassName="font-gothic font-normal tracking-wide text-theme-text text-base md:text-lg inline" 
                  />
                </h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded text-xs font-mono tracking-wider">
                <span className={`w-1.5 h-1.5 rounded-full ${modelsLoading ? "bg-amber-500 animate-pulse" : "bg-theme-accent"}`} />
                <span className="text-theme-text-muted">
                  {modelsLoading ? t("syncing") : t("openrouter_live")}
                </span>
                {!modelsLoading && modelsSyncedAt && (
                  <span className="text-theme-text-muted/60">
                    {modelsSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>

            {modelsLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-theme-text-muted font-mono text-xs uppercase tracking-widest gap-2">
                <div className="w-6 h-6 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
                <span>{t("fetching_rankings")}</span>
              </div>
            ) : (
              <div className="flex-1 w-full min-h-0 flex flex-col">
                <NeuralPipelineHUD
                  models={activeModels}
                  onSelectModelForModal={setSelectedModelForModal}
                  language={language}
                  t={t}
                />
              </div>
            )}
          </OSCard>

          {/* Row 4+5: Dual CTA – Developers & Operators (2 separate boxes) */}
          {/* Developers Box */}
          <OSCard cornerAccent="tr-bl" navId="build" reveal="left" revealInView className="col-span-1 md:col-span-2 row-span-1 p-0 cursor-pointer relative overflow-hidden group"
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
                  WebkitMaskImage: "radial-gradient(ellipse 80% 50% at right center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
                  maskImage: "radial-gradient(ellipse 80% 50% at right center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)"
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
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent">
                    <EyebrowText 
                      text={siteCopy.dev_smithy.label} 
                      className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent" 
                      capitalClassName="font-gothic font-normal text-base md:text-lg tracking-wide text-theme-accent inline" 
                    />
                  </span>
                </div>
                <h2 className="text-box-headline font-serif font-medium mb-3 text-theme-text">
                  <BoxHeadline text={siteCopy.dev_smithy.h} />
                </h2>
                {siteCopy.dev_smithy.chart && (
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 border border-theme-accent/30 bg-theme-accent/5 rounded-xl text-xs font-mono font-bold text-theme-accent">
                    <span>{siteCopy.dev_smithy.chart}</span>
                  </div>
                )}
                <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-sm">{siteCopy.dev_smithy.body}</p>
              </div>
              <button className="group/btn relative self-start mt-6 px-6 py-3 border border-theme-border/70 bg-theme-void/80 text-theme-text font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:border-theme-accent hover:text-theme-accent hover:bg-theme-accent/10 transition-all duration-300 flex items-center gap-2 shadow-sm backdrop-blur-sm">
                {t("view_docs")} <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
              </button>
            </div>
          </OSCard>

          {/* Operators Box */}
          <OSCard
            cornerAccent="tl-br"
            navId="deploy"
            reveal="right"
            revealInView
            revealDelay={0.12}
            className="col-span-1 md:col-span-2 row-span-1 p-0 cursor-pointer relative overflow-hidden group"
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
                    WebkitMaskImage: "radial-gradient(ellipse 80% 50% at right center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)",
                    maskImage: "radial-gradient(ellipse 80% 50% at right center, rgba(0,0,0,1) 10%, rgba(0,0,0,0) 100%)"
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
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent">
                      <EyebrowText 
                        text={siteCopy.operators.label} 
                        className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent" 
                        capitalClassName="font-gothic font-normal text-base md:text-lg tracking-wide text-theme-accent inline" 
                      />
                    </span>
                  </div>
                  <h2 className="text-box-headline font-serif font-medium mb-3 text-theme-text group-hover:text-theme-accent transition-colors">
                    <BoxHeadline text={siteCopy.operators.h} />
                  </h2>
                  <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-sm">{siteCopy.operators.body}</p>
                  {siteCopy.operators.anchor && (
                    <div className="mt-4 p-3 border border-theme-border/70 bg-theme-void/60 rounded-xl font-mono text-xs text-theme-text-muted/90 leading-relaxed italic max-w-sm">
                      "{siteCopy.operators.anchor}"
                    </div>
                  )}
                </div>
                <button className="group/btn relative self-start mt-6 px-6 py-3 border border-theme-border/70 bg-theme-void/80 text-theme-accent font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:border-theme-accent hover:text-theme-void hover:bg-theme-accent transition-all duration-300 flex items-center gap-2 shadow-sm backdrop-blur-sm">
                  {siteCopy.operators.cta}
                </button>
              </div>
            </div>
          </OSCard>

        </BentoGrid>
        </div>
      </motion.main>

      {/* Close the content curtain. */}
      </div>

      {/* Scroll runway — empty space whose scroll uncovers the fixed footer. */}
      {bootPhase === "ready" && <div ref={runwayRef} aria-hidden style={{ height: FOOTER_REVEAL_HEIGHT }} />}

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
              className="fixed inset-0 bg-theme-void/85 backdrop-blur-md z-[999] flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
              onClick={() => setSelectedModelForModal(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-theme-void border border-theme-border/60 rounded-2xl w-full max-w-3xl p-5 sm:p-6 md:p-10 shadow-[0_0_50px_rgba(31,170,104,0.15)] relative overflow-hidden font-mono my-auto"
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
                      {t("runtime_module")}
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-theme-text">{model.name}</h3>
                  <p className="text-sm text-theme-text-muted mt-1 select-all">{specs.model_id}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
                  {/* Left Column: Tech Specs */}
                  <div className="space-y-5">
                    <h4 className="text-sm uppercase tracking-widest text-theme-accent font-bold">{t("specs_metrics")}</h4>
                    
                    <div className="space-y-3 text-sm text-theme-text">
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{t("context_window")}</span>
                        <span className="font-bold">{(model.context_length ?? 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{t("max_completion")}</span>
                        <span className="font-bold">{(specs.max_output).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{t("pricing_prompt")}</span>
                        <span className="font-mono font-bold">${(Number(model.pricing?.prompt ?? 0) * 1000000).toFixed(2)} / 1M tkn</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-theme-border/10 pb-1.5">
                        <span className="text-theme-text-muted">{t("pricing_comp")}</span>
                        <span className="font-mono font-bold">${(Number(model.pricing?.completion ?? 0) * 1000000).toFixed(2)} / 1M tkn</span>
                      </div>
                    </div>

                    {/* Cost efficiency badge */}
                    {!isBaseline && ratioPercent > 0 && (
                      <div className="p-3 border border-theme-accent/20 bg-theme-accent/5 rounded-lg flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                        <span className="text-xs text-theme-accent font-bold tracking-wide uppercase">
                          {`${ratioPercent}% ${t("cost_savings")}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Benchmarks */}
                  <div className="space-y-5">
                    <h4 className="text-sm uppercase tracking-widest text-theme-accent font-bold">{t("benchmarks")}</h4>
                    
                    <div className="space-y-4">
                      {([
                        { key: "intelligence_index", label: t("intelligence"), color: "bg-[#9C5AFF]" },
                        { key: "coding_index", label: t("coding_speed"), color: "bg-[#10A37F]" },
                        { key: "agentic_index", label: t("autonomy"), color: "bg-[#D4783A]" }
                      ] as const).map((b) => {
                        const score = model.benchmarks?.[b.key];
                        const hasScore = score != null && score > 0;
                        return (
                          <div key={b.key} className={`space-y-1.5 ${!hasScore ? 'opacity-50' : ''}`}>
                            <div className="flex justify-between items-center text-xs text-theme-text-muted">
                              <span className="uppercase">{b.label}</span>
                              <span className="font-bold text-theme-text">
                                {hasScore ? `${score}%` : t("pending_eval")}
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
                <div className="grid grid-cols-3 gap-2.5 p-4 md:p-5 bg-theme-void/50 border border-theme-border/20 rounded-2xl mb-8">
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1">{t("latency_ttft")}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-text">{specs.ttft}ms</span>
                  </div>
                  <div className="text-center border-x border-theme-border/20">
                    <span className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1">{t("throughput")}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-text">{specs.throughput} tkn/s</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs uppercase tracking-wider text-theme-text-muted mb-1">{t("reliability")}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-accent">{specs.reliability}</span>
                  </div>
                </div>

                {/* Verdict Section */}
                <div className="space-y-3 border-t border-theme-border/20 pt-5 text-sm">
                  <div className="flex gap-2">
                    <span className="text-theme-text-muted uppercase font-bold shrink-0">{t("verdict")}</span>
                    <span className="text-theme-text leading-relaxed font-bold">{specs.verdict}</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-theme-text-muted uppercase font-bold shrink-0 mt-1">{t("use_cases")}</span>
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

      <PilotModal isOpen={pilotOpen} onClose={() => setPilotOpen(false)} />
      <HowDeploymentWorksModal isOpen={deploymentWorksOpen} onClose={() => setDeploymentWorksOpen(false)} />

      {bootPhase === "ready" && <StickyNav />}
    </div>
  );
};

export default SiteShellV3;
