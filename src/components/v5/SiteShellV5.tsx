"use client";

import React, { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { Footer, FOOTER_REVEAL_HEIGHT } from "./Footer";
import { Header } from "./Header";
import { Loader } from "./Loader";
import { openFigures } from "./Figure";
import { Hero } from "./Hero";
import { Intro } from "./Intro";
import { Problems } from "./Problems";
import { Platform } from "./Platform";
import { Why } from "./Why";
import { Workforce } from "./Workforce";
import { Cta } from "./Cta";
import { Cursor } from "./Cursor";
import { DeployDialog, PilotDialog } from "./Dialogs";
import { ModelsContext, type ModelRow } from "./Leaderboard";
import { FrameContext, type FrameStyle } from "./ui";
import { MOTION_OK, ScrollTrigger, gsap } from "./motion";

const FRAMES: FrameStyle[] = ["crop", "ledger", "grid", "seal"];

/* v5 home: Heron's content structure (minus its scroll story), Kairma's
   original content. Spec: DESIGN.md · plan: docs/revamp/02-v5-structure-plan.md */
export function SiteShellV5({ models }: { models: ModelRow[] }) {
  const [ready, setReady] = useState(false);
  const [pilot, setPilot] = useState(false);
  const [deploy, setDeploy] = useState(false);
  const [frame, setFrame] = useState<FrameStyle>("crop");
  const onReady = useCallback(() => { setReady(true); openFigures(); }, []);
  const openPilot = useCallback(() => setPilot(true), []);
  const openDeploy = useCallback(() => setDeploy(true), []);

  // Frame decoration preview: ?frame=crop|ledger|grid|seal
  useEffect(() => {
    const f = new URLSearchParams(window.location.search).get("frame") as FrameStyle | null;
    if (!f || !FRAMES.includes(f)) return;
    const id = requestAnimationFrame(() => setFrame(f));
    return () => cancelAnimationFrame(id);
  }, []);

  // Lenis on the window, driven by GSAP's ticker so ScrollTrigger and sticky
  // stay in step. Skipped under reduced motion.
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, allowNestedScroll: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // Freeze the page behind the loader and any open dialog.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const locked = !ready || pilot || deploy;
    if (lenis) { if (locked) lenis.stop(); else lenis.start(); }
    document.documentElement.style.overflow = !ready ? "hidden" : "";
    if (ready) ScrollTrigger.refresh();
  }, [ready, pilot, deploy]);

  return (
    <FrameContext.Provider value={frame}>
      <ModelsContext.Provider value={models}>
        <div className="font-k-display min-h-[100svh] bg-k-paper text-k-ink">
          <Loader onDone={onReady} />
          <Cursor />
          <div inert={!ready} className="contents"><Header onPilot={openPilot} onDeploy={openDeploy} /></div>

          {/* Old Kairma reveal footer, kept on purpose: a fixed layer under the
              content curtain, uncovered by the runway after <main>. */}
          <Footer onPilot={openPilot} />
          <div inert={!ready} className="relative z-10 overflow-x-clip bg-k-paper">
            <main id="main" tabIndex={-1} className="mx-(--k-inset) border-x border-b border-k-line outline-none">
              <Hero ready={ready} onPilot={openPilot} onDeploy={openDeploy} />
              <Intro onDeploy={openDeploy} />
              <Problems />
              <Platform onDeploy={openDeploy} />
              <Why />
              <Workforce />
              <Cta onPilot={openPilot} />
            </main>
            {/* the page dissolves into the footer in Bayer steps */}
            <div aria-hidden className="k-dither-edge pointer-events-none absolute inset-x-0 top-full h-16 bg-k-paper" />
          </div>
          <div aria-hidden data-footer-runway style={{ height: FOOTER_REVEAL_HEIGHT }} />

          <DeployDialog open={deploy} onClose={() => setDeploy(false)} onPilot={openPilot} />
          <PilotDialog open={pilot} onClose={() => setPilot(false)} />
        </div>
      </ModelsContext.Provider>
    </FrameContext.Provider>
  );
}

export default SiteShellV5;
