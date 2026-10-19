"use client";

import React, { useEffect, useRef, useState } from "react";
import { Claude, DeepSeek, Gemini, Kimi, OpenAI, Qwen } from "@lobehub/icons";
import { useCopyV7, useLanguage } from "@/lib/language";
import { makeT } from "@/data/ui-strings";
import { getFallbackModels } from "@/data/fallback-models";
import NeuralPipelineHUD, { type ModelData } from "@/components/ui/NeuralPipelineHUD";
import { Label } from "./ui";
import { MOTION_OK, gsap, revealLines, useGSAP } from "./motion";

const PROVIDERS = [
  { name: "Claude", Icon: Claude },
  { name: "GPT", Icon: OpenAI },
  { name: "Gemini", Icon: Gemini },
  { name: "DeepSeek", Icon: DeepSeek },
  { name: "Qwen", Icon: Qwen },
  { name: "Kimi", Icon: Kimi },
];

/* Live rankings from /api/openrouter, re-synced every 5 minutes and on tab
   focus. Falls back to the static list when the API is unreachable. */
function useModels() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [syncedAt, setSyncedAt] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/openrouter", { cache: "no-store" });
        const data = res.ok ? await res.json() : null;
        if (alive && Array.isArray(data?.data) && data.data.length) {
          setModels(data.data);
          setSyncedAt(new Date());
        }
      } catch {
        // keep the last good data; the fallback covers a cold failure
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    window.addEventListener("focus", load);
    return () => { alive = false; clearInterval(id); window.removeEventListener("focus", load); };
  }, []);

  return { models, syncedAt, loading };
}

export function Models() {
  const c = useCopyV7();
  const { language } = useLanguage();
  const t = makeT(language);
  const { models, syncedAt, loading } = useModels();
  const live = models.length > 0;
  const root = useRef<HTMLElement>(null);
  const h2 = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => { gsap.matchMedia().add(MOTION_OK, () => revealLines(h2.current)); },
    { scope: root, dependencies: [c.models.h], revertOnUpdate: true },
  );

  return (
    <section id="models" ref={root} className="border-b border-k-line">
      <div className="grid grid-cols-4 gap-x-(--k-gutter) gap-y-6 px-(--k-gutter) py-16 md:grid-cols-12 md:py-24">
        <Label index="05" className="col-span-full">{c.models.label}</Label>
        <h2 ref={h2} className="k-display-2 col-span-full text-k-ink md:col-span-7">{c.models.h}</h2>
        <div className="col-span-full flex flex-col gap-4 self-end md:col-span-4 md:col-start-9">
          <p className="k-body text-k-ink-2">{c.models.body}</p>
          <p className="k-label flex flex-wrap items-center gap-2 text-k-ink-3">
            <span className={`size-1.5 ${loading ? "animate-pulse bg-k-ink-4" : live ? "bg-k-accent" : "bg-k-ink-4"}`} />
            {loading ? t("syncing") : live ? t("openrouter_live") : c.models.source}
            {live && syncedAt && <span>{syncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
          </p>
        </div>
      </div>

      {/* provider strip: Heron's logo row, here the models Kairma routes across */}
      <ul className="grid grid-cols-3 border-t border-k-line md:grid-cols-6">
        {PROVIDERS.map(({ name, Icon }, i) => (
          <li key={name} className={`flex items-center justify-center gap-3 border-b border-k-line py-6 text-k-ink-2 md:border-b-0 ${i < PROVIDERS.length - 1 ? "border-r" : ""} [&:nth-child(3)]:border-r-0 md:[&:nth-child(3)]:border-r`}>
            <Icon size={22} />
            <span className="k-label">{name}</span>
          </li>
        ))}
      </ul>

      <div className="border-t border-k-line p-(--k-gutter)">
        {loading ? (
          <p className="k-label py-24 text-center text-k-ink-3">{t("fetching_rankings")}</p>
        ) : (
          <NeuralPipelineHUD models={live ? models : (getFallbackModels(language) as ModelData[])} onSelectModelForModal={() => {}} language={language} t={t} />
        )}
        <p className="k-label mt-6 text-k-ink-4">{c.models.source}</p>
      </div>
    </section>
  );
}
