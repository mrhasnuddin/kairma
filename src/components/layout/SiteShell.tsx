"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteCopy } from "@/data/site-copy";
import Header from "./Header";
import VoidBackground from "../visual/VoidBackground";
import GothicGrid from "../visual/GothicGrid";
import PilotModal from "../modal/PilotModal";

// Modular workspace panels
import {
  HeroPanel,
  StatusPanel,
  ProblemNumPanel,
  PainPointsPanel,
  WhyNowPanel,
  InsightPanel,
  FourLayersPanel,
  ArchitecturePanel,
  HowItWorksPanel,
  LocalChamberPanel,
  DefensibilitySummaryPanel,
  SopEnginePanel,
  AgentLibraryPanel,
  MsAlignmentPanel,
  AssetLightHardwarePanel,
  Web3LabsPanel,
  MicrosoftPanel,
  YZiLabsPanel,
  InMotionPanel,
  ProvenanceSummaryPanel,
  BeginEnterprisePanel,
  BeginBuildersPanel,
  ClosingStatementPanel,
  ContactPanel,
  LocationsPanel,
  ProvenancePanel,
  MiniBeginPanel,
} from "../panels/WorkspacePanels";

type GroupId = "problem" | "system" | "moats" | "story" | "begin";

interface PanelInfo {
  id: string;
  group: GroupId | "persistent" | "persistent-cta";
}

const PANELS: PanelInfo[] = [
  // Persistent
  { id: "hero", group: "persistent" },
  { id: "status", group: "persistent" },

  // Group: Problem
  { id: "problem-num", group: "problem" },
  { id: "pain-points", group: "problem" },
  { id: "why-now", group: "problem" },
  { id: "insight", group: "problem" },

  // Group: System
  { id: "four-layers", group: "system" },
  { id: "architecture", group: "system" },
  { id: "how-it-works", group: "system" },
  { id: "local-chamber", group: "system" },

  // Group: Moats
  { id: "defensibility-summary", group: "moats" },
  { id: "sop-engine", group: "moats" },
  { id: "agent-library", group: "moats" },
  { id: "ms-alignment", group: "moats" },
  { id: "asset-light-hardware", group: "moats" },

  // Group: Story
  { id: "web3labs", group: "story" },
  { id: "microsoft", group: "story" },
  { id: "yzi-labs", group: "story" },
  { id: "in-motion", group: "story" },
  { id: "provenance-summary", group: "story" },

  // Group: Begin
  { id: "begin-enterprise", group: "begin" },
  { id: "begin-builders", group: "begin" },
  { id: "closing-statement", group: "begin" },
  { id: "contact", group: "begin" },
  { id: "locations", group: "begin" },
  { id: "provenance", group: "begin" },

  // Mini Begin CTA
  { id: "mini-begin", group: "persistent-cta" },
];

const PANEL_MAP = {
  "hero": HeroPanel,
  "status": StatusPanel,
  "problem-num": ProblemNumPanel,
  "pain-points": PainPointsPanel,
  "why-now": WhyNowPanel,
  "insight": InsightPanel,
  "four-layers": FourLayersPanel,
  "architecture": ArchitecturePanel,
  "how-it-works": HowItWorksPanel,
  "local-chamber": LocalChamberPanel,
  "defensibility-summary": DefensibilitySummaryPanel,
  "sop-engine": SopEnginePanel,
  "agent-library": AgentLibraryPanel,
  "ms-alignment": MsAlignmentPanel,
  "asset-light-hardware": AssetLightHardwarePanel,
  "web3labs": Web3LabsPanel,
  "microsoft": MicrosoftPanel,
  "yzi-labs": YZiLabsPanel,
  "in-motion": InMotionPanel,
  "provenance-summary": ProvenanceSummaryPanel,
  "begin-enterprise": BeginEnterprisePanel,
  "begin-builders": BeginBuildersPanel,
  "closing-statement": ClosingStatementPanel,
  "contact": ContactPanel,
  "locations": LocationsPanel,
  "provenance": ProvenancePanel,
  "mini-begin": MiniBeginPanel,
};

