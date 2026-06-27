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
  const [data, setData] = useState<ModelLayerData | null>(null);
  const [hoveredRoute, setHoveredRoute] = useState<RouteData | null>(null);
  
  // Track hovered state in ref so the animation loop can read it instantly on every frame
  const isHoveredRef = useRef(false);

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

  // Initialize Cobe & Event Listeners
  useEffect(() => {
    if (!canvasRef.current || !data) return;

    let currentPhi = -(data.hub.lng * Math.PI) / 180 + 0.5;
    let currentTheta = 0;
    
    // Drag state variables
    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;

    // Create markers array including hub
    const markers = [
      { location: [data.hub.lat, data.hub.lng], size: 0.08, id: 'hub' },
      ...data.routes.map(r => ({
        location: [r.marker.lat, r.marker.lng],
        size: 0.05,
        id: r.id
      }))
    ];

    const isLight = theme === "xuan-mode";
    const GLOBE_RESOLUTION = 720; // 360 * 2

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: GLOBE_RESOLUTION,
      height: GLOBE_RESOLUTION,
      phi: currentPhi,
      theta: currentTheta,
      dark: isLight ? 0 : 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6, // Match official example brightness
      // baseColor determines the color of the land dots in dark mode.
      // We set it to a bright green [0.3, 0.8, 0.4] so the green dots stand out.
      baseColor: isLight ? [0.95, 0.95, 0.95] : [0.3, 0.8, 0.4], 
      markerColor: [0.12, 0.67, 0.41], // theme-accent green
      glowColor: [0.12, 0.67, 0.41],
      markers: markers as any,
    });

    const canvasContainer = canvasRef.current.parentElement;
    if (!canvasContainer) return;

    // Pointer events for dragging
    const onPointerDown = (e: PointerEvent) => {
      canvasContainer.setPointerCapture(e.pointerId);
      isDragging = true;
      startX = e.clientX;
      dragOffset = 0;
      canvasContainer.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const delta = e.clientX - startX;
      dragOffset = delta / 200;
      globe.update({
        phi: currentPhi + dragOffset,
        theta: currentTheta
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      canvasContainer.releasePointerCapture(e.pointerId);
      isDragging = false;
      currentPhi += dragOffset;
      canvasContainer.style.cursor = 'grab';
    };

    canvasContainer.addEventListener('pointerdown', onPointerDown);
    canvasContainer.addEventListener('pointermove', onPointerMove);
    canvasContainer.addEventListener('pointerup', onPointerUp);
    canvasContainer.addEventListener('pointercancel', onPointerUp);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      // Pause rotation if dragging OR if the user is hovering over a dot
      if (!isDragging && !isHoveredRef.current) {
        currentPhi += 0.005; // Continuous auto-rotation speed
        globe.update({
          phi: currentPhi,
          theta: currentTheta
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvasContainer.removeEventListener('pointerdown', onPointerDown);
      canvasContainer.removeEventListener('pointermove', onPointerMove);
      canvasContainer.removeEventListener('pointerup', onPointerUp);
      canvasContainer.removeEventListener('pointercancel', onPointerUp);
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

  const GLOBE_SIZE = 360;

  return (
    <div className="relative w-full h-full flex items-center justify-center min-h-[360px]">
      <div 
        className="relative cursor-grab active:cursor-grabbing cobe-globe-wrapper" 
        style={{ width: GLOBE_SIZE, height: GLOBE_SIZE, touchAction: "none" }}
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
              className={`absolute group cursor-pointer anchor-${route.id}`}
              style={{
                position: "absolute",
                top: "anchor(center)",
                left: "anchor(center)",
                transform: "translate(-50%, -50%)",
                opacity: `var(--cobe-visible-${route.id}, 0)`,
                // CSS Hack: makes pointer events none on the back side of the globe
                pointerEvents: `var(--cobe-visible-${route.id}, none)`, 
                zIndex: 20
              } as any}
              onMouseEnter={() => {
                setHoveredRoute(route);
                isHoveredRef.current = true;
              }}
              onMouseLeave={() => {
                setHoveredRoute(null);
                isHoveredRef.current = false;
              }}
            >
              {/* Visible pulsing marker dot to match Cobe official style with pulse */}
              <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <div className="absolute w-5 h-5 bg-theme-accent/40 rounded-full animate-ping pointer-events-none" />
                {/* Inner solid dot */}
                <div className="relative w-2.5 h-2.5 bg-theme-accent rounded-full border border-theme-void shadow-[0_0_8px_rgba(31,170,104,0.8)] transition-transform duration-200 group-hover:scale-125" />
              </div>
              
              {/* Invisible larger hit area for easier hover */}
              <div className="absolute w-8 h-8 -top-3 -left-3 rounded-full" />
              
              {/* Tooltip positioned below the dot to prevent clipping */}
              <AnimatePresence>
                {hoveredRoute === route && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[220px] p-3 bg-theme-void/90 backdrop-blur-md border border-theme-accent/30 rounded shadow-xl pointer-events-none"
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
      
      {/* Dynamic positioning classes for CSS Anchors to bypass React's style validator */}
      <style dangerouslySetInnerHTML={{__html: `
        .anchor-route-0 { position-anchor: --cobe-route-0; }
        .anchor-route-1 { position-anchor: --cobe-route-1; }
        .anchor-route-2 { position-anchor: --cobe-route-2; }
        .anchor-route-3 { position-anchor: --cobe-route-3; }

        @supports not (position-anchor: --test) {
          .cobe-globe-wrapper .group {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
};
