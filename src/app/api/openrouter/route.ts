import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models?order=top-daily', {
      headers: {
        ...(process.env.OPENROUTER_API_KEY ? { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` } : {})
      },
      next: { revalidate: 3600 },
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

    // Exclude router/redirect models and take top 15
    const ranked = data.data
      .filter((m: { pricing?: { prompt?: string | number } }) => {
        const p = Number(m?.pricing?.prompt ?? -1);
        return p >= 0; // exclude routers (price = -1)
      })
      .slice(0, 15)
      .map((model: {
        id: string;
        name: string;
        description?: string;
        context_length?: number;
        architecture?: { modality?: string };
        pricing?: { prompt?: string; completion?: string };
        top_provider?: { max_completion_tokens?: number };
        benchmarks?: {
          artificial_analysis?: {
            intelligence_index?: number;
            coding_index?: number;
            agentic_index?: number;
          };
        };
      }, idx: number) => ({
        rank: idx + 1,
        id: model.id,
        name: model.name,
        description: model.description ?? '',
        context_length: model.context_length ?? 0,
        modality: model.architecture?.modality ?? 'text->text',
        pricing: {
          prompt: model.pricing?.prompt ?? '0',
          completion: model.pricing?.completion ?? '0',
          isFree: Number(model.pricing?.prompt ?? 1) === 0,
        },
        benchmarks: model.benchmarks?.artificial_analysis ?? null,
      }));

    return NextResponse.json({ data: ranked });
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
