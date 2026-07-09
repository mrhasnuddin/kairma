"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface OSCardProps {
  children: React.ReactNode;
  className?: string;
  disableEffects?: boolean;
  overflowVisible?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  /** Entrance slide direction. When set, the card reveals itself (slide + fade). */
  reveal?: "left" | "right" | "bottom";
  /** Seconds to wait before the entrance plays (used for the boot sequence). */
  revealDelay?: number;
  /** Play the entrance when the card scrolls into view (once) instead of on mount. */
  revealInView?: boolean;
  /** Anchor id for sticky-nav jumps. The card flashes (2 blinks of the
   *  hover effect) when a "kairma-nav-flash" event carries this id. */
  navId?: string;
  /** Diagonal corners that highlight with increased opacity: "tr-bl" (Top-Right & Bottom-Left) or "tl-br" (Top-Left & Bottom-Right) */
  cornerAccent?: "tr-bl" | "tl-br";
}

const REVEAL_EASE = [0.16, 1, 0.3, 1] as const;

export const OSCard: React.FC<OSCardProps> = ({ children, className = "", disableEffects = false, overflowVisible = false, onMouseEnter, onMouseLeave, reveal, revealDelay = 0, revealInView = false, navId, cornerAccent = "tr-bl" }) => {
  const reducedMotion = useReducedMotion();
  const [flashing, setFlashing] = useState(false);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sticky-nav jump feedback: blink the hover overlays twice on demand.
  useEffect(() => {
    if (!navId) return;
    const onFlash = (e: Event) => {
      if ((e as CustomEvent).detail !== navId) return;
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlashing(false);
      // Re-trigger on the next frame so the CSS animation restarts cleanly.
      requestAnimationFrame(() => {
        setFlashing(true);
        flashTimer.current = setTimeout(() => setFlashing(false), 1700);
      });
    };
    window.addEventListener("kairma-nav-flash", onFlash);
    return () => {
      window.removeEventListener("kairma-nav-flash", onFlash);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, [navId]);
  const ref = useRef<HTMLDivElement>(null);
  
  // Track mouse for glow
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    // Check if device supports hover (desktop)
    const checkHover = () => {
      setIsDesktop(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    };
    checkHover();
    window.addEventListener("resize", checkHover);
    return () => window.removeEventListener("resize", checkHover);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || disableEffects) return;
    
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setMousePosition({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseLeave = () => {
    if (!isDesktop || disableEffects) return;
    setIsHovered(false);
    onMouseLeave?.();
  };

  const handleMouseEnter = () => {
    if (!isDesktop || disableEffects) return;
    setIsHovered(true);
    onMouseEnter?.();
  };

  // Entrance reveal: slide in from the card's nearest edge + fade. Reduced
  // motion collapses it to a plain fade.
  const revealOffset =
    reveal === "left" ? { x: -56 } : reveal === "right" ? { x: 56 } : { y: 56 };
  const revealProps = reveal
    ? {
        initial: reducedMotion ? { opacity: 0 } : { opacity: 0, ...revealOffset },
        transition: {
          duration: reducedMotion ? 0.3 : 2.8,
          delay: revealDelay,
          ease: REVEAL_EASE,
        },
        ...(revealInView
          ? {
              whileInView: { opacity: 1, x: 0, y: 0 },
              viewport: { once: true, margin: "0px 0px -80px 0px" },
            }
          : { animate: { opacity: 1, x: 0, y: 0 } }),
      }
    : {};

  return (
    <motion.div
      ref={ref}
      id={navId}
      {...revealProps}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative rounded-3xl bg-theme-void/50 backdrop-blur-sm transition-colors duration-500 ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} ${className}`}
    >
      {/* Figma Exact Gradient Edge Stroke (0% Accent -> 26% Transparent -> 85% Transparent -> 100% Accent) */}
      <div 
        className="absolute inset-0 rounded-3xl pointer-events-none border-[2.5px] border-transparent"
        style={{
          background: (cornerAccent === "tl-br"
            ? `linear-gradient(to bottom right, var(--color-theme-accent) 0%, transparent 26%, transparent 85%, var(--color-theme-accent) 100%) border-box`
            : `linear-gradient(to top right, var(--color-theme-accent) 0%, transparent 26%, transparent 85%, var(--color-theme-accent) 100%) border-box`
          ),
          opacity: 1,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 1,
        }}
      />

      {/* Dynamic Border Trace */}
      {isDesktop && !disableEffects && (
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-300 border-[2.5px] border-transparent"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-theme-accent), transparent 100%) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 1
          }}
        />
      )}

      {/* Nav-jump flash: the hover overlays, centered, blinking twice. */}
      {flashing && (
        <>
          <div
            className="absolute inset-0 pointer-events-none box-flash-anim"
            style={{
              background: `radial-gradient(800px circle at 50% 50%, var(--color-theme-accent-glow), transparent 60%)`,
              zIndex: 0,
            }}
          />
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none box-flash-anim border-[2.5px] border-transparent"
            style={{
              background: `radial-gradient(350px circle at 50% 50%, var(--color-theme-accent), transparent 100%) border-box`,
              WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Content wrapper */}
      <motion.div
        className="h-full w-full relative z-10"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
