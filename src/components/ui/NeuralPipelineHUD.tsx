"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Code,
  Cpu,
  Zap,
  Database,
  AlertTriangle,
  FileText,
  DollarSign,
} from "lucide-react";
import { useTheme } from "@/lib/theme";

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

type DataGroupId =
  | "market_intel"
  | "coding_dev"
  | "agentic_auto"
  | "daily_runtimes"
  | "cost_nano"
  | "max_context"
  | "search_query";

interface DataGroupConfig {
  id: DataGroupId;
  label: string;
  short: string;
  desc: string;
  icon: React.ReactNode;
}

/* ------------------------------------------------------------------ *
 * Single source of truth for canvas colors. Keyed off the site theme
 * state (the same store the THEME toggle writes). No hardcoded colors
 * live inside the draw loop — it only ever reads paletteRef.current.
 * ------------------------------------------------------------------ */
type Palette = { bg: string; accent: string; ink: string; silver: string };
// Matches the site's --theme-accent: light (xuan) is GREEN, dark (matrix) is RED.
const PALETTES: Record<"xuan-mode" | "matrix-mode", Palette> = {
  // Light — xuan mode
  "xuan-mode": { bg: "#ffffff", accent: "#00492E", ink: "#1F1A17", silver: "#76747c" },
  // Dark — matrix mode
  "matrix-mode": { bg: "#0B0A0C", accent: "#C9402B", ink: "#E8F0E8", silver: "#C0C0C8" },
};

const hexToRgba = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

// Cubic bezier point at parameter u
const bez = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  u: number
) => {
  const v = 1 - u;
  return v * v * v * p0 + 3 * v * v * u * p1 + 3 * v * u * u * p2 + u * u * u * p3;
};

const STAGE_H = 520;

// --- Static radial-menu geometry (left hemisphere of arc wedges) ---
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};

