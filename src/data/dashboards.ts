export interface PanelConfig {
  id: string;
  title: string;
  size: "XS" | "S" | "M" | "L";
  type:
    | "hero"
    | "problem"
    | "whyNow"
    | "insight"
    | "whatKairmaIs"
    | "architecture"
    | "howItWorks"
    | "defensibility"
    | "story"
    | "partners"
    | "enterprise"
    | "builders"
    | "provenance"
    | "causalTermination"
    | "visual"
    | "status"
    | "atmospheric";
}

export interface DashboardConfig {
  id: string;
  name: string;
  panels: PanelConfig[];
}

export const dashboards: Record<string, DashboardConfig> = {
  home: {
    id: "home",
    name: "Hero Dashboard",
    panels: [
      { id: "hero-main", title: "HERO MAIN", size: "L", type: "hero" },
      { id: "local-chamber", title: "LOCAL CHAMBER", size: "S", type: "visual" },
      { id: "atmospheric-main", title: "ATMOSPHERIC", size: "XS", type: "atmospheric" }
    ]
  },
  problem: {
    id: "problem",
    name: "Problem & Insight Dashboard",
    panels: [
      { id: "problem-pain", title: "THE PROBLEM", size: "M", type: "problem" },
      { id: "why-now-forces", title: "WHY NOW", size: "M", type: "whyNow" },
      { id: "insight-columns", title: "THE INSIGHT", size: "L", type: "insight" },
      { id: "atmospheric-problem", title: "ATMOSPHERIC", size: "XS", type: "atmospheric" }
    ]
  },
  architecture: {
    id: "architecture",
    name: "Architecture & Flow Dashboard",
    panels: [
      { id: "what-is-kairma", title: "WHAT KAIRMA IS", size: "M", type: "whatKairmaIs" },
      { id: "arch-diagram", title: "ARCHITECTURE", size: "M", type: "architecture" },
      { id: "flywheel-steps", title: "HOW IT WORKS", size: "L", type: "howItWorks" },
      { id: "box-telemetry", title: "BOX TELEMETRY", size: "XS", type: "visual" },
      { id: "atmospheric-arch", title: "ATMOSPHERIC", size: "XS", type: "atmospheric" }
    ]
  },
  agents: {
    id: "agents",
    name: "Agents & Defensibility Dashboard",
    panels: [
      { id: "moats-defensibility", title: "DEFENSIBILITY", size: "L", type: "defensibility" },
      { id: "digital-workforce", title: "DIGITAL WORKFORCE", size: "XS", type: "status" },
      { id: "story-sections", title: "THE STORY", size: "L", type: "story" },
      { id: "partners-logos", title: "IN MOTION", size: "S", type: "partners" },
      { id: "atmospheric-agents", title: "ATMOSPHERIC", size: "XS", type: "atmospheric" }
    ]
  },
  begin: {
    id: "begin",
    name: "Onboarding & Provenance Dashboard",
    panels: [
      { id: "begin-enterprise", title: "BEGIN ENTERPRISE", size: "M", type: "enterprise" },
      { id: "begin-builders", title: "BEGIN BUILDERS", size: "M", type: "builders" },
      { id: "kairma-provenance", title: "KAIRMA PROVENANCE", size: "L", type: "provenance" },
      { id: "causal-termination", title: "CAUSAL TERMINATION", size: "XS", type: "causalTermination" },
      { id: "atmospheric-begin", title: "ATMOSPHERIC", size: "XS", type: "atmospheric" }
    ]
  }
};
