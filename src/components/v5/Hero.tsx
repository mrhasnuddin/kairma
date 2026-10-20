"use client";

import React, { useRef } from "react";
import { useCopyV8 } from "@/lib/language";
import { Button, FrameMarks, TextLink } from "./ui";
import { Figure } from "./Figure";
import { keepLive } from "./live/keep";
import { EASE, MOTION_OK, gsap, useGSAP } from "./motion";

/* Heron hero: drawing in the middle, H1 bottom-left, body and the one action
   bottom-right, a three-item ticker underneath. */
export function Hero({ ready, onPilot, onDeploy }: { ready: boolean; onPilot: () => void; onDeploy: () => void }) {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap.from("[data-hero-in]", { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08, ease: EASE });
      });
    },
    { scope: root, dependencies: [ready] },
  );

  return (
    <section id="top" ref={root} aria-labelledby="hero-h1" className="relative border-b border-k-line pt-(--k-header-h)">
      <div className="relative border-b border-k-line px-(--k-gutter) py-6 md:py-8">
        <FrameMarks index="00" />
        <div data-hero-in className="mx-auto w-full max-w-[1100px]">
          <Figure
            name="keep"
            priority
            hint={c.figures.keep.hint}
            readout={`${c.figures.readouts.tasks.replace("{n}", "0")} · ${c.figures.readouts.rawOut}`}
            label={c.figures.keep.aria}
            live={keepLive({ running: (n) => `${c.figures.readouts.tasks.replace("{n}", String(n))} · ${c.figures.readouts.rawOut}`, stopped: c.figures.readouts.sealed })}
            className="py-8"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-12">
        <h1 id="hero-h1" data-hero-in className="k-display-1 border-b border-k-line px-(--k-gutter) py-6 text-k-ink md:col-span-8 md:border-b-0 md:border-r md:py-10 lg:col-span-7">
          {c.hero.h1}
        </h1>
        <div data-hero-in className="flex flex-col justify-end gap-6 px-(--k-gutter) py-6 md:col-span-4 md:py-10 lg:col-span-5">
          <p className="k-body max-w-xl text-k-ink-2">
            {c.hero.body}{" "}
            <TextLink onClick={onDeploy} aria-haspopup="dialog" className="text-k-ink">{c.hero.link}</TextLink>
          </p>
          <div><Button onClick={onPilot}>{c.hero.cta}</Button></div>
        </div>
      </div>

      <ul className="grid border-t border-k-line sm:grid-cols-3">
        {c.hero.ticker.map((t, i) => (
          <li key={t} className={`flex items-center gap-3 px-(--k-gutter) py-3 k-label text-k-ink-3 ${i ? "border-t border-k-line sm:border-l sm:border-t-0" : ""}`}>
            <span aria-hidden className="size-1.5 bg-k-accent" />
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}
