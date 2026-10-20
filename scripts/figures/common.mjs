// Shared parts for Kairma's anatomy figures (skill: anatomy). Every figure is
// built once in Node and written to public/figures/<name>.svg; the page loads
// it on demand and moves only the groups marked data-part.
import * as k from "../../src/components/iso/iso-kit.mjs";
import * as G from "../../src/components/iso/lathe.mjs";

export { k, G };

export const S = (paths, style) => k.solidSvg(paths, style);
export const L = (d, style) => k.lineSvg(d, style);
export const D = (points, style) => k.dotsSvg(points, style);

export const byDepth = (P, points) =>
  [...points].sort((a, b) => k.depthOf([a[0], a[1], a[2] ?? 0], P) - k.depthOf([b[0], b[1], b[2] ?? 0], P));

/** A part that moves at runtime: `<g data-part>` the live code transforms. */
export const part = (name, body, extra = {}) =>
  `<g data-part="${name}"${Object.entries(extra).map(([a, v]) => ` ${a}="${v}"`).join("")}>${Array.isArray(body) ? body.join("") : body}</g>`;

/** Draw 2D shapes in the plane of a vertical face (sideMatrix) or a top face. */
export const onFace = (matrix, body) => `<g transform="${matrix}">${Array.isArray(body) ? body.join("") : body}</g>`;
export const faceRect = (x, y, w, h, tone = "lo", r = 0) =>
  `<rect class="iso-line" data-tone="${tone}" x="${x}" y="${y}" width="${w}" height="${h}"${r ? ` rx="${r}"` : ""}/>`;
export const faceFill = (x, y, w, h, cls = "iso-fill", r = 0) =>
  `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"${r ? ` rx="${r}"` : ""}/>`;
export const faceCircle = (cx, cy, r, tone = "lo") => `<circle class="iso-line" data-tone="${tone}" cx="${cx}" cy="${cy}" r="${r}"/>`;
export const faceLine = (x1, y1, x2, y2, tone = "lo", free) =>
  `<path class="iso-line" data-tone="${tone}"${free ? ` data-free="${free === true ? "" : free}"` : ""} d="M${x1} ${y1}L${x2} ${y2}"/>`;

/**
 * Base plate on feet (craft.md › Base plate on feet): halo, four feet, a
 * bevelled slab, an inset groove, corner screws, a ruler strip along the front
 * edge and a label plate with three rule lines. Returns [svg, topZ].
 */
export function basePlate(P, PLATE, { h = 10, foot = 5, ruler = true, label = true, rulerSide = "y" } = {}) {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -h - foot, h, P)}"/>`];
  for (const [x, y] of byDepth(P, k.corners(PLATE, 18))) {
    out.push(S(k.cylinder(x, y, 6.4, -h - foot, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5, -h - foot + 1.6, foot - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -h, h, P, 8, 1.4), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.1, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => k.iso([x, y, 0], P)), { size: 0.5 }));
  if (ruler) {
    const strip = rulerSide === "y"
      ? { x: PLATE.x + 16, y: PLATE.y + PLATE.d - 13, w: PLATE.w - 32 - (label ? 54 : 0), d: 7, r: 1 }
      : { x: PLATE.x + PLATE.w - 13, y: PLATE.y + 16, w: 7, d: PLATE.d - 32 - (label ? 54 : 0), r: 1 };
    out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
    const t = rulerSide === "y"
      ? k.topTicks(strip.x + 3, strip.x + strip.w - 3, 4, 5, strip.y + 0.8, 0.6, [2, 3.6], P)
      : k.topTicks(strip.y + 3, strip.y + strip.d - 3, 4, 5, strip.x + 0.8, 0.6, [2, 3.6], P, "y");
    out.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  }
  if (label) {
    const plan = rulerSide === "y"
      ? { x: PLATE.x + PLATE.w - 62, y: PLATE.y + PLATE.d - 18, w: 46, d: 12, r: 1.2 }
      : { x: PLATE.x + PLATE.w - 18, y: PLATE.y + PLATE.d - 62, w: 12, d: 46, r: 1.2 };
    out.push(S(k.slabOf(plan, 0, 0.8, P, 4), { tone: "lo", crease: "none" }));
    out.push(L(k.planOutline(k.insetPlan(plan, 1.6), 0.8, P, 4), { tone: "faint" }));
    if (rulerSide === "y") {
      [[0.62, 2.8], [0.44, 5.2], [0.54, 7.6]].forEach(([f, dy]) =>
        out.push(L(k.lineOnTop([plan.x + 4, plan.y + dy + 1], [plan.x + 4 + (plan.w - 12) * f, plan.y + dy + 1], 0.8, P), { tone: "lo", free: true })));
      out.push(D([k.iso([plan.x + plan.w - 4, plan.y + 3.6, 0.8], P), k.iso([plan.x + plan.w - 4, plan.y + plan.d - 3.6, 0.8], P)], { size: 0.45 }));
    } else {
      [[0.62, 2.8], [0.44, 5.2], [0.54, 7.6]].forEach(([f, dx]) =>
        out.push(L(k.lineOnTop([plan.x + dx + 1, plan.y + 4], [plan.x + dx + 1, plan.y + 4 + (plan.d - 12) * f], 0.8, P), { tone: "lo", free: true })));
      out.push(D([k.iso([plan.x + 3.6, plan.y + plan.d - 4, 0.8], P), k.iso([plan.x + plan.w - 3.6, plan.y + plan.d - 4, 0.8], P)], { size: 0.45 }));
    }
  }
  return out.join("");
}

