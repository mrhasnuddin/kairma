"use client";

import React, { useEffect, useId, useRef } from "react";

/* One accessible dialog for v5 (native <dialog>: focus trap, Escape and the
   top layer come from the platform). Enters 240 ms, exits 160 ms. */
export function Dialog({
  open,
  onClose,
  title,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="k-dialog m-auto w-[min(92vw,40rem)] max-h-[88svh] overflow-y-auto border border-k-line bg-k-paper p-0 text-k-ink backdrop:bg-k-paper/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-k-line px-6 py-4">
        <h2 id={titleId} className="k-label text-k-ink">{title}</h2>
        <button type="button" onClick={onClose} className="-mr-2 min-h-11 px-2 k-label text-k-ink-3 hover:text-k-ink">
          {closeLabel}
        </button>
      </div>
      <div className="px-6 py-6">{children}</div>
    </dialog>
  );
}
