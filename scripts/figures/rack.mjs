// Fig. 03 · The model rack, drawn as Olympus: four marble tiers of votive
// altars, one per model in OpenRouter's daily top ten, #1 alone at the summit,
// then 2, 3 and 4 below, columns between the bays. The altar for the row you
// hover slides forward and its rosette lights; when the live ranking changes,
// the altars whose model changed nudge out and back.
import { k, G, S, L, D, onFace, faceRect, faceCircle, stoneBase, baseBox, figure, vec } from "./common.mjs";

const PLATE = { x: -126, y: -116, w: 252, d: 210, r: 8 };
const PITCH = 44;          // bay pitch along x
const CART = { w: 36, d: 36, h: 18 };
const STEP_D = 44;         // tier depth along y
const STEP_H = 24;         // tier rise
const H0 = 14;             // bottom tier height
const Y0 = 76;             // bottom tier front edge
export const TRAVEL = 22;  // slide-out distance

const tiers = [0, 1, 2, 3].map((t) => ({
  t,
  n: 4 - t,
  h: H0 + t * STEP_H,
  front: Y0 - t * STEP_D,
  back: t === 3 ? Y0 - 4 * STEP_D : Y0 - (t + 1) * STEP_D,
}));
const rankAt = (t, j) => [7, 4, 2, 1][t] + j; // tier 0 holds 7..10, tier 3 holds #1

function step(P, T) {
  const w = T.n * PITCH + 12;
  const plan = { x: -w / 2, y: T.back, w, d: T.front - T.back, r: 1.5 };
  const out = [S(k.slabOf(plan, 0, T.h, P, 3, 0.6), { tone: "mid", inner: L(k.sideSeam(plan, T.h - 6, P, 3), { tone: "faint" }) })];
  // a groove along the front lip and screws on the riser face
  out.push(L(k.lineOnTop([plan.x, T.front - 3], [plan.x + w, T.front - 3], T.h, P), { tone: "faint" }));
  out.push(D([plan.x + 6, plan.x + w - 6].map((x) => k.iso([x, T.front, T.h - 3], P)), { size: 0.45 }));
  return out.join("");
}

// a marble nosing between bays: a low plinth stone the altars sit beside
function cheek(P, T, x) {
  return S(k.slabOf({ x: x - 2, y: T.front - CART.d - 6, w: 4, d: CART.d + 2, r: 0.5 }, T.h, 3, P, 2), { tone: "mid" });
}

function cartridge(P, T, j) {
  const rank = rankAt(T.t, j);
  const x = -(T.n * PITCH) / 2 + j * PITCH + (PITCH - CART.w) / 2;
  const y = T.front - CART.d - 4;
  const z = T.h;
  const out = [];
  const body = { x: x + 1.5, y: y + 1.5, w: CART.w - 3, d: CART.d - 3, r: 0.6 };
  // base moulding, die, cap moulding, and a bolster along each side of the top
  out.push(S(k.slabOf({ x, y, w: CART.w, d: CART.d, r: 0.8 }, z, 2.4, P, 3, 0.3), { tone: "hi", crease: "lo" }));
  out.push(S(k.slabOf(body, z + 2.4, CART.h - 6, P, 3, 0.3), { tone: "hi", crease: "lo" }));
  out.push(S(k.slabOf({ x, y, w: CART.w, d: CART.d, r: 0.8 }, z + CART.h - 3.6, 2.4, P, 3, 0.3), { tone: "hi", crease: "lo" }));
  for (const bx of [x + 4, x + CART.w - 4]) {
    const F = G.frameAlong([bx, y + 3, z + CART.h - 1.2 + 1.6], [0, 1, 0]);
    out.push(S(G.disc(0, CART.d - 6, 1.6, F, P), { tone: "hi", crease: "none" }));
    out.push(S(G.disc(CART.d - 6, CART.d - 4.8, 2.6, F, P), { tone: "hi", crease: "lo", inner: L(k.ring(0, 0, 0, 0, P, 4).slice(0, 0) + G.arcOf(F, CART.d - 4.8, 1.3, P), { tone: "lo" }) }));
  }
  // the offering bowl on top, between the bolsters
  const bowl = G.frameAlong([x + CART.w / 2, y + CART.d / 2, z + CART.h - 1.2], [0, 0, 1]);
  out.push(S(G.solidOf([[0, 2.4], [0.8, 2.4], [1.2, 4.4, 1], [2.6, 6.6, 1], [3.2, 7.2]], bowl, P), { tone: "hi", crease: "none", inner: L(k.ring(x + CART.w / 2, y + CART.d / 2, 5.4, z + CART.h + 1.8, P, 40), { tone: "faint" }) }));
  const face = y + CART.d - 1.5;
  const F = k.sideMatrix([x + 1.5, face], z + CART.h - 3.6, P, "left");
  out.push(onFace(F, [
    faceRect(3, 1.4, 15, 8.2, "lo", 0.6),
    `<text class="iso-face-text" data-tone="hi" x="10.5" y="7.4" font-size="5.6" text-anchor="middle">${String(rank).padStart(2, "0")}</text>`,
    faceCircle(25.5, 5.4, 3.2, "lo"),
    `<circle class="k-lamp" data-lamp cx="25.5" cy="5.4" r="1.9"/>`,
    `<path class="iso-line" data-tone="faint" d="M3 9.6Q10.5 12.6 18 9.6"/>`,
  ]));
  return `<g data-home="${rank - 1}"><g data-part="cart-${rank - 1}">${out.join("")}</g></g>`;
}

export async function build() {
  const W = 900;
  const H = 620;
  const top = tiers[3];
  const P = k.fitProjection(
    [...baseBox(PLATE), [-(top.n * PITCH) / 2 - 6, top.back, top.h + CART.h], [0, Y0 + TRAVEL, H0 + CART.h]],
    W, H, { pad: 26, azimuth: 46 },
  );
  const body = [stoneBase(P, PLATE, { h: 12 })];
  for (const T of [...tiers].reverse()) {
    body.push(step(P, T));
    // bays: cheeks and cartridges by x (depth grows with x)
    const items = [];
    for (let j = 0; j <= T.n; j++) items.push({ x: -(T.n * PITCH) / 2 + j * PITCH, svg: cheek(P, T, -(T.n * PITCH) / 2 + j * PITCH) });
    for (let j = 0; j < T.n; j++) items.push({ x: -(T.n * PITCH) / 2 + j * PITCH + PITCH / 2, svg: cartridge(P, T, j) });
    items.sort((a, b) => a.x - b.x).forEach((it) => body.push(it.svg));
  }
  body.push(`<g data-top></g>`);
  return { svg: figure({ width: W, height: H, body }), meta: { ey: vec(P, [0, 1, 0]), travel: TRAVEL } };
}
