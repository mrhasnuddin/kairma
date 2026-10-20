// Why Kairma · 01 Encoded. Clotho's spindle: wool on a distaff feeds one
// thread down to a spindle standing in a bronze yoke. The whorl turns; each
// turn is one run, and the wound thread (your playbook, encoded) builds up the
// spindle a step each run and never unwinds.
import { k, G, S, L, D, onFace, faceRect, faceFill, stoneBase, baseBox, figure, fine } from "./common.mjs";

const PLATE = { x: -88, y: -46, w: 176, d: 96, r: 8 };
const SP = { c: [6, -4], z0: 14, z1: 112 };   // the spindle shaft
const COP = { z0: 32, z1: 92, r: 12.5 };        // the wound thread
const WHORL = { z: 22, r: 14, t: 4.4 };
const ROD = { c: [-56, -10], z1: 118 };        // the distaff
export const FRAMES = 10;
const DOTS = 12;

function dotsAt(P, F, step) {
  const pitch = (Math.PI * 2) / DOTS;
  return G.dotsOf(F, WHORL.t, WHORL.r - 2, DOTS, P, { phase: (step / FRAMES) * pitch, fade: [0.04, 0.42] });
}

export async function build() {
  const W = 640;
  const H = 520;
  const P = k.fitProjection([...baseBox(PLATE), [SP.c[0] - 30, SP.c[1], SP.z1 + 8], [SP.c[0] + 30, SP.c[1], SP.z1 + 8], [ROD.c[0], ROD.c[1], ROD.z1 + 10]], W, H, { pad: 22, azimuth: 40 });
  const out = [stoneBase(P, PLATE, { h: 12, tablet: false })];
  const [cx, cy] = SP.c;
  const up = (x, y, z) => G.frameAlong([x, y, z], [0, 0, 1]);

  // the distaff: a socket stone, a turned staff, a bundle of wool at the top
  const [dx, dy] = ROD.c;
  out.push(S(k.slabOf({ x: dx - 9, y: dy - 9, w: 18, d: 18, r: 1.2 }, 0, 8, P, 3, 0.5), { tone: "mid" }));
  out.push(S(G.solidOf([[0, 3.6], [2, 3.6], [3, 2]], up(dx, dy, 8), P), { tone: "mid", crease: "none" }));
  out.push(S(G.solidOf([[0, 1.6], [ROD.z1 - 32, 1.3]], up(dx, dy, 11), P), { tone: "mid", crease: "none" }));
  const wool = up(dx, dy, ROD.z1 - 24);
  out.push(S(G.solidOf([[0, 1.4], [3, 5, 1], [9, 8.4, 1], [16, 7.6, 1], [22, 4, 1], [25, 1]], wool, P), { tone: "hi", crease: "none", inner: L([5, 11, 17].map((s) => G.arcOf(wool, s, [6.6, 8.4, 6.6][(s - 5) / 6], P)).join(""), { tone: "faint" }) }));

  // the yoke: a stone base, two bronze posts, a crossbar with the top bearing
  out.push(S(k.slabOf({ x: cx - 30, y: cy - 14, w: 60, d: 28, r: 1.4 }, 0, 10, P, 3, 0.5), { tone: "mid", inner: L(k.sideSeam({ x: cx - 30, y: cy - 14, w: 60, d: 28, r: 1.4 }, 5, P, 3), { tone: "faint" }) }));
  const post = (x) => S(k.slabOf({ x: x - 3, y: cy - 3.5, w: 6, d: 7, r: 0.6 }, 10, SP.z1 - 10, P, 2, 0.3), { tone: "mid", inner: L([40, 76].map((z) => k.sideSeam({ x: x - 3, y: cy - 3.5, w: 6, d: 7, r: 0.6 }, z, P, 2)).join(""), { tone: "faint" }) });
  out.push(post(cx - 24));
  out.push(S(G.solidOf([[0, 4.4], [2.4, 4.4], [4, 2.6]], up(cx, cy, 10), P), { tone: "mid", crease: "none" }));
  out.push(S(G.solidOf([[0, 1.4], [SP.z1 - SP.z0, 1.4]], up(cx, cy, SP.z0), P), { tone: "mid", crease: "none" }));
  // the whorl, its turning marks drawn in frames the live code steps through
  const WF = up(cx, cy, WHORL.z);
  out.push(S(G.solidOf([[0, 3], [1, WHORL.r, 1], [WHORL.t, WHORL.r * 0.8, 1], [WHORL.t + 1, 2.4]], WF, P), { tone: "mid", crease: "lo" }));
  out.push(Array.from({ length: FRAMES }, (_, i) => `<g data-pins="${i}"${i ? ' style="display:none"' : ""}>${D(dotsAt(P, WF, i), { size: 0.7, tone: "hi" })}</g>`).join(""));
  // the cop: the thread wound so far, clipped from the bottom by the live level
  const CF = up(cx, cy, COP.z0);
  const h = COP.z1 - COP.z0;
  const turns = Array.from({ length: 13 }, (_, i) => G.arcOf(CF, 4 + i * 4.3, COP.r - (i > 10 ? (i - 10) * 1.6 : 0), P)).join("");
  const cop = S(G.solidOf([[0, 2.6], [3, COP.r * 0.8, 1], [8, COP.r, 1], [h - 12, COP.r, 1], [h - 3, COP.r * 0.5, 1], [h, 1.8]], CF, P), { tone: "hi", lit: true, crease: "lo", inner: L(turns, { tone: "lit" }) });
  const top = k.iso([cx, cy, COP.z1], P)[1];
  const bottom = k.iso([cx, cy, COP.z0], P)[1];
  out.push(`<clipPath id="encoded-level"><rect data-level x="0" y="${fine(bottom)}" width="${W}" height="${fine(bottom - top) + 12}"/></clipPath>`);
  out.push(`<g clip-path="url(#encoded-level)">${cop}</g>`);
  // the top bearing and crossbar, then the near post
  const bar = { x: cx - 28, y: cy - 4.5, w: 56, d: 9, r: 1 };
  out.push(S(k.slabOf(bar, SP.z1 - 6, 6, P, 2, 0.4), { tone: "mid" }));
  out.push(S(G.solidOf([[0, 3.4], [3, 3.4]], up(cx, cy, SP.z1), P), { tone: "mid", crease: "none" }));
  out.push(post(cx + 24));
  // the thread: from the wool to a guide on the crossbar's end
  const guide = [cx - 28, cy, SP.z1];
  out.push(D([k.iso(guide, P)], { size: 0.9, tone: "mid" }));
  out.push(k.wireSvg(k.iso([dx + 6, dy, ROD.z1 - 14], P), k.iso(guide, P), { tone: "lo", size: 0.7 }));
  // run tally on a stone tablet at the front
  const box = { x: 40, y: 22, w: 34, d: 14, r: 1.4 };
  out.push(S(k.slabOf(box, 0, 12, P, 3, 0.5), { tone: "mid" }));
  const TF = k.sideMatrix([box.x, box.y + box.d], 12, P, "left");
  out.push(onFace(TF, [
    faceFill(4, 3, 26, 7, "iso-shade k-void", 1), faceRect(4, 3, 26, 7, "mid", 1),
    `<text class="iso-face-text" data-tone="hi" data-count x="17" y="8.4" font-size="5.6" text-anchor="middle">RUN 01</text>`,
  ]));
  return {
    svg: figure({ width: W, height: H, body: out }),
    meta: { frames: FRAMES, level: { top: fine(top), bottom: fine(bottom) } },
  };
}
