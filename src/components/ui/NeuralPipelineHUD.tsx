"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "@/lib/theme";
import {
  Code,
  Cpu,
  Zap,
  Database,
  AlertTriangle,
  FileText,
  DollarSign,
  ChevronDown,
  Plus,
  X,
} from "lucide-react";
import {
  OpenAI,
  Anthropic,
  Gemini,
  DeepSeek,
  Qwen,
  Moonshot,
  Grok,
  Meta,
  Mistral,
  Nvidia,
  ZAI,
  OpenRouter,
} from "@lobehub/icons";
import { PyramidScene, PYRAMID_SLOTS, PYRAMID_VB } from "./PyramidScene";
import { ModelDetailsPanel } from "./ModelDetailsPanel";

/* ==================================================================== *
 *  MODEL LEADERBOARD — RANKING TABLE + ISOMETRIC ROUTING PYRAMID
 *  Left: ranking table with official provider marks; the "+" expands a
 *  model's full telemetry inline. Right: an isometric pyramid of the
 *  three FIXED routing tiers (Frontier / Specialist / Core) — click a
 *  layer to filter the table, click a block to open that model. All
 *  data is live OpenRouter; tiers are computed from real benchmarks
 *  and pricing, never hardcoded.
 * ==================================================================== */

export interface ModelData {
  id: string;
  name: string;
  score: number;
  context_length: number;
  modality: string;
  pricing: { prompt: string; completion: string; cache_read?: string | null };
  description: string;
  benchmarks?: {
    intelligence_index?: number;
    coding_index?: number;
    agentic_index?: number;
    [key: string]: number | undefined;
  } | null;
  provider?: string;
  model_id?: string;
  canonical_slug?: string;
  created?: number | null;
  input_modalities?: string[];
  max_output?: number | null;
  caps?: { tools?: boolean; reasoning?: boolean; structured?: boolean };
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

type DataGroupId =
  | "market_intel"
  | "coding_dev"
  | "agentic_auto"
  | "daily_runtimes"
  | "cost_nano"
  | "max_context"
  | "search_query";

export type Tier = "frontier" | "specialist" | "core";

/* ---------- provider derivation + marks ---------- */
const deriveProvider = (m: ModelData): string => {
  if (m.provider) return m.provider;
  const src = `${m.id} ${m.name}`.toLowerCase();
  if (src.includes("anthropic") || src.includes("claude")) return "Anthropic";
  if (src.includes("openai") || src.includes("gpt")) return "OpenAI";
  if (src.includes("google") || src.includes("gemini")) return "Google";
  if (src.includes("deepseek")) return "DeepSeek";
  if (src.includes("qwen") || src.includes("alibaba")) return "Qwen";
  if (src.includes("moonshot") || src.includes("kimi")) return "Moonshot";
  if (src.includes("x-ai") || src.includes("grok")) return "xAI";
  if (src.includes("meta") || src.includes("llama")) return "Meta";
  if (src.includes("mistral")) return "Mistral";
  if (src.includes("nvidia")) return "NVIDIA";
  if (src.includes("z-ai") || src.includes("glm")) return "Z.ai";
  return "OpenRouter";
};

const PROVIDER_ICON: Record<string, React.ComponentType<{ size?: number }>> = {
  Anthropic,
  OpenAI,
  Google: Gemini,
  DeepSeek,
  Qwen,
  Moonshot,
  xAI: Grok,
  Meta,
  Mistral,
  NVIDIA: Nvidia,
  "Z.ai": ZAI,
  OpenRouter,
};

export const ProviderMark: React.FC<{ provider: string; size?: number }> = ({ provider, size = 16 }) => {
  const Icon = PROVIDER_ICON[provider];
  if (Icon) return <Icon size={size} />;
  return <span className="text-xs font-extrabold">{provider.slice(0, 2).toUpperCase()}</span>;
};

/* ---------- metric helpers ---------- */
const costPer1M = (m: ModelData) => {
  const p = parseFloat(m.pricing?.prompt ?? "0") + parseFloat(m.pricing?.completion ?? "0");
  return p > 0 ? p * 1_000_000 : null;
};

const fmtCost = (v: number) => (v >= 100 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`);

const groupValue = (m: ModelData, group: DataGroupId): number | null => {
  switch (group) {
    case "coding_dev":
      return m.benchmarks?.coding_index ?? null;
    case "agentic_auto":
      return m.benchmarks?.agentic_index ?? null;
    case "cost_nano":
      return costPer1M(m);
    case "max_context":
      return m.context_length > 0 ? m.context_length : null;
    default:
      return m.benchmarks?.intelligence_index ?? null;
  }
};

const groupValueLabel = (m: ModelData, group: DataGroupId): string => {
  const v = groupValue(m, group);
  if (v == null) return "—";
  switch (group) {
    case "cost_nano":
      return fmtCost(v);
    case "max_context":
      return `${Math.round(v / 1000)}K`;
    default:
      return v.toFixed(1);
  }
};

const fmtReleased = (created?: number | null) => {
  if (!created) return "—";
  return new Date(created * 1000).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

/* ---------- FIXED routing tiers, aligned to pyramid capacity --------- *
 * FRONTIER = top 3 by intelligence (the 3 crown plates); SPECIALIST =
 * next 7 by best index (the 7 base plates); CORE = the rest (table
 * only). Deterministic, and every pyramid slot always has a model.     */
const computeTiers = (pool: ModelData[]): Map<string, Tier> => {
  const map = new Map<string, Tier>();
  const bestIndex = (m: ModelData) =>
    Math.max(
      m.benchmarks?.intelligence_index ?? -1,
      m.benchmarks?.coding_index ?? -1,
      m.benchmarks?.agentic_index ?? -1
    );

  const byIntel = [...pool].sort(
    (a, b) => (b.benchmarks?.intelligence_index ?? -1) - (a.benchmarks?.intelligence_index ?? -1)
  );
  const frontierSet = new Set(byIntel.slice(0, 3).map((m) => m.id));

  const rest = pool
    .filter((m) => !frontierSet.has(m.id))
    .sort((a, b) => bestIndex(b) - bestIndex(a));
  const specialist = new Set(rest.slice(0, 7).map((m) => m.id));

  for (const m of pool) {
    if (frontierSet.has(m.id)) map.set(m.id, "frontier");
    else if (specialist.has(m.id)) map.set(m.id, "specialist");
    else map.set(m.id, "core");
  }
  return map;
};

export const TIER_META: Record<Tier, { label: string; blurb: string }> = {
  frontier: { label: "FRONTIER", blurb: "Deep reasoning" },
  specialist: { label: "SPECIALIST", blurb: "Domain leaders" },
  core: { label: "CORE", blurb: "High-volume edge" },
};

/* ---------- isometric pyramid ---------------------------------------- *
 * The full authored isopyramid.svg lives in PyramidScene (auto-generated,
 * theme-bound, original draw order). Its 22 plate slots are mirror-exact;
 * interactive PressPlates mount into them. Slots map to tiers by height. */
const PLATE_PRESS = 6.2; // press-down travel (px)

/* Interactive plate (from llmblocks.svg geometry, 56×44). The icon is
 * projected onto the top face with the asset's own iso matrix. Clicking
 * presses the cap down (reference: default raised / active sunk). */
const PressPlate: React.FC<{
  x: number;
  y: number;
  pressed: boolean;
  dimmed: boolean;
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ x, y, pressed, dimmed, title, onClick, icon }) => {
  /* Use CSS variables directly in `style` — never bake fill values from JS.
     The .xuan-mode class on <html> sets --theme-void to #ffffff synchronously
     before first paint, so the browser always resolves the correct colour
     regardless of React hydration timing. */
  const dy = pressed ? PLATE_PRESS : 0;
  const t = (px: number, py: number) => `${px},${(py + dy).toFixed(2)}`;
  const leftSide = `${t(0.5, 16.45)} ${t(9.31, 21.54)} ${t(28, 32.33)} 28,42.5 0.5,26.62`;
  const rightSide = `${t(55.5, 16.45)} ${t(46.69, 21.54)} ${t(28, 32.33)} 28,42.5 55.5,26.62`;
  return (
    <g
      transform={`translate(${(x - 28).toFixed(2)}, ${(y - 26.62).toFixed(2)})`}
      onClick={onClick}
      className={`cursor-pointer transition-opacity duration-300 ${
        dimmed ? "opacity-35 hover:opacity-70" : "hover:[filter:brightness(1.07)]"
      }`}
    >
      <title>{title}</title>
      {/* side walls — background fill, primary-color stroke */}
      <polygon points={leftSide} fill="currentColor" />
      <polygon points={leftSide} style={{ fill: "var(--theme-accent)", fillOpacity: 0.08 }} />
      <polygon points={rightSide} fill="currentColor" />
      <polygon points={rightSide} style={{ fill: "var(--theme-accent)", fillOpacity: 0.16 }} />
      <polygon points={leftSide} style={{ fill: "none", stroke: "var(--theme-accent)", strokeOpacity: 0.9 }} />
      <polygon points={rightSide} style={{ fill: "none", stroke: "var(--theme-accent)", strokeOpacity: 0.9 }} />
      {/* cap: top face + projected logo, pressed smoothly via transform */}
      <g style={{ transform: `translateY(${dy}px)`, transition: "transform 140ms ease" }}>
        <path
          d="M0.5 16.4541L9.30652 21.5385L28 32.3312L46.6936 21.5385L55.5 16.4541L28.0003 0.577148L0.5 16.4541Z"
          fill={pressed ? "var(--theme-accent)" : "currentColor"}
          style={{
            fill: pressed ? "var(--theme-accent)" : undefined,
            stroke: "var(--theme-accent)",
            strokeOpacity: pressed ? 1 : 0.9,
          }}
        />
        <g
          transform="matrix(0.866025 0.5 -0.866025 0.5 28.3594 8.57715)"
          style={{ color: pressed ? "var(--theme-void)" : "var(--theme-accent)" }}
        >
          {icon}
        </g>
      </g>
    </g>
  );
};

/* ---------- minimal dropdown ---------- */
const Dropdown: React.FC<{
  label: string;
  value: string;
  options: { key: string; label: string; icon?: React.ReactNode }[];
  onSelect: (key: string) => void;
}> = ({ label, value, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full border border-theme-border/40 bg-theme-void/70 text-xs font-bold tracking-wider text-theme-text hover:border-theme-accent/60 transition-colors"
      >
        <span className="text-theme-text-muted/70">{label}</span>
        <span className="text-theme-accent">{value}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-30 min-w-[180px] p-1.5 rounded-xl border border-theme-border/50 bg-theme-void shadow-xl flex flex-col gap-0.5">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => {
                onSelect(o.key);
                setOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg text-left text-xs font-bold tracking-wider text-theme-text-muted hover:text-theme-accent hover:bg-theme-accent/10 transition-colors"
            >
              {o.icon}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ==================================================================== */

export default function NeuralPipelineHUD({
  models,
  onSelectModelForModal,
  t,
}: NeuralPipelineHUDProps) {
  const [activeGroup, setActiveGroup] = useState<DataGroupId>("market_intel");
  const [providerFilter, setProviderFilter] = useState<string>("ALL");
  const [activeTier, setActiveTier] = useState<Tier | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const groups = useMemo(
    () => [
      { id: "market_intel" as DataGroupId, short: t("grp_intel"), icon: <FileText size={13} /> },
      { id: "coding_dev" as DataGroupId, short: t("grp_coding"), icon: <Code size={13} /> },
      { id: "agentic_auto" as DataGroupId, short: t("grp_agentic"), icon: <Cpu size={13} /> },
      { id: "daily_runtimes" as DataGroupId, short: t("grp_runtimes"), icon: <Zap size={13} /> },
      { id: "cost_nano" as DataGroupId, short: t("grp_cost"), icon: <DollarSign size={13} /> },
      { id: "max_context" as DataGroupId, short: t("grp_context"), icon: <Database size={13} /> },
    ],
    [t]
  );

  const providers = useMemo(() => {
    const set = new Set(models.map(deriveProvider));
    return ["ALL", ...Array.from(set).sort()];
  }, [models]);

  /* Fixed routing tiers over the whole tracked pool. */
  const tiers = useMemo(() => computeTiers(models), [models]);
  const tierOf = (m: ModelData): Tier => tiers.get(m.id) ?? "core";

  /* ---------- table pool: provider ∩ search ∩ tier, sorted by group ---------- */
  const ranked = useMemo(() => {
    let pool = [...models];
    if (providerFilter !== "ALL") pool = pool.filter((m) => deriveProvider(m) === providerFilter);
    if (activeTier !== "ALL") pool = pool.filter((m) => tierOf(m) === activeTier);
    if (activeGroup === "search_query" && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      pool = pool.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          deriveProvider(m).toLowerCase().includes(q) ||
          (m.description || "").toLowerCase().includes(q)
      );
      return pool.slice(0, 8);
    }
    switch (activeGroup) {
      case "coding_dev":
        pool = pool
          .filter((m) => m.benchmarks?.coding_index != null)
          .sort((a, b) => (b.benchmarks?.coding_index ?? 0) - (a.benchmarks?.coding_index ?? 0));
        break;
      case "agentic_auto":
        pool = pool
          .filter((m) => m.benchmarks?.agentic_index != null)
          .sort((a, b) => (b.benchmarks?.agentic_index ?? 0) - (a.benchmarks?.agentic_index ?? 0));
        break;
      case "daily_runtimes":
        // OpenRouter order=top-daily is already the daily-usage ranking.
        break;
      case "cost_nano":
        pool = pool.sort((a, b) => (costPer1M(a) ?? Infinity) - (costPer1M(b) ?? Infinity));
        break;
      case "max_context":
        pool = pool.sort((a, b) => (b.context_length ?? 0) - (a.context_length ?? 0));
        break;
      default:
        pool = pool
          .filter((m) => m.benchmarks?.intelligence_index != null)
          .sort(
            (a, b) =>
              (b.benchmarks?.intelligence_index ?? 0) - (a.benchmarks?.intelligence_index ?? 0)
          );
    }
    return pool.slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, activeGroup, searchQuery, providerFilter]);

  /* First gauge column tracks the active group's metric; when the group IS
   * cost (or search), it falls back to intelligence so the two gauges never
   * duplicate. Bars normalize against the best of the visible rows. */
  const gaugeGroup: DataGroupId =
    activeGroup === "cost_nano" || activeGroup === "search_query" ? "market_intel" : activeGroup;
  const gaugeMax = useMemo(
    () => Math.max(1, ...ranked.map((m) => groupValue(m, gaugeGroup) ?? 0)),
    [ranked, gaugeGroup]
  );
  const minCost = useMemo(() => {
    const costs = ranked.map(costPer1M).filter((v): v is number => v != null && v > 0);
    return costs.length ? Math.min(...costs) : null;
  }, [ranked]);

  /* The expanded model — may live outside the visible rows (pyramid click). */
  const expanded = expandedId ? models.find((m) => m.id === expandedId) ?? null : null;
  const expandedInRows = expanded != null && ranked.some((m) => m.id === expanded.id);

  /* Parsing shimmer — event-driven, one-shot. */
  const parseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startParsing = () => {
    setIsParsing(true);
    if (parseTimer.current) clearTimeout(parseTimer.current);
    parseTimer.current = setTimeout(() => setIsParsing(false), 380);
  };
  useEffect(
    () => () => {
      if (parseTimer.current) clearTimeout(parseTimer.current);
    },
    []
  );

  const pickGroup = (id: string) => {
    setSearchQuery("");
    setActiveGroup(id as DataGroupId);
    startParsing();
  };
  const pickProvider = (p: string) => {
    setProviderFilter(p);
    startParsing();
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length > 0) setActiveGroup("search_query");
    else if (activeGroup === "search_query") setActiveGroup("market_intel");
    startParsing();
  };

  const activeGroupShort =
    activeGroup === "search_query"
      ? t("search_label")
      : groups.find((g) => g.id === activeGroup)?.short ?? t("grp_intel");

  /* ---------- pyramid = BRAND filter (3-way sync) ---------------------
   * One plate per unique provider: crown 2×2 = top 4 brands (by their
   * best model's intelligence), the rest fill the mid terrace center-out
   * so any count stays balanced. Pressing a plate applies the SAME
   * provider filter as the dropdown; search dims brands with no match. */
  const orderedSlots = useMemo(() => {
    // Crown (top 3 plates) first, then the base ring center-out — the best
    // brands take the most prominent positions. Coordinates are the
    // regenerated isopyramid2 scene's (center x = 160).
    const crown = PYRAMID_SLOTS.filter((s) => s.y < 120).sort((a, b) => a.y - b.y || a.x - b.x);
    const base = PYRAMID_SLOTS.filter((s) => s.y >= 120);
    const center = base.filter((s) => s.x === 160);
    const pairs = base
      .filter((s) => s.x !== 160)
      .sort((a, b) => Math.abs(a.x - 160) - Math.abs(b.x - 160));
    return [...crown, ...center, ...pairs];
  }, []);

  /* Brand → slot assignment by rank, then re-emitted in DOCUMENT slot
   * order so each plate renders at its marker's z-position (a crown plate
   * must not be painted before the terraces beneath it). */
  const providerPlates = useMemo(() => {
    const bestIntel = (p: string) =>
      Math.max(
        -1,
        ...models
          .filter((m) => deriveProvider(m) === p)
          .map((m) => m.benchmarks?.intelligence_index ?? -1)
      );
    const brands = providers.filter((p) => p !== "ALL").sort((a, b) => bestIntel(b) - bestIntel(a));
    const assign = new Map<{ x: number; y: number }, string>();
    orderedSlots.forEach((slot, i) => {
      if (brands[i]) assign.set(slot, brands[i]);
    });
    return PYRAMID_SLOTS.map((slot) => {
      const provider = assign.get(slot);
      return provider ? { provider, x: slot.x, y: slot.y } : null;
    });
  }, [providers, models, orderedSlots]);

  /* Brands with at least one model matching the current search. */
  const searchBrands = useMemo(() => {
    if (searchQuery.trim().length === 0) return null;
    const q = searchQuery.toLowerCase();
    const set = new Set<string>();
    for (const m of models) {
      if (
        m.name.toLowerCase().includes(q) ||
        deriveProvider(m).toLowerCase().includes(q) ||
        (m.description || "").toLowerCase().includes(q)
      )
        set.add(deriveProvider(m));
    }
    return set;
  }, [models, searchQuery]);

  /* ================================================================== */
  return (
    <div className="w-full flex flex-col gap-4 font-mono relative select-none">
      {/* ---------- Top stat chips + search ---------- */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded-full text-xs tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
          <span className="text-theme-text-muted">Data source:</span>
          <span className="font-bold text-theme-text">OpenRouter API</span>
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded-full text-xs tracking-wider">
          <span className="text-theme-text-muted">Models tracked:</span>
          <span className="font-bold text-theme-text">{models.length}</span>
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 border border-theme-border/30 bg-theme-void/60 rounded-full text-xs tracking-wider">
          <span className="text-theme-text-muted">Re-sync:</span>
          <span className="font-bold text-theme-text">5 min</span>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t("search_db")}
          className="ml-auto w-full sm:w-44 px-3 py-1.5 min-h-[36px] bg-theme-void border border-theme-border/50 rounded-full text-xs text-theme-text placeholder:text-theme-text-muted/60 focus:outline-none focus:border-theme-accent transition-colors"
        />
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-opacity duration-300 ${
          isParsing ? "opacity-40" : "opacity-100"
        }`}
      >
        {/* ======================= LEFT: RANKING TABLE ======================= */}
        <div className="min-w-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-theme-accent/40 sm:h-[52px] pb-3 sm:pb-0 gap-3 shrink-0">
            <span className="text-xs font-bold tracking-wider text-theme-text">
              {activeGroupShort}
              <span className="text-theme-text-muted/60 font-normal"> — Generated insights</span>
            </span>
          </div>

