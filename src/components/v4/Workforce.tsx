"use client";

import React, { useRef, useState } from "react";
import { useCopyV7 } from "@/lib/language";
import UserIcon from "@/components/ui/user-icon";
import LinkIcon from "@/components/ui/link-icon";
import HeadsetIcon from "@/components/ui/headset-icon";
import ShieldCheck from "@/components/ui/shield-check";
import type { AnimatedIconHandle } from "@/components/ui/types";
import { Label } from "./ui";
import { MOTION_OK, gsap, revealBlocks, revealLines, useGSAP } from "./motion";

const ICONS = [UserIcon, LinkIcon, HeadsetIcon, ShieldCheck];

/* The workforce as Heron's use-case accordion: rows on the left, the active
   role held in a sticky panel on the right. */
export function Workforce() {
  const c = useCopyV7();
  const [open, setOpen] = useState(0);
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);
  const panelIcon = useRef<AnimatedIconHandle | null>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        revealLines(h2.current);
        revealBlocks(root.current!.querySelectorAll("[data-row]"));
      });
    },
    { scope: root, dependencies: [c.workforce.h], revertOnUpdate: true },
  );

  const active = c.workforce.items[open];
  const ActiveIcon = ICONS[open];

  return (
    <section id="roster" ref={root} className="border-b border-k-line">
      <div className="grid grid-cols-4 gap-x-(--k-gutter) gap-y-6 px-(--k-gutter) py-16 md:grid-cols-12 md:py-24">
        <Label index="04" className="col-span-full">{c.workforce.label}</Label>
        <h2 ref={h2} className="k-display-2 col-span-full text-k-ink md:col-span-7">{c.workforce.h}</h2>
        <p className="k-body col-span-full self-end text-k-ink-2 md:col-span-4 md:col-start-9">{c.workforce.sub}</p>
      </div>

      <div className="grid grid-cols-1 border-t border-k-line md:grid-cols-12">
        <ul className="md:col-span-7 md:border-r md:border-k-line">
          {c.workforce.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.role} data-row className="border-b border-k-line last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`role-${i}`}
                  onClick={() => setOpen(i)}
                  className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-x-5 px-(--k-gutter) py-5 text-left transition-colors hover:bg-k-ink/[0.03]"
                >
                  <span className="k-label text-k-ink-3">[0{i + 1}]</span>
                  <span className={`k-title transition-colors ${isOpen ? "text-k-ink" : "text-k-ink-3"}`}>{item.role}</span>
                  <span className="flex items-center gap-2 k-label text-k-accent-text">
                    <span className="size-1.5 bg-k-accent" />
                    <span className="hidden sm:inline">{item.status}</span>
                  </span>
                </button>
                <div id={`role-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-k-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="k-body max-w-xl px-(--k-gutter) pb-6 text-k-ink-2 sm:pl-[calc(var(--k-gutter)+4.5rem)]">
                      <span className="k-label mb-2 block text-k-accent-text sm:hidden">{item.status}</span>
                      {item.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:col-span-5 md:block">
          <div
            className="sticky top-(--k-header-h) flex min-h-96 flex-col justify-between gap-10 p-(--k-gutter)"
            onMouseEnter={() => panelIcon.current?.startAnimation()}
            onMouseLeave={() => panelIcon.current?.stopAnimation()}
          >
            <div className="flex items-start justify-between">
              <span className="k-display-1 text-k-ink-4">0{open + 1}</span>
              <span className="text-k-ink"><ActiveIcon key={open} ref={panelIcon} size={44} /></span>
            </div>
            <div className="flex flex-col gap-3" aria-live="polite">
              <span className="k-label flex items-center gap-2 text-k-accent-text"><span className="size-1.5 bg-k-accent" />{active.status}</span>
              <span className="k-display-2 text-k-ink">{active.role}</span>
              <p className="k-body max-w-sm text-k-ink-2">{active.text}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
