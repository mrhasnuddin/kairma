"use client";

import React, { useState } from "react";
import { useCopyV8, useSiteCopy } from "@/lib/language";
import { Dialog } from "./Dialog";
import { Button } from "./ui";

/** "How deployment works": FDE in three short paragraphs. */
export function DeployDialog({ open, onClose, onPilot }: { open: boolean; onClose: () => void; onPilot: () => void }) {
  const c = useCopyV8();
  return (
    <Dialog open={open} onClose={onClose} title={c.deploy.title} closeLabel={c.deploy.close}>
      <p className="k-title mb-6 text-k-ink">{c.deploy.lead}</p>
      <div className="flex flex-col gap-4 k-body text-k-ink-2">
        {c.deploy.paragraphs.map((p) => <p key={p}>{p}</p>)}
      </div>
      <div className="mt-8"><Button onClick={() => { onClose(); onPilot(); }}>{c.nav.pilot}</Button></div>
    </Dialog>
  );
}

const PILOT_INBOX = "pilot@kairma.ai"; // from the original site copy (begin.enterprise.email)

/** Pilot request. No backend yet: submit opens an email with the details. */
export function PilotDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const c = useCopyV8();
  const p = useSiteCopy().pilotModal;
  const [error, setError] = useState("");
  const [mail, setMail] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    if (!email) return setError(c.pilot.required);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError(c.pilot.invalid);
    setError("");
    const lines = (["name", "email", "company", "country", "workflow", "sovereignty"] as const)
      .map((k) => `${p.fields[k].label.replace(" *", "")}: ${String(data.get(k) ?? "").trim() || "-"}`);
    const href = `mailto:${PILOT_INBOX}?subject=${encodeURIComponent(p.title)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setMail(href);
    window.location.href = href;
  };

  const close = () => { onClose(); setMail(""); setError(""); };
  const field = "w-full rounded-k-field border border-k-ink-3 bg-k-surface px-3 py-2.5 k-body text-k-ink outline-none transition-colors duration-(--k-dur-micro) focus:border-k-accent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-k-accent";
  const label = "flex flex-col gap-1.5 k-label text-k-ink-3";

  return (
    <Dialog open={open} onClose={close} title={p.title} closeLabel={c.deploy.close}>
      {mail ? (
        <div className="flex flex-col gap-6">
          <p className="k-title text-k-ink">{p.success.title}</p>
          <p className="k-body text-k-ink-2">{c.pilot.sent}</p>
          <div className="flex flex-wrap gap-3">
            <a href={mail} className="inline-flex min-h-11 items-center rounded-k-control border border-k-ink-3 px-5 k-label text-k-ink hover:border-k-ink">{c.pilot.again}</a>
            <Button variant="ghost" arrow={false} onClick={close}>{p.success.closeCta}</Button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <div>
            <p className="k-title text-k-ink">{p.subtitle}</p>
            <p className="mt-2 k-body text-k-ink-2">{p.monoDesc}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>{p.fields.name.label}<input name="name" autoComplete="name" placeholder={p.fields.name.placeholder} className={field} /></label>
            <label className={label}>
              {p.fields.email.label}
              <input
                name="email" type="email" required autoComplete="email" placeholder={p.fields.email.placeholder}
                aria-invalid={!!error} aria-describedby={error ? "pilot-error" : undefined}
                onChange={() => error && setError("")} className={field}
              />
            </label>
            <label className={label}>{p.fields.company.label}<input name="company" autoComplete="organization" placeholder={p.fields.company.placeholder} className={field} /></label>
            {(["country", "workflow", "sovereignty"] as const).map((k) => (
              <label key={k} className={label}>
                {p.fields[k].label}
                <select name={k} defaultValue="" className={field}>
                  <option value="" disabled>·</option>
                  {p.fields[k].options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            ))}
          </div>
          {error && <p id="pilot-error" role="alert" className="k-body text-k-danger">{error}</p>}
          <div><Button type="submit">{p.submitCta.replace(/\s*→\s*$/, "")}</Button></div>
        </form>
      )}
    </Dialog>
  );
}
