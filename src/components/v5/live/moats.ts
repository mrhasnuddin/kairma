import meta from "./meta.json";
import { makeLoop, type FigureContext, type FigureLive } from "../Figure";

type V = [number, number];
const M = meta as unknown as Record<string, Record<string, unknown>>;
const smooth = (t: number) => t * t * (3 - 2 * t);
const shift = (v: V, d: number) => `translate(${(v[0] * d).toFixed(2)} ${(v[1] * d).toFixed(2)})`;

/* Why Kairma drawings. Each runs a short loop while on screen; under reduced
   motion each shows its end state, still. */
export function moatLive(i: number) {
  return (ctx: FigureContext): FigureLive<undefined> => {
    const { svg, calm } = ctx;

    if (i === 0) {
      // Encoded: the drum turns; each turn is a run and the gauge rises a step.
      const m = M["moat-encoded"] as { frames: number; level: { top: number; bottom: number } } | undefined;
      if (!m) return {};
      const frames = Array.from(svg.querySelectorAll<SVGGElement>("[data-pins]"));
      const rect = svg.querySelector<SVGRectElement>("[data-level]");
      const count = svg.querySelector("[data-count]");
      const span = m.level.bottom - m.level.top;
      let step = 0, t = 0, runs = 1, level = 0.2;
      const setLevel = (v: number) => {
        const y = m.level.bottom - span * v;
        rect?.setAttribute("y", y.toFixed(2));
        rect?.setAttribute("height", (m.level.bottom - y + 4).toFixed(2));
      };
      const show = (n: number) => frames.forEach((f, j) => f.style.setProperty("display", j === n ? "" : "none"));
      if (calm) { setLevel(0.72); if (count) count.textContent = "RUN 07"; return {}; }
      const target = () => Math.min(0.92, 0.2 + (runs - 1) * 0.09);
      const loop = makeLoop(ctx, (dt) => {
        t += dt;
        if (t > 0.07) {
          t = 0;
          step = (step + 1) % (m.frames * 10);
          show(step % m.frames);
          if (step === 0) { runs += 1; if (count) count.textContent = `RUN ${String(runs).padStart(2, "0")}`; }
        }
        level += (target() - level) * (1 - Math.exp(-dt / 0.6));
        setLevel(level);
        return true;
      });
      setLevel(level);
      loop.kick();
      return { destroy: loop.stop };
    }

    if (i === 1) {
      // Productized: the press lowers the hand-made part into the fifth pocket.
      const m = M["moat-jig"] as { ez: V; lift: number } | undefined;
      const ram = svg.querySelector<SVGGElement>('[data-part="ram"]');
      if (!m || !ram) return {};
      if (calm) { ram.setAttribute("transform", shift(m.ez, -m.lift)); return {}; }
      let t = 0;
      const CYCLE = 3.6;
      const loop = makeLoop(ctx, (dt) => {
        t = (t + dt) % CYCLE;
        const p = t < 1 ? smooth(t) : t < 2 ? 1 : t < 3 ? 1 - smooth(t - 2) : 0;
        ram.setAttribute("transform", shift(m.ez, -m.lift * p));
        return true;
      });
      loop.kick();
      return { destroy: loop.stop };
    }

    if (i === 2) {
      // Compounding: each deployment lights the next lampstand from the last;
      // the tally never resets.
      const flames = Array.from(svg.querySelectorAll<SVGGElement>("[data-flame]"));
      const count = svg.querySelector("[data-count]");
      if (!flames.length) return {};
      if (calm) { flames.forEach((f) => f.setAttribute("opacity", "1")); if (count) count.textContent = "012"; return {}; }
      const EACH = 0.9, HOLD = 1.4, FADE = 0.5;
      const cycle = flames.length * EACH + HOLD + FADE;
      let t = 0, n = 0, lit = 0;
      const loop = makeLoop(ctx, (dt) => {
        const next = (t + dt) % cycle;
        if (next < t) lit = 0; // a new relay starts from an unlit row
        t = next;
        const now = Math.min(flames.length, Math.floor(t / EACH) + 1);
        if (now > lit) { n += now - lit; lit = now; if (count) count.textContent = String(n).padStart(3, "0"); }
        const out = t > flames.length * EACH + HOLD ? 1 - (t - flames.length * EACH - HOLD) / FADE : 1;
        flames.forEach((f, j) => {
          const age = t - j * EACH;
          f.setAttribute("opacity", (age < 0 ? 0 : Math.min(1, age / 0.3) * Math.max(0, out)).toFixed(3));
        });
        return true;
      });
      loop.kick();
      return { destroy: loop.stop };
    }

    // Sovereign: Key in, lamp on, bolt thrown; hold; then out again.
    const m = M["moat-lock"] as { ex: V; ey: V; keyTravel: number; throw: number } | undefined;
    const key = svg.querySelector<SVGGElement>('[data-part="key"]');
    const bolt = svg.querySelector<SVGGElement>('[data-part="bolt"]');
    const lamp = svg.querySelector<SVGElement>("[data-lamp]");
    if (!m || !key || !bolt) return {};
    const pose = (keyOut: number, thrown: number) => {
      key.setAttribute("transform", shift(m.ey, m.keyTravel * keyOut));
      bolt.setAttribute("transform", shift(m.ex, m.throw * thrown));
      lamp?.toggleAttribute("data-on", keyOut < 0.05);
    };
    if (calm) { pose(0, 1); return {}; }
    let t = 0;
    const CYCLE = 6;
    const loop = makeLoop(ctx, (dt) => {
      t = (t + dt) % CYCLE;
      // 0-0.7 Key slides in · 0.8-1.3 bolt throws · hold · 4.0-4.5 bolt back · 4.6-5.3 Key out
      const keyOut = t < 0.7 ? 1 - smooth(t / 0.7) : t < 4.6 ? 0 : t < 5.3 ? smooth((t - 4.6) / 0.7) : 1;
      const thrown = t < 0.8 ? 0 : t < 1.3 ? smooth((t - 0.8) / 0.5) : t < 4 ? 1 : t < 4.5 ? 1 - smooth((t - 4) / 0.5) : 0;
      pose(keyOut, thrown);
      return true;
    });
    loop.kick();
    return { destroy: loop.stop };
  };
}
