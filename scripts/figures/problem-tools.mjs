// Problem 04 · Tool-bound. Hermes' winged sandals lie still on the floor,
// waiting for someone to wear them; beside them one of Hephaestus' automatons
// hammers at its anvil on its own. A tool makes a person faster; a workforce
// does the work.
import { k, G, S, L, D, part, stoneBase, baseBox, figure, vec } from "./common.mjs";

const PLATE = { x: -104, y: -48, w: 208, d: 96, r: 7 };
export const STROKE = 14;

const SOLE = [[0, 0], [4, -4], [12, -5.2], [24, -5], [33, -4], [39, -1.6], [40, 1], [37, 3.6], [28, 4.6], [16, 4], [6, 4.4], [1.4, 3]];

function sandal(P, x0, y0, flip) {
  const ring = SOLE.map(([x, y]) => [x0 + x, y0 + (flip ? -y : y)]);
  const out = [S(k.extrude(flip ? [...ring].reverse() : ring, 0, 2.6, P, { convex: false, bevel: 0.4 }), { tone: "mid", crease: "lo" })];
  // straps across the instep and round the heel
  out.push(L([10, 18, 26].map((x) => k.lineOnTop([x0 + x, y0 - 4.4], [x0 + x, y0 + 4.4], 2.6, P)).join(""), { tone: "lo" }));
  out.push(L(k.lineOnTop([x0 + 10, y0], [x0 + 26, y0], 2.6, P), { tone: "faint" }));
  // the wing at the heel: a feathered fin standing up on the outer side
  const side = y0 + (flip ? -4.6 : 4.6);
  const F = G.frameOf([x0, side, 2.6], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const wing = [[0, 0], [9, 0], [6, 4], [3, 10], [-2, 14], [-5, 12], [-3, 6]];
  const feathers = [[1, 1, -3, 9], [3, 1, 0, 9], [5, 1, 3, 6]].map(([u0, v0, u1, v1]) => k.segment([x0 + u0, side, 2.6 + v0], [x0 + u1, side, 2.6 + v1], P)).join("");
  out.push(S(G.prismOf(F, wing, -0.5, 0.5, P), { tone: "hi", crease: "none", inner: L(feathers, { tone: "faint" }) }));
  return out.join("");
}

export async function build() {
  const W = 560;
  const H = 400;
  const P = k.fitProjection([...baseBox(PLATE, { h: 10 }), ...k.boxCorners({ x: 14, y: -34, w: 56, d: 28 }, 78, 96)], W, H, { pad: 18, azimuth: 34 });
  const out = [stoneBase(P, PLATE, { h: 10, tablet: false })];
  // the sandals, side by side, one a little ahead of the other
  out.push(sandal(P, -86, -4, true), sandal(P, -80, 12, false));
  // the automaton's forge: base, stone pillar, bronze arm, anvil; the hammer moves
  const base = { x: 12, y: -36, w: 64, d: 56, r: 2 };
  out.push(S(k.slabOf(base, 0, 8, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(base, 4, P, 3), { tone: "faint" }) }));
  const pil = { x: 18, y: -32, w: 18, d: 16, r: 1 };
  out.push(S(k.slabOf(pil, 8, 72, P, 3, 0.5), { tone: "mid", inner: L([30, 52, 74].map((z) => k.sideSeam(pil, z, P, 3)).join(""), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: 14, y: -34, w: 56, d: 28, r: 2 }, 80, 14, P, 3, 0.6), { tone: "hi", crease: "lo" }));
  out.push(D([k.iso([18, -10, 94], P), k.iso([66, -10, 94], P)], { size: 0.5 }));
  // the anvil: a waisted block with a horn toward you
  out.push(S(k.slabOf({ x: 42, y: -24, w: 22, d: 20, r: 1 }, 8, 3, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x: 47, y: -20, w: 12, d: 12, r: 0.6 }, 11, 7, P, 2, 0.3), { tone: "mid" }));
  out.push(S(k.extrude([[42, -21], [64, -21], [64, -7], [58, -2], [53, 6], [48, -2], [42, -7]], 18, 6, P, { convex: false, bevel: 0.4 }), { tone: "hi", crease: "lo" }));
  out.push(S(k.cylinder(53, -14, 6, 74, 6, P, 28), { tone: "mid" }));
  out.push(part("ram", [
    S(k.cylinder(53, -14, 2.6, 32 + STROKE, 42 - STROKE, P, 20), { tone: "hi", lit: true, crease: "none" }),
    S(k.slabOf({ x: 45, y: -21, w: 16, d: 14, r: 1.2 }, 24 + STROKE, 8, P, 2, 0.4), { tone: "hi", lit: true, crease: "lo" }),
  ]));
  // finished shields stacked beside the anvil
  for (let i = 0; i < 4; i++) out.push(S(G.solidOf([[0, 7], [1.2, 7], [2, 5.4, 1], [2.4, 2]], G.frameAlong([88, -2 - i * 0.4, i * 2.4], [0, 0, 1]), P), { tone: "hi", crease: "lo" }));
  return { svg: figure({ width: W, height: H, body: out }), meta: { ez: vec(P, [0, 0, 1]), stroke: STROKE } };
}
