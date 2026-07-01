"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Activity, Cpu, Shield, ExternalLink, RotateCcw, Info, Layers, Terminal } from "lucide-react";

interface ModelData {
  id: string;
  name: string;
  score: number;
  context_length: number;
  modality: string;
  pricing: { prompt: string; completion: string };
  description: string;
  benchmarks?: {
    intelligence_index?: number;
    coding_index?: number;
    agentic_index?: number;
    [key: string]: number | undefined;
  };
  provider?: string;
  model_id?: string;
  max_output?: number;
  ttft?: number;
  throughput?: number;
  reliability?: string;
  use_cases?: string[];
  verdict?: string;
}

interface ModelLeaderboard3DProps {
  models: ModelData[];
  activeMetric: "intelligence_index" | "coding_index" | "agentic_index";
  onMetricChange: (metric: "intelligence_index" | "coding_index" | "agentic_index") => void;
  onSelectModelForModal: (model: ModelData) => void;
  language: string;
  t: (key: string) => string;
}

// Color theme mapping by provider or rank
const getModelColor = (model: ModelData, index: number) => {
  const name = model.name.toLowerCase();
  const prov = (model.provider || "").toLowerCase();
  if (name.includes("claude") || prov.includes("anthropic")) return "#9C5AFF"; // Purple/Violet
  if (name.includes("gpt") || prov.includes("openai") || name.includes("o1") || name.includes("o3")) return "#10A37F"; // Emerald Cyan
  if (name.includes("deepseek") || prov.includes("deepseek")) return "#D4783A"; // Cyber Amber
  if (name.includes("llama") || prov.includes("meta")) return "#3B82F6"; // Electric Blue
  if (name.includes("kimi") || prov.includes("moonshot") || prov.includes("z.ai") || prov.includes("glm")) return "#EC4899"; // Neon Pink
  // Fallback gradient colors by rank
  const palette = ["#00F0FF", "#7000FF", "#00FF66", "#FF007A", "#FFBA00", "#00A8FF", "#B000FF", "#00FFB2"];
  return palette[index % palette.length];
};

// 3D Single Model Node inside the Constellation
const ModelNode: React.FC<{
  model: ModelData;
  rank: number;
  total: number;
  metric: string;
  isSelected: boolean;
  onSelect: (model: ModelData) => void;
}> = ({ model, rank, total, metric, isSelected, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const score = model.benchmarks?.[metric] || model.score || 80;
  const color = useMemo(() => getModelColor(model, rank - 1), [model, rank]);
  
  // Calculate target orbital coordinates based on rank and score
  const targetPos = useMemo(() => {
    // Closer rank = closer to center core (radius 3.0 to 8.5)
    const radius = 2.8 + ((rank - 1) / Math.max(1, total - 1)) * 5.2;
    const angle = ((rank - 1) / total) * Math.PI * 2 + (rank % 2 === 0 ? 0.3 : 0);
    // Vary height so they float in 3D volume instead of flat ring
    const height = Math.sin((rank - 1) * 1.7) * 1.8;
    return new THREE.Vector3(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    );
  }, [rank, total]);

  // Size based on score (0.45 to 0.85)
  const sphereSize = useMemo(() => {
    return Math.max(0.4, Math.min(0.9, (score / 100) * 0.8));
  }, [score]);

  // Smooth lerp to target position and rotation animations
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, 0.05);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 1.2;
      ringRef.current.rotation.y -= delta * 0.8;
    }
  });

  const shortName = useMemo(() => {
    return model.name
      .replace("Google: ", "")
      .replace("Anthropic: ", "")
      .replace("Cohere: ", "")
      .replace("Sakana: ", "")
      .replace("Moonshot: ", "")
      .replace("Z.ai: ", "");
  }, [model.name]);

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.6}>
        {/* Core Glowing Sphere */}
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(model);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
          scale={isSelected ? 1.4 : hovered ? 1.2 : 1.0}
        >
          <sphereGeometry args={[sphereSize, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isSelected ? 1.8 : hovered ? 1.3 : 0.6}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Orbiting Cyber Ring around the Sphere */}
        {(isSelected || hovered || rank <= 3) && (
          <mesh ref={ringRef} scale={isSelected ? 1.4 : hovered ? 1.2 : 1.0}>
            <torusGeometry args={[sphereSize * 1.6, 0.03, 16, 64]} />
            <meshBasicMaterial color={color} wireframe />
          </mesh>
        )}

        {/* Holographic 2D Billboard Label facing camera */}
        <Billboard position={[0, sphereSize + 0.6, 0]}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelect(model);
            }}
            className={`cursor-pointer px-2.5 py-1 rounded border backdrop-blur-md transition-all select-none whitespace-nowrap flex items-center gap-2 font-mono text-xs shadow-lg ${
              isSelected
                ? "bg-theme-void/95 border-theme-accent text-theme-accent scale-110 shadow-[0_0_15px_var(--color-theme-accent)]"
                : hovered
                ? "bg-theme-void/90 border-theme-text text-theme-text scale-105"
                : "bg-theme-void/70 border-theme-border/40 text-theme-text-muted hover:text-theme-text"
            }`}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
            <span className="font-bold">#{rank}</span>
            <span className="font-semibold">{shortName}</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-white/10 text-white ml-1">
              {score}%
            </span>
          </div>
        </Billboard>
      </Float>
    </group>
  );
};

