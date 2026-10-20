"use client";

import React, { useRef } from "react";
import { useCopyV8 } from "@/lib/language";
import { Button, FrameMarks } from "./ui";
import { MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

/* Heron CTA: one headline, one line, one action. The developer door rides
   underneath as a single quiet line until docs exist. */
export function Cta({ onPilot }: { onPilot: () => void }) {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);

  useGSAP(() => { gsap.matchMedia().add(MOTION_OK, () => revealLines(h2.current)); }, {
    scope: root, dependencies: [c.cta.h], revertOnUpdate: true,
  });

  return (
    <section id="pilot" ref={root} aria-labelledby="cta-h" className="relative">
      <FrameMarks index="07" />
      <div className="grid gap-8 px-(--k-gutter) py-20 md:grid-cols-12 md:py-32">
        <h2 id="cta-h" ref={h2} className="k-display-1 text-k-ink md:col-span-8">{c.cta.h}</h2>
        <div className="flex flex-col justify-end gap-6 md:col-span-4">
          <p className="k-body text-k-ink-2">{c.cta.body}</p>
          <div><Button onClick={onPilot}>{c.cta.button}</Button></div>
        </div>
      </div>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-k-line px-(--k-gutter) py-5 text-sm text-k-ink-2">
        <span className="k-label text-k-ink-3">{c.cta.devLabel}</span>
        <span>{c.cta.devText}</span>
        <span className="k-label text-k-ink-3">{c.cta.devNote}</span>
      </p>
    </section>
  );
}
