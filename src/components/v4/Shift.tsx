"use client";

import React, { useRef } from "react";
import { useCopyV7 } from "@/lib/language";
import { BulletinCarousel } from "@/components/ui/BulletinCarousel";
import CpuIcon from "@/components/ui/cpu-icon";
import GearIcon from "@/components/ui/gear-icon";
import PlugConnectedIcon from "@/components/ui/plug-connected-icon";
import DoubleCheckIcon from "@/components/ui/double-check-icon";
import type { AnimatedIconHandle } from "@/components/ui/types";
import { Label } from "./ui";
import { MOTION_OK, SplitText, gsap, revealBlocks, useGSAP } from "./motion";

const ICONS = [CpuIcon, GearIcon, PlugConnectedIcon, DoubleCheckIcon];

export function Shift() {
  const c = useCopyV7();
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const icons = useRef<(AnimatedIconHandle | null)[]>([]);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        // The one scrubbed statement on the page: words fill in from ink-4 to ink.
        SplitText.create(statement.current!, {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(self.words, { opacity: 0.18 }, {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: statement.current, start: "top 80%", end: "bottom 45%", scrub: true },
            }),
        });
        gsap.fromTo("[data-steps-bar]", { scaleX: 0 }, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 85%", end: "bottom 60%", scrub: true },
        });
        revealBlocks(root.current!.querySelectorAll("[data-step]"));
      });
    },
    { scope: root, dependencies: [c.shift.statement], revertOnUpdate: true },
  );

  return (
    <section id="shift" ref={root} className="border-b border-k-line">
      <div className="grid grid-cols-4 gap-x-(--k-gutter) gap-y-10 px-(--k-gutter) py-16 md:grid-cols-12 md:py-24">
        <Label index="01" className="col-span-full">{c.shift.label}</Label>

        <div className="col-span-full md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-k-media border border-k-line">
            <BulletinCarousel />
          </div>
        </div>

        <div className="col-span-full flex flex-col justify-between gap-10 md:col-span-6 md:col-start-7">
          <p ref={statement} className="k-statement text-k-ink">{c.shift.statement}</p>
          <p className="k-body max-w-lg text-k-ink-2">{c.shift.body}</p>
        </div>
      </div>

      {/* From model to outcome: four hairline cells */}
      <div data-steps className="relative border-t border-k-line">
        <span data-steps-bar aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left bg-k-accent" />
        <p className="k-label border-b border-k-line px-(--k-gutter) py-3 text-k-ink-3">{c.shift.stepsLabel}</p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {c.shift.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <li
                key={step.title}
                data-step
                onMouseEnter={() => icons.current[i]?.startAnimation()}
                onMouseLeave={() => icons.current[i]?.stopAnimation()}
                className="flex min-h-64 flex-col justify-between gap-10 border-b border-k-line px-(--k-gutter) py-6 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="flex items-center justify-between text-k-ink-3">
                  <span className="k-label">[0{i + 1}]</span>
                  <Icon ref={(el: AnimatedIconHandle | null) => { icons.current[i] = el; }} size={22} />
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="k-title text-k-ink">{step.title}</h3>
                  <p className="k-body text-k-ink-2">{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
