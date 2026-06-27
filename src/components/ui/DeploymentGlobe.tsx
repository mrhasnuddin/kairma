"use client";

import React, { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import { motion, AnimatePresence } from "framer-motion";

interface RouteData {
  id: string;
  role: string;
  location: string;
  modelId: string;
  contextLimit: string;
  promptCost: string;
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

export const DeploymentGlobe = ({ theme = "matrix-mode" }: { theme?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [data, setData] = useState<ModelLayerData | null>(null);
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

    // Center the globe initially on Singapore (hub)
    let currentPhi = -(data.hub.lng * Math.PI) / 180 + 0.5;
    
    // Create markers array including hub
    const markers = [
      { location: [data.hub.lat, data.hub.lng], size: 0.08, id: 'hub' },
      ...data.routes.map(r => ({
        location: [r.marker.lat, r.marker.lng],
        size: 0.05,
        id: r.id
      }))
    ];

    // Create arcs array from hub to deployment nodes
    const arcs = data.routes.map(r => {
      // In-progress = Amber, Active = Green
      const isAmber = r.visualState === "in-progress";
      const color = isAmber ? [0.96, 0.62, 0.04] : [0.12, 0.67, 0.41]; // rgb(245,158,11) vs rgb(31,170,104)
      
      return {
        from: [data.hub.lat, data.hub.lng],
        to: [r.marker.lat, r.marker.lng],
        color,
        id: r.id
      };
    });

    const isLight = theme === "xuan-mode";

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 800,
      height: 800,
      phi: 0,
      theta: 0,
      dark: isLight ? 0 : 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: isLight ? [0.95, 0.95, 0.95] : [0.04, 0.05, 0.04],
      markerColor: [0.12, 0.67, 0.41], // theme-accent
      glowColor: [0.12, 0.67, 0.41],
      arcs: arcs as any,
      arcColor: [0.12, 0.67, 0.41],
      arcWidth: 1.5,
      arcHeight: 0.25,
      markers: markers as any,
      onRender: (state: any) => {
        // Continuous auto-rotation (faster now that React overhead is gone)
        if (pointerInteracting.current === null) {
          currentPhi += 0.005;
        }
        state.phi = currentPhi + pointerInteractionMovement.current;
      },
    } as any);

    return () => {
      globe.destroy();
    };
  }, [data, theme]);

  if (!data) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-theme-accent/30 border-t-theme-accent rounded-full animate-spin" />
      </div>
    );
  }

  const GLOBE_SIZE = 400;

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[400px]">
      <div 
        className="relative cursor-grab active:cursor-grabbing cobe-globe-wrapper" 
        style={{ width: GLOBE_SIZE, height: GLOBE_SIZE, touchAction: "none" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current * 200;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={(e) => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: GLOBE_SIZE,
            height: GLOBE_SIZE,
            contain: "layout paint size",
            opacity: 1,
            transition: "opacity 1s ease",
            cursor: "inherit"
          }}
        />

        {/* CSS Anchor Positioned Markers */}
        {data.routes.map((route) => {
          return (
            <div
              key={route.id}
              className="absolute group cursor-pointer"
              style={{
                positionAnchor: `--cobe-${route.id}`,
                top: "anchor(center)",
                left: "anchor(center)",
                transform: "translate(-50%, -50%)",
                opacity: `var(--cobe-visible-${route.id}, 0)`,
                // Make unclickable when on back of globe
                pointerEvents: "auto",
                zIndex: 20
              } as any}
              onMouseEnter={() => setHoveredRoute(route)}
              onMouseLeave={() => setHoveredRoute(null)}
            >
              <div className="w-8 h-8 rounded-full" />
              
              {/* Tooltip */}
              <AnimatePresence>
                {hoveredRoute === route && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[220px] p-3 bg-theme-void/90 backdrop-blur-md border border-theme-accent/30 rounded shadow-xl pointer-events-none"
                  >
                    <div className="font-mono text-[10px] uppercase tracking-wider mb-2 pb-1 border-b border-theme-border/50 text-theme-accent flex justify-between">
                      <span>{route.role}</span>
                      <span className="opacity-70">{route.location}</span>
                    </div>
                    <div className="space-y-1 font-mono text-[9px] text-theme-text-muted">
                      <div className="flex justify-between"><span className="opacity-70">Model:</span> <span className="text-theme-accent/90 truncate ml-2">{route.modelId}</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Context:</span> <span>{route.contextLimit}</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Cost/M:</span> <span>{route.promptCost}</span></div>
                      <div className="flex justify-between"><span className="opacity-70">Status:</span> <span>{route.visualState === 'in-progress' ? 'Heavy Reasoning' : 'Fast Active'}</span></div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      
      {/* Fallback for browsers without Anchor Positioning support */}
      <style dangerouslySetInnerHTML={{__html: `
        @supports not (position-anchor: --test) {
          .cobe-globe-wrapper .group {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
};
