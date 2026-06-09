import React from "react";

interface VoidBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export const VoidBackground: React.FC<VoidBackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`relative min-h-screen w-full bg-theme-void transition-colors duration-500 overflow-hidden ${className}`}
    >
      {/* Background Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 transition-all duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, var(--theme-border-glow) 0%, transparent 80%)`,
        }}
      />

      {/* Ambient corner glows */}
      <div
        className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10 filter blur-[100px] transition-all duration-500"
        style={{
          background: "var(--theme-accent)",
        }}
      />
      <div
        className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10 filter blur-[100px] transition-all duration-500"
        style={{
          background: "var(--theme-accent)",
        }}
      />

      {/* Main layout container */}
      <div className="relative z-10 w-full flex-1 min-h-0 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default VoidBackground;
