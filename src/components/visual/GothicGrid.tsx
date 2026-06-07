import React from "react";

interface GothicGridProps {
  className?: string;
  opacity?: number;
}

export const GothicGrid: React.FC<GothicGridProps> = ({
  className = "",
  opacity = 0.08,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Repeating technical grid */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--theme-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--theme-border) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Gothic Vault and Arch geometrical lines */}
      <svg
        className="absolute inset-0 w-full h-full text-theme-accent transition-colors duration-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        {/* Major Gothic Arches */}
        <path
          d="M 50,1000 C 50,450 300,100 500,50 C 700,100 950,450 950,1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <path
          d="M 150,1000 C 150,550 350,200 500,150 C 650,200 850,550 850,1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />
        <path
          d="M 250,1000 C 250,650 400,300 500,250 C 600,300 750,650 750,1000"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />

        {/* Diagonal Rib Crossings */}
        <line
          x1="0"
          y1="0"
          x2="1000"
          y2="1000"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="12 6"
        />
        <line
          x1="1000"
          y1="0"
          x2="0"
          y2="1000"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="12 6"
        />

        {/* Concentric Rose Window Geometry */}
        <circle
          cx="500"
          cy="450"
          r="80"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <circle
          cx="500"
          cy="450"
          r="180"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="6 6"
        />
        <circle
          cx="500"
          cy="450"
          r="280"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        />

        {/* Technical crosshairs and registration marks */}
        <path
          d="M 40,40 L 100,40 M 40,40 L 40,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 960,40 L 900,40 M 960,40 L 960,100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 40,960 L 100,960 M 40,960 L 40,900"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M 960,960 L 900,960 M 960,960 L 960,9900"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* Horizontal center fine line with tick marks */}
        <line
          x1="100"
          y1="500"
          x2="900"
          y2="500"
          stroke="currentColor"
          strokeWidth="0.25"
        />
        <line
          x1="500"
          y1="100"
          x2="500"
          y2="900"
          stroke="currentColor"
          strokeWidth="0.25"
        />
      </svg>
    </div>
  );
};

export default GothicGrid;
