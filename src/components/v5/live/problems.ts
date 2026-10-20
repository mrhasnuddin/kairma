import meta from "./meta.json";
import { makeLoop, type FigureContext, type FigureLive } from "../Figure";

type V = [number, number];
const M = meta as unknown as Record<string, Record<string, unknown>>;
const smooth = (t: number) => t * t * (3 - 2 * t);
const shift = (v: V, d: number) => `translate(${(v[0] * d).toFixed(2)} ${(v[1] * d).toFixed(2)})`;

/* Problem card drawings: small loops that show the pain; still under reduced
   motion. */
export function problemLive(i: number) {
  return (ctx: FigureContext): FigureLive<undefined> => {
    const { svg, calm } = ctx;

    if (i === 0) {
      // Unscripted: drops run from the hole in the jar into the pool, one after another.
      const m = M["problem-pipeline"] as { ez: V; fall: number } | undefined;
      const drops = Array.from(svg.querySelectorAll<SVGGElement>('[data-part^="drop-"]'));
      if (!m || !drops.length) return {};
      if (calm) { drops[0].setAttribute("opacity", "1"); return {}; }
      let t = 0;
      const FALL = 0.75, GAP = 0.9;
      const loop = makeLoop(ctx, (dt) => {
        t += dt;
        drops.forEach((d, j) => {
          const age = (t - j * GAP) % (GAP * drops.length);
          if (age < 0 || age > FALL) { d.setAttribute("opacity", "0"); return; }
          const p = age / FALL;
          d.setAttribute("transform", shift(m.ez, -m.fall * p * p));
          d.setAttribute("opacity", (p > 0.85 ? (1 - p) / 0.15 : Math.min(1, p / 0.1)).toFixed(3));
        });
        return true;
      });
      loop.kick();
      return { destroy: loop.stop };
    }

    if (i === 1) {
      // Disconnected: each capital in turn tries its column, stops short, lifts off.
      const m = M["problem-sockets"] as { ey: V; reach: number } | undefined;
      const plugs = Array.from(svg.querySelectorAll<SVGGElement>('[data-part^="plug-"]'));
      if (!m || !plugs.length) return {};
      if (calm) return {};
      let t = 0;
      const EACH = 1.5;
      const loop = makeLoop(ctx, (dt) => {
        t = (t + dt) % (EACH * plugs.length);
        const active = Math.floor(t / EACH);
        const a = t - active * EACH;
        plugs.forEach((p, j) => {
          const reach = j !== active ? 0 : a < 0.45 ? smooth(a / 0.45) : a < 0.6 ? 1 - 0.15 * Math.sin(((a - 0.45) / 0.15) * Math.PI) : a < 1.05 ? 1 - smooth((a - 0.6) / 0.45) : 0;
          p.setAttribute("transform", shift(m.ey, m.reach * reach));
          p.toggleAttribute("data-pick", j === active && reach > 0.02);
        });
        return true;
      });
      loop.kick();
      return { destroy: loop.stop };
    }

    if (i === 2) {
      // Linear: rowers take their benches market by market, 1 then 2 then 3 then 4.
      const m = M["problem-ruler"] as { ez: V; drop: number } | undefined;
      const ws = Array.from(svg.querySelectorAll<SVGGElement>('[data-part^="w-"]'));
      if (!m || !ws.length) return {};
      if (calm) { ws.forEach((w) => w.setAttribute("opacity", "1")); return {}; }
      let t = 0;
      const EACH = 0.42, HOLD = 2.4, FADE = 0.5;
      const total = ws.length * EACH + HOLD + FADE;
      const loop = makeLoop(ctx, (dt) => {
        t = (t + dt) % total;
        ws.forEach((w, j) => {
          const age = t - j * EACH;
          if (age < 0) { w.setAttribute("opacity", "0"); return; }
          const p = Math.min(1, age / 0.32);
          w.setAttribute("transform", shift(m.ez, m.drop * (1 - p * p)));
          const fade = t > ws.length * EACH + HOLD ? 1 - (t - ws.length * EACH - HOLD) / FADE : 1;
          w.setAttribute("opacity", Math.max(0, Math.min(1, p * 3) * fade).toFixed(3));
        });
        return true;
      });
      loop.kick();
      return { destroy: loop.stop };
    }

    // Tool-bound: the automaton hammers on its own while the sandals lie still.
    const m = M["problem-tools"] as { ez: V; stroke: number } | undefined;
    const ram = svg.querySelector<SVGGElement>('[data-part="ram"]');
    if (!m || !ram) return {};
    if (calm) return {};
    let t = 0;
    const CYCLE = 1.3;
    const loop = makeLoop(ctx, (dt) => {
      t = (t + dt) % CYCLE;
      const p = t < 0.35 ? (t / 0.35) ** 2 : t < 0.85 ? 1 - smooth((t - 0.35) / 0.5) : 0;
      ram.setAttribute("transform", shift(m.ez, -m.stroke * p));
      return true;
    });
    loop.kick();
    return { destroy: loop.stop };
  };
}
