"use client";

import React, { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { useCopyV8 } from "@/lib/language";
import { Figure, load } from "./Figure";
import { gsap } from "./motion";

/* Heron's loader, Kairma's content: the Keep is drawn in behind a sweeping scan
   line while the three boot lines report OK, then the curtain lifts. Plays on
   every full load; reduced motion skips it. */

export function Loader({ onDone }: { onDone: () => void }) {
  const c = useCopyV8();
  const root = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);
  const [show, setShow] = useState(true);
  preload("/figures/keep.svg", { as: "fetch", crossOrigin: "anonymous" });

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm) {
      const id = requestAnimationFrame(() => { setShow(false); onDone(); });
      return () => cancelAnimationFrame(id);
    }
    const el = root.current!;
    // Transforms only: a paper cover shrinks off the drawing and the scan line
    // rides its edge, so no frame repaints the 170 KB drawing.
    const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
    const span = () => el.querySelector<HTMLElement>("[data-stage]")!.offsetHeight;
    tl.fromTo(el.querySelector("[data-cover]"), { scaleY: 1 }, { scaleY: 0, duration: 1.9 }, 0.15)
      .fromTo(el.querySelector("[data-scan]"), { y: 0, autoAlpha: 1 }, { y: span, duration: 1.9 }, 0.15)
      .to(el.querySelector("[data-scan]"), { autoAlpha: 0, duration: 0.2 }, 2.05);
    [0.3, 0.9, 1.5].forEach((t, i) => tl.call(() => setStep(i), undefined, t));
    tl.call(() => setStep(3), undefined, 2.05)
      .to(el, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 2.45)
      .call(() => {
        setShow(false);
        onDone();
      });
    // Start only once the drawing is on the page with its real height (the
    // reveal is sized from it), checked each frame; after 6 s play regardless.
    load("keep");
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    const t0 = performance.now();
    let frame = 0;
    const wait = () => {
      const inPage = !!stage.querySelector("svg") && stage.offsetHeight > 0;
      if (inPage || performance.now() - t0 > 6000) { frame = requestAnimationFrame(() => tl.play()); return; }
      frame = requestAnimationFrame(wait);
    };
    frame = requestAnimationFrame(wait);
    return () => { cancelAnimationFrame(frame); tl.kill(); };
  }, [onDone]);

  if (!show) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[80] flex flex-col bg-k-paper px-(--k-inset) will-change-transform" aria-hidden>
      <div className="relative flex flex-1 items-center justify-center border-x border-k-line">
        <div data-stage className="relative w-[min(88vw,720px)]">
          <Figure name="keep" label="" plain priority />
          <div data-cover className="absolute inset-0 origin-bottom bg-k-paper will-change-transform" />
          <span data-scan className="absolute inset-x-0 top-0 h-px bg-k-accent will-change-transform" />
        </div>
      </div>
      <div className="flex items-end justify-between border-x border-b border-k-line px-(--k-gutter) py-5">
        <ol className="flex flex-col gap-1.5 k-label text-k-ink-3">
          {c.loader.steps.map((s, i) => (
            <li key={s} className={`flex gap-3 transition-opacity duration-300 ${step >= i ? "opacity-100" : "opacity-0"}`}>
              <span>{s}</span>
              <span className={step > i ? "text-k-accent-text" : "text-k-ink-4"}>{step > i ? c.loader.ok : "···"}</span>
            </li>
          ))}
        </ol>
        <span className="k-label tabular-nums text-k-ink-3">{String(Math.max(0, Math.min(3, step + 1)) * 33 + (step >= 3 ? 1 : 0)).padStart(3, "0")}</span>
      </div>
    </div>
  );
}
