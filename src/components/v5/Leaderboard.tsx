"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useCopyV8 } from "@/lib/language";
import { slimModel as slim, type ModelRow, type RankedModel } from "@/lib/openrouter";
import { Figure } from "./Figure";
import { rackLive, type RackState } from "./live/rack";

/** Server-rendered top 10, so the first paint shows real rankings. */
export const ModelsContext = createContext<ModelRow[]>([]);

const TOP = 10;

/* Re-sync from /api/openrouter every 5 minutes and on tab focus. On failure
   the last good list stays; with nothing to show, the table says so. */
function useModels(initial: ModelRow[]) {
  const [models, setModels] = useState(initial);
  const [state, setState] = useState<"live" | "syncing" | "down">(initial.length ? "live" : "syncing");
  const [at, setAt] = useState<Date | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/openrouter", { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (!alive) return;
        if (Array.isArray(data?.data) && data.data.length) {
          setModels((data.data as RankedModel[]).slice(0, TOP).map(slim));
          setState("live");
          setAt(new Date());
        } else setState((s) => (s === "live" ? s : "down"));
      } catch {
        if (alive) setState((s) => (s === "live" ? s : "down"));
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    window.addEventListener("focus", load);
    return () => { alive = false; clearInterval(id); window.removeEventListener("focus", load); };
  }, []);

  return { models, state, at };
}

const ctx = (n: number) => (n >= 1e6 ? `${+(n / 1e6).toFixed(1)}M` : `${Math.round(n / 1e3)}K`);
const usd = (perToken: string) => {
  const v = Number(perToken) * 1e6;
  return `$${v >= 10 ? v.toFixed(0) : v.toFixed(2)}`;
};
const score = (n?: number) => (typeof n === "number" ? Math.round(n) : null);

export function Leaderboard() {
  const c = useCopyV8();
  const r = c.platform.router;
  const initial = useContext(ModelsContext);
  const { models, state, at } = useModels(initial);
  const [pick, setPick] = useState(0);
  const rows = models.slice(0, TOP);
  const sel = rows[pick] ?? rows[0];

  const rackState: RackState = { pick, ids: rows.map((m) => m.id).join("|"), count: rows.length, label: sel ? `#${sel.rank} · ${sel.name}` : r.syncing };

  return (
    <div className="flex flex-col gap-6 xl:grid xl:grid-cols-9 xl:items-center xl:gap-8">
      <Figure
        name="rack"
        hint={c.figures.rack.hint}
        readout={sel ? `#${sel.rank} · ${sel.name}` : r.syncing}
        label={c.figures.rack.aria}
        live={rackLive({ pick: setPick })}
        state={rackState}
        className="py-8 xl:col-span-4 xl:py-0"
      />

      <div className="flex min-w-0 flex-col gap-6 xl:col-span-5">
        <p className="k-label flex flex-wrap items-center gap-2 text-k-ink-3" aria-live="polite">
          <span aria-hidden className={`size-1.5 ${state === "live" ? "bg-k-accent" : state === "syncing" ? "animate-pulse bg-k-ink-4" : "bg-k-ink-4"}`} />
          {state === "live" ? r.live : state === "syncing" ? r.syncing : r.fallback}
          {at && <span>· {r.updated} {at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
        </p>

        {rows.length > 0 && (
          <div className="overflow-x-auto border-t border-k-line" data-lenis-prevent>
            <table className="w-full min-w-[34rem] border-collapse text-left xl:min-w-0">
              <caption className="sr-only">{r.caption}</caption>
              <thead>
                <tr className="k-label text-k-ink-3">
                  <th scope="col" className="w-14 py-3 pr-3 font-medium">{r.headers.rank}</th>
                  <th scope="col" className="py-3 pr-3 font-medium">{r.headers.model}</th>
                  <th scope="col" className="py-3 pr-3 text-right font-medium">{r.headers.context}</th>
                  <th scope="col" className="py-3 pr-3 text-right font-medium"><abbr title={r.perMillion} className="no-underline">{r.headers.price}</abbr></th>
                  <th scope="col" className="hidden py-3 pr-3 text-right font-medium sm:table-cell xl:hidden 2xl:table-cell">{r.headers.intel}</th>
                  <th scope="col" className="hidden py-3 text-right font-medium sm:table-cell xl:hidden 2xl:table-cell">{r.headers.code}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m, i) => {
                  const on = i === pick;
                  const intel = score(m.benchmarks?.intelligence_index);
                  const code = score(m.benchmarks?.coding_index);
                  return (
                    <tr
                      key={m.id}
                      onPointerEnter={() => setPick(i)}
                      className={`border-t border-k-line tabular-nums transition-colors duration-(--k-dur-micro) ${on ? "bg-k-surface" : ""}`}
                    >
                      <td className={`py-3 pr-3 k-label ${on ? "text-k-accent-text" : "text-k-ink-3"}`}>{String(m.rank).padStart(2, "0")}</td>
                      <th scope="row" className="py-3 pr-3 font-normal">
                        <button
                          type="button"
                          aria-pressed={on}
                          onClick={() => setPick(i)}
                          onFocus={() => setPick(i)}
                          className="-my-3 block min-h-11 w-full py-3 text-left k-body text-k-ink"
                        >
                          {m.name}
                        </button>
                      </th>
                      <td className="py-3 pr-3 text-right text-sm text-k-ink-2">{ctx(m.context_length)}</td>
                      <td className="py-3 pr-3 text-right text-sm text-k-ink-2">{m.pricing.isFree ? r.free : usd(m.pricing.prompt)}</td>
                      <td className="hidden py-3 pr-3 text-right text-sm text-k-ink-2 sm:table-cell xl:hidden 2xl:table-cell">{intel ?? <span aria-label={r.none}>·</span>}</td>
                      <td className="hidden py-3 text-right text-sm text-k-ink-2 sm:table-cell xl:hidden 2xl:table-cell">{code ?? <span aria-label={r.none}>·</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export type { ModelRow };
