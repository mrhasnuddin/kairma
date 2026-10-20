// Fig. 02 · Inside the treasury, its front wall taken away. On the floor: the
// brand data lake as a sacred spring in a stone well-head, whose one lead pipe
// runs up to the SOP engine and nowhere else; and the model router as Hermes,
// a herm on a crossroads stone, whose one open spout feeds the channel to the
// window. On the shelf: the SOP engine as Clotho's spindle, winding the
// playbook as thread, and the RPA / API as Hephaestus' golden handmaidens,
// each tied to one of your systems on the back wall. The four parts are groups
// mod-0..3 so the page can light one.
import { k, G, S, L, D, part, onFace, faceRect, faceFill, faceCircle, faceLine, stoneBase, baseBox, figurine, figure } from "./common.mjs";
import { BODY, TOP, FLOOR, capAndPosts, slot, scrollSvg } from "./keep.mjs";
import { tubePieces, tubeSvg } from "../../src/components/iso/tube.mjs";

const PLATE = { x: -142, y: -74, w: 196, d: 150, r: 8 };
const IN = { x0: BODY.x + 3, x1: BODY.x + BODY.w - 3, y0: BODY.y + 3, y1: BODY.y + BODY.d };
const SHELF = { y1: -15, z: 86, t: 3 };
const WELL = { c: [-88, 20], r: 20, z1: FLOOR + 30 };
const HERM = { c: [-34, 20] };
const CHUTE_Z = 40; // channel floor, level with the window and the runnel outside
const OUT_Z = CHUTE_Z + 4;

function walls(P) {
  const out = [];
  out.push(S(k.slabOf(k.insetPlan(BODY, -12), 0, 5, P, 4, 0.6), { tone: "lo" }));
  out.push(S(k.slabOf(k.insetPlan(BODY, -6), 5, FLOOR - 5, P, 4, 0.6), { tone: "mid" }));
  const back = { x: BODY.x, y: BODY.y, w: BODY.w, d: 3, r: 1 };
  const left = { x: BODY.x, y: BODY.y, w: 3, d: BODY.d, r: 1 };
  out.push(S(k.slabOf(back, FLOOR, TOP - FLOOR, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf(left, FLOOR, TOP - FLOOR, P, 2), { tone: "mid" }));
  // floor flags and the back wall's coursing, edge to edge
  out.push(L(Array.from({ length: 5 }, (_, i) => k.lineOnTop([IN.x0 + 24 * (i + 1), IN.y0], [IN.x0 + 24 * (i + 1), IN.y1], FLOOR, P)).join(""), { tone: "faint" }));
  out.push(L([IN.y0 + 34, IN.y0 + 70].map((y) => k.lineOnTop([IN.x0, y], [IN.x1, y], FLOOR, P)).join(""), { tone: "faint" }));
  const BF = k.sideMatrix([IN.x0, IN.y0], TOP, P, "left");
  const rows = [];
  for (let v = 14; v < TOP - FLOOR; v += 14) rows.push(faceLine(0, v, IN.x1 - IN.x0, v, "faint"));
  out.push(onFace(BF, rows));
  return out.join("");
}

/** Your systems: four bronze plaques on the back wall, above the shelf, each with a ring. */
function sockets(P) {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const plate = { x: -36 + i * 15, y: IN.y0, w: 11, d: 1.4, r: 0.8 };
    out.push(S(k.slabOf(plate, 118, 16, P, 2, 0.3), { tone: "mid" }));
    const F = k.sideMatrix([plate.x, IN.y0 + 1.4], 134, P, "left");
    out.push(onFace(F, [faceRect(1.6, 1.6, 7.8, 12.8, "faint", 0.6), faceCircle(5.5, 8, 2.6, "mid"), faceFill(4.3, 6.8, 2.4, 2.4, "iso-shade k-void", 1.2)]));
  }
  return out.join("");
}

const SOCKET = (P, i) => k.iso([-36 + i * 15 + 5.5, IN.y0 + 1.5, 126], P);

