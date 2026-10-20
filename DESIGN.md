---
version: alpha
name: Kairma
description: Design system v5 for the Kairma marketing site. Heron's content structure and hairline grid, Kairma's two themes, IBM Plex type, anatomy drawings.
colors:
  k-paper: "#F2F2F0"
  k-surface: "#FFFFFF"
  k-ink: "#282828"
  k-ink-2: "#414140"
  k-ink-3: "#696966"
  k-ink-4: "#B4B4B0"
  k-line: "#B4B4B0"
  k-accent: "#00492E"
  k-accent-text: "#00492E"
  k-on-accent: "#FFFFFF"
  k-danger: "#C9402B"
  k-accent-wash: "color-mix(in srgb, #00492E 24%, #F2F2F0)"
typography:
  k-display-1:
    fontFamily: IBM Plex Sans
    fontSize: 56px
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: -0.025em
  k-display-2:
    fontFamily: IBM Plex Sans
    fontSize: 48px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: -0.025em
  k-statement:
    fontFamily: IBM Plex Sans
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: -0.02em
  k-title:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: -0.015em
  k-label:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.01em
  k-body:
    fontFamily: IBM Plex Sans
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.45
rounded:
  k-frame: 0px
  k-media: 1rem
  k-field: 0.75rem
  k-control: 9999px
spacing:
  k-gutter: 20px
  k-inset: 8px
  k-header: 64px
  k-hairline: 1px
  k-columns: 12
---

## Overview

Kairma's site presents forward-deployed AI employees for cross-border operations. Version 5 follows Heron's content structure section for section (loader, hero, intro, problems, platform, why, use cases, CTA) without its scroll story, inside a continuous hairline frame. Every diagram is an anatomy drawing: a real machine whose working is the idea. The old Kairma reveal footer keeps its words, wordmark and fresco, set in this system.

## Colors

Colour follows **60-30-10**.

- **60 · paper (`k-paper`, `k-surface`):** the page and its cells. `k-surface` is for raised layers only: menus, dialogs, a selected row.
- **30 · ink (`k-ink` → `k-ink-3`, `k-line`):** type, hairlines and the drawings. Headings use `k-ink`, body `k-ink-2`, metadata `k-ink-3` (the lightest ink allowed for information). `k-line` is decoration only; field and control borders use `k-ink-3`.
- **10 · accent (`k-accent`, `k-accent-text`, `k-on-accent`):** the one primary action per view, index numbers, the active nav item, live status, the cursor, and the one lit part of each drawing. Nothing else.
- **`k-danger`:** form errors only. Never the accent, which is green in light.
- **`k-ink-4`:** disabled states only.
- Tokens come in three layers: primitives (`--kp-*`, raw values), semantic roles (`--k-*`, swapped per theme) and Tailwind utilities. Components read roles, never primitives.

## Themes

Light (`xuan-mode`) is the default and is the frontmatter above. Dark (`matrix-mode`) applies when the visitor chooses it or the OS asks for dark.

| Token | Light (`xuan-mode`) | Dark (`matrix-mode`) |
|---|---|---|
| `k-paper` | `#F2F2F0` | `#0B0A0C` |
| `k-surface` | `#FFFFFF` | `#141316` |
| `k-ink` | `#282828` | `#EDECE8` |
| `k-ink-2` | `#414140` | `#C8C7C2` |
| `k-ink-3` | `#696966` | `#8D8C87` |
| `k-ink-4` | `#B4B4B0` | `#4B4A47` |
| `k-line` | `#B4B4B0` | `#34332F` |
| `k-accent` | `#00492E` | `#C9402B` |
| `k-accent-text` | `#00492E` | `#D25A47` |
| `k-on-accent` | `#FFFFFF` | `#FFFFFF` |
| `k-danger` | `#C9402B` | `#D25A47` |

## Typography

