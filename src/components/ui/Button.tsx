"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "flat";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  const baseStyle = "font-mono uppercase tracking-wider relative overflow-hidden transition-all duration-200 select-none cursor-pointer flex items-center justify-center rounded-xs outline-none focus-visible:ring-1 focus-visible:ring-theme-accent";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-[10px]",
    md: "px-5 py-2 text-xs",
    lg: "px-7 py-3 text-sm font-bold",
  };

  const variantStyles = {
    primary: "bg-theme-accent text-theme-void border border-theme-accent hover:bg-theme-accent/90 hover:shadow-[0_0_12px_var(--theme-border-glow)] active:scale-98",
    secondary: "bg-theme-void text-theme-text border border-theme-border hover:border-theme-accent hover:text-theme-accent active:scale-98",
    outline: "bg-transparent text-theme-text border border-theme-border hover:border-theme-accent hover:bg-theme-accent/5 active:scale-98",
    flat: "bg-transparent text-theme-text-muted hover:text-theme-text hover:bg-theme-border/20",
  };

  return (
    <button
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Tiny decorative elements on corners for buttons */}
      {variant !== "flat" && (
        <>
          <span className="absolute top-0 left-0 w-1 h-1 bg-theme-chrome/40" />
          <span className="absolute top-0 right-0 w-1 h-1 bg-theme-chrome/40" />
          <span className="absolute bottom-0 left-0 w-1 h-1 bg-theme-chrome/40" />
          <span className="absolute bottom-0 right-0 w-1 h-1 bg-theme-chrome/40" />
        </>
      )}
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </button>
  );
};

export default Button;
