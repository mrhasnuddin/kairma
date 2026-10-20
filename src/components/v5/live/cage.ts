import meta from "./meta.json";
import { follow, makeLoop, type FigureContext, type FigureLive } from "../Figure";

type V = [number, number];

/* Fig. 04: the open role's automaton rolls out of its niche and its lamp lights;
   it is lifted into a top layer while it is out. */
export function cageLive() {
  return (ctx: FigureContext): FigureLive<{ open: number; label: string }> => {
    const m = (meta as unknown as Record<string, { ey: V; travel: number }>).cage;
    if (!m) return {};
    const { svg, calm } = ctx;
    const top = svg.querySelector<SVGGElement>("[data-top]");
    const cards = [0, 1, 2, 3].map((i) => svg.querySelector<SVGGElement>(`[data-part="card-${i}"]`));
    const homes = [0, 1, 2, 3].map((i) => svg.querySelector<SVGGElement>(`[data-home="${i}"]`));
    const pos = [0, 0, 0, 0];
    let open = -1;

    const loop = makeLoop(ctx, (dt) => {
      let moving = false;
      cards.forEach((el, i) => {
        if (!el) return;
        const want = i === open ? 1 : 0;
        pos[i] = follow(pos[i], want, dt, 0.16, calm);
        if (pos[i] !== want) moving = true;
        const home = homes[i];
        if (pos[i] > 0.001 && top && el.parentNode !== top) top.appendChild(el);
        if (pos[i] <= 0.001 && home && el.parentNode !== home) home.appendChild(el);
        const d = m.travel * pos[i];
        if (d === 0) el.removeAttribute("transform");
        else el.setAttribute("transform", `translate(${(m.ey[0] * d).toFixed(2)} ${(m.ey[1] * d).toFixed(2)})`);
        el.querySelector("[data-lamp]")?.toggleAttribute("data-on", i === open);
        el.toggleAttribute("data-pick", i === open);
      });
      return moving;
    });

    return {
      update: (s) => { open = s.open; ctx.say(s.label); loop.kick(); },
      destroy: () => loop.stop(),
    };
  };
}