- **IBM Plex Sans** for display, statement, title and body; display roles are uppercase and tight.
- **IBM Plex Mono** for labels, nav, buttons, indices, plate corners and readouts, uppercase.
- **CJK** follows the page language: IBM Plex Sans JP, IBM Plex Sans KR, Noto Sans TC, loaded only for that locale.
- Sizes are fluid between the 393 px and 1728 px canvases; no role renders below 12 px.

## Layout

- A 12-column grid on desktop, stacked cells on mobile, inside a full-bleed hairline frame.
- Sections are bordered cells; spacing comes from hairlines and the gutter, never from floating cards.
- Each section frame carries corner marks (`FrameMarks`; options previewable with `?frame=crop|ledger|grid|seal`).

## Shapes

- **Structure is square** (`k-frame`): cells, sections, header cells, dividers.
- **Things you touch are rounded:** media `k-media`, fields `k-field`, buttons and chips `k-control`.

## Drawings

- Built with the anatomy kit in `scripts/figures/*.mjs`, written to `public/figures/*.svg` (`node scripts/figures/build.mjs`), loaded when near the viewport.
- The subjects come from Greek myth, to sit with the footer fresco: the Keep is a treasury with a temple key, the router is a herm of Hermes, the rack is Olympus as tiers of altars, the workforce is Hephaestus' automatons. Each still works like the idea it shows. Stone and bronze parts share helpers in `scripts/figures/common.mjs` (`stoneBase` with its Greek key band, `column`, `figurine`, `meander`).
- The kit's tones map onto the roles above (`--k-fig-*`); `lit` is the accent, used on one moving part per drawing.
- A drawing sits in a plate: figure number and title on top, hint and live readout below, in mono labels.

## Dither

Ordered dither (8 × 8 Bayer) is Kairma's own texture. It comes from the footer fresco, which ships dithered on purpose.

- Masks live in `public/dither` (`node scripts/dither.mjs`). Each ramp runs solid, then a dithered gradient, then empty; sliding it across an element with `mask-position` dissolves a fill in or out pixel by pixel. Pixels stay square, about 3 px (5 to 6 px full screen).
- **Hover:** nav cells dissolve their fill up from the underline; pill buttons dissolve in from the left while the label rolls up and the arrow rides out (`.k-fx`, `<Roll>`, `<Arrow>`). Primary pills fill with ink, everything else with the accent.
- **Footer edge:** the page dissolves into the footer (`.k-dither-edge`).
- **Theme switch:** the new theme dissolves up the screen over the old one (View Transitions). Without support, or with reduced motion, it swaps at once.
- **Inverted scope (`.k-invert`):** the footer, and the header while it sits over the footer, use the accent as the page. Only white clears 4.5:1 on the dark red, so every text role is white there.

## Motion

- Presets by job: `instant` 120 ms (press), `micro` 160 ms (hover), `enter` 240 ms, `exit` 160 ms, `collapse` 320 ms, `reveal` 800 ms (marketing reveals only).
- Eases: `k-ease-ui` for interface enters, `k-ease-move` for on-screen movement, `k-ease-out` for reveals. Exits are shorter than enters; nothing scales from 0; buttons press to 0.97.
- Reveals play once on enter. **Nothing is tied to scroll position**: no scrubbed text, no sticky scroll stories.
- Drawings run their loops only while on screen and stop when settled.
- The cursor (desktop, fine pointer only) draws an accent trail, crop marks around anything pressable and a seal stamp on click; the system cursor stays visible.
- With reduced motion: no loader, no cursor, every reveal shows its final state, every drawing shows one still frame.

## Do's and Don'ts

- Do keep the accent to the 10%: one primary action per view.
- Don't put the light accent and the dark accent on the same surface.
- Don't render text below 12 px or use `k-ink-4` for content.
- Don't tie text reveals to scroll.
- Don't ship a raw full-colour thumbnail; imagery takes the duotone treatment.
