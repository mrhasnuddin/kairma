"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";

type FallingPatternProps = React.ComponentProps<"div"> & {
  /** Primary color of the falling elements (default: 'var(--theme-accent)') */
  color?: string;
  /** Background color (default: 'var(--theme-void)') */
  backgroundColor?: string;
  /** Speed multiplier for the falling characters (default: 1) */
  speed?: number;
  /** Blur intensity for the overlay effect (default: '3px') */
  blurIntensity?: string;
  /** Pattern density - affects spacing of grid (default: 1) */
  density?: number;
  /** Opacity of the background container (default: 0.15) */
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = 0;
    let height = canvas.height = 0;
    
    // Font configuration
    const fontSize = 14;
    let columns = 0;
    
    interface Drop {
      y: number;
      speed: number;
      chars: string[];
    }
    
    let drops: Drop[] = [];

    // Matrix characters: half-width Japanese katakana and standard numbers
    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

    // Resize canvas and recalculate columns
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
      
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        const speedVal = (0.15 + Math.random() * 0.45) * speed;
        const initialY = Math.random() * -50;
        const charList: string[] = [];
        for (let j = 0; j < 60; j++) {
          charList.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        drops[i] = {
          y: initialY,
          speed: speedVal,
          chars: charList,
        };
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    handleResize();

    // Speed control variables
    let lastTime = 0;
    const baseFps = 24;
    const interval = 1000 / baseFps;

    // Resolve color strings/variables to RGB/RGBA for Canvas operations
    const resolveColors = () => {
      if (typeof window === "undefined" || !canvas) return { bg: [11, 14, 11], accent: "#1FAA68" };
      
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
          : [11, 14, 11]
      };
    };

    const parseRGB = (colorStr: string): [number, number, number] => {
      const match = colorStr.match(/\d+/g);
      if (match && match.length >= 3) {
        return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
      }
      if (colorStr.startsWith("#")) {
        const hex = colorStr.replace("#", "");
        if (hex.length === 3) {
          return [
            parseInt(hex[0] + hex[0], 16),
            parseInt(hex[1] + hex[1], 16),
            parseInt(hex[2] + hex[2], 16)
          ];
        }
        if (hex.length === 6) {
          return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
          ];
        }
      }
      return theme === "matrix-dark" ? [31, 170, 104] : [200, 68, 46];
    };

    let colors = resolveColors();
    const rgb = parseRGB(colors.accent);

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      // Clear the canvas on every frame to ensure perfect contrast and sharpness
      ctx.clearRect(0, 0, width, height);

      // Configure font
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";
      
      const isDark = theme === "matrix-dark";

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const headY = Math.floor(drop.y);
        const tailLength = 18;

        // Mutate a few characters in the drop stream occasionally for flickering effect
        if (Math.random() > 0.94) {
          const mutateIdx = Math.floor(Math.random() * drop.chars.length);
          drop.chars[mutateIdx] = chars[Math.floor(Math.random() * chars.length)];
        }

        for (let j = 0; j < tailLength; j++) {
          const charY = headY - j;
          if (charY < 0) continue;

          const yPos = charY * fontSize;
          if (yPos > height + fontSize) continue;

          const xPos = i * fontSize + fontSize / 2;
          const charIdx = charY % drop.chars.length;
          const text = drop.chars[charIdx];

          if (j === 0) {
            // Head character: glowing white (dark theme) or dark ink (light theme)
            ctx.fillStyle = isDark ? "#ffffff" : "#1F1A17";
            ctx.shadowColor = isDark ? "rgba(31, 170, 104, 0.9)" : "rgba(200, 68, 46, 0.7)";
            ctx.shadowBlur = 8;
          } else if (j === 1) {
            // High-brightness head successor character
            ctx.fillStyle = isDark ? "#a3e635" : "#ea580c"; // bright green-yellow or bright orange
            ctx.shadowBlur = 0;
          } else {
            // Tail characters: fade out over distance
            const alpha = 1 - j / tailLength;
            ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha * 0.95})`;
            ctx.shadowBlur = 0;
          }

          ctx.fillText(text, xPos, yPos);
        }

        // Increment drop y position
        drop.y += drop.speed;

        // Reset drop index once it leaves bottom screen
        if ((headY - tailLength) * fontSize > height) {
          drop.y = -Math.random() * 20;
          drop.speed = (0.15 + Math.random() * 0.45) * speed;
        }
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [color, backgroundColor, speed, theme]);

  const resolvedOpacity = (opacity ?? 0.15) * (theme === "matrix-dark" ? 1.0 : 3.0);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className || ""}`}
      style={{ opacity: resolvedOpacity }}
      {...props}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full z-0" />
      
      {/* Blurring & monitor-dot CRT overlay grid */}
      <div
        className="absolute inset-0 pointer-events-none z-10 dark:brightness-600"
        style={{
          backdropFilter: blurIntensity ? `blur(${blurIntensity})` : undefined,
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0, transparent 2px, ${backgroundColor} 2px)`,
          backgroundSize: `${8 * density}px ${8 * density}px`,
          opacity: 0.12,
        }}
      />
    </div>
  );
}

export default FallingPattern;
