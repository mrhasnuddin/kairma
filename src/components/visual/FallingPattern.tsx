"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";
import { canonRain } from "@/data/canon-rain";

type FallingPatternProps = React.ComponentProps<"div"> & {
  color?: string;
  backgroundColor?: string;
  speed?: number;
  blurIntensity?: string;
  density?: number;
  opacity?: number;
};

export function FallingPattern({
  color = "var(--theme-accent)",
  backgroundColor = "var(--theme-void)",
  speed = 1,
  blurIntensity = "0.8px",
  density = 1,
  opacity = 0.15,
  className,
  ...props
}: FallingPatternProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Transparent canvas — the page (content curtain / footer) provides the
    // backdrop; trails fade toward transparency, not toward a bg color.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = 0;
    let height = canvas.height = 0;
    
    const fontSize = 16;
    const rowHeight = fontSize * 1.5;
    let numRows = 0;
    
    interface RowData {
      x: number;
      speed: number;
      str: string;
      index: number;
      lastCharX: number;
      nextCharWidth: number;
      maxChars: number;
    }
    
    let rows: RowData[] = [];

    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      
      numRows = Math.floor(height / rowHeight);
      rows = Array.from({ length: numRows }).map(() => ({
        // Spawn randomly across the entire viewport immediately!
        x: Math.random() * (width + 150),
        speed: (1.2 + Math.random() * 1.8) * speed, // Dynamic speed variety for 3D depth
        str: canonRain[Math.floor(Math.random() * canonRain.length)],
        index: 0,
        lastCharX: 99999, // Force immediate draw
        nextCharWidth: 0,
        maxChars: Math.floor(Math.random() * 30) + 15, // Bounded drop distance (15-45 chars)
      }));
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    handleResize();

    let lastTime = 0;
    const baseFps = 60;
    const interval = 1000 / baseFps;

    const resolveColors = () => {
      if (typeof window === "undefined" || !canvas) return { bg: [11, 10, 12], accent: "#C9402B" };
      
      const temp = document.createElement("div");
      temp.style.color = color;
      temp.style.backgroundColor = backgroundColor;
      document.body.appendChild(temp);
      const computed = getComputedStyle(temp);
      const resolvedColor = computed.color;
      const resolvedBg = computed.backgroundColor;
      document.body.removeChild(temp);

      const bgMatch = resolvedBg.match(/\d+/g);
      return {
        accent: resolvedColor,
        bg: bgMatch && bgMatch.length >= 3 
          ? [parseInt(bgMatch[0]), parseInt(bgMatch[1]), parseInt(bgMatch[2])]
          : (theme === "matrix-mode" ? [11, 10, 12] : [255, 255, 255])
      };
    };

    const parseRGB = (colorStr: string): [number, number, number] => {
      const match = colorStr.match(/\d+/g);
      if (match && match.length >= 3) return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
      return theme === "matrix-mode" ? [31, 170, 104] : [200, 68, 46];
    };

    const colors = resolveColors();
    const rgb = parseRGB(colors.accent);

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      const isDark = theme === "matrix-mode";

      // Fade effect (trail) — erase toward transparency so the canvas never
      // becomes an opaque wall (the fixed reveal-footer sits behind it).
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.055)";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      ctx.font = `bold ${fontSize}px var(--font-serif), monospace`; // Use serif for literary canon, fallback to mono
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        row.x -= row.speed;
        const yPos = i * rowHeight + rowHeight / 2;

        if (row.lastCharX - row.x >= row.nextCharWidth) {
          const tailChar = row.index > 0 ? row.str[row.index - 1] : "";
          const headChar = row.str[row.index];
          
          if (tailChar) {
            ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ctx.fillText(tailChar, row.lastCharX, yPos);
          }

          if (headChar && row.index < row.maxChars) {
            ctx.fillStyle = isDark ? "#ffffff" : "#1F1A17";
            ctx.fillText(headChar, row.x, yPos);
            
            row.lastCharX = row.x;
            row.nextCharWidth = ctx.measureText(headChar).width * 1.1; // Add slight letter spacing
            row.index++;
          } else {
            // String finished or max distance reached; reset randomly across the viewport!
            if (row.x < -100 || row.index >= row.maxChars || Math.random() > 0.99) {
              row.x = Math.random() * (width + 200);
              row.str = canonRain[Math.floor(Math.random() * canonRain.length)];
              row.maxChars = Math.floor(Math.random() * 30) + 15;
              row.index = 0;
              row.lastCharX = row.x + 999;
              row.nextCharWidth = 0;
              row.speed = (1.2 + Math.random() * 1.8) * speed;
            }
          }
        }
      }
    };

    animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [color, backgroundColor, speed, theme]);

  const resolvedOpacity = Math.min(1.0, (opacity ?? 0.2) * (theme === "matrix-mode" ? 1.4 : 3.0));

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className || ""}`}
      style={{ opacity: resolvedOpacity }}
      {...props}
    >
      {/* -scale-x-100 applies the mirror-reverse effect visually */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full z-0 transform -scale-x-100" />
      
      <div
        className="absolute inset-0 pointer-events-none z-10 dark:brightness-600"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, ${backgroundColor} 2px)`,
          backgroundSize: `${8 * density}px ${8 * density}px`,
          opacity: 0.12,
        }}
      />
    </div>
  );
}

export default FallingPattern;

