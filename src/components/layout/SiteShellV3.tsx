"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { StickyNav } from "./StickyNav";
import { BurnStream } from "@/components/ui/BurnStream";
import { BentoGrid } from "./Bento";
import { OSCard } from "@/components/ui/OSCard";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { BulletinCarousel } from "@/components/ui/BulletinCarousel";
import { MoatsAccordion } from "@/components/ui/MoatsAccordion";
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
import { GuanFrontispiece } from "@/components/visual/GuanFrontispiece";
import { BoxHeadline } from "@/components/ui/BoxHeadline";
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
}> = ({ language, setLanguage, triggerCrt, getLangLabel, className }) => {
  const { theme } = useTheme();
  const siteCopy = useSiteCopyV6();

  const handleNormalLanguage = (l: Language) => {
    setLanguage(l);
    triggerCrt();
  };

  return (
    <OSCard className={`relative flex flex-col min-h-[300px] md:min-h-[350px] bg-theme-void text-theme-accent font-mono border-theme-border shadow-[inset_0_0_100px_rgba(31,170,104,0.05)] overflow-hidden ${className || ""}`}>
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
          <div className="font-gothic font-normal text-base md:text-lg tracking-wide text-theme-accent leading-relaxed pb-2 border-b border-theme-border/30">
            {siteCopy.bios_locale?.label || "KAIRMA OS BIOS v1.0\nLOCALE SETTINGS:"}
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
    "kol_bd":               { en: "Creator BD",            "zh-TW": "KOL BD",             vi: "KOL BD",                         ms: "KOL BD", ja: "KOL BD", ko: "KOL BD" },
    "content_ops":          { en: "Content Ops",           "zh-TW": "內容營運",           vi: "Vận hành nội dung",              ms: "Operasi Kandungan", ja: "コンテンツ運用", ko: "콘텐츠 운영" },
    "benchmarks_note":      { en: "* BENCHMARKS NORMALIZED BY ARTIFICIAL ANALYSIS LEADERBOARDS.", "zh-TW": "* 基準數據由 ARTIFICIAL ANALYSIS 排行榜標準化。", vi: "* ĐIỂM CHUẨN ĐƯỢC CHUẨN HÓA BỞI BẢNG XẾP HẠNG ARTIFICIAL ANALYSIS.", ms: "* PENANDA ARAS DINORMALISASI OLEH PAPAN PENDAHULU ARTIFICIAL ANALYSIS.", ja: "* ベンチマークは ARTIFICIAL ANALYSIS のリーダーボードにより正規化されています。", ko: "* 벤치마크는 ARTIFICIAL ANALYSIS 리더보드에 의해 정규화되었습니다." },
    "top_daily_runtimes":   { en: "TOP DAILY RUNTIMES",    "zh-TW": "每日最熱運行環境",   vi: "MÔI TRƯỜNG CHẠY HÀNG ĐẦU HÀNG NGÀY", ms: "PERSEKITARAN HARIAN TERATAS", ja: "毎日の人気ランタイム", ko: "일일 최고 런타임" },
    // Model Leaderboard / Neural Pipeline HUD
    "model_leaderboard":    { en: "ROUTED ACROSS THE CLOUD", "zh-TW": "模型排行榜",         vi: "BẢNG XẾP HẠNG MÔ HÌNH",         ms: "PAPAN PENDAHULU MODEL", ja: "モデルリーダーボード", ko: "모델 리더보드" },
    "data_groups":          { en: "DATA GROUPS",           "zh-TW": "數據群組",           vi: "NHÓM DỮ LIỆU",                  ms: "KUMPULAN DATA", ja: "データグループ", ko: "데이터 그룹" },
    "select_group_hint":    { en: "select a data group to parse", "zh-TW": "選擇要解析的數據群組", vi: "chọn nhóm dữ liệu để phân tích", ms: "pilih kumpulan data untuk dihurai", ja: "解析するデータグループを選択", ko: "분석할 데이터 그룹을 선택" },
    "output_nodes":         { en: "OUTPUT NODES",          "zh-TW": "輸出節點",           vi: "NÚT ĐẦU RA",                    ms: "NOD OUTPUT", ja: "出力ノード", ko: "출력 노드" },
    "generated_insights":   { en: "generated insights",    "zh-TW": "生成的洞察",         vi: "thông tin được tạo",             ms: "cerapan dijana", ja: "生成されたインサイト", ko: "생성된 인사이트" },
    "active_group":         { en: "ACTIVE GROUP",          "zh-TW": "當前群組",           vi: "NHÓM ĐANG CHỌN",                ms: "KUMPULAN AKTIF", ja: "アクティブグループ", ko: "활성 그룹" },
    "parsing_data":         { en: "PARSING DATA...",       "zh-TW": "解析數據中...",      vi: "ĐANG PHÂN TÍCH...",             ms: "MENGHURAI DATA...", ja: "データ解析中...", ko: "데이터 분석 중..." },
    "feed_stable":          { en: "FEED STABLE",           "zh-TW": "數據流穩定",         vi: "NGUỒN ỔN ĐỊNH",                 ms: "SUAPAN STABIL", ja: "フィード安定", ko: "피드 안정" },
    "data_source":          { en: "DATA SOURCE",           "zh-TW": "數據來源",           vi: "NGUỒN DỮ LIỆU",                 ms: "SUMBER DATA", ja: "データソース", ko: "데이터 소스" },
    "model_core":           { en: "MODEL CORE",            "zh-TW": "模型核心",           vi: "LÕI MÔ HÌNH",                   ms: "TERAS MODEL", ja: "モデルコア", ko: "모델 코어" },
    "tokens_used":          { en: "TOKENS USED",           "zh-TW": "已用 TOKEN",         vi: "TOKEN ĐÃ DÙNG",                 ms: "TOKEN DIGUNA", ja: "使用トークン", ko: "사용 토큰" },
    "context_limit":        { en: "CONTEXT LIMIT",         "zh-TW": "上下文上限",         vi: "GIỚI HẠN NGỮ CẢNH",             ms: "HAD KONTEKS", ja: "コンテキスト上限", ko: "컨텍스트 한도" },
    "query_cost":           { en: "QUERY COST",            "zh-TW": "查詢成本",           vi: "CHI PHÍ TRUY VẤN",              ms: "KOS PERTANYAAN", ja: "クエリコスト", ko: "쿼리 비용" },
    "search_db":            { en: "Search database...",    "zh-TW": "搜尋資料庫...",      vi: "Tìm trong cơ sở dữ liệu...",     ms: "Cari pangkalan data...", ja: "データベースを検索...", ko: "데이터베이스 검색..." },
    "search_label":         { en: "SEARCH",                "zh-TW": "搜尋",               vi: "TÌM KIẾM",                      ms: "CARIAN", ja: "検索", ko: "검색" },
    "select_node_hint":     { en: "SELECT A GENERATED OUTPUT NODE FOR TELEMETRY INSIGHTS...", "zh-TW": "選擇一個輸出節點以查看遙測洞察...", vi: "CHỌN MỘT NÚT ĐẦU RA ĐỂ XEM THÔNG TIN TELEMETRY...", ms: "PILIH NOD OUTPUT UNTUK CERAPAN TELEMETRI...", ja: "出力ノードを選択してテレメトリを表示...", ko: "출력 노드를 선택하면 텔레메트리 인사이트가 표시됩니다..." },
    "no_telemetry":         { en: "[0x404] NO TELEMETRY FOUND", "zh-TW": "[0x404] 未找到遙測數據", vi: "[0x404] KHÔNG TÌM THẤY DỮ LIỆU", ms: "[0x404] TIADA TELEMETRI DITEMUI", ja: "[0x404] テレメトリが見つかりません", ko: "[0x404] 텔레메트리를 찾을 수 없음" },
    "no_match":             { en: "No models matched",     "zh-TW": "沒有符合的模型：",   vi: "Không có mô hình khớp",          ms: "Tiada model sepadan", ja: "一致するモデルなし", ko: "일치하는 모델 없음" },
    "grp_intel":            { en: "INTEL",                 "zh-TW": "智能",               vi: "TRÍ TUỆ",                       ms: "INTEL", ja: "知能", ko: "지능" },
    "grp_coding":           { en: "CODING",                "zh-TW": "代碼",               vi: "LẬP TRÌNH",                     ms: "KOD", ja: "コード", ko: "코딩" },
    "grp_agentic":          { en: "AGENTIC",               "zh-TW": "智能體",             vi: "TỰ HÀNH",                       ms: "AGENTIK", ja: "エージェント", ko: "에이전트" },
    "grp_runtimes":         { en: "RUNTIMES",              "zh-TW": "運行時",             vi: "VẬN HÀNH",                      ms: "MASA JALAN", ja: "ランタイム", ko: "런타임" },
    "grp_cost":             { en: "COST",                  "zh-TW": "成本",               vi: "CHI PHÍ",                       ms: "KOS", ja: "コスト", ko: "비용" },
    "grp_context":          { en: "CONTEXT",               "zh-TW": "上下文",             vi: "NGỮ CẢNH",                      ms: "KONTEKS", ja: "文脈", ko: "컨텍스트" },
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
        initial={{ opacity: 0, y: 20 }}
        animate={bootPhase === "ready" ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-[1600px] w-full pt-8 md:pt-16 pb-32 overflow-x-hidden"
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
                  onClick={() => setPilotOpen(true)}
                  className="relative w-full py-3 mb-3 border border-theme-border/70 bg-theme-void/80 text-theme-text font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:border-theme-accent hover:text-theme-accent hover:bg-theme-accent/10 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm shadow-[0_0_15px_rgba(31,170,104,0.1)] hover:shadow-[0_0_20px_var(--color-theme-accent)]"
                >
                  {siteCopy.hero_left.cta_1}
                </button>
                <button
                  onClick={() => setDeploymentWorksOpen(true)}
                  className="w-full text-center font-mono text-[10px] uppercase tracking-widest text-theme-text-muted hover:text-theme-accent transition-colors mb-4 block cursor-pointer"
                >
                  {siteCopy.hero_left.cta_2}
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
                  <h1 className="text-2xl md:text-[34px] font-serif font-medium tracking-normal mb-4 leading-tight text-theme-text drop-shadow-xl text-balance">
                    <BoxHeadline text={siteCopy.hero_center.h1} />
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

            {/* Full Width Content overlay on top of bg with padding */}
            <div className="w-full p-6 md:p-8 flex flex-col justify-between min-h-[320px] relative z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                  <span className="font-gothic font-normal text-sm md:text-base text-theme-accent tracking-wide">
                    {t("the_shift")}
                  </span>
                </div>
                <h2 className="text-2xl md:text-[34px] font-serif font-medium leading-tight text-theme-text mb-4">
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
                  <span className={`font-mono text-[9px] md:text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
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
                  <span className={`font-mono text-[9px] md:text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
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
                  <span className={`font-mono text-[9px] md:text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
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
                  <span className={`font-mono text-[9px] md:text-xs uppercase tracking-widest text-center font-bold mt-1 transition-colors duration-500 ${
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
          <OSCard className="col-span-1 md:col-span-1 row-span-1 p-0 min-h-[300px] md:min-h-[340px] relative overflow-hidden group">
            <BulletinCarousel />
          </OSCard>

          {/* Row 3: Four Moats */}
          <OSCard className="col-span-1 md:col-span-4 row-span-1 p-6 md:p-10 relative overflow-hidden group min-h-[300px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
                <h3 className="font-gothic font-normal tracking-wide text-theme-text text-base md:text-lg">{siteCopy.moats.label}</h3>
              </div>
            </div>
            
            <div className="mt-8">
              <MoatsAccordion
                items={[
                  {
                    text: siteCopy.moats.card_1, tag: "LOGIC", Icon: GearIcon,
                    readout: [
                      "$ keep run --moat 01_LOGIC",
                      "> sop_engine ...... ONLINE",
                      "> data_lake ....... DEEPENS / RUN",
                      "> status .......... HELD",
                    ],
                  },
                  {
                    text: siteCopy.moats.card_2, tag: "PEOPLE", Icon: UserIcon,
                    readout: [
                      "$ keep deploy --fde",
                      "> standardized .... ~80%",
                      "> last_mile ....... FDE_CLOSED",
                      "> status .......... HELD",
                    ],
                  },
                  {
                    text: siteCopy.moats.card_3, tag: "MEMORY", Icon: PlugConnectedIcon,
                    readout: [
                      "$ keep sync --flywheel",
                      "> deployments ..... COMPOUNDING",
                      "> context_gain .... +1 / RUN",
                      "> status .......... HELD",
                    ],
                  },
                  {
                    text: siteCopy.moats.card_4, tag: "SOVEREIGN", Icon: ShieldCheck,
                    readout: [
                      "$ keep audit --egress",
                      "> data_egress ..... 0 BYTES",
                      "> runtime ......... SEALED",
                      "> status .......... HELD",
                    ],
                  },
                ].map(({ text, tag, Icon, readout }) => {
                  const firstDashIdx = text.search(/—|-/);
                  return {
                    title: firstDashIdx !== -1 ? text.slice(0, firstDashIdx).trim() : text,
                    description: firstDashIdx !== -1 ? text.slice(firstDashIdx + 1).trim() : "",
                    tag,
                    Icon,
                    readout,
                  };
                })}
              />
            </div>
            {siteCopy.moats.routing_strip && (
              <div className="mt-8 pt-4 border-t border-theme-border/20 flex items-center justify-center text-center">
                <p className="font-mono text-xs md:text-sm text-theme-text font-bold tracking-wide">
                  {siteCopy.moats.routing_strip}
                </p>
              </div>
            )}
          </OSCard>

          {/* Row 4+5 */}
          {/* 04: The Foundry (Leaderboard) */}
          <OSCard className="col-span-1 md:col-span-4 row-span-2 p-6 flex flex-col overflow-hidden min-h-[620px] crt-canvas crt-vignette crt-flicker relative bg-theme-void/95">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
                <h3 className="font-gothic font-normal tracking-wide text-theme-text text-base md:text-lg">{t("model_leaderboard")}</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded text-[9px] md:text-xs font-mono tracking-wider">
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

            {language === "en" && (
              <p className="font-mono text-xs text-theme-text-muted mb-6 max-w-3xl leading-relaxed">
                We don't build foundation models. We route your tasks across whichever model wins on speed, cost, and task fit today — Claude, GPT, Gemini, DeepSeek, Qwen, Kimi. Model-neutral, vendor-neutral.
              </p>
            )}

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
          <OSCard className="col-span-1 md:col-span-2 row-span-1 p-0 cursor-pointer relative overflow-hidden group"
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
                  <span className="font-gothic font-normal text-base md:text-lg tracking-wide text-theme-accent">{siteCopy.dev_smithy.label}</span>
                </div>
                <h2 className="text-2xl md:text-[34px] font-serif font-medium leading-tight mb-3 text-theme-text">
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
                    <span className="font-gothic font-normal text-base md:text-lg tracking-wide text-theme-accent">{siteCopy.operators.label}</span>
                  </div>
                  <h2 className="text-2xl md:text-[34px] font-serif font-medium leading-tight mb-3 text-theme-text group-hover:text-theme-accent transition-colors">
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

          {/* Section 4: The Roster (Command & Telemetry Ticker / Interactive Badges) inside Bento Grid */}
          <OSCard className="col-span-1 md:col-span-4 row-span-1 p-6 md:p-8 relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-theme-accent/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-theme-border/20">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center shrink-0 shadow-sm">
                  <UserIcon size={18} className="text-theme-accent" />
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                    <span className="font-gothic font-normal text-sm md:text-base text-theme-accent tracking-wide">
                      {siteCopy.workforce_rail.discipline_line ? "DEPLOYED WORKFORCE // ACTIVE ROSTER" : "SYS_ROSTER // LIVE"}
                    </span>
                  </div>
                  <h3 className="font-serif font-medium text-theme-text text-base md:text-xl leading-snug">
                    {siteCopy.workforce_rail.h}
                  </h3>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-theme-border/40 bg-theme-void/60 font-mono text-[10px] text-theme-text-muted uppercase tracking-wider self-start md:self-auto shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
                <span>SYSTEM TELEMETRY // ONLINE</span>
              </div>
            </div>

            {/* Responsive 4-Column Interactive Micro-Cards Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const items = siteCopy.workforce_rail.items.split('·').map((rawItem, idx) => {
                  const cleanItem = rawItem.replace(/[●•]/g, '').trim();
                  const parts = cleanItem.split(/—|–| - /);
                  const role = parts[0]?.trim() || cleanItem;
                  const status = parts[1]?.trim() || "LIVE";
                  return { id: idx, role, status };
                });
                return items.map((item, idx) => (
                  <div 
                    key={`${item.id}-${idx}`}
                    className="flex flex-col justify-between p-5 rounded-2xl border border-theme-border/60 bg-theme-void/90 hover:border-theme-accent hover:bg-theme-accent/5 transition-all duration-300 shadow-sm backdrop-blur-md relative overflow-hidden group/card cursor-default"
                  >
                    {/* Subtle corner glow on hover */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-theme-accent/10 rounded-full blur-xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="flex items-center justify-between gap-2 mb-6">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-theme-text-muted/80 group-hover/card:text-theme-text-muted transition-colors">
                        AGENT // 0{idx + 1}
                      </span>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-accent opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-theme-accent" />
                      </span>
                    </div>

                    <div>
                      <h4 className="font-mono text-base font-bold text-theme-text group-hover/card:text-theme-accent transition-colors mb-3">
                        {item.role}
                      </h4>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-theme-accent/30 bg-theme-accent/10 font-mono text-[11px] font-semibold uppercase tracking-wider text-theme-accent">
                        {item.status}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>

            {siteCopy.workforce_rail.discipline_line && (
              <p className="mt-6 pt-4 border-t border-theme-border/20 font-mono text-xs text-theme-text-muted/70 italic text-center md:text-left">
                {siteCopy.workforce_rail.discipline_line}
              </p>
            )}
          </OSCard>
        </BentoGrid>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-theme-border/20 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-theme-text-muted">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent" />
            <span className="font-bold text-theme-text">{siteCopy.wordmark}</span>
          </div>
          <p>{siteCopy.footer.closing}</p>
          <div className="flex items-center gap-4 text-theme-text-muted/60">
            <span>{siteCopy.guan.label}</span>
            <span>·</span>
            <span>{siteCopy.bios_locale.options}</span>
          </div>
        </footer>
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

      <PilotModal isOpen={pilotOpen} onClose={() => setPilotOpen(false)} />
      <HowDeploymentWorksModal isOpen={deploymentWorksOpen} onClose={() => setDeploymentWorksOpen(false)} />

      <StickyNav />
    </div>
  );
};

export default SiteShellV3;
