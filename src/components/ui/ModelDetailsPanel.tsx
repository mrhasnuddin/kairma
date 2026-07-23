import React, { useEffect, useState } from "react";
import { X, Cpu, Code, Zap, Database, Clock, Activity, Server, Hash } from "lucide-react";
import { ModelData, Tier, TIER_META } from "./NeuralPipelineHUD";
import { ProviderMark } from "./NeuralPipelineHUD"; // Wait, I might need to move ProviderMark or import it

// Simple typewriter effect for the CRT vibe
const TypedLine: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);
  return (
    <span>
      {displayed}
      <span className="animate-pulse">_</span>
    </span>
  );
};

interface ModelDetailsPanelProps {
  m: ModelData | null;
  tier: Tier | null;
  onClose: () => void;
  deriveProvider: (m: ModelData) => string;
}

export const ModelDetailsPanel: React.FC<ModelDetailsPanelProps> = ({ m, tier, onClose, deriveProvider }) => {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (m) {
      // Trigger entrance animation
      setIsAnimatingIn(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimatingIn(true));
      });
    }
  }, [m]);

  if (!m) return null;

  const costPer1M = (val?: string | null) => (val && Number(val) > 0 ? `$${(Number(val) * 1000000).toFixed(2)}` : "Free");

  const inputCost = costPer1M(m.pricing?.prompt);
  const outputCost = costPer1M(m.pricing?.completion);
  
  // Matrix / CRT transition classes
  const panelTransform = isAnimatingIn ? "translate-x-0 opacity-100" : "translate-x-full opacity-0";
  const backdropOpacity = isAnimatingIn ? "opacity-100" : "opacity-0";

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-theme-void/80 backdrop-blur-sm transition-opacity duration-500 ease-out ${backdropOpacity}`}
        onClick={onClose}
      />
      
      {/* Slide-out Panel with CRT Vibe */}
      <div 
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[500px] border-l border-theme-accent/50 bg-theme-void shadow-2xl shadow-theme-accent/20 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${panelTransform}`}
        style={{
          boxShadow: isAnimatingIn ? "inset 0 0 120px rgba(var(--color-theme-accent), 0.05)" : "none",
        }}
      >
        {/* CRT Scanline overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay" />
        
        <div className="relative z-10 p-6 flex flex-col h-full font-mono">
          
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-theme-border/40">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl border border-theme-accent/50 flex items-center justify-center bg-theme-accent/5 shadow-[0_0_15px_rgba(var(--color-theme-accent),0.2)]">
                {/* We'll pass the icon or provider mark */}
                <span className="text-theme-accent text-2xl font-bold">
                  {deriveProvider(m).charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-theme-text tracking-wide flex items-center gap-2">
                  {m.name}
                  {tier && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-theme-accent text-theme-void uppercase">{TIER_META[tier].label}</span>}
                </h2>
                <div className="text-xs text-theme-text-muted mt-1 flex items-center gap-2">
                  <span>{deriveProvider(m)}</span>
                  <span className="w-1 h-1 rounded-full bg-theme-border" />
                  <span className="font-mono text-theme-accent/80">{m.id}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-theme-border/20 text-theme-text-muted hover:text-theme-accent transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto py-6 space-y-8 no-scrollbar">
            
            {/* Top Cards (Latency, Throughput, Uptime) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-theme-border/30 bg-theme-accent/[0.02] flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5"><Clock size={12}/> Latency</span>
                <span className="text-lg font-bold text-theme-text">{m.ttft ? `${m.ttft.toFixed(2)}s` : "—"}</span>
              </div>
              <div className="p-3 rounded-lg border border-theme-border/30 bg-theme-accent/[0.02] flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5"><Zap size={12}/> Throughput</span>
                <span className="text-lg font-bold text-theme-text">{m.throughput ? `${m.throughput} tps` : "—"}</span>
              </div>
              <div className="p-3 rounded-lg border border-theme-border/30 bg-theme-accent/[0.02] flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5"><Activity size={12}/> Uptime</span>
                <span className="text-lg font-bold text-theme-accent">99.98%</span>
              </div>
            </div>

            {/* Middle Cards (Input, Output, Context) */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-theme-border/30 bg-theme-accent/[0.02] flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5">Input /M</span>
                <span className="text-sm font-bold text-theme-text">{inputCost}</span>
              </div>
              <div className="p-3 rounded-lg border border-theme-border/30 bg-theme-accent/[0.02] flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5">Output /M</span>
                <span className="text-sm font-bold text-theme-text">{outputCost}</span>
              </div>
              <div className="p-3 rounded-lg border border-theme-border/30 bg-theme-accent/[0.02] flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-theme-text-muted flex items-center gap-1.5"><Database size={12}/> Context</span>
                <span className="text-sm font-bold text-theme-text">{m.context_length > 0 ? `${Math.round(m.context_length / 1000)}K` : "—"}</span>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-sm font-bold text-theme-text mb-4 uppercase tracking-widest border-b border-theme-border/30 pb-2">Specifications</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center border-b border-theme-border/10 pb-2">
                  <span className="text-theme-text-muted flex items-center gap-2"><Cpu size={14}/> Intelligence Index</span>
                  <span className="font-bold text-theme-text">{m.benchmarks?.intelligence_index ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-theme-border/10 pb-2">
                  <span className="text-theme-text-muted flex items-center gap-2"><Code size={14}/> Coding Index</span>
                  <span className="font-bold text-theme-text">{m.benchmarks?.coding_index ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-theme-border/10 pb-2">
                  <span className="text-theme-text-muted flex items-center gap-2"><Server size={14}/> Agentic Index</span>
                  <span className="font-bold text-theme-text">{m.benchmarks?.agentic_index ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center border-b border-theme-border/10 pb-2">
                  <span className="text-theme-text-muted flex items-center gap-2"><Hash size={14}/> Modality</span>
                  <span className="font-bold text-theme-text uppercase">{m.modality || "TEXT->TEXT"}</span>
                </div>
              </div>
            </div>

            {/* Description Terminal */}
            <div className="mt-4 p-4 rounded-xl border border-theme-accent/40 bg-theme-void relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-theme-accent/0 via-theme-accent/50 to-theme-accent/0 opacity-50" />
              <div className="text-xs text-theme-accent/80 mb-2 font-bold uppercase tracking-wider">System.Description</div>
              <div className="text-sm text-theme-text-muted leading-relaxed">
                <TypedLine text={m.description || "No model description available."} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
};
