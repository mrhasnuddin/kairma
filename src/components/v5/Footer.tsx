"use client";

import React from "react";
import { useSiteCopyV6 } from "@/lib/language";
import { Button, FrameMarks } from "./ui";

/** Height of the fixed footer AND of the runway that uncovers it. */
export const FOOTER_REVEAL_HEIGHT = "100svh";

const mask = (url: string, position = "center"): React.CSSProperties => ({
  WebkitMaskImage: `url(${url})`, maskImage: `url(${url})`,
  WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
  WebkitMaskSize: "contain", maskSize: "contain",
  WebkitMaskPosition: position, maskPosition: position,
});

/* The old Kairma reveal footer (same words, wordmark, fresco and closing
   line), set in the v5 system: the accent becomes the page through .k-invert,
   type is Plex, the frame is the page's hairline frame. It sits fixed under the
   content curtain; the runway after <main> uncovers it. */
export function Footer({ onPilot }: { onPilot: () => void }) {
  const s = useSiteCopyV6();
  // Keyboard focus must never land on a button the curtain still covers.
  const reveal = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });

  return (
    <footer aria-label="Kairma" className="k-invert fixed inset-x-0 bottom-0 z-0 flex flex-col overflow-hidden bg-k-paper text-k-ink" style={{ height: FOOTER_REVEAL_HEIGHT }}>
      {/* ghost wordmark behind everything */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-2/5 w-4/5 max-w-7xl bg-k-ink opacity-5" style={mask("/kairma-logo.svg")} />
      </div>

      <div className="relative mx-(--k-inset) flex min-h-0 flex-1 flex-col items-center border-x border-k-line px-(--k-gutter) pb-6 pt-(--k-header-h) text-center">
        <FrameMarks index="08" />
        <p className="k-label mt-6 flex flex-wrap items-center justify-center gap-x-3 text-k-ink-2">
          <span>Cause</span><span aria-hidden className="text-k-ink-4">/</span>
          <span>Effect</span><span aria-hidden className="text-k-ink-4">/</span>
          <span>Acknowledged Debt</span>
        </p>
        <div role="img" aria-label="Kairma" className="mt-5 h-10 w-56 bg-k-ink md:h-14 md:w-72" style={mask("/kairma-logo.svg")} />
        <h2 className="k-display-2 mt-5 max-w-4xl text-k-ink">{s.hero_left.h1}</h2>
        <p className="k-body mt-3 max-w-xl text-k-ink-2">{s.hero_left.sub}</p>
        <Button className="mt-6" onClick={onPilot} onFocus={reveal}>
          {(s.hero_left.cta_1 || "Request a pilot").replace(/\s*→\s*$/, "")}
        </Button>
        {/* the fresco: its dither is part of the brand, so it plays as shot */}
        <div className="mt-6 flex min-h-0 w-full flex-1 items-center justify-center">
          <div className="thumb-duotone pointer-events-none relative h-full max-h-96 overflow-hidden rounded-k-media">
          <video
            src="/videos/footer/footer-portrait.mp4"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden
            className="h-full w-auto max-w-full object-contain"
          />
          </div>
        </div>
      </div>

      <div className="relative mx-(--k-inset) flex items-end justify-between gap-6 border-x border-t border-k-line px-(--k-gutter) py-4">
        <span className="k-label text-k-ink-2">{s.footer.closing}</span>
        <span className="k-label flex items-center gap-3 text-k-ink-2">
          <span aria-hidden className="size-6 bg-k-ink" style={mask("/Bentos/K.svg")} />
          Kairma OS v1.0
        </span>
      </div>
    </footer>
  );
}
