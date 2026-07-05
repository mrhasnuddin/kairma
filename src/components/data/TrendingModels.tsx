"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, Brain, Code2, Bot, Zap } from "lucide-react";
import { useSiteCopy } from "@/lib/language";

interface ModelBenchmarks {
  intelligence_index?: number;
  coding_index?: number;
  agentic_index?: number;
}

interface ModelPricing {
  prompt: string;
  completion: string;
  isFree: boolean;
}

interface RankedModel {
  rank: number;
  id: string;
  name: string;
  description: string;
  context_length: number;
  modality: string;
  pricing: ModelPricing;
  benchmarks: ModelBenchmarks | null;
}

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: "#D4783A",
  google: "#4A90D9",
  openai: "#10A37F",
  "x-ai": "#E8E8E8",
  mistralai: "#FF7900",
  meta: "#0082FB",
  nvidia: "#76B900",
  qwen: "#9C5AFF",
  deepseek: "#0080FF",
  "z-ai": "#FF4B6E",
  openrouter: "#6366F1",
  poolside: "#00C9A7",
};

function getProviderColor(id: string): string {
  const provider = id.split("/")[0].toLowerCase();
  for (const [key, color] of Object.entries(PROVIDER_COLORS)) {
    if (provider.includes(key)) return color;
  }
  return "#5A7A6A";
}

function getProviderLogo(id: string) {
  const provider = id.split("/")[0].toLowerCase();
  
  // Map provider names to their official domains for the logo API
  let domain = "placeholder.com";
  
  if (provider.includes("google")) domain = "google.com";
  else if (provider.includes("meta")) domain = "meta.com";
  else if (provider.includes("openai")) domain = "openai.com";
  else if (provider.includes("anthropic")) domain = "anthropic.com";
  else if (provider.includes("mistral")) domain = "mistral.ai";
  else if (provider.includes("nvidia")) domain = "nvidia.com";
  else if (provider.includes("poolside")) domain = "poolside.ai";
  else if (provider.includes("cohere")) domain = "cohere.com";
  else if (provider.includes("z-ai")) domain = "z.ai";
  else if (provider.includes("deepseek")) domain = "deepseek.com";
  else if (provider.includes("x-ai")) domain = "x.ai";
  else if (provider.includes("qwen")) domain = "qwenlm.github.io";
  else domain = `${provider}.com`;

  return (
    <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-lg overflow-hidden bg-white/5 border border-theme-border/30 flex items-center justify-center p-0.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img 
        src={`https://icon.horse/icon/${domain}`} 
        alt={`${provider} logo`}
        className="w-full h-full object-contain drop-shadow-sm"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-white font-bold text-xs">${provider.charAt(0).toUpperCase()}</span>`;
        }}
      />
    </div>
  );
}

function formatContext(ctx: number): string {
  if (ctx >= 1_000_000) return `${(ctx / 1_000_000).toFixed(1)}M`;
  if (ctx >= 1_000) return `${Math.round(ctx / 1_000)}K`;
  return `${ctx}`;
}

function formatPrice(p: string): string {
  const n = Number(p);
  if (n === 0) return "Free";
  if (n < 0.000001) return `$${(n * 1_000_000).toFixed(3)}/M`;
  if (n < 0.001) return `$${(n * 1_000_000).toFixed(2)}/M`;
  return `$${n.toFixed(4)}`;
}

