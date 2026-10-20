import React, { Suspense } from "react";
import SiteShellV5 from "@/components/v5/SiteShellV5";
import { fetchRankedModels, slimModel, type ModelRow } from "@/lib/openrouter";

// Rankings are prerendered and refreshed at most every 5 minutes (ISR); the
// client re-syncs on the same cadence.
export const revalidate = 300;

// v5. The v3 and v4 shells stay in components/ until v5 is signed off.
export default async function Home() {
  let models: ModelRow[] = [];
  try {
    models = (await fetchRankedModels(10)).map(slimModel);
  } catch {
    // OpenRouter down at render time: the leaderboard says so and retries.
  }
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-k-paper" />}>
      <SiteShellV5 models={models} />
    </Suspense>
  );
}
