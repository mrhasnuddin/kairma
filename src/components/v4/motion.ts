"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

/* The single motion engine for v4 (DESIGN.md › Motion). Durations and eases
   mirror the --k-dur-* / --k-ease-* tokens in globals.css. */
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);

export const DUR = { fast: 0.5, base: 0.8, slow: 1.2 } as const;
export const EASE = "expo.out";
export const EASE_SOFT = "power3.out";

// Every animation is registered inside this query, so reduced motion gets the
// static, fully visible markup with nothing to undo.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/* Masked line reveal for headings: each line rises out of its own mask.
   `autoSplit` re-splits on resize so lines stay correct after reflow. */
export function revealLines(
  el: Element | null,
  opts: { delay?: number; scrollTrigger?: ScrollTrigger.Vars | false } = {},
) {
  if (!el) return;
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 100,
        duration: DUR.base,
        stagger: 0.05,
        ease: EASE,
        delay: opts.delay ?? 0,
        scrollTrigger: opts.scrollTrigger === false ? undefined : { trigger: el, start: "top 85%", once: true, ...opts.scrollTrigger },
      }),
  });
}

/* Fade-up for blocks (cells, rows). Batched so a grid enters as one gesture. */
export function revealBlocks(targets: Element[] | NodeListOf<Element>) {
  if (!targets.length) return;
  gsap.set(targets, { autoAlpha: 0, y: 24 });
  ScrollTrigger.batch(targets as Element[], {
    start: "top 88%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.base, stagger: 0.08, ease: EASE_SOFT }),
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