function BarChart({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="relative h-2 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function TrendingModels() {
  const [models, setModels] = useState<RankedModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<RankedModel | null>(null);
  const [chartMetric, setChartMetric] = useState<
    "intelligence_index" | "coding_index" | "agentic_index"
  >("intelligence_index");
  
  const siteCopy = useSiteCopy();
  const t = siteCopy.ecosystemModels;

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await fetch("/api/openrouter");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const list: RankedModel[] = data.data || [];
        setModels(list);
        if (list.length > 0) setSelectedModel(list[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-theme-text-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm font-mono uppercase tracking-widest">
          {t.fetching}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-400 font-mono border border-red-900/30 rounded-xl bg-red-950/10">
        Error: {error}
      </div>
    );
  }

  // Compute max benchmark values for normalizing bars
  const maxIntel = Math.max(
    ...models.map((m) => m.benchmarks?.intelligence_index ?? 0),
    100
  );
  const maxCode = Math.max(
    ...models.map((m) => m.benchmarks?.coding_index ?? 0),
    100
  );
  const maxAgent = Math.max(
    ...models.map((m) => m.benchmarks?.agentic_index ?? 0),
    100
  );
  const maxByMetric: Record<typeof chartMetric, number> = {
    intelligence_index: maxIntel,
    coding_index: maxCode,
    agentic_index: maxAgent,
  };

  const metricLabels = {
    intelligence_index: { label: t.metrics.intelligence, icon: Brain, color: "#9C5AFF" },
    coding_index: { label: t.metrics.coding, icon: Code2, color: "#10A37F" },
    agentic_index: { label: t.metrics.agentic, icon: Bot, color: "#D4783A" },
  };

  // Models with benchmark data for the chart
  const chartModels = models
    .filter((m) => m.benchmarks?.[chartMetric] != null)
    .slice(0, 10);

  return (
    <div className="flex flex-col gap-6 w-full pb-4 font-mono">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-theme-accent" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-theme-accent">
              {t.title}
            </span>
          </div>
          <p className="text-xs text-theme-text-muted mt-1 tracking-wider">
            {t.subtitle}
          </p>
        </div>
        <a
          href="https://openrouter.ai/rankings"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-theme-text-muted hover:text-theme-accent transition-colors tracking-wider border border-theme-border/30 px-3 py-1.5 rounded-xl hover:border-theme-accent/40"
        >
          {t.fullRankings}
        </a>
      </div>

      {/* ── Chart Section ── */}
      {chartModels.length > 0 && (
        <div className="border border-theme-border/30 rounded-2xl p-5 bg-theme-void/40">
          {/* Metric Switcher */}
          <div className="flex items-center gap-3 mb-5">
            {(
              Object.entries(metricLabels) as Array<
                [typeof chartMetric, (typeof metricLabels)[typeof chartMetric]]
              >
            ).map(([key, { label, icon: Icon, color }]) => (
              <button
                key={key}
                onClick={() => setChartMetric(key)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                  chartMetric === key
                    ? "text-theme-void border-transparent"
                    : "text-theme-text-muted border-theme-border/30 hover:border-theme-border/60"
                }`}
                style={
                  chartMetric === key
                    ? { backgroundColor: color, borderColor: color }
                    : {}
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Horizontal bar chart */}
          <div className="flex flex-col gap-3">
            {chartModels.map((model, i) => {
              const val = model.benchmarks?.[chartMetric] ?? 0;
              const max = maxByMetric[chartMetric];
              const pct = Math.min(100, (val / max) * 100);
              const provColor = getProviderColor(model.id);
              const isSelected = selectedModel?.id === model.id;
              return (
                <div
                  key={model.id}
                  className={`flex items-center gap-4 cursor-pointer group transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-60 hover:opacity-90"
                  }`}
                  onClick={() => setSelectedModel(model)}
                >
                  {/* Rank */}
                  <span
                    className="w-6 text-right text-xs shrink-0"
                    style={{ color: i < 3 ? provColor : undefined }}
                  >
                    {model.rank}
                  </span>
                  {/* Name */}
                  <span className="w-32 shrink-0 text-xs text-theme-text-muted truncate group-hover:text-theme-text transition-colors">
                    {model.name.replace(/^[^:]+:\s*/, "")}
                  </span>
                  {/* Bar */}
                  <div className="flex-1 relative h-5 flex items-center">
                    <div className="absolute inset-y-0 left-0 w-full bg-white/3 rounded-md" />
                    <div
                      className="absolute left-0 top-0 h-full rounded-md transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: provColor,
                        opacity: isSelected ? 1 : 0.6,
                      }}
                    />
                    <span
                      className="relative z-10 ml-2 text-xs font-bold"
                      style={{ color: isSelected ? "#fff" : provColor }}
                    >
                      {val.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Selected Model Detail Card (Hero Position) ── */}
      {selectedModel && (
        <div
          className="border rounded-2xl p-5 flex flex-col gap-4 transition-all sticky top-0 z-10 bg-theme-void/95 backdrop-blur-md shadow-md"
          style={{ borderColor: `${getProviderColor(selectedModel.id)}40` }}
        >
          <div className="flex items-start gap-4">
            <div className="scale-125 origin-top-left">
              {getProviderLogo(selectedModel.id)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h3 className="text-base font-bold text-theme-text">
                  {selectedModel.name}
                </h3>
                {selectedModel.pricing.isFree && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-theme-accent border border-theme-accent/40 px-2 py-0.5 rounded-md">
                    {t.detailLabels.free}
                  </span>
                )}
                <span className="text-[10px] text-theme-text-muted border border-theme-border/30 px-2 py-0.5 rounded-md">
                  {t.detailLabels.rank} #{selectedModel.rank}
                </span>
              </div>
              <span className="text-xs text-theme-text-muted">
                {selectedModel.id}
              </span>
            </div>
          </div>

          {selectedModel.description && (
            <p className="text-xs sm:text-sm text-theme-text-muted leading-relaxed">
              {selectedModel.description.length > 200
                ? `${selectedModel.description.slice(0, 200)}...`
                : selectedModel.description}
            </p>
          )}

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2 text-theme-text-muted">
              <Zap className="w-4 h-4 text-theme-accent opacity-70" />
              <span>
                {t.detailLabels.context}{" "}
                <span className="text-theme-text font-bold">
                  {formatContext(selectedModel.context_length)}
                </span>
              </span>
            </div>
            {!selectedModel.pricing.isFree && (
              <div className="flex items-center gap-2 text-theme-text-muted">
                <span>
                  {t.detailLabels.input}{" "}
                  <span className="text-theme-text font-bold">
                    {formatPrice(selectedModel.pricing.prompt)}
                  </span>{" "}
                  · {t.detailLabels.output}{" "}
                  <span className="text-theme-text font-bold">
                    {formatPrice(selectedModel.pricing.completion)}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-theme-text-muted">
              <span>
                {t.detailLabels.modality}{" "}
                <span className="text-theme-text font-bold">
                  {selectedModel.modality}
                </span>
              </span>
            </div>
          </div>

          {/* Benchmark bars */}
          {selectedModel.benchmarks && (
            <div className="flex flex-col gap-3 mt-2 pt-4 border-t border-theme-border/20">
              <span className="text-[10px] uppercase tracking-widest text-theme-text-muted">
                {t.detailLabels.benchmarkScores}
              </span>
              {[
                {
                  label: "Intelligence",
                  key: "intelligence_index" as const,
                  color: "#9C5AFF",
                  max: maxIntel,
                  Icon: Brain,
                },
                {
                  label: "Coding",
                  key: "coding_index" as const,
                  color: "#10A37F",
                  max: maxCode,
                  Icon: Code2,
                },
                {
                  label: "Agentic",
                  key: "agentic_index" as const,
                  color: "#D4783A",
                  max: maxAgent,
                  Icon: Bot,
                },
              ].map(({ label, key, color, max, Icon }) => {
                const val = selectedModel.benchmarks?.[key];
                if (val == null) return null;
                return (
                  <div key={key} className="flex items-center gap-4">
                    <Icon className="w-4 h-4 shrink-0" style={{ color }} />
                    <span className="w-24 text-xs text-theme-text-muted">
                      {label}
                    </span>
                    <div className="flex-1">
                      <BarChart value={val} max={max} color={color} />
                    </div>
                    <span
                      className="w-10 text-right text-xs font-bold"
                      style={{ color }}
                    >
                      {val.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Ranking List ── */}
      <div className="flex flex-col">
        {/* Column headers */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-theme-border/20 text-[10px] sm:text-xs uppercase tracking-widest text-theme-text-muted">
          <span className="w-6 text-right">#</span>
          <span className="flex-1">{t.tableHeaders.model}</span>
          <span className="w-16 text-right hidden sm:block">{t.tableHeaders.context}</span>
          <span className="w-20 text-right hidden sm:block">{t.tableHeaders.price}</span>
          <span className="w-14 text-right">{t.tableHeaders.intel}</span>
          <span className="w-14 text-right">{t.tableHeaders.code}</span>
        </div>

        {/* Rows */}
        {models.map((model, i) => {
          const isSelected = selectedModel?.id === model.id;
          const intel = model.benchmarks?.intelligence_index;
          const code = model.benchmarks?.coding_index;
          return (
            <div
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all border-b border-theme-border/10 ${
                isSelected
                  ? "bg-theme-accent/5 border-l-2 border-l-theme-accent"
                  : "hover:bg-white/3 border-l-2 border-l-transparent"
              }`}
            >
              {/* Rank badge */}
              <span
                className={`w-6 text-right text-xs font-bold shrink-0 ${
                  i === 0
                    ? "text-yellow-400"
                    : i === 1
                    ? "text-slate-300"
                    : i === 2
                    ? "text-amber-600"
                    : "text-theme-text-muted"
                }`}
              >
                {model.rank}
              </span>

              {/* Provider avatar + name */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getProviderLogo(model.id)}
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-bold text-theme-text truncate leading-tight">
                    {model.name.replace(/^[^:]+:\s*/, "")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-theme-text-muted truncate mt-0.5">
                    {model.id.split("/")[0]}
                  </span>
                </div>
                {model.pricing.isFree && (
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-theme-accent border border-theme-accent/40 px-1.5 py-0.5 rounded-md ml-2">
                    {t.detailLabels.free}
                  </span>
                )}
              </div>

              {/* Context */}
              <span className="w-16 text-right text-xs text-theme-text-muted hidden sm:block shrink-0">
                {formatContext(model.context_length)}
              </span>

              {/* Price */}
              <span className="w-20 text-right text-xs text-theme-text-muted hidden sm:block shrink-0">
                {model.pricing.isFree
                  ? "—"
                  : formatPrice(model.pricing.prompt)}
              </span>

              {/* Intelligence mini-bar */}
              <div className="w-14 flex flex-col items-end gap-1 shrink-0">
                {intel != null ? (
                  <>
                    <span className="text-[10px] text-theme-text-muted">
                      {intel.toFixed(0)}
                    </span>
                    <BarChart value={intel} max={maxIntel} color="#9C5AFF" />
                  </>
                ) : (
                  <span className="text-[10px] text-theme-border/40">—</span>
                )}
              </div>

              {/* Coding mini-bar */}
              <div className="w-14 flex flex-col items-end gap-1 shrink-0">
                {code != null ? (
                  <>
                    <span className="text-[10px] text-theme-text-muted">
                      {code.toFixed(0)}
                    </span>
                    <BarChart value={code} max={maxCode} color="#10A37F" />
                  </>
                ) : (
                  <span className="text-[10px] text-theme-border/40">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
