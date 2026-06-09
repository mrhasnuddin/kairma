"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSiteCopy, useLanguage } from "@/lib/language";
import PanelFrame from "./PanelFrame";
import Button from "../ui/Button";
import GlassWorkforceCube from "../visual/GlassWorkforceCube";
import FallingPattern from "../visual/FallingPattern";
import { useTheme } from "@/lib/theme";

const panelTranslations = {
  en: {
    solutionsTabs: {
      overview: "Overview",
      flywheel: "Flywheel",
      layers: "OS Layers",
      architecture: "Architecture",
    },
    aboutTabs: {
      mission: "Mission",
      whynow: "Why Now",
      insights: "Insights",
      moats: "Moats",
    },
    runtime: {
      online: "ONLINE",
      osName: "OS NAME",
      cpuLoad: "CPU LOAD",
      memory: "MEMORY",
      dataMode: "DATA MODE",
      status: "STATUS",
      localSealed: "LOCAL (SEALED)",
      secure: "SECURE",
      shaderActive: "▸ KAIRMA MATRIX SHADER ACTIVE",
      codesOnline: "▸ REACTION CODES ONLINE",
    }
  },
  "zh-CN": {
    solutionsTabs: {
      overview: "概览",
      flywheel: "增长飞轮",
      layers: "系统层级",
      architecture: "系统架构",
    },
    aboutTabs: {
      mission: "愿景使命",
      whynow: "时代契机",
      insights: "深度洞察",
      moats: "壁垒优势",
    },
    runtime: {
      online: "运行中",
      osName: "系统名称",
      cpuLoad: "CPU 负载",
      memory: "内存占用",
      dataMode: "数据模式",
      status: "运行状态",
      localSealed: "本地化 (安全锁定)",
      secure: "安全",
      shaderActive: "▸ KAIRMA 矩阵渲染激活",
      codesOnline: "▸ 反馈逻辑已就绪",
    }
  },
  "zh-TW": {
    solutionsTabs: {
      overview: "概覽",
      flywheel: "增長飛輪",
      layers: "系統層級",
      architecture: "系統架構",
    },
    aboutTabs: {
      mission: "願景使命",
      whynow: "時代契機",
      insights: "深度洞察",
      moats: "壁壘優勢",
    },
    runtime: {
      online: "運行中",
      osName: "系統名稱",
      cpuLoad: "CPU 負載",
      memory: "記憶體佔用",
      dataMode: "數據模式",
      status: "運行狀態",
      localSealed: "在地化 (安全鎖定)",
      secure: "安全",
      shaderActive: "▸ KAIRMA 矩陣渲染啟用",
      codesOnline: "▸ 反饋邏輯就緒",
    }
  },
  vi: {
    solutionsTabs: {
      overview: "Tổng quan",
      flywheel: "Bánh đà",
      layers: "Các lớp HĐH",
      architecture: "Kiến trúc",
    },
    aboutTabs: {
      mission: "Sứ mệnh",
      whynow: "Bối cảnh",
      insights: "Nhận thức",
      moats: "Lợi thế",
    },
    runtime: {
      online: "ĐANG HOẠT ĐỘNG",
      osName: "TÊN HỆ ĐIỀU HÀNH",
      cpuLoad: "TẢI CPU",
      memory: "BỘ NHỚ",
      dataMode: "CHẾ ĐỘ DỮ LIỆU",
      status: "TRẠNG THÁI",
      localSealed: "CỤC BỘ (BẢO MẬT)",
      secure: "AN TOÀN",
      shaderActive: "▸ TRÌNH BÓNG MA TRẬN KAIRMA ĐANG HOẠT ĐỘNG",
      codesOnline: "▸ MÃ PHẢN HỒI ĐANG HOẠT ĐỘNG",
    }
  }
};

// ==========================================
// VISUAL GRAPHICS HELPERS
// ==========================================

