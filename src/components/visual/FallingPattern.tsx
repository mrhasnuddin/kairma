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

    const ctx = canvas.getContext("2d", { alpha: false });
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
        x: width + Math.random() * width,
        speed: (1.0 + Math.random() * 1.5) * speed, // Slightly faster horizontal speed
        str: canonRain[Math.floor(Math.random() * canonRain.length)],
        index: 0,
        lastCharX: 99999, // Force immediate draw
        nextCharWidth: 0,
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

    ctx.fillStyle = `rgb(${colors.bg[0]}, ${colors.bg[1]}, ${colors.bg[2]})`;
    ctx.fillRect(0, 0, width, height);

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      const isDark = theme === "matrix-mode";

      // Fade effect (trail) - lower alpha leaves longer glowing tails
      ctx.fillStyle = `rgba(${colors.bg[0]}, ${colors.bg[1]}, ${colors.bg[2]}, 0.055)`;
      ctx.fillRect(0, 0, width, height);

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

          if (headChar) {
            ctx.fillStyle = isDark ? "#ffffff" : "#1F1A17";
            ctx.fillText(headChar, row.x, yPos);
            
            row.lastCharX = row.x;
            row.nextCharWidth = ctx.measureText(headChar).width * 1.1; // Add slight letter spacing
            row.index++;
          } else {
            // String finished; reset offscreen left (which is Canvas X = width + random)
            if (row.x < -width || Math.random() > 0.99) {
              row.x = width + Math.random() * 400;
              row.str = canonRain[Math.floor(Math.random() * canonRain.length)];
              row.index = 0;
              row.lastCharX = row.x + 999;
              row.nextCharWidth = 0;
              row.speed = (1.0 + Math.random() * 1.5) * speed;
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

