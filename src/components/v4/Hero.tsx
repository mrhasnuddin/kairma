"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { useCopyV7 } from "@/lib/language";
import { useTheme } from "@/lib/theme";
import { Button, Crosshairs, Label } from "./ui";
import { DUR, EASE_SOFT, MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

// WebGL globe: client-only, and kept out of the critical path.
const DeploymentGlobe = dynamic(() => import("@/components/ui/DeploymentGlobe").then((m) => m.DeploymentGlobe), { ssr: false });

export function Hero({ ready, onPilot, onHowItWorks }: { ready: boolean; onPilot: () => void; onHowItWorks: () => void }) {
  const c = useCopyV7();
  const { theme } = useTheme();
  const root = useRef<HTMLElement>(null);
  const h1 = useRef<HTMLHeadingElement>(null);

  // Intro plays once the boot sequence hands over, not on mount behind it.
  useGSAP(
    () => {
      if (!ready) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        revealLines(h1.current, { delay: 0.15, scrollTrigger: false });
        gsap.from("[data-hero-fade]", { autoAlpha: 0, y: 16, duration: DUR.base, ease: EASE_SOFT, stagger: 0.08, delay: 0.45 });
        gsap.from("[data-hero-globe]", { autoAlpha: 0, scale: 0.94, duration: DUR.slow * 1.5, ease: EASE_SOFT });
      });
    },
    { scope: root, dependencies: [ready, c.hero.h1], revertOnUpdate: true },
  );

  const ticker = [...c.hero.ticker, ...c.hero.ticker];

  return (
    <section id="top" ref={root} className="relative flex min-h-[100svh] flex-col border-b border-k-line pt-(--k-header-h)">
      <div className="relative flex flex-1 flex-col">
        <Crosshairs className="inset-x-0" />

        <div className="flex items-center justify-between px-(--k-gutter) pt-5" data-hero-fade>
          <Label index="00">{c.hero.label}</Label>
        </div>

        <div data-hero-globe aria-hidden className="flex flex-1 items-center justify-center py-6">
          <DeploymentGlobe theme={theme} />
        </div>

        <div className="grid grid-cols-4 md:grid-cols-12 items-end gap-x-(--k-gutter) gap-y-8 px-(--k-gutter) pb-8 md:pb-10">
          <h1 ref={h1} className="k-display-1 col-span-full text-k-ink md:col-span-7 text-balance">
            {c.hero.h1}
          </h1>
          <div className="col-span-full flex flex-col gap-6 md:col-span-4 md:col-start-9" data-hero-fade>
            <p className="k-body max-w-md text-k-ink-2">{c.hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={onPilot}>{c.hero.cta}</Button>
              <Button variant="ghost" arrow={false} onClick={onHowItWorks}>{c.hero.ctaSecondary}</Button>
            </div>
          </div>
        </div>
      </div>

      {/* capability ticker */}
      <div className="relative overflow-hidden border-t border-k-line py-3" aria-hidden>
        <div className="flex w-max animate-[k-marquee_40s_linear_infinite] gap-10 pl-(--k-gutter) motion-reduce:animate-none">
          {ticker.map((t, i) => (
            <span key={i} className="k-label flex items-center gap-3 whitespace-nowrap text-k-ink-3">
              <span className="size-1.5 bg-k-accent" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
