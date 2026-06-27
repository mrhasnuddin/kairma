import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  const hub = {
    label: "Singapore Runtime Hub",
    lat: 1.3521,
    lng: 103.8198
  };

  // 8 static base models mapped to static geographical nodes.
  // This guarantees we always render exactly 8 nodes on the globe, ensuring consistency.
  const baseNodes = [
    { role: "KOL BD", lat: 35.6762, lng: 139.6503, city: "Tokyo, JP", modelId: "anthropic/claude-3.5-sonnet", contextLimit: "200k", promptCost: "$3.00/M" },
    { role: "Content Ops", lat: 37.7749, lng: -122.4194, city: "SF, USA", modelId: "openai/gpt-4o", contextLimit: "128k", promptCost: "$2.50/M" },
    { role: "Customer Care", lat: 51.5072, lng: -0.1276, city: "London, UK", modelId: "google/gemini-flash-1.5", contextLimit: "1000k", promptCost: "$0.085/M" },
    { role: "Compliance", lat: -23.5505, lng: -46.6333, city: "São Paulo, BR", modelId: "meta-llama/llama-3-70b-instruct", contextLimit: "8k", promptCost: "$0.59/M" },
    { role: "FDE Agent", lat: -33.8688, lng: 151.2093, city: "Sydney, AU", modelId: "mistralai/mistral-large", contextLimit: "128k", promptCost: "$2.00/M" },
    { role: "Data Routing", lat: 1.3521, lng: 103.8198, city: "Singapore, SG", modelId: "cohere/command-r-plus", contextLimit: "128k", promptCost: "$2.50/M" },
    { role: "Security Ops", lat: -33.9249, lng: 18.4241, city: "Cape Town, ZA", modelId: "qwen/qwen-2.5-72b-instruct", contextLimit: "32k", promptCost: "$0.40/M" },
    { role: "Translation", lat: 48.8566, lng: 2.3522, city: "Paris, FR", modelId: "deepseek/deepseek-chat", contextLimit: "64k", promptCost: "$0.14/M" }
  ];

  let openrouterStatus = "offline";
  let modelLayer = "sync_failed";
  let liveModelsMap: Record<string, any> = {};

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
        
        // Index live models by their ID for fast lookup
        allModels.forEach((m: any) => {
          liveModelsMap[m.id] = m;
        });

        openrouterStatus = "live";
        modelLayer = "synced";
      }
    }
  } catch (error) {
    console.error("OpenRouter API fetch failed:", error);
    openrouterStatus = "offline";
    modelLayer = "sync_error";
  }

  // Build the routes by merging live OpenRouter data into the static nodes.
  // If OpenRouter is offline or missing a model, it falls back to the static config.
  const routes = baseNodes.map((node, idx) => {
    const liveModel = liveModelsMap[node.modelId];
    
    let contextLimit = node.contextLimit;
    let promptCost = node.promptCost;

    if (liveModel) {
      if (liveModel.context_length) {
        contextLimit = `${Math.round(liveModel.context_length / 1000)}k`;
      }
      if (liveModel.pricing?.prompt) {
        promptCost = `$${(parseFloat(liveModel.pricing.prompt) * 1000000).toFixed(2)}/M`;
      }
    }

    // Assign visual state based on model ID
    let visualState = "active";
    if (node.modelId.includes("claude-3.5") || node.modelId.includes("gpt-4o")) {
      visualState = "in-progress"; // Heavy reasoning routes
    }

    return {
      id: `route-${idx}`, // Needed for CSS anchor positioning
      role: node.role,
      location: node.city,
      modelId: node.modelId,
      contextLimit,
      promptCost,
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
