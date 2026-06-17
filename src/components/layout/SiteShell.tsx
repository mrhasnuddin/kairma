"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteCopy } from "@/lib/language";
import Header, { FocusId, MobileNav } from "./Header";
import VoidBackground from "../visual/VoidBackground";
import GothicGrid from "../visual/GothicGrid";
import PilotModal from "../modal/PilotModal";

// Modular workspace panels
import {
  SolutionsPanel,
  CoreRuntimePanel,
  AboutPanel,
  EcosystemPanel,
  CommunityPanel,
} from "../panels/WorkspacePanels";

export const SiteShell: React.FC = () => {
  const siteCopy = useSiteCopy();
  const [activePanels, setActivePanels] = useState<FocusId[]>([
    "solutions",
    "about",
    "ecosystem",
    "community",
  ]);
  const [booting, setBooting] = useState<boolean>(true);
  const [pilotOpen, setPilotOpen] = useState<boolean>(false);
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [isDesktop, setIsDesktop] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sync state with URL search parameters
  useEffect(() => {
    const checkQueryParam = () => {
      const params = new URLSearchParams(window.location.search);
      const panelsParam = params.get("panels");
      if (panelsParam) {
        const panels = panelsParam
          .split(",")
          .filter((p) =>
            ["solutions", "about", "ecosystem", "community"].includes(p)
          ) as FocusId[];
        setActivePanels(panels);
      } else {
        setActivePanels(["solutions", "about", "ecosystem", "community"]);
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
    
    const params = new URLSearchParams(window.location.search);
    const panelsParam = params.get("panels");
    if (panelsParam) {
      const panels = panelsParam
        .split(",")
        .filter((p) =>
          ["solutions", "about", "ecosystem", "community"].includes(p)
        ) as FocusId[];
      setActivePanels(panels);
    } else {
      setActivePanels(["solutions", "about", "ecosystem", "community"]);
    }
  };

  const handleTogglePanel = (focus: FocusId | "reset") => {
    setActivePanels((prev) => {
      if (focus === "reset") {
        const url = new URL(window.location.href);
        url.searchParams.delete("panels");
        window.history.pushState(null, "", url.pathname + url.search);
        return [];
      }

      let next: FocusId[];
      if (!isDesktop) {
        // Mobile behavior: toggle on means ONLY this panel is active.
        // Toggle off means NO panel is active (which shows core).
        next = prev.includes(focus) ? [] : [focus];
      } else {
        next = prev.includes(focus)
          ? prev.filter((p) => p !== focus)
          : [...prev, focus];
      }

      const url = new URL(window.location.href);
      if (next.length > 0) {
        url.searchParams.set("panels", next.join(","));
      } else {
        url.searchParams.delete("panels");
      }
      window.history.pushState(null, "", url.pathname + url.search);
      return next;
    });
  };

  const isSolActive = activePanels.includes("solutions");
  const isAboutActive = activePanels.includes("about");
  const isEcoActive = activePanels.includes("ecosystem");
  const isCommActive = activePanels.includes("community");
  const isRightActive = isAboutActive || isEcoActive;

  const bc = siteCopy.boot;

  return (
    <VoidBackground className="relative h-[100dvh] w-full flex flex-col gap-3 lg:gap-[10px] p-4 overflow-hidden text-theme-text transition-colors duration-300 bg-theme-void">
      
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
      <GothicGrid opacity={activePanels.length === 4 ? 0.09 : 0.04} />

      {/* 3. OS Header */}
      <Header
        activePanels={activePanels}
        onTogglePanel={handleTogglePanel}
        onOpenPilot={() => setPilotOpen(true)}
      />

      {/* 4. Dashboard Viewport Container */}
      <main className="flex-1 min-h-0 w-full relative z-10 overflow-hidden">
        {/* gap-[6px] drives ALL inter-panel gaps on desktop — no double-padding */}
        <div className="flex flex-col lg:flex-row w-full h-full min-h-0 select-none animate-fade-in lg:gap-[6px]">

          {/* ── Left Column: Workflow OS / Core Runtime / Community ── */}
          <div
            className="flex flex-col min-w-0 min-h-0 overflow-hidden lg:gap-[6px]"
            style={isDesktop ? {
              flex: isRightActive ? "0 0 calc(50% - 3px)" : "1 1 100%",
              height: "100%",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            } : {
              display: isRightActive ? "none" : "flex",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Row 1: Solutions + Core Runtime — gap-[6px] for horizontal split */}
            <div
              className="flex flex-col lg:flex-row w-full min-h-0 overflow-hidden lg:gap-[6px]"
              style={isDesktop ? {
                flex: isCommActive ? "0 0 calc(65% - 3px)" : "1 1 100%",
                height: isCommActive ? "calc(65% - 3px)" : "100%",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              } : {
                display: isCommActive ? "none" : "flex",
                width: "100%",
                height: "100%",
              }}
            >
              {/* Solutions Panel */}
              <div
                className="min-w-0 min-h-0 overflow-hidden flex flex-col"
                style={isDesktop ? {
                  flex: isSolActive ? "0 0 calc(50% - 3px)" : "0 0 0%",
                  height: "100%",
                  opacity: isSolActive ? 1 : 0,
                  visibility: isSolActive ? "visible" : "hidden",
                  pointerEvents: isSolActive ? "auto" : "none",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                } : {
                  display: isSolActive ? "flex" : "none",
                  width: "100%",
                  height: "100%",
                }}
              >
                <SolutionsPanel
                  isCompact={activePanels.includes("about") || activePanels.includes("ecosystem")}
                  onOpenPilot={() => setPilotOpen(true)}
                />
              </div>

              {/* Core Runtime Panel */}
              <div
                className="min-w-0 min-h-0 overflow-hidden flex flex-col"
                style={isDesktop ? {
                  flex: "1 1 0%",
                  height: "100%",
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                } : {
                  display: activePanels.length > 0 ? "none" : "flex",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CoreRuntimePanel isCompact={isSolActive || isAboutActive || isEcoActive} />
              </div>
            </div>

            {/* Row 2: Community */}
            <div
              className="w-full min-w-0 min-h-0 overflow-hidden flex flex-col"
              style={isDesktop ? {
                flex: isCommActive ? "0 0 calc(35% - 3px)" : "0 0 0%",
                height: isCommActive ? "calc(35% - 3px)" : "0%",
                opacity: isCommActive ? 1 : 0,
                visibility: isCommActive ? "visible" : "hidden",
                pointerEvents: isCommActive ? "auto" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              } : {
                display: isCommActive ? "flex" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <CommunityPanel
                onOpenPilot={() => setPilotOpen(true)}
                isCompact={isEcoActive}
              />
            </div>
          </div>

          {/* ── Right Column: Ecosystem / Operational Intel ── */}
          <div
            className="flex flex-col min-w-0 min-h-0 overflow-hidden lg:gap-[6px]"
            style={isDesktop ? {
              flex: isRightActive ? "0 0 calc(50% - 3px)" : "0 0 0%",
              height: "100%",
              opacity: isRightActive ? 1 : 0,
              visibility: isRightActive ? "visible" : "hidden",
              pointerEvents: isRightActive ? "auto" : "none",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            } : {
              display: isRightActive ? "flex" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Ecosystem Panel */}
            <div
              className="w-full min-w-0 min-h-0 overflow-hidden flex flex-col"
              style={isDesktop ? {
                flex: isEcoActive ? (isAboutActive ? "0 0 calc(50% - 3px)" : "1 1 100%") : "0 0 0%",
                height: isEcoActive ? (isAboutActive ? "calc(50% - 3px)" : "100%") : "0%",
                opacity: isEcoActive ? 1 : 0,
                visibility: isEcoActive ? "visible" : "hidden",
                pointerEvents: isEcoActive ? "auto" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              } : {
                display: isEcoActive ? "flex" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <EcosystemPanel isCompact={isCommActive} />
            </div>

            {/* About Panel (Operational Intel) */}
            <div
              className="w-full min-w-0 min-h-0 overflow-hidden flex flex-col"
              style={isDesktop ? {
                flex: isAboutActive ? (isEcoActive ? "0 0 calc(50% - 3px)" : "1 1 100%") : "0 0 0%",
                height: isAboutActive ? (isEcoActive ? "calc(50% - 3px)" : "100%") : "0%",
                opacity: isAboutActive ? 1 : 0,
                visibility: isAboutActive ? "visible" : "hidden",
                pointerEvents: isAboutActive ? "auto" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              } : {
                display: isAboutActive ? "flex" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <AboutPanel isCompact={isSolActive} />
            </div>
          </div>

        </div>
      </main>

      {/* 5. Mobile Bottom Nav */}
      <MobileNav
        activePanels={activePanels}
        onTogglePanel={handleTogglePanel}
        onOpenPilot={() => setPilotOpen(true)}
      />

      {/* 6. Onboarding Pilot Modal */}
      <PilotModal isOpen={pilotOpen} onClose={() => setPilotOpen(false)} />
      
    </VoidBackground>
  );
};

export default SiteShell;
