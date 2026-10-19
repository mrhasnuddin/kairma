"use client";

import React, { useRef } from "react";
import { useCopyV7 } from "@/lib/language";
import { Label } from "./ui";
import { MOTION_OK, gsap, revealBlocks, revealLines, useGSAP } from "./motion";

/* Four moats, ordered by depth. Each cell carries a depth gauge: the moat's
   own layer is the accent, the ones above it are ink, the rest stay hairline. */
export function Moats() {
  const c = useCopyV7();
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        revealLines(h2.current);
        revealBlocks(root.current!.querySelectorAll("[data-moat]"));
      });
    },
    { scope: root, dependencies: [c.moats.h], revertOnUpdate: true },
  );

  return (
    <section id="moats" ref={root} className="border-b border-k-line">
      <div className="grid grid-cols-4 gap-x-(--k-gutter) gap-y-6 px-(--k-gutter) py-16 md:grid-cols-12 md:py-24">
        <Label index="03" className="col-span-full">{c.moats.label}</Label>
        <h2 ref={h2} className="k-display-2 col-span-full text-k-ink md:col-span-8">{c.moats.h}</h2>
      </div>

      <ol className="grid grid-cols-1 border-t border-k-line sm:grid-cols-2 lg:grid-cols-4">
        {c.moats.items.map((m, i) => (
          <li
            key={m.title}
            data-moat
            className="flex min-h-80 flex-col justify-between gap-12 border-b border-k-line px-(--k-gutter) py-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <div className="flex items-start justify-between">
              <span className="k-label text-k-ink-3">[0{i + 1}]</span>
              <span aria-hidden className="flex w-16 flex-col gap-1.5">
                {[0, 1, 2, 3].map((d) => (
                  <span key={d} className={`h-px ${d === i ? "h-0.5 bg-k-accent" : d < i ? "bg-k-ink" : "bg-k-line"}`} />
                ))}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="k-title text-k-ink">{m.title}</h3>
              <p className="k-body text-k-ink-2">{m.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