/** Screw heads on a vertical face at world points: ring + dot (dots only; rings need a face plane). */
export const screwDots = (P, points, size = 0.5, tone = "mid") => D(points.map((p) => k.iso(p, P)), { size, tone });

/** Wrap the body into a figure SVG (no aria: the page supplies the label). */
export function figure({ width, height, body, clip = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="0 0 ${width} ${height}" aria-hidden="true" focusable="false"${clip ? ' style="overflow:hidden"' : ""}>${Array.isArray(body) ? body.join("") : body}</svg>`;
}

/** Round to 0.01 for meta passed to the page. */
export const fine = (v) => Math.round(v * 100) / 100;
export const vec = (P, by) => k.axisVector(P, by).map(fine);

/* ── Myth kit ────────────────────────────────────────────────────────────
   The figures are temple things: stone platforms, columns, bronze doors,
   turned statuettes. Same tones and rules as the machine kit. */

/** Plan of the lower step under a stone base, for fitting the camera. */
export const baseBox = (PLATE, { h = 12, foot = 5 } = {}) => k.boxCorners(k.insetPlan(PLATE, -6), -h - foot, 0);

/**
 * A running Greek key in a face plane: verticals and hooks hang from the
 * bottom border at v = b, so every stroke ends on a border line.
 */
export function meander(u0, u1, t, b, tone = "lo") {
  const s = (b - t) / 4;
  const n = Math.max(1, Math.floor((u1 - u0) / (4 * s)));
  const pad = (u1 - u0 - n * 4 * s) / 2;
  let d = "";
  for (let i = 0; i < n; i++) {
    const o = u0 + pad + i * 4 * s;
    d += `M${o} ${b}L${o} ${t}L${o + 3 * s} ${t}L${o + 3 * s} ${t + 2 * s}L${o + 1.5 * s} ${t + 2 * s}L${o + 1.5 * s} ${b}`;
  }
  return `<path class="iso-line" data-tone="${tone}" d="${d}"/>`;
}

/**
 * Stone base (craft.md › Base plate, as a stylobate): halo, an outset lower
 * step, the top step with a Greek key band on its front riser, coursing joints
 * across its top and an inscribed tablet. Top at z = 0, like basePlate.
 */
export function stoneBase(P, PLATE, { h = 12, foot = 5, tablet = true, key = true, joints = 44 } = {}) {
  const low = k.insetPlan(PLATE, -6);
  const out = [`<path class="iso-halo" d="${k.haloOf(low, -h - foot, h, P)}"/>`];
  out.push(S(k.slabOf(low, -h - foot, foot, P, 8, 0.8), { tone: "lo" }));
  const riser = key ? onFace(k.sideMatrix([PLATE.x + PLATE.r, PLATE.y + PLATE.d], 0, P, "left"), [
    faceRect(2, 2.4, PLATE.w - PLATE.r * 2 - 4, h - 4.8, "lo"),
    meander(5, PLATE.w - PLATE.r * 2 - 5, 4.4, h - 2.4, "lo"),
  ]) : "";
  out.push(S(k.slabOf(PLATE, -h, h, P, 8, 1.2), { tone: "mid", inner: riser }));
  // coursing: joints along x edge to edge, staggered cross joints between them
  const rows = [];
  const y0 = PLATE.y + 2, y1 = PLATE.y + PLATE.d - 2;
  const courses = Math.max(2, Math.round(PLATE.d / joints));
  const step = (y1 - y0) / courses;
  for (let i = 1; i < courses; i++) rows.push(k.lineOnTop([PLATE.x + 2, y0 + i * step], [PLATE.x + PLATE.w - 2, y0 + i * step], 0, P));
  for (let i = 0; i < courses; i++) {
    const off = i % 2 ? joints / 2 : 0;
    for (let x = PLATE.x + joints + off; x < PLATE.x + PLATE.w - 12; x += joints) rows.push(k.lineOnTop([x, y0 + i * step + (i ? 0 : -2)], [x, y0 + (i + 1) * step + (i === courses - 1 ? 2 : 0)], 0, P));
  }
  out.push(L(rows.join(""), { tone: "faint" }));
  if (tablet) {
    const plan = { x: PLATE.x + PLATE.w - 62, y: PLATE.y + PLATE.d - 18, w: 46, d: 12, r: 1.2 };
    out.push(S(k.slabOf(plan, 0, 1.6, P, 4, 0.4), { tone: "lo", crease: "none" }));
    out.push(L(k.planOutline(k.insetPlan(plan, 1.6), 1.6, P, 4), { tone: "faint" }));
    [[0.66, 2.8], [0.48, 5.2], [0.58, 7.6]].forEach(([f, dy]) =>
      out.push(L(k.lineOnTop([plan.x + 4, plan.y + dy + 1], [plan.x + 4 + (plan.w - 8) * f, plan.y + dy + 1], 1.6, P), { tone: "lo", free: true })));
  }
  return out.join("");
}

/** A Doric column on its own axis: tapered fluted shaft, echinus, square abacus. */
export function column(P, [cx, cy], z0, h, r, { flutes = 16, tone = "mid", lit = false, abacus = true } = {}) {
  const F = G.frameAlong([cx, cy, z0], [0, 0, 1]);
  const top = r * 0.84;
  const out = [];
  const ribs = G.ribsOf(F, 0.6, h - 0.6, r, flutes, P, { r1: top, fade: [0.05, 0.5] });
  out.push(S(G.solidOf([[0, r], [h, top]], F, P), { tone, lit, crease: "none", inner: k.fadedSvg(ribs, { tone: "faint" }) }));
  out.push(S(G.solidOf([[h, top], [h + r * 0.28, r * 1.08, 1], [h + r * 0.42, r * 1.16]], F, P), { tone, lit, crease: "none" }));
  if (abacus) out.push(S(k.slabOf({ x: cx - r * 1.25, y: cy - r * 1.25, w: r * 2.5, d: r * 2.5, r: 0.4 }, z0 + h + r * 0.42, r * 0.36, P, 2), { tone, lit }));
  return out.join("");
}

/** A turned statuette (an automaton or a votary): robe, shoulders, neck, head. */
export function figurine(P, [cx, cy], z0, s, { tone = "hi", lit = false, crease = "lo", arms = false } = {}) {
  const F = G.frameAlong([cx, cy, z0], [0, 0, 1]);
  const robe = [[0, 4.6 * s], [1.2 * s, 4.6 * s], [1.6 * s, 4.1 * s], [9 * s, 3 * s, 1], [14.5 * s, 2.5 * s, 1], [16.6 * s, 3.1 * s, 1], [18.2 * s, 2.4 * s, 1], [19 * s, 1.1 * s]];
  // an automaton is jointed: bands at the hem, waist and chest
  const bands = arms ? [G.arcOf(F, 6 * s, 3.45 * s, P), G.arcOf(F, 11 * s, 2.76 * s, P), G.arcOf(F, 14.5 * s, 2.5 * s, P)].join("") : "";
  const arm = (sx) => {
    const A = G.frameAlong([cx + sx * 3.4 * s, cy, z0 + 9.4 * s], [0, 0, 1]);
    return [S(G.solidOf([[0, 0.7 * s, 1], [0.6 * s, 0.9 * s, 1], [6.6 * s, 0.9 * s], [7 * s, 0.6 * s]], A, P), { tone, lit, crease: "none" }), S(G.sphereOf([cx + sx * 3.4 * s, cy, z0 + 16.4 * s], 1.05 * s, P), { tone, lit, crease: "none" })].join("");
  };
  const V = G.viewOf(P);
  const back = arms ? [-1, 1].filter((sx) => sx * V[0] < 0) : [];
  const out = back.map(arm);
  out.push(S(G.solidOf(robe, F, P), { tone, lit, crease, inner: bands ? L(bands, { tone: "lo" }) : "" }));
  out.push(L(G.arcOf(F, 1.2 * s, 4.6 * s, P), { tone: "faint" }));
  if (arms) [-1, 1].filter((sx) => sx * V[0] >= 0).forEach((sx) => out.push(arm(sx)));
  out.push(S(G.sphereOf([cx, cy, z0 + 21.4 * s], 2.6 * s, P), { tone, lit, crease: "none" }));
  return out.join("");
}