const LeakingPipeVisual: React.FC = () => {
  return (
    <div className="w-[120px] h-[135px] border border-theme-border/30 bg-theme-void/60 rounded-xs flex items-center justify-center relative overflow-hidden select-none flex-shrink-0">
      <div className="absolute top-1 left-1 text-theme-border text-[6px]">+</div>
      <div className="absolute top-1 right-1 text-theme-border text-[6px]">+</div>
      <div className="absolute bottom-1 left-1 text-theme-border text-[6px]">+</div>
      <div className="absolute bottom-1 right-1 text-theme-border text-[6px]">+</div>

      <svg width="90" height="115" viewBox="0 0 90 115" className="text-theme-chrome">
        <line x1="0" y1="20" x2="90" y2="20" stroke="currentColor" strokeWidth="0.2" className="opacity-15" strokeDasharray="2 4" />
        <line x1="0" y1="55" x2="90" y2="55" stroke="currentColor" strokeWidth="0.2" className="opacity-15" strokeDasharray="2 4" />
        <line x1="30" y1="0" x2="30" y2="115" stroke="currentColor" strokeWidth="0.2" className="opacity-15" strokeDasharray="2 4" />
        
        <path d="M 90,35 L 45,35" stroke="currentColor" strokeWidth="9" strokeLinecap="square" className="opacity-80" />
        <path d="M 90,35 L 45,35" stroke="#fff" strokeWidth="1" className="opacity-25" />
        <rect x="38" y="27" width="14" height="16" rx="2" fill="var(--theme-void)" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 45,43 L 45,85" stroke="currentColor" strokeWidth="7" className="opacity-80" />
        <rect x="40" y="85" width="10" height="3" fill="currentColor" />

        <circle cx="45" cy="40" r="2.5" fill="red" className="animate-pulse" />
        <path d="M 42,37 L 48,43" stroke="red" strokeWidth="0.8" />
        
        <motion.circle
          cx="45"
          cy="42"
          r="1.8"
          fill="#ef4444"
          animate={{ y: [0, 52], opacity: [1, 1, 0], scale: [1, 1.2, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
        />
        <motion.circle
          cx="45"
          cy="42"
          r="1.2"
          fill="#f87171"
          animate={{ y: [0, 52], opacity: [1, 1, 0] }}
          transition={{ duration: 1.6, delay: 0.5, repeat: Infinity, ease: "easeIn" }}
        />

        <path d="M 20,102 Q 45,98 70,102 L 70,110 L 20,110 Z" fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="0.5" />
      </svg>
      <span className="absolute bottom-1 right-2 text-[6px] text-red-500 font-mono tracking-widest uppercase animate-pulse">
        LEAK_ACTIVE
      </span>
    </div>
  );
};

const PyramidVisual: React.FC<{ selectedIdx: number | null; onSelect: (idx: number | null) => void }> = ({ selectedIdx }) => {
  const slabs = [
    { width: 34, height: 11, thickness: 7, y: 22 },  // Level 4
    { width: 48, height: 14, thickness: 8, y: 43 },  // Level 3
    { width: 62, height: 17, thickness: 9, y: 67 },  // Level 2
    { width: 76, height: 20, thickness: 10, y: 94 }, // Level 1
  ];

  return (
    <div className="w-[105px] h-[135px] flex items-center justify-center border border-theme-border/30 bg-theme-void/50 rounded-xs select-none relative flex-shrink-0">
      <div className="absolute top-0.5 left-0.5 text-theme-border/40 text-[5px]">+</div>
      <div className="absolute bottom-0.5 right-0.5 text-theme-border/40 text-[5px]">+</div>
      
      <svg width="85" height="120" viewBox="0 0 80 115" className="text-theme-chrome">
        {slabs.map((slab, idx) => {
          const isSelected = selectedIdx === idx;
          const strokeColor = isSelected ? "var(--theme-accent)" : "currentColor";
          
          const cx = 40;
          const cy = slab.y;
          const hw = slab.width / 2;
          const hh = slab.height / 2;
          const th = slab.thickness;

          const tTop = `${cx},${cy - hh}`;
          const tRight = `${cx + hw},${cy}`;
          const tBottom = `${cx},${cy + hh}`;
          const tLeft = `${cx - hw},${cy}`;
          const bRight = `${cx + hw},${cy + th}`;
          const bLeft = `${cx - hw},${cy + th}`;

          return (
            <g key={idx} className="cursor-pointer transition-all duration-300">
              <polygon
                points={`${tLeft} ${tBottom} ${cx},${cy + hh + th} ${bLeft}`}
                fill="currentColor"
                className="text-theme-chrome opacity-10"
                stroke={strokeColor}
                strokeWidth="0.5"
              />
              <polygon
                points={`${tBottom} ${tRight} ${bRight} ${cx},${cy + hh + th}`}
                fill="currentColor"
                className="text-theme-chrome opacity-20"
                stroke={strokeColor}
                strokeWidth="0.5"
              />
              <polygon
                points={`${tTop} ${tRight} ${tBottom} ${tLeft}`}
                fill="currentColor"
                className="text-theme-chrome opacity-25"
                stroke={strokeColor}
                strokeWidth="0.8"
              />
              <text 
                x={cx} 
                y={cy + 2.5} 
                fill="currentColor"
                fontSize="6.5" 
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                className="opacity-75"
              >
                {idx === 0 && "IV"}
                {idx === 1 && "III"}
                {idx === 2 && "II"}
                {idx === 3 && "I"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ==========================================
// 1. SOLUTIONS PANEL (WORKFLOW OS)
// ==========================================

interface PanelProps {
  isCompact?: boolean;
  onOpenPilot: () => void;
  activeInnerTab?: string;
  onInnerTabChange?: (tab: string) => void;
}

export const SolutionsPanel: React.FC<PanelProps> = ({
  isCompact = false,
  onOpenPilot,
  activeInnerTab,
  onInnerTabChange,
}) => {
  const { language } = useLanguage();
  const t = panelTranslations[language as keyof typeof panelTranslations] || panelTranslations.en;

  const siteCopy = useSiteCopy();
  const c = siteCopy.hero;
  const chi = siteCopy.howItWorks;
  const cwk = siteCopy.whatKairmaIs;
  const car = siteCopy.architecture;
  
  const [internalTab, setInternalTab] = useState<"overview" | "flywheel" | "layers" | "architecture">("overview");
  
  const activeTab = activeInnerTab || internalTab;
  const setTab = onInnerTabChange || setInternalTab;

  const tabs = [
    { id: "overview", label: t.solutionsTabs.overview },
    { id: "flywheel", label: t.solutionsTabs.flywheel },
    { id: "layers", label: t.solutionsTabs.layers },
    { id: "architecture", label: t.solutionsTabs.architecture },
  ];

  return (
    <PanelFrame
      title="WORKFLOW OS"
      status="active"
      terminalStyle={false}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col justify-start select-none gap-5 flex-1 min-h-0">
        {/* Dynamic Tab Selector Headers */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-theme-border/20 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`text-xs md:text-sm font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 border transition-all duration-150 rounded-xs cursor-pointer ${
                activeTab === t.id
                  ? "border-theme-accent bg-theme-accent/10 text-theme-accent"
                  : "border-theme-border/40 text-theme-text-muted hover:border-theme-text hover:text-theme-text"
              }`}
            >
              [{t.label}]
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 my-1 flex flex-col justify-start min-h-0 relative z-10 overflow-y-auto">
          {activeTab === "overview" && (
            <div className="flex flex-col justify-start gap-5 py-2">
              <div className="flex flex-col gap-3">
                <div className="text-xs md:text-sm font-mono text-theme-accent uppercase tracking-[0.18em] font-bold">
                  {c.kicker}
                </div>
                <h1 className={`font-gothic ${isCompact ? "text-3xl md:text-4xl lg:text-5xl" : "text-5xl md:text-6xl lg:text-7xl"} text-theme-text font-normal tracking-wide text-left font-blackletter border-b border-theme-border/20 max-w-fit pr-6 py-1 select-all`}>
                  Kairma
                </h1>
                <p className={`font-serif ${isCompact ? "text-base md:text-lg" : "text-2xl md:text-3xl"} font-bold tracking-tight text-theme-text leading-tight mt-2.5`}>
                  {c.tagline}
                </p>
                <p className="font-mono text-xs md:text-sm uppercase tracking-[0.15em] text-theme-accent font-bold mt-2.5">
                  ◆ {c.subTagline}
                </p>
              </div>

              <div className={`w-32 h-32 ${isCompact ? "md:w-36 md:h-36" : "md:w-44 md:h-44"} flex-shrink-0 relative mx-auto my-4`}>
                <GlassWorkforceCube speed={0.007} />
              </div>

              <div className="flex items-center gap-5 mt-auto font-mono">
                <Button variant="primary" size="md" onClick={onOpenPilot} className="font-bold border-theme-accent text-xs md:text-sm py-2 px-5">
                  {c.cta.begin}
                </Button>
              </div>
            </div>
          )}

          {activeTab === "flywheel" && (
            <div className="flex flex-col justify-start gap-4 py-1 font-mono flex-1 min-h-0">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/20 pb-2">
                {chi.heading}
              </h4>
              <div className="flex flex-col gap-4 mt-2 overflow-y-auto flex-1 min-h-0 pr-1">
                {chi.steps.map((step) => (
                  <div key={step.num} className="flex items-start gap-5 text-xs md:text-sm">
                    <span className="w-6 h-6 rounded-full border border-theme-border flex items-center justify-center text-theme-accent font-bold text-xs md:text-sm flex-shrink-0 mt-0.5">
                      {step.num}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs md:text-sm font-bold text-theme-text uppercase tracking-wider">{step.name}</span>
                      <span className="text-xs md:text-sm text-theme-text-muted leading-relaxed">{step.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "layers" && (
            <div className="flex flex-col justify-start gap-4 py-1 font-mono flex-1 min-h-0">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/20 pb-2">
                {cwk.heading}
              </h4>
              <div className={`flex flex-col ${isCompact ? "lg:flex-col" : "lg:flex-row"} md:flex-row items-center gap-4 mt-2 min-h-0`}>
                <PyramidVisual selectedIdx={null} onSelect={() => {}} />
                <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto min-h-0 pr-1 w-full">
                  {cwk.layers.map((layer) => (
                    <div key={layer.id} className="p-3.5 border border-theme-border/40 rounded-xs bg-theme-void/65 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-theme-accent border border-theme-border/60 px-2 py-0.5 rounded-xs">{layer.id}</span>
                        <span className="text-xs md:text-sm font-bold text-theme-text uppercase tracking-wider">{layer.title}</span>
                      </div>
                      <p className="text-xs md:text-sm text-theme-text-muted leading-relaxed mt-1">{layer.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="flex flex-col justify-start gap-4 py-1 font-mono flex-1 min-h-0">
              <h4 className="text-sm md:text-base font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/20 pb-2">
                {car.heading}
              </h4>
              <div className={`flex flex-col ${isCompact ? "lg:flex-col" : "lg:flex-row"} md:flex-row gap-4 mt-2 overflow-y-auto pr-1`}>
                {/* Customer Premise */}
                <div className="flex-1 p-4 border border-theme-border/40 rounded-xs bg-theme-void/60 flex flex-col gap-2.5">
                  <span className="text-xs font-bold text-theme-accent uppercase tracking-wider">{car.premise.title}</span>
                  <div className="flex flex-col gap-1.5 text-xs md:text-sm">
                    <div><span className="font-bold text-theme-text">Edge Node:</span> <span className="text-theme-text-muted">{car.premise.box} ({car.premise.specs})</span></div>
                    <div><span className="font-bold text-theme-text">Storage:</span> <span className="text-theme-text-muted">{car.premise.lakeTitle} ({car.premise.lakeDesc})</span></div>
                    <div><span className="font-bold text-theme-text">Processor:</span> <span className="text-theme-text-muted">{car.premise.engine} / {car.premise.router}</span></div>
                    <div><span className="font-bold text-theme-text">Gateway:</span> <span className="text-theme-text-muted">{car.premise.rpa}</span></div>
                  </div>
                </div>
                {/* Cloud Models */}
                <div className="flex-1 p-4 border border-theme-border/40 rounded-xs bg-theme-void/60 flex flex-col justify-start gap-2.5">
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-theme-accent uppercase tracking-wider">{car.cloud.title}</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {car.cloud.models.map((m) => (
                        <span key={m} className="px-2 py-0.5 border border-theme-border/60 text-[10px] md:text-xs text-theme-text-muted uppercase rounded-xs font-semibold">{m}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-theme-text-muted leading-relaxed mt-3">{car.cloud.desc}</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-theme-accent border border-theme-accent/20 bg-theme-accent/5 p-3.5 rounded-xs leading-relaxed mt-auto">
                ◆ {car.footer}
              </p>
            </div>
          )}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 2. CORE RUNTIME PANEL (SHADER & DIAGNOSTICS)
// ==========================================

interface CoreRuntimePanelProps {
  isCompact?: boolean;
}

export const CoreRuntimePanel: React.FC<CoreRuntimePanelProps> = ({
  isCompact = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [timeStr, setTimeStr] = useState("");
  const [timezoneStr, setTimezoneStr] = useState("");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [langDropdownOpen]);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString("en-US", { hour12: false }));
      
      const offsetMinutes = -d.getTimezoneOffset();
      const offsetHours = offsetMinutes / 60;
      const sign = offsetHours >= 0 ? "+" : "-";
      const absHours = Math.abs(offsetHours);
      setTimezoneStr(`GMT${sign}${absHours}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const t = panelTranslations[language as keyof typeof panelTranslations] || panelTranslations.en;

  const stats = [
    { label: t.runtime.osName, val: "KAIRMA OS" },
    { label: t.runtime.cpuLoad, val: "1.4% (turbopack)" },
    { label: t.runtime.memory, val: "192MB / 8GB" },
    { label: t.runtime.dataMode, val: t.runtime.localSealed },
    { label: t.runtime.status, val: t.runtime.secure },
  ];

  return (
    <PanelFrame
      title="RUNTIME CORE"
      status="active"
      terminalStyle={false}
      corners={true}
      className="h-full flex flex-col justify-between relative"
      headerRight={
        <div className="flex items-center gap-3 relative select-none" ref={dropdownRef}>
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 border border-theme-border/60 hover:border-theme-accent rounded-sm bg-theme-void/90 hover:bg-theme-void text-theme-text-muted hover:text-theme-text text-[11px] md:text-[12px] font-mono font-bold tracking-wider cursor-pointer transition-colors duration-150 outline-none"
              aria-label="Select language"
            >
              <span>
                {language === "en" && "EN"}
                {language === "zh-CN" && "简"}
                {language === "zh-TW" && "繁"}
                {language === "vi" && "VN"}
              </span>
              <span className={`text-[7px] md:text-[8px] transition-transform duration-150 ${langDropdownOpen ? "rotate-180" : ""}`}>▼</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-28 border border-theme-border bg-theme-void/95 backdrop-blur-md shadow-2xl rounded-sm py-1 z-50 flex flex-col font-mono text-[11px] md:text-[12px]">
                {(["en", "zh-CN", "zh-TW", "vi"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 cursor-pointer transition-colors duration-150 select-none ${
                      language === lang
                        ? "bg-theme-accent/15 text-theme-accent font-bold"
                        : "text-theme-text-muted hover:bg-theme-border/20 hover:text-theme-text"
                    }`}
                  >
                    {lang === "en" && "English"}
                    {lang === "zh-CN" && "简体中文"}
                    {lang === "zh-TW" && "繁體中文"}
                    {lang === "vi" && "Tiếng Việt"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-3 bg-theme-border/40 self-center mx-0.5" />

          {/* Theme Switcher Pill Toggle */}
          <div 
            onClick={toggleTheme}
            className="flex items-center gap-0.5 p-0.5 border border-theme-border/50 hover:border-theme-accent rounded-full bg-theme-void/80 cursor-pointer transition-colors duration-150 select-none"
            title="Toggle theme"
          >
            <div className={`p-1 rounded-full transition-all duration-150 ${theme === "korea-light" ? "bg-theme-accent text-theme-void" : "text-theme-text-muted hover:text-theme-text"}`}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </div>
            <div className={`p-1 rounded-full transition-all duration-150 ${theme === "matrix-dark" ? "bg-theme-accent text-theme-void" : "text-theme-text-muted hover:text-theme-text"}`}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </div>
        </div>
      }
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        <FallingPattern opacity={theme === "matrix-dark" ? 0.75 : 0.85} />
      </div>

      {/* Centering wrapper */}
      <div className="relative z-10 flex items-center justify-center p-4 md:p-6 flex-1 min-h-0 w-full h-full select-none font-mono">
        {/* Frosted Glass Overlay Card */}
        <div className={`w-full ${isCompact ? "max-w-[280px] p-4 gap-3.5" : "max-w-md p-6 md:p-8 gap-5"} bg-theme-void/85 backdrop-blur-md border border-theme-border/60 rounded-sm shadow-2xl flex flex-col relative z-20`}>
          
          {/* Diagnostics Overlay Header */}
          <div className={`flex ${isCompact ? "flex-col gap-2" : "justify-between items-center"} bg-theme-void/50 p-2.5 md:p-3.5 border border-theme-border/20 rounded-xs`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-theme-accent animate-ping" />
              <span className="text-xs md:text-sm text-theme-text font-bold">{t.runtime.online}</span>
            </div>
            
            <div className={`flex items-center ${isCompact ? "justify-between w-full" : "gap-3.5"}`}>
              <span className="text-xs md:text-sm font-bold text-theme-text tracking-wider tabular-nums">
                {timeStr || "00:00:00"} {timezoneStr}
              </span>
            </div>
          </div>

          {/* Stats List */}
          <div className={`flex flex-col ${isCompact ? "gap-2.5" : "gap-3.5"} w-full`}>
            {stats.map((s) => (
              <div key={s.label} className={`flex justify-between items-center border-b border-theme-border/20 ${isCompact ? "pb-1.5 text-[10px] md:text-xs" : "pb-2 text-xs md:text-sm"}`}>
                <span className="text-theme-text-muted tracking-wider uppercase">{s.label}</span>
                <span className="text-theme-text font-bold uppercase tracking-wider">{s.val}</span>
              </div>
            ))}
          </div>

          {/* Footer Text */}
          <div className={`border-t border-theme-border/20 ${isCompact ? "pt-3 text-[10px] md:text-xs" : "pt-4 text-xs md:text-sm"} text-theme-text-muted/65 leading-relaxed tracking-wider`}>
            {t.runtime.shaderActive}<br/>
            {t.runtime.codesOnline}
          </div>

        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 3. ABOUT PANEL (OPERATIONAL INTEL)
// ==========================================

interface AboutPanelProps {
  isCompact?: boolean;
  activeInnerTab?: string;
  onInnerTabChange?: (tab: string) => void;
}

export const AboutPanel: React.FC<AboutPanelProps> = ({
  isCompact = false,
  activeInnerTab,
  onInnerTabChange,
}) => {
  const { language } = useLanguage();
  const t = panelTranslations[language as keyof typeof panelTranslations] || panelTranslations.en;

  const siteCopy = useSiteCopy();
  const cp = siteCopy.problem;
  const cwn = siteCopy.whyNow;
  const ci = siteCopy.insight;
  const cd = siteCopy.defensibility;
  
  const [internalTab, setInternalTab] = useState<"mission" | "whynow" | "insights" | "moats">("mission");
  const [hoveredMoat, setHoveredMoat] = useState<number | null>(null);

  const activeTab = activeInnerTab || internalTab;
  const setTab = onInnerTabChange || setInternalTab;

  const tabs = [
    { id: "mission", label: t.aboutTabs.mission },
    { id: "whynow", label: t.aboutTabs.whynow },
    { id: "insights", label: t.aboutTabs.insights },
    { id: "moats", label: t.aboutTabs.moats },
  ];

  return (
    <PanelFrame
      title="OPERATIONAL INTEL"
      status="idle"
      terminalStyle={false}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col justify-start select-none gap-5 flex-1 min-h-0 w-full max-w-4xl mx-auto">
        {/* Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-theme-border/20 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`text-xs md:text-sm font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 border transition-all duration-150 rounded-xs cursor-pointer ${
                activeTab === t.id
                  ? "border-theme-accent bg-theme-accent/10 text-theme-accent"
                  : "border-theme-border/40 text-theme-text-muted hover:border-theme-text hover:text-theme-text"
              }`}
            >
              [{t.label}]
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 my-1 flex flex-col justify-start min-h-0 relative z-10 overflow-y-auto">
          {activeTab === "mission" && (
            <div className="flex flex-col justify-start gap-4 py-2 flex-1 min-h-0">
              <div className="flex flex-col justify-between gap-4 w-full">
                <div>
                  <div className="text-xs md:text-sm text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
                    {cp.title}
                  </div>
                  <h3 className={`font-serif ${isCompact ? "text-lg md:text-xl" : "text-xl md:text-2xl"} font-bold tracking-tight text-theme-text leading-tight mt-2.5`}>
                    {cp.heading}
                  </h3>
                </div>

                <div className="py-5 border-y border-theme-border/20">
                  <div className={`font-mono ${isCompact ? "text-5xl md:text-6xl lg:text-7xl" : "text-6xl md:text-7xl lg:text-8xl"} font-bold tracking-tighter text-red-500 tabular-nums leading-none`}>
                    {cp.stat.value}
                  </div>
                  <div className="text-xs md:text-sm font-serif font-bold text-theme-text mt-2.5 uppercase tracking-wider leading-tight">
                    {cp.stat.label}
                  </div>
                  <div className="text-xs md:text-sm font-mono text-theme-text-muted mt-1.5">
                    {cp.stat.context}
                  </div>
                </div>
              </div>

              {/* Added operational pain points back in */}
              <div className="flex flex-col gap-3 mt-4 border-t border-theme-border/10 pt-5 font-mono">
                <span className="text-xs font-bold text-theme-accent uppercase tracking-wider">// SYSTEM CONSTRAINTS</span>
                <div className={`grid grid-cols-1 ${isCompact ? "lg:grid-cols-1" : "lg:grid-cols-3"} md:grid-cols-3 gap-4 mt-2`}>
                  {cp.painPoints.map((pt, i) => (
                    <div key={i} className="p-4 border border-theme-border/30 bg-theme-void/45 rounded-xs text-xs md:text-sm text-theme-text-muted leading-relaxed">
                      {pt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "whynow" && (
            <div className="flex flex-col justify-start gap-4 py-1 font-mono flex-1 min-h-0">
              <div>
                <div className="text-xs md:text-sm text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
                  {cwn.title}
                </div>
                <h3 className={`font-serif ${isCompact ? "text-lg md:text-xl" : "text-xl md:text-2xl"} font-bold tracking-tight text-theme-text leading-tight mt-2.5`}>
                  {cwn.heading}
                </h3>
              </div>
              <div className={`grid grid-cols-1 ${isCompact ? "lg:grid-cols-1" : "lg:grid-cols-2"} md:grid-cols-2 gap-4 mt-4`}>
                {cwn.curves.map((curve) => (
                  <div key={curve.num} className="p-4 border border-theme-border/40 bg-theme-void/50 rounded-xs flex gap-4">
                    <span className="w-6 h-6 rounded-full border border-theme-accent flex items-center justify-center text-theme-accent font-bold text-xs flex-shrink-0 mt-0.5">
                      {curve.num}
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs md:text-sm font-bold text-theme-text uppercase tracking-wider">{curve.title}</span>
                      <span className="text-xs md:text-sm text-theme-text-muted leading-relaxed">{curve.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "insights" && (
            <div className="flex flex-col justify-start gap-4 py-1 flex-1 min-h-0">
              <div>
                <div className="text-xs md:text-sm text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
                  {ci.title}
                </div>
                <h3 className={`font-serif ${isCompact ? "text-base md:text-lg" : "text-lg md:text-xl"} font-bold tracking-tight text-theme-text leading-tight mt-2.5`}>
                  {ci.heading}
                </h3>
              </div>
              <div className={`grid grid-cols-1 ${isCompact ? "lg:grid-cols-1" : "lg:grid-cols-3"} md:grid-cols-3 gap-4 mt-2 overflow-y-auto pr-1`}>
                {ci.insights.map((ins) => (
                  <div key={ins.num} className="p-4 border border-theme-border/40 hover:border-theme-accent/60 bg-theme-void/50 transition-colors duration-150 rounded-xs flex flex-col justify-start gap-2.5 font-mono">
                    <div className="flex flex-col gap-2">
                      <div className="text-[10px] text-theme-accent font-bold tracking-widest">INSIGHT_0{ins.num}</div>
                      <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/20 pb-1.5">{ins.title.split(" ").slice(0, 3).join(" ")}...</h4>
                      <p className="text-xs md:text-sm text-theme-text-muted leading-relaxed mt-1.5">{ins.desc}</p>
                    </div>
                    <div className="text-[10px] text-theme-chrome font-bold mt-2.5 uppercase border-t border-theme-border/10 pt-2.5">
                      <span className="opacity-55">ANCHOR:</span> {ins.anchor.split(" · ")[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "moats" && (
            <div className="flex flex-col justify-start gap-4 py-1 font-mono flex-1 min-h-0">
              <div>
                <div className="text-xs md:text-sm text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
                  {cd.title}
                </div>
                <h3 className={`font-serif ${isCompact ? "text-base md:text-lg" : "text-lg md:text-xl"} font-bold tracking-tight text-theme-text leading-tight mt-2.5`}>
                  {cd.heading}
                </h3>
              </div>
              <div className={`grid grid-cols-2 ${isCompact ? "lg:grid-cols-2" : "lg:grid-cols-4"} md:grid-cols-4 gap-4 mt-2 overflow-y-auto pr-1`}>
                {cd.moats.map((moat, idx) => {
                  const isHovered = hoveredMoat === idx;
                  return (
                    <div
                      key={moat.num}
                      onMouseEnter={() => setHoveredMoat(idx)}
                      onMouseLeave={() => setHoveredMoat(null)}
                      className={`p-4 border rounded-xs transition-all duration-200 cursor-help flex flex-col justify-start gap-2 bg-theme-void/50 ${
                        isHovered ? "border-theme-accent bg-theme-accent/5" : "border-theme-border/40"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="text-[10px] text-theme-accent font-bold tracking-widest">MOAT_0{moat.num}</div>
                        <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-theme-text truncate">{moat.title}</h4>
                        <p className="text-xs md:text-sm text-theme-text-muted leading-relaxed mt-1.5">
                          {isHovered ? moat.desc : "[hover to decode]"}
                        </p>
                      </div>
                      <div className="border-t border-dashed border-theme-border/20 pt-2 text-[10px] text-theme-chrome/85 font-semibold mt-auto truncate">
                        {moat.comparison}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 4. ECOSYSTEM PANEL
// ==========================================

interface EcosystemPanelProps {
  isCompact?: boolean;
}

export const EcosystemPanel: React.FC<EcosystemPanelProps> = ({
  isCompact = false,
}) => {
  const siteCopy = useSiteCopy();
  const cs = siteCopy.story;
  const cp = siteCopy.partners;
  const cf = siteCopy.footer;
  const cphoto = siteCopy.photography;
  const caudio = siteCopy.audio;

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [internalTab, setInternalTab] = useState<"origins" | "guidelines">("origins");

  const tabs = [
    { id: "origins", label: "Origins & Nodes" },
    { id: "guidelines", label: "Brand DNA" },
  ];

  return (
    <PanelFrame
      title="ECOSYSTEM"
      status="idle"
      terminalStyle={false}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col justify-start select-none gap-5 flex-1 min-h-0">
        {/* Tabs Selector */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-theme-border/20 pb-3">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setInternalTab(t.id as any)}
              className={`text-xs md:text-sm font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 border transition-all duration-150 rounded-xs cursor-pointer ${
                internalTab === t.id
                  ? "border-theme-accent bg-theme-accent/10 text-theme-accent"
                  : "border-theme-border/40 text-theme-text-muted hover:border-theme-text hover:text-theme-text"
              }`}
            >
              [{t.label}]
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="flex-1 my-1 flex flex-col justify-start min-h-0 relative z-10 overflow-y-auto">
          {internalTab === "origins" && (
            <div className="flex flex-col justify-start gap-4 py-1 flex-1 min-h-0 font-mono">
              <div>
                <div className="text-xs md:text-sm text-theme-accent font-bold uppercase tracking-[0.18em] font-mono">
                  {cs.title}
                </div>
                <h3 className="font-serif text-lg md:text-xl font-bold tracking-tight text-theme-text leading-tight mt-2.5">
                  {cs.heading}
                </h3>
              </div>

              {/* Origins split columns */}
              <div className={`grid grid-cols-1 ${isCompact ? "lg:grid-cols-1" : "lg:grid-cols-3"} md:grid-cols-3 gap-3 my-2`}>
                {cs.sections.map((sec, idx) => {
                  const isHovered = hoveredIdx === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                      className={`p-4 border rounded-xs transition-all duration-150 flex flex-col justify-start gap-2 bg-theme-void/50 ${
                        isHovered ? "border-theme-accent bg-theme-accent/5" : "border-theme-border/40"
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-theme-text-muted">
                          <span className="uppercase tracking-wider">{sec.kicker}</span>
                          <span className={isHovered ? "text-theme-accent" : "opacity-60"}>0{idx + 1}</span>
                        </div>
                        <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-theme-text border-b border-theme-border/20 pb-1.5">
                          {sec.title}
                        </h4>
                        <p className="text-xs md:text-sm text-theme-text-muted leading-relaxed">
                          {sec.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={`border-t border-theme-border/20 pt-4 mt-auto flex ${isCompact ? "flex-col items-start gap-4" : "flex-col sm:flex-row items-start sm:items-center justify-between gap-4"} text-xs md:text-sm`}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-theme-accent font-bold uppercase tracking-wider">// GLOBAL NODES</span>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-theme-text-muted font-bold mt-1">
                    {cf.locations.map((loc) => (
                      <span key={loc} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`flex flex-col ${isCompact ? "items-start text-left" : "items-end sm:text-right"} gap-1.5 max-w-[320px]`}>
                  <span className="text-theme-accent font-bold uppercase tracking-wider">// MOTION</span>
                  <span className="text-theme-text-muted leading-relaxed mt-1">
                    {cp.heading} · <span className="text-theme-accent font-semibold">[MARKS PENDING]</span>
                  </span>
                </div>
              </div>
            </div>
          )}

          {internalTab === "guidelines" && (
            <div className={`grid grid-cols-1 ${isCompact ? "lg:grid-cols-1" : "lg:grid-cols-2"} md:grid-cols-2 gap-5 py-2 font-mono flex-1 min-h-0 overflow-y-auto pr-1`}>
              {/* Photography Specifications */}
              <div className="p-4 border border-theme-border/40 rounded-xs bg-theme-void/60 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-theme-accent font-bold uppercase tracking-wider">{cphoto.title}</span>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-theme-text">{cphoto.heading}</h4>
                </div>
                <p className="text-xs md:text-sm text-theme-text-muted leading-relaxed">{cphoto.desc}</p>
                <div className="flex flex-col gap-2 mt-2.5 border-t border-theme-border/10 pt-2.5 text-xs md:text-sm">
                  <span className="font-bold text-theme-text">// LENS & SHUTTER DNA SPEC</span>
                  <div className="flex flex-col gap-2 text-theme-text-muted leading-relaxed mt-1.5">
                    <div>▪ <span className="font-semibold text-theme-text">Lens:</span> {cphoto.specifications.lens}</div>
                    <div>▪ <span className="font-semibold text-theme-text">Aperture:</span> {cphoto.specifications.aperture}</div>
                    <div>▪ <span className="font-semibold text-theme-text">Colors:</span> {cphoto.specifications.colorTemperature} ({cphoto.specifications.saturation})</div>
                    <div>▪ <span className="font-semibold text-theme-text">Subjects:</span> {cphoto.specifications.subjectFraming}</div>
                  </div>
                </div>
              </div>

              {/* Audio Specifications */}
              <div className="p-4 border border-theme-border/40 rounded-xs bg-theme-void/60 flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-theme-accent font-bold uppercase tracking-wider">{caudio.title}</span>
                  <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider text-theme-text">{caudio.heading}</h4>
                </div>
                <p className="text-xs md:text-sm text-theme-text-muted leading-relaxed">{caudio.desc}</p>
                <div className="flex flex-col gap-2 mt-2.5 border-t border-theme-border/10 pt-2.5 text-xs md:text-sm">
                  <span className="font-bold text-theme-text">// SONIC LAYER ASSETS</span>
                  <div className="flex flex-col gap-2 text-theme-text-muted leading-relaxed mt-1.5">
                    {caudio.assets.slice(0, 3).map((asset) => (
                      <div key={asset.name}>
                        ▪ <span className="font-semibold text-theme-text">{asset.name}:</span> {asset.composition}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PanelFrame>
  );
};

// ==========================================
// 5. COMMUNITY PANEL (PORTAL & ACCESS)
// ==========================================

interface CommunityPanelProps {
  onOpenPilot: () => void;
  isCompact?: boolean;
}

export const CommunityPanel: React.FC<CommunityPanelProps> = ({
  onOpenPilot,
  isCompact = false,
}) => {
  const siteCopy = useSiteCopy();
  const cb = siteCopy.begin;
  const cc = siteCopy.closing;
  const cf = siteCopy.footer;
  const [showEnterpriseSpecs, setShowEnterpriseSpecs] = useState(false);
  const [showBuilderSpecs, setShowBuilderSpecs] = useState(false);

  return (
    <PanelFrame
      title="COMMUNITY"
      status="idle"
      terminalStyle={false}
      corners={true}
      className="h-full flex flex-col justify-between"
    >
      <div className="flex flex-col justify-start select-none gap-5 flex-1 min-h-0 overflow-y-auto pr-1">
        <div className={`grid grid-cols-1 ${isCompact ? "lg:grid-cols-1" : "lg:grid-cols-2"} md:grid-cols-2 gap-4 my-1 font-mono flex-1 min-h-0`}>
          {/* Enterprise Gateway */}
          <div className="p-4 border border-theme-border/40 rounded-xs bg-theme-void/50 flex flex-col justify-start gap-3 flex-1 min-h-0">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-theme-accent font-bold tracking-wider uppercase">
                {cb.enterprise.title}
              </span>
              <h4 className="text-sm md:text-base font-bold text-theme-text leading-tight mt-0.5">
                {cb.enterprise.subtitle}
              </h4>
              <button
                onClick={() => setShowEnterpriseSpecs(!showEnterpriseSpecs)}
                className="text-left text-xs text-theme-accent uppercase tracking-widest mt-2 hover:underline cursor-pointer focus:outline-none"
              >
                {showEnterpriseSpecs ? "Hide specs ▲" : "Show specs ▼"}
              </button>
              {showEnterpriseSpecs && (
                <ul className="flex flex-col gap-1.5 mt-2.5 text-xs md:text-sm text-theme-text-muted list-none pl-0">
                  {cb.enterprise.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="text-theme-accent font-bold">▪</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-auto pt-3.5 border-t border-theme-border/20 flex flex-col gap-2">
              <Button variant="primary" size="md" onClick={onOpenPilot} className="font-bold border-theme-accent text-xs md:text-sm py-2.5 px-5">
                {cb.enterprise.cta}
              </Button>
            </div>
          </div>

          {/* Builder Gateway */}
          <div className="p-4 border border-theme-border/40 rounded-xs bg-theme-void/50 flex flex-col justify-start gap-3 flex-1 min-h-0">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-theme-text-muted font-bold tracking-wider uppercase">
                {cb.builders.title}
              </span>
              <h4 className="text-sm md:text-base font-bold text-theme-text leading-tight mt-0.5">
                {cb.builders.subtitle}
              </h4>
              <button
                onClick={() => setShowBuilderSpecs(!showBuilderSpecs)}
                className="text-left text-xs text-theme-chrome uppercase tracking-widest mt-2 hover:underline cursor-pointer focus:outline-none"
              >
                {showBuilderSpecs ? "Hide specs ▲" : "Show specs ▼"}
              </button>
              {showBuilderSpecs && (
                <ul className="flex flex-col gap-1.5 mt-2.5 text-xs md:text-sm text-theme-text-muted list-none pl-0">
                  {cb.builders.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="text-theme-chrome/60 font-bold">▪</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-auto pt-3.5 border-t border-theme-border/20 flex flex-col gap-2">
              <a
                href="https://discord.gg/kairma"
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 text-xs md:text-sm uppercase tracking-wider font-mono bg-transparent text-theme-text border border-theme-border hover:border-theme-accent hover:bg-theme-accent/5 transition-all duration-150 select-none rounded-xs flex items-center justify-center font-bold"
              >
                {cb.builders.cta}
              </a>
            </div>
          </div>
        </div>

        {/* Closing Quote */}
        <div className="text-center py-4 select-none flex flex-col gap-1.5 my-3 max-w-lg mx-auto">
          <p className="font-serif text-base md:text-lg italic text-theme-text leading-relaxed">
            "{cc.text}"
          </p>
          <span className="font-mono text-xs md:text-sm text-theme-accent uppercase tracking-wider font-bold mt-2">
            {cc.sub}
          </span>
        </div>

        {/* Footer info */}
        <div className={`border-t border-theme-border/20 pt-4.5 mt-auto flex ${isCompact ? "flex-col items-start gap-3" : "flex-col sm:flex-row justify-between items-start sm:items-center gap-4.5"} font-mono text-xs md:text-sm text-theme-text-muted`}>
          <div>
            <span>Email: </span>
            <a href={`mailto:${cf.email}`} className="text-theme-accent hover:underline">{cf.email}</a>
            <span className="mx-3">·</span>
            <span>GitHub: </span>
            <a href={`https://${cb.builders.github}`} target="_blank" rel="noreferrer" className="text-theme-chrome hover:text-theme-accent hover:underline">{cb.builders.github}</a>
          </div>
          <div>
            <span>{cf.copyright} · {cf.osVersion}</span>
          </div>
        </div>
      </div>
    </PanelFrame>
  );
};
