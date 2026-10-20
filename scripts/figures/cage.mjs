// Fig. 04 · The workforce, drawn as Hephaestus' forge: four bronze automatons
// (one per AI employee) stand in arched niches on wheeled plinths that run on
// bronze rails. Each plinth carries a status lamp and a name plate; the open
// role's automaton rolls out of its niche toward you and its lamp lights. An
// anvil and a hammer lie on the floor in front.
import { k, G, S, L, D, onFace, faceRect, faceCircle, faceLine, stoneBase, baseBox, figurine, figure, vec } from "./common.mjs";

const PLATE = { x: -118, y: -84, w: 236, d: 172, r: 8 };
const CAGE = { x: -84, y: -56, w: 168, d: 100, z0: 6, z1: 136 };
const PITCH = 38;
const PLINTH = { w: 22, d: 26, h: 8 };
export const TRAVEL = 34;
const slotX = (i) => CAGE.x + 27 + i * PITCH;
const BACK_Y = CAGE.y + 6;

function chassisBack(P) {
  const out = [];
  out.push(S(k.slabOf({ x: CAGE.x, y: CAGE.y, w: CAGE.w, d: CAGE.d, r: 2 }, 0, CAGE.z0, P, 3, 0.5), { tone: "mid" }));
  // the back wall with four arched niches, one behind each automaton
  const back = { x: CAGE.x, y: CAGE.y, w: CAGE.w, d: 6, r: 1 };
  const F = k.sideMatrix([CAGE.x, BACK_Y], CAGE.z1, P, "left");
  const H = CAGE.z1 - CAGE.z0;
  const niches = [];
  for (let v = 14; v < H; v += 14) niches.push(faceLine(0, v, CAGE.w, v, "faint"));
  for (let i = 0; i < 4; i++) {
    const u = slotX(i) - CAGE.x;
    const l = u - 15, r = u + 15, t = 12, b = H;
    const arch = `M${l} ${b}L${l} ${t + 15}A15 15 0 0 1 ${r} ${t + 15}L${r} ${b}Z`;
    niches.push(`<path class="iso-fill" d="${arch}"/><path class="iso-shade" data-shade="0" d="${arch}"/><path class="iso-line" data-tone="lo" d="${arch}"/>`);
    niches.push(faceCircle(u, t + 6, 1.4, "mid"));
  }
  out.push(S(k.slabOf(back, CAGE.z0, H, P, 2, 0.4), { tone: "mid", inner: onFace(F, niches) }));
  out.push(S(k.slabOf({ x: CAGE.x, y: CAGE.y, w: 6, d: CAGE.d, r: 1 }, CAGE.z0, H, P, 2, 0.4), { tone: "mid", inner: L([CAGE.z0 + 28, CAGE.z0 + 56, CAGE.z0 + 84].map((z) => k.sideSeam({ x: CAGE.x, y: CAGE.y, w: 6, d: CAGE.d, r: 1 }, z, P, 2)).join(""), { tone: "faint" }) }));
  // two bronze rails per niche, out to the front edge
  for (let i = 0; i < 4; i++) {
    for (const dx of [-7, 7]) {
      const x = slotX(i) + dx;
      out.push(S(k.slabOf({ x: x - 1.2, y: BACK_Y, w: 2.4, d: CAGE.d - 6, r: 0.4 }, CAGE.z0, 1.6, P, 2), { tone: "lo" }));
    }
  }
  return out.join("");
}

