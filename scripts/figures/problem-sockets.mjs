// Problem 02 · Disconnected. Four columns, cut by four different masons: each
// shaft has its own dowel sockets on top, and the capital waiting over it
// carries the wrong dowels. Every so often a capital tries its column and lifts
// off again, so no beam ever joins them.
import { k, G, S, L, part, onFace, faceRect, faceCircle, faceFill, stoneBase, baseBox, figure, vec } from "./common.mjs";

const PLATE = { x: -100, y: -48, w: 200, d: 104, r: 7 };
const PITCH = 46;
const sx = (i) => -69 + i * PITCH;
const CY = -10;
const SHAFT = { z0: 5, h: 30, r: 8 };
const GAP = 12;
export const REACH = 9;

// dowel patterns in a 16 × 12 field: column i takes pattern i, capital i carries (i + 1) % 4
const PATTERNS = [
  [[5, 6, "c"], [11, 6, "c"]],
  [[4, 6, "r"], [8, 6, "r"], [12, 6, "r"]],
  [[5, 4, "s"], [11, 4, "s"], [5, 8, "s"], [11, 8, "s"]],
  [[8, 6, "slot"]],
];
const socket = ([u, v, t], tone) =>
  t === "c" ? faceCircle(u, v, 1.6, tone) :
  t === "r" ? faceRect(u - 0.6, v - 2.2, 1.2, 4.4, tone, 0.3) :
  t === "s" ? faceRect(u - 1.1, v - 1.1, 2.2, 2.2, tone, 0.3) :
  faceRect(u - 4, v - 0.8, 8, 1.6, tone, 0.6);
const dowel = (P, [u, v, t], x0, y0, z) => {
  const [x, y] = [x0 + u, y0 + v];
  if (t === "c") return S(k.cylinder(x, y, 1.4, z - 3, 3, P, 14), { tone: "hi", crease: "none" });
  const [w, d] = t === "r" ? [1.2, 4.4] : t === "s" ? [2.2, 2.2] : [8, 1.6];
  return S(k.slabOf({ x: x - w / 2, y: y - d / 2, w, d, r: 0.2 }, z - 3, 3, P, 2), { tone: "hi", crease: "none" });
};

export async function build() {
  const W = 560;
  const H = 400;
  const top = SHAFT.z0 + SHAFT.h;
  const P = k.fitProjection([...baseBox(PLATE, { h: 10 }), [sx(0) - 12, CY, top + GAP + 16], [sx(3) + 12, CY, top + GAP + 16]], W, H, { pad: 18, azimuth: 34 });
  const out = [stoneBase(P, PLATE, { h: 10, tablet: false })];
  // the stylobate the four stand on
  out.push(S(k.slabOf({ x: sx(0) - 16, y: CY - 14, w: sx(3) - sx(0) + 32, d: 28, r: 1 }, 0, SHAFT.z0, P, 3, 0.5), { tone: "mid" }));
  for (let i = 0; i < 4; i++) {
    const x = sx(i);
    const F = G.frameAlong([x, CY, SHAFT.z0], [0, 0, 1]);
    const r1 = SHAFT.r * 0.92;
    const flutes = G.ribsOf(F, 0.6, SHAFT.h, SHAFT.r, 16, P, { r1, fade: [0.05, 0.5] });
    out.push(S(G.solidOf([[0, SHAFT.r], [SHAFT.h, r1]], F, P), { tone: "mid", crease: "none", inner: k.fadedSvg(flutes, { tone: "faint" }) }));
    // the sockets cut in the top bed
    const T = k.topMatrix([x - 8, CY - 6], top, P);
    out.push(onFace(T, [faceFill(0, 0, 16, 12, "iso-fill", 1), faceRect(0, 0, 16, 12, "faint", 1), ...PATTERNS[i].map((p) => socket(p, "lo"))]));
    // the capital over it: dowels under an echinus and a square abacus
    const z = top + GAP;
    const cap = PATTERNS[(i + 1) % 4].map((p) => dowel(P, p, x - 8, CY - 6, z));
    const E = G.frameAlong([x, CY, z], [0, 0, 1]);
    cap.push(S(G.solidOf([[0, r1], [2.6, SHAFT.r * 1.1, 1], [4.2, SHAFT.r * 1.26]], E, P), { tone: "hi", crease: "lo" }));
    cap.push(S(k.slabOf({ x: x - 11, y: CY - 11, w: 22, d: 22, r: 0.5 }, z + 4.2, 4, P, 2, 0.3), { tone: "hi", crease: "lo" }));
    out.push(part(`plug-${i}`, cap));
  }
  return { svg: figure({ width: W, height: H, body: out }), meta: { ey: vec(P, [0, 0, -1]), reach: REACH } };
}
