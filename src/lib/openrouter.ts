/* OpenRouter model rankings, shared by /api/openrouter and the home page's
   server render. Ordered by OpenRouter's own top-daily usage. */

export interface RankedModel {
  rank: number;
  id: string;
  canonical_slug: string;
  name: string;
  created: number | null;
  description: string;
  context_length: number;
  modality: string;
  input_modalities: string[];
  max_output: number | null;
  pricing: { prompt: string; completion: string; cache_read: string | null; isFree: boolean };
  caps: { tools: boolean; reasoning: boolean; structured: boolean };
  benchmarks: { intelligence_index?: number; coding_index?: number; agentic_index?: number } | null;
}

/** The fields the home leaderboard needs (keeps the page payload small). */
export type ModelRow = Pick<RankedModel, "rank" | "id" | "name" | "context_length" | "pricing" | "benchmarks">;
export const slimModel = (m: ModelRow): ModelRow => ({
  rank: m.rank, id: m.id, name: m.name, context_length: m.context_length, pricing: m.pricing, benchmarks: m.benchmarks,
});

interface RawModel {
  id: string;
  canonical_slug?: string;
  name: string;
  created?: number;
  description?: string;
  context_length?: number;
  architecture?: { modality?: string; input_modalities?: string[] };
  pricing?: { prompt?: string; completion?: string; input_cache_read?: string };
  top_provider?: { max_completion_tokens?: number };
  supported_parameters?: string[];
  benchmarks?: { artificial_analysis?: { intelligence_index?: number; coding_index?: number; agentic_index?: number } };
}

/** Top `limit` models by daily usage, routers excluded. Throws on a bad response. */
export async function fetchRankedModels(limit = 100): Promise<RankedModel[]> {
  const response = await fetch("https://openrouter.ai/api/v1/models?order=top-daily", {
    headers: process.env.OPENROUTER_API_KEY ? { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } : {},
    // 5-minute server-side cache; the client re-syncs on the same cadence.
    next: { revalidate: 300 },
  });
  if (!response.ok) throw new Error(`OpenRouter ${response.status}`);
  const data = await response.json();
  if (!data || !Array.isArray(data.data)) throw new Error("OpenRouter: invalid response");

  return (data.data as RawModel[])
    .filter((m) => Number(m?.pricing?.prompt ?? -1) >= 0) // routers report -1
    .slice(0, limit)
    .map((model, idx) => {
      const sp = model.supported_parameters ?? [];
      return {
        rank: idx + 1,
        id: model.id,
        canonical_slug: model.canonical_slug ?? model.id,
        name: model.name,
        created: model.created ?? null,
        description: model.description ?? "",
        context_length: model.context_length ?? 0,
        modality: model.architecture?.modality ?? "text->text",
        input_modalities: model.architecture?.input_modalities ?? ["text"],
        max_output: model.top_provider?.max_completion_tokens ?? null,
        pricing: {
          prompt: model.pricing?.prompt ?? "0",
          completion: model.pricing?.completion ?? "0",
          cache_read: model.pricing?.input_cache_read ?? null,
          isFree: Number(model.pricing?.prompt ?? 1) === 0,
        },
        caps: {
          tools: sp.includes("tools"),
          reasoning: sp.includes("reasoning") || sp.includes("include_reasoning"),
          structured: sp.includes("structured_outputs") || sp.includes("response_format"),
        },
        benchmarks: model.benchmarks?.artificial_analysis ?? null,
      };
    });
}
