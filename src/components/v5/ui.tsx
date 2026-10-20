"use client";

import React, { createContext, useContext } from "react";

/* v5 primitives (DESIGN.md › Components). Structure is square hairline cells;
   things you touch are rounded. The accent is reserved for actions and live
   state (60-30-10). */

/** Section label: `[01] The shift`. */
export function Label({ index, children, className = "" }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`k-label flex items-center gap-2 text-k-ink-3 ${className}`}>
      {index && <span className="text-k-accent-text">[{index}]</span>}
      <span>{children}</span>
    </p>
  );
}

/** A label that rolls up on hover (the second copy is hidden from screen readers). */
export function Roll({ children }: { children: React.ReactNode }) {
  return (
    <span className="k-roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

/** An arrow that rides out to the right while a fresh one slides in. */
export function Arrow({ glyph = "→" }: { glyph?: string }) {
  return (
    <span aria-hidden className="k-arrow">
      <span>{glyph}</span>
      <span>{glyph}</span>
    </span>
  );
}

type ButtonProps = {
  variant?: "primary" | "ghost";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Pill button. Primary is the one accent action per view; ghost is the rest.
    Hover dissolves a fill in from the left and rolls the label (globals.css › hover). */
export function Button({ variant = "primary", arrow = true, className = "", children, ...rest }: ButtonProps) {
  const look = variant === "primary" ? "k-fx-press bg-k-accent text-k-on-accent" : "border border-k-ink-3 text-k-ink";
  return (
    <button
      type="button"
      data-fx="x"
      className={`k-fx inline-flex min-h-11 items-center gap-3 rounded-k-control px-5 py-2.5 k-label active:scale-[0.97] ${look} ${className}`}
      {...rest}
    >
      <Roll>{children}</Roll>
      {arrow && <Arrow />}
    </button>
  );
}

/** Inline text action: underlined, accent on hover only. */
export function TextLink({ children, className = "", ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`inline underline decoration-k-ink-3 decoration-1 underline-offset-4 transition-colors duration-(--k-dur-micro) hover:text-k-accent-text hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k-accent ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ---- frame marks: the decoration on each section's hairline frame.
   Heron uses a ruler board; Kairma's options are previewable with ?frame=
   (crop | ledger | grid | seal). See docs/revamp/02 §9. ---- */
export type FrameStyle = "crop" | "ledger" | "grid" | "seal";
export const FrameContext = createContext<FrameStyle>("crop");

const crop =
  "absolute size-3 before:absolute before:bg-k-ink-3 after:absolute after:bg-k-ink-3 before:h-px before:w-full after:h-full after:w-px";

/** Corner marks for a framed cell. `index` feeds the seal variant. */
export function FrameMarks({ index, className = "" }: { index?: string; className?: string }) {
  const style = useContext(FrameContext);
  if (style === "crop")
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-2 md:inset-3 ${className}`}>
        <span className={`${crop} left-0 top-0 before:left-0 before:top-0 after:left-0 after:top-0`} />
        <span className={`${crop} right-0 top-0 before:right-0 before:top-0 after:right-0 after:top-0`} />
        <span className={`${crop} bottom-0 left-0 before:bottom-0 before:left-0 after:bottom-0 after:left-0`} />
        <span className={`${crop} bottom-0 right-0 before:bottom-0 before:right-0 after:bottom-0 after:right-0`} />
      </div>
    );
  if (style === "ledger")
    return (
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
        <span className="absolute inset-x-0 top-1 h-px bg-k-line" />
        <span className="absolute inset-y-0 left-(--k-gutter) w-px bg-k-line" />
        <span className="absolute inset-y-0 left-[calc(var(--k-gutter)+4px)] w-px bg-k-line" />
      </div>
    );
  if (style === "grid")
    return (
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-(--k-gutter) opacity-70 ${className}`}
        style={{
          backgroundImage:
            "linear-gradient(var(--k-line) 1px, transparent 1px), linear-gradient(90deg, var(--k-line) 1px, transparent 1px)",
          backgroundSize: "var(--k-gutter) var(--k-gutter)",
        }}
      />
    );
  return (
    <div aria-hidden className={`pointer-events-none absolute right-2 top-2 md:right-3 md:top-3 ${className}`}>
      <span className="grid size-9 place-items-center border border-k-ink-3 k-label text-k-ink-3 outline outline-1 outline-offset-2 outline-k-line">
        {index ?? "印"}
      </span>
    </div>
  );
}

/** Kairma wordmark, recoloured through a mask (never typeset). */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block bg-current ${className}`}
      style={{
        WebkitMaskImage: "url(/kairma-logo.svg)",
        maskImage: "url(/kairma-logo.svg)",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "left center",
        maskPosition: "left center",
      }}
    />
  );
}

/** Smooth-scroll to a section, accounting for the fixed header. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: Element, o?: object) => void } }).__lenis;
  const header = document.querySelector("[data-k-header]")?.getBoundingClientRect().height ?? 0;
  if (lenis) lenis.scrollTo(el, { offset: -header });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - header, behavior: "smooth" });
  // Move focus for keyboard and screen-reader users without a second scroll.
  el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
}