export const SiteShell: React.FC = () => {
  const [activeGroups, setActiveGroups] = useState<GroupId[]>([]);
  const [booting, setBooting] = useState<boolean>(true);
  const [pilotOpen, setPilotOpen] = useState<boolean>(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);

  // Sync state with URL search parameters
  useEffect(() => {
    const checkQueryParam = () => {
      const params = new URLSearchParams(window.location.search);
      const groupsStr = params.get("groups");
      if (groupsStr) {
        const groups = groupsStr
          .split(",")
          .filter((g) => ["problem", "system", "moats", "story", "begin"].includes(g)) as GroupId[];
        setActiveGroups(groups.slice(0, 2)); // Enforce max 2 groups
      } else {
        // Default to Problem + System if already booted, otherwise empty (Large Hero)
        const hasBooted = localStorage.getItem("kairma-booted") === "true";
        if (hasBooted) {
          setActiveGroups(["problem", "system"]);
        } else {
          setActiveGroups([]);
        }
      }
    };

    checkQueryParam();
    window.addEventListener("popstate", checkQueryParam);

    const hasBooted = localStorage.getItem("kairma-booted");
    if (hasBooted === "true") {
      setBooting(false);
    }

    return () => window.removeEventListener("popstate", checkQueryParam);
  }, []);

  // Boot sequence line-by-line timing
  useEffect(() => {
    if (!booting) return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < 7) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 200);

    const timeout = setTimeout(() => {
      finishBoot();
    }, 2600);

    const handleSkip = () => {
      finishBoot();
    };

    window.addEventListener("keydown", handleSkip);
    window.addEventListener("mousedown", handleSkip);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener("keydown", handleSkip);
      window.removeEventListener("mousedown", handleSkip);
    };
  }, [booting]);

  const finishBoot = () => {
    localStorage.setItem("kairma-booted", "true");
    setBooting(false);
    // On first boot finished, open default panels
    const params = new URLSearchParams(window.location.search);
    if (!params.get("groups")) {
      setActiveGroups(["problem", "system"]);
      const url = new URL(window.location.href);
      url.searchParams.set("groups", "problem,system");
      window.history.replaceState(null, "", url.pathname + url.search);
    }
  };

  const handleToggleGroup = (group: GroupId | "reset") => {
    let nextGroups: GroupId[] = [];
    if (group === "reset") {
      nextGroups = [];
    } else {
      if (activeGroups.includes(group)) {
        nextGroups = activeGroups.filter((item) => item !== group);
      } else {
        const next = [...activeGroups, group];
        if (next.length > 2) {
          nextGroups = next.slice(1); // oldest-out queue
        } else {
          nextGroups = next;
        }
      }
    }

    setActiveGroups(nextGroups);

    // Sync with URL params
    const url = new URL(window.location.href);
    if (nextGroups.length > 0) {
      url.searchParams.set("groups", nextGroups.join(","));
    } else {
      url.searchParams.delete("groups");
    }
    window.history.pushState(null, "", url.pathname + url.search);
  };

  const bc = siteCopy.boot;
  const activeCount = activeGroups.length;

  // Filter panels to display
  const visiblePanels = PANELS.filter((panel) => {
    if (activeCount === 0) {
      // Large Hero identity state
      return panel.id === "hero" || panel.id === "status" || panel.id === "local-chamber";
    }
    if (panel.group === "persistent") return true;
    if (panel.group === "persistent-cta") {
      return activeCount > 0 && !activeGroups.includes("begin");
    }
    return activeGroups.includes(panel.group as GroupId);
  });

  const getPanelGridClasses = (panelId: string) => {
    if (activeCount === 0) {
      if (panelId === "hero") return "lg:col-span-2 lg:row-span-2 h-full min-h-[400px]";
      if (panelId === "local-chamber") return "lg:col-span-1 h-full";
      if (panelId === "status") return "lg:col-span-1 h-full";
      return "hidden";
    }

    switch (panelId) {
      case "hero":
        return "lg:col-span-1 h-full";
      case "status":
        return "lg:col-span-1 h-full";
      case "architecture":
        return activeGroups.includes("system") && !activeGroups.includes("problem")
          ? "lg:col-span-2 h-full min-h-[360px]"
          : "lg:col-span-1 h-full min-h-[360px]";
      case "how-it-works":
        return activeGroups.includes("system") && !activeGroups.includes("problem") && !activeGroups.includes("begin")
          ? "lg:col-span-3 h-full"
          : "lg:col-span-2 h-full";
      case "insight":
        return activeGroups.includes("problem") && activeGroups.includes("system")
          ? "lg:col-span-2 h-full"
          : "lg:col-span-1 h-full";
      case "provenance-summary":
        return "lg:col-span-2 h-full";
      case "closing-statement":
        return "lg:col-span-2 h-full";
      case "begin-enterprise":
        return "lg:col-span-1 h-full";
      case "begin-builders":
        return "lg:col-span-1 h-full";
      case "mini-begin":
        if (activeGroups.includes("problem") && activeCount === 1) return "lg:col-span-3 h-full";
        if (activeGroups.includes("moats") && activeCount === 1) return "lg:col-span-2 h-full";
        return "lg:col-span-1 h-full";
      default:
        return "lg:col-span-1 h-full";
    }
  };

  return (
    <VoidBackground className="relative min-h-screen lg:h-screen w-full flex flex-col pt-2.5 pb-24 lg:pb-5 px-5 lg:overflow-hidden text-theme-text transition-colors duration-300 bg-theme-void">
      
      {/* 1. Boot Sequence Overlay */}
      <AnimatePresence>
        {booting && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-[#0B0E0B] text-[#1FAA68] font-mono p-6 md:p-16 flex flex-col justify-start select-none"
          >
            <div className="absolute top-4 right-4 text-[9px] text-[#1FAA68]/50 tracking-wider">
              [ PRESS ANY KEY TO SKIP BOOT ]
            </div>

            <div className="flex flex-col gap-1 max-w-sm mt-12 md:mt-24 font-mono select-none">
              {visibleLines >= 1 && (
                <div className="text-xs uppercase tracking-widest">{bc.title}</div>
              )}
              {visibleLines >= 2 && (
                <div className="text-xs">{bc.separator}</div>
              )}
              {visibleLines >= 3 && (
                <div className="text-xs flex justify-between">
                  <span>{bc.steps[0].text}</span>
                  <span className="text-[#1FAA68] font-bold">{bc.steps[0].status}</span>
                </div>
              )}
              {visibleLines >= 4 && (
                <div className="text-xs flex justify-between">
                  <span>{bc.steps[1].text}</span>
                  <span className="text-[#1FAA68] font-bold">{bc.steps[1].status}</span>
                </div>
              )}
              {visibleLines >= 5 && (
                <div className="text-xs flex justify-between">
                  <span>{bc.steps[2].text}</span>
                  <span className="text-[#1FAA68] font-bold">{bc.steps[2].status}</span>
                </div>
              )}
              {visibleLines >= 6 && (
                <div className="text-xs">{bc.separator}</div>
              )}
              {visibleLines >= 7 && (
                <div className="text-xs flex items-center gap-1 leading-none">
                  <span>{bc.ready}</span>
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-1.5 h-3.5 bg-[#1FAA68] select-none"
                  >
                    █
                  </motion.span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Visual Layer Backgrounds */}
      <GothicGrid opacity={activeCount === 0 ? 0.09 : 0.04} />

      {/* 3. OS Header */}
      <Header
        activeGroups={activeGroups}
        onToggleGroup={handleToggleGroup}
        onOpenPilot={() => setPilotOpen(true)}
      />

      {/* 4. Dashboard Viewport Container */}
      <main className="flex-1 min-h-0 w-full mt-4 pb-24 lg:pb-0 relative z-10 flex flex-col justify-start overflow-y-auto">
        <div className="workspace-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full [grid-auto-flow:dense]">
          <AnimatePresence mode="popLayout">
            {visiblePanels.map((panel) => {
              const Component = PANEL_MAP[panel.id as keyof typeof PANEL_MAP];
              const gridClass = getPanelGridClasses(panel.id);
              
              return (
                <motion.section
                  key={panel.id}
                  layout
                  layoutId={panel.id}
                  className={`panel ${gridClass}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Component
                    isCompact={activeCount > 0}
                    activeGroups={activeGroups}
                    onToggleGroup={handleToggleGroup}
                    onOpenPilot={() => setPilotOpen(true)}
                    onNavigateToGroup={handleToggleGroup}
                  />
                </motion.section>
              );
            })}
          </AnimatePresence>
        </div>
      </main>

      {/* 5. Onboarding Pilot Modal */}
      <PilotModal isOpen={pilotOpen} onClose={() => setPilotOpen(false)} />
      
    </VoidBackground>
  );
};

export default SiteShell;
