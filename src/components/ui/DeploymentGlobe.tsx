"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import createGlobe from "cobe";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

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
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);

  const handleNextRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data) return;
    const currentIndex = data.routes.findIndex((r) => r.id === selectedRoute?.id);
    const nextIndex = (currentIndex + 1) % data.routes.length;
    setSelectedRoute(data.routes[nextIndex]);
  };

  const handlePrevRoute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!data) return;
    const currentIndex = data.routes.findIndex((r) => r.id === selectedRoute?.id);
    const prevIndex = (currentIndex - 1 + data.routes.length) % data.routes.length;
    setSelectedRoute(data.routes[prevIndex]);
  };
  
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

    // Create markers array mapping only the active routes (no static hub marker to prevent overlapping / buggy ocean dot)
    const markers = data.routes.map(r => ({
      location: [r.marker.lat, r.marker.lng],
      size: 0.05,
      id: r.id
    }));

    const isLight = theme === "xuan-mode";
    const GLOBE_RESOLUTION = 720; // 360 * 2
    
    // Theme-compatible colors
    // Light mode uses Green #00492E -> [0, 0.286, 0.18]
    // Dark mode uses Red #C9402B -> [0.788, 0.251, 0.169]
    const markerColor = isLight ? [0, 0.286, 0.18] : [0.788, 0.251, 0.169];
    const glowColor = isLight ? [0, 0.286, 0.18] : [0.788, 0.251, 0.169];

    // Dotted area (countries) baseColor: slightly light color to contrast background and accent
    const baseColor = isLight ? [0.75, 0.85, 0.8] : [0.35, 0.15, 0.12];

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: GLOBE_RESOLUTION,
      height: GLOBE_RESOLUTION,
      phi: currentPhi,
      theta: currentTheta,
      dark: isLight ? 0 : 1, // 0 makes inner fill white, 1 makes it dark (matches background)
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6, // Match official example brightness
      baseColor: baseColor as any, 
      markerColor: markerColor as any, 
      glowColor: glowColor as any,
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

    // Delta-time based animation loop to fix frame-rate jitter
    let lastTime = performance.now();
    let animationFrameId: number;
    
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Pause rotation if dragging OR if the user is hovering over a dot
      if (!isDragging && !isHoveredRef.current) {
        // 0.00018 radians per millisecond (approx 0.003 radians per frame at 60fps)
        // This is the sweet spot: slightly faster but buttery smooth
        currentPhi += 0.00018 * delta; 
        globe.update({
          phi: currentPhi,
          theta: currentTheta
        });
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

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
              className={`absolute group cursor-none anchor-${route.id} w-12 h-12 flex items-center justify-center rounded-full`}
              onClick={() => setSelectedRoute(route)}
              onPointerMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                e.currentTarget.style.setProperty('--mx', `${x * 0.6}px`);
                e.currentTarget.style.setProperty('--my', `${y * 0.6}px`);
              }}
              onMouseEnter={() => {
                setHoveredRoute(route);
                isHoveredRef.current = true;
              }}
              onMouseLeave={(e) => {
                setHoveredRoute(null);
                isHoveredRef.current = false;
                e.currentTarget.style.setProperty('--mx', `0px`);
                e.currentTarget.style.setProperty('--my', `0px`);
              }}
              style={{
                position: "absolute",
                top: "anchor(center)",
                left: "anchor(center)",
                transform: "translate(-50%, -50%)",
                opacity: `var(--cobe-visible-${route.id}, 0)`,
                pointerEvents: `var(--cobe-visible-${route.id}, none)`, 
                zIndex: 20
              } as any}
            >
              {/* Fixed Center Container (Dot & Pulse) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Visible pulsing marker dot */}
                <div className="absolute w-5 h-5 bg-theme-accent/40 rounded-full animate-ping" />
                {/* Inner solid dot (stays fixed, scales on hover) */}
                <div className="relative w-2.5 h-2.5 bg-theme-accent rounded-full border border-theme-void shadow-[0_0_8px_rgba(31,170,104,0.8)] transition-transform duration-300 ease-out group-hover:scale-125" />
              </div>

              {/* Magnetic Custom Cursor Box */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ 
                  transform: 'translate(var(--mx, 0px), var(--my, 0px))',
                  transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="relative w-8 h-8 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out">
                  {/* Top-left bracket */}
                  <div className="absolute -top-[1px] -left-[1px] w-2.5 h-[1px] bg-theme-accent" />
                  <div className="absolute -top-[1px] -left-[1px] w-[1px] h-2.5 bg-theme-accent" />
                  
                  {/* Bottom-right bracket */}
                  <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-[1px] bg-theme-accent" />
                  <div className="absolute -bottom-[1px] -right-[1px] w-[1px] h-2.5 bg-theme-accent" />
                </div>
              </div>
              
              {/* Tooltip positioned below the dot to prevent clipping */}
              <AnimatePresence>
                {hoveredRoute === route && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-[280px] p-4 bg-theme-void/90 backdrop-blur-md border border-theme-accent/30 rounded shadow-xl pointer-events-none z-[100]"
                  >
                    <div className="font-mono text-xs uppercase tracking-wider mb-2.5 pb-1.5 border-b border-theme-border/50 text-theme-accent flex justify-between">
                      <span>{route.role}</span>
                      <span className="opacity-70">{route.location}</span>
                    </div>
                    <div className="space-y-1.5 font-mono text-xs text-theme-text-muted">
                      <div className="flex justify-between"><span className="opacity-70">Model:</span> <span className="text-theme-accent/90 truncate ml-4 max-w-[180px]">{route.modelId}</span></div>
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
        .anchor-route-4 { position-anchor: --cobe-route-4; }
        .anchor-route-5 { position-anchor: --cobe-route-5; }
        .anchor-route-6 { position-anchor: --cobe-route-6; }
        .anchor-route-7 { position-anchor: --cobe-route-7; }

        @supports not (position-anchor: --test) {
          .cobe-globe-wrapper .group {
            display: none !important;
          }
        }
      `}} />

      {/* Node Detail Popup Modal - Rendered via Portal to escape overflow-hidden containers */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedRoute && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-theme-void/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
              onClick={() => setSelectedRoute(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 15, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 15, opacity: 0 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-theme-void border border-theme-border/60 rounded-2xl w-full max-w-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(31,170,104,0.15)] relative overflow-hidden font-mono"
                onClick={(e) => e.stopPropagation()}
              >
                {/* CRT Scanline Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_3px] opacity-30 pointer-events-none z-0 mix-blend-overlay" />
                
                {/* CRT Moving Scan Bar */}
                <motion.div 
                  className="absolute left-0 right-0 h-[80px] bg-gradient-to-b from-transparent via-theme-accent/5 to-transparent pointer-events-none z-0 mix-blend-screen"
                  initial={{ top: "-80px" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                {/* Close Button */}
                <button 
                  onClick={() => setSelectedRoute(null)}
                  className="absolute top-4 right-4 p-2 text-theme-text-muted hover:text-theme-accent transition-colors rounded-full border border-theme-border/40 hover:border-theme-accent/40 bg-theme-void z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header Section */}
                <div className="mb-8 border-b border-theme-border/20 pb-5 pr-10 flex justify-between items-end relative z-10">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-theme-accent shadow-[0_0_8px_var(--color-theme-accent)] animate-pulse" />
                      <span className="text-[10px] md:text-xs text-theme-accent font-bold uppercase tracking-widest bg-theme-accent/10 px-2 py-0.5 rounded">
                        Node Active
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-theme-text tracking-tight uppercase mb-1">{selectedRoute.role}</h2>
                    <p className="text-theme-text-muted text-sm uppercase tracking-wider">{selectedRoute.location}</p>
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center gap-2 mb-1">
                    <button onClick={handlePrevRoute} className="p-2 border border-theme-border/30 rounded hover:border-theme-accent/50 hover:text-theme-accent text-theme-text-muted transition-colors">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={handleNextRoute} className="p-2 border border-theme-border/30 rounded hover:border-theme-accent/50 hover:text-theme-accent text-theme-text-muted transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 relative z-10">
                  <div className="bg-theme-void/50 border border-theme-border/20 rounded-xl p-4 md:p-6 flex flex-col gap-2">
                    <span className="text-[10px] md:text-xs text-theme-text-muted uppercase tracking-widest">Model Engine</span>
                    <div className="flex items-end gap-2">
                      <span className="text-lg md:text-xl font-bold text-theme-text">{selectedRoute.modelId}</span>
                    </div>
                  </div>

                  <div className="bg-theme-void/50 border border-theme-border/20 rounded-xl p-4 md:p-6 flex flex-col gap-2">
                    <span className="text-[10px] md:text-xs text-theme-text-muted uppercase tracking-widest">Context Window</span>
                    <div className="flex items-end gap-2">
                      <span className="text-lg md:text-xl font-bold text-theme-text">{selectedRoute.contextLimit}</span>
                    </div>
                  </div>

                  <div className="bg-theme-void/50 border border-theme-border/20 rounded-xl p-4 md:p-6 flex flex-col gap-2">
                    <span className="text-[10px] md:text-xs text-theme-text-muted uppercase tracking-widest">Est. Cost / 1M</span>
                    <div className="flex items-end gap-2">
                      <span className="text-lg md:text-xl font-bold text-theme-accent">{selectedRoute.promptCost}</span>
                    </div>
                  </div>

                  <div className="bg-theme-void/50 border border-theme-border/20 rounded-xl p-4 md:p-6 flex flex-col gap-2">
                    <span className="text-[10px] md:text-xs text-theme-text-muted uppercase tracking-widest">Runtime State</span>
                    <div className="flex items-end gap-2">
                      <span className="text-lg md:text-xl font-bold text-theme-text capitalize">{selectedRoute.visualState.replace("-", " ")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
