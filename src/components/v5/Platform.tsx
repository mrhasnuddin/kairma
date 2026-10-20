"use client";

import React, { useRef, useState } from "react";
import { useCopyV8 } from "@/lib/language";
import { Arrow, Button, FrameMarks, Label, Roll } from "./ui";
import { Figure } from "./Figure";
import { keepOpenLive } from "./live/keep-open";
import { Leaderboard } from "./Leaderboard";
import { MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

/* Heron platform: two products, copy held beside the drawing while it scrolls.
   [01] the Keep (cutaway, pick a part) · [02] the model router (live rack).
   On wide screens the rack and its table sit side by side, so every row you
   hover has its altar in view. */
export function Platform({ onDeploy }: { onDeploy: () => void }) {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);
  const [part, setPart] = useState(0);
  const [keep, router] = c.platform.items;

  useGSAP(() => {
    gsap.matchMedia().add(MOTION_OK, () => gsap.utils.toArray<HTMLElement>("[data-title]").forEach((el) => revealLines(el)));
  }, { scope: root, dependencies: [keep.title], revertOnUpdate: true });

  const copy = (index: string, item: { title: string; body: string; cta: string }, action: React.ReactNode) => (
    <div className="flex flex-col gap-5 md:sticky md:top-[calc(var(--k-header-h)+2rem)]">
      <Label index={index}>{c.nav.platform}</Label>
      <h2 data-title className="k-display-2 text-k-ink">{item.title}</h2>
      <p className="k-body text-k-ink-2">{item.body}</p>
      <div>{action}</div>
    </div>
  );

  return (
    <section id="platform" ref={root} aria-label={c.nav.platform} className="relative border-b border-k-line">
      <div className="relative grid border-b border-k-line md:grid-cols-12">
        <FrameMarks index="03" />
        <div className="min-w-0 border-b border-k-line px-(--k-gutter) py-14 md:col-span-4 md:border-b-0 md:border-r md:py-20">
          {copy("03", keep, <Button variant="ghost" onClick={onDeploy} aria-haspopup="dialog">{keep.cta}</Button>)}
        </div>
        <div className="flex min-w-0 flex-col gap-6 px-(--k-gutter) py-10 md:col-span-8 md:py-12">
          <Figure
            name="keep-open"
            hint={c.figures.keepOpen.hint}
            readout={c.platform.parts[part].title}
            label={c.figures.keepOpen.aria}
            live={keepOpenLive({ pick: setPart, names: c.platform.parts.map((p) => p.title) })}
            state={part}
            className="mx-auto w-full max-w-xl"
          />
          <ol className="grid grid-cols-2 border-t border-l border-k-line lg:grid-cols-4" aria-label={c.figures.keepOpen.title}>
            {c.platform.parts.map((p, i) => (
              <li key={p.title} className="border-b border-r border-k-line">
                <button
                  type="button"
                  aria-pressed={part === i}
                  onClick={() => setPart(i)}
                  onPointerEnter={() => setPart(i)}
                  onFocus={() => setPart(i)}
                  className={`flex h-full w-full flex-col gap-2 p-4 text-left transition-colors duration-(--k-dur-micro) ${part === i ? "bg-k-surface" : "hover:bg-k-surface/60"}`}
                >
                  <span className="k-label flex gap-2">
                    <span className={part === i ? "text-k-accent-text" : "text-k-ink-3"}>0{i + 1}</span>
                    <span className="text-k-ink">{p.title}</span>
                  </span>
                  <span className="text-sm leading-snug text-k-ink-2">{p.text}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="relative grid md:grid-cols-12">
        <FrameMarks index="04" />
        <div className="min-w-0 border-b border-k-line px-(--k-gutter) py-14 md:col-span-4 md:border-b-0 md:border-r md:py-20 xl:col-span-3">
          {copy(
            "04",
            router,
            <a
              href="https://openrouter.ai/rankings"
              target="_blank"
              rel="noopener noreferrer"
              data-fx="x"
              className="k-fx inline-flex min-h-11 items-center gap-3 rounded-k-control border border-k-ink-3 px-5 py-2.5 k-label text-k-ink active:scale-[0.97]"
            >
              <Roll>{router.cta}</Roll>
              <Arrow glyph="↗" />
            </a>,
          )}
        </div>
        <div className="min-w-0 px-(--k-gutter) py-10 md:col-span-8 md:py-16 xl:col-span-9">
          <Leaderboard />
        </div>
      </div>
    </section>
  );
}
