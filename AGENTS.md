<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design System

- **Font sizes**: minimum 12px (`text-xs`), maximum 34px (box headlines, `.text-box-headline-max`). Never go below 12px.
- **Corners**: SHARP everywhere — `border-radius: 0` is enforced globally in `globals.css` (`--radius: 0` + explicit overrides of the `rounded*` utilities). The corner-bracket hairlines (top-left / bottom-right) are the box language of the site; do not add rounded corners. Only `rounded-full` is allowed, and only for status dots, pills, rings, and orbits.
- **Box / CTA language**: bordered box (`border border-theme-border/40 bg-theme-void/80`) + corner-bracket accents — two hairlines (`w-2.5 h-[1px]` + `w-[1px] h-2.5`) at top-left and bottom-right, accent-colored on active/hover.
- **Theme accents**: light (`xuan-mode`) primary is GREEN (`#00492E`); dark (`matrix-mode`) primary is RED (`#C9402B`). Always read them via `--theme-accent` / the `PALETTES` object — never mix green and red on one surface, and never hardcode the wrong mode's accent.
- **Typography**: mono (`IBM Plex Mono`) for UI/terminal surfaces; uppercase + `tracking-widest` for labels.
