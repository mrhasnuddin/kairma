"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";

interface GlassWorkforceCubeProps {
  speed?: number;
  className?: string;
}

export const GlassWorkforceCube: React.FC<GlassWorkforceCubeProps> = ({
  speed = 0.01,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [angle, setAngle] = useState(0);
  const requestRef = useRef<number>(0);

  // Keep track of rotation angle
  useEffect(() => {
    const animate = () => {
      setAngle((prev) => (prev + speed) % (Math.PI * 2));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  // Main canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get theme colors dynamically from CSS variables
    const getThemeColors = () => {
      const style = getComputedStyle(document.documentElement);
      const accent = style.getPropertyValue("--theme-accent").trim() || "#C9402B";
      const voidCol = style.getPropertyValue("--theme-void").trim() || "#0B0A0C";
      return { accent, voidCol };
    };

    const { accent, voidCol } = getThemeColors();

    // Setup high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const width = rect.width || 200;
    const height = rect.height || 200;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // 3D coordinate constants
    const cx = width / 2;
    const cy = height / 2;
    const focalLength = 180;
    const cameraDist = 200;
    const cubeHalfSize = 26; // Base size of the cube face

    // Rotate a 3D point
    const rotatePoint = (x: number, y: number, z: number, theta: number, phi: number) => {
      // Y-axis rotation (spin)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const x1 = x * cosT + z * sinT;
      const y1 = y;
      const z1 = -x * sinT + z * cosT;

      // X-axis rotation (tilt)
      const cosP = Math.cos(phi);
      const sinP = Math.sin(phi);
      const x2 = x1;
      const y2 = y1 * cosP - z1 * sinP;
      const z2 = y1 * sinP + z1 * cosP;

      return { x: x2, y: y2, z: z2 };
    };

    // Project rotated 3D point to 2D
    const project = (p: { x: number; y: number; z: number }) => {
      const scale = focalLength / (p.z + cameraDist);
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        z: p.z,
      };
    };

    // Helper to parse hex/rgba colors
    const getAccentRGB = (color: string) => {
      if (color.startsWith("#")) {
        let hex = color.slice(1);
        if (hex.length === 3) {
          hex = hex.split("").map((c) => c + c).join("");
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `${r}, ${g}, ${b}`;
      }
      if (color.startsWith("rgb")) {
        const matches = color.match(/\d+/g);
        if (matches && matches.length >= 3) {
          return `${matches[0]}, ${matches[1]}, ${matches[2]}`;
        }
      }
      // Fallback
      return theme === "matrix-mode" ? "31, 170, 104" : "200, 68, 46";
    };

    const rgbStr = getAccentRGB(accent);

    // Cube base vertices & face normals
    const baseFaces = [
      // 0: Front face (Normal: 0, 0, 1)
      {
        normal: { x: 0, y: 0, z: 1 },
        verts: [
          { x: -cubeHalfSize, y: -cubeHalfSize, z: cubeHalfSize },
          { x: cubeHalfSize, y: -cubeHalfSize, z: cubeHalfSize },
          { x: cubeHalfSize, y: cubeHalfSize, z: cubeHalfSize },
          { x: -cubeHalfSize, y: cubeHalfSize, z: cubeHalfSize },
        ],
      },
      // 1: Back face (Normal: 0, 0, -1)
      {
        normal: { x: 0, y: 0, z: -1 },
        verts: [
          { x: -cubeHalfSize, y: -cubeHalfSize, z: -cubeHalfSize },
          { x: -cubeHalfSize, y: cubeHalfSize, z: -cubeHalfSize },
          { x: cubeHalfSize, y: cubeHalfSize, z: -cubeHalfSize },
          { x: cubeHalfSize, y: -cubeHalfSize, z: -cubeHalfSize },
        ],
      },
      // 2: Top face (Normal: 0, -1, 0)
      {
        normal: { x: 0, y: -1, z: 0 },
        verts: [
          { x: -cubeHalfSize, y: -cubeHalfSize, z: -cubeHalfSize },
          { x: cubeHalfSize, y: -cubeHalfSize, z: -cubeHalfSize },
          { x: cubeHalfSize, y: -cubeHalfSize, z: cubeHalfSize },
          { x: -cubeHalfSize, y: -cubeHalfSize, z: cubeHalfSize },
        ],
      },
      // 3: Bottom face (Normal: 0, 1, 0)
      {
        normal: { x: 0, y: 1, z: 0 },
        verts: [
          { x: -cubeHalfSize, y: cubeHalfSize, z: -cubeHalfSize },
          { x: -cubeHalfSize, y: cubeHalfSize, z: cubeHalfSize },
          { x: cubeHalfSize, y: cubeHalfSize, z: cubeHalfSize },
          { x: cubeHalfSize, y: cubeHalfSize, z: -cubeHalfSize },
        ],
      },
      // 4: Right face (Normal: 1, 0, 0)
      {
        normal: { x: 1, y: 0, z: 0 },
        verts: [
          { x: cubeHalfSize, y: -cubeHalfSize, z: -cubeHalfSize },
          { x: cubeHalfSize, y: -cubeHalfSize, z: cubeHalfSize },
          { x: cubeHalfSize, y: cubeHalfSize, z: cubeHalfSize },
          { x: cubeHalfSize, y: cubeHalfSize, z: -cubeHalfSize },
        ],
      },
      // 5: Left face (Normal: -1, 0, 0)
      {
        normal: { x: -1, y: 0, z: 0 },
        verts: [
          { x: -cubeHalfSize, y: -cubeHalfSize, z: -cubeHalfSize },
          { x: -cubeHalfSize, y: cubeHalfSize, z: -cubeHalfSize },
          { x: -cubeHalfSize, y: cubeHalfSize, z: cubeHalfSize },
          { x: -cubeHalfSize, y: -cubeHalfSize, z: cubeHalfSize },
        ],
      },
    ];

    // Compute animated organic wobble / tilts
    const theta = angle; // Y rotation
    const phi = 0.5 + Math.sin(angle * 0.45) * 0.25; // X tilt

    // Exploding/breathing offset (drift distance)
    const drift = 12 + Math.sin(angle * 1.5) * 8;

    // Build list of renderable components
    const renderList: any[] = [];

    // 1. Project Cube Faces
    baseFaces.forEach((face, idx) => {
      // Offset base vertices along their normals to simulate "exploding box"
      const shiftedVerts = face.verts.map((v) => ({
        x: v.x + face.normal.x * drift,
        y: v.y + face.normal.y * drift,
        z: v.z + face.normal.z * drift,
      }));

      // Rotate vertices
      const rotatedVerts = shiftedVerts.map((v) =>
        rotatePoint(v.x, v.y, v.z, theta, phi)
      );

      // Project vertices
      const projectedVerts = rotatedVerts.map(project);

      // Rotate Normal to calculate backface culling/occlusion styling
      const rotNormal = rotatePoint(face.normal.x, face.normal.y, face.normal.z, theta, phi);
      const isFrontFace = rotNormal.z < 0; // facing towards camera

      // Calculate center Z for sorting
      const avgZ = rotatedVerts.reduce((acc, v) => acc + v.z, 0) / 4;

      renderList.push({
        type: "face",
        verts: projectedVerts,
        rotNormal,
        isFrontFace,
        z: avgZ,
        index: idx,
      });
    });

    // 2. Project Orbital Ring of Particles
    const particleCount = 14;
    const ringRadius = 68;
    for (let i = 0; i < particleCount; i++) {
      const baseAngle = (i * Math.PI * 2) / particleCount + angle * 0.65;
      
      // Floating coordinates (wave path)
      const px = ringRadius * Math.cos(baseAngle);
      const py = Math.sin(baseAngle * 3 + angle * 2) * 5;
      const pz = ringRadius * Math.sin(baseAngle);

      const rotP = rotatePoint(px, py, pz, theta, phi);
      const projP = project(rotP);

      renderList.push({
        type: "particle",
        x: projP.x,
        y: projP.y,
        z: rotP.z,
        angle: baseAngle,
      });
    }

    // 3. Central Core
    const rotCoreCenter = rotatePoint(0, 0, 0, theta, phi);
    const projCoreCenter = project(rotCoreCenter);
    renderList.push({
      type: "core",
      x: projCoreCenter.x,
      y: projCoreCenter.y,
      z: rotCoreCenter.z,
    });

    // Sort items by Z depth (descending: backmost drawn first, frontmost last)
    renderList.sort((a, b) => b.z - a.z);

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // Draw HUD Target box subtle corner lines
    ctx.strokeStyle = accent;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.15;
    
    // Target borders
    const borderOffset = 4;
    const borderLen = 8;
    
    // Top Left
    ctx.beginPath();
    ctx.moveTo(borderOffset, borderOffset + borderLen);
    ctx.lineTo(borderOffset, borderOffset);
    ctx.lineTo(borderOffset + borderLen, borderOffset);
    ctx.stroke();

    // Top Right
    ctx.beginPath();
    ctx.moveTo(width - borderOffset, borderOffset + borderLen);
    ctx.lineTo(width - borderOffset, borderOffset);
    ctx.lineTo(width - borderOffset - borderLen, borderOffset);
    ctx.stroke();

    // Bottom Left
    ctx.beginPath();
    ctx.moveTo(borderOffset, height - borderOffset - borderLen);
    ctx.lineTo(borderOffset, height - borderOffset);
    ctx.lineTo(borderOffset + borderLen, height - borderOffset);
    ctx.stroke();

    // Bottom Right
    ctx.beginPath();
    ctx.moveTo(width - borderOffset, height - borderOffset - borderLen);
    ctx.lineTo(width - borderOffset, height - borderOffset);
    ctx.lineTo(width - borderOffset - borderLen, height - borderOffset);
    ctx.stroke();

    // Radial dashboard rings
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    ctx.arc(cx, cy, 85, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([2, 5]);
    ctx.arc(cx, cy, 68, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Restore full opacity
    ctx.globalAlpha = 1.0;

    // Render sorted list
    renderList.forEach((item) => {
      if (item.type === "face") {
        const verts = item.verts;
        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(verts[i].x, verts[i].y);
        }
        ctx.closePath();

        // Color and Opacity based on facing direction (front vs back)
        if (item.isFrontFace) {
          // Glass Fill
          ctx.fillStyle = `rgba(${rgbStr}, 0.09)`;
          ctx.fill();

          // Double border for high-end wireframe look
          ctx.strokeStyle = `rgba(${rgbStr}, 0.55)`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Sub-border (glowing inner edge)
          ctx.strokeStyle = `rgba(${rgbStr}, 0.2)`;
          ctx.lineWidth = 3.5;
          ctx.stroke();

          // Draw custom microprocessor/circuit design on front faces
          ctx.beginPath();
          // Scale down points towards center of the face
          const innerVerts = verts.map((v: any) => ({
            x: v.x * 0.6 + cx * 0.4,
            y: v.y * 0.6 + cy * 0.4,
          }));
          ctx.moveTo(innerVerts[0].x, innerVerts[0].y);
          for (let i = 1; i < 4; i++) {
            ctx.lineTo(innerVerts[i].x, innerVerts[i].y);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(${rgbStr}, 0.3)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Draw geometric lines from inner box corners to outer box corners
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            ctx.moveTo(verts[i].x, verts[i].y);
            ctx.lineTo(innerVerts[i].x, innerVerts[i].y);
          }
          ctx.strokeStyle = `rgba(${rgbStr}, 0.15)`;
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Glowing vertex points
          verts.forEach((v: any) => {
            ctx.beginPath();
            ctx.arc(v.x, v.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = accent;
            ctx.fill();
            
            // Soft halo
            ctx.beginPath();
            ctx.arc(v.x, v.y, 4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${rgbStr}, 0.25)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          });
        } else {
          // Back Face (shaded background glass)
          ctx.fillStyle = `rgba(${rgbStr}, 0.02)`;
          ctx.fill();

          ctx.strokeStyle = `rgba(${rgbStr}, 0.12)`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      } else if (item.type === "particle") {
        // Render Orbital Particle
        ctx.beginPath();
        ctx.arc(item.x, item.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.fill();

        // Pulsing glow ring
        ctx.beginPath();
        ctx.arc(item.x, item.y, 4.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgbStr}, 0.25)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      } else if (item.type === "core") {
        // Render Central core (Sealed AI processor orb)
        const radGrad = ctx.createRadialGradient(
          item.x,
          item.y,
          0,
          item.x,
          item.y,
          10
        );
        radGrad.addColorStop(0, "#FFFFFF");
        radGrad.addColorStop(0.3, `rgba(${rgbStr}, 0.8)`);
        radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.fill();

        // Outer spinning Core wireframe ring
        ctx.beginPath();
        ctx.arc(item.x, item.y, 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${rgbStr}, 0.25)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  }, [angle, theme]);

  return (
    <div className={`w-full h-full flex items-center justify-center relative select-none ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
        className="block"
      />
      {/* Tiny absolute telemetry readout */}
      <span className="absolute bottom-1 right-2 text-[5.5px] text-theme-text-muted opacity-40 font-mono tracking-wider">
        SYS.CUBE_READY // FPS.60
      </span>
    </div>
  );
};

export default GlassWorkforceCube;
