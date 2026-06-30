"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSiteCopy, useLanguage } from "@/lib/language";
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

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const SiteShell: React.FC = () => {
  const siteCopy = useSiteCopy();
  const { setLanguage } = useLanguage();
  const [biosComplete, setBiosComplete] = useState<boolean>(false);
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
  
  const [scrollIntroActive, setScrollIntroActive] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<FocusId[]>(activePanels);
  const hasExited = useRef<boolean>(false);

  const updatePanels = (next: FocusId[]) => {
    if (next.length !== panelsRef.current.length || !next.every((v, i) => v === panelsRef.current[i])) {
      panelsRef.current = next;
      setActivePanels(next);
    }
  };

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
        panelsRef.current = panels;
      }
    };

    checkQueryParam();
    window.addEventListener("popstate", checkQueryParam);

    return () => window.removeEventListener("popstate", checkQueryParam);
  }, []);

  // Boot sequence line-by-line timing
  useEffect(() => {
    if (!booting || !biosComplete) return;

    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev < 8) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [booting, biosComplete]);

  const finishBoot = (skipped = false) => {
    setBooting(false);
    
    if (skipped || window.innerWidth < 1024) {
      const params = new URLSearchParams(window.location.search);
      const panelsParam = params.get("panels");
      
      if (panelsParam) {
        const panels = panelsParam
          .split(",")
          .filter((p) =>
            ["solutions", "about", "ecosystem", "community"].includes(p)
          ) as FocusId[];
        setActivePanels(panels);
        panelsRef.current = panels;
      } else {
        const initial = ["solutions", "about", "ecosystem", "community"] as FocusId[];
        setActivePanels(initial);
        panelsRef.current = initial;
      }
      setScrollIntroActive(false);
    } else {
      // Start GSAP scroll intro on desktop
      const url = new URL(window.location.href);
      url.searchParams.delete("panels");
      window.history.replaceState(null, "", url.pathname + url.search);
      
      setActivePanels([]);
      panelsRef.current = [];
      setScrollIntroActive(true);
    }
  };

  const handleTogglePanel = (focus: FocusId | "reset") => {
    if (scrollIntroActive) return; // Disable manual toggle during intro
    
    setActivePanels((prev) => {
      if (focus === "reset") {
        const url = new URL(window.location.href);
        url.searchParams.delete("panels");
        window.history.pushState(null, "", url.pathname + url.search);
        panelsRef.current = [];
        return [];
      }

      let next: FocusId[];
      if (!isDesktop) {
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
      panelsRef.current = next;
      return next;
    });
  };

  useGSAP(() => {
    if (!scrollIntroActive || !isDesktop || booting) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=400%", // 400vh scroll distance
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          if (hasExited.current) return;
          const p = self.progress;
          // Progress mapping for panels
          if (p < 0.53) {
            updatePanels([]);
          } else if (p >= 0.53 && p < 0.68) {
            updatePanels(["solutions"]);
          } else if (p >= 0.68 && p < 0.83) {
            updatePanels(["solutions", "about"]);
          } else if (p >= 0.83 && p < 0.98) {
            updatePanels(["solutions", "about", "ecosystem"]);
          } else if (p >= 0.98) {
            updatePanels(["solutions", "about", "ecosystem", "community"]);
          }

          if (p >= 0.99 && !hasExited.current) {
            hasExited.current = true;
            const url = new URL(window.location.href);
            url.searchParams.set("panels", "solutions,about,ecosystem,community");
            window.history.replaceState(null, "", url.pathname + url.search);
            requestAnimationFrame(() => {
              setScrollIntroActive(false);
              window.scrollTo(0, 0);
            });
          }
        },
        onLeave: () => {
          if (hasExited.current) return;
          hasExited.current = true;
          const url = new URL(window.location.href);
          url.searchParams.set("panels", "solutions,about,ecosystem,community");
          window.history.replaceState(null, "", url.pathname + url.search);
          requestAnimationFrame(() => {
             setScrollIntroActive(false);
             window.scrollTo(0, 0);
          });
        }
      }
    });

    // Terminal Story Animation
    tl.fromTo(".story-line", 
      { opacity: 0 }, 
      { opacity: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" }
    );
    tl.to({}, { duration: 0.3 }); // pause to read
    tl.to(storyRef.current, { opacity: 0, duration: 0.4, ease: "power2.inOut" });
    tl.to({}, { duration: 2.0 }); // space for panels to sequence

  }, [scrollIntroActive, isDesktop, booting]);

  const isSolActive = activePanels.includes("solutions");
  const isAboutActive = activePanels.includes("about");
  const isEcoActive = activePanels.includes("ecosystem");
  const isCommActive = activePanels.includes("community");
  const isRightActive = isAboutActive || isEcoActive;

  const bc = siteCopy.boot;

  return (
    <div ref={containerRef} className={scrollIntroActive ? "w-full min-h-[100dvh] bg-theme-void relative" : "w-full h-[100dvh]"}>
      <VoidBackground className="relative h-[100dvh] w-full flex flex-col gap-3 lg:gap-[10px] p-4 overflow-hidden text-theme-text transition-colors duration-300 bg-theme-void">
        
        {/* 0. BIOS Setup Overlay */}
        <AnimatePresence>
          {!biosComplete && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-[#0B0E0B] text-[#1FAA68] font-mono p-6 flex flex-col items-center justify-center select-none"
            >
              <div className="flex flex-col gap-6 w-full max-w-sm font-mono select-none">
                <div className="text-sm font-bold tracking-widest text-[#1FAA68]/80 leading-relaxed">
                  KAIRMA OS BIOS v1.0.0
                  <br />
                  INITIALIZING ENVIRONMENT...
                  <br /><br />
                  PLEASE SELECT SYSTEM LOCALE:
                </div>
                <div className="flex flex-col gap-2 text-sm font-bold">
                  <button 
                    onClick={() => { setLanguage("en"); setBiosComplete(true); }}
                    className="text-left hover:text-[#2aff9b] hover:bg-[#1FAA68]/10 p-2 transition-all border border-transparent hover:border-[#1FAA68]/30 focus:outline-none"
                  >
                    {"> [ ENGLISH ]"}
                  </button>
                  <button 
                    onClick={() => { setLanguage("zh-TW"); setBiosComplete(true); }}
                    className="text-left hover:text-[#2aff9b] hover:bg-[#1FAA68]/10 p-2 transition-all border border-transparent hover:border-[#1FAA68]/30 focus:outline-none"
                  >
                    {"> [ 繁體中文 ]"}
                  </button>
                  <button 
                    onClick={() => { setLanguage("vi"); setBiosComplete(true); }}
                    className="text-left hover:text-[#2aff9b] hover:bg-[#1FAA68]/10 p-2 transition-all border border-transparent hover:border-[#1FAA68]/30 focus:outline-none"
                  >
                    {"> [ TIẾNG VIỆT ]"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Boot Sequence Overlay */}
        <AnimatePresence>
          {booting && biosComplete && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 bg-[#0B0E0B] text-[#1FAA68] font-mono p-6 flex flex-col items-center justify-center select-none"
            >
              {/* Skip boot text removed */}

              <div className="flex flex-col gap-1 w-full max-w-sm font-mono select-none">
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
                    {visibleLines < 8 && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                        className="inline-block w-1.5 h-3.5 bg-[#1FAA68] select-none"
                      >
                        █
                      </motion.span>
                    )}
                  </div>
                )}
                {visibleLines >= 8 && (
                  <div className="mt-6 flex flex-col gap-2 text-sm font-bold">
                    <button 
                      onClick={() => finishBoot(false)}
                      className="text-left hover:text-[#2aff9b] hover:bg-[#1FAA68]/10 p-2 transition-all border border-transparent hover:border-[#1FAA68]/30 focus:outline-none"
                    >
                      {siteCopy.boot.ctaImmerse}
                    </button>
                    <button 
                      onClick={() => finishBoot(true)}
                      className="text-left text-[#1FAA68]/60 hover:text-[#2aff9b] hover:bg-[#1FAA68]/10 p-2 transition-all border border-transparent hover:border-[#1FAA68]/30 focus:outline-none"
                    >
                      {siteCopy.boot.ctaSkip}
                    </button>
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
                transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                  transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                    transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                    transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                  transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                  transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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
                  transition: "all 0.8s cubic-bezier(0.65, 0, 0.35, 1)",
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

      {/* 7. Scroll Intro Terminal (Only active during scroll intro) */}
      {scrollIntroActive && (
        <div 
          ref={storyRef}
          className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center p-8 bg-[#0B0E0B] text-[#1FAA68] font-mono"
          style={{
            boxShadow: "inset 0 0 100px rgba(31, 170, 104, 0.2)",
            textShadow: "0 0 5px rgba(31, 170, 104, 0.5)",
          }}
        >
          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50"></div>
          
          <div className="max-w-3xl w-full flex flex-col gap-6 text-xl md:text-2xl leading-relaxed relative z-10 select-none">
            <p className="story-line opacity-0 uppercase tracking-widest text-sm text-[#1FAA68]/70">{siteCopy.storyIntro.osName}</p>
            <p className="story-line opacity-0 uppercase tracking-widest text-sm text-[#1FAA68]/70 mb-4">{siteCopy.storyIntro.copyright}</p>
            {siteCopy.storyIntro.lines.map((line, i) => (
              <p key={i} className="story-line opacity-0">{line}</p>
            ))}
            <p className="story-line opacity-0 text-[#1FAA68]/50 mt-8 text-sm animate-pulse">{siteCopy.storyIntro.scrollPrompt}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteShell;
