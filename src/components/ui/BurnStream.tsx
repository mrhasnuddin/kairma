"use client";
import React, { useEffect, useState } from "react";

export function BurnStream() {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    const hex = "0123456789ABCDEF";
    const symbols = "$¥€£%!";
    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      const newLines = Array.from({ length: 6 }).map(() => {
        let str = "";
        for (let i = 0; i < 24; i++) {
          if (Math.random() > 0.8) {
            str += symbols[Math.floor(Math.random() * symbols.length)];
          } else {
            str += hex[Math.floor(Math.random() * hex.length)];
          }
        }
        return str;
      });
      setLines(newLines);
      timeoutId = setTimeout(tick, 60);
    };

    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-center overflow-hidden opacity-20 pointer-events-none relative my-4">
      {/* Gradient mask to fade out top and bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0E0B] via-transparent to-[#0B0E0B] z-10" />
      
      {lines.map((line, i) => (
        <div 
          key={i} 
          className="font-mono text-xs tracking-[0.3em] text-theme-accent whitespace-nowrap overflow-hidden opacity-80"
        >
          {line}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <span className="text-theme-accent font-mono text-xs tracking-widest bg-[#0B0E0B] px-2 py-1 border border-theme-accent/20">
          DATA_BLEED_ACTIVE
        </span>
      </div>
    </div>
  );
}
