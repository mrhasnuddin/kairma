"use client";

import React, { useRef } from "react";
import { useCopyV8 } from "@/lib/language";
import { FrameMarks, Label } from "./ui";
import { Figure } from "./Figure";
import { problemLive } from "./live/problems";
import { MOTION_OK, gsap, revealBlocks, revealLines, useGSAP } from "./motion";

const NAMES = ["pipeline", "sockets", "ruler", "tools"];

/* Heron problems: label + H2 + body, then four cards, each with a tag word, an
   index, a small drawing, a title and one line. */
export function Problems() {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => {
      revealLines(h2.current);
      revealBlocks(gsap.utils.toArray<HTMLElement>("[data-card]"));
    });
  }, { scope: root, dependencies: [c.problems.h], revertOnUpdate: true });

  return (
    <section id="shift" ref={root} aria-labelledby="problems-h" className="relative border-b border-k-line">
      <FrameMarks index="02" />
      <div className="grid gap-6 border-b border-k-line px-(--k-gutter) py-14 md:grid-cols-12 md:py-20">
        <div className="flex flex-col gap-5 md:col-span-7">
          <Label index="02">{c.problems.label}</Label>
          <h2 id="problems-h" ref={h2} className="k-display-2 text-k-ink">{c.problems.h}</h2>
        </div>
        <p className="k-body self-end text-k-ink-2 md:col-span-4 md:col-start-9">{c.problems.body}</p>
      </div>
      <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
        {c.problems.items.map((it, i) => (
          <li
            key={it.title}
            data-card
            className={`flex flex-col border-k-line ${i < 3 ? "border-b lg:border-b-0" : ""} ${i % 2 === 0 ? "sm:border-r" : ""} ${i < 2 ? "sm:border-b" : "sm:border-b-0"} lg:border-r lg:last:border-r-0`}
          >
            <div className="px-6 pt-6">
              <Figure name={`problem-${NAMES[i]}`} plain label={c.figures.problems[i]} live={problemLive(i)} className="mx-auto w-full max-w-[300px]" />
            </div>
            <div className="mt-auto flex flex-col gap-2 px-5 pb-6 pt-4">
              <h3 className="k-title text-k-ink">{it.title}</h3>
              <p className="k-body text-k-ink-2">{it.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