/** mod-1 · SOP engine: Clotho's spindle, a spool of thread between two whorls on stone stands. */
function sopEngine(P) {
  const out = [];
  out.push(S(k.slabOf({ x: -112, y: -48, w: 64, d: 30, r: 1.5 }, SHELF.z + SHELF.t, 3, P, 3, 0.4), { tone: "mid" }));
  const z0 = SHELF.z + SHELF.t + 3;
  const stand = (x) => S(k.slabOf({ x, y: -42, w: 6, d: 12, r: 0.8 }, z0, 15, P, 2, 0.3), { tone: "mid", inner: L(k.sideSeam({ x, y: -42, w: 6, d: 12, r: 0.8 }, z0 + 5, P, 2), { tone: "faint" }) });
  out.push(stand(-108));
  const F = G.frameOf([-104, -36, z0 + 15], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  out.push(S(G.disc(-2, 0, 1.4, F, P), { tone: "mid" }));
  out.push(S(G.disc(0, 2.4, 11, F, P), { tone: "mid" }));
  // the thread: a full spool, wound in close turns
  const turns = Array.from({ length: 16 }, (_, i) => G.arcOf(F, 4.5 + i * 2.1, 8.4, P)).join("");
  out.push(S(G.solidOf([[2.4, 6], [3.6, 8.4, 1], [38, 8.4, 1], [39.4, 6]], F, P), { tone: "hi", crease: "none", inner: L(turns, { tone: "faint" }) }));
  out.push(S(G.disc(39.4, 41.8, 11, F, P), { tone: "mid" }));
  out.push(S(G.disc(41.8, 47, 1.4, F, P), { tone: "mid" }));
  out.push(stand(-58));
  // the thread runs up from the spool to a guide ring on a bronze arm
  const arm = { x: -84, y: -26, w: 3, d: 3, r: 0.6 };
  out.push(S(k.slabOf(arm, SHELF.z + SHELF.t + 3, 34, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: -88, y: -27, w: 11, d: 5, r: 1 }, SHELF.z + SHELF.t + 37, 2, P, 2), { tone: "mid" }));
  out.push(k.wireSvg(k.iso([-84 + 1.5, -24.5 + 1, z0 + 15 + 8.4], P), k.iso([-82.5, -24.5, SHELF.z + SHELF.t + 39], P), { tone: "lo", size: 0.7 }));
  // the inlet boss the lead pipe lands on, on the base's front apron
  out.push(S(k.slabOf({ x: -94, y: -18, w: 20, d: 2, r: 0.6 }, SHELF.z + SHELF.t, 12, P, 2), { tone: "mid" }));
  out.push(S(G.disc(0, 2.4, 4.4, G.frameAlong([-84, -16, 96], [0, 1, 0]), P), { tone: "mid" }));
  return out.join("");
}

/** mod-3 · RPA / API: four golden handmaidens on a bench, each tied to a system. */
function maidens(P) {
  const out = [];
  out.push(S(k.slabOf({ x: -42, y: -48, w: 64, d: 26, r: 1.5 }, SHELF.z + SHELF.t, 3, P, 3, 0.4), { tone: "mid" }));
  const z0 = SHELF.z + SHELF.t + 3;
  const wires = [];
  [-31, -16, -1, 14].forEach((x, i) => {
    out.push(S(k.slabOf({ x: x - 5, y: -40, w: 10, d: 10, r: 0.8 }, z0, 3, P, 2), { tone: "mid" }));
    out.push(figurine(P, [x, -35], z0 + 3, 1.05, { tone: "hi" }));
    const hand = k.iso([x, -38, z0 + 3 + 16.4], P);
    out.push(D([hand], { size: 0.6, tone: "hi" }));
    wires.push(k.wireSvg(hand, SOCKET(P, i), { tone: "lo", size: 0.8 }));
  });
  out.push(wires.join(""));
  return out.join("");
}

function shelf(P) {
  const out = [];
  out.push(S(k.slabOf({ x: IN.x0, y: -40, w: 5, d: 20, r: 0.6 }, SHELF.z - 9, 9, P, 2), { tone: "lo" }));
  const plan = { x: IN.x0, y: IN.y0, w: IN.x1 - IN.x0, d: SHELF.y1 - IN.y0, r: 0.8 };
  out.push(S(k.slabOf(plan, SHELF.z, SHELF.t, P, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(plan, SHELF.z + 1.5, P, 2), { tone: "faint" }) }));
  return out.join("");
}

