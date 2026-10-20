// Problem 03 · Linear. A trireme on its cradles, its hull marked off into four
// stations, one per market. Each new market takes one more bench of rowers than
// the last (1, 2, 3, 4): the cost climbs in a straight line with headcount. The
// live code seats the rowers, market by market.
import { k, G, S, L, D, part, stoneBase, baseBox, figurine, figure, vec } from "./common.mjs";

const PLATE = { x: -104, y: -40, w: 208, d: 80, r: 7 };
const DECK = 24;
const sx = (i) => -58 + i * 38;
const SEATS = [[[0, 0]], [[0, -5], [0, 5]], [[-5, -5], [-5, 5], [5, 0]], [[-5, -5], [-5, 5], [5, -5], [5, 5]]];
export const DROP = 26;

const HULL = [[-82, -13], [52, -13], [72, -8], [86, 0], [72, 8], [52, 13], [-82, 13], [-90, 8], [-93, 0], [-90, -8]];

export async function build() {
  const W = 560;
  const H = 400;
  const P = k.fitProjection([...baseBox(PLATE, { h: 10 }), [sx(3), 0, DECK + 16 + DROP], [-96, 0, DECK + 18], [96, 0, DECK]], W, H, { pad: 18, azimuth: 34 });
  const out = [stoneBase(P, PLATE, { h: 10, tablet: false })];
  // two stone cradles
  for (const x of [-56, 34]) out.push(S(k.slabOf({ x: x - 6, y: -16, w: 12, d: 32, r: 0.8 }, 0, 10, P, 2, 0.4), { tone: "mid" }));
  // the hull: a keel-shaped plan, a wale, a ram at the bow, a curled sternpost
  out.push(S(k.extrude(HULL, 10, DECK - 10, P, { convex: true, bevel: 0.8 }), { tone: "mid", crease: "lo", inner: L(k.ringSeam(HULL, 16, P), { tone: "faint" }) }));
  out.push(L(k.onTop(HULL.map(([x, y]) => [x * 0.96 + 2, y * 0.78]), DECK, P, true), { tone: "lo" }));
  out.push(S(k.extrude([[84, -2], [98, -1], [100, 0], [98, 1], [84, 2]], 10, 4, P, { convex: true }), { tone: "hi", crease: "lo" }));
  out.push(S(G.solidOf([[0, 2.4], [10, 1.8, 1], [16, 1.2]], G.frameAlong([-90, 0, DECK], [-0.35, 0, 1]), P), { tone: "mid", crease: "none" }));
  out.push(D([k.iso([74, 6, 18], P)], { size: 1.4, tone: "hi" }));
  // the stations: thwarts across the deck between them
  out.push(L([0, 1, 2, 3, 4].map((i) => k.lineOnTop([sx(i) - 19, -10], [sx(i) - 19, 10], DECK, P)).join(""), { tone: "lo" }));
  // the rowers, each with an oar shipped across the wale toward you
  let n = 0;
  for (let i = 0; i < 4; i++) {
    for (const [dx, dy] of SEATS[i]) {
      const x = sx(i) + dx, y = dy;
      const oar = [
        S(k.slabOf({ x: x + 1.6, y: y + 2, w: 1.2, d: 24 - y, r: 0.4 }, DECK + 7, 1.2, P, 2), { tone: "mid", crease: "none" }),
        S(k.slabOf({ x: x + 0.6, y: 22, w: 3.2, d: 8, r: 0.8 }, DECK + 7, 1.2, P, 2), { tone: "mid", crease: "none" }),
      ];
      out.push(part(`w-${n}`, [figurine(P, [x, y], DECK, 0.66, { tone: "hi" }), ...oar], { opacity: "0" }));
      n++;
    }
  }
  return { svg: figure({ width: W, height: H, body: out }), meta: { ez: vec(P, [0, 0, 1]), drop: DROP, counts: [1, 2, 3, 4] } };
}
