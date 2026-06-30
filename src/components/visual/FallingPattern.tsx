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
  /** Blur intensity for the overlay effect - ignored in optimized version for performance */
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
  blurIntensity = "0.8px", // Kept prop for compatibility, but ignored in DOM to save GPU
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

    const ctx = canvas.getContext("2d", { alpha: false }); // alpha false optimizes rendering
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
        drops[i] = {
          y: Math.random() * -(height / fontSize), // Start randomly offscreen
          speed: (0.1 + Math.random() * 0.2) * speed,
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
    const baseFps = 60; // 60fps for buttery smooth rendering (fixes perceived lag)
    const interval = 1000 / baseFps;

    // Resolve color strings/variables to RGB/RGBA for Canvas operations
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
      if (match && match.length >= 3) {
        return [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
      }
      return theme === "matrix-mode" ? [31, 170, 104] : [200, 68, 46];
    };

    let colors = resolveColors();
    const rgb = parseRGB(colors.accent);

    // Initial fill to avoid flashing
    ctx.fillStyle = `rgb(${colors.bg[0]}, ${colors.bg[1]}, ${colors.bg[2]})`;
    ctx.fillRect(0, 0, width, height);

    const draw = (timestamp: number) => {
      animationId = requestAnimationFrame(draw);

      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      const isDark = theme === "matrix-mode";

      // 1. HIGH PERFORMANCE FADE: Draw a semi-transparent background box over everything
      // This creates the trails organically without clearing the canvas or keeping arrays of chars
      // Lowered alpha to 0.08 to compensate for 60fps (keeps trails long)
      ctx.fillStyle = `rgba(${colors.bg[0]}, ${colors.bg[1]}, ${colors.bg[2]}, 0.08)`;
      ctx.fillRect(0, 0, width, height);

      // Configure font
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const prevY = Math.floor(drop.y);
        
        drop.y += drop.speed;
        
        const currentY = Math.floor(drop.y);

        // Only draw if we've advanced to a new grid cell to avoid heavy overdraw
        if (currentY > prevY && currentY > 0) {
          const xPos = i * fontSize + fontSize / 2;
          const yPos = currentY * fontSize;

          // Draw the trail (re-paint the previous head position with the accent color)
          // This covers the old white head and replaces it with green/orange
          ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          const tailText = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(tailText, xPos, yPos - fontSize);

          // Draw the new head (bright white/dark ink)
          ctx.fillStyle = isDark ? "#ffffff" : "#1F1A17";
          const headText = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(headText, xPos, yPos);
        }

        // Reset drop index once it leaves bottom screen (with some randomness)
        if (currentY * fontSize > height && Math.random() > 0.95) {
          drop.y = 0;
          drop.speed = (0.1 + Math.random() * 0.2) * speed;
        }
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [color, backgroundColor, speed, theme]);

  const resolvedOpacity = (opacity ?? 0.15) * (theme === "matrix-mode" ? 1.0 : 3.0);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className || ""}`}
      style={{ opacity: resolvedOpacity }}
      {...props}
    >
      {/* 
        Removed alpha channel on canvas and removed heavy CSS blur 
        for massive performance gains. 
      */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full z-0" />
      
      {/* Cheap CRT overlay grid (no expensive backdrop-filter) */}
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