          {/* column headers, aligned to the row grid */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] gap-3 px-2 pt-2.5 pb-1 text-xs text-theme-text-muted/60">
            <span>Provider</span>
            <span>Input /M</span>
            <span>Output /M</span>
            <span>Context</span>
            <span>Latency</span>
            <span>Throughput</span>
          </div>

          {ranked.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-theme-border/40 bg-theme-void/70 p-8 text-center min-h-[300px] mt-2">
              <AlertTriangle className="w-7 h-7 text-theme-accent" />
              <div className="text-xs font-bold text-theme-accent">{t("no_telemetry")}</div>
              <div className="text-xs text-theme-text-muted">{`${t("no_match")} "${searchQuery}"`}</div>
            </div>
          ) : (
            <div className="flex flex-col pt-1">
              {ranked.map((m, idx) => {
                const isOpen = expanded?.id === m.id;
                const tier = tierOf(m);
                return (
                  <button
                    key={m.id}
                    onClick={() => setExpandedId(isOpen ? null : m.id)}
                    className={`group grid grid-cols-2 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] items-center gap-3 px-2 py-3.5 border-b text-left transition-colors ${
                      isOpen
                        ? "border-theme-accent bg-theme-accent/[0.04]"
                        : "border-theme-border/20 hover:bg-theme-accent/[0.04]"
                    }`}
                  >
                    {/* 1. Provider / Model */}
                    <span className="flex items-center gap-3 min-w-0 col-span-2 sm:col-span-1">
                      <span
                        className={`w-8 h-8 rounded-full border shrink-0 flex items-center justify-center transition-colors ${
                          isOpen
                            ? "border-theme-accent text-theme-accent"
                            : "border-theme-border/60 text-theme-text"
                        }`}
                      >
                        <ProviderMark provider={deriveProvider(m)} size={16} />
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-sm font-bold truncate ${
                            isOpen ? "text-theme-accent" : "text-theme-text"
                          }`}
                        >
                          {m.name}
                        </span>
                        <span className="block text-xs text-theme-text-muted/60 truncate mt-0.5">
                          {String(idx + 1).padStart(2, "0")} ·{" "}
                          <span className={tier === "frontier" ? "text-theme-accent font-bold" : ""}>
                            {TIER_META[tier].label}
                          </span>
                        </span>
                      </span>
                    </span>
                    
                    {/* 2. Input /M */}
                    <span className="hidden sm:block text-xs font-mono text-theme-text-muted/80">
                      {m.pricing?.prompt && Number(m.pricing.prompt) > 0 ? `$${(Number(m.pricing.prompt) * 1000000).toFixed(2)}` : "Free"}
                    </span>
                    
                    {/* 3. Output /M */}
                    <span className="hidden sm:block text-xs font-mono text-theme-text-muted/80">
                      {m.pricing?.completion && Number(m.pricing.completion) > 0 ? `$${(Number(m.pricing.completion) * 1000000).toFixed(2)}` : "Free"}
                    </span>

                    {/* 4. Context Limit */}
                    <span className="hidden sm:block text-xs font-mono text-theme-text-muted/80">
                      {m.context_length > 0 ? `${Math.round(m.context_length / 1000)}K` : "—"}
                    </span>

                    {/* 5. Latency */}
                    <span className="hidden sm:block text-xs font-mono text-theme-text-muted/80">
                      {m.ttft ? `${m.ttft.toFixed(2)}s` : "—"}
                    </span>

                    {/* 6. Throughput */}
                    <span className="hidden sm:block text-xs font-mono text-theme-text-muted/80">
                      {m.throughput ? `${m.throughput} tps` : "—"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ======================= RIGHT: ROUTING PYRAMID ======================= */}
        <div className="hidden lg:flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-2 border-b border-theme-accent/40 h-[52px] shrink-0">
            <span className="text-xs text-theme-text-muted/60 tracking-wider">
              Routing pyramid — press a brand to filter
            </span>
            <div className="flex items-center gap-2">
              <Dropdown
                label="Group"
                value={activeGroupShort}
                options={groups.map((g) => ({ key: g.id, label: g.short, icon: g.icon }))}
                onSelect={pickGroup}
              />
              <Dropdown
                label="Provider"
                value={providerFilter === "ALL" ? "All" : providerFilter}
                options={providers.map((p) => ({ key: p, label: p === "ALL" ? "All" : p }))}
                onSelect={pickProvider}
              />
            </div>
          </div>

          {/* stage — full authored isopyramid with interactive press-plates
              mounted into its original slot positions (z-order preserved) */}
          <div
            className="relative flex-1 w-full max-w-[520px] mx-auto"
            style={{ aspectRatio: `${PYRAMID_VB.w} / ${PYRAMID_VB.h}` }}
          >
            <PyramidScene
              className="absolute inset-0 w-full h-full"
              plates={providerPlates.map((p) => {
                if (!p) return null;
                const { provider, x, y } = p;
                const pressed = providerFilter === provider;
                const dimmed =
                  (providerFilter !== "ALL" && !pressed) ||
                  (searchBrands != null && !searchBrands.has(provider));
                return (
                  <PressPlate
                    key={provider}
                    x={x}
                    y={y}
                    pressed={pressed}
                    dimmed={dimmed}
                    title={provider}
                    onClick={() => pickProvider(pressed ? "ALL" : provider)}
                    icon={<ProviderMark provider={provider} size={16} />}
                  />
                );
              })}
            />
          </div>
        </div>
      </div>

      {/* Mobile selectors: groups as chips */}
      <div className="flex lg:hidden flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const isActive = activeGroup === g.id;
            return (
              <button
                key={g.id}
                onClick={() => pickGroup(g.id)}
                className={`flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-full border text-xs font-bold tracking-wider transition-colors ${
                  isActive
                    ? "bg-theme-accent text-theme-void border-theme-accent"
                    : "bg-theme-void/60 text-theme-text-muted border-theme-border/40"
                }`}
              >
                {g.icon}
                {g.short}
              </button>
            );
          })}
        </div>
      </div>

      {/* Model Details Modal (Slide-out) */}
      <ModelDetailsPanel
        m={expanded}
        tier={expanded ? tierOf(expanded) : null}
        onClose={() => setExpandedId(null)}
        deriveProvider={deriveProvider}
      />
    </div>
  );
}
