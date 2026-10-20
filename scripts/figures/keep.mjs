// Fig. 01 · The Keep, drawn as a treasury: the small stone house a Greek city
// built at a sanctuary to hold what was its own. The temple key (the Key, the
// sovereign drive you hold) sits in the bronze door; while it is in, the eye in
// the pediment is lit and the treasury sends sealed scrolls (tasks) out of a
// side window along a stone runnel into a bronze chest. Nothing else leaves.
import { k, G, S, L, D, part, onFace, faceRect, faceFill, faceCircle, faceLine, stoneBase, baseBox, column, figure, fine, vec } from "./common.mjs";

export const PLATE = { x: -150, y: -78, w: 352, d: 168, r: 8 };
export const BODY = { x: -120, y: -55, w: 150, d: 110, r: 2 };
export const FLOOR = 10;      // top of the steps, foot of the walls
export const TOP = 150;       // top of the walls
const ENT = { arch: 9, frieze: 12, cornice: 4 };
const EAVE = TOP + ENT.arch + ENT.frieze + ENT.cornice;
const RISE = 24;              // pediment height
export const DOOR = { x: -100, w: 90, z0: FLOOR, z1: 124, t: 2.4 };
export const FACE_Y = BODY.y + BODY.d + DOOR.t; // the door's outer face
export const KEY = { x: -38, z: 66, len: 24, r: 3.6 };
export const SLOT = { y0: 0, y1: 40, z0: 36, z1: 54 };
export const CONV = { x0: 34, x1: 152, y0: 0, y1: 40, z: 40 };
export const SCROLL = { r: 5, len: 30, y: 5 };
export const TRAY = { x: 156, y: -6, w: 34, d: 52, z0: 16, z1: 30 };

const front = BODY.y + BODY.d;
const right = BODY.x + BODY.w;

/** The steps and the cella walls, in coursed ashlar. */
export function cabinet(P) {
  const out = [];
  out.push(S(k.slabOf(k.insetPlan(BODY, -12), 0, 5, P, 4, 0.6), { tone: "lo" }));
  out.push(S(k.slabOf(k.insetPlan(BODY, -6), 5, FLOOR - 5, P, 4, 0.6), { tone: "mid" }));
  const courses = [];
  for (let z = FLOOR + 14; z < TOP - 4; z += 14) courses.push(k.sideSeam(BODY, z, P, 4));
  out.push(S(k.slabOf(BODY, FLOOR, TOP - FLOOR, P, 4, 0.6), { tone: "mid", inner: L(courses.join(""), { tone: "faint" }) }));
  return out.join("");
}

