"use client";

import React, { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "framer-motion";
import { GuanFrontispiece } from "@/components/visual/GuanFrontispiece";
import { PilotModal } from "@/components/modal/PilotModal";
import { HowDeploymentWorksModal } from "@/components/modal/HowDeploymentWorksModal";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { Shift } from "./Shift";
import { KeepStory } from "./KeepStory";
import { Moats } from "./Moats";
import { Workforce } from "./Workforce";
import { Models } from "./Models";
import { Doors } from "./Doors";
import { KairmaFooter, FOOTER_REVEAL_HEIGHT } from "@/components/layout/KairmaFooter";
import { MOTION_OK, ScrollTrigger, gsap } from "./motion";

/* v4 home: Heron grammar, Kairma brand. Spec: DESIGN.md · plan: docs/revamp. */
export function SiteShellV4() {
  const [booted, setBooted] = useState(false);
  const [pilotOpen, setPilotOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);
  const onBooted = useCallback(() => setBooted(true), []);
  const openPilot = useCallback(() => setPilotOpen(true), []);
  const openHow = useCallback(() => setHowOpen(true), []);

  // Lenis on the window (not a wrapper), driven by GSAP's ticker so
  // ScrollTrigger and `position: sticky` stay in step. Skipped for reduced motion.
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

  // Freeze the page behind the boot overlay and any open dialog.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const locked = !booted || pilotOpen || howOpen;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = !booted ? "hidden" : "";
  }, [booted, pilotOpen, howOpen]);

  // Section heights settle once fonts and the boot overlay are gone.
  useEffect(() => {
    if (booted) ScrollTrigger.refresh();
  }, [booted]);

  return (
    <div className="font-k-display min-h-[100svh] bg-k-paper text-k-ink">
      <AnimatePresence>{!booted && <GuanFrontispiece onComplete={onBooted} />}</AnimatePresence>

      <Header onPilot={openPilot} />

      {/* Reveal footer (kept from v3): a fixed layer under the content curtain,
          uncovered by the scroll runway after <main>. */}
      <KairmaFooter onRequestPilot={openPilot} />

      {/* Full-width opaque curtain over the fixed footer; the hairline frame
          (every section a cell) sits inside it. */}
      <div className="relative z-10 bg-k-paper">
      <main className="mx-(--k-inset) border-x border-b border-k-line">
        <Hero ready={booted} onPilot={openPilot} onHowItWorks={openHow} />
        <Shift />
        <KeepStory />
        <Moats />
        <Workforce />
        <Models />
        <Doors onPilot={openPilot} />
      </main>
      </div>
      <div aria-hidden style={{ height: FOOTER_REVEAL_HEIGHT }} />

      <PilotModal isOpen={pilotOpen} onClose={() => setPilotOpen(false)} />
      <HowDeploymentWorksModal isOpen={howOpen} onClose={() => setHowOpen(false)} />
    </div>
  );
}

export default SiteShellV4;
