---
version: alpha
name: Kairma
description: Design system v4 for the Kairma marketing site — Heron-style editorial grid with Kairma's dual-theme brand.
colors:
  k-paper: "#F2F2F0"
  k-surface: "#FFFFFF"
  k-ink: "#282828"
  k-ink-2: "#414140"
  k-ink-3: "#696966"
  k-ink-4: "#B4B4B0"
  k-line: "#B3B3AF"
  k-accent: "#00492E"
  k-accent-text: "#00492E"
  k-on-accent: "#FFFFFF"
  k-accent-wash: "color-mix(in srgb, #00492E 24%, #F2F2F0)"
typography:
  k-display-1:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: -0.02em
  k-display-2:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.02em
  k-statement:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.02em
  k-title:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.02em
  k-label:
    fontFamily: CourierPrime
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
  k-body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  k-editorial:
    fontFamily: Gloock
  k-gothic:
    fontFamily: Canterbury
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

Kairma's marketing site presents forward-deployed AI employees for cross-border operations. Version 4 adopts an editorial grid language — a continuous hairline frame, uppercase display type set tight against small mono labels, and one accent per theme — while keeping Kairma's two themes, its accents, and its wordmark.

## Colors

- **Paper (`k-paper`):** the page ground. Every theme-bound surface — duotone backdrops, the routing pyramid, the body — resolves to it.
- **Surface (`k-surface`):** raised layers only: popovers, menus, dialogs.
- **Ink ramp (`k-ink` → `k-ink-3`):** headings use `k-ink`, body uses `k-ink-2`, metadata uses `k-ink-3`. `k-ink-3` is the lightest ink allowed for information.
- **`k-ink-4`:** disabled states and the start colour of scroll-revealed text. Never for content.
- **Line (`k-line`):** decorative hairlines between cells. Field and control borders use `k-ink-3` so they stay perceivable.
- **Accent (`k-accent`):** fills for CTAs, hotspots and the active state. `k-on-accent` is the text placed on it.
- **Accent text (`k-accent-text`):** accent-coloured text. It differs from `k-accent` in dark mode, where the raw accent is too dim for small text.
- **Wash (`k-accent-wash`):** the backdrop for soft duotone imagery inside cards.

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
| `k-line` | `#B3B3AF` | `#34332F` |
| `k-accent` | `#00492E` | `#C9402B` |
| `k-accent-text` | `#00492E` | `#CE5340` |
| `k-on-accent` | `#FFFFFF` | `#FFFFFF` |
| `k-accent-wash` | `color-mix(in srgb, #00492E 24%, #F2F2F0)` | `color-mix(in srgb, #C9402B 65%, #0B0A0C)` |

## Typography

- **Display, statement and title** are set in Inter, uppercase, with tight leading — the headline carries the section.
- **Labels** — section labels, nav, buttons, indices, status — are CourierPrime, uppercase.
- **Body** is Inter in sentence case.
- **CJK** text uses the Noto Sans face that matches the active locale (Traditional Chinese, Japanese or Korean), chosen from the page language, never from a shared fallback list.
- **Gloock** is reserved for the 观 epigraph column; **Canterbury** for wordmark capitals.
- Sizes are fluid: they scale with viewport width between the mobile and desktop canvases. Frontmatter records the desktop-canvas values; no role renders below the site's minimum text size.

## Layout

- The page is a 12-column grid on desktop and a 4-column grid on mobile, inside a full-bleed hairline frame.
- Sections are bordered cells in that grid. Spacing comes from the hairlines and the gutter, not from free-floating cards with gaps.
- The header is a row of bordered cells at the top of the frame.

## Shapes

- **Structure is square** (`k-frame`): grid cells, sections, header cells and dividers.
- **Things you touch are rounded:** media cards use `k-media`, fields use `k-field`, buttons, pills and chips use `k-control`.

## Motion

- Use the three duration tokens and two out-eases defined in `globals.css`. GSAP is the only motion engine.
- Headlines enter as masked line-by-line or word-by-word reveals.
- At most one statement per page is scrubbed to scroll, revealing from `k-ink-4` to `k-ink`.
- Scroll stories hold their stage with sticky positioning inside a tall track; they are not pinned.
- With reduced motion, every reveal shows its final state and every scroll story renders as stacked static frames.

## Do's and Don'ts

- Don't put the light accent and the dark accent on the same surface.
- Don't render any text below the site's minimum text size.
- Don't use `k-ink-4` for content.
- Don't ship a raw full-colour thumbnail or per-theme image variants; imagery always takes the duotone treatment.