/** Antae at the visible corners, then the entablature and the pediment with its lamp. */
export function capAndPosts(P, { posts = [[right, front], [BODY.x, front], [right, BODY.y]], cap: withCap = true } = {}) {
  const out = [];
  const byD = [...posts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [x, y] of byD) {
    out.push(S(k.slabOf({ x: x - 6.5, y: y - 6.5, w: 13, d: 13, r: 0.8 }, FLOOR, 4, P, 2, 0.4), { tone: "mid" }));
    const plan = { x: x - 5, y: y - 5, w: 10, d: 10, r: 0.8 };
    out.push(S(k.slabOf(plan, FLOOR + 4, TOP - FLOOR - 9, P, 2, 0.4), { tone: "mid", inner: L([40, 96].map((z) => k.sideSeam(plan, z, P, 2)).join(""), { tone: "faint" }) }));
    out.push(S(k.slabOf({ x: x - 6.5, y: y - 6.5, w: 13, d: 13, r: 0.8 }, TOP - 5, 5, P, 2, 0.4), { tone: "mid" }));
  }
  if (!withCap) return out.join("");
  const ent = k.insetPlan(BODY, -3);
  out.push(S(k.slabOf(ent, TOP, ENT.arch, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(ent, TOP + 4.5, P, 3), { tone: "faint" }) }));
  // frieze: triglyphs and plain metopes on both visible faces
  const fz = TOP + ENT.arch;
  const glyphs = (span) => {
    const list = [];
    const n = Math.floor((span - 6) / 15);
    const gap = (span - 6 * (n + 1)) / n;
    for (let i = 0; i <= n; i++) {
      const u = i * (6 + gap);
      list.push(faceRect(u, 0, 6, ENT.frieze, "lo"), faceLine(u + 2, 0, u + 2, ENT.frieze, "faint"), faceLine(u + 4, 0, u + 4, ENT.frieze, "faint"));
    }
    return list;
  };
  const fF = onFace(k.sideMatrix([ent.x, ent.y + ent.d], fz + ENT.frieze, P, "left"), glyphs(ent.w));
  const fR = onFace(k.sideMatrix([ent.x + ent.w, ent.y + ent.d], fz + ENT.frieze, P, "right"), glyphs(ent.d));
  out.push(S(k.slabOf(ent, fz, ENT.frieze, P, 3, 0.4), { tone: "mid", inner: fF + fR }));
  const cor = k.insetPlan(BODY, -7);
  out.push(S(k.slabOf(cor, fz + ENT.frieze, ENT.cornice, P, 3, 0.4), { tone: "mid" }));
  // antefixes along the +x eave
  out.push(D(Array.from({ length: 12 }, (_, i) => k.iso([cor.x + cor.w, cor.y + 6 + i * ((cor.d - 12) / 11), EAVE], P)), { size: 0.6, tone: "mid" }));
  // the pediment: a gable prism along y, roof tiles down both slopes, tympanum and lamp
  const x0 = cor.x, x1 = cor.x + cor.w, xm = (x0 + x1) / 2;
  const F = G.frameOf([0, cor.y, EAVE], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const tiles = [];
  for (let y = cor.y + 5; y < cor.y + cor.d - 2; y += 7) {
    tiles.push(k.segment([xm, y, EAVE + RISE], [x1, y, EAVE], P));
    tiles.push(k.segment([xm, y, EAVE + RISE], [x0, y, EAVE], P));
  }
  const tym = onFace(k.sideMatrix([x0, cor.y + cor.d], EAVE + RISE, P, "left"), [
    `<path class="iso-line" data-tone="lo" d="M7 ${RISE - 2.6}L${xm - x0} 4.2L${x1 - x0 - 7} ${RISE - 2.6}Z"/>`,
    faceCircle(xm - x0, RISE * 0.62, 5.4, "lo"),
    `<circle class="k-lamp" data-lamp cx="${xm - x0}" cy="${RISE * 0.62}" r="3.4"/>`,
  ]);
  out.push(S(G.prismOf(F, [[x0, 0], [x1, 0], [xm, RISE]], 0, cor.d, P), { tone: "mid", inner: L(tiles.join(""), { tone: "faint" }) + tym }));
  // acroteria: a palmette block at the apex and at the two front corners
  for (const [x, z] of [[x0 + 3, EAVE], [x1 - 3, EAVE], [xm, EAVE + RISE - 1]]) {
    out.push(S(k.slabOf({ x: x - 3, y: cor.y + cor.d - 5, w: 6, d: 5, r: 0.6 }, z, 4, P, 2), { tone: "mid" }));
    out.push(S(G.disc(0, 1.2, 3, G.frameAlong([x, cor.y + cor.d - 1.2, z + 6.4], [0, 1, 0]), P), { tone: "mid" }));
  }
  return out.join("");
}

