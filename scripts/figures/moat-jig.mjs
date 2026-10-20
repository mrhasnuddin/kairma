// Why Kairma · 02 Productized. A casting bench: a stone mould with five
// cavities. Four hold the same cast ingot (most of a deployment is standard);
// a hoist lowers the one piece finished by hand, a small bronze figure, into
// the fifth (the last mile).
import { k, G, S, L, D, part, stoneBase, baseBox, figurine, figure, vec } from "./common.mjs";

const PLATE = { x: -112, y: -62, w: 224, d: 124, r: 8 };
const JIG = { x: -92, y: -32, w: 184, d: 56, r: 2 };
const POCKET = { w: 26, d: 30 };
const PITCH = 36;
const px = (i) => JIG.x + 10 + i * PITCH;
export const LIFT = 24;
const BEAM_Z = 96;

/** An oxhide ingot: a slab with drawn-in sides, stamped once on top. */
function ingot(P, i) {
  const cx = px(i) + POCKET.w / 2, cy = JIG.y + 13 + POCKET.d / 2;
  const ring = [[-11, -12], [-5, -9.5], [5, -9.5], [11, -12], [8.6, 0], [11, 12], [5, 9.5], [-5, 9.5], [-11, 12], [-8.6, 0]].map(([x, y]) => [cx + x, cy + y]);
  return [
    S(k.extrude(ring, 6, 4, P, { convex: false, bevel: 0.4 }), { tone: "mid", crease: "lo" }),
    L(k.ring(cx, cy, 3.2, 10, P, 20), { tone: "lo" }),
    D([k.iso([cx, cy, 10], P)], { size: 0.6, tone: "mid" }),
  ].join("");
}

export async function build() {
  const W = 680;
  const H = 480;
  const colX = px(4) + 4;
  const P = k.fitProjection([...baseBox(PLATE), ...k.boxCorners({ x: colX - 2, y: JIG.y - 24, w: 22, d: 62 }, 90, BEAM_Z + 14)], W, H, { pad: 22, azimuth: 40 });
  const out = [stoneBase(P, PLATE, { h: 12, tablet: false })];
  // the mould: one stone block, five cavities, a pouring channel along the back
  out.push(S(k.slabOf(JIG, 0, 6, P, 3, 0.8), { tone: "mid", inner: L(k.sideSeam(JIG, 3, P, 3), { tone: "faint" }) }));
  for (let i = 0; i < 5; i++) out.push(L(k.planOutline({ x: px(i), y: JIG.y + 13, w: POCKET.w, d: POCKET.d, r: 1.6 }, 6, P, 3), { tone: i === 4 ? "mid" : "lo" }));
  out.push(L(k.planOutline({ x: JIG.x + 6, y: JIG.y + 4, w: JIG.w - 12, d: 5, r: 2.5 }, 6, P, 4), { tone: "lo" }));
  for (let i = 0; i < 5; i++) out.push(L(k.lineOnTop([px(i) + POCKET.w / 2, JIG.y + 9], [px(i) + POCKET.w / 2, JIG.y + 13], 6, P), { tone: "lo" }));
  for (let i = 0; i < 4; i++) out.push(ingot(P, i));
  // the hoist: a stone pillar at the back and a timber beam over the fifth cavity
  const pil = { x: colX, y: JIG.y - 22, w: 18, d: 14, r: 1 };
  out.push(S(k.slabOf({ x: colX - 2, y: JIG.y - 24, w: 22, d: 18, r: 1 }, 0, 6, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf(pil, 6, BEAM_Z - 10, P, 3, 0.5), { tone: "mid", inner: L([30, 60].map((z) => k.sideSeam(pil, z, P, 3)).join(""), { tone: "faint" }) }));
  const cx = px(4) + POCKET.w / 2, cy = JIG.y + 13 + POCKET.d / 2;
  // the hung piece and its rope; the rope runs on up inside the beam so it never shows an end
  const ram = [];
  const fz = 6 + LIFT;
  ram.push(S(k.cylinder(cx, cy, 0.7, fz + 22, BEAM_Z - fz - 22 + LIFT + 6, P, 12), { tone: "mid", crease: "none" }));
  ram.push(S(G.disc(0, 1.6, 2.6, G.frameAlong([cx, cy, fz + 20.4], [0, 0, 1]), P), { tone: "mid" }));
  ram.push(figurine(P, [cx, cy], fz, 0.95, { tone: "hi", lit: true }));
  out.push(part("ram", ram));
  const beam = { x: colX - 2, y: JIG.y - 24, w: 22, d: 62, r: 1.2 };
  out.push(S(k.slabOf(beam, BEAM_Z - 4, 14, P, 3, 0.6), { tone: "mid", inner: L([k.sideSeam(beam, BEAM_Z + 3, P, 3)].join(""), { tone: "faint" }) }));
  out.push(D([k.iso([beam.x + 4, beam.y + beam.d - 4, BEAM_Z + 10], P), k.iso([beam.x + beam.w - 4, beam.y + beam.d - 4, BEAM_Z + 10], P)], { size: 0.5 }));
  const PF = G.frameAlong([beam.x + beam.w, cy, BEAM_Z + 3], [1, 0, 0]);
  out.push(S(G.disc(0, 2, 5, PF, P), { tone: "mid", inner: L(G.arcOf(PF, 2, 2, P), { tone: "lo" }) }));
  return { svg: figure({ width: W, height: H, body: out }), meta: { ez: vec(P, [0, 0, 1]), lift: LIFT } };
}
