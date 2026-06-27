"use client";

import React, { useState, useRef, useEffect } from "react";
import { StickyNav } from "./StickyNav";
import { BurnStream } from "@/components/ui/BurnStream";
import { BentoGrid, BentoBox } from "./Bento";
import { useTheme } from "@/lib/theme";
import { useLanguage, useSiteCopy } from "@/lib/language";
import { Language } from "@/data/site-translations";
import { EvilRadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, Dot, ActiveDot } from "@/components/evilcharts/charts/radar-chart";
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
  siteCopy: any;
  triggerCrt: () => void;
  getLangLabel: (lang: Language) => string;
  className?: string;
}> = ({ language, setLanguage, siteCopy, triggerCrt, getLangLabel, className }) => {
  const [step, setStep] = useState<"LANGUAGE" | "BOOTING" | "READY" | "STORY">("LANGUAGE");
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (step === "BOOTING") {
      setVisibleLines(0);
      const delays = [800, 1400, 1800, 2200, 2600, 3000, 3400, 4200];
      const timers = delays.map((delay, index) => 
        setTimeout(() => setVisibleLines(index + 1), delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [step]);

  useEffect(() => {
    if (visibleLines >= 8 && step === "BOOTING") {
      setStep("READY");
    }
  }, [visibleLines, step]);

  const handleInitialLanguage = (l: Language) => {
    setLanguage(l);
    setStep("BOOTING");
    triggerCrt();
  };

  const handleNormalLanguage = (l: Language) => {
    setLanguage(l);
    triggerCrt();
  };

  return (
    <BentoBox className={`relative flex flex-col p-8 min-h-[300px] md:min-h-[350px] bg-theme-void text-theme-accent font-mono border-theme-border shadow-[inset_0_0_100px_rgba(31,170,104,0.05)] overflow-hidden ${className || ""}`}>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none z-10" />
      
      <div className="relative z-20 flex-1 flex flex-col w-full max-w-lg mx-auto">
        {step === "LANGUAGE" && (
          <div className="flex flex-col gap-6 w-full font-mono select-none my-auto animate-in fade-in duration-500">
            <div className="text-sm md:text-base font-bold tracking-widest text-theme-accent/80 leading-relaxed uppercase">
              KAIRMA OS BIOS v1.0<br/>INITIALIZING...<br/><br/>SELECT LOCALE:
            </div>
            <div className="flex flex-col gap-2 text-sm md:text-base font-bold">
              {(["en", "zh-CN", "zh-TW", "vi"] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => handleInitialLanguage(l)}
                  className="text-left text-theme-accent hover:text-[#2aff9b] hover:bg-theme-accent/10 p-2.5 transition-all border border-transparent hover:border-theme-accent/30 focus:outline-none"
                >
                  {"> [ " + getLangLabel(l).toUpperCase() + " ]"}
                </button>
              ))}
            </div>
          </div>
        )}

        {(step === "BOOTING" || step === "READY") && (
          <div className="flex flex-col gap-2 w-full font-mono select-none my-auto animate-in fade-in duration-500">
            {visibleLines >= 1 && <div className="text-xs md:text-sm uppercase tracking-widest">{siteCopy.boot.title}</div>}
            {visibleLines >= 2 && <div className="text-xs md:text-sm">{siteCopy.boot.separator}</div>}
            {visibleLines >= 3 && (
              <div className="text-xs md:text-sm flex justify-between">
                <span>{siteCopy.boot.steps[0].text}</span>
                <span className="text-theme-accent font-bold">{siteCopy.boot.steps[0].status}</span>
              </div>
            )}
            {visibleLines >= 4 && (
              <div className="text-xs md:text-sm flex justify-between">
                <span>{siteCopy.boot.steps[1].text}</span>
                <span className="text-theme-accent font-bold">{siteCopy.boot.steps[1].status}</span>
              </div>
            )}
            {visibleLines >= 5 && (
              <div className="text-xs md:text-sm flex justify-between">
                <span>{siteCopy.boot.steps[2].text}</span>
                <span className="text-theme-accent font-bold">{siteCopy.boot.steps[2].status}</span>
              </div>
            )}
            {visibleLines >= 6 && <div className="text-xs md:text-sm">{siteCopy.boot.separator}</div>}
            {visibleLines >= 7 && (
              <div className="text-xs md:text-sm flex items-center gap-1 leading-none mt-2">
                <span>{siteCopy.boot.ready}</span>
                {visibleLines < 8 && (
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} className="inline-block w-2 h-4 bg-theme-accent select-none">█</motion.span>
                )}
              </div>
            )}
            {step === "READY" && (
              <div className="mt-8 flex flex-col gap-2 text-sm md:text-base font-bold">
                <button 
                  onClick={() => setStep("STORY")}
                  className="text-left text-theme-accent hover:text-[#2aff9b] hover:bg-theme-accent/10 p-2.5 transition-all border border-transparent hover:border-theme-accent/30 focus:outline-none"
                >
                  {siteCopy.boot.ctaImmerse}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "STORY" && (
          <div className="flex flex-col h-full w-full justify-between animate-in fade-in duration-500 py-2">
            <div className="flex flex-col gap-4 text-sm md:text-base leading-relaxed text-theme-accent/90">
              <p className="uppercase tracking-widest text-xs text-theme-accent/50 mb-2">{siteCopy.storyIntro.osName}</p>
              {siteCopy.storyIntro.lines.map((line: string, i: number) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-auto pt-8">
              {(["en", "zh-CN", "zh-TW", "vi"] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => handleNormalLanguage(l)}
                  className={`px-4 py-1.5 text-xs border rounded-full transition-colors ${language === l ? 'border-theme-accent bg-theme-accent/10 text-theme-accent' : 'border-theme-accent/30 text-theme-accent/50 hover:border-theme-accent hover:text-theme-accent'}`}
                >
                  {getLangLabel(l)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </BentoBox>
  );
};

export const SiteShellV3: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const siteCopy = useSiteCopy();
  const [langOpen, setLangOpen] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  const [compareModel, setCompareModel] = useState<string>("gpt4o");
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [crtFlash, setCrtFlash] = useState(false);
  const [pilotOpen, setPilotOpen] = useState(false);

  const SHOW_LINEAGE = false;

  useEffect(() => {
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

  const triggerCrt = () => {
    window.dispatchEvent(new CustomEvent('crt-flash'));
  };

  const handleThemeToggle = () => {
    triggerCrt();
    toggleTheme();
  };

  const mockModels = [
    { id: "claude", name: "Claude 3.5 Sonnet", score: 96, context: "200K", desc: language === 'en' ? "Top-tier coding and complex reasoning." : "顶级的代码与复杂推理能力。" },
    { id: "gpt4o", name: "GPT-4o", score: 92, context: "128K", desc: language === 'en' ? "Fastest multimodal flagship model." : "最快的多模态旗舰大模型。" },
    { id: "gemini", name: "Gemini 1.5 Pro", score: 88, context: "2M", desc: language === 'en' ? "Massive context window for large data." : "超大上下文窗口，适合海量数据。" },
    { id: "deepseek", name: "DeepSeek Coder V2", score: 82, context: "128K", desc: language === 'en' ? "Leading open-weight coding model." : "领先的开源代码模型。" },
    { id: "qwen", name: "Qwen 2.5 Max", score: 76, context: "32K", desc: language === 'en' ? "State-of-the-art multilingual model." : "业界领先的多语言模型。" },
    { id: "llama", name: "Llama 3.1 405B", score: 68, context: "128K", desc: language === 'en' ? "Meta's frontier open-source model." : "Meta前沿开源大模型。" },
    { id: "kimi", name: "Kimi", score: 55, context: "200K", desc: language === 'en' ? "Optimized for long-context Chinese." : "专注长上下文的中文理解。" },
    { id: "mistral", name: "Mistral Large 2", score: 45, context: "128K", desc: language === 'en' ? "Highly efficient reasoning model." : "高效的推理模型。" },
  ];

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const width = carouselRef.current.clientWidth;
      setCurrentSlide(Math.round(scrollLeft / width));
    }
  };

  const scrollToSlide = (index: number) => {
    if (carouselRef.current) {
      const width = carouselRef.current.clientWidth;
      carouselRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };
  const radarData = [
    { metric: language === 'en' ? "Coding" : "代码", claude: 95, gpt4o: 88, gemini: 82, deepseek: 98, qwen: 85, llama: 70, kimi: 60, mistral: 75 },
    { metric: language === 'en' ? "Reasoning" : "推理", claude: 98, gpt4o: 95, gemini: 85, deepseek: 88, qwen: 82, llama: 80, kimi: 70, mistral: 85 },
    { metric: language === 'en' ? "Context" : "上下文", claude: 90, gpt4o: 85, gemini: 100, deepseek: 85, qwen: 75, llama: 80, kimi: 95, mistral: 70 },
    { metric: language === 'en' ? "Speed" : "速度", claude: 85, gpt4o: 98, gemini: 82, deepseek: 95, qwen: 90, llama: 88, kimi: 85, mistral: 92 },
    { metric: language === 'en' ? "Math" : "数学", claude: 82, gpt4o: 95, gemini: 90, deepseek: 92, qwen: 96, llama: 85, kimi: 65, mistral: 80 },
  ];

  const radarConfig = {
    claude: { label: "Claude", colors: { light: ["var(--theme-accent)"], dark: ["var(--theme-accent)"] } },
    gpt4o: { label: "GPT-4o", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
    gemini: { label: "Gemini", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
    deepseek: { label: "DeepSeek", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
    qwen: { label: "Qwen", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
    llama: { label: "Llama", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
    kimi: { label: "Kimi", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
    mistral: { label: "Mistral", colors: { light: ["#2563eb"], dark: ["#3b82f6"] } },
  };

  const modelsToRender = ["claude", compareModel];

  const getLangLabel = (lang: Language) => {
    if (lang === "en") return "EN";
    if (lang === "zh-CN") return "简";
    if (lang === "zh-TW") return "繁";
    if (lang === "vi") return "VI";
    return "EN";
  };

  return (
    <div className={`relative w-full min-h-[100dvh] transition-colors duration-1000 ${theme === "matrix-mode" ? "bg-theme-void" : "bg-theme-void"}`}>
      
      {crtFlash && (
        <div className="fixed inset-0 z-[999] pointer-events-none mix-blend-screen bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] animate-pulse opacity-80" />
      )}

      {/* --- Main Bento Grid --- */}
      <main className="relative z-10 w-full pt-6 md:pt-12 pb-32 transition-opacity duration-1000 opacity-100">
        <BentoGrid>
          {/* Row 1 */}
          {/* 00: The Anchor (Hero) */}
          <BentoBox className="col-span-1 row-span-1 flex flex-col justify-between p-6 bg-theme-accent/5 relative overflow-hidden group border-theme-accent/20 hover:border-theme-accent/50 transition-colors">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-theme-accent/10 via-transparent to-transparent opacity-50" />
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
                {siteCopy.fdeHero.h1}
              </p>
              <p className="font-mono text-xs text-theme-text-muted leading-relaxed">
                {siteCopy.fdeHero.sub}
              </p>
            </div>
            
            <div className="mt-8 relative z-10 flex flex-col justify-between h-full">
              <div>
                <button 
                  onClick={() => setPilotOpen(true)}
                  className="w-full py-3 mb-2 bg-theme-accent text-[#0B0E0B] font-mono text-xs font-bold uppercase tracking-widest rounded group-hover:bg-white transition-colors"
                >
                  {siteCopy.fdeHero.ctaPilot}
                </button>
                <button className="w-full py-2 border border-theme-border text-theme-text font-mono text-xs uppercase tracking-widest rounded hover:border-theme-accent transition-colors mb-6">
                  {siteCopy.fdeHero.ctaWorks}
                </button>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={handleThemeToggle}
                  className="px-4 py-1.5 rounded-full border border-theme-border text-xs font-mono uppercase hover:border-theme-accent transition-colors flex items-center gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${theme === "matrix-mode" ? "bg-white" : "bg-black"}`} />
                  {language === "en" ? "Theme" : "主题"}
                </button>
              </div>
            </div>
          </BentoBox>

          {/* 01: Partner Marquee */}
          <BentoBox className="col-span-1 md:col-span-3 row-span-1 p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-100%); }
              }
              .animate-marquee {
                animation: marquee 20s linear infinite;
              }
              /* Ensure the marquee pauses when hovering the whole container */
              .marquee-container:hover .animate-marquee {
                animation-play-state: paused;
              }
            `}</style>
            
            <div className="flex flex-col md:flex-row gap-8 justify-between z-10 relative">
              <div className="w-full">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-mono font-bold uppercase tracking-tight mb-4 leading-[1.2]">
                  {siteCopy.partnersBox.heading}
                </h2>
                <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-2xl">
                  {siteCopy.partnersBox.description}
                </p>
              </div>
            </div>
            
            {SHOW_LINEAGE && (
              <div className="mt-6 pt-4 border-t border-theme-border/30 flex flex-col gap-4 overflow-hidden marquee-container">
                <span className="font-mono text-xs text-theme-text-muted uppercase tracking-widest">
                  {siteCopy.partnersBox.marqueeLabel}
                </span>
                <div className="flex overflow-hidden">
                  {[...Array(2)].map((_, arrayIndex) => (
                    <div key={arrayIndex} className="flex gap-12 items-center shrink-0 animate-marquee pr-12">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div 
                          key={i}
                          className="w-20 h-8 md:w-24 md:h-10 bg-theme-text-muted hover:bg-theme-text transition-colors"
                          style={{
                            WebkitMaskImage: `url(/partner/l${i}.svg)`,
                            WebkitMaskSize: 'contain',
                            WebkitMaskRepeat: 'no-repeat',
                            WebkitMaskPosition: 'center',
                            maskImage: `url(/partner/l${i}.svg)`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center',
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </BentoBox>

          {/* Row 2 */}
          {/* 02: The Boot (Interactive Box) - 2x1 */}
          <InteractiveBootBox 
            language={language}
            setLanguage={setLanguage}
            siteCopy={siteCopy}
            triggerCrt={triggerCrt}
            getLangLabel={getLangLabel}
            className="col-span-1 md:col-span-2 row-span-1"
          />

          {/* Section 1: The Shift */}
          <BentoBox className="col-span-1 md:col-span-1 row-span-1 p-6 flex flex-col justify-between group gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-mono font-bold leading-tight mb-2 tracking-tight text-theme-text text-balance">
                {siteCopy.fdeShift.heading}
              </h2>
            </div>
            <p className="font-mono text-sm text-theme-text-muted leading-relaxed text-balance">{siteCopy.fdeShift.desc}</p>
          </BentoBox>

          {/* Section 3: Forward Deployment */}
          <BentoBox className="col-span-1 md:col-span-1 row-span-1 p-6 flex flex-col justify-between min-h-[250px] md:min-h-[300px] relative overflow-hidden group">
            <img 
              src={theme === "xuan-mode" ? "/Bentos/d2-xuan.png" : "/Bentos/d2.png"} 
              alt="Deployment" 
              className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none transition-opacity group-hover:opacity-70 ${theme === "xuan-mode" ? "opacity-60 mix-blend-multiply" : "opacity-40 mix-blend-screen"}`} 
            />
            <div className="relative z-10">
              <h2 className="text-xl font-mono font-bold leading-tight mb-2 text-theme-text">{siteCopy.fdeDeployment.heading}</h2>
            </div>
            <p className="font-mono text-xs text-theme-text-muted leading-relaxed relative z-10">{siteCopy.fdeDeployment.desc}</p>
          </BentoBox>

          {/* Row 3 */}
          {/* 03: The Foundry (Radar Chart) */}
          <BentoBox className="col-span-1 row-span-2 p-6 flex flex-col overflow-hidden min-h-[500px] md:min-h-[600px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm">{siteCopy.ecosystemModels.title}</h3>
              <div className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
            </div>

            {/* Radar Chart */}
            <div className="w-full h-48 md:h-56 mb-4 shrink-0 -mt-4">
              <EvilRadarChart
                config={radarConfig}
                data={radarData}
                className="w-full h-full"
              >
                <PolarGrid strokeOpacity={0.6} stroke="var(--theme-border)" strokeDasharray="4 4" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--theme-text-muted)", fontSize: 12 }} />
                <Tooltip />
                {modelsToRender.map((m, idx) => (
                  <Radar 
                    key={m}
                    dataKey={m}
                    variant={idx === 0 ? "filled" : "lines"}
                    isGlowing={idx === 0}
                  >
                    <Dot />
                    <ActiveDot />
                  </Radar>
                ))}
              </EvilRadarChart>
            </div>

            <p className="font-mono text-xs text-theme-text-muted mb-4 uppercase shrink-0">{siteCopy.ecosystemModels.subtitle}</p>
            <div className="flex-1 overflow-y-auto no-scrollbar border-t border-theme-border pt-4 -mr-2 pr-2">
              <div className="flex flex-col gap-3">
                {mockModels.map((model, i) => {
                  const isExpanded = expandedModel === model.id;
                  return (
                    <div 
                      key={model.id} 
                      onClick={() => setExpandedModel(isExpanded ? null : model.id)}
                      className={`flex flex-col font-mono text-sm p-3 border border-transparent hover:border-theme-accent/30 transition-all cursor-pointer rounded-lg group ${isExpanded ? 'bg-theme-accent/5 border-theme-accent/20' : 'hover:bg-theme-accent/10'}`}
                    >
                      <div className="flex justify-between items-center w-full mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <span className={`w-4 ${i === 0 ? "text-theme-accent" : "text-theme-text-muted"}`}>#{i + 1}</span>
                          <span className={i === 0 ? "text-theme-accent" : "text-theme-text"}>{model.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-theme-accent/70 font-mono group-hover:text-theme-accent transition-colors">
                            {model.score}
                          </span>
                          
                          {/* Compare CTA Toggle */}
                          {i === 0 ? (
                            <span className="text-xs text-theme-accent uppercase px-2 py-0.5 border border-theme-accent/30 rounded bg-theme-accent/10">
                              {language === 'en' ? 'Baseline' : '基准'}
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompareModel(model.id);
                              }}
                              className={`flex items-center gap-2 px-2 py-0.5 rounded border transition-all ${
                                compareModel === model.id 
                                  ? 'border-theme-text bg-theme-text/10 text-theme-text' 
                                  : 'border-theme-text-muted/30 text-theme-text-muted hover:border-theme-text hover:text-theme-text'
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${compareModel === model.id ? 'bg-theme-text' : 'bg-theme-text-muted/30'}`} />
                              <span className="text-xs uppercase tracking-wider">
                                {compareModel === model.id ? (language === 'en' ? 'Comparing' : '对比中') : (language === 'en' ? 'Compare' : '对比')}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Mini Bar Graph */}
                      <div className="w-full h-1 bg-theme-border/50 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${i === 0 ? "bg-theme-accent" : "bg-theme-text/40 group-hover:bg-theme-accent/60"} rounded-full transition-all duration-1000 ease-out`} 
                          style={{ width: `${model.score}%` }}
                        />
                      </div>

                      {/* Expanded State */}
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-32 opacity-100 mt-3 pt-3 border-t border-theme-border/50' : 'max-h-0 opacity-0 mt-0 pt-0'}`}>
                         <div className="flex justify-between text-xs text-theme-text-muted mb-2">
                           <span className="uppercase">{language === 'en' ? 'Context Window' : '上下文窗口'}</span>
                           <span className="text-theme-text">{model.context}</span>
                         </div>
                         <p className="text-xs text-theme-text/70 leading-relaxed">{model.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </BentoBox>

          {/* Section 2: AI Digital Employees */}
          <BentoBox className="col-span-1 md:col-span-2 row-span-1 p-6 md:p-8 flex flex-col justify-between bg-theme-text/5 transition-colors border-theme-border/50">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold leading-tight max-w-lg text-theme-text text-balance">
                {siteCopy.fdeEmployees.heading}
              </h2>
            </div>
            
            <div className="flex flex-col border-t border-theme-border/30">
              {siteCopy.fdeEmployees.roles.map((role: string, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-5 border-b border-theme-border/30 group/row hover:bg-theme-text/5 transition-colors cursor-default px-2 -mx-2">
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="font-mono text-xs text-theme-text-muted">0{idx + 1}</span>
                    <span className="font-mono text-sm md:text-base font-bold uppercase tracking-widest text-theme-text group-hover/row:translate-x-2 transition-transform duration-300">
                      {role}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-theme-accent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-theme-text-muted">Deployed</span>
                  </div>
                </div>
              ))}
            </div>
          </BentoBox>

          {/* Section 4: The Box */}
          <BentoBox className="col-span-1 md:col-span-1 row-span-1 p-6 flex flex-col justify-between gap-6 relative overflow-hidden group border-theme-border/50 hover:border-theme-accent/50 transition-colors">
            <div className="relative z-10">
              <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight mb-2 text-theme-text text-balance">
                {siteCopy.fdeBox.heading}
              </h2>
            </div>
            <p className="font-mono text-sm text-theme-text-muted leading-relaxed relative z-10 text-balance">{siteCopy.fdeBox.desc}</p>
          </BentoBox>

          {/* Row 4 */}
          {/* Section 5: Flywheel */}
          <BentoBox className="col-span-1 md:col-span-2 row-span-1 p-6 md:p-10 flex flex-col justify-between relative overflow-hidden group border-theme-border/50 hover:border-theme-accent/30 transition-colors bg-theme-text/5">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-2xl md:text-4xl font-mono font-bold leading-tight mb-6 text-theme-text group-hover:text-theme-accent transition-colors text-balance">
                {siteCopy.fdeFlywheel.heading}
              </h2>
            </div>
            <p className="font-mono text-sm md:text-base text-theme-text-muted leading-relaxed text-balance relative z-10">{siteCopy.fdeFlywheel.desc}</p>
          </BentoBox>

          {/* 07C: Local Time / Analog Clock */}
          <BentoBox className="col-span-1 row-span-1 min-h-[300px] p-6 flex flex-col items-center justify-between group">
            {mounted && time ? (
              <>
                {/* Analog Clock */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-[1.5px] border-theme-border/50 flex items-center justify-center bg-theme-text/5 shadow-inner">
                  {/* Clock ticks */}
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="absolute w-full h-full" style={{ transform: `rotate(${i * 30}deg)` }}>
                      <div className={`w-[1.5px] ${i % 3 === 0 ? 'h-3 bg-theme-text-muted/60' : 'h-2 bg-theme-text-muted/30'} mx-auto mt-1`} />
                    </div>
                  ))}
                  {/* Hour Hand */}
                  <div className="absolute w-[3px] h-10 md:h-12 bg-theme-text-muted origin-bottom rounded-full" style={{ transform: `translateY(-50%) rotate(${((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360}deg)` }} />
                  {/* Minute Hand */}
                  <div className="absolute w-[2px] h-14 md:h-16 bg-theme-text origin-bottom rounded-full" style={{ transform: `translateY(-50%) rotate(${((time.getMinutes() + time.getSeconds() / 60) / 60) * 360}deg)` }} />
                  {/* Second Hand */}
                  <div className="absolute w-[1px] h-16 md:h-20 bg-theme-accent origin-bottom rounded-full" style={{ transform: `translateY(-50%) rotate(${(time.getSeconds() / 60) * 360}deg)` }} />
                  {/* Center dot */}
                  <div className="absolute w-2 h-2 rounded-full bg-theme-accent shadow-[0_0_10px_var(--color-theme-accent-glow)]" />
                </div>

                <div className="flex flex-col items-center text-center mt-auto w-full">
                  <p className="font-mono text-xs text-theme-text-muted uppercase mb-3 tracking-widest">
                    {language === "en" ? "System Synchronized" : "系统已同步"}
                  </p>
                  
                  {/* Huge Text: TIME */}
                  <h2 className="font-mono text-3xl font-bold tracking-tighter mb-2 text-theme-text">
                    {time.getHours().toString().padStart(2, '0')}:{time.getMinutes().toString().padStart(2, '0')}:{time.getSeconds().toString().padStart(2, '0')}
                  </h2>
                  
                  {/* Bottom Text: Location & Timezone */}
                  <p className="font-mono text-xs text-theme-text uppercase tracking-widest">
                    {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[1]?.replace(/_/g, ' ') || 'LOCAL'}, {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0] || 'TIMEZONE'}
                  </p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center opacity-50">
                <span className="font-mono text-xs uppercase text-theme-text-muted">Syncing...</span>
              </div>
            )}
          </BentoBox>

          {/* Row 5 */}
          {/* Section 6: The Pilot (Developers & Operators Dual CTA) */}
          <BentoBox className="col-span-1 md:col-span-4 row-span-1 p-0 flex flex-col md:flex-row min-h-[300px]">
            {/* Developers Side */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-theme-border hover:bg-theme-text/5 transition-colors group cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-theme-text/5 rounded-bl-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700 ease-out pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold leading-tight mb-4 text-theme-text">{siteCopy.fdePilot.developers.heading}</h2>
                <p className="font-mono text-sm text-theme-text-muted leading-relaxed max-w-md">{siteCopy.fdePilot.developers.desc}</p>
              </div>
              <button className="self-start mt-8 px-6 py-3 border border-theme-text text-theme-text font-mono text-sm uppercase tracking-widest rounded group-hover:bg-theme-text group-hover:text-theme-void transition-colors flex items-center gap-2">
                {language === "en" ? "View Docs" : "查看文档"} <span>→</span>
              </button>
            </div>
            
            {/* Operators Side */}
            <div 
              className="flex-1 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group cursor-pointer"
              onClick={() => setPilotOpen(true)}
            >
              <img 
                src={theme === "xuan-mode" ? "/Bentos/d1-xuan.png" : "/Bentos/d1.png"} 
                alt="Operators" 
                className={`absolute inset-0 w-full h-full object-cover object-center z-0 transition-opacity duration-700 group-hover:opacity-70 group-hover:scale-105 pointer-events-none ${theme === "xuan-mode" ? "opacity-60 mix-blend-multiply" : "opacity-30 mix-blend-screen"}`} 
              />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-mono font-bold leading-tight mb-4 text-theme-text group-hover:text-theme-accent transition-colors">{siteCopy.fdePilot.operators.heading}</h2>
                <p className="font-mono text-sm text-theme-text-muted leading-relaxed max-w-md mb-8">{siteCopy.fdePilot.operators.desc}</p>
              </div>
              <div className="relative z-10">
                <button className="self-start px-6 py-3 bg-theme-accent text-[#0B0E0B] font-mono text-sm font-bold uppercase tracking-widest rounded hover:bg-white transition-colors flex items-center gap-2">
                  {siteCopy.fdeHero.ctaPilot} <span>→</span>
                </button>
              </div>
            </div>
          </BentoBox>
        </BentoGrid>
      </main>

      <StickyNav />
    </div>
  );
};

export default SiteShellV3;
