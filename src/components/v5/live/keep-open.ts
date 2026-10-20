import type { FigureContext, FigureLive } from "../Figure";

/* Fig. 02 · inside the Keep: the picked part steps up to the lit tone. */
export function keepOpenLive({ pick }: { pick: (i: number) => void; names: string[] }) {
  return (ctx: FigureContext): FigureLive<number> => {
    const mods = [0, 1, 2, 3].map((i) => ctx.svg.querySelector<SVGGElement>(`[data-part="mod-${i}"]`));
    const handlers = mods.map((el, i) => {
      const on = () => pick(i);
      el?.addEventListener("pointerenter", on);
      return () => el?.removeEventListener("pointerenter", on);
    });
    return {
      update: (i) => mods.forEach((el, j) => (j === i ? el?.setAttribute("data-pick", "") : el?.removeAttribute("data-pick"))),
      destroy: () => handlers.forEach((off) => off()),
    };
  };
}
