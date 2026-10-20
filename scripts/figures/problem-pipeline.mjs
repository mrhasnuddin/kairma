// Problem 01 · Unscripted. The Danaids' jar: a great storage jar on a stone
// ring, pierced near its foot. However often it is filled, the water (the
// deals) runs out of it, drop by drop, into a pool on the floor.
import { k, G, S, L, D, part, stoneBase, baseBox, figure, vec } from "./common.mjs";

const PLATE = { x: -104, y: -46, w: 208, d: 92, r: 7 };
const JAR = { c: [-14, -8], z0: 5 };
const PROFILE = [[0, 8], [2.4, 9.4, 1], [10, 15.6, 1], [24, 20.6, 1], [40, 19.8, 1], [53, 14, 1], [59, 10.4, 1], [61, 10], [61, 11.6], [64.6, 11.6], [64.6, 9.6]];
const HOLE_Z = 14;
export const DROPS = 3;

const radiusAt = (s) => {
  for (let i = 1; i < PROFILE.length; i++) {
    const [s0, r0] = PROFILE[i - 1], [s1, r1] = PROFILE[i];
    if (s >= s0 && s <= s1) return r0 + ((r1 - r0) * (s - s0)) / (s1 - s0 || 1);
  }
  return PROFILE[0][1];
};

export async function build() {
  const W = 560;
  const H = 400;
  const [cx, cy] = JAR.c;
  const P = k.fitProjection([...baseBox(PLATE, { h: 10 }), [cx, cy, JAR.z0 + 70]], W, H, { pad: 18, azimuth: 30 });
  const out = [stoneBase(P, PLATE, { h: 10, tablet: false })];
  const V = G.viewOf(P);
  const toward = Math.hypot(V[0], V[1]);
  const [hx, hy] = [V[0] / toward, V[1] / toward];
  // the hole faces the viewer; the pool lies under it
  const r = radiusAt(HOLE_Z - JAR.z0);
  const hole = [cx + hx * r, cy + hy * r, HOLE_Z];
  const pool = [hole[0] + hx * 6, hole[1] + hy * 6];
  out.push(S(k.cylinder(pool[0], pool[1], 13, 0, 0.4, P, 48), { tone: "lo", flat: true }));
  out.push(L(k.ring(pool[0], pool[1], 8, 0.4, P, 40), { tone: "faint" }));
  // the ring stand and the jar, with painted bands and two lugs on the shoulder
  out.push(S(k.cylinder(cx, cy, 13, 0, JAR.z0, P, 48, 0.5), { tone: "mid", inner: L(k.sideArc(cx, cy, 13, JAR.z0 / 2, P, 36), { tone: "faint" }) }));
  const F = G.frameAlong([cx, cy, JAR.z0], [0, 0, 1]);
  const bands = [20, 24, 46].map((s) => G.arcOf(F, s, radiusAt(s), P)).join("");
  const crack = k.segment([hole[0] - hy * 3, hole[1] + hx * 3, HOLE_Z + 9], [hole[0], hole[1], HOLE_Z + 0.6], P);
  out.push(S(G.solidOf(PROFILE, F, P), { tone: "hi", crease: "lo", inner: L(bands, { tone: "lo" }) + L(crack, { tone: "mid", free: true }) }));
  for (const sx of [-1, 1]) {
    const a = Math.atan2(hy, hx) + sx * Math.PI / 2;
    out.push(S(G.sphereOf([cx + Math.cos(a) * 15.6, cy + Math.sin(a) * 15.6, JAR.z0 + 50], 2.4, P), { tone: "hi", crease: "none" }));
  }
  out.push(D([k.iso(hole, P)], { size: 1.2, tone: "hi" }));
  // a water jar set down beside it, the one the jar is filled from
  const W2 = G.frameAlong([52, 6, 0], [0, 0, 1]);
  out.push(S(G.solidOf([[0, 6], [2, 7.6, 1], [12, 10.4, 1], [20, 8.6, 1], [25, 4.4, 1], [27, 4], [28.6, 5.4]], W2, P), { tone: "hi", crease: "lo", inner: L([12, 20].map((s) => G.arcOf(W2, s, s === 12 ? 10.4 : 8.6, P)).join(""), { tone: "lo" }) }));
  // drops, built at the hole; the live code drops them to the pool
  for (let i = 0; i < DROPS; i++) out.push(part(`drop-${i}`, S(G.sphereOf([hole[0] + hx * 2.4, hole[1] + hy * 2.4, HOLE_Z - 1], 1.4, P), { tone: "hi", lit: true, crease: "none" }), { opacity: "0" }));
  return { svg: figure({ width: W, height: H, body: out }), meta: { ez: vec(P, [0, 0, 1]), fall: HOLE_Z - 1 } };
}
