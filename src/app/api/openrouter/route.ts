import { NextResponse } from "next/server";
import { fetchRankedModels } from "@/lib/openrouter";

// Top 100 by daily usage, so the leaderboard and the v3 routing pyramid have a
// full pool. Mapping lives in @/lib/openrouter (shared with the page render).
export async function GET() {
  try {
    return NextResponse.json({ data: await fetchRankedModels(100) });
  } catch (error) {
    console.error("Error fetching OpenRouter models:", error);
    return NextResponse.json({ error: "Failed to fetch models from OpenRouter" }, { status: 502 });
  }
}