function card(P, i) {
  const cx = slotX(i);
  const y = BACK_Y + 6;
  const z0 = CAGE.z0 + 1.6;
  const out = [];
  // wheels on the back axle (behind the plinth), the plinth, wheels on the front axle
  const wheels = (wy) => [-1, 1].map((sx) => S(G.disc(0, 2, 2.6, G.frameAlong([cx + sx * 7 - (sx < 0 ? 1 : -1) * 1, wy, z0 + 2.6], [sx, 0, 0]), P), { tone: "mid" })).join("");
  out.push(wheels(y + 5));
  const plan = { x: cx - PLINTH.w / 2, y, w: PLINTH.w, d: PLINTH.d, r: 1 };
  const F = k.sideMatrix([plan.x, y + PLINTH.d], z0 + 2.6 + PLINTH.h, P, "left");
  out.push(S(k.slabOf(plan, z0 + 2.6, PLINTH.h, P, 2, 0.4), { tone: "mid", inner: onFace(F, [
    faceRect(3, 2, 10, 4.4, "lo", 0.6),
    faceLine(4.6, 3.4, 11.4, 3.4, "faint"), faceLine(4.6, 5, 9.4, 5, "faint"),
    faceCircle(PLINTH.w - 5, 4.2, 2.4, "lo"),
    `<circle class="k-lamp" data-lamp cx="${PLINTH.w - 5}" cy="4.2" r="1.4"/>`,
  ]) }));
  out.push(wheels(y + PLINTH.d - 5));
  // the automaton: a bronze figure on a round foot, a hammer held to its chest
  const zf = z0 + 2.6 + PLINTH.h;
  const s = 3.3;
  out.push(S(k.cylinder(cx, y + 13, 7.4, zf, 2, P, 40, 0.4), { tone: "hi", crease: "lo" }));
  out.push(figurine(P, [cx, y + 13], zf + 2, s, { tone: "hi", arms: true }));
  return `<g data-home="${i}"><g data-part="card-${i}">${out.join("")}</g></g>`;
}

function chassisFront(P) {
  const out = [];
  // two pillars carry the lintel on the open side
  for (const py of [CAGE.y, CAGE.y + CAGE.d - 8]) {
    const pil = { x: CAGE.x + CAGE.w - 8, y: py, w: 8, d: 8, r: 0.8 };
    out.push(S(k.slabOf(pil, CAGE.z0, CAGE.z1 - CAGE.z0 - 8, P, 2, 0.4), { tone: "mid", inner: L([CAGE.z0 + 40, CAGE.z0 + 80].map((z) => k.sideSeam(pil, z, P, 2)).join(""), { tone: "faint" }) }));
  }
  // the beam along the open side; the front stays open so the niches show
  const side = { x: CAGE.x + CAGE.w - 8, y: CAGE.y, w: 8, d: CAGE.d, r: 1 };
  out.push(S(k.slabOf(side, CAGE.z1 - 8, 10, P, 2, 0.4), { tone: "mid" }));
  return out.join("");
}

/** The anvil and the hammer on the floor in front of the forge. */
function anvil(P) {
  const out = [];
  const ax = 66, ay = 68;
  out.push(S(k.slabOf({ x: ax - 10, y: ay - 7, w: 20, d: 14, r: 1 }, 0, 4, P, 2, 0.4), { tone: "mid" }));
  out.push(S(k.slabOf({ x: ax - 5, y: ay - 4, w: 10, d: 8, r: 0.6 }, 4, 9, P, 2, 0.3), { tone: "mid" }));
  const top = [[ax - 13, ay - 5], [ax + 7, ay - 5], [ax + 12, ay - 3], [ax + 19, ay], [ax + 12, ay + 3], [ax + 7, ay + 5], [ax - 13, ay + 5]];
  out.push(S(k.extrude(top, 13, 6, P, { convex: false, bevel: 0.4 }), { tone: "hi", crease: "lo" }));
  // the hammer: a handle along y, a head across its end
  out.push(S(k.slabOf({ x: 26, y: 52, w: 3, d: 26, r: 1.2 }, 0, 2.6, P, 2), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: 21, y: 76, w: 13, d: 6, r: 1 }, 0, 6, P, 2, 0.4), { tone: "hi", crease: "lo" }));
  return out.join("");
}

export async function build() {
  const W = 880;
  const H = 620;
  const P = k.fitProjection([...baseBox(PLATE), ...k.boxCorners({ x: CAGE.x - 3, y: CAGE.y - 3, w: CAGE.w + 6, d: CAGE.d + 6 }, 0, CAGE.z1 + 5)], W, H, { pad: 26, azimuth: 52 });
  const cards = [0, 1, 2, 3].map((i) => card(P, i)).join("");
  const body = [stoneBase(P, PLATE, { h: 12 }), chassisBack(P), cards, chassisFront(P), anvil(P), `<g data-top></g>`];
  return { svg: figure({ width: W, height: H, body }), meta: { ey: vec(P, [0, 1, 0]), travel: TRAVEL } };
}