// Annular sector (arc wedge) path between radii r1..r2 and angles aFrom..aTo.
const sectorPath = (cx: number, cy: number, r1: number, r2: number, aFrom: number, aTo: number) => {
  const [x1, y1] = polar(cx, cy, r2, aFrom);
  const [x2, y2] = polar(cx, cy, r2, aTo);
  const [x3, y3] = polar(cx, cy, r1, aTo);
  const [x4, y4] = polar(cx, cy, r1, aFrom);
  const sweep = aTo > aFrom ? 1 : 0;
  return [
    `M ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `A ${r2} ${r2} 0 0 ${sweep} ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `L ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    `A ${r1} ${r1} 0 0 ${1 - sweep} ${x4.toFixed(2)} ${y4.toFixed(2)}`,
    "Z",
  ].join(" ");
};

// The menu never drifts (static, per design) so its geometry is a module
// constant: 6 wedges spanning the left hemisphere, wedge 01 at the top.
const MENU = (() => {
  const cx = 288;
  const cy = STAGE_H / 2;
  const rOut = 244;
  const rIn = 138;
  const from = 100; // bottom of the arc (screen degrees, y-down)
  const to = 260; // top of the arc
  const gap = 2.4;
  const span = (to - from - gap * 5) / 6;
  const wedges: { path: string; label: [number, number]; anchor: [number, number] }[] = [];
  for (let i = 0; i < 6; i++) {
    const a1 = to - i * (span + gap);
    const a0 = a1 - span;
    const mid = (a0 + a1) / 2;
    wedges.push({
      path: sectorPath(cx, cy, rIn, rOut, a1, a0),
      label: polar(cx, cy, (rIn + rOut) / 2, mid),
      anchor: polar(cx, cy, rIn - 4, mid),
    });
  }
  return { cx, cy, rIn, rOut, wedges, width: 440 };
})();

// Below ~1400px stage width the menu scales down about its left-center.
const menuScaleFor = (w: number) => Math.min(1, Math.max(0.55, w / 1400));

// Wedge order — index into MENU.wedges for a given group id.
const GROUP_ORDER: DataGroupId[] = [
  "market_intel",
  "coding_dev",
  "agentic_auto",
  "daily_runtimes",
  "cost_nano",
  "max_context",
];

// Classify which data group a model belongs to most strongly. Used in
// search mode, where results span groups, to map each result back to a
// wedge so its connector can be drawn from the right origin.
const sourceGroupFor = (m: ModelData): DataGroupId => {
  const b = m.benchmarks;
  if (b) {
    const scored: [DataGroupId, number][] = [
      ["market_intel", b.intelligence_index ?? -1],
      ["coding_dev", b.coding_index ?? -1],
      ["agentic_auto", b.agentic_index ?? -1],
    ];
    scored.sort((x, y) => y[1] - x[1]);
    if (scored[0][1] >= 0) return scored[0][0];
  }
  if ((m.context_length ?? 0) >= 400_000) return "max_context";
  const cost = parseFloat(m.pricing?.prompt ?? "1") + parseFloat(m.pricing?.completion ?? "1");
  if (cost <= 0.000001) return "cost_nano";
  return "daily_runtimes";
};

// Design-system corner brackets: top-left + bottom-right hairlines.
// Parent must be positioned (relative/absolute).
const CornerBrackets: React.FC<{ tone?: string }> = () => null;

// Derive a display provider when the live feed omits one.
const deriveProvider = (m: ModelData) => {
  if (m.provider) return m.provider;
  const s = `${m.name} ${m.id}`.toLowerCase();
  if (s.includes("google") || s.includes("gemini")) return "Google";
  if (s.includes("claude") || s.includes("anthropic")) return "Anthropic";
  if (s.includes("gpt") || s.includes("openai") || /\bo[13]\b/.test(s)) return "OpenAI";
  if (s.includes("deepseek")) return "DeepSeek";
  if (s.includes("llama") || s.includes("meta")) return "Meta";
  if (s.includes("kimi") || s.includes("moonshot")) return "Moonshot";
  if (s.includes("glm") || s.includes("z-ai") || s.includes("z.ai")) return "Z.ai";
  if (s.includes("cohere") || s.includes("north")) return "Cohere";
  if (s.includes("sakana") || s.includes("fugu")) return "Sakana AI";
  return "OpenRouter";
};

export default function NeuralPipelineHUD({
  models,
  t,
}: NeuralPipelineHUDProps) {
  const { theme } = useTheme();
  const pal = PALETTES[theme] ?? PALETTES["matrix-mode"];

  const [activeGroup, setActiveGroup] = useState<DataGroupId>("market_intel");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [stageW, setStageW] = useState(0);
  const [hoverWedge, setHoverWedge] = useState<number | null>(null);

  // ---------------------------------------------------------------- //
  // DATA LAYER — group→query mapping + selected-model state (kept).   //
  // ---------------------------------------------------------------- //
  const dataGroups: DataGroupConfig[] = useMemo(
    () => [
      { id: "market_intel", label: t("intel") || "Market Intelligence", short: t("grp_intel"), desc: "High reasoning, complex math & logic leaders", icon: <FileText size={16} /> },
      { id: "coding_dev", label: t("coding") || "Coding & Dev Ops", short: t("grp_coding"), desc: "Code generation, syntax lints & repo refactoring", icon: <Code size={16} /> },
      { id: "agentic_auto", label: t("agentic") || "Agentic Autonomy", short: t("grp_agentic"), desc: "Multi-step tool calling & autonomous workflows", icon: <Cpu size={16} /> },
      { id: "daily_runtimes", label: t("top_daily_runtimes") || "Top Daily Runtimes", short: t("grp_runtimes"), desc: "Highest throughput speed & lowest TTFT latency", icon: <Zap size={16} /> },
      { id: "cost_nano", label: "Cost-Efficient / Nano", short: t("grp_cost"), desc: "Lowest pricing per 1M token budget champions", icon: <DollarSign size={16} /> },
      { id: "max_context", label: "Maximum Context", short: t("grp_context"), desc: "200k to 1M+ token memory window giants", icon: <Database size={16} /> },
    ],
    [t]
  );

  const outputNodes = useMemo(() => {
    if (activeGroup === "search_query" && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      return models
        .filter((m) => {
          const matchName = m.name.toLowerCase().includes(q);
          const matchProv = (m.provider || "").toLowerCase().includes(q);
          const matchDesc = (m.description || "").toLowerCase().includes(q);
          const matchCases = (m.use_cases || []).some((uc) => uc.toLowerCase().includes(q));
          return matchName || matchProv || matchDesc || matchCases;
        })
        .slice(0, 5);
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

  // Selected model is DERIVED: the clicked id if it survives the current
  // query, otherwise rank 1. Clearing selectedId (on group/search change)
  // therefore auto-selects rank 1 — no setState-in-effect needed.
  const selectedModel = useMemo(() => {
    if (outputNodes.length === 0) return null;
    return outputNodes.find((m) => m.id === selectedId) ?? outputNodes[0];
  }, [outputNodes, selectedId]);

  const activeGroupTitle = useMemo(() => {
    if (activeGroup === "search_query") return `${t("search_label")} "${searchQuery.toUpperCase()}"`;
    const g = dataGroups.find((d) => d.id === activeGroup);
    return g ? g.short : t("grp_intel");
  }, [activeGroup, searchQuery, dataGroups, t]);

  // Search mode: each result maps back to its strongest data group, so the
  // connectors fan out from every wedge that contributed a result instead
  // of from one (wrong) wedge.
  const isSearch = activeGroup === "search_query";
  const nodeSources = useMemo<DataGroupId[]>(
    () => outputNodes.map((m) => (isSearch ? sourceGroupFor(m) : (activeGroup as DataGroupId))),
    [outputNodes, isSearch, activeGroup]
  );
  const involvedWedges = useMemo(
    () => new Set(isSearch ? nodeSources.map((id) => GROUP_ORDER.indexOf(id)) : []),
    [isSearch, nodeSources]
  );
  const srcShort = useCallback(
    (id: DataGroupId) => dataGroups.find((g) => g.id === id)?.short ?? "INTEL",
    [dataGroups]
  );

  const metricBadgeFor = useCallback(
    (model: ModelData) => {
      if (activeGroup === "daily_runtimes") return `${model.ttft ?? 110}ms`;
      if (activeGroup === "cost_nano") return `$${(parseFloat(model.pricing?.prompt ?? "0") * 1_000_000).toFixed(2)}/1M`;
      if (activeGroup === "max_context") return `${((model.context_length ?? 0) / 1000).toFixed(0)}k`;
      if (activeGroup === "coding_dev") return `${model.benchmarks?.coding_index ?? model.score ?? 0}%`;
      if (activeGroup === "agentic_auto") return `${model.benchmarks?.agentic_index ?? model.score ?? 0}%`;
      return `${model.benchmarks?.intelligence_index ?? model.score ?? 0}%`;
    },
    [activeGroup]
  );

  // Share % across the current node set (used for the pill on selected row).
  const shareFor = useCallback(
    (model: ModelData) => {
      const val = (m: ModelData) =>
        m.benchmarks?.intelligence_index ?? m.benchmarks?.coding_index ?? m.benchmarks?.agentic_index ?? m.score ?? 0;
      const total = outputNodes.reduce((acc, m) => acc + val(m), 0);
      if (total <= 0) return 0;
      return Math.round((val(model) / total) * 100);
    },
    [outputNodes]
  );

  // ---------------------------------------------------------------- //
  // Selected-model description typewriter → DECRYPTED_SPEC line.      //
  // ---------------------------------------------------------------- //
  const specText = useMemo(() => {
    if (!selectedModel) return "";
    return (
      selectedModel.description ||
      `Ideal for ${selectedModel.use_cases?.join(", ") || "general purpose reasoning tasks"}.`
    );
  }, [selectedModel]);

  // Typewriter: only setState inside the interval callback (no synchronous
  // setState in the effect body). On (re)start the first tick resets to 0,
  // so switching models retypes from the beginning at ~16ms / 3 chars.
  const [typedLen, setTypedLen] = useState(0);
  useEffect(() => {
    if (reduced || specText.length === 0) return;
    let i = 0;
    let first = true;
    const id = window.setInterval(() => {
      if (first) {
        i = 0;
        first = false;
      }
      i = Math.min(specText.length, i + 3);
      setTypedLen(i);
      if (i >= specText.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [specText, reduced]);

  const typed = reduced ? specText : specText.slice(0, typedLen);
  const typeProgress = specText.length > 0 ? typed.length / specText.length : 1;

  // ---------------------------------------------------------------- //
  // Environment flags: mobile + reduced-motion.                       //
  // ---------------------------------------------------------------- //
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsMobile(mq.matches);
      setReduced(rm.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  // ---------------------------------------------------------------- //
  // Canvas + animation plumbing (refs so the rAF loop never restarts).//
  // ---------------------------------------------------------------- //
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const paletteRef = useRef<Palette>(PALETTES[theme] ?? PALETTES["matrix-mode"]);
  const sizeRef = useRef({ w: 0, h: STAGE_H });
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0, ty: 0, cx: 0, cy: 0 });
  const impulseRef = useRef({ mag: 0, start: -10 });
  const speckRef = useRef<{ x: number; y: number; ph: number; sp: number; c: number }[]>([]);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);

  // Latest render state the loop reads without re-subscribing.
  const stateRef = useRef({
    activeGroupIndex: 0,
    nodeCount: 0,
    selectedIndex: -1,
    isParsing: false,
    reduced: false,
    parsingStart: -10,
    isSearch: false,
    nodeSrc: [] as number[],
  });

  useEffect(() => {
    paletteRef.current = PALETTES[theme] ?? PALETTES["matrix-mode"];
  }, [theme]);

  useEffect(() => {
    // -1 while searching: no single active wedge, connectors come from nodeSrc.
    stateRef.current.activeGroupIndex = GROUP_ORDER.indexOf(activeGroup as DataGroupId);
    stateRef.current.isSearch = isSearch;
    stateRef.current.nodeSrc = nodeSources.map((id) => GROUP_ORDER.indexOf(id));
    stateRef.current.nodeCount = outputNodes.length;
    stateRef.current.selectedIndex = selectedModel
      ? outputNodes.findIndex((m) => m.id === selectedModel.id)
      : -1;
    stateRef.current.isParsing = isParsing;
    stateRef.current.reduced = reduced;
  }, [activeGroup, isSearch, nodeSources, outputNodes, selectedModel, isParsing, reduced]);

  const pushImpulse = useCallback((mag: number) => {
    impulseRef.current = { mag, start: performance.now() };
  }, []);

  // Parsing pulse driven from event handlers (not an effect): mark the
  // node-appear stagger origin, flag parsing, and clear it after ~460ms.
  const parseTimer = useRef<number | null>(null);
  const startParsing = useCallback(() => {
    stateRef.current.parsingStart = performance.now();
    setIsParsing(true);
    if (parseTimer.current != null) window.clearTimeout(parseTimer.current);
    parseTimer.current = window.setTimeout(() => setIsParsing(false), 460);
  }, []);
  useEffect(() => () => {
    if (parseTimer.current != null) window.clearTimeout(parseTimer.current);
  }, []);

  // Geometry for the current stage size. Positions are pure JS; DOM only
  // gets a transform, so there is no layout thrash.
  const layout = useCallback((w: number, h: number) => {
    // Core sits slightly left of center — closer to the radial menu.
    const coreX = w * 0.45;
    const coreY = h / 2;
    const nodeW = Math.max(250, Math.min(320, w * 0.26));
    const nodeH = 76;

    // Right node rows: upright (no tilt), slight arc bulge only.
    const nodes: { cx: number; cy: number }[] = [];
    const rSpan = 40;
    const rBulge = w * 0.06;
    const rightEdge = w * 0.985;
    for (let j = 0; j < 5; j++) {
      const f = j / 4;
      const aDeg = -rSpan + f * 2 * rSpan;
      const aRad = (aDeg * Math.PI) / 180;
      const bulge = Math.cos(aRad);
      const cx = rightEdge - nodeW / 2 - (1 - bulge) * rBulge;
      const cy = h * 0.14 + f * h * 0.72;
      nodes.push({ cx, cy });
    }

    return { coreX, coreY, nodeW, nodeH, nodes };
  }, []);

  const layoutRef = useRef(layout(0, STAGE_H));

  // Resize / DPR handling.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight || STAGE_H;
      sizeRef.current = { w, h };
      layoutRef.current = layout(w, h);
      setStageW(w);

      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rebuild background specks bound to the new dimensions.
      const specks: { x: number; y: number; ph: number; sp: number; c: number }[] = [];
      for (let i = 0; i < 180; i++) {
        specks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          ph: Math.random() * Math.PI * 2,
          sp: 0.6 + Math.random() * 1.8,
          c: Math.random() > 0.7 ? 1 : 0, // accent vs silver
        });
      }
      speckRef.current = specks;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    return () => ro.disconnect();
  }, [layout, isMobile]);

  // Cursor parallax target (normalized within the stage).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || isMobile) return;
    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - r.left) / Math.max(1, r.width);
      mouseRef.current.y = (e.clientY - r.top) / Math.max(1, r.height);
    };
    stage.addEventListener("mousemove", onMove);
    return () => stage.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  // ---------------------------------------------------------------- //
  // The single rAF loop: applies transforms + draws the canvas.       //
  // ---------------------------------------------------------------- //
  const drawFrame = useCallback((nowMs: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pal = paletteRef.current;
    const { w, h } = sizeRef.current;
    const L = layoutRef.current;
    const st = stateRef.current;
    const isRed = st.reduced;
    const t = isRed ? 0 : (nowMs - startRef.current) / 1000;

    // --- core parallax (lerped, ≤16px) ---
    const m = mouseRef.current;
    if (!isRed) {
      m.tx = Math.max(-16, Math.min(16, (m.x - 0.5) * 32));
      m.ty = Math.max(-16, Math.min(16, (m.y - 0.5) * 32));
    } else {
      m.tx = 0;
      m.ty = 0;
    }
    m.cx += (m.tx - m.cx) * 0.08;
    m.cy += (m.ty - m.cy) * 0.08;
    const coreX = L.coreX + m.cx;
    const coreY = L.coreY + m.cy;

    // --- node drift (subtle), applied via transform (no layout thrash) ---
    const drift = (i: number, seed: number) => {
      if (isRed) return { dx: 0, dy: 0 };
      const amp = 2 + ((i * 37 + seed) % 2); // 2–3px — gentle low gravity
      const freq = 0.5 + (((i * 53 + seed) % 20) / 100); // 0.5–0.7Hz
      const phase = (i * 1.7 + seed) % (Math.PI * 2);
      return {
        dx: amp * 0.3 * Math.cos(2 * Math.PI * freq * t + phase),
        dy: amp * Math.sin(2 * Math.PI * freq * t + phase),
      };
    };

    // The left radial menu is static — wire anchors come straight from
    // MENU geometry, mapped through the responsive menu scale.
    const menuS = menuScaleFor(w);
    const menuPt = (p: [number, number]) => ({
      x: p[0] * menuS,
      y: h / 2 + (p[1] - h / 2) * menuS,
    });

    // Right output node rows.
    const nodePts: { x: number; y: number }[] = [];
    for (let j = 0; j < st.nodeCount; j++) {
      const n = L.nodes[j];
      if (!n) continue;
      const d = drift(j, 29);
      const el = nodeRefs.current[j];
      // Node appear stagger (~110ms) after a group change.
      let appear = 1;
      if (!isRed) {
        const since = nowMs - st.parsingStart - j * 110;
        appear = Math.max(0, Math.min(1, since / 320));
      }
      if (el) {
        el.style.transform = `translate(${n.cx - L.nodeW / 2 + d.dx}px, ${n.cy - L.nodeH / 2 + d.dy}px)`;
        el.style.opacity = String(0.25 + appear * 0.75);
      }
      nodePts.push({ x: n.cx + d.dx - L.nodeW / 2, y: n.cy + d.dy });
    }

    // Core DOM element follows the parallax.
    if (coreRef.current) {
      coreRef.current.style.transform = `translate(-50%, -50%) translate(${m.cx}px, ${m.cy}px)`;
    }

    // === CANVAS DRAW ===
    ctx.clearRect(0, 0, w, h);

    // Background flickering specks.
    const specks = speckRef.current;
    for (let i = 0; i < specks.length; i++) {
      const s = specks[i];
      const fl = isRed ? 0.5 : 0.35 + 0.55 * Math.abs(Math.sin(t * s.sp + s.ph));
      ctx.fillStyle = hexToRgba(s.c ? pal.accent : pal.silver, fl * 0.4);
      ctx.fillRect(s.x, s.y, 1.4, 1.4);
    }

    // Impulse envelope (exp decay ~380ms).
    const imp = impulseRef.current;
    const impVal = isRed ? 0 : imp.mag * Math.exp(-(nowMs - imp.start) / 380);

    // 3 dashed orbital circles around the core.
    ctx.save();
    ctx.setLineDash([2, 7]);
    for (let o = 0; o < 3; o++) {
      const rr = 70 + o * 26;
      ctx.beginPath();
      ctx.lineDashOffset = (isRed ? 0 : t * (o % 2 === 0 ? 8 : -6));
      ctx.strokeStyle = hexToRgba(pal.silver, 0.16 - o * 0.03);
      ctx.lineWidth = 1;
      ctx.arc(coreX, coreY, rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 64-tick rotating ring.
    const ringR = 150;
    const ringRot = isRed ? 0 : t * 0.25;
    for (let k = 0; k < 64; k++) {
      const a = (k / 64) * Math.PI * 2 + ringRot;
      const long = k % 8 === 0;
      const r0 = ringR;
      const r1 = ringR + (long ? 8 : 4);
      ctx.strokeStyle = hexToRgba(pal.accent, long ? 0.5 : 0.22);
      ctx.lineWidth = long ? 1.4 : 1;
      ctx.beginPath();
      ctx.moveTo(coreX + Math.cos(a) * r0, coreY + Math.sin(a) * r0);
      ctx.lineTo(coreX + Math.cos(a) * r1, coreY + Math.sin(a) * r1);
      ctx.stroke();
    }

    // Always-animated dither burst: ~92 radial rays of 2px squares.
    const RAYS = 92;
    const baseR = 44;
    const gap = 4.2;
    for (let r = 0; r < RAYS; r++) {
      const a0 = (r / RAYS) * Math.PI * 2;
      // Layered sine fields drive ray length.
      const field =
        0.45 +
        0.28 * Math.sin(t * 1.7 + r * 0.5) +
        0.18 * Math.sin(t * 0.9 + r * 0.13) +
        0.1 * Math.sin(t * 2.6 + r * 0.27);
      const len = Math.max(6, (field + impVal * 1.4) * 60);
      const steps = Math.floor(len / gap);
      for (let s = 0; s < steps; s++) {
        const rad = baseR + s * gap;
        const a = a0 + rad * 0.004; // slight spiral curl
        const x = coreX + Math.cos(a) * rad;
        const y = coreY + Math.sin(a) * rad;
        const fade = 1 - s / steps;
        ctx.fillStyle = hexToRgba(pal.accent, Math.max(0, fade * 0.7));
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }

    // Wires (skipped on mobile). Active card→core and core→each node.
    if (!isMobile) {
      const drawWire = (
        x0: number,
        y0: number,
        x1: number,
        y1: number,
        active: boolean
      ) => {
        const c1x = x0 + (x1 - x0) * 0.5;
        const c2x = x1 - (x1 - x0) * 0.5;
        const alpha = active ? 0.85 : 0.18;
        ctx.save();
        ctx.setLineDash([5, 6]);
        ctx.lineDashOffset = isRed ? 0 : -t * 22;
        ctx.strokeStyle = hexToRgba(pal.accent, alpha);
        ctx.lineWidth = active ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(c1x, y0, c2x, y1, x1, y1);
        ctx.stroke();
        ctx.restore();

        // 3 square pulse packets travelling outward.
        if (!isRed) {
          for (let k = 0; k < 3; k++) {
            const u = (t * 0.35 + k / 3) % 1;
            const px = bez(x0, c1x, c2x, x1, u);
            const py = bez(y0, y0, y1, y1, u);
            ctx.fillStyle = hexToRgba(pal.accent, active ? 0.95 : 0.3);
            ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
          }
        }
      };

      // Wedge → core connectors (with a small square at each anchor).
      // Normal mode: one wire from the active wedge. Search mode: one wire
      // from every wedge that contributed a result to the current set.
      const wedgeWireFrom = (wIdx: number) => {
        const wdg = MENU.wedges[wIdx];
        if (!wdg) return;
        const ap = menuPt(wdg.anchor);
        drawWire(ap.x, ap.y, coreX - 30, coreY, true);
        ctx.fillStyle = hexToRgba(pal.accent, 0.9);
        ctx.fillRect(ap.x - 2, ap.y - 2, 4, 4);
      };
      if (st.isSearch) {
        const seen = new Set<number>();
        for (const s of st.nodeSrc) if (s >= 0) seen.add(s);
        seen.forEach(wedgeWireFrom);
      } else if (st.activeGroupIndex >= 0) {
        wedgeWireFrom(st.activeGroupIndex);
      }

      // core → each node.
      for (let j = 0; j < nodePts.length; j++) {
        const np = nodePts[j];
        drawWire(coreX + 30, coreY, np.x, np.y, j === st.selectedIndex);
      }
    }
  }, [isMobile]);

  // Loop driver + IntersectionObserver pause.
  useEffect(() => {
    if (isMobile) return; // mobile has no canvas stage
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    startRef.current = performance.now();
    let visible = true;

    const loop = (now: number) => {
      drawFrame(now);
      if (!reduced && visible) rafRef.current = requestAnimationFrame(loop);
    };

    const start = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      drawFrame(performance.now()); // position elements immediately (no flash)
      if (!reduced) rafRef.current = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 }
    );
    io.observe(stage);
    start();

    return () => {
      io.disconnect();
      stop();
    };
  }, [drawFrame, reduced, isMobile]);

  // Redraw a static frame on theme change while in reduced-motion mode.
  useEffect(() => {
    if (reduced && !isMobile) drawFrame(performance.now());
  }, [theme, reduced, isMobile, drawFrame, outputNodes, selectedModel]);

  // ---------------------------------------------------------------- //
  // Handlers                                                          //
  // ---------------------------------------------------------------- //
  const handleGroupClick = (id: DataGroupId) => {
    pushImpulse(1); // big impulse
    setSearchQuery("");
    setSelectedId(null); // fall back to rank 1 in the new set
    setActiveGroup(id);
    startParsing();
  };

  const handleNodeClick = (model: ModelData) => {
    pushImpulse(0.4); // small impulse
    setSelectedId(model.id);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedId(null);
    if (val.trim().length > 0) setActiveGroup("search_query");
    else if (activeGroup === "search_query") setActiveGroup("market_intel");
    startParsing();
  };

  // Safe metric-cell values (fixes the "NaNK" TOKENS USED bug).
  const tokensUsed = useMemo(() => {
    if (!selectedModel) return "N/A";
    const score =
      selectedModel.score ??
      selectedModel.benchmarks?.intelligence_index ??
      selectedModel.benchmarks?.coding_index ??
      selectedModel.benchmarks?.agentic_index ??
      80;
    return `${(score * 135).toFixed(0)}K`;
  }, [selectedModel]);

  // Mirror the loop's layout() math in render (no ref reads in render).
  const nodeW = Math.max(250, Math.min(320, stageW * 0.26));
  const menuScale = menuScaleFor(stageW || 1400);

  // ================================================================ //
  // RENDER                                                            //
  // ================================================================ //
  return (
    <div className="w-full flex flex-col gap-4 font-mono relative select-none">
      {/* ---------- STAGE (desktop) or STACK (mobile) ---------- */}
      {isMobile ? (
        // Mobile: no canvas (no rAF cost). Groups → K parser divider → nodes,
        // ≥44px touch targets, same data layer and selection flow.
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex flex-col mb-3">
              <span className="text-xs font-bold text-theme-text uppercase tracking-widest">{t("data_groups")}</span>
              <span className="text-xs text-theme-text-muted mt-0.5">{`// ${t("select_group_hint")}`}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {dataGroups.map((group) => {
                const isActive = activeGroup === group.id;
                return (
                  <button
                    key={group.id}
                    onClick={() => handleGroupClick(group.id)}
                    className={`min-h-[44px] py-2 px-3 border text-left transition-colors flex items-center gap-2 ${
                      isActive
                        ? "bg-theme-accent border-theme-accent text-theme-void"
                        : "bg-theme-void/60 border-theme-border/30 text-theme-text-muted active:bg-theme-accent/10"
                    }`}
                  >
                    <span className={isActive ? "text-theme-void" : "text-theme-text-muted"}>{group.icon}</span>
                    <span className="text-xs font-extrabold tracking-widest truncate">{group.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* K parser divider — mobile's version of the core + ACTIVE GROUP
              readout: shows what is being parsed and the feed status. */}
          <div className="py-1">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-theme-border/40" />
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: pal.accent,
                  boxShadow: `0 0 10px ${hexToRgba(pal.accent, 0.25)}`,
                }}
              >
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundColor: pal.bg,
                    WebkitMaskImage: "url(/Bentos/K.svg)",
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskImage: "url(/Bentos/K.svg)",
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              </div>
              <div className="flex-1 h-px bg-theme-border/40" />
            </div>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs">
              <span className="font-extrabold tracking-widest uppercase text-theme-accent truncate max-w-[60%]">
                {activeGroupTitle}
              </span>
              <span className="text-theme-border/60 select-none">/</span>
              <span className="text-theme-text-muted animate-pulse">
                {isParsing ? t("parsing_data") : t("feed_stable")}
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-col mb-3">
              <span className="text-xs font-bold text-theme-text uppercase tracking-widest">{t("output_nodes")}</span>
              <span className="text-xs text-theme-text-muted mt-0.5">{`// ${t("generated_insights")}`}</span>
            </div>
            <div className="flex flex-col gap-2">
              {outputNodes.length === 0 ? (
                <div className="p-6 border border-theme-border/40 bg-theme-void/70 text-center flex flex-col items-center gap-2">
                  <AlertTriangle className="w-7 h-7 text-theme-accent" />
                  <div className="text-xs font-bold text-theme-accent">{t("no_telemetry")}</div>
                  {searchQuery.trim().length > 0 && (
                    <div className="text-xs text-theme-text-muted">{`${t("no_match")} "${searchQuery}"`}</div>
                  )}
                </div>
              ) : (
                outputNodes.map((model, idx) => {
                  const isSelected = selectedModel?.id === model.id;
                  const filled = [10, 8, 7, 6, 5][idx] ?? 4;
                  return (
                    <button
                      key={model.id}
                      onClick={() => handleNodeClick(model)}
                      className={`relative w-full p-3 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? "border-theme-accent bg-theme-void/80 shadow-[0_0_15px_var(--theme-border-glow)]"
                          : "border-theme-border/30 bg-theme-void/60 active:bg-theme-accent/5"
                      }`}
                      style={{ opacity: isParsing ? 0.4 : 1 }}
                    >
                      <CornerBrackets tone={isSelected ? "bg-theme-accent" : "bg-theme-border/70"} />

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-1.5 h-1.5 shrink-0 ${
                              isSelected ? "bg-theme-accent" : "bg-theme-border/70"
                            }`}
                          />
                          <span className={`text-xs font-bold truncate ${isSelected ? "text-theme-accent" : "text-theme-text"}`}>
                            {model.name}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold shrink-0 text-theme-accent">
                          {metricBadgeFor(model)}
                        </span>
                      </div>

                      <div className="text-xs text-theme-text-muted/70 truncate mt-0.5">
                        {deriveProvider(model)}{" // "}{model.modality || "text->text"}
                      </div>

                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <div className="flex items-center gap-[2px]">
                          {Array.from({ length: 10 }).map((_, b) => (
                            <span
                              key={b}
                              className={`w-[3px] h-2.5 ${b < filled ? "bg-theme-accent opacity-90" : "bg-theme-border/50"}`}
                            />
                          ))}
                        </div>
                        {isSelected && (
                          <span className="font-extrabold text-theme-accent">{shareFor(model)}%</span>
                        )}
                        <span className="ml-auto text-theme-text-muted/60 uppercase tracking-wider truncate">
                          SRC: {srcShort(nodeSources[idx])}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={stageRef}
          onClick={() => pushImpulse(0.7)}
          className="relative w-full overflow-hidden transition-opacity duration-500"
          style={{ height: STAGE_H, opacity: stageW > 0 ? 1 : 0 }}
        >
          {/* Canvas — burst, ring, orbitals, wires, specks. */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

          {/* Scanline overlay (≤4% opacity). */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.5) 3px, transparent 4px)",
              opacity: theme === "xuan-mode" ? 0.03 : 0.04,
              mixBlendMode: theme === "xuan-mode" ? "multiply" : "screen",
            }}
          />

          {/* Column header (right only — the radial menu needs no eyebrow). */}
          <div className="absolute top-0 right-0 z-10 text-right pointer-events-none">
            <span className="block text-xs font-bold text-theme-text uppercase tracking-widest">{t("output_nodes")}</span>
            <span className="block text-xs text-theme-text-muted mt-0.5">{`// ${t("generated_insights")}`}</span>
          </div>

          {/* Left: static radial menu — arc wedges, filled when active. */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{ transform: `scale(${menuScale})`, transformOrigin: "0 50%" }}
          >
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width={MENU.width}
              height={STAGE_H}
              viewBox={`0 0 ${MENU.width} ${STAGE_H}`}
            >
              {/* Dashed inner track inside the arc mouth. */}
              <circle
                cx={MENU.cx}
                cy={MENU.cy}
                r={MENU.rIn - 16}
                fill="none"
                stroke={hexToRgba(pal.silver, 0.3)}
                strokeWidth={1}
                strokeDasharray="2 6"
              />
              {dataGroups.map((group, idx) => {
                const isActive = activeGroup === group.id;
                const isHover = hoverWedge === idx;
                // In search mode, wedges whose group contributed a result
                // light up faintly — the connectors originate from them.
                const isInvolved = involvedWedges.has(idx);
                return (
                  <path
                    key={group.id}
                    d={MENU.wedges[idx].path}
                    className="pointer-events-auto cursor-pointer transition-[fill-opacity] duration-200"
                    fill={pal.accent}
                    fillOpacity={isActive ? 1 : isInvolved ? 0.15 : isHover ? 0.12 : 0}
                    stroke={isActive || isInvolved ? pal.accent : hexToRgba(pal.silver, 0.55)}
                    strokeWidth={1}
                    strokeLinejoin="round"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupClick(group.id);
                    }}
                    onMouseEnter={() => setHoverWedge(idx)}
                    onMouseLeave={() => setHoverWedge(null)}
                  />
                );
              })}
            </svg>

            {/* Wedge labels: icon + group title only. */}
            {dataGroups.map((group, idx) => {
              const isActive = activeGroup === group.id;
              const [lx, ly] = MENU.wedges[idx].label;
              return (
                <div
                  key={`lbl-${group.id}`}
                  className="absolute pointer-events-none flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: lx, top: ly, color: isActive ? pal.bg : undefined }}
                >
                  <span className={isActive ? "" : "text-theme-text-muted"}>{group.icon}</span>
                  <span className={`text-xs font-bold tracking-widest ${isActive ? "" : "text-theme-text-muted"}`}>
                    {group.short}
                  </span>
                </div>
              );
            })}

            {/* Active-group readout inside the arc mouth (DS box). */}
            <div
              className="absolute w-[172px] p-2.5 -translate-y-1/2 rounded-xl bg-theme-void/85 border border-theme-border/40 pointer-events-none shadow-lg"
              style={{ left: MENU.cx - 90, top: MENU.cy }}
            >
              <CornerBrackets />
              <span className="block text-xs text-theme-text-muted/70 uppercase tracking-wider font-bold leading-none mb-1">
                {`// ${t("active_group")}`}
              </span>
              <span className="block text-xs font-extrabold tracking-widest uppercase truncate text-theme-accent">
                {activeGroupTitle}
              </span>
              <span className="block text-xs text-theme-text-muted leading-none mt-1.5 animate-pulse">
                {isParsing ? t("parsing_data") : t("feed_stable")}
              </span>
            </div>
          </div>

          {/* Center: K core in a filled circle. */}
          <div
            ref={coreRef}
            className="absolute top-1/2 z-20 w-[72px] h-[72px] rounded-full flex items-center justify-center will-change-transform pointer-events-none"
            style={{
              left: "45%", // must match layout()'s coreX = w * 0.45
              backgroundColor: pal.accent,
              boxShadow: `0 0 14px ${hexToRgba(pal.accent, 0.3)}`,
            }}
          >
            <div
              className="w-8 h-8"
              style={{
                backgroundColor: theme === "xuan-mode" ? PALETTES["xuan-mode"].ink : PALETTES["matrix-mode"].bg,
                WebkitMaskImage: "url(/Bentos/K.svg)",
                WebkitMaskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskImage: "url(/Bentos/K.svg)",
                maskSize: "contain",
                maskRepeat: "no-repeat",
                maskPosition: "center",
              }}
            />
          </div>

          {/* Right: 5 output node rows (terminal cards, upright). */}
          {outputNodes.length === 0 ? (
            <div
              className="absolute z-20 top-1/2 -translate-y-1/2 p-6 rounded-2xl border border-theme-border/40 bg-theme-void/85 text-center flex flex-col items-center gap-2 shadow-xl backdrop-blur-md"
              style={{ right: "1.5%", width: 260 }}
            >
              <AlertTriangle className="w-7 h-7 text-theme-accent" />
              <div className="text-xs font-bold text-theme-accent">{t("no_telemetry")}</div>
              <div className="text-xs text-theme-text-muted">
                {`${t("no_match")} "${searchQuery}"`}
              </div>
            </div>
          ) : (
            outputNodes.map((model, idx) => {
              const isSelected = selectedModel?.id === model.id;
              const filled = [10, 8, 7, 6, 5][idx] ?? 4;
              return (
                <div
                  key={model.id}
                  ref={(el) => {
                    nodeRefs.current[idx] = el;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNodeClick(model);
                  }}
                  style={{
                    width: nodeW,
                    opacity: isParsing ? 0.25 : 1,
                  }}
                  className={`absolute top-0 left-0 z-20 p-3 rounded-xl border cursor-pointer transition-colors will-change-transform bg-theme-void/80 shadow-lg ${
                    isSelected
                      ? "border-theme-accent shadow-[0_0_15px_var(--theme-border-glow)]"
                      : "border-theme-border/30 hover:border-theme-border/60"
                  }`}
                >
                  <CornerBrackets tone={isSelected ? "bg-theme-accent" : "bg-theme-border/70"} />

                  {/* Wire connector nub on the left edge. */}
                  <div
                    className={`absolute -left-[3px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-theme-accent" : "bg-theme-border/70"
                    }`}
                  />

                  {/* Header: status square + name + metric value. */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-1.5 h-1.5 shrink-0 ${
                          isSelected ? "bg-theme-accent" : "bg-theme-border/70"
                        }`}
                      />
                      <span className={`text-xs font-bold truncate ${isSelected ? "text-theme-accent" : "text-theme-text"}`}>
                        {model.name}
                      </span>
                    </div>
                    <span className="text-xs font-extrabold shrink-0 text-theme-accent">
                      {metricBadgeFor(model)}
                    </span>
                  </div>

                  {/* Provider // modalities. */}
                  <div className="text-xs text-theme-text-muted/70 truncate mt-0.5">
                    {deriveProvider(model)}{" // "}{model.modality || "text->text"}
                  </div>

                  {/* Signal blocks + share pill (selected) + per-node source tag. */}
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <div className="flex items-center gap-[2px]">
                      {Array.from({ length: 10 }).map((_, b) => (
                        <span
                          key={b}
                          className={`w-[3px] h-2.5 ${b < filled ? "bg-theme-accent opacity-90" : "bg-theme-border/50"}`}
                        />
                      ))}
                    </div>
                    {isSelected && (
                      <span className="font-extrabold text-theme-accent">{shareFor(model)}%</span>
                    )}
                    <span className="ml-auto text-theme-text-muted/60 uppercase tracking-wider truncate">
                      SRC: {srcShort(nodeSources[idx])}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ---------- METRIC CELLS + DECRYPTED_SPEC ---------- */}
      <div className="pt-3 border-t border-theme-border/30 w-full relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-xs">
          <div className="relative bg-theme-void/80 p-2.5 rounded-xl border border-theme-border/40 flex flex-col justify-center min-h-[56px] shadow-sm">
            <CornerBrackets tone="bg-theme-border/70" />
            <span className="text-theme-text-muted/50 text-xs font-bold uppercase tracking-wider block leading-none mb-1">{t("data_source")}</span>
            <span className="font-extrabold text-theme-text truncate leading-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
              OpenRouter API
            </span>
          </div>

          <div className="relative bg-theme-void/80 p-2.5 rounded-xl border border-theme-border/40 flex flex-col justify-center min-h-[56px] shadow-sm">
            <CornerBrackets tone="bg-theme-border/70" />
            <span className="text-theme-text-muted/50 text-xs font-bold uppercase tracking-wider block leading-none mb-1">{t("model_core")}</span>
            <span className="font-extrabold text-theme-accent truncate leading-tight uppercase">
              {selectedModel ? selectedModel.name : "N/A"}
            </span>
          </div>

          <div className="relative bg-theme-void/80 p-2.5 rounded-xl border border-theme-border/40 flex flex-col justify-center min-h-[56px] shadow-sm">
            <CornerBrackets tone="bg-theme-border/70" />
            <span className="text-theme-text-muted/50 text-xs font-bold uppercase tracking-wider block leading-none mb-1">{t("latency_ttft")}</span>
            <span className="font-extrabold text-theme-text truncate leading-tight">
              {selectedModel ? `${selectedModel.ttft ?? 112}ms` : "N/A"}
            </span>
          </div>

          <div className="relative bg-theme-void/80 p-2.5 rounded-xl border border-theme-border/40 flex flex-col justify-center min-h-[56px] shadow-sm">
            <CornerBrackets tone="bg-theme-border/70" />
            <span className="text-theme-text-muted/50 text-xs font-bold uppercase tracking-wider block leading-none mb-1">{t("tokens_used")}</span>
            <span className="font-extrabold text-theme-text truncate leading-tight">{tokensUsed}</span>
          </div>

          <div className="relative bg-theme-void/80 p-2.5 rounded-xl border border-theme-border/40 flex flex-col justify-center min-h-[56px] shadow-sm">
            <CornerBrackets tone="bg-theme-border/70" />
            <span className="text-theme-text-muted/50 text-xs font-bold uppercase tracking-wider block leading-none mb-1">{t("context_limit")}</span>
            <span className="font-extrabold text-theme-text truncate leading-tight">
              {selectedModel ? `${((selectedModel.context_length ?? 0) / 1000).toFixed(0)}K` : "N/A"}
            </span>
          </div>

          <div className="relative bg-theme-void/80 p-2.5 rounded-xl border border-theme-border/40 flex flex-col justify-center min-h-[56px] shadow-sm">
            <CornerBrackets tone="bg-theme-border/70" />
            <span className="text-theme-text-muted/50 text-xs font-bold uppercase tracking-wider block leading-none mb-1">{t("query_cost")}</span>
            <span className="font-extrabold text-theme-accent truncate leading-tight">
              {selectedModel ? `$${(parseFloat(selectedModel.pricing?.prompt ?? "0") * 1000).toFixed(4)}` : "N/A"}
            </span>
          </div>
        </div>

        {/* DECRYPTED_SPEC — typewriter + completion progress bar. */}
        <div className="relative mt-2.5 p-3 rounded-xl bg-theme-void/80 border border-theme-border/40 flex items-center justify-between text-xs text-theme-text-muted min-h-[40px] leading-none gap-3 shadow-sm">
          <CornerBrackets />
          <span className="truncate flex-1">
            {isParsing ? (
              <span className="text-theme-accent">{`> ${t("parsing_data")} // ${activeGroupTitle}`}</span>
            ) : selectedModel ? (
              <>
                <span className="text-theme-accent">{"> DECRYPTED_SPEC // "}</span>
                {typed}
                {typeProgress < 1 && <span className="inline-block w-1.5 h-2.5 bg-theme-accent align-middle ml-0.5 animate-pulse" />}
              </>
            ) : (
              `> ${t("select_node_hint")}`
            )}
          </span>
          <div className="shrink-0 flex items-center gap-2">
            {/* Completion progress bar tracks the typewriter. */}
            <div className="hidden sm:block w-16 h-1 bg-theme-void border border-theme-border/30 rounded overflow-hidden">
              <div
                className="h-full bg-theme-accent transition-[width] duration-75"
                style={{ width: `${Math.round(typeProgress * 100)}%` }}
              />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t("search_db")}
              className="w-40 px-2 py-1 bg-theme-void border border-theme-border/50 rounded text-xs text-theme-text placeholder:text-theme-text-muted/60 focus:outline-none focus:border-theme-accent transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
