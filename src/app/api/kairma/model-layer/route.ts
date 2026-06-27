import { NextResponse } from 'next/server';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const hub = {
    label: "Singapore Runtime Hub",
    lat: 1.3521,
    lng: 103.8198
  };

  // Base fallback models in case the API fetch fails or no key
  let selectedModels = [
    { id: "anthropic/claude-3.5-sonnet", context_length: 200000, pricing: { prompt: "0.000003" } },
    { id: "openai/gpt-4o", context_length: 128000, pricing: { prompt: "0.000005" } },
    { id: "google/gemini-1.5-flash", context_length: 1000000, pricing: { prompt: "0.00000035" } },
    { id: "meta-llama/llama-3-70b-instruct", context_length: 8192, pricing: { prompt: "0.0000006" } }
  ];

  let openrouterStatus = "offline";
  let modelLayer = "sync_failed";

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (apiKey) {
      // Fetch live models from OpenRouter
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const json = await response.json();
        const allModels = json.data || [];
        
        // Find some specific top models if they exist
        const targetIds = [
          "anthropic/claude-3.5-sonnet",
          "openai/gpt-4o",
          "google/gemini-1.5-flash",
          "meta-llama/llama-3-70b-instruct",
          "mistralai/mistral-large"
        ];
        
        const foundModels = allModels.filter((m: any) => targetIds.includes(m.id)).slice(0, 4);
        
        if (foundModels.length > 0) {
          selectedModels = foundModels;
          openrouterStatus = "live";
          modelLayer = "synced";
        }
      }
    }
  } catch (error) {
    console.error("OpenRouter API fetch failed:", error);
    openrouterStatus = "offline";
    modelLayer = "sync_error";
  }

  // Map the models to our global nodes
  const deploymentNodes = [
    { role: "KOL BD", lat: 35.6762, lng: 139.6503, city: "Tokyo, JP" }, // Tokyo
    { role: "Content Ops", lat: 37.7749, lng: -122.4194, city: "SF, USA" }, // SF
    { role: "Customer Care", lat: 51.5072, lng: -0.1276, city: "London, UK" }, // London
    { role: "Compliance", lat: -23.5505, lng: -46.6333, city: "São Paulo, BR" } // São Paulo
  ];

  const routes = selectedModels.slice(0, 4).map((model: any, idx) => {
    const node = deploymentNodes[idx % deploymentNodes.length];
    
    // Assign visual state based on model
    let visualState = "active";
    if (model.id.includes("claude-3.5") || model.id.includes("gpt-4o")) {
      visualState = "in-progress"; // Let's use this for "heavy reasoning" routes
    }

    return {
      id: `route-${idx}`, // Needed for CSS anchor positioning
      role: node.role,
      location: node.city,
      modelId: model.id,
      contextLimit: model.context_length ? `${Math.round(model.context_length / 1000)}k` : "Unknown",
      promptCost: model.pricing?.prompt ? `$${(parseFloat(model.pricing.prompt) * 1000000).toFixed(2)}/M` : "Unknown",
      marker: { lat: node.lat, lng: node.lng },
      visualState
    };
  });

  return NextResponse.json({
    openrouterStatus,
    modelLayer,
    hub,
    routes,
    metrics: {
      aiRolesMapped: routes.length,
      modelRoutes: "Live",
      runtimeMode: "Sealed",
      pilotReadiness: "In progress"
    }
  });
}
