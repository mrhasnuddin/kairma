"use client";

import React, { useRef } from "react";
import { useCopyV7 } from "@/lib/language";
import { Button, Label } from "./ui";
import { MOTION_OK, gsap, revealBlocks, useGSAP } from "./motion";

/* Two doors, one per audience (Heron's two-product platform row). */
export function Doors({ onPilot }: { onPilot: () => void }) {
  const c = useCopyV7();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => { gsap.matchMedia().add(MOTION_OK, () => revealBlocks(root.current!.querySelectorAll("[data-door]"))); },
    { scope: root },
  );

  const doors = [
    { id: "deploy", d: c.doors.operators, img: "/Bentos/d1.png", index: "06", action: <Button onClick={onPilot}>{c.doors.operators.cta}</Button> },
    {
      id: "build", d: c.doors.developers, img: "/Bentos/dev-matrix.png", index: "07",
      action: <span className="k-label inline-flex min-h-11 items-center rounded-k-control border border-dashed border-k-ink-4 px-5 text-k-ink-3">{c.doors.developers.cta}</span>,
    },
  ];

  return (
    <section ref={root} className="grid grid-cols-1 border-b border-k-line md:grid-cols-2">
      {doors.map(({ id, d, img, index, action }, i) => (
        <article
          key={id}
          id={id}
          data-door
          className={`flex flex-col gap-10 px-(--k-gutter) py-16 md:py-20 ${i === 0 ? "border-b border-k-line md:border-b-0 md:border-r" : ""}`}
        >
          <Label index={index}>{d.label}</Label>
          <div className="flex flex-col gap-4">
            <h2 className="k-display-2 max-w-xl text-k-ink">{d.h}</h2>
            <p className="k-body max-w-md text-k-ink-2">{d.body}</p>
          </div>
          <div>{action}</div>
          <div className="thumb-duotone thumb-soft relative mt-auto aspect-[16/9] overflow-hidden rounded-k-media border border-k-line">
            {/* eslint-disable-next-line @next/next/no-img-element -- duotone blend needs a plain <img> in its own compositing group */}
            <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </article>
      ))}
    </section>
  );
}
