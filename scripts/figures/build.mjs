// Builds every anatomy figure into public/figures/<name>.svg and writes the
// runtime meta the live controllers read (src/components/v5/live/meta.json).
//   node scripts/figures/build.mjs              all figures
//   node scripts/figures/build.mjs keep rack    some figures
//   node scripts/figures/build.mjs --audit      also run the kit's geometry audit
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT = join(ROOT, "public", "figures");
const META = join(ROOT, "src", "components", "v5", "live", "meta.json");

const ALL = [
  "keep", "keep-detail", "keep-open", "rack", "cage",
  "moat-encoded", "moat-jig", "moat-flywheel", "moat-lock",
  "problem-pipeline", "problem-sockets", "problem-ruler", "problem-tools",
];

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const names = args.length ? args : ALL;
const audit = process.argv.includes("--audit");

mkdirSync(OUT, { recursive: true });
mkdirSync(dirname(META), { recursive: true });
const meta = existsSync(META) ? JSON.parse(readFileSync(META, "utf8")) : {};

let failed = false;
for (const name of names) {
  const mod = await import(`./${name}.mjs`);
  const t0 = performance.now();
  const result = await mod.build({ audit });
  writeFileSync(join(OUT, `${name}.svg`), result.svg);
  meta[name] = result.meta ?? {};
  const kb = (Buffer.byteLength(result.svg) / 1024).toFixed(1);
  console.log(`${name.padEnd(18)} ${kb.padStart(6)} KB  ${(performance.now() - t0).toFixed(0)} ms${result.note ? `  ${result.note}` : ""}`);
  if (result.failed) failed = true;
}
const sorted = Object.fromEntries(Object.keys(meta).sort().map((key) => [key, meta[key]]));
writeFileSync(META, JSON.stringify(sorted, null, 1) + "\n");
if (failed) process.exitCode = 1;
