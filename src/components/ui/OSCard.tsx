"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface OSCardProps {
  children: React.ReactNode;
  className?: string;
  disableEffects?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const OSCard: React.FC<OSCardProps> = ({ children, className = "", disableEffects = false, onMouseEnter, onMouseLeave }) => {
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`relative rounded-3xl border border-theme-border/30 bg-theme-void/50 backdrop-blur-sm transition-colors duration-500 overflow-hidden ${className}`}
    >
      {/* Background glow effect that follows mouse */}
      {isDesktop && !disableEffects && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-theme-accent-glow), transparent 40%)`,
            zIndex: 0
          }}
        />
      )}
      
      {/* Dynamic Border Trace */}
      {isDesktop && !disableEffects && (
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-300 border-[1.5px] border-transparent"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(150px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--color-theme-accent), transparent 100%) border-box`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 1
          }}
        />
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
