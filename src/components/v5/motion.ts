"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/* The motion engine for v5 (DESIGN.md › Motion). Reveals play once on enter;
   nothing is tied to scroll position (no scrub, no pin). Values mirror the
   --k-dur-* / --k-ease-* tokens. */
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const DUR = { reveal: 0.8, enter: 0.24, exit: 0.16 } as const;
export const EASE = "expo.out";
export const EASE_SOFT = "power3.out";

// Every animation is registered inside this query, so reduced motion gets the
// static, fully visible markup with nothing to undo.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Masked line reveal for headings: each line rises out of its own mask, once. */
export function revealLines(el: Element | null, delay = 0) {
  if (!el) return;
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 100,
        duration: DUR.reveal,
        stagger: 0.06,
        ease: EASE,
        delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }),
  });
}

/** Fade-up for blocks (cells, rows), batched so a row enters as one gesture. */
export function revealBlocks(targets: Element[]) {
  if (!targets.length) return;
  gsap.set(targets, { autoAlpha: 0, y: 20 });
  ScrollTrigger.batch(targets, {
    start: "top 90%",
    once: true,
    onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: DUR.reveal, stagger: 0.07, ease: EASE_SOFT }),
  });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
