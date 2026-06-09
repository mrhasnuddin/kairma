"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

export const SealedBoxVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    // Handle high DPI screens
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Render loop
    const render = () => {
      const w = canvas.width / window.devicePixelRatio;
      const h = canvas.height / window.devicePixelRatio;

      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2 - 15;

      // Box dimensions
      const boxW = 100;
      const boxH = 120;
      const boxD = 40; // Isometric depth offset

      // Theme Colors
      const isDark = theme === "matrix-dark";
      const accentColor = isDark ? "#1FAA68" : "#C8442E";
      const accentGlow = isDark ? "rgba(31, 170, 104, 0.45)" : "rgba(200, 68, 46, 0.45)";
      const accentDim = isDark ? "rgba(31, 170, 104, 0.15)" : "rgba(200, 68, 46, 0.15)";
      const chromeColor = isDark ? "#A0A0A8" : "#55524E";

      // 1. Draw Abstract Background Radar Circles
      ctx.strokeStyle = isDark ? "rgba(31, 170, 104, 0.08)" : "rgba(200, 68, 46, 0.08)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 120, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy + 20, 85, 0, Math.PI * 2);
      ctx.stroke();

      // Horizontal reference axis
      ctx.setLineDash([2, 8]);
      ctx.strokeStyle = isDark ? "rgba(192, 192, 200, 0.15)" : "rgba(31, 26, 23, 0.15)";
      ctx.beginPath();
      ctx.moveTo(cx - 140, cy + 20);
      ctx.lineTo(cx + 140, cy + 20);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 2. Draw Bottom Glowing Ellipse (Base Glow)
      const glowGrad = ctx.createRadialGradient(cx, cy + boxH / 2 + 10, 5, cx, cy + boxH / 2 + 15, 60);
      glowGrad.addColorStop(0, accentGlow);
      glowGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy + boxH / 2 + 12, 70, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Define 3D Box Vertices
      // Top face vertices
      const t0 = { x: cx, y: cy - boxH / 2 - boxD / 2 };        // Back center
      const t1 = { x: cx + boxW / 2, y: cy - boxH / 2 };        // Right corner
      const t2 = { x: cx, y: cy - boxH / 2 + boxD / 2 };        // Front center
      const t3 = { x: cx - boxW / 2, y: cy - boxH / 2 };        // Left corner

      // Bottom face vertices
      const b0 = { x: t0.x, y: t0.y + boxH };
      const b1 = { x: t1.x, y: t1.y + boxH };
      const b2 = { x: t2.x, y: t2.y + boxH };
      const b3 = { x: t3.x, y: t3.y + boxH };

      // 4. Draw faces of the monolith (Back-to-front rendering)

      // A. LEFT FACE (Shaded & Chiseled)
      const leftGrad = ctx.createLinearGradient(t3.x, t3.y, t2.x, t2.y);
      leftGrad.addColorStop(0, isDark ? "#0A0D0A" : "#D4C5AF");
      leftGrad.addColorStop(1, isDark ? "#121812" : "#E2D3BC");
      ctx.fillStyle = leftGrad;
      ctx.beginPath();
      ctx.moveTo(t3.x, t3.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.lineTo(b3.x, b3.y);
      ctx.closePath();
      ctx.fill();

      // Draw Left Face ridges (cooling slats)
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.07)";
      ctx.lineWidth = 1;
      const numSlats = 7;
      for (let i = 1; i < numSlats; i++) {
        const t = i / numSlats;
        // Interpolate top and bottom points
        const tx = t3.x + (t2.x - t3.x) * t;
        const ty = t3.y + (t2.y - t3.y) * t;
        const bx = t3.x + (t2.x - t3.x) * t;
        const by = t3.y + (t2.y - t3.y) * t + boxH;

        // Ridge shadow line
        ctx.strokeStyle = isDark ? "#050705" : "#B2A694";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Ridge highlight line
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.4)";
        ctx.beginPath();
        ctx.moveTo(tx + 1, ty);
        ctx.lineTo(bx + 1, by);
        ctx.stroke();
      }

      // B. RIGHT FACE (Motivated lighting side)
      const rightGrad = ctx.createLinearGradient(t2.x, t2.y, t1.x, t1.y);
      rightGrad.addColorStop(0, isDark ? "#182018" : "#E8D9C2");
      rightGrad.addColorStop(1, isDark ? "#0D110D" : "#CDBFAF");
      ctx.fillStyle = rightGrad;
      ctx.beginPath();
      ctx.moveTo(t2.x, t2.y);
      ctx.lineTo(t1.x, t1.y);
      ctx.lineTo(b1.x, b1.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.closePath();
      ctx.fill();

      // Draw Right Face vertical ridges
      for (let i = 1; i < numSlats; i++) {
        const t = i / numSlats;
        const tx = t2.x + (t1.x - t2.x) * t;
        const ty = t2.y + (t1.y - t2.y) * t;
        const bx = t2.x + (t1.x - t2.x) * t;
        const by = t2.y + (t1.y - t2.y) * t + boxH;

        // Shadow line
        ctx.strokeStyle = isDark ? "#080B08" : "#C2B5A2";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(bx, by);
        ctx.stroke();

        // Highlight line
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.5)";
        ctx.beginPath();
        ctx.moveTo(tx + 1, ty);
        ctx.lineTo(bx + 1, by);
        ctx.stroke();
      }

      // C. TOP FACE
      const topGrad = ctx.createLinearGradient(t3.x, t3.y, t1.x, t1.y);
      topGrad.addColorStop(0, isDark ? "#283428" : "#F6EAD4");
      topGrad.addColorStop(0.5, isDark ? "#1C251C" : "#EFE1C8");
      topGrad.addColorStop(1, isDark ? "#121A12" : "#DECFAF");
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.moveTo(t0.x, t0.y);
      ctx.lineTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.closePath();
      ctx.fill();

      // Draw top edge highlight/rim light
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(t3.x, t3.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t1.x, t1.y);
      ctx.stroke();

      // 5. Draw Etched "K" Gothic Emblem on the left face
      // Let's place it at center of left face
      const lcx = (t3.x + t2.x) / 2;
      const lcy = (t3.y + b2.y) / 2;

      ctx.save();
      // Shield outline
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(lcx - 12, lcy - 16);
      ctx.lineTo(lcx + 12, lcy - 16);
      ctx.lineTo(lcx + 12, lcy + 2);
      ctx.quadraticCurveTo(lcx + 12, lcy + 12, lcx, lcy + 20);
      ctx.quadraticCurveTo(lcx - 12, lcy + 12, lcx - 12, lcy + 2);
      ctx.closePath();
      ctx.stroke();

      // Glow effect for shield
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 4;
      ctx.strokeStyle = accentColor;
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // Gothic "K" emblem inside shield (Stylized gothic geometry)
      ctx.fillStyle = isDark ? "#E8F0E8" : "#1F1A17";
      ctx.font = "italic bold 16px 'Georgia', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("𝔎", lcx, lcy);
      ctx.restore();

      // 6. Draw glowing LED base lines (Neons on bottom rim)
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = accentColor;
      ctx.shadowBlur = 10;

      // Bottom left edge neon
      ctx.beginPath();
      ctx.moveTo(b3.x, b3.y);
      ctx.lineTo(b2.x, b2.y);
      ctx.stroke();

      // Bottom right edge neon
      ctx.beginPath();
      ctx.moveTo(b2.x, b2.y);
      ctx.lineTo(b1.x, b1.y);
      ctx.stroke();
      ctx.restore();

      // 7. Draw orbiting particles around the monolith
      angle += 0.008;
      const radiusX = 110;
      const radiusY = 32;
      const orbY = cy + boxH / 2 - 15;

      const numParticles = 2;
      for (let i = 0; i < numParticles; i++) {
        const offset = (i * Math.PI) + angle;
        const px = cx + Math.cos(offset) * radiusX;
        const py = orbY + Math.sin(offset) * radiusY;

        // Only draw particles in front of the box if sin(offset) > 0, otherwise behind (drawn first)
        const isBehind = Math.sin(offset) < 0;

        // We'll draw them all with varying opacity to simulate 3D depth
        ctx.fillStyle = accentColor;
        ctx.shadowColor = accentColor;
        ctx.shadowBlur = isBehind ? 2 : 6;
        ctx.beginPath();
        ctx.arc(px, py, isBehind ? 1.5 : 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw orbital trail
        ctx.strokeStyle = isBehind ? accentDim : accentGlow;
        ctx.lineWidth = isBehind ? 0.3 : 0.8;
        ctx.beginPath();
        ctx.ellipse(cx, orbY, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <div className="relative w-full h-[230px] flex items-center justify-center overflow-hidden bg-theme-void/35 border border-theme-border/60 rounded-xs select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Telemetry labels overlay */}
      <div className="absolute top-2 left-3 text-[8px] font-mono text-theme-text-muted opacity-80 flex flex-col select-none">
        <span>CORE: OPTICAL_MONOLITH</span>
        <span>STATUS: SYSTEM_SEALED</span>
      </div>
      <div className="absolute top-2 right-3 text-[8px] font-mono text-theme-text-muted opacity-80 flex flex-col text-right select-none">
        <span>POWER: NOMINAL</span>
        <span>TEMP: 34.2°C</span>
      </div>
    </div>
  );
};

export default SealedBoxVisual;
