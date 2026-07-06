"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Helper for joining classes
const cx = (...classes: (string | undefined | false | null)[]) => classes.filter(Boolean).join(" ");

// Bento Grid Container
export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cx(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(250px,auto)] gap-3 md:gap-4 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 w-full",
        className
      )}
    >
      {children}
    </div>
  );
};

// Individual Bento Box
export interface BentoBoxProps {
  className?: string;
  children: React.ReactNode;
  withBorder?: boolean;
  withGlow?: boolean;
  invisible?: boolean;
  mode?: "matrix" | "xuan";
}

export const BentoBox = ({
  className,
  children,
  withBorder = true,
  withGlow = false,
  invisible = false,
}: BentoBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  // Track mouse position for glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Check if device is desktop
    const checkMobile = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkMobile(); // initial check
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    // For Glow
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    if (isDesktop) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (invisible) {
    return (
      <div className={cx("relative flex flex-col group", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cx(
        "relative rounded-3xl overflow-hidden flex flex-col group",
        "bg-theme-void text-theme-text transition-all duration-300",
        withBorder && "border border-theme-border/70",
        isDesktop && "hover:border-[var(--color-theme-accent)]/50",
        // Text lift on hover
        isDesktop && "[&_h1]:transition-transform [&_h2]:transition-transform [&_h3]:transition-transform [&_p]:transition-transform [&_span]:transition-transform hover:[&_h1]:-translate-y-1 hover:[&_h2]:-translate-y-1 hover:[&_h3]:-translate-y-1 hover:[&_p]:-translate-y-1 hover:[&_span]:-translate-y-1",
        className
      )}
    >
      {/* Background radial glow */}
      {isDesktop && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(31,170,104,0.1), transparent 40%)`,
          }}
        />
      )}
      
      {/* Content wrapper */}
      <div 
        className="relative z-10 w-full h-full flex flex-col"
      >
        {children}
      </div>
    </motion.div>
  );
};