/** The doorway: frame, lintel with its inscription, bronze double door with studs, the keyhole. */
export function door(P) {
  const out = [];
  const H = DOOR.z1 - DOOR.z0;
  // jambs and lintel stand proud of the wall
  for (const x of [DOOR.x - 6, DOOR.x + DOOR.w]) out.push(S(k.slabOf({ x, y: front, w: 6, d: 3, r: 0.4 }, DOOR.z0, H + 2, P, 2), { tone: "mid" }));
  const lintel = { x: DOOR.x - 9, y: front, w: DOOR.w + 18, d: 4, r: 0.6 };
  const LF = k.sideMatrix([lintel.x, front + 4], DOOR.z1 + 12, P, "left");
  out.push(S(k.slabOf(lintel, DOOR.z1 + 2, 10, P, 2, 0.3), { tone: "mid", inner: onFace(LF, [
    faceRect(18, 2.4, lintel.w - 36, 5.2, "faint"),
    `<text class="iso-face-text" data-tone="mid" x="${lintel.w / 2}" y="6.6" font-size="4.6" text-anchor="middle" letter-spacing="2">KEEP</text>`,
    faceCircle(9, 5, 2.4, "lo"), faceCircle(9, 5, 0.7, "mid"), faceCircle(lintel.w - 9, 5, 2.4, "lo"), faceCircle(lintel.w - 9, 5, 0.7, "mid"),
  ]) }));
  // the leaves: one bronze slab, split down the middle, three panels a leaf, studs on the stiles
  const plan = { x: DOOR.x, y: front, w: DOOR.w, d: DOOR.t, r: 0.5 };
  const leaf = DOOR.w / 2;
  const F = k.sideMatrix([DOOR.x, FACE_Y], DOOR.z1, P, "left");
  const details = [faceLine(leaf, 0, leaf, H, "lo")];
  for (const u0 of [0, leaf]) {
    [[8, 30], [44, 30], [80, 26]].forEach(([v, h]) => details.push(faceRect(u0 + 7, v, leaf - 14, h, "lo", 0.8)));
    for (let v = 6; v < H - 2; v += 9) details.push(faceCircle(u0 + 3.4, v, 0.65, "mid"), faceCircle(u0 + leaf - 3.4, v, 0.65, "mid"));
    details.push(faceCircle(u0 + leaf / 2, 66, 3.2, "lo"), faceCircle(u0 + leaf / 2, 66, 1.1, "mid"));
  }
  // keyhole escutcheon on the right leaf
  const ku = KEY.x - DOOR.x, kv = DOOR.z1 - KEY.z;
  details.push(faceCircle(ku, kv, KEY.r + 3.4, "mid"), faceCircle(ku, kv, KEY.r + 1.6, "faint"));
  details.push(`<circle class="iso-shade k-void" cx="${ku}" cy="${kv}" r="${KEY.r - 0.6}"/>`);
  out.push(S(k.slabOf(plan, DOOR.z0, H, P, 2, 0.3), { tone: "hi", crease: "lo", inner: onFace(F, details) }));
  // threshold
  out.push(S(k.slabOf({ x: DOOR.x - 8, y: front, w: DOOR.w + 16, d: 7, r: 0.6 }, FLOOR - 2, 2, P, 2), { tone: "mid", crease: "none" }));
  return out.join("");
}

/** The temple key: a turned bronze rod with a collar and a pear-shaped grip, along +y. */
export function key(P, { lit = false } = {}) {
  const F = G.frameAlong([KEY.x, FACE_Y, KEY.z], [0, 1, 0]);
  const r = KEY.r;
  const prof = [[0, r * 0.5], [9, r * 0.5], [9, r * 0.95], [11, r * 0.95], [11, r * 0.55], [14, r * 0.7, 1], [18.5, r, 1], [22, r * 0.72, 1], [KEY.len, r * 0.3]];
  return [
    S(G.solidOf(prof, F, P), { tone: "hi", lit, crease: "lo", inner: L([G.arcOf(F, 10, r * 0.95, P), G.arcOf(F, 18.5, r, P)].join(""), { tone: "faint" }) }),
    S(G.sphereOf([KEY.x, FACE_Y + KEY.len + 0.6, KEY.z], 1.3, P), { tone: "hi", lit, crease: "none" }),
  ].join("");
}

/** The side window the scrolls leave by: sill, frame, lintel, a dark slit. */
export function slot(P) {
  const x = right;
  const out = [];
  out.push(S(k.slabOf({ x, y: SLOT.y0 - 4, w: 3.4, d: SLOT.y1 - SLOT.y0 + 8, r: 0.4 }, SLOT.z0 - 4, 4, P, 2), { tone: "mid" }));
  out.push(S(k.slabOf({ x, y: SLOT.y0, w: 2.4, d: SLOT.y1 - SLOT.y0, r: 0.4 }, SLOT.z0, SLOT.z1 - SLOT.z0, P, 2, 0.3), { tone: "mid" }));
  const F = k.sideMatrix([x + 2.4, SLOT.y1], SLOT.z1, P, "right");
  const w = SLOT.y1 - SLOT.y0;
  out.push(onFace(F, [
    faceFill(4, 2, w - 8, SLOT.z1 - SLOT.z0 - 4, "iso-shade k-void", 0.6),
    faceRect(4, 2, w - 8, SLOT.z1 - SLOT.z0 - 4, "mid", 0.6),
  ]));
  out.push(S(k.slabOf({ x, y: SLOT.y0 - 4, w: 3.4, d: SLOT.y1 - SLOT.y0 + 8, r: 0.4 }, SLOT.z1, 5, P, 2, 0.3), { tone: "mid" }));
  return out.join("");
}