// 3D Core Reactor at (0,0,0)
const CoreReactor: React.FC<{ metricLabel: string }> = ({ metricLabel }) => {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.3;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.8;
      ring1Ref.current.rotation.z += delta * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.6;
      ring2Ref.current.rotation.x -= delta * 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Geodesic Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00A8FF" emissiveIntensity={0.8} wireframe />
      </mesh>

      {/* Outer Gyro Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.0, 0.04, 16, 64]} />
        <meshBasicMaterial color="#7000FF" wireframe />
      </mesh>

      {/* Outer Gyro Ring 2 */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.4, 0.03, 16, 64]} />
        <meshBasicMaterial color="#00FF66" wireframe />
      </mesh>

      {/* Center Label */}
      <Html center position={[0, -2.2, 0]}>
        <div className="px-3 py-1 rounded-full border border-theme-accent/50 bg-theme-void/80 backdrop-blur-md text-theme-accent font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap shadow-md">
          {">"} {metricLabel} // ACTIVE CORE
        </div>
      </Html>
    </group>
  );
};

export default function ModelLeaderboard3D({
  models,
  activeMetric,
  onMetricChange,
  onSelectModelForModal,
  language,
  t,
}: ModelLeaderboard3DProps) {
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);

  // Filter and sort models by active metric
  const rankedModels = useMemo(() => {
    return models
      .filter((m) => m.benchmarks?.[activeMetric] != null)
      .sort((a, b) => (b.benchmarks?.[activeMetric] ?? 0) - (a.benchmarks?.[activeMetric] ?? 0))
      .slice(0, 8);
  }, [models, activeMetric]);

  const metricLabel =
    activeMetric === "intelligence_index"
      ? t("intel")
      : activeMetric === "coding_index"
      ? t("coding")
      : t("agentic");

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col bg-theme-void/50 rounded-lg border border-theme-border/30 overflow-hidden">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 border border-theme-border/50 p-1 rounded-lg bg-theme-void/90 backdrop-blur-md pointer-events-auto shadow-lg">
          {(["intelligence_index", "coding_index", "agentic_index"] as const).map((metric) => {
            const label =
              metric === "intelligence_index"
                ? t("intel")
                : metric === "coding_index"
                ? t("coding")
                : t("agentic");
            const isActive = activeMetric === metric;
            return (
              <button
                key={metric}
                onClick={() => {
                  onMetricChange(metric);
                  setSelectedModel(null);
                }}
                className={`relative px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-theme-accent text-theme-void shadow-[0_0_10px_var(--color-theme-accent)]"
                    : "text-theme-text-muted hover:text-theme-text hover:bg-white/5"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Instructions Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border border-theme-border/40 bg-theme-void/80 backdrop-blur-md font-mono text-[11px] text-theme-text-muted pointer-events-auto">
          <RotateCcw size={13} className="text-theme-accent animate-spin-slow" />
          <span>DRAG TO ORBIT // CLICK NODE FOR TELEMETRY</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 4.5, 11], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#9C5AFF" />
          <pointLight position={[-10, -10, -10]} intensity={1.5} color="#10A37F" />
          <spotLight position={[0, 15, 0]} intensity={2} angle={0.6} penumbra={1} color="#D4783A" />

          {/* Central Reactor */}
          <CoreReactor metricLabel={metricLabel} />

          {/* Orbiting Model Nodes */}
          {rankedModels.map((model, idx) => (
            <ModelNode
              key={model.id}
              model={model}
              rank={idx + 1}
              total={rankedModels.length}
              metric={activeMetric}
              isSelected={selectedModel?.id === model.id}
              onSelect={(m) => setSelectedModel(selectedModel?.id === m.id ? null : m)}
            />
          ))}

          {/* Controls: Auto rotate unless a node is selected */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={!selectedModel}
            autoRotateSpeed={0.5}
            maxDistance={18}
            minDistance={5}
          />
        </Canvas>
      </div>

      {/* Right Side Interactive Telemetry HUD (When Model Selected) */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-16 right-4 bottom-4 w-full sm:w-80 bg-theme-void/95 border border-theme-accent/60 rounded-lg p-5 flex flex-col justify-between z-30 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl font-mono overflow-y-auto no-scrollbar"
          >
            {/* HUD Header */}
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-theme-accent animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-theme-accent">
                    TELEMETRY // HUD
                  </span>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-xs text-theme-text-muted hover:text-theme-text px-2 py-0.5 border border-theme-border/40 rounded hover:border-theme-text transition-colors"
                >
                  [✕ CLOSE]
                </button>
              </div>

              <h3 className="text-base font-bold text-theme-text mb-1 flex items-center gap-2">
                {selectedModel.name}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-0.5 bg-theme-accent/20 border border-theme-accent/40 text-theme-accent text-[10px] font-bold rounded uppercase">
                  {selectedModel.provider || "OPENROUTER"}
                </span>
                <span className="text-[11px] text-theme-text-muted">
                  ID: {selectedModel.model_id || selectedModel.id}
                </span>
              </div>

              {/* Active Metric Benchmark Bar */}
              <div className="p-3 bg-white/5 border border-theme-border/30 rounded mb-4">
                <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                  <span className="text-theme-text-muted uppercase">{metricLabel} SCORE</span>
                  <span className="text-theme-accent text-sm">
                    {selectedModel.benchmarks?.[activeMetric] ?? selectedModel.score}%
                  </span>
                </div>
                <div className="h-2 w-full bg-theme-void rounded-full overflow-hidden border border-theme-border/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedModel.benchmarks?.[activeMetric] ?? selectedModel.score}%` }}
                    transition={{ duration: 0.6 }}
                    className="h-full bg-gradient-to-r from-theme-accent/60 to-theme-accent"
                  />
                </div>
              </div>

              {/* Key Diagnostic Specs */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="p-2.5 bg-white/5 rounded border border-theme-border/20">
                  <div className="text-[10px] text-theme-text-muted mb-0.5">CONTEXT WINDOW</div>
                  <div className="font-bold text-theme-text">
                    {(selectedModel.context_length / 1000).toFixed(0)}k Tokens
                  </div>
                </div>
                <div className="p-2.5 bg-white/5 rounded border border-theme-border/20">
                  <div className="text-[10px] text-theme-text-muted mb-0.5">AVG LATENCY (TTFT)</div>
                  <div className="font-bold text-emerald-400">
                    {selectedModel.ttft ? `${selectedModel.ttft}ms` : "110ms"}
                  </div>
                </div>
                <div className="p-2.5 bg-white/5 rounded border border-theme-border/20 col-span-2">
                  <div className="text-[10px] text-theme-text-muted mb-0.5">PRICING (PROMPT / COMP)</div>
                  <div className="font-bold text-theme-text">
                    ${(parseFloat(selectedModel.pricing.prompt) * 1000000).toFixed(2)} / ${
                      (parseFloat(selectedModel.pricing.completion) * 1000000).toFixed(2)
                    } per 1M
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-theme-text-muted leading-relaxed mb-4 border-l-2 border-theme-accent/40 pl-2.5 italic">
                {selectedModel.verdict || selectedModel.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-theme-border/30">
              <button
                onClick={() => onSelectModelForModal(selectedModel)}
                className="w-full py-2.5 bg-theme-accent text-theme-void font-bold text-xs uppercase tracking-wider rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>LAUNCH FULL SPECS & ARCHITECTURE</span>
                <ExternalLink size={13} />
              </button>
              <button
                onClick={() => setSelectedModel(null)}
                className="w-full py-1.5 bg-transparent border border-theme-border/40 text-theme-text-muted hover:text-theme-text font-semibold text-[11px] uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                RESET CAMERA ORBIT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Status Bar */}
      <div className="bg-theme-void/90 backdrop-blur-md border-t border-theme-border/40 px-4 py-2 flex items-center justify-between text-[10px] font-mono text-theme-text-muted z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>WEBGL CONSTELLATION SYNCED // ACTIVE NODES: {rankedModels.length}</span>
        </div>
        <div className="hidden sm:block">
          {selectedModel ? `SELECTED: ${selectedModel.name}` : "CLICK ANY NODE TO INSPECT TELEMETRY"}
        </div>
      </div>
    </div>
  );
}
