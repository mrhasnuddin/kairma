"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion, AnimatePresence } from "framer-motion";

interface RouteData {
  role: string;
  status: string;
  routeType: string;
  runtime: string;
  dataBoundary: string;
  marker: { lat: number; lng: number };
  visualState: string;
}

interface ModelLayerData {
  openrouterStatus: string;
  modelLayer: string;
  hub: { label: string; lat: number; lng: number };
  routes: RouteData[];
  metrics: {
    aiRolesMapped: number;
    modelRoutes: string;
    runtimeMode: string;
    pilotReadiness: string;
  };
}

// Math helper for cobe projection
const project = (lat: number, lng: number, phi: number, size: number) => {
  const r = size / 2;
  const latR = (lat * Math.PI) / 180;
  // Cobe's internal map puts lng=0 at the center when phi=0. 
  // It rotates around Y. We subtract PI to align with Cobe's texture offset if needed, or maybe no offset.
  // Actually Cobe's markers use: 
  // x = cos(lat) * sin(lng + phi)
  // y = -sin(lat)
  // z = cos(lat) * cos(lng + phi)
  const lngR = (lng * Math.PI) / 180;
  
  const x = Math.cos(latR) * Math.sin(lngR + phi);
  const y = -Math.sin(latR);
  const z = Math.cos(latR) * Math.cos(lngR + phi);
  
  return {
    x: r + x * r,
    y: r + y * r,
    isFront: z > 0
  };
};

export const DeploymentGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [data, setData] = useState<ModelLayerData | null>(null);
  const [phi, setPhi] = useState(0);
  const [hoveredRoute, setHoveredRoute] = useState<RouteData | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/kairma/model-layer");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch model layer data", err);
      }
    };
    fetchData();
  }, []);

  // Initialize Cobe
  useEffect(() => {
    if (!canvasRef.current || !data) return;

    let currentPhi = 0;
    
    // Create markers array including hub
    const markers = [
      { location: [data.hub.lat, data.hub.lng], size: 0.08 },
      ...data.routes.map(r => ({
        location: [r.marker.lat, r.marker.lng],
        size: 0.05
      }))
    ];

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.04, 0.05, 0.04],
      markerColor: [0.12, 0.67, 0.41], // theme-accent
      glowColor: [0.12, 0.67, 0.41],
      markers: markers as any,
      onRender: (state: any) => {
        // Slow auto-rotation
        state.phi = currentPhi;
        currentPhi += 0.003;
        setPhi(currentPhi);
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, [data]);

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin" />
      </div>
    );
  }

  const GLOBE_SIZE = 400; // Logical pixels (width/2 of 800 physical pixels)
  const hubPos = project(data.hub.lat, data.hub.lng, phi, GLOBE_SIZE);

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="relative" style={{ width: GLOBE_SIZE, height: GLOBE_SIZE }}>
        
        <canvas
          ref={canvasRef}
          style={{
            width: GLOBE_SIZE,
            height: GLOBE_SIZE,
            contain: "layout paint size",
            opacity: 1,
            transition: "opacity 1s ease",
          }}
        />

        {/* SVG Arcs Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          {data.routes.map((route, idx) => {
            const destPos = project(route.marker.lat, route.marker.lng, phi, GLOBE_SIZE);
            
            // Only draw arc if both points are at least partially on the front, or just let them fade out
            const isVisible = destPos.isFront || hubPos.isFront;
            if (!isVisible) return null;

            // Simple cubic bezier curve sticking out slightly from the globe surface
            const dx = destPos.x - hubPos.x;
            const dy = destPos.y - hubPos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Control points pull outward from the center of the globe (GLOBE_SIZE/2)
            const cx = GLOBE_SIZE / 2;
            const cy = GLOBE_SIZE / 2;
            
            const midX = (hubPos.x + destPos.x) / 2;
            const midY = (hubPos.y + destPos.y) / 2;
            
            // Push middle point outwards from center
            const pushOut = dist * 0.3;
            const angleFromCenter = Math.atan2(midY - cy, midX - cx);
            
            const cpX = midX + Math.cos(angleFromCenter) * pushOut;
            const cpY = midY + Math.sin(angleFromCenter) * pushOut;

            let strokeColor = "rgba(31, 170, 104, 0.8)"; // green
            let strokeDasharray = "none";
            let animateClass = "";

            if (route.visualState === "in-progress") {
              strokeDasharray = "4 4";
              animateClass = "animate-[dash_2s_linear_infinite]";
            } else if (route.visualState === "in-development") {
              strokeColor = "rgba(245, 158, 11, 0.8)"; // amber
              animateClass = "animate-pulse";
            } else if (route.visualState === "inactive") {
              strokeColor = "rgba(255, 255, 255, 0.2)";
            }

            return (
              <path
                key={idx}
                d={`M ${hubPos.x} ${hubPos.y} Q ${cpX} ${cpY} ${destPos.x} ${destPos.y}`}
                fill="none"
                stroke={strokeColor}
                strokeWidth={1.5}
                strokeDasharray={strokeDasharray}
                className={`transition-opacity duration-500 ${animateClass}`}
                style={{ opacity: (destPos.isFront && hubPos.isFront) ? 1 : 0.2 }}
              />
            );
          })}
        </svg>

        {/* HTML Markers and Tooltips */}
        {data.routes.map((route, idx) => {
          const destPos = project(route.marker.lat, route.marker.lng, phi, GLOBE_SIZE);
          
          if (!destPos.isFront) return null;

          return (
            <div
              key={idx}
              className="absolute group cursor-pointer"
              style={{
                left: destPos.x,
                top: destPos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 20
              }}
              onMouseEnter={() => setHoveredRoute(route)}
              onMouseLeave={() => setHoveredRoute(null)}
            >
              {/* Invisible hit area for easier hover */}
              <div className="w-6 h-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
              
              {/* Tooltip */}
              <AnimatePresence>
                {hoveredRoute === route && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-theme-void/90 backdrop-blur-md border border-theme-accent/30 rounded shadow-xl pointer-events-none"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider mb-2 pb-1 border-b border-theme-border/50 text-theme-accent">
                      {route.role}
                    </div>
                    <div className="space-y-1 font-mono text-[9px] text-theme-text-muted">
                      <div className="flex justify-between"><span className="opacity-70">Status:</span> <span>{route.status}</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Route:</span> <span>{route.routeType}</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Runtime:</span> <span>{route.runtime}</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Data:</span> <span>{route.dataBoundary}</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
      `}} />
    </div>
  );
};