/** A sealed scroll lying across the runnel, axis along y, rods at both ends. */
export function scrollSvg(P, [cx, y, cz], { lit = true, r = SCROLL.r, len = SCROLL.len } = {}) {
  const F = G.frameAlong([cx, y, cz], [0, 1, 0]);
  const body = G.solidOf([[-1.8, 1.1], [0, 1.1], [0, r], [len, r], [len, 1.1], [len + 1.8, 1.1]], F, P);
  const edges = [G.arcOf(F, 1.6, r, P), G.arcOf(F, len - 1.6, r, P)].join("");
  return [
    S(body, { tone: "hi", lit, crease: "lo", inner: L(edges, { tone: "faint" }) + L(G.arcOf(F, len / 2, r, P), { tone: "lo" }) }),
    D([k.iso([cx - r * 0.35, y + len / 2, cz + r * 0.94], P)], { size: 1.4, tone: "mid" }),
  ].join("");
}

const X_OUT = right + 2.4; // the window's outer face

function ticketSvg(P, i) {
  return part(`ticket-${i}`, scrollSvg(P, [X_OUT + SCROLL.r, SCROLL.y, CONV.z + SCROLL.r]), { opacity: "0" });
}

/** The runnel: a stone channel on two piers, with the scrolls riding it. */
export function conveyor(P) {
  const out = [];
  const pier = (x, y, d) => [
    S(k.slabOf({ x: x - 1.5, y: y - 1.5, w: 13, d: d + 3, r: 0.6 }, 0, 3, P, 2), { tone: "lo" }),
    S(k.slabOf({ x, y, w: 10, d, r: 0.6 }, 3, CONV.z - 13, P, 2, 0.3), { tone: "mid", inner: L(k.sideSeam({ x, y, w: 10, d, r: 0.6 }, 18, P, 2), { tone: "faint" }) }),
    S(k.slabOf({ x: x - 1.5, y: y - 1.5, w: 13, d: d + 3, r: 0.6 }, CONV.z - 10, 4, P, 2, 0.3), { tone: "mid" }),
  ].join("");
  const x1 = CONV.x1 - 30;
  out.push(pier(CONV.x0 + 10, CONV.y0 - 3, CONV.y1 - CONV.y0 + 6), pier(x1, CONV.y0 - 3, CONV.y1 - CONV.y0 + 6));
  const bed = { x: CONV.x0, y: CONV.y0 - 3, w: CONV.x1 - CONV.x0, d: CONV.y1 - CONV.y0 + 6, r: 0.6 };
  out.push(S(k.slabOf(bed, CONV.z - 6, 6, P, 2, 0.3), { tone: "mid" }));
  out.push(L(Array.from({ length: 3 }, (_, i) => k.lineOnTop([CONV.x0 + 30 + i * 30, CONV.y0], [CONV.x0 + 30 + i * 30, CONV.y1], CONV.z, P)).join(""), { tone: "faint" }));
  out.push(S(k.slabOf({ x: CONV.x0, y: CONV.y0 - 3, w: CONV.x1 - CONV.x0, d: 3, r: 0.5 }, CONV.z, 3, P, 2), { tone: "mid" }));
  // scrolls inside a clip, so they come out of the window face
  const box = [];
  for (const x of [X_OUT, 240]) for (const y of [-60, 60]) for (const z of [-20, 120]) box.push(k.iso([x, y, z], P));
  out.push(`<clipPath id="keep-slot-clip"><path d="${k.pathOf(G.hullOf(box), true)}"/></clipPath>`);
  out.push(`<g clip-path="url(#keep-slot-clip)">${[0, 1, 2].map((i) => ticketSvg(P, i)).join("")}</g>`);
  out.push(S(k.slabOf({ x: CONV.x0, y: CONV.y1, w: CONV.x1 - CONV.x0, d: 3, r: 0.5 }, CONV.z, 3, P, 2), { tone: "mid" }));
  return out.join("");
}

