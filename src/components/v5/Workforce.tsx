"use client";

import React, { useId, useRef, useState } from "react";
import { useCopyV8 } from "@/lib/language";
import { FrameMarks, Label } from "./ui";
import { Figure } from "./Figure";
import { cageLive } from "./live/cage";
import { MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

/* Heron use cases: an accordion of roles beside one drawing that follows the
   open item. Here the roles are Kairma's four AI employees. */
export function Workforce() {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState(0);
  const uid = useId();

  useGSAP(() => { gsap.matchMedia().add(MOTION_OK, () => revealLines(h2.current)); }, {
    scope: root, dependencies: [c.workforce.h], revertOnUpdate: true,
  });

  return (
    <section id="workforce" ref={root} aria-labelledby="workforce-h" className="relative border-b border-k-line">
      <FrameMarks index="06" />
      <div className="flex flex-col gap-5 border-b border-k-line px-(--k-gutter) py-14 md:py-20">
        <Label index="06">{c.workforce.label}</Label>
        <h2 id="workforce-h" ref={h2} className="k-display-2 max-w-5xl text-k-ink">{c.workforce.h}</h2>
      </div>
      <div className="grid md:grid-cols-12">
        <ul className="border-b border-k-line md:col-span-5 md:border-b-0 md:border-r">
          {c.workforce.items.map((it, i) => {
            const on = open === i;
            return (
              <li key={it.role} className="border-b border-k-line last:border-b-0">
                <h3>
                  <button
                    type="button"
                    id={`${uid}-b${i}`}
                    aria-expanded={on}
                    aria-controls={`${uid}-p${i}`}
                    onClick={() => setOpen(i)}
                    className="flex w-full items-center justify-between gap-4 px-(--k-gutter) py-6 text-left"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className={`k-label ${on ? "text-k-accent-text" : "text-k-ink-3"}`}>0{i + 1}</span>
                      <span className={`k-title transition-colors duration-(--k-dur-micro) ${on ? "text-k-ink" : "text-k-ink-3"}`}>{it.role}</span>
                    </span>
                    <span aria-hidden className="relative size-3 shrink-0">
                      <span className="absolute inset-x-0 top-1/2 h-px bg-k-ink" />
                      <span className={`absolute inset-y-0 left-1/2 w-px bg-k-ink transition-transform duration-(--k-dur-collapse) ease-k-move ${on ? "scale-y-0" : ""}`} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${uid}-p${i}`}
                  role="region"
                  aria-labelledby={`${uid}-b${i}`}
                  className={`grid transition-[grid-template-rows] duration-(--k-dur-collapse) ease-k-move motion-reduce:transition-none ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden" inert={!on}>
                    <div className="flex flex-col gap-2 px-(--k-gutter) pb-6 md:pl-[calc(var(--k-gutter)+2.25rem)]">
                      <p className="k-label text-k-ink-3">{c.workforce.status}: <span className="text-k-ink">{it.status}</span></p>
                      <p className="k-body text-k-ink-2">{it.text}</p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="px-(--k-gutter) py-10 md:col-span-7">
          <div className="md:sticky md:top-[calc(var(--k-header-h)+2rem)]">
            <Figure
              name="cage"
              hint={c.figures.cage.hint}
              readout={`${c.workforce.items[open].role} · ${c.workforce.items[open].status}`}
              label={c.figures.cage.aria}
              live={cageLive()}
              state={{ open, label: `${c.workforce.items[open].role} · ${c.workforce.items[open].status}` }}
              className="py-8"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
