"use client";

import React from "react";
import { motion } from "framer-motion";

export const DeploymentCanvas = ({ isFast = false }: { isFast?: boolean }) => {
  const speedMult = isFast ? 0.3 : 1;

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden rounded-3xl bg-theme-void border-[1px] border-theme-border/30 flex items-center justify-center">
      
      {/* Background Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0" 
        style={{
          backgroundImage: "radial-gradient(var(--color-theme-text) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
      
      <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
        
        {/* Animated Routes */}
        <motion.path
          d="M 100,200 C 200,100 300,300 400,200 S 600,100 700,200"
          fill="transparent"
          stroke="var(--color-theme-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-30"
        />
        <motion.path
          d="M 100,200 C 200,100 300,300 400,200 S 600,100 700,200"
          fill="transparent"
          stroke="var(--color-theme-accent)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 4 * speedMult, repeat: Infinity, ease: "linear" }}
        />

        <motion.path
          d="M 200,300 C 350,350 450,100 600,150"
          fill="transparent"
          stroke="var(--color-theme-accent)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-20"
        />
        <motion.path
          d="M 200,300 C 350,350 450,100 600,150"
          fill="transparent"
          stroke="var(--color-theme-accent)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 3.5 * speedMult, delay: 1 * speedMult, repeat: Infinity, ease: "linear" }}
        />

        {/* Nodes */}
        {/* Node 1: Origin */}
        <g transform="translate(100, 200)">
          <circle r="4" fill="var(--color-theme-text)" className="opacity-50" />
          <motion.circle r="12" fill="transparent" stroke="var(--color-theme-accent)" strokeWidth="1" animate={{ scale: [1, 2], opacity: [0.8, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          <text x="-10" y="-15" fill="var(--color-theme-text)" fontSize="10" fontFamily="monospace" opacity="0.6">CORE_OS</text>
        </g>

        {/* Node 2 */}
        <g transform="translate(400, 200)">
          <circle r="6" fill="var(--color-theme-accent)" />
          <motion.circle r="16" fill="transparent" stroke="var(--color-theme-accent)" strokeWidth="1" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
          <rect x="-35" y="-28" width="70" height="16" fill="var(--color-theme-accent)" fillOpacity="0.1" rx="2" stroke="var(--color-theme-accent)" strokeWidth="0.5" />
          <text x="0" y="-17" fill="var(--color-theme-accent)" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">KOL BD</text>
        </g>

        {/* Node 3 */}
        <g transform="translate(700, 200)">
          <circle r="4" fill="var(--color-theme-text)" className="opacity-50" />
          <text x="-25" y="-15" fill="var(--color-theme-text)" fontSize="10" fontFamily="monospace" opacity="0.6">CONTENT</text>
        </g>

        {/* Node 4 */}
        <g transform="translate(600, 150)">
          <circle r="6" fill="var(--color-theme-accent)" />
          <motion.circle r="16" fill="transparent" stroke="var(--color-theme-accent)" strokeWidth="1" animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ duration: 2, delay: 1.5, repeat: Infinity }} />
          <rect x="-40" y="-28" width="80" height="16" fill="var(--color-theme-accent)" fillOpacity="0.1" rx="2" stroke="var(--color-theme-accent)" strokeWidth="0.5" />
          <text x="0" y="-17" fill="var(--color-theme-accent)" fontSize="8" fontFamily="monospace" textAnchor="middle" letterSpacing="1">COMPLIANCE</text>
        </g>
      </svg>
      
      {/* Ambient foreground glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-theme-accent)_0%,_transparent_70%)] opacity-[0.03] z-20 mix-blend-screen pointer-events-none" />
      
      {/* Status Overlay */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse shadow-[0_0_8px_var(--color-theme-accent)]" />
          <span className="font-mono text-[10px] text-theme-accent uppercase tracking-widest">AGENT OS ONLINE</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <div className="w-1 h-1 rounded-full bg-theme-text" />
          <span className="font-mono text-[9px] text-theme-text uppercase tracking-widest">DATA ROUTING</span>
        </div>
      </div>
    </div>
  );
};
