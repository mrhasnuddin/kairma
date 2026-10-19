"use client";

import React, { useRef } from "react";
import { useCopyV7 } from "@/lib/language";
import { Label } from "./ui";
import { MOTION_OK, gsap, useGSAP } from "./motion";

/* The Keep, told as a sticky scroll story (Heron's floor-plan sequence).
   The stage is `position: sticky` inside a tall track; one scrubbed timeline
   drives it. With reduced motion the track collapses and every frame renders
   statically, in order. */

const MODELS = ["Claude", "GPT", "Gemini", "DeepSeek", "Qwen", "Kimi"];

// Module boxes inside the Keep, in viewBox units (1200 × 640).
const MODULES = [
  { x: 100, y: 150, w: 210, h: 130 },
  { x: 330, y: 150, w: 210, h: 130 },
  { x: 100, y: 300, w: 440, h: 120 },
];
const NODE = { w: 150, h: 100, x0: 790, x1: 960, y0: 130, gap: 130 };
const nodes = MODELS.map((name, i) => ({ name, x: i % 2 ? NODE.x1 : NODE.x0, y: NODE.y0 + Math.floor(i / 2) * NODE.gap }));

const mono = { fontFamily: "var(--k-font-mono)", textTransform: "uppercase" as const };

export function KeepStory() {
  const c = useCopyV7();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(MOTION_OK, () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
        });
        // Explicit schedule on a 10-unit track so each statement gets about a
        // screen of scroll (Heron's pacing) before the plan draws in:
        //   0–5.2 statements · 4.9–6.9 drawing · 7–8.7 hotspots · 8.8–10 closing
        const stages = gsap.utils.toArray<HTMLElement>("[data-stage]");
        stages.forEach((s, i) => {
          const t = i * 1.6;
          if (i > 0) tl.fromTo(s, { autoAlpha: 0, yPercent: 30 }, { autoAlpha: 1, yPercent: 0, duration: 0.6 }, t);
          else gsap.set(s, { autoAlpha: 1 });
          tl.to(s, { autoAlpha: 0, yPercent: -30, duration: 0.6 }, t + 1.4);
        });
        tl.fromTo("[data-schematic]", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, 4.9)
          .from("[data-draw]", { drawSVG: "0%", stagger: 0.1, duration: 1.2 }, 5.0)
          .from("[data-node]", { autoAlpha: 0, y: 12, stagger: 0.1, duration: 0.4 }, 5.8)
          .from("[data-route]", { autoAlpha: 0, stagger: 0.05, duration: 0.3 }, 6.4);
        gsap.utils.toArray<HTMLElement>("[data-hotspot]").forEach((h, i) => {
          tl.from([h, `[data-callout="${i}"]`], { autoAlpha: 0, scale: 0.85, transformOrigin: "0% 0%", duration: 0.5 }, 7 + i * 0.6);
        });
        tl.from("[data-closing]", { autoAlpha: 0, y: 20, duration: 0.6 }, 8.8).to({}, { duration: 0.6 }, 9.4);
      });
    },
    { scope: root, dependencies: [c.keep.stages.join("|")], revertOnUpdate: true },
  );

  return (
    <section id="keep" ref={root} className="relative border-b border-k-line motion-safe:h-[520svh]">
      <div className="flex flex-col motion-safe:sticky motion-safe:top-0 motion-safe:h-[100svh] motion-safe:pt-(--k-header-h)">
        <div className="flex items-center justify-between border-b border-k-line px-(--k-gutter) py-3">
          <Label index="02">{c.keep.label}</Label>
          <span className="k-label hidden text-k-ink-3 sm:block">{c.keep.local} · {c.keep.tasks} · {c.keep.cloud}</span>
        </div>

        <div className="relative flex flex-1 flex-col gap-12 px-(--k-gutter) py-12 motion-safe:gap-0 motion-safe:py-0">
          {/* stage statements */}
          {c.keep.stages.map((s, i) => (
            <p
              key={i}
              data-stage
              className="k-display-2 text-center text-k-ink motion-safe:pointer-events-none motion-safe:absolute motion-safe:inset-0 motion-safe:flex motion-safe:items-center motion-safe:justify-center motion-safe:px-(--k-gutter)"
            >
              {s}
            </p>
          ))}

          {/* schematic */}
          <div data-schematic className="flex flex-col gap-6 motion-safe:absolute motion-safe:inset-0 motion-safe:justify-center motion-safe:px-(--k-gutter) motion-safe:pb-28 md:motion-safe:pb-20">
            <div className="relative mx-auto w-full max-w-6xl text-k-ink">
              <svg viewBox="0 0 1200 640" className="h-auto w-full" role="img" aria-label={`${c.keep.label}: ${c.keep.stages.join(" ")}`}>
                <defs>
                  <pattern id="k-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="var(--k-line)" strokeWidth="2" />
                  </pattern>
                </defs>

                {/* the Keep: local, solid frame */}
                <rect data-draw x="60" y="80" width="520" height="480" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <rect x="100" y="440" width="440" height="80" fill="url(#k-hatch)" />
                <rect data-draw x="100" y="440" width="440" height="80" fill="none" stroke="var(--k-line)" />
                <text x="60" y="64" style={mono} fontSize="16" fill="currentColor">{c.keep.local} · {c.keep.label}</text>

                {MODULES.map((m, i) => (
                  <g key={i}>
                    <rect data-draw x={m.x} y={m.y} width={m.w} height={m.h} fill="var(--k-surface)" stroke="currentColor" />
                    <text x={m.x + 44} y={m.y + 24} style={mono} fontSize="15" fill="currentColor">{c.keep.hotspots[i]?.title}</text>
                  </g>
                ))}

                {/* the cloud: external, dashed frame */}
                <rect data-draw x="760" y="80" width="380" height="480" fill="none" stroke="currentColor" strokeDasharray="6 6" />
                <text x="760" y="64" style={mono} fontSize="16" fill="currentColor">{c.keep.cloud}</text>
                {nodes.map((n) => (
                  <g key={n.name} data-node>
                    <rect x={n.x} y={n.y} width={NODE.w} height={NODE.h} fill="var(--k-paper)" stroke="var(--k-ink-3)" />
                    <text x={n.x + NODE.w / 2} y={n.y + NODE.h / 2 + 6} textAnchor="middle" style={{ fontFamily: "var(--k-font-display)" }} fontSize="20" fontWeight="600" fill="currentColor">{n.name}</text>
                  </g>
                ))}

                {/* tasks: the only thing that crosses the line */}
                {nodes.map((n) => (
                  <path
                    key={n.name}
                    data-route
                    d={`M540 215 C 650 215, 680 ${n.y + NODE.h / 2}, ${n.x} ${n.y + NODE.h / 2}`}
                    fill="none"
                    stroke="var(--k-accent)"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                    className="motion-safe:animate-[k-dash_1.6s_linear_infinite]"
                  />
                ))}
                <text x="670" y="112" textAnchor="middle" style={mono} fontSize="14" fill="var(--k-accent)">{c.keep.tasks}</text>

                {/* hotspots */}
                {MODULES.map((m, i) => (
                  <g key={i} data-hotspot>
                    <rect x={m.x + 10} y={m.y + 8} width="26" height="26" fill="var(--k-accent)" />
                    <text x={m.x + 23} y={m.y + 26} textAnchor="middle" style={{ fontFamily: "var(--k-font-mono)" }} fontSize="15" fill="var(--k-on-accent)">{i + 1}</text>
                  </g>
                ))}
              </svg>

              {/* callouts: positioned over the plan on desktop, listed on mobile */}
              <ul aria-label={c.keep.hotspotsLabel} className="mt-6 grid gap-3 md:mt-0 md:block">
                {c.keep.hotspots.map((h, i) => {
                  const m = MODULES[i];
                  return (
                    <li
                      key={h.title}
                      data-callout={i}
                      className="flex gap-3 bg-k-ink p-4 text-k-paper md:absolute md:left-(--x) md:top-(--y) md:w-[19%]"
                      style={{ "--x": `${((m.x + m.w * 0.55) / 1200) * 100}%`, "--y": `${((m.y + m.h * 0.62) / 640) * 100}%` } as React.CSSProperties}
                    >
                      <span className="k-label shrink-0 text-k-paper/60">0{i + 1}</span>
                      <span className="flex flex-col gap-1">
                        <span className="k-label">{h.title}</span>
                        <span className="text-sm leading-snug opacity-80">{h.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p
            data-closing
            className="k-body mx-auto max-w-2xl border-t border-k-line pt-4 text-center text-k-ink-2 motion-safe:absolute motion-safe:inset-x-(--k-gutter) motion-safe:bottom-6 md:motion-safe:bottom-8"
          >
            {c.keep.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