/** The bronze chest at the runnel's end: feet, floor and back walls, then the front walls. */
export function tray(P, inside = "") {
  const T = TRAY;
  const out = [];
  for (const [x, y] of [[T.x + 4, T.y + 4], [T.x + T.w - 4, T.y + 4], [T.x + 4, T.y + T.d - 4], [T.x + T.w - 4, T.y + T.d - 4]].sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P)))
    out.push(S(G.solidOf([[0, 3], [3, 2.2, 1], [T.z0 - 4, 2]], G.frameAlong([x, y, 0], [0, 0, 1]), P), { tone: "mid", crease: "none" }));
  out.push(S(k.slabOf({ x: T.x, y: T.y, w: T.w, d: T.d, r: 0.8 }, T.z0 - 4, 4, P, 3), { tone: "mid" }));
  out.push(S(k.slabOf({ x: T.x, y: T.y, w: T.w, d: 2.4, r: 0.6 }, T.z0, T.z1 - T.z0, P, 2), { tone: "hi", crease: "lo" }));
  out.push(S(k.slabOf({ x: T.x, y: T.y, w: 2.4, d: T.d, r: 0.6 }, T.z0, T.z1 - T.z0, P, 2), { tone: "hi", crease: "lo" }));
  out.push(inside);
  const wall = { x: T.x, y: T.y + T.d - 2.4, w: T.w, d: 2.4, r: 0.6 };
  const WF = k.sideMatrix([T.x, T.y + T.d], T.z1, P, "left");
  const front = [
    S(k.slabOf({ x: T.x + T.w - 2.4, y: T.y, w: 2.4, d: T.d, r: 0.6 }, T.z0, T.z1 - T.z0, P, 2), { tone: "hi", crease: "lo", inner: L(k.sideSeam({ x: T.x + T.w - 2.4, y: T.y, w: 2.4, d: T.d, r: 0.6 }, T.z1 - 3, P, 2), { tone: "lo" }) }),
    S(k.slabOf(wall, T.z0, T.z1 - T.z0, P, 2), { tone: "hi", crease: "lo", inner: L(k.sideSeam(wall, T.z1 - 3, P, 2), { tone: "lo" }) + onFace(WF, [5, 12, 19, 26].map((u) => faceCircle(u + 1.5, 8, 1.4, "lo"))) }),
  ];
  return { back: out.join(""), front: front.join("") };
}

export async function build() {
  const W = 960;
  const H = 600;
  const P = k.fitProjection(
    [...baseBox(PLATE), ...k.boxCorners(k.insetPlan(BODY, -7), 0, EAVE + RISE + 8)],
    W, H, { pad: 26, azimuth: 48 },
  );
  const resting = [0, 1].map((i) => scrollSvg(P, [TRAY.x + 10 + i * 13, TRAY.y + 10, TRAY.z0 + SCROLL.r], { lit: false })).join("");
  const trayParts = tray(P, resting);
  const body = [
    stoneBase(P, PLATE, { h: 12 }),
    cabinet(P),
    capAndPosts(P),
    door(P),
    part("key", key(P)),
    slot(P),
    trayParts.back,
    conveyor(P),
    trayParts.front,
  ];
  const d = 2 * SCROLL.r;
  const ticketPath = {
    ex: vec(P, [1, 0, 0]), ez: vec(P, [0, 0, 1]),
    // world offsets along x from the window face: hidden inside, just out, at the runnel's end, over the chest
    hidden: -d - 2, out: 0, end: fine(CONV.x1 - X_OUT - d), tray: fine(TRAY.x + TRAY.w / 2 - X_OUT - SCROLL.r),
    drop: TRAY.z0 - CONV.z,
  };
  return {
    svg: figure({ width: W, height: H, body }),
    meta: { key: { ey: vec(P, [0, 1, 0]), travel: 16 }, ticket: ticketPath },
  };
}
