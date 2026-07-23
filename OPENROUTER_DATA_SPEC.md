# OpenRouter API Data Pipeline & Schema Specification

Our Kairma application pulls live LLM metadata, pricing, context lengths, and benchmark scores from the **OpenRouter REST API** (`v1`) via two dedicated server-side Next.js API endpoints:

1. **`/api/openrouter`**: Provides the top 24 daily-trending models ranked with full pricing, modality, and benchmark indexes for the 3D Orbit HUD and Trending Models tables.
2. **`/api/kairma/model-layer`**: Merges live OpenRouter pricing and context length data into our 8 global geographical runtime nodes (`DeploymentGlobe` & `SiteShellV3`).

---

## 1. Upstream OpenRouter API Source (`/api/openrouter`)

### Upstream Request Details
* **Endpoint URL**: `https://openrouter.ai/api/v1/models?order=top-daily`
* **HTTP Method**: `GET`
* **Authentication**: `Authorization: Bearer <OPENROUTER_API_KEY>` (Optional/fallback to public rate limit if unset)
* **Server-Side Cache (`revalidate`)**: `300 seconds` (5 minutes)

### Raw Upstream Response & Filtering Logic
The raw OpenRouter API returns a large array under `data: []`. Our server route applies the following pipeline:
1. **Router Exclusions**: Filters out abstract routing/redirect endpoints by checking if `pricing.prompt >= 0` (OpenRouter routers use `-1` for dynamic pricing).
2. **Candidate Pool Slice**: Selects the **Top 24 models** sorted by daily usage (`slice(0, 24)`).
3. **Data Normalization**: Transforms the nested upstream structure into a clean, flat object (`RankedModel`).

---

## 2. Normalized JSON Schema (`RankedModel` — `/api/openrouter`)

When calling `GET /api/openrouter`, the server returns `{ "data": RankedModel[] }` where each item matches the following TypeScript interface:

```typescript
interface ModelBenchmarks {
  intelligence_index?: number; // e.g., 85.4 (Artificial Analysis general intelligence index)
  coding_index?: number;       // e.g., 92.1 (Coding capability score)
  agentic_index?: number;      // e.g., 88.7 (Agentic workflow & tool-use efficiency index)
}

interface ModelPricing {
  prompt: string;              // Per-token prompt cost in USD (e.g., "0.000003")
  completion: string;          // Per-token completion cost in USD (e.g., "0.000015")
  isFree: boolean;             // True if prompt cost equals 0
}

interface RankedModel {
  rank: number;                // 1-indexed rank based on daily volume (1 to 24)
  id: string;                  // Full OpenRouter model slug (e.g., "anthropic/claude-3.5-sonnet")
  name: string;                // Human-readable model display name (e.g., "Claude 3.5 Sonnet")
  description: string;         // Model summary & capabilities description
  context_length: number;      // Maximum token window size (e.g., 200000)
  modality: string;            // Supported I/O modalities (e.g., "text->text", "multimodal->text")
  pricing: ModelPricing;       // Token pricing structure
  benchmarks: ModelBenchmarks | null; // Artificial Analysis benchmark metrics (null if unrated)
}
```

### Example Payload (`GET /api/openrouter`)
```json
{
  "data": [
    {
      "rank": 1,
      "id": "anthropic/claude-3.5-sonnet",
      "name": "Claude 3.5 Sonnet",
      "description": "Anthropic's most intelligent model for complex reasoning, coding, and agentic workflows.",
      "context_length": 200000,
      "modality": "multimodal->text",
      "pricing": {
        "prompt": "0.000003",
        "completion": "0.000015",
        "isFree": false
      },
      "benchmarks": {
        "intelligence_index": 88.5,
        "coding_index": 93.2,
        "agentic_index": 91.0
      }
    },
    {
      "rank": 2,
      "id": "openai/gpt-4o",
      "name": "GPT-4o",
      "description": "OpenAI's flagship multimodal model with real-time reasoning capabilities.",
      "context_length": 128000,
      "modality": "multimodal->text",
      "pricing": {
        "prompt": "0.0000025",
        "completion": "0.00001",
        "isFree": false
      },
      "benchmarks": {
        "intelligence_index": 86.8,
        "coding_index": 90.5,
        "agentic_index": 89.4
      }
    }
  ]
}
```

---

## 3. Geographical Runtime Route Schema (`/api/kairma/model-layer`)

Our second endpoint merges live OpenRouter model data (`https://openrouter.ai/api/v1/models`) with **8 static geographical runtime nodes** (`Tokyo`, `San Francisco`, `London`, `São Paulo`, `Sydney`, `Singapore`, `Cape Town`, `Paris`).

### Merged Node Schema (`routes[]`)
For each of our 8 geographical nodes, the endpoint looks up the live OpenRouter model by `modelId` and calculates formatted live telemetry:
* **`contextLimit`**: Formatted string converted from OpenRouter `context_length` (`200000` -> `"200k"`).
* **`promptCost`**: Formatted string converted from OpenRouter `pricing.prompt` to cost-per-million tokens (`0.000003` -> `"$3.00/M"`).
* **`visualState`**: Dynamic operational indicator (`"in-progress"` for heavy reasoning routes like Claude 3.5 / GPT-4o, `"active"` for fast throughput routes).

```typescript
interface ModelRouteNode {
  id: string;          // Route DOM identifier (e.g., "route-0")
  role: string;        // Enterprise AI assignment (e.g., "KOL BD", "Content Ops", "Security Ops")
  location: string;    // Geographical node city (e.g., "Tokyo, JP", "SF, USA")
  modelId: string;     // OpenRouter target slug (e.g., "anthropic/claude-3.5-sonnet")
  contextLimit: string;// Formatted context window (e.g., "200k")
  promptCost: string;  // Formatted cost per million tokens (e.g., "$3.00/M")
  marker: {
    lat: number;       // Latitude coordinate for 3D Globe rendering
    lng: number;       // Longitude coordinate for 3D Globe rendering
  };
  visualState: "active" | "in-progress"; // Node status indicator
}
```

---

## 4. How Frontend Components Consume This Data

1. **`TrendingModels.tsx`**:
   * Fetches `/api/openrouter` on load (`useEffect`).
   * Renders the interactive ranking table grouped by Provider (`anthropic`, `openai`, `deepseek`, `meta`, etc.) using `getProviderColor()`.
   * Displays capability gauges derived directly from `benchmarks.intelligence_index`, `coding_index`, and `agentic_index`.

2. **`NeuralPipelineHUD.tsx` & `LLMOrbit3D.tsx`**:
   * Receives `RankedModel[]` to construct the **3D Soul.io Orbit Canvas**.
   * Categorizes models into orbital rings / tiers based on pricing and benchmark indices:
     * `🟢 CORE` (High speed, cost-effective models)
     * `🟣 SPECIALIST` (Domain-tuned / coding specialist models)
     * `🔴 FRONTIER` (Top reasoning engines like Claude 3.5 & GPT-4o)
   * Bidirectionally synchronizes 3D node selection (`hoverId`, `activeId`) with the telemetry detail panel.

3. **`DeploymentGlobe.tsx` & `SiteShellV3.tsx`**:
   * Fetches `/api/kairma/model-layer` (`revalidate: 60`).
   * Maps live token costs (`$X.XX/M`) and context limits onto interactive geographical nodes on our 3D globe visualization.
