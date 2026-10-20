import meta from "./meta.json";
import { follow, makeLoop, type FigureContext, type FigureLive } from "../Figure";

export interface RackState { pick: number; ids: string; count: number; label: string }
type V = [number, number];

/* Fig. 03: the picked altar slides out and its rosette lights; when the live ranking
   changes, altars whose model changed nudge out and back, staggered. A
   moving altar is lifted into a top layer so nothing paints over it. */
export function rackLive({ pick }: { pick: (i: number) => void }) {
  return (ctx: FigureContext): FigureLive<RackState> => {
    const m = (meta as unknown as Record<string, { ey: V; travel: number }>).rack;
    if (!m) return {};
    const { svg, calm } = ctx;
    const top = svg.querySelector<SVGGElement>("[data-top]");
    const carts = Array.from({ length: 10 }, (_, i) => svg.querySelector<SVGGElement>(`[data-part="cart-${i}"]`));
    const homes = Array.from({ length: 10 }, (_, i) => svg.querySelector<SVGGElement>(`[data-home="${i}"]`));
    const pos = new Array(10).fill(0);
    const target = new Array(10).fill(0);
    const nudgeAt = new Array(10).fill(-1);
    let picked = -1, clock = 0, lastIds = "";

    const lift = (i: number, up: boolean) => {
      const el = carts[i];
      if (!el || !top || !homes[i]) return;
      if (up && el.parentNode !== top) top.appendChild(el);
      if (!up && el.parentNode !== homes[i]) homes[i]!.appendChild(el);
    };
    const draw = (i: number) => {
      const d = m.travel * pos[i];
      const el = carts[i];
      if (!el) return;
      if (d === 0) el.removeAttribute("transform");
      else el.setAttribute("transform", `translate(${(m.ey[0] * d).toFixed(2)} ${(m.ey[1] * d).toFixed(2)})`);
      el.querySelector("[data-lamp]")?.toggleAttribute("data-on", i === picked);
      if (i === picked) el.setAttribute("data-pick", "");
      else el.removeAttribute("data-pick");
    };

    const loop = makeLoop(ctx, (dt) => {
      clock += dt;
      let moving = false;
      for (let i = 0; i < 10; i++) {
        let want = i === picked ? 1 : 0;
        if (nudgeAt[i] >= 0) {
          const age = clock - nudgeAt[i];
          if (age >= 0 && age < 0.5) want = Math.max(want, 0.45);
          if (age >= 0.5) nudgeAt[i] = -1;
          moving = true;
        }
        target[i] = want;
        pos[i] = follow(pos[i], target[i], dt, 0.14, calm);
        if (pos[i] > 0.001) lift(i, true);
        else if (i !== picked) lift(i, false);
        if (pos[i] !== target[i]) moving = true;
        draw(i);
      }
      return moving;
    });

    const offs = carts.map((el, i) => {
      const on = () => pick(i);
      el?.addEventListener("pointerenter", on);
      return () => el?.removeEventListener("pointerenter", on);
    });

    return {
      update: (s) => {
        picked = s.pick;
        ctx.say(s.label);
        const ids = s.ids.split("|");
        if (lastIds && !calm) {
          const prev = lastIds.split("|");
          let n = 0;
          ids.forEach((id, i) => { if (prev[i] && prev[i] !== id && i < 10) nudgeAt[i] = clock + 0.06 * n++; });
        }
        lastIds = s.ids;
        loop.kick();
      },
      destroy: () => { loop.stop(); offs.forEach((off) => off()); },
    };
  };
}