/** mod-0 · the brand data lake: a sacred spring in a fluted stone well-head. */
function well(P) {
  const [cx, cy] = WELL.c;
  const F = G.frameAlong([cx, cy, FLOOR], [0, 0, 1]);
  const h = WELL.z1 - FLOOR;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: cx - 18, y: cy - 18, w: 36, d: 36, r: 18 }, FLOOR, 0.1, P)}" style="filter:blur(5px)"/>`];
  out.push(S(G.disc(0, 3, WELL.r + 2, F, P), { tone: "mid" }));
  const flutes = G.ribsOf(F, 4.4, h - 4.4, WELL.r, 28, P, { fade: [0.05, 0.5] });
  out.push(S(G.disc(3, h - 3, WELL.r, F, P), { tone: "hi", crease: "lo", inner: k.fadedSvg(flutes, { tone: "faint" }) + L([G.arcOf(F, 4.4, WELL.r, P), G.arcOf(F, h - 4.4, WELL.r, P)].join(""), { tone: "lo" }) }));
  out.push(S(G.ringBand(h - 3, h, WELL.r - 4, WELL.r + 1.6, F, P), { tone: "mid" }));
  // the water, still, a little below the rim
  const water = k.circleRing(cx, cy, WELL.r - 4, 56);
  out.push(`<path class="k-fig-liquid" d="${k.onTop(water, WELL.z1 - 1, P, true)}"/>`);
  out.push(L(k.ring(cx, cy, WELL.r - 9, WELL.z1 - 1, P, 40), { tone: "faint" }));
  out.push(L(k.ring(cx, cy, WELL.r - 4, WELL.z1, P, 56), { tone: "mid" }));
  return out.join("");
}

/** The lead pipe from the well-head's back rim up and back to the spindle's inlet. Local only. */
function dataLine(P) {
  const [cx, cy] = WELL.c;
  const y = cy - WELL.r + 2;
  const out = [S(k.cylinder(cx, y, 3.2, WELL.z1, 2.4, P, 24), { tone: "mid" })];
  const route = G.fillet([[cx, y, WELL.z1 + 2.4], [cx, y, 96], [-84, -13.6, 96]], 7);
  out.push(...tubePieces(route, 1.8, P, { maxLength: 12 }).map((piece) => tubeSvg(piece, { tone: "hi" })));
  return out.join("");
}

/** mod-2 · the model router: Hermes, a herm on a crossroads stone, six spouts, one open. */
function herm(P) {
  const [cx, cy] = HERM.c;
  const out = [];
  const V = G.viewOf(P);
  const spouts = Array.from({ length: 6 }, (_, i) => (i / 6) * Math.PI * 2);
  const spout = (a) => S(G.disc(9, 14, 2.4, G.frameAlong([cx, cy, OUT_Z], [Math.cos(a), Math.sin(a), 0]), P), { tone: "mid" });
  out.push(S(k.cylinder(cx, cy, 16, FLOOR, 6, P, 64, 0.6), { tone: "mid", inner: L(k.sideArc(cx, cy, 16, FLOOR + 3, P, 40), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: cx - 8, y: cy - 8, w: 16, d: 16, r: 0.6 }, FLOOR + 6, 4, P, 2, 0.4), { tone: "mid" }));
  spouts.filter((a) => Math.cos(a) * V[0] + Math.sin(a) * V[1] < 0).forEach((a) => out.push(spout(a)));
  out.push(S(k.cylinder(cx, cy, 9.4, OUT_Z - 4, 8, P, 48, 0.4), { tone: "mid" }));
  spouts.filter((a) => Math.cos(a) * V[0] + Math.sin(a) * V[1] >= 0).forEach((a) => out.push(spout(a)));
  // the pillar with a caduceus cut in its face, arm tenons, the head in its travelling hat
  const pil = { x: cx - 5.5, y: cy - 5.5, w: 11, d: 11, r: 0.4 };
  out.push(S(k.slabOf(pil, FLOOR + 10, OUT_Z - 4 - FLOOR - 10, P, 2, 0.3), { tone: "hi", crease: "lo" }));
  const CF = k.sideMatrix([pil.x, pil.y + pil.d], OUT_Z + 28, P, "left");
  const wave = (sgn) => `<path class="iso-line" data-tone="lo" d="M5.5 20.5C${5.5 + sgn * 4} 18 ${5.5 + sgn * 4} 15.5 5.5 13.5S${5.5 - sgn * 4} 9 5.5 6.5"/>`;
  const caduceus = onFace(CF, [faceLine(5.5, 3.2, 5.5, 22, "mid"), wave(1), wave(-1), `<path class="iso-line" data-tone="lo" d="M5.5 4.6C3.6 2.6 1.6 2.8 1.2 4.4M5.5 4.6C7.4 2.6 9.4 2.8 9.8 4.4"/>`, faceCircle(5.5, 2.6, 0.9, "mid")]);
  out.push(S(k.slabOf(pil, OUT_Z + 4, 26, P, 2, 0.3), { tone: "hi", crease: "lo", inner: caduceus }));
  for (const sx of [-1, 1]) out.push(S(k.slabOf({ x: cx + (sx < 0 ? -9.5 : 5.5), y: cy - 2, w: 4, d: 4, r: 0.4 }, OUT_Z + 24, 4, P, 2), { tone: "hi", crease: "lo" }));
  out.push(S(k.slabOf({ x: cx - 7, y: cy - 4.5, w: 14, d: 9, r: 1.6 }, OUT_Z + 30, 3, P, 3, 0.3), { tone: "hi", crease: "lo" }));
  out.push(S(G.solidOf([[0, 2.2], [3, 2]], G.frameAlong([cx, cy, OUT_Z + 33], [0, 0, 1]), P), { tone: "hi", crease: "none" }));
  out.push(S(G.sphereOf([cx, cy, OUT_Z + 40], 5, P), { tone: "hi", crease: "none" }));
  const hat = G.frameAlong([cx, cy, OUT_Z + 42.6], [0, 0, 1]);
  out.push(S(G.disc(0, 0.9, 8.2, hat, P), { tone: "hi", crease: "lo" }));
  out.push(S(G.solidOf([[0.9, 4.6], [2.6, 4, 1], [4, 2, 1], [4.6, 0.5]], hat, P), { tone: "hi", crease: "none" }));
  return out.join("");
}

