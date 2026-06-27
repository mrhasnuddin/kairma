"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface OSCardProps {
  children: React.ReactNode;
  className?: string;
  disableEffects?: boolean;
}

export const OSCard: React.FC<OSCardProps> = ({ children, className = "", disableEffects = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // Track mouse for glow
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Framer motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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

      const width = rect.width;
      const height = rect.height;
      
      // Values for tilt (-0.5 to 0.5)
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      
      x.set(xPct);
      y.set(yPct);
    }
  };

  const handleMouseLeave = () => {
    if (!isDesktop || disableEffects) return;
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleMouseEnter = () => {
    if (!isDesktop || disableEffects) return;
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX: isDesktop && !disableEffects ? rotateX : 0,
        rotateY: isDesktop && !disableEffects ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
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

      {/* Content wrapper with translateZ for depth */}
      <motion.div 
        className="h-full w-full relative z-10"
        style={{
          transform: isDesktop && !disableEffects && isHovered ? "translateZ(20px)" : "translateZ(0px)",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
