<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design System

## v5 · Heron structure, Kairma content (branch `v5`)

`DESIGN.md` is the spec; tokens live in the `DESIGN SYSTEM v5` block of `globals.css` (primitives `--kp-*` → roles `--k-*` → utilities like `bg-k-paper`, `k-display-1`, `k-label`). Plan: `docs/revamp/02-v5-structure-plan.md`.

- **Scope**: the home page lives in `src/components/v5` (composed by `SiteShellV5`); copy comes from `src/data/site-copy-v8.ts` via `useCopyV8()`. Every line traces to the original kairma.ai copy; no invented facts or metrics; no em or en dashes. The footer (`v5/Footer.tsx`) keeps the old reveal footer's words, wordmark and fresco in v5 type.
- **Colour**: 60-30-10. Paper 60, ink 30, accent 10 (one primary action per view, indices, active and live states, the one lit part of a drawing). Errors use `k-danger`, never the accent.
- **Type**: IBM Plex Sans + IBM Plex Mono (next/font); CJK faces load per locale.
- **Drawings**: every diagram is an anatomy figure built in `scripts/figures/*.mjs` → `public/figures/*.svg` (`npm run figures`). Runtime motion lives in `src/components/v5/live/*`; meta in `live/meta.json` is generated. Rebuild figures after editing a builder. Subjects are Greek myth objects (treasury, herm, altars, automatons) built from the stone and bronze helpers in `scripts/figures/common.mjs`; live controllers keep their part names (`key`, `ticket-*`, `cart-*`, `card-*`, `plug-*`, `w-*`, `drop-*`, `ram`, `data-flame`).
- **Motion**: GSAP + Lenis only, under `useGSAP`. Reveals play once on enter; nothing is tied to scroll position (no scrub, no pin, no sticky scroll story). Honour `prefers-reduced-motion` everywhere.
- **Dither**: ordered dither is part of the brand (DESIGN.md › Dither). Interactive fills use `.k-fx` with `<Roll>` / `<Arrow>`; the footer and the header over it use `.k-invert`; the footer fresco stays dithered.
- **Checks**: `npm run check:ds` (raw values, arbitrary values, token parity) must stay at 0 failing; `scripts/check-allowlist.json` only shrinks.

## v3 — bento layout (unmigrated sections)

- **Font sizes**: minimum 12px (`text-xs`), maximum 34px (`.text-box-headline-max`). Never go below 12px.
- **Box headlines**: every bento box title uses the single `.text-box-headline` class (18px mobile / 20px desktop, defined in `globals.css`) — never a raw `text-xl` / `text-[34px]` on a box title. One class = one typographic step across the whole grid, and re-scaling every box headline is a one-line change. `.text-box-headline-max` (34px) is reserved for page-level display headlines (quote frontispiece, footer statement), not boxes.
- **Corners**: ROUNDED everywhere — use modern Apple/iOS-style smooth rounded corners (`rounded-xl` / `rounded-2xl` / `rounded-3xl` for cards, boxes, and containers; `rounded-xl` or `rounded-full` for buttons, CTAs, and pills).
- **Box / CTA language**: smooth rounded cards and buttons (`rounded-xl` / `rounded-2xl` / `rounded-3xl` border border-theme-border/40 bg-theme-void/80). Avoid sharp 0-radius corners or protruding corner-bracket hairlines.
- **Theme accents**: light (`xuan-mode`) primary is GREEN (`#00492E`); dark (`matrix-mode`) primary is RED (`#C9402B`). Always read them via `--theme-accent` / the `PALETTES` object — never mix green and red on one surface, and never hardcode the wrong mode's accent.
- **Typography**: mono (`CourierPrime`) for UI/terminal surfaces; uppercase + `tracking-widest` for labels.
- **Thumbnails**: ALL thumbnail/poster images get the theme-duotone treatment — wrap the `<img>` in a container with the `thumb-duotone` class (defined in `globals.css`). The image is desaturated and blended against `--theme-accent` (dark: `darken` → red highlights on black; light: `lighten` → green shadows on paper), so one full-color source image adapts to both themes automatically. Add `thumb-soft` alongside it (`thumb-duotone thumb-soft`) for imagery that shares a card with CTAs and body copy — it blends against `--theme-accent-wash` (a lightened derivative) so the raw primary stays reserved for CTAs and overlaid text. Full-strength is correct for poster-scale imagery that owns its surface (quote frontispiece, footer); soft is correct inside a bento card (bulletin carousel). Never ship a raw full-color thumbnail or per-theme image variants. If the thumbnail animates (framer-motion opacity/scale slides), put `thumb-duotone` ON the animated element itself — an opacity/transform animation forms its own compositing group, and the blend must have its accent backdrop inside that group or the duotone drops out during the transition.
