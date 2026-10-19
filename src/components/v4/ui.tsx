"use client";

import React from "react";

/* v4 primitives. Structure is square (hairline cells); things you touch are
   rounded (DESIGN.md › Shapes). */

/** Section label: `[01] The shift`. */
export function Label({ index, children, className = "" }: { index?: string; children: React.ReactNode; className?: string }) {
  return (
    <p className={`k-label flex items-center gap-2 text-k-ink-3 ${className}`}>
      {index && <span>[{index}]</span>}
      <span className="text-k-ink">{children}</span>
    </p>
  );
}

type ButtonProps = {
  variant?: "primary" | "ghost";
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

/** Pill button. Primary is the one accent action; ghost is everything else. */
export function Button({ variant = "primary", arrow = true, className = "", children, ...rest }: ButtonProps) {
  const look =
    variant === "primary"
      ? "bg-k-accent text-k-on-accent hover:opacity-90"
      : "border border-k-ink-3 text-k-ink hover:border-k-ink hover:bg-k-ink/5";
  return (
    <button
      type="button"
      className={`group inline-flex min-h-11 items-center gap-3 rounded-k-control px-5 py-2.5 k-label transition-[opacity,background-color,border-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-k-accent ${look} ${className}`}
      {...rest}
    >
      <span>{children}</span>
      {arrow && (
        <span aria-hidden className="transition-transform duration-300 ease-k-out group-hover:translate-x-1">
          →
        </span>
      )}
    </button>
  );
}

/** "+" marks that pin a frame's corners, as on Heron's hairline frame. */
export function Crosshairs({ className = "" }: { className?: string }) {
  const mark = "absolute size-4 before:absolute before:left-1/2 before:top-0 before:h-full before:w-px before:bg-k-ink-3 after:absolute after:left-0 after:top-1/2 after:h-px after:w-full after:bg-k-ink-3";
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${mark} -left-2 -top-2`} />
      <span className={`${mark} -right-2 -top-2`} />
      <span className={`${mark} -bottom-2 -left-2`} />
      <span className={`${mark} -bottom-2 -right-2`} />
    </div>
  );
}

/** Kairma wordmark, recoloured through a mask (never typeset). */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Kairma"
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
}