/** The stone channel from the herm's open spout to the window, with a scroll in it. */
function chute(P) {
  const [cx, cy] = HERM.c;
  const x0 = cx + 14, x1 = IN.x1;
  const y0 = cy - 9, y1 = cy + 9;
  const out = [];
  out.push(S(k.slabOf({ x: x0 + 8, y: y0 + 4, w: 6, d: 10, r: 0.6 }, FLOOR, CHUTE_Z - 4 - FLOOR, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0.5 }, CHUTE_Z - 4, 4, P, 2, 0.3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: x0, y: y0, w: x1 - x0, d: 1.6, r: 0.4 }, CHUTE_Z, 3, P, 2), { tone: "mid" }));
  out.push(scrollSvg(P, [x0 + 12, y0 + 3, CHUTE_Z + 3.4], { r: 3.4, len: 12 }));
  out.push(S(k.slabOf({ x: x0, y: y1 - 1.6, w: x1 - x0, d: 1.6, r: 0.4 }, CHUTE_Z, 3, P, 2), { tone: "mid" }));
  return out.join("");
}

// The right wall is cut away above the window, so the shelf behind it shows.
const CUT = 74;
function rightWall(P) {
  const plan = { x: BODY.x + BODY.w - 3, y: BODY.y, w: 3, d: BODY.d, r: 1 };
  return S(k.slabOf(plan, FLOOR, CUT - FLOOR, P, 2), { tone: "mid", inner: L([24, 66].map((z) => k.sideSeam(plan, z, P, 2)).join(""), { tone: "faint" }) });
}

export async function build() {
  const W = 900;
  const H = 640;
  const P = k.fitProjection([...baseBox(PLATE), ...k.boxCorners(k.insetPlan(BODY, -6), 0, TOP)], W, H, { pad: 24, azimuth: 48 });
  const body = [
    stoneBase(P, PLATE, { h: 12, tablet: false }),
    walls(P),
    sockets(P),
    shelf(P),
    part("mod-1", sopEngine(P)),
    part("mod-3", maidens(P)),
    part("mod-0", [well(P), dataLine(P)].join("")),
    part("mod-2", [herm(P), chute(P)].join("")),
    rightWall(P),
    slot(P),
    capAndPosts(P, { cap: false }),
  ];
  return { svg: figure({ width: W, height: H, body }), meta: {} };
}
