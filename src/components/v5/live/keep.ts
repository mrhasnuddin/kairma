import meta from "./meta.json";
import { follow, makeLoop, type FigureContext, type FigureLive } from "../Figure";

type V = [number, number];
interface KeepMeta {
  key: { ey: V; travel: number };
  ticket: { ex: V; ez: V; hidden: number; out: number; end: number; tray: number; drop: number };
}

// Seconds for each leg of a ticket's trip: out of the slot, along the
// conveyor, into the tray, then a fade once it has landed.
const EMERGE = 0.9, TRAVEL = 2.4, DROP = 0.45, FADE = 0.3;
const LIFE = EMERGE + TRAVEL + DROP + FADE;
const EVERY = 1.6;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* Fig. 01: while the Key is in, the treasury sends sealed scrolls (tasks) out of its window
   and the runnel carries them to the chest. Hovering pulls the Key: the lamp
   goes out and the scrolls stop. Nothing else ever leaves the treasury. */
export function keepLive({ running, stopped }: { running: (n: number) => string; stopped: string }) {
  return (ctx: FigureContext): FigureLive<undefined> => {
    const m = (meta as unknown as Record<string, KeepMeta>).keep;
    if (!m) return {};
    const { svg, calm } = ctx;
    const keyEl = svg.querySelector<SVGGElement>('[data-part="key"]');
    const lamp = svg.querySelector<SVGElement>("[data-lamp]");
    const tickets = [0, 1, 2].map((i) => svg.querySelector<SVGGElement>(`[data-part="ticket-${i}"]`));
    const host = svg.parentElement?.parentElement ?? svg;

    const T = m.ticket;
    const place = (el: SVGGElement | null, age: number) => {
      if (!el) return;
      let x = T.hidden, z = 0, op = 1;
      if (age < 0 || age >= LIFE) op = 0;
      else if (age < EMERGE) x = lerp(T.hidden, T.out, easeOut(age / EMERGE));
      else if (age < EMERGE + TRAVEL) x = lerp(T.out, T.end, (age - EMERGE) / TRAVEL);
      else if (age < EMERGE + TRAVEL + DROP) {
        const t = (age - EMERGE - TRAVEL) / DROP;
        x = lerp(T.end, T.tray, t);
        z = T.drop * t * t;
      } else {
        x = T.tray; z = T.drop;
        op = 1 - (age - EMERGE - TRAVEL - DROP) / FADE;
      }
      el.setAttribute("transform", `translate(${(T.ex[0] * x + T.ez[0] * z).toFixed(2)} ${(T.ex[1] * x + T.ez[1] * z).toFixed(2)})`);
      el.setAttribute("opacity", op.toFixed(3));
    };

    let out = 0, outTarget = 0, clock = 0, next = 0, count = 0;
    const ages = [-1, -1, -1];

    const keyAt = (v: number) => {
      const d = m.key.travel * v;
      keyEl?.setAttribute("transform", `translate(${(m.key.ey[0] * d).toFixed(2)} ${(m.key.ey[1] * d).toFixed(2)})`);
      if (lamp) {
        if (v < 0.5) lamp.setAttribute("data-on", "");
        else lamp.removeAttribute("data-on");
      }
    };

    if (calm) {
      // One still frame: Key in, lamp on, a scroll halfway along the runnel.
      keyAt(0);
      place(tickets[0], EMERGE + TRAVEL / 2);
      ctx.say(running(0));
      return {};
    }

    const loop = makeLoop(ctx, (dt) => {
      out = follow(out, outTarget, dt, 0.18, false);
      keyAt(out);
      clock += dt;
      if (outTarget === 0 && out < 0.05 && clock >= next) {
        const free = ages.findIndex((a) => a < 0 || a >= LIFE);
        if (free >= 0) ages[free] = 0;
        next = clock + EVERY;
      }
      ages.forEach((a, i) => {
        if (a < 0) return;
        const before = a;
        ages[i] = a + dt;
        if (before < EMERGE + TRAVEL + DROP && ages[i] >= EMERGE + TRAVEL + DROP) count += 1;
        if (ages[i] >= LIFE) ages[i] = -1;
        place(tickets[i], ages[i]);
      });
      ctx.say(outTarget ? stopped : running(count));
      return true;
    });

    const enter = () => { outTarget = 1; loop.kick(); };
    const leave = () => { outTarget = 0; next = clock + 0.4; loop.kick(); };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    keyAt(0);
    loop.kick();
    return {
      destroy: () => {
        loop.stop();
        host.removeEventListener("pointerenter", enter);
        host.removeEventListener("pointerleave", leave);
      },
    };
  };
}
