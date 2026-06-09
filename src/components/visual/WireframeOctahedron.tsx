"use client";

import React, { useEffect, useRef, useState } from "react";

interface WireframeOctahedronProps {
  speed?: number;
  className?: string;
}

export const WireframeOctahedron: React.FC<WireframeOctahedronProps> = ({
  speed = 0.012,
  className = "",
}) => {
  const [angle, setAngle] = useState(0);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      setAngle((prev) => (prev + speed) % (Math.PI * 2));
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [speed]);

  // ViewBox coordinate space: 200 x 200
  const cx = 100;
  const cy = 100;
  // Dynamic scale to make the octahedron fill 75% of the SVG viewport
  const scale = 75;

  // Base vertices of a 3D octahedron (double pyramid)
  const baseVertices = [
    [0, -1.15, 0], // 0: Top
    [0, 1.15, 0],  // 1: Bottom
    [1, 0, 0],     // 2: Right
    [-1, 0, 0],    // 3: Left
    [0, 0, 1],     // 4: Front
    [0, 0, -1],    // 5: Back
  ];

  // Dual-axis rotation with premium organic wobble
  // We use two sine waves to modulate the X-axis tilt over time
  const tiltX = 0.45 + Math.sin(angle * 0.3) * 0.15;
  const tiltY = angle;

  // Rotate and project vertices to 2D
  const rotated = baseVertices.map(([x, y, z]) => {
    // 1. Rotate around Y-axis (spin)
    let x1 = x * Math.cos(tiltY) + z * Math.sin(tiltY);
    let y1 = y;
    let z1 = -x * Math.sin(tiltY) + z * Math.cos(tiltY);

    // 2. Rotate around X-axis (tilt)
    let x2 = x1;
    let y2 = y1 * Math.cos(tiltX) - z1 * Math.sin(tiltX);
    let z2 = y1 * Math.sin(tiltX) + z1 * Math.cos(tiltX);

    return [cx + x2 * scale, cy + y2 * scale];
  });

  const edges = [
    [0, 2], [0, 3], [0, 4], [0, 5], // Top pyramid edges
    [1, 2], [1, 3], [1, 4], [1, 5], // Bottom pyramid edges
    [2, 4], [4, 3], [3, 5], [5, 2], // Middle belt edges
  ];

  return (
    <div className={`w-full h-full select-none ${className}`}>
      <svg
        viewBox="0 0 200 200"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full text-theme-accent opacity-90 block"
      >
        {/* HUD Outer Target Box Brackets */}
        <g stroke="currentColor" strokeWidth="0.8" fill="none" className="opacity-40" style={{ vectorEffect: "non-scaling-stroke" }}>
          {/* Top Left */}
          <path d="M 6,18 L 6,6 L 18,6" style={{ vectorEffect: "non-scaling-stroke" }} />
          {/* Top Right */}
          <path d="M 194,18 L 194,6 L 182,6" style={{ vectorEffect: "non-scaling-stroke" }} />
          {/* Bottom Left */}
          <path d="M 6,182 L 6,194 L 18,194" style={{ vectorEffect: "non-scaling-stroke" }} />
          {/* Bottom Right */}
          <path d="M 194,182 L 194,194 L 182,194" style={{ vectorEffect: "non-scaling-stroke" }} />
        </g>

        {/* Concentric Radar Grid Rings */}
        <circle
          cx={cx}
          cy={cy}
          r="95"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="2 6"
          className="opacity-15"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
        <circle
          cx={cx}
          cy={cy}
          r="75"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeDasharray="4 4"
          className="opacity-25"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />
        <circle
          cx={cx}
          cy={cy}
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-10"
          style={{ vectorEffect: "non-scaling-stroke" }}
        />

        {/* Crosshair lines */}
        <g stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 8" className="opacity-20" style={{ vectorEffect: "non-scaling-stroke" }}>
          <line x1="10" y1="100" x2="190" y2="100" style={{ vectorEffect: "non-scaling-stroke" }} />
          <line x1="100" y1="10" x2="100" y2="190" style={{ vectorEffect: "non-scaling-stroke" }} />
        </g>

        {/* Center Target Dot */}
        <circle cx={cx} cy={cy} r="2.5" fill="currentColor" className="opacity-95" />
        <circle
          cx={cx}
          cy={cy}
          r="6"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="opacity-40 animate-ping"
          style={{ animationDuration: "3.5s", vectorEffect: "non-scaling-stroke" }}
        />

        {/* 3D Wireframe Edges */}
        {edges.map(([p1, p2], idx) => (
          <line
            key={idx}
            x1={rotated[p1][0]}
            y1={rotated[p1][1]}
            x2={rotated[p2][0]}
            y2={rotated[p2][1]}
            stroke="currentColor"
            strokeWidth="0.8"
            className="opacity-75"
            style={{ vectorEffect: "non-scaling-stroke" }}
          />
        ))}

        {/* Vertices (Glowing Nodes) */}
        {rotated.map(([vx, vy], idx) => (
          <g key={idx}>
            <circle
              cx={vx}
              cy={vy}
              r="2.2"
              fill="var(--theme-void)"
              stroke="currentColor"
              strokeWidth="0.8"
              style={{ vectorEffect: "non-scaling-stroke" }}
            />
            {/* Soft outer glow dot */}
            <circle
              cx={vx}
              cy={vy}
              r="4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.25"
              className="opacity-30"
              style={{ vectorEffect: "non-scaling-stroke" }}
            />
          </g>
        ))}

        {/* Sub-HUD status readouts (corner text) */}
        <g fill="currentColor" fontSize="5" fontFamily="monospace" className="opacity-40 select-none">
          <text x="12" y="15">SYS.ACTIVE</text>
          <text x="12" y="188">θ: {(angle * (180 / Math.PI)).toFixed(0)}°</text>
          <text x="188" y="15" textAnchor="end">X86.OS</text>
          <text x="188" y="188" textAnchor="end">Q_STATE</text>
        </g>
      </svg>
    </div>
  );
};

export default WireframeOctahedron;
