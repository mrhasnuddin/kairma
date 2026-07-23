import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models?order=top-daily', {
      headers: {
        ...(process.env.OPENROUTER_API_KEY ? { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } : {})
      },
      // 5-minute server-side cache — the client re-syncs on the same cadence.
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch models from OpenRouter' },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.data)) {
      return NextResponse.json(
        { error: 'Invalid response format from OpenRouter' },
        { status: 500 }
      );
    }

    // Exclude router/redirect models. Take the top 100 by daily usage so all
    // three routing tiers (Frontier / Specialist / Core) have a rich pool and
    // the 12-slot routing pyramid is fully populated with distinct providers.
    const ranked = data.data
      .filter((m: { pricing?: { prompt?: string | number } }) => {
        const p = Number(m?.pricing?.prompt ?? -1);
        return p >= 0; // exclude routers (price = -1)
      })
      .slice(0, 100)
      .map((model: {
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
        benchmarks?: {
          artificial_analysis?: {
            intelligence_index?: number;
            coding_index?: number;
            agentic_index?: number;
          };
        };
      }, idx: number) => {
        const sp = model.supported_parameters ?? [];
        return {
          rank: idx + 1,
          id: model.id,
          canonical_slug: model.canonical_slug ?? model.id,
          name: model.name,
          created: model.created ?? null,
          description: model.description ?? '',
          context_length: model.context_length ?? 0,
          modality: model.architecture?.modality ?? 'text->text',
          input_modalities: model.architecture?.input_modalities ?? ['text'],
          max_output: model.top_provider?.max_completion_tokens ?? null,
          pricing: {
            prompt: model.pricing?.prompt ?? '0',
            completion: model.pricing?.completion ?? '0',
            cache_read: model.pricing?.input_cache_read ?? null,
            isFree: Number(model.pricing?.prompt ?? 1) === 0,
          },
          // Honest capability badges distilled from supported_parameters.
          caps: {
            tools: sp.includes('tools'),
            reasoning: sp.includes('reasoning') || sp.includes('include_reasoning'),
            structured: sp.includes('structured_outputs') || sp.includes('response_format'),
          },
          benchmarks: model.benchmarks?.artificial_analysis ?? null,
        };
      });

    return NextResponse.json({ data: ranked });
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
