// Why Kairma · 03 Compounding. A torch relay: five bronze lampstands in a row.
// Each deployment lights the next one from the last, and the tally keeps
// counting: what one deployment learns carries into the next.
import { k, G, S, L, onFace, faceRect, faceFill, faceLine, stoneBase, baseBox, figure } from "./common.mjs";

const PLATE = { x: -100, y: -64, w: 200, d: 128, r: 8 };
export const STANDS = 5;
const at = (i) => [-64 + i * 32, -8 + Math.sin((i / 4) * Math.PI) * -10];
const height = (i) => 52 + i * 6;

function stand(P, i) {
  const [cx, cy] = at(i);
  const h = height(i);
  const up = (z) => G.frameAlong([cx, cy, z], [0, 0, 1]);
  const out = [];
  // three feet under a round base
  const feet = [0, 1, 2].map((j) => j * (Math.PI * 2 / 3) + Math.PI / 6).map((a) => [cx + Math.cos(a) * 8, cy + Math.sin(a) * 8]);
  for (const [x, y] of feet.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))) out.push(S(G.sphereOf([x, y, 1.6], 1.8, P), { tone: "mid", crease: "none" }));
  out.push(S(G.solidOf([[0, 9.6], [1.6, 9.6], [3.6, 6, 1], [5, 3.2]], up(2), P), { tone: "mid", crease: "lo" }));
  // the shaft, with a knop halfway
  out.push(S(G.solidOf([[0, 1.6], [h - 12, 1.3]], up(7), P), { tone: "mid", crease: "none" }));
  out.push(S(G.solidOf([[0, 1.5], [1.6, 3.2, 1], [3.2, 1.5]], up(7 + (h - 12) * 0.5), P), { tone: "mid", crease: "none" }));
  // the dish at the top and the flame it holds
  const dish = up(h - 5);
  out.push(S(G.solidOf([[0, 1.4], [1.2, 3.4, 1], [3.6, 7.4, 1], [4.6, 8.2]], dish, P), { tone: "hi", crease: "lo" }));
  out.push(L(k.ring(cx, cy, 6.4, h - 0.6, P, 40), { tone: "faint" }));
  // the flame faces the viewer whatever the camera: a teardrop in screen space
  const [fx, fy] = k.iso([cx, cy, h - 1], P);
  const tear = (w, t) => `M${fx} ${fy}C${fx - w} ${fy - t * 0.3} ${fx - w * 0.7} ${fy - t * 0.75} ${fx} ${fy - t}C${fx + w * 0.7} ${fy - t * 0.75} ${fx + w} ${fy - t * 0.3} ${fx} ${fy}Z`;
  const sc = k.screenRise(1, P);
  out.push(`<g data-flame="${i}" opacity="0"><path class="iso-line" data-tone="lit" style="fill:var(--anatomy-lit-top)" d="${tear(5.4 * sc, 17 * sc)}"/><path class="iso-line" data-tone="lit" d="${tear(2.4 * sc, 9 * sc)}"/></g>`);
  return out.join("");
}

export async function build() {
  const W = 620;
  const H = 520;
  const tops = Array.from({ length: STANDS }, (_, i) => [...at(i), height(i) + 14]);
  const P = k.fitProjection([...baseBox(PLATE), ...tops], W, H, { pad: 22, azimuth: 36 });
  const out = [stoneBase(P, PLATE, { h: 12, tablet: false })];
  // a stone sill the stands stand on, stepping up toward the front
  for (let i = 0; i < STANDS; i++) {
    const [cx, cy] = at(i);
    out.push(S(k.slabOf({ x: cx - 12, y: cy - 12, w: 24, d: 24, r: 1.2 }, 0, 2, P, 3, 0.4), { tone: "lo", crease: "none" }));
  }
  const order = Array.from({ length: STANDS }, (_, i) => i).sort((a, b) => k.depthOf([...at(a), 0], P) - k.depthOf([...at(b), 0], P));
  for (const i of order) out.push(stand(P, i));
  // the tally on its own stone at the front right
  const box = { x: -80, y: 30, w: 36, d: 16, r: 1.4 };
  out.push(S(k.slabOf({ x: box.x + 8, y: box.y + 4, w: 20, d: 8, r: 1 }, 0, 10, P, 2), { tone: "lo" }));
  out.push(S(k.slabOf(box, 10, 16, P, 3, 0.5), { tone: "mid" }));
  const CF = k.sideMatrix([box.x, box.y + box.d], 26, P, "left");
  out.push(onFace(CF, [
    faceFill(4, 4, 28, 8, "iso-shade k-void", 1), faceRect(4, 4, 28, 8, "mid", 1),
    faceLine(13.3, 4, 13.3, 12, "lo"), faceLine(22.6, 4, 22.6, 12, "lo"),
    `<text class="iso-face-text" data-tone="hi" data-count x="18" y="10" font-size="6" text-anchor="middle" letter-spacing="3.2">001</text>`,
  ]));
  return { svg: figure({ width: W, height: H, body: out }), meta: { stands: STANDS } };
}
