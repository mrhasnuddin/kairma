// Why Kairma · 04 Sovereign. A section of the treasury's bronze door on its
// stone jamb, Athena's shield fixed to its face. When the temple key goes in,
// the shield's boss lights and the bolt throws into the jamb: the data stays
// in the Keep, and you hold what opens it.
import { k, G, S, L, D, part, onFace, faceRect, faceCircle, stoneBase, baseBox, figure, vec } from "./common.mjs";

const PLATE = { x: -96, y: -58, w: 192, d: 120, r: 8 };
const DOOR = { x: -72, y: -6, w: 96, d: 8, z0: 0, z1: 116 };
const FRAME = { x: 40, y: -10, w: 22, d: 18 };
const BOLT = { y: -2, d: 4, z0: 34, z1: 42, rest: -40, throw: 26 };
const KEY = { x: -8, z: 28, len: 24, r: 3.6 };
const SHIELD = { u: 48, v: 46, r: 30 };
export const KEY_TRAVEL = 18;

export async function build() {
  const W = 620;
  const H = 520;
  const faceY = DOOR.y + DOOR.d;
  const P = k.fitProjection([...baseBox(PLATE), [DOOR.x, DOOR.y, DOOR.z1], [FRAME.x + FRAME.w, FRAME.y, DOOR.z1 + 10], [KEY.x, faceY + KEY.len + KEY_TRAVEL, KEY.z]], W, H, { pad: 22, azimuth: 42 });
  const out = [stoneBase(P, PLATE, { h: 12, tablet: false })];
  // the bolt runs inside the door and out through its right edge into the jamb
  out.push(part("bolt", S(k.slabOf({ x: DOOR.x + DOOR.w + BOLT.rest, y: BOLT.y, w: 40, d: BOLT.d, r: 0.8 }, BOLT.z0, BOLT.z1 - BOLT.z0, P, 2, 0.4), { tone: "hi", crease: "lo" })));
  // the door: a bronze slab, studded stiles, the shield on its face, the keyhole under it
  const door = { x: DOOR.x, y: DOOR.y, w: DOOR.w, d: DOOR.d, r: 0.8 };
  const F = k.sideMatrix([DOOR.x, faceY], DOOR.z1, P, "left");
  const H0 = DOOR.z1 - DOOR.z0;
  const face = [faceRect(6, 6, DOOR.w - 12, H0 - 12, "lo", 1)];
  for (let v = 10; v < H0 - 6; v += 9) face.push(faceCircle(3, v, 0.65, "mid"), faceCircle(DOOR.w - 3, v, 0.65, "mid"));
  face.push(faceCircle(SHIELD.u, SHIELD.v, SHIELD.r, "mid"), faceCircle(SHIELD.u, SHIELD.v, SHIELD.r - 3, "lo"), faceCircle(SHIELD.u, SHIELD.v, SHIELD.r - 11, "faint"));
  for (let j = 0; j < 16; j++) {
    const a = (j / 16) * Math.PI * 2;
    face.push(faceCircle(SHIELD.u + Math.cos(a) * (SHIELD.r - 1.5), SHIELD.v + Math.sin(a) * (SHIELD.r - 1.5), 0.6, "mid"));
  }
  face.push(faceCircle(SHIELD.u, SHIELD.v, 7, "lo"), `<circle class="k-lamp" data-lamp cx="${SHIELD.u}" cy="${SHIELD.v}" r="4.6"/>`);
  const ku = KEY.x - DOOR.x, kv = DOOR.z1 - KEY.z;
  face.push(faceCircle(ku, kv, KEY.r + 3.4, "mid"), faceCircle(ku, kv, KEY.r + 1.6, "faint"), `<circle class="iso-shade k-void" cx="${ku}" cy="${kv}" r="${KEY.r - 0.6}"/>`);
  out.push(S(k.slabOf(door, DOOR.z0, H0, P, 2, 0.5), { tone: "hi", crease: "lo", inner: onFace(F, face) }));
  // the stone jamb with its strike plate, on the door's right
  const jamb = { x: FRAME.x, y: FRAME.y, w: FRAME.w, d: FRAME.d, r: 0.8 };
  out.push(S(k.slabOf(jamb, 0, DOOR.z1 + 10, P, 3, 0.5), { tone: "mid", inner: L([28, 56, 84, 112].map((z) => k.sideSeam(jamb, z, P, 3)).join(""), { tone: "faint" }) }));
  const SF = k.sideMatrix([FRAME.x, FRAME.y + FRAME.d], BOLT.z1 + 8, P, "left");
  out.push(onFace(SF, [faceRect(3, 3, FRAME.w - 6, BOLT.z1 - BOLT.z0 + 10, "mid", 1), faceCircle(FRAME.w / 2, 1.5, 0.7, "mid"), faceCircle(FRAME.w / 2, BOLT.z1 - BOLT.z0 + 14.5, 0.7, "mid")]));
  // the temple key: built inserted; the live code pulls it out along +y
  const KF = G.frameAlong([KEY.x, faceY, KEY.z], [0, 1, 0]);
  const r = KEY.r;
  const prof = [[0, r * 0.5], [9, r * 0.5], [9, r * 0.95], [11, r * 0.95], [11, r * 0.55], [14, r * 0.7, 1], [18.5, r, 1], [22, r * 0.72, 1], [KEY.len, r * 0.3]];
  out.push(part("key", [
    S(G.solidOf(prof, KF, P), { tone: "hi", crease: "lo", inner: L([G.arcOf(KF, 10, r * 0.95, P), G.arcOf(KF, 18.5, r, P)].join(""), { tone: "faint" }) }),
    S(G.sphereOf([KEY.x, faceY + KEY.len + 0.6, KEY.z], 1.3, P), { tone: "hi", crease: "none" }),
  ]));
  return { svg: figure({ width: W, height: H, body: out }), meta: { ex: vec(P, [1, 0, 0]), ey: vec(P, [0, 1, 0]), keyTravel: KEY_TRAVEL, throw: BOLT.throw } };
}
