"use client";

import { useEffect, useRef } from "react";

/* Heron's cursor, Kairma's marks: a fine accent trail that collapses when the
   pointer rests, crop-mark corners that close around anything you can press,
   and a seal stamp (印) on click. The system cursor stays visible; this is a
   canvas overlay only. Off for touch, narrow screens and reduced motion. */

const TRAIL = 28;
const FRAME = 30;      // crop frame size, CSS px
const STAMP = 22;      // seal size, CSS px
const STAMP_LIFE = 0.7; // seconds
const PRESSABLE = "a, button, [role='button'], input, select, textarea, summary, label, [data-cursor]";

type Point = { x: number; y: number };

export function Cursor() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ok = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 992px) and (prefers-reduced-motion: no-preference)");
    const cv = canvas.current;
    if (!cv || !ok.matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    let accent = "transparent", paper = "transparent", mono = "monospace"; // read from tokens below
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      accent = cs.getPropertyValue("--k-accent").trim() || accent;
      paper = cs.getPropertyValue("--k-paper").trim() || paper;
      mono = cs.getPropertyValue("--font-plex-mono").trim() || mono; // canvas fonts cannot read var()
    };
    readColors();
    const themeWatch = new MutationObserver(readColors);
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme"] });

    const trail: Point[] = [];
    const target: Point = { x: -100, y: -100 };
    const head: Point = { x: -100, y: -100 };
    let inside = false;
    let over = 0;        // 0..1 crop frame openness, eased
    let overTarget = 0;
    const stamps: { x: number; y: number; age: number }[] = [];
    let frame = 0, last = 0;

    const draw = (dt: number) => {
      head.x += (target.x - head.x) * (1 - Math.exp(-dt / 0.045));
      head.y += (target.y - head.y) * (1 - Math.exp(-dt / 0.045));
      trail.push({ x: head.x, y: head.y });
      if (trail.length > TRAIL) trail.shift();
      const moving = Math.hypot(target.x - head.x, target.y - head.y) > 0.3;
      if (!moving && trail.length > 1) trail.splice(0, Math.ceil(trail.length / 4)); // collapse at rest
      over += (overTarget - over) * (1 - Math.exp(-dt / 0.08));
      stamps.forEach((s) => (s.age += dt));
      while (stamps.length && stamps[0].age > STAMP_LIFE) stamps.shift();

      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;

      // trail: thin, fading toward its tail
      ctx.lineWidth = 1.25;
      for (let i = 1; i < trail.length; i++) {
        ctx.globalAlpha = (i / trail.length) * 0.9;
        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }

      // crop marks closing in around pressable things
      if (inside && over > 0.02) {
        const half = (FRAME / 2) * (1.6 - 0.6 * over);
        const arm = 6;
        ctx.globalAlpha = over;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          const cx = head.x + sx * half, cy = head.y + sy * half;
          ctx.moveTo(cx, cy - sy * arm); ctx.lineTo(cx, cy); ctx.lineTo(cx - sx * arm, cy);
        }
        ctx.stroke();
      }

      // seal stamps: pressed in fast, fade out slower (enter 80ms, exit ~600ms)
      for (const s of stamps) {
        const t = s.age / STAMP_LIFE;
        const press = Math.min(1, s.age / 0.08);
        const scale = 1.25 - 0.25 * (1 - Math.pow(1 - press, 3));
        const half = (STAMP / 2) * scale;
        ctx.globalAlpha = 0.92 * (1 - Math.max(0, (t - 0.25) / 0.75));
        ctx.fillStyle = accent;
        ctx.fillRect(s.x - half, s.y - half, half * 2, half * 2);
        ctx.strokeStyle = paper;
        ctx.lineWidth = 1;
        ctx.strokeRect(s.x - half + 3, s.y - half + 3, half * 2 - 6, half * 2 - 6);
        ctx.fillStyle = paper;
        ctx.font = `500 ${Math.round(11 * scale)}px ${mono}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("K", s.x, s.y + 0.5);
        ctx.strokeStyle = accent;
      }
      ctx.globalAlpha = 1;

      return moving || trail.length > 1 || Math.abs(overTarget - over) > 0.01 || stamps.length > 0;
    };

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      frame = draw(dt) ? requestAnimationFrame(tick) : 0;
      if (!frame) ctx.clearRect(0, 0, w, h);
    };
    const kick = () => { if (!frame) { last = 0; frame = requestAnimationFrame(tick); } };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!inside) { head.x = e.clientX; head.y = e.clientY; trail.length = 0; }
      inside = true;
      target.x = e.clientX; target.y = e.clientY;
      overTarget = (e.target as Element | null)?.closest?.(PRESSABLE) ? 1 : 0;
      kick();
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      stamps.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (stamps.length > 6) stamps.shift();
      kick();
    };
    const leave = () => { inside = false; overTarget = 0; trail.length = 0; kick(); };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(frame);
      themeWatch.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      document.documentElement.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", size);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[90] h-full w-full" />;
}
