"use client";

import React, { useRef } from "react";
import { Claude, DeepSeek, Gemini, Kimi, OpenAI, Qwen } from "@lobehub/icons";
import { useCopyV8 } from "@/lib/language";
import { Button, FrameMarks, Label, Roll } from "./ui";
import { Figure } from "./Figure";
import { MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

const PROVIDERS = [
  { name: "Claude", Icon: Claude, href: "https://www.anthropic.com/claude" },
  { name: "GPT", Icon: OpenAI, href: "https://openai.com" },
  { name: "Gemini", Icon: Gemini, href: "https://gemini.google.com" },
  { name: "DeepSeek", Icon: DeepSeek, href: "https://www.deepseek.com" },
  { name: "Qwen", Icon: Qwen, href: "https://qwen.ai" },
  { name: "Kimi", Icon: Kimi, href: "https://www.kimi.com" },
];

/* Heron intro: a two-sentence statement with one action and a square drawing,
   then a label, one line and the logo strip (here: the models Kairma routes to,
   not clients). The statement reveals once on enter, never on scroll. */
export function Intro({ onDeploy }: { onDeploy: () => void }) {
  const c = useCopyV8();
  const root = useRef<HTMLElement>(null);
  const statement = useRef<HTMLHeadingElement>(null);

  useGSAP(() => { gsap.matchMedia().add(MOTION_OK, () => revealLines(statement.current)); }, {
    scope: root, dependencies: [c.intro.statement], revertOnUpdate: true,
  });

  return (
    <section ref={root} aria-labelledby="intro-h" className="relative border-b border-k-line">
      <FrameMarks index="01" />
      <div className="grid md:grid-cols-12">
        <div className="flex flex-col justify-between gap-10 border-b border-k-line px-(--k-gutter) py-14 md:col-span-8 md:border-b-0 md:border-r md:py-20">
          <h2 id="intro-h" ref={statement} className="k-statement text-k-ink">{c.intro.statement}</h2>
          <div><Button variant="ghost" onClick={onDeploy} aria-haspopup="dialog">{c.intro.cta}</Button></div>
        </div>
        <div className="grid place-items-center px-(--k-gutter) py-10 md:col-span-4">
          <Figure name="keep-detail" plain label={c.figures.moats[3]} className="w-full max-w-[420px]" />
        </div>
      </div>
      <div className="grid border-t border-k-line md:grid-cols-12">
        <div className="flex flex-col gap-2 border-b border-k-line px-(--k-gutter) py-6 md:col-span-4 md:border-b-0 md:border-r">
          <Label>{c.intro.routedLabel}</Label>
          <p className="k-body text-k-ink-2">{c.intro.routedLine}</p>
        </div>
        <ul className="grid grid-cols-3 md:col-span-8 md:grid-cols-6">
          {PROVIDERS.map(({ name, Icon, href }, i) => (
            <li key={name} className={`flex border-k-line ${i % 3 !== 2 ? "border-r" : ""} md:border-r ${i < 3 ? "border-b md:border-b-0" : ""} md:last:border-r-0`}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="k-fx flex w-full items-center justify-center gap-2.5 px-3 py-6 text-k-ink-2">
                <Icon size={20} aria-hidden />
                <span className="k-label"><Roll>{name}</Roll></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
