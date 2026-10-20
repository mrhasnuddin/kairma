"use client";

import React, { useRef } from "react";
import { useCopyV8 } from "@/lib/language";
import { FrameMarks, Label } from "./ui";
import { Figure } from "./Figure";
import { moatLive } from "./live/moats";
import { EASE, MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

const NAMES = ["moat-encoded", "moat-jig", "moat-flywheel", "moat-lock"];

/* Heron "why us": label + H2 + body, then four one-word items whose drawings
   enter from alternating sides. Here the four items are the four moats. */
export function Why() {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      revealLines(h2.current);
      gsap.utils.toArray<HTMLElement>("[data-side]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0, xPercent: el.dataset.side === "left" ? -8 : 8, duration: 1, ease: EASE,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    });
  }, { scope: root, dependencies: [c.why.h], revertOnUpdate: true });

  return (
    <section id="why" ref={root} aria-labelledby="why-h" className="relative border-b border-k-line">
      <FrameMarks index="05" />
      <div className="grid gap-6 border-b border-k-line px-(--k-gutter) py-14 md:grid-cols-12 md:py-20">
        <div className="flex flex-col gap-5 md:col-span-7">
          <Label index="05">{c.why.label}</Label>
          <h2 id="why-h" ref={h2} className="k-display-2 text-k-ink">{c.why.h}</h2>
        </div>
        <p className="k-body self-end text-k-ink-2 md:col-span-4 md:col-start-9">{c.why.body}</p>
      </div>
      <ol>
        {c.why.items.map((it, i) => {
          const left = i % 2 === 0;
          return (
            <li key={it.title} className="grid border-b border-k-line last:border-b-0 md:grid-cols-12">
              <div
                data-side={left ? "left" : "right"}
                className={`border-b border-k-line px-(--k-gutter) py-8 md:col-span-6 md:border-b-0 md:py-12 ${left ? "md:border-r" : "md:order-2 md:border-l"}`}
              >
                <Figure name={NAMES[i]} plain label={c.figures.moats[i]} live={moatLive(i)} className="mx-auto w-full max-w-[520px]" />
              </div>
              <div className={`flex flex-col justify-center gap-3 px-(--k-gutter) py-8 md:col-span-6 md:py-12 ${left ? "" : "md:order-1"}`}>
                <h3 className="k-display-2 text-k-ink">{it.tag}</h3>
                <p className="k-label text-k-ink-3">{it.title}</p>
                <p className="k-body max-w-md text-k-ink-2">{it.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
