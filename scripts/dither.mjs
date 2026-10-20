// Ordered-dither (8×8 Bayer) masks for Kairma's dither language. Each ramp is
// three equal parts: solid, a dithered gradient, empty. Sliding it across an
// element with mask-position dissolves a fill in or out pixel by pixel.
//   node scripts/dither.mjs   → public/dither/ramp-x.svg, ramp-y.svg, ramp-screen.svg
import { writeFileSync, mkdirSync } from "node:fs";

const B = [
  [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21],
];
const ACROSS = 8; // one Bayer tile across the short side; the CSS repeats it

// on(u, v): u runs along the ramp (0 = solid end), v across it
const onIn = (PART) => (u, v) => (u < PART ? true : u >= 2 * PART ? false : B[v % 8][u % 8] / 64 < 1 - (u - PART) / PART);

// PART = cells per third. Pills are wide (64 cells keeps a ~3px pixel on a
// 200px button); nav cells and edges are short (24 cells over 64px).
function svg(horizontal, PART) {
  const on = onIn(PART);
  const runs = [];
  for (let v = 0; v < ACROSS; v++) {
    let start = -1;
    for (let u = 0; u <= 3 * PART; u++) {
      const lit = u < 3 * PART && on(u, v);
      if (lit && start < 0) start = u;
      if (!lit && start >= 0) {
        runs.push(horizontal ? `M${start} ${v}h${u - start}v1h${start - u}z` : `M${v} ${3 * PART - u}h1v${u - start}h-1z`);
        start = -1;
      }
    }
  }
  const [w, h] = horizontal ? [3 * PART, ACROSS] : [ACROSS, 3 * PART];
  // horizontal: solid on the left; vertical: solid at the bottom
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" shape-rendering="crispEdges"><path d="${runs.join("")}"/></svg>`;
}

mkdirSync("public/dither", { recursive: true });
writeFileSync("public/dither/ramp-x.svg", svg(true, 64));
writeFileSync("public/dither/ramp-y.svg", svg(false, 24));
// full-screen ramp for the theme switch: ~5px pixels on a 900px viewport
writeFileSync("public/dither/ramp-screen.svg", svg(false, 160));
// self-check: the solid third is fully on, the empty third fully off
for (const PART of [24, 64]) { const on = onIn(PART); for (let v = 0; v < ACROSS; v++) for (let u = 0; u < PART; u++) if (!on(u, v) || on(u + 2 * PART, v)) throw new Error(`ramp edge wrong at ${u},${v}`); }
console.log("wrote public/dither/ramp-x.svg, ramp-y.svg, ramp-screen.svg");
