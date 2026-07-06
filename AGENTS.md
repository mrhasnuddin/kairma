<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design System

- **Font sizes**: minimum 12px (`text-xs`), maximum 34px (box headlines, `.text-box-headline-max`). Never go below 12px.
- **Corners**: ROUNDED everywhere — use modern Apple/iOS-style smooth rounded corners (`rounded-xl` / `rounded-2xl` / `rounded-3xl` for cards, boxes, and containers; `rounded-xl` or `rounded-full` for buttons, CTAs, and pills).
- **Box / CTA language**: smooth rounded cards and buttons (`rounded-xl` / `rounded-2xl` / `rounded-3xl` border border-theme-border/40 bg-theme-void/80). Avoid sharp 0-radius corners or protruding corner-bracket hairlines.
- **Theme accents**: light (`xuan-mode`) primary is GREEN (`#00492E`); dark (`matrix-mode`) primary is RED (`#C9402B`). Always read them via `--theme-accent` / the `PALETTES` object — never mix green and red on one surface, and never hardcode the wrong mode's accent.
- **Typography**: mono (`IBM Plex Mono`) for UI/terminal surfaces; uppercase + `tracking-widest` for labels.
- **Thumbnails**: ALL thumbnail/poster images get the theme-duotone treatment — wrap the `<img>` in a container with the `thumb-duotone` class (defined in `globals.css`). The image is desaturated and blended against `--theme-accent` (dark: `darken` → red highlights on black; light: `lighten` → green shadows on paper), so one full-color source image adapts to both themes automatically. Never ship a raw full-color thumbnail or per-theme image variants. If the thumbnail animates (framer-motion opacity/scale slides), put `thumb-duotone` ON the animated element itself — an opacity/transform animation forms its own compositing group, and the blend must have its accent backdrop inside that group or the duotone drops out during the transition.
