"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteCopy } from "@/lib/language";
import Header from "./Header";
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

export type FocusId = "solutions" | "about" | "ecosystem" | "community";

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

  const handleTogglePanel = (panelId: FocusId | "reset") => {
    if (panelId === "reset") {
      const allPanels: FocusId[] = ["solutions", "about", "ecosystem", "community"];
      setActivePanels(allPanels);
      const url = new URL(window.location.href);
      url.searchParams.set("panels", allPanels.join(","));
      window.history.pushState(null, "", url.pathname + url.search);
      return;
    }

    setActivePanels((prev) => {
      const order: FocusId[] = ["solutions", "about", "ecosystem", "community"];
      const next = prev.includes(panelId)
        ? prev.filter((p) => p !== panelId)
        : order.filter((p) => prev.includes(p) || p === panelId);

      // Sync with URL params
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
  const hasRow2 = isEcoActive || isCommActive;
  const isRightActive = isAboutActive || isCommActive;

  const solFlex = isSolActive ? (isRightActive ? 2 : 5) : 0;
  const coreFlex = !isSolActive && isRightActive && !hasRow2 ? 2 : 1;
  const leftFlex = solFlex + coreFlex;

  const aboutFlex = !isSolActive ? (hasRow2 ? 5 : 4) : 3;
  const rightFlex = isAboutActive ? aboutFlex : 3;

  const solStyle: React.CSSProperties = {
    flex: isDesktop ? `${solFlex} 1 0%` : "none",
    width: isDesktop ? "auto" : "100%",
    height: isDesktop ? "100%" : (isSolActive ? "auto" : "0px"),
    opacity: isSolActive ? 1 : 0,
    visibility: isSolActive ? "visible" : "hidden",
    pointerEvents: isSolActive ? "auto" : "none",
    marginRight: isDesktop ? (isSolActive ? "16px" : "0px") : "0px",
    marginBottom: isDesktop ? "0px" : (isSolActive ? "16px" : "0px"),
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const coreStyle: React.CSSProperties = {
    flex: isDesktop ? `${coreFlex} 1 0%` : "none",
    width: isDesktop ? "auto" : "100%",
    minWidth: isDesktop ? "350px" : "auto",
    height: isDesktop ? "100%" : "auto",
    opacity: 1,
    marginRight: "0px",
    marginBottom: isDesktop ? "0px" : (isEcoActive || isRightActive ? "16px" : "0px"),
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const aboutStyle: React.CSSProperties = {
    width: "100%",
    height: isDesktop ? "100%" : (isAboutActive ? "auto" : "0px"),
    opacity: isAboutActive ? 1 : 0,
    visibility: isAboutActive ? "visible" : "hidden",
    pointerEvents: isAboutActive ? "auto" : "none",
    marginRight: "0px",
    marginBottom: isDesktop ? "0px" : (isAboutActive && isCommActive ? "16px" : "0px"),
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const ecoStyle: React.CSSProperties = {
    width: "100%",
    height: isDesktop ? "100%" : (isEcoActive ? "auto" : "0px"),
    opacity: isEcoActive ? 1 : 0,
    visibility: isEcoActive ? "visible" : "hidden",
    pointerEvents: isEcoActive ? "auto" : "none",
    marginRight: "0px",
    marginBottom: "0px",
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const commStyle: React.CSSProperties = {
    width: "100%",
    height: isDesktop ? "100%" : (isCommActive ? "auto" : "0px"),
    opacity: isCommActive ? 1 : 0,
    visibility: isCommActive ? "visible" : "hidden",
    pointerEvents: isCommActive ? "auto" : "none",
    marginRight: "0px",
    marginBottom: "0px",
    overflow: "hidden",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
  };

  const bc = siteCopy.boot;

  return (
    <VoidBackground className="relative min-h-screen lg:h-screen w-full flex flex-col pt-4 pb-24 lg:pb-4 px-4 lg:overflow-hidden text-theme-text transition-colors duration-300 bg-theme-void">
      
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
      <main className="flex-1 min-h-0 w-full mt-4 pb-24 lg:pb-0 relative z-10 flex flex-col justify-start overflow-y-auto lg:overflow-hidden">
        <div
          className="flex flex-col lg:flex-row w-full h-full min-h-0 select-none animate-fade-in"
          style={{
            height: isDesktop ? "100%" : "auto",
          }}
        >
          {/* Left Column Group: Solutions, Core Runtime, Ecosystem */}
          <div
            className="flex flex-col min-w-0 h-full"
            style={{
              flex: isDesktop ? `${leftFlex} 1 0%` : "none",
              width: isDesktop ? "auto" : "100%",
              marginRight: isDesktop ? (isRightActive ? "16px" : "0px") : "0px",
              marginBottom: isDesktop ? "0px" : (isRightActive ? "16px" : "0px"),
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Row 1: Solutions + Core Runtime */}
            <div
              className="flex flex-col lg:flex-row w-full min-h-0"
              style={{
                height: isDesktop ? (isEcoActive ? "calc(54vh - 64px)" : "100%") : "auto",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Solutions Panel */}
              <div className="w-full flex flex-col h-full min-w-0" style={solStyle}>
                <SolutionsPanel
                  isCompact={activePanels.includes("about")}
                  onOpenPilot={() => setPilotOpen(true)}
                />
              </div>

              {/* Core Runtime Panel */}
              <div className="w-full flex flex-col h-full min-w-0" style={coreStyle}>
                <CoreRuntimePanel isCompact={isSolActive || isAboutActive} />
              </div>
            </div>

            {/* Row 2: Ecosystem */}
            <div
              className="w-full min-h-0 overflow-hidden"
              style={{
                height: isDesktop ? (isEcoActive ? "calc(46vh - 64px)" : "0px") : "auto",
                opacity: isDesktop ? (isEcoActive ? 1 : 0) : 1,
                marginTop: isDesktop ? (isEcoActive ? "16px" : "0px") : "0px",
                visibility: isDesktop ? (isEcoActive ? "visible" : "hidden") : "visible",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="w-full flex flex-col h-full min-w-0" style={ecoStyle}>
                <EcosystemPanel isCompact={isCommActive} />
              </div>
            </div>
          </div>

          {/* Right Column Group: About, Community */}
          <div
            className="flex flex-col min-w-0 h-full"
            style={{
              flex: isDesktop ? `${isRightActive ? rightFlex : 0} 1 0%` : "none",
              width: isDesktop ? "auto" : "100%",
              opacity: isRightActive ? 1 : 0,
              visibility: isRightActive ? "visible" : "hidden",
              pointerEvents: isRightActive ? "auto" : "none",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Row 1: About */}
            <div
              className="w-full min-h-0 overflow-hidden"
              style={{
                height: isDesktop ? (isAboutActive ? (isCommActive ? "calc(54vh - 64px)" : "100%") : "0px") : "auto",
                opacity: isAboutActive ? 1 : 0,
                visibility: isAboutActive ? "visible" : "hidden",
                pointerEvents: isAboutActive ? "auto" : "none",
                marginBottom: isDesktop ? "0px" : (isAboutActive && isCommActive ? "16px" : "0px"),
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="w-full flex flex-col h-full min-w-0" style={aboutStyle}>
                <AboutPanel isCompact={isSolActive} />
              </div>
            </div>

            {/* Row 2: Community */}
            <div
              className="w-full min-h-0 overflow-hidden"
              style={{
                height: isDesktop ? (isCommActive ? (isAboutActive ? "calc(46vh - 64px)" : "100%") : "0px") : "auto",
                opacity: isCommActive ? 1 : 0,
                marginTop: isDesktop ? (isCommActive && isAboutActive ? "16px" : "0px") : "0px",
                visibility: isCommActive ? "visible" : "hidden",
                pointerEvents: isCommActive ? "auto" : "none",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="w-full flex flex-col h-full min-w-0" style={commStyle}>
                <CommunityPanel
                  onOpenPilot={() => setPilotOpen(true)}
                  isCompact={isEcoActive}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Onboarding Pilot Modal */}
      <PilotModal isOpen={pilotOpen} onClose={() => setPilotOpen(false)} />
      
    </VoidBackground>
  );
};

export default SiteShell;
