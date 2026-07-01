"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { StickyNav } from "./StickyNav";
import { BurnStream } from "@/components/ui/BurnStream";
import { BentoGrid } from "./Bento";
import { OSCard } from "@/components/ui/OSCard";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { BulletinCarousel } from "@/components/ui/BulletinCarousel";
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
  const siteCopy = useSiteCopyV6();

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
          <div className="text-sm md:text-base font-bold tracking-widest text-theme-accent/80 leading-relaxed uppercase whitespace-pre-line">
            {siteCopy.bios_locale?.label || "KAIRMA OS BIOS v1.0\nLOCALE SETTINGS:"}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm md:text-base font-bold">
            {(["en", "zh-TW", "vi", "ms", "ko", "ja"] as Language[]).map(l => (
              <button 
                key={l}
                onClick={() => handleNormalLanguage(l)}
                className={`text-left p-2.5 transition-all border focus:outline-none ${language === l ? 'text-theme-text bg-theme-accent/10 border-theme-accent/30' : 'text-theme-accent hover:text-theme-text hover:bg-theme-accent/10 border-transparent hover:border-theme-accent/30'}`}
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
  const siteCopy = useSiteCopyV6();
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

  // Centralized UI micro-copy translations for all 5 languages + ko/ja
  const uiT: Record<string, Record<string, string>> = {
    // Hero section
    "system_online":        { en: "System: Online",        "zh-TW": "系統狀態: 上線",     vi: "Hệ thống: Trực tuyến",           ms: "Sistem: Dalam Talian", ja: "システム: オンライン", ko: "시스템: 온라인" },
    "the_shift":            { en: "The Shift",             "zh-TW": "轉移",               vi: "Sự chuyển đổi",                  ms: "Anjakan", ja: "転換", ko: "전환" },
    // Digital Employees box
    "digital_emp_heading":  { en: "Your first AI digital employees, deployed – not downloaded.", "zh-TW": "您的第一批 AI 數位員工，已部署，無需下載。", vi: "Nhân viên kỹ thuật số AI đầu tiên — được triển khai, không phải tải xuống.", ms: "Pekerja digital AI pertama anda — ditempatkan, bukan dimuat turun.", ja: "あなたの最初のAIデジタル従業員——ダウンロードではなく、配備。", ko: "당신의 첫 AI 디지털 직원 — 다운로드가 아니라 배치." },
    "pilot_ready":          { en: "Pilot-ready",           "zh-TW": "試點就緒",           vi: "Sẵn sàng thử nghiệm",            ms: "Sedia perintis", ja: "パイロット可", ko: "파일럿 준비" },
    "fde_configured":       { en: "FDE configured",        "zh-TW": "已配置 FDE",         vi: "Đã cấu hình FDE",                ms: "FDE dikonfigurasi", ja: "FDE構成済み", ko: "FDE 구성됨" },
    "customer_care":        { en: "Customer Care",         "zh-TW": "客戶服務",           vi: "Chăm sóc khách hàng",            ms: "Khidmat Pelanggan", ja: "カスタマーケア", ko: "고객 지원" },
    "in_development":       { en: "In development",        "zh-TW": "開發中",             vi: "Đang phát triển",                ms: "Dalam pembangunan", ja: "開発中", ko: "개발 중" },
    "compliance":           { en: "Compliance",            "zh-TW": "合規審查",           vi: "Tuân thủ",                       ms: "Pematuhan", ja: "コンプライアンス", ko: "컴플라이언스" },
    "private_runtime":      { en: "Private runtime",       "zh-TW": "私有運行環境",       vi: "Môi trường riêng tư",            ms: "Persekitaran peribadi", ja: "プライベートランタイム", ko: "프라이빗 런타임" },
    // CTA boxes
    "for_developers":       { en: "For Developers",        "zh-TW": "面向開發者",         vi: "Dành cho nhà phát triển",         ms: "Untuk Pembangun", ja: "開発者へ", ko: "개발자를 위해" },
    "for_operators":        { en: "For Operators",         "zh-TW": "面向營運方",         vi: "Dành cho nhà vận hành",           ms: "Untuk Operator", ja: "オペレーターへ", ko: "운영자를 위해" },
    "view_docs":            { en: "View Docs",             "zh-TW": "查看文件",           vi: "Xem tài liệu",                   ms: "Lihat Dokumen", ja: "ドキュメントを見る", ko: "문서 보기" },
    // Quote / pipeline
    "quote":                { en: "Models got better.\nBut deployment velocity is\nwhere outcomes compound.", "zh-TW": "模型變得更好了。\n但部署速度才是\n業務成果產生複利的地方。", vi: "Mô hình tốt hơn.\nNhưng tốc độ triển khai\nmới là nơi kết quả cộng hưởng.", ms: "Model semakin baik.\nTetapi halaju penempatan\nadalah di mana hasil berganda.", ja: "モデルは良くなった。\n成果が複利で積み上がるのは、\n配備の段階だ。", ko: "모델은 좋아졌습니다.\n성과가 복리로 쌓이는 곳은\n배치입니다." },
    // OpenRouter / Model box
    "syncing":              { en: "SYNCING...",            "zh-TW": "同步中...",           vi: "ĐANG ĐỒNG BỘ...",                ms: "MENYEGERAK...", ja: "同期中...", ko: "동기화 중..." },
    "openrouter_live":      { en: "OPENROUTER SYNC: LIVE", "zh-TW": "OPENROUTER 同步: 運行中", vi: "OPENROUTER ĐỒNG BỘ: TRỰC TIẾP", ms: "OPENROUTER SEGERAK: LANGSUNG", ja: "OPENROUTER 同期: 稼働中", ko: "OPENROUTER 동기화: 켜짐" },
    "fetching_rankings":    { en: "FETCHING LATEST RANKINGS...", "zh-TW": "正在獲取最新排名...", vi: "ĐANG TẢI BẢNG XẾP HẠNG...",   ms: "MEMUATKAN KEDUDUKAN TERKINI...", ja: "最新ランキングを取得中...", ko: "최신 순위를 가져오는 중..." },
    "intel":                { en: "Intel",                 "zh-TW": "智能",               vi: "Trí tuệ",                        ms: "Kepintaran", ja: "知能", ko: "지능" },
    "coding":               { en: "Coding",                "zh-TW": "代碼",               vi: "Lập trình",                      ms: "Pengekodan", ja: "コーディング", ko: "코딩" },
    "agentic":              { en: "Agentic",               "zh-TW": "智能體",             vi: "Tự hành",                        ms: "Agentik", ja: "エージェント", ko: "에이전틱" },
    "kol_bd":               { en: "KOL BD",                "zh-TW": "KOL BD",             vi: "KOL BD",                         ms: "KOL BD", ja: "KOL BD", ko: "KOL BD" },
    "content_ops":          { en: "Content Ops",           "zh-TW": "內容營運",           vi: "Vận hành nội dung",              ms: "Operasi Kandungan", ja: "コンテンツ運用", ko: "콘텐츠 운영" },
    "benchmarks_note":      { en: "* BENCHMARKS NORMALIZED BY ARTIFICIAL ANALYSIS LEADERBOARDS.", "zh-TW": "* 基準數據由 ARTIFICIAL ANALYSIS 排行榜標準化。", vi: "* ĐIỂM CHUẨN ĐƯỢC CHUẨN HÓA BỞI BẢNG XẾP HẠNG ARTIFICIAL ANALYSIS.", ms: "* PENANDA ARAS DINORMALISASI OLEH PAPAN PENDAHULU ARTIFICIAL ANALYSIS.", ja: "* ベンチマークは ARTIFICIAL ANALYSIS のリーダーボードにより正規化されています。", ko: "* 벤치마크는 ARTIFICIAL ANALYSIS 리더보드에 의해 정규화되었습니다." },
    "top_daily_runtimes":   { en: "TOP DAILY RUNTIMES",    "zh-TW": "每日最熱運行環境",   vi: "MÔI TRƯỜNG CHẠY HÀNG ĐẦU HÀNG NGÀY", ms: "PERSEKITARAN HARIAN TERATAS", ja: "毎日の人気ランタイム", ko: "일일 최고 런타임" },
    // Model detail modal
    "runtime_module":       { en: "Runtime Module",        "zh-TW": "運行時模組",         vi: "Mô-đun vận hành",                ms: "Modul Masa Jalan", ja: "ランタイムモジュール", ko: "런타임 모듈" },
    "specs_metrics":        { en: "Specs & Metrics",       "zh-TW": "規格與指標",         vi: "Thông số & Chỉ số",              ms: "Spesifikasi & Metrik", ja: "仕様と指標", ko: "사양 및 지표" },
    "context_window":       { en: "CONTEXT WINDOW",        "zh-TW": "上下文窗口",         vi: "CỬA SỔ NGỮ CẢNH",               ms: "TETINGKAP KONTEKS", ja: "コンテキストウィンドウ", ko: "컨텍스트 윈도우" },
    "max_completion":       { en: "MAX COMPLETION",        "zh-TW": "最大輸出限制",       vi: "ĐẦU RA TỐI ĐA",                 ms: "PENYELESAIAN MAKS", ja: "最大出力", ko: "최대 출력" },
    "pricing_prompt":       { en: "PRICING (PROMPT)",      "zh-TW": "計費 (輸入)",        vi: "GIÁ (ĐẦU VÀO)",                 ms: "HARGA (PROMPT)", ja: "価格 (入力)", ko: "가격 (프롬프트)" },
    "pricing_comp":         { en: "PRICING (COMP)",        "zh-TW": "計費 (輸出)",        vi: "GIÁ (ĐẦU RA)",                  ms: "HARGA (PENYELESAIAN)", ja: "価格 (出力)", ko: "가격 (생성)" },
    "cost_savings":         { en: "cost savings vs baseline", "zh-TW": "比基線模型節省成本", vi: "tiết kiệm chi phí so với cơ sở",  ms: "penjimatan kos berbanding garis asas", ja: "ベースラインからのコスト削減", ko: "베이스라인 대비 비용 절감" },
    "benchmarks":           { en: "Benchmarks",            "zh-TW": "基準測試",           vi: "Điểm chuẩn",                     ms: "Penanda Aras", ja: "ベンチマーク", ko: "벤치마크" },
    "intelligence":         { en: "Intelligence",          "zh-TW": "智能程度",           vi: "Trí tuệ",                        ms: "Kepintaran", ja: "知能", ko: "지능" },
    "coding_speed":         { en: "Coding Speed",          "zh-TW": "代碼生成速度",       vi: "Tốc độ lập trình",               ms: "Kelajuan Pengekodan", ja: "コーディング速度", ko: "코딩 속도" },
    "autonomy":             { en: "Autonomy",              "zh-TW": "自主執行力",         vi: "Tự chủ",                         ms: "Autonomi", ja: "自律性", ko: "자율성" },
    "pending_eval":         { en: "PENDING EVAL",          "zh-TW": "等待評測",           vi: "CHỜ ĐÁNH GIÁ",                  ms: "MENUNGGU PENILAIAN", ja: "評価待ち", ko: "평가 대기 중" },
    "latency_ttft":         { en: "LATENCY (TTFT)",        "zh-TW": "首字延遲 (TTFT)",    vi: "ĐỘ TRỄ (TTFT)",                 ms: "KEPENDAMAN (TTFT)", ja: "レイテンシ (TTFT)", ko: "지연 시간 (TTFT)" },
    "throughput":           { en: "THROUGHPUT",             "zh-TW": "吞吐速度",           vi: "THÔNG LƯỢNG",                    ms: "DAYA PEMPROSESAN", ja: "スループット", ko: "처리량" },
    "reliability":          { en: "RELIABILITY",           "zh-TW": "穩定性/上線率",      vi: "ĐỘ TIN CẬY",                    ms: "KEBOLEHPERCAYAAN", ja: "信頼性", ko: "신뢰도" },
    "verdict":              { en: "VERDICT:",              "zh-TW": "運營結論:",          vi: "KẾT LUẬN:",                      ms: "KEPUTUSAN:", ja: "結論:", ko: "결론:" },
    "use_cases":            { en: "USE CASES:",            "zh-TW": "建議工作流:",        vi: "TRƯỜNG HỢP SỬ DỤNG:",           ms: "KES PENGGUNAAN:", ja: "ユースケース:", ko: "사용 사례:" },
  };
  const t = (key: string) => uiT[key]?.[language] ?? uiT[key]?.en ?? key;


  const staticFallbackModels = [
    { 
      id: "sakana-fugu-ultra", 
      name: "Sakana: Fugu Ultra", 
      score: 96, 
      context_length: 1000000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000005", completion: "0.00003" }, 
      description: (language !== 'zh-TW') ? "Top-tier agentic routing model." : "顶级的Agentic路由调度模型。", 
      benchmarks: { intelligence_index: 85, coding_index: 80, agentic_index: 92 },
      provider: "Sakana AI",
      model_id: "sakana/fugu-ultra",
      max_output: 4096,
      ttft: 110,
      throughput: 145,
      reliability: "99.99%",
      use_cases: (language !== 'zh-TW') ? ["Agentic Routing", "Vision BD Outreach"] : ["Agentic 路由", "视觉 BD 拓展"],
      verdict: (language !== 'zh-TW') ? "Recommended for fast-path routing and multi-modal pipeline operations." : "推荐用于快路径路由和多模态流水线操作。"
    },
    { 
      id: "google-gemini-3.1-flash-image", 
      name: "Gemini 3.1 Flash Image", 
      score: 92, 
      context_length: 1000000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000000075", completion: "0.0000003" }, 
      description: (language !== 'zh-TW') ? "Superfast multimodal vision model." : "超快的多模态视觉大模型。", 
      benchmarks: { intelligence_index: 88, coding_index: 85, agentic_index: 78 },
      provider: "Google",
      model_id: "google/gemini-3.1-flash-image",
      max_output: 8192,
      ttft: 85,
      throughput: 220,
      reliability: "99.98%",
      use_cases: (language !== 'zh-TW') ? ["Vision Verification", "High-frequency Scraping"] : ["视觉验证", "高频爬取"],
      verdict: (language !== 'zh-TW') ? "Highly recommended for vision checks and high-volume background tasks due to its speed and low pricing." : "由于其极高的速度和极低的价格，强烈推荐用于视觉校验和海量后台任务。"
    },
    { 
      id: "cohere-north-mini-code-free", 
      name: "Cohere: North Mini Code", 
      score: 88, 
      context_length: 128000, 
      modality: "text->text", 
      pricing: { prompt: "0", completion: "0" }, 
      description: (language !== 'zh-TW') ? "Highly efficient coding model (free)." : "高效的开源代码模型 (免费)。", 
      benchmarks: { intelligence_index: 80, coding_index: 95, agentic_index: 84 },
      provider: "Cohere",
      model_id: "cohere/north-mini-code",
      max_output: 4096,
      ttft: 95,
      throughput: 180,
      reliability: "99.99%",
      use_cases: (language !== 'zh-TW') ? ["Automated Coding", "Syntax Lints"] : ["自动代码生成", "语法校验"],
      verdict: (language !== 'zh-TW') ? "Perfect for code linting and standard text-based agent loops." : "非常适合代码规范校验和标准的文本智能体循环操作。"
    },
    { 
      id: "z-ai-glm-5.2", 
      name: "Z.ai: GLM 5.2", 
      score: 85, 
      context_length: 128000, 
      modality: "text->text", 
      pricing: { prompt: "0.0000001", completion: "0.0000002" }, 
      description: (language !== 'zh-TW') ? "Leading reasoning and multilingual model." : "领先的推理与多语言大模型。", 
      benchmarks: { intelligence_index: 90, coding_index: 88, agentic_index: 89 },
      provider: "Z.ai",
      model_id: "z-ai/glm-5.2",
      max_output: 4096,
      ttft: 120,
      throughput: 110,
      reliability: "99.95%",
      use_cases: (language !== 'zh-TW') ? ["Bilingual Translation", "Structured Reasoning"] : ["双语翻译", "结构化推理"],
      verdict: (language !== 'zh-TW') ? "Excellent balanced model for localized tasks and multi-agent coordination." : "优秀的平衡大模型，适用于本地化任务 and 多智能体协作协调。"
    },
    { 
      id: "moonshotai-kimi-k2.7-code", 
      name: "Moonshot: Kimi K2.7 Code", 
      score: 82, 
      context_length: 200000, 
      modality: "text->text", 
      pricing: { prompt: "0.000001", completion: "0.000002" }, 
      description: (language !== 'zh-TW') ? "Chinese code generation benchmark leader." : "中文代码生成与长文本理解专家。", 
      benchmarks: { intelligence_index: 82, coding_index: 91, agentic_index: 81 },
      provider: "Moonshot",
      model_id: "moonshot/kimi-k2.7-code",
      max_output: 8192,
      ttft: 130,
      throughput: 95,
      reliability: "99.96%",
      use_cases: (language !== 'zh-TW') ? ["Chinese Dev Operations", "Long Codebases"] : ["中文开发运维", "长代码仓库解析"],
      verdict: (language !== 'zh-TW') ? "Recommended for long-context analysis of complex Chinese codebases." : "推荐用于对复杂的中文长代码仓库进行深入分析与理解。"
    },
    { 
      id: "anthropic-claude-fable-latest", 
      name: "Claude Fable Latest", 
      score: 79, 
      context_length: 200000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000003", completion: "0.000015" }, 
      description: (language !== 'zh-TW') ? "Anthropic's next-gen reasoning agent." : "Anthropic新一代推理Agent model。", 
      benchmarks: { intelligence_index: 98, coding_index: 96, agentic_index: 97 },
      provider: "Anthropic",
      model_id: "anthropic/claude-fable-latest",
      max_output: 8192,
      ttft: 145,
      throughput: 85,
      reliability: "99.99%",
      use_cases: (language !== 'zh-TW') ? ["Complex System Design", "Strategic Autonomy"] : ["复杂系统设计", "战略性自主规划"],
      verdict: (language !== 'zh-TW') ? "Frontier intelligence. Ideal for high-level decision tasks and complex agent architectures." : "前沿的顶级智能。最适合高级决策任务和复杂的智能体架构设计。"
    },
    { 
      id: "anthropic-claude-fable-5", 
      name: "Claude Fable 5", 
      score: 76, 
      context_length: 200000, 
      modality: "text+image->text", 
      pricing: { prompt: "0.000003", completion: "0.000015" }, 
      description: (language !== 'zh-TW') ? "Anthropic's core reasoning flagship." : "Anthropic核心推理旗舰模型。", 
      benchmarks: { intelligence_index: 96, coding_index: 94, agentic_index: 95 },
      provider: "Anthropic",
      model_id: "anthropic/claude-fable-5",
      max_output: 8192,
      ttft: 150,
      throughput: 90,
      reliability: "99.99%",
      use_cases: (language !== 'zh-TW') ? ["Architectural Planning", "System Evaluation"] : ["架构规划", "系统级深度评估"],
      verdict: (language !== 'zh-TW') ? "Standard flagship. Delivers high logic performance and agentic reliability." : "旗舰级标准。具有极高的逻辑表现和可靠的智能体操作执行率。"
    },
    { 
      id: "nex-agi-nex-n2-pro", 
      name: "Nex AGI: Nex-N2-Pro", 
      score: 68, 
      context_length: 64000, 
      modality: "text->text", 
      pricing: { prompt: "0.0000015", completion: "0.0000045" }, 
      description: (language !== 'zh-TW') ? "Frontier agentic workflow logic model." : "前沿Agentic工作流逻辑模型。", 
      benchmarks: { intelligence_index: 70, coding_index: 68, agentic_index: 85 },
      provider: "Nex AGI",
      model_id: "nex-agi/nex-n2-pro",
      max_output: 4096,
      ttft: 165,
      throughput: 75,
      reliability: "99.92%",
      use_cases: (language !== 'zh-TW') ? ["Workflow Execution", "Logic Branching"] : ["工作流执行", "逻辑分支决策"],
      verdict: (language !== 'zh-TW') ? "Niche logic model optimized for branching workflows and direct execution commands." : "专为分支工作流和命令直接执行优化的小众逻辑模型。"
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
                {siteCopy.hero_left.h1}
              </p>
              <p className="font-mono text-xs text-theme-text-muted leading-relaxed">
                {siteCopy.hero_left.sub}
              </p>
            </div>
            
            <div className="mt-6 relative z-10 flex flex-col justify-between flex-1">
              <div className="group/cta">
                <button 
                  disabled
                  className="relative w-full py-3 mb-6 border border-theme-border/40 bg-theme-void/60 text-theme-text-muted/60 font-mono text-xs font-bold uppercase tracking-widest rounded-md cursor-not-allowed flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <div className="absolute -top-[1px] -left-[1px] w-2.5 h-[1px] bg-theme-border/60" />
                  <div className="absolute -top-[1px] -left-[1px] w-[1px] h-2.5 bg-theme-border/60" />
                  <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-[1px] bg-theme-border/60" />
                  <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-2.5 bg-theme-border/60" />
                  COMING SOON
                </button>
              </div>
              <div className="flex flex-col gap-2 w-full mt-auto">
                <ThemeSwitcher />
                <SocialLinks />
              </div>
            </div>
          </OSCard>

          {/* 01: Main Hero Canvas */}
          <OSCard overflowVisible={true} className="col-span-1 md:col-span-3 row-span-1 p-0 relative min-h-[400px] z-40">
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
                    {siteCopy.hero_center.h1}
                  </h1>
                  
                  <p className="font-mono text-sm text-theme-text-muted leading-relaxed drop-shadow-md mb-8 max-w-xl">
                    {siteCopy.hero_center.body}
                  </p>
                </div>

                {/* Status List */}
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] md:text-xs uppercase tracking-widest pt-4">
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
                    {t("the_shift")}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight text-theme-text mb-6">
                {siteCopy.shift.h}
                </h2>
              </div>

              {/* Pipeline Node Flow Layout */}
              <div className="relative w-full flex items-center justify-between my-6 py-2 px-1">
                
                {/* Node 0: Model Capability */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]"
                  >
                    <CpuIcon 
                      size={20} 
                      color="var(--theme-accent)"
                    />
                  </div>
                  <span className="font-mono text-[8px] md:text-xs uppercase tracking-widest text-center text-theme-text font-bold mt-1">
                    Model
                  </span>
                </div>

                {/* Connector Line 0 */}
                <div className="flex-1 h-[2px] bg-theme-border/20 relative mx-2">
                  <div className="absolute inset-0 bg-theme-accent/50 opacity-100" />
                </div>

                {/* Node 1: Workflow */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]"
                  >
                    <GearIcon 
                      size={20} 
                      color="var(--theme-accent)"
                    />
                  </div>
                  <span className="font-mono text-[8px] md:text-xs uppercase tracking-widest text-center text-theme-text font-bold mt-1">
                    Workflow
                  </span>
                </div>

                {/* Connector Line 1 */}
                <div className="flex-1 h-[2px] bg-theme-border/20 relative mx-2">
                  <div className="absolute inset-0 bg-theme-accent/50 opacity-100" />
                </div>

                {/* Node 2: Deployment */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]"
                  >
                    <PlugConnectedIcon 
                      size={20} 
                      color="var(--theme-accent)"
                    />
                  </div>
                  <span className="font-mono text-[8px] md:text-xs uppercase tracking-widest text-center text-theme-text font-bold mt-1">
                    Deployment
                  </span>
                </div>

                {/* Connector Line 2 */}
                <div className="flex-1 h-[2px] bg-theme-border/20 relative mx-2">
                  <div className="absolute inset-0 bg-theme-accent/50 opacity-100" />
                </div>

                {/* Node 3: Outcome */}
                <div className="flex flex-col items-center gap-2 z-10 relative">
                  <div 
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full border bg-theme-void flex items-center justify-center relative transition-all duration-500 border-theme-accent shadow-[0_0_15px_var(--color-theme-accent)]"
                  >
                    <DoubleCheckIcon 
                      size={20} 
                      color="var(--theme-accent)"
                    />
                  </div>
                  <span className="font-mono text-[8px] md:text-xs uppercase tracking-widest text-center text-theme-text font-bold mt-1">
                    Outcome
                  </span>
                </div>
              </div>

              <div className="mt-4 font-mono text-sm text-theme-text-muted leading-relaxed whitespace-pre-line">
                {t("quote")}
              </div>
            </div>

          </OSCard>

          {/* Section 3: Bulletin Carousel */}
          <OSCard className="col-span-1 md:col-span-1 row-span-1 p-0 min-h-[300px] md:min-h-[340px] relative overflow-hidden group">
            <BulletinCarousel />
          </OSCard>

          {/* Row 3: Four Moats */}
          <OSCard className="col-span-1 md:col-span-4 row-span-1 p-6 md:p-10 relative overflow-hidden group min-h-[300px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
                <h3 className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm">{siteCopy.moats.label}</h3>
              </div>
            </div>
            
            <div className="relative w-full flex flex-col md:flex-row items-stretch justify-between gap-4 mt-8">
              {[
                { text: siteCopy.moats.card_1, tag: "LOGIC", Icon: GearIcon },
                { text: siteCopy.moats.card_2, tag: "PEOPLE", Icon: UserIcon },
                { text: siteCopy.moats.card_3, tag: "MEMORY", Icon: PlugConnectedIcon },
                { text: siteCopy.moats.card_4, tag: "SOVEREIGN", Icon: ShieldCheck }
              ].map((moat, idx) => {
                const parts = moat.text.split(/—|-/);
                const title = parts[0]?.trim();
                const description = parts.slice(1).join('-').trim();
                const isActive = pipelineState === idx * 2;
                const isLineActive = pipelineState === idx * 2 + 1 || pipelineState === idx * 2 + 2; 

                return (
                  <React.Fragment key={idx}>
                    <div 
                      className={`flex-1 p-5 border rounded-lg transition-all duration-500 relative bg-theme-void/80 backdrop-blur-sm flex flex-col gap-4 group/card ${
                        isActive ? 'border-theme-accent shadow-[0_0_20px_rgba(31,170,104,0.15)] -translate-y-1' : 'border-theme-border/30 hover:border-theme-accent/50'
                      }`}
                      onMouseEnter={() => iconRefs.current[idx]?.startAnimation?.()}
                      onMouseLeave={() => iconRefs.current[idx]?.stopAnimation?.()}
                    >
                      <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between">
                          <div className={`text-theme-accent font-mono text-xl font-bold transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 group-hover/card:opacity-100'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </div>
                          <div className={`text-theme-accent w-6 h-6 flex-shrink-0 flex items-center justify-center transition-transform ${isActive ? 'scale-110' : ''}`}>
                            <moat.Icon ref={(el: any) => { iconRefs.current[idx] = el; }} size={24} color={isActive ? "var(--theme-accent)" : "currentColor"} />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-mono font-bold text-sm mb-2 transition-colors ${isActive ? 'text-theme-text' : 'text-theme-text'}`}>{title}</h4>
                          <p className="font-mono text-xs text-theme-text-muted leading-relaxed">{description}</p>
                        </div>
                        <div className={`font-mono text-[10px] tracking-widest uppercase text-left mt-auto transition-colors ${isActive ? 'text-theme-accent' : 'text-theme-accent/40 group-hover/card:text-theme-accent'}`}>
                          [ {moat.tag} ]
                        </div>
                      </div>
                    </div>

                    {/* Connector arrow/line (except for last item) */}
                    {idx < 3 && (
                      <div className="hidden md:flex items-center justify-center w-8 relative shrink-0">
                         <div className="w-full h-[2px] bg-theme-border/20 relative overflow-hidden rounded-full">
                           <div className={`absolute inset-0 bg-theme-accent/30 transition-opacity duration-500 ${isLineActive ? 'opacity-100' : 'opacity-0'}`} />
                           {(pipelineState === idx * 2 + 1) && (
                             <motion.div
                               className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-theme-accent to-transparent shadow-[0_0_8px_var(--color-theme-accent)]"
                               initial={{ left: "-20px" }}
                               animate={{ left: "100%" }}
                               transition={{ duration: 1.2, ease: "easeInOut" }}
                             />
                           )}
                         </div>
                         <div className={`absolute right-[-4px] text-[10px] transition-colors duration-500 ${isLineActive ? 'text-theme-accent' : 'text-theme-border/20'}`}>
                            ▶
                         </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </OSCard>

          {/* Row 4+5 */}
          {/* 04: The Foundry (Leaderboard) */}
          <OSCard className="col-span-1 md:col-span-3 row-span-2 p-6 flex flex-col overflow-hidden min-h-[550px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
                <h3 className="font-mono font-bold uppercase tracking-widest text-theme-text text-sm">MODEL LEADERBOARD</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded text-[9px] md:text-xs font-mono tracking-wider">
                <span className={`w-1.5 h-1.5 rounded-full ${modelsLoading ? "bg-amber-500 animate-pulse" : "bg-theme-accent"}`} />
                <span className="text-theme-text-muted">
                  {modelsLoading ? t("syncing") : t("openrouter_live")}
                </span>
              </div>
            </div>

            {modelsLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-theme-text-muted font-mono text-xs uppercase tracking-widest gap-2">
                <div className="w-6 h-6 border-2 border-theme-accent border-t-transparent rounded-full animate-spin" />
                <span>{t("fetching_rankings")}</span>
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
                          ? t("intel")
                          : metric === "coding_index"
                            ? t("coding")
                            : t("agentic");
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
                    {t("benchmarks_note")}
                  </div>
                </div>

                {/* Right: Model list (6 cols) */}
                <div className="lg:col-span-6 flex flex-col min-h-0 border-t lg:border-t-0 lg:border-l border-theme-border/30 pt-6 lg:pt-0 lg:pl-6">
                  <p className="font-mono text-xs md:text-sm font-semibold text-theme-text-muted mb-4 uppercase tracking-widest shrink-0">
                    {t("top_daily_runtimes")}
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
                {t("digital_emp_heading")}
              </h2>
            </div>
            
            <div className="flex flex-col flex-1 gap-4 justify-center">
              {[
                {
                  id: "kol",
                  title: t("kol_bd"),
                  status: t("pilot_ready"),
                  statusColor: "text-theme-accent",
                  dotColor: "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]",
                  ref: kolIconRef
                },
                {
                  id: "content",
                  title: t("content_ops"),
                  status: t("fde_configured"),
                  statusColor: "text-theme-accent",
                  dotColor: "bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)]",
                  ref: contentIconRef
                },
                {
                  id: "care",
                  title: t("customer_care"),
                  status: t("in_development"),
                  statusColor: "text-amber-500",
                  dotColor: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
                  ref: customerIconRef
                },
                {
                  id: "compliance",
                  title: t("compliance"),
                  status: t("private_runtime"),
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
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent">{t("for_developers")}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight mb-3 text-theme-text">{siteCopy.dev_smithy.h}</h2>
                <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-sm">{siteCopy.dev_smithy.body}</p>
              </div>
              <button className="group/btn relative self-start mt-6 px-6 py-3 border border-theme-border/40 bg-theme-void/80 text-theme-text font-mono text-xs font-bold uppercase tracking-widest rounded-md hover:border-theme-accent hover:text-theme-accent hover:bg-theme-accent/10 transition-all duration-300 flex items-center gap-2 shadow-sm backdrop-blur-sm">
                <div className="absolute -top-[1px] -left-[1px] w-2.5 h-[1px] bg-theme-accent transition-all duration-300 group-hover/btn:w-4 group-hover/btn:bg-theme-text" />
                <div className="absolute -top-[1px] -left-[1px] w-[1px] h-2.5 bg-theme-accent transition-all duration-300 group-hover/btn:h-4 group-hover/btn:bg-theme-text" />
                <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-[1px] bg-theme-accent transition-all duration-300 group-hover/btn:w-4 group-hover/btn:bg-theme-text" />
                <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-2.5 bg-theme-accent transition-all duration-300 group-hover/btn:h-4 group-hover/btn:bg-theme-text" />
                {t("view_docs")} <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
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
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-theme-accent">{t("for_operators")}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-mono font-bold leading-tight mb-3 text-theme-text group-hover:text-theme-accent transition-colors">{siteCopy.operators.h}</h2>
                  <p className="font-mono text-xs md:text-sm text-theme-text-muted leading-relaxed max-w-sm">{siteCopy.operators.body}</p>
                </div>
                <div className="mt-6">
                  <button className="group/btn relative self-start px-6 py-3 border border-theme-border/40 bg-theme-void/80 text-theme-accent font-mono text-xs font-bold uppercase tracking-widest rounded-md hover:border-theme-accent hover:text-theme-void hover:bg-theme-accent transition-all duration-300 flex items-center gap-2 shadow-sm backdrop-blur-sm">
                    <div className="absolute -top-[1px] -left-[1px] w-2.5 h-[1px] bg-theme-accent transition-all duration-300 group-hover/btn:bg-theme-void" />
                    <div className="absolute -top-[1px] -left-[1px] w-[1px] h-2.5 bg-theme-accent transition-all duration-300 group-hover/btn:bg-theme-void" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-[1px] bg-theme-accent transition-all duration-300 group-hover/btn:bg-theme-void" />
                    <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-2.5 bg-theme-accent transition-all duration-300 group-hover/btn:bg-theme-void" />
                    {siteCopy.operators.cta}
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
                <div className="grid grid-cols-3 gap-2.5 p-4 md:p-5 bg-theme-void/50 border border-theme-border/20 rounded-xl mb-8">
                  <div className="text-center">
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-theme-text-muted mb-1">{t("latency_ttft")}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-text">{specs.ttft}ms</span>
                  </div>
                  <div className="text-center border-x border-theme-border/20">
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-theme-text-muted mb-1">{t("throughput")}</span>
                    <span className="text-sm md:text-xl font-bold text-theme-text">{specs.throughput} tkn/s</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] md:text-xs uppercase tracking-wider text-theme-text-muted mb-1">{t("reliability")}</span>
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

      <StickyNav />
    </div>
  );
};

export default SiteShellV3;
