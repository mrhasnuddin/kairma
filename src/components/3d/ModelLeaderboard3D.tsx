"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Shield, Zap, Activity, ExternalLink, RotateCcw, Lock, Unlock, Code, Database, Radio } from "lucide-react";

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

// Hacker ASCII cipher character set
const CIPHER_CHARS = "01#$@%&*<>?/\\[]{}=+-~^0xABCDEF";

// Hook for ASCII Decryption Text Glitch Animation
const useDecryptedText = (targetText: string, trigger: any, speed: number = 25) => {
  const [display, setDisplay] = useState(targetText);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = targetText.length * 2;
    const interval = setInterval(() => {
      setDisplay((prev) =>
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration / 2) {
              return targetText[index];
            }
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join("")
      );
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplay(targetText);
      }
      iteration += 1;
    }, speed);

    return () => clearInterval(interval);
  }, [targetText, trigger, speed]);

  return display;
};

// Cyberpunk color mapping
const getModelColor = (model: ModelData, index: number) => {
  const name = model.name.toLowerCase();
  const prov = (model.provider || "").toLowerCase();
  if (name.includes("claude") || prov.includes("anthropic")) return "#9C5AFF"; // Neon Violet / Purple
  if (name.includes("gpt") || prov.includes("openai") || name.includes("o1") || name.includes("o3")) return "#00FF66"; // Matrix Green / Cyan
  if (name.includes("deepseek") || prov.includes("deepseek")) return "#FFBA00"; // Imperial Gold / Amber
  if (name.includes("llama") || prov.includes("meta")) return "#00F0FF"; // Cyber Cyan
  if (name.includes("kimi") || prov.includes("moonshot") || prov.includes("z.ai") || prov.includes("glm")) return "#FF007A"; // Neon Pink
  const palette = ["#00F0FF", "#00FF66", "#9C5AFF", "#FFBA00", "#FF007A", "#00A8FF"];
  return palette[index % palette.length];
};

// Laser Data Tether connecting Server Pillar to Center Mainframe Core
const DataTether: React.FC<{ startPos: THREE.Vector3; endPos: THREE.Vector3; color: string; isSelected: boolean }> = ({
  startPos,
  endPos,
  color,
  isSelected,
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const points = useMemo(() => {
    // Route along the floor grid for a circuit-board trace look: start -> ground -> core ground -> core
    const p1 = new THREE.Vector3(startPos.x, -2.4, startPos.z);
    const p2 = new THREE.Vector3(endPos.x, -2.4, endPos.z);
    return [startPos, p1, p2, endPos];
  }, [startPos, endPos]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={isSelected ? 0.9 : 0.3} linewidth={isSelected ? 2 : 1} />
    </line>
  );
};

// Individual 3D Server Monolith / Blade Pillar
const ServerPillarNode: React.FC<{
  model: ModelData;
  rank: number;
  total: number;
  metric: string;
  isSelected: boolean;
  onSelect: (model: ModelData) => void;
}> = ({ model, rank, total, metric, isSelected, onSelect }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pillarRef = useRef<THREE.Mesh>(null);
  const bracketRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const score = model.benchmarks?.[metric] || model.score || 80;
  const color = useMemo(() => getModelColor(model, rank - 1), [model, rank]);

  // Pillar height proportional to score (1.5 to 4.2)
  const targetHeight = useMemo(() => {
    return Math.max(1.2, Math.min(4.5, ((score - 50) / 50) * 3.5 + 1.0));
  }, [score]);

  // Target coordinates arranged on a cybernetic isometric grid array around the core
  const targetPos = useMemo(() => {
    const radius = 3.2 + ((rank - 1) / Math.max(1, total - 1)) * 4.5;
    const angle = ((rank - 1) / total) * Math.PI * 2 + 0.3;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    // Bottom of pillar rests on the grid floor at y = -2.5
    const y = -2.5 + targetHeight / 2;
    return new THREE.Vector3(x, y, z);
  }, [rank, total, targetHeight]);

  // Smooth lerping to target position
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, 0.08);
    }
    if (bracketRef.current) {
      bracketRef.current.rotation.y += delta * (isSelected ? 2.5 : hovered ? 1.8 : 0.8);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 1.5;
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

  const decryptedName = useDecryptedText(shortName, metric);
  const decryptedScore = useDecryptedText(`${score}%`, metric, 35);

  const corePos = useMemo(() => new THREE.Vector3(0, -0.5, 0), []);

  return (
    <group ref={groupRef}>
      {/* Laser Tether to Core */}
      <DataTether startPos={new THREE.Vector3(0, -targetHeight / 2, 0)} endPos={corePos} color={color} isSelected={isSelected || hovered} />

      {/* Main Server Pillar Monolith */}
      <mesh
        ref={pillarRef}
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
        scale={isSelected ? [1.15, 1.0, 1.15] : hovered ? [1.08, 1.0, 1.08] : [1, 1, 1]}
      >
        <boxGeometry args={[0.7, targetHeight, 0.7]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 1.5 : hovered ? 1.0 : 0.4}
          roughness={0.1}
          metalness={0.9}
          wireframe={!isSelected && !hovered && rank > 3}
        />
      </mesh>

      {/* Outer Wireframe Hacker Brackets spinning around the pillar */}
      <mesh ref={bracketRef} position={[0, targetHeight / 2 - 0.4, 0]}>
        <boxGeometry args={[1.1, 0.5, 1.1]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>

      {/* Floating Cyber Target Ring */}
      {(isSelected || hovered || rank <= 2) && (
        <mesh ref={ringRef} position={[0, targetHeight / 2 + 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.8, 4]} />
          <meshBasicMaterial color={color} wireframe side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Holographic Hacker ASCII Label facing camera */}
      <Html center position={[0, targetHeight / 2 + 0.7, 0]}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(model);
          }}
          className={`cursor-pointer px-2.5 py-1 rounded border backdrop-blur-md transition-all select-none whitespace-nowrap flex items-center gap-2 font-mono text-xs shadow-xl ${
            isSelected
              ? "bg-theme-void/95 border-theme-accent text-theme-accent scale-110 shadow-[0_0_20px_var(--color-theme-accent)]"
              : hovered
              ? "bg-theme-void/90 border-theme-text text-theme-text scale-105"
              : "bg-theme-void/80 border-theme-border/50 text-theme-text-muted hover:text-theme-text"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-ping" style={{ backgroundColor: color }} />
          <span className="font-bold text-theme-accent">0x0{rank}</span>
          <span className="font-bold tracking-tight">{decryptedName}</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-theme-accent/20 border border-theme-accent/40 text-theme-accent ml-1">
            [{decryptedScore}]
          </span>
        </div>
      </Html>
    </group>
  );
};

// 3D Mainframe Kernel Core at (0, -0.5, 0)
const MainframeKernelCore: React.FC<{ metricLabel: string }> = ({ metricLabel }) => {
  const outerCubeRef = useRef<THREE.Mesh>(null);
  const innerCubeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (outerCubeRef.current) {
      outerCubeRef.current.rotation.y += delta * 0.4;
      outerCubeRef.current.rotation.x += delta * 0.2;
    }
    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.y -= delta * 0.6;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 1.0;
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Inner Glowing Kernel */}
      <mesh ref={innerCubeRef}>
        <boxGeometry args={[1.4, 2.2, 1.4]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00FF66" emissiveIntensity={0.9} wireframe />
      </mesh>

      {/* Outer Rotating Hacker Brackets Cube */}
      <mesh ref={outerCubeRef}>
        <boxGeometry args={[2.0, 2.8, 2.0]} />
        <meshBasicMaterial color="#9C5AFF" wireframe />
      </mesh>

      {/* Horizontal Scanner Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.4, 2.6, 32]} />
        <meshBasicMaterial color="#00F0FF" wireframe side={THREE.DoubleSide} />
      </mesh>

      {/* Center Kernel Terminal Label */}
      <Html center position={[0, 2.2, 0]}>
        <div className="px-3 py-1 rounded border border-theme-accent bg-theme-void/90 backdrop-blur-md text-theme-accent font-mono text-[11px] font-bold uppercase tracking-widest whitespace-nowrap shadow-[0_0_15px_var(--color-theme-accent)] flex items-center gap-2">
          <Terminal size={13} className="animate-pulse text-emerald-400" />
          <span>SYS_KERNEL :: [{metricLabel}]</span>
          <span className="w-1.5 h-3 bg-theme-accent animate-ping" />
        </div>
      </Html>
    </group>
  );
};

// 3D Cyber-Grid Plane Floor
const CyberGridFloor: React.FC = () => {
  return (
    <group position={[0, -2.5, 0]}>
      {/* Primary Wireframe Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60, 40, 40]} />
        <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Secondary Deep Grid for Tron perspective */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[80, 80, 16, 16]} />
        <meshBasicMaterial color="#9C5AFF" wireframe transparent opacity={0.08} />
      </mesh>
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
  const [isDecrypting, setIsDecrypting] = useState(false);

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

  // Trigger decryption effect when metric changes
  const handleMetricChange = (metric: "intelligence_index" | "coding_index" | "agentic_index") => {
    setIsDecrypting(true);
    onMetricChange(metric);
    setSelectedModel(null);
    setTimeout(() => setIsDecrypting(false), 500);
  };

  return (
    <div className="relative w-full h-full min-h-[480px] flex flex-col bg-theme-void/80 rounded-lg border border-theme-border/40 overflow-hidden shadow-2xl">
      {/* Top Hacker Terminal HUD Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1 border border-theme-border/60 p-1 rounded bg-theme-void/95 backdrop-blur-md pointer-events-auto shadow-lg font-mono">
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
                onClick={() => handleMetricChange(metric)}
                className={`relative px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-theme-accent text-theme-void shadow-[0_0_12px_var(--color-theme-accent)]"
                    : "text-theme-text-muted hover:text-theme-text hover:bg-white/5"
                }`}
              >
                <Code size={13} className={isActive ? "text-theme-void" : "text-theme-text-muted"} />
                <span>{label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-theme-void animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Hacker Status Banner */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded border border-theme-border/50 bg-theme-void/90 backdrop-blur-md font-mono text-[11px] text-theme-text-muted pointer-events-auto shadow-md">
          <Terminal size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-theme-accent font-bold">root@kairma:~#</span>
          <span>ORBIT_GRID: ACTIVE // CLICK PILLAR FOR HEX DUMP</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <div className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing">
        <Canvas camera={{ position: [0, 5, 13], fov: 48 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[15, 15, 15]} intensity={1.8} color="#00F0FF" />
          <pointLight position={[-15, -15, -15]} intensity={1.8} color="#9C5AFF" />
          <spotLight position={[0, 20, 0]} intensity={2.5} angle={0.7} penumbra={1} color="#00FF66" />

          {/* Cyber Floor Grid */}
          <CyberGridFloor />

          {/* Central Mainframe Kernel */}
          <MainframeKernelCore metricLabel={metricLabel} />

          {/* Orbiting Server Monolith Pillars */}
          {rankedModels.map((model, idx) => (
            <ServerPillarNode
              key={model.id}
              model={model}
              rank={idx + 1}
              total={rankedModels.length}
              metric={activeMetric}
              isSelected={selectedModel?.id === model.id}
              onSelect={(m) => setSelectedModel(selectedModel?.id === m.id ? null : m)}
            />
          ))}

          {/* OrbitControls: smooth hacker rotation */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={!selectedModel}
            autoRotateSpeed={0.4}
            maxDistance={22}
            minDistance={6}
            maxPolarAngle={Math.PI / 2 + 0.1} // Keep camera above grid floor
          />
        </Canvas>
      </div>

      {/* Right Side Hacker Terminal Execution HUD (When Model Selected) */}
      <AnimatePresence>
        {selectedModel && (
          <motion.div
            initial={{ opacity: 0, x: 340 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 340 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-16 right-4 bottom-4 w-full sm:w-85 bg-theme-void/95 border-2 border-theme-accent rounded p-5 flex flex-col justify-between z-30 shadow-[0_0_35px_rgba(0,0,0,0.9)] backdrop-blur-2xl font-mono overflow-y-auto no-scrollbar"
          >
            {/* Terminal Header */}
            <div>
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-theme-border/40">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold tracking-wider text-emerald-400">
                    root@kairma:~# exec ./telemetry.sh
                  </span>
                </div>
                <button
                  onClick={() => setSelectedModel(null)}
                  className="text-xs text-theme-text-muted hover:text-theme-accent px-2 py-0.5 border border-theme-border/50 rounded hover:border-theme-accent transition-all cursor-pointer font-bold"
                >
                  [ kill -9 ]
                </button>
              </div>

              {/* Hex Dump Memory Box */}
              <div className="p-2.5 bg-black/60 border border-theme-accent/40 rounded mb-4 text-[10px] text-theme-text-muted font-mono leading-tight">
                <div className="text-emerald-400 font-bold mb-1">[+] SYSCALL: INTRUSION_DETECTED // ACCESS GRANTED</div>
                <div className="text-theme-text-muted/70 truncate">0x00F8A2: 4B 41 49 52 4D 41 20 4F 53 20 4B 45 52</div>
                <div className="text-theme-accent/90 mt-1 flex items-center gap-1">
                  <span>TARGET_LOCK:</span>
                  <span className="font-bold text-theme-text">{selectedModel.id}</span>
                </div>
              </div>

              {/* Model Title & Provider Badge */}
              <h3 className="text-lg font-bold text-theme-text mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5 text-theme-accent shrink-0" />
                <span>{selectedModel.name}</span>
              </h3>
              <div className="flex items-center gap-2 mb-5">
                <span className="px-2 py-0.5 bg-theme-accent text-theme-void text-[10px] font-bold rounded uppercase tracking-wider">
                  {selectedModel.provider || "OPENROUTER"}
                </span>
                <span className="text-[11px] text-theme-text-muted flex items-center gap-1">
                  <Activity size={12} className="text-emerald-400" />
                  <span>STATUS: 200 OK</span>
                </span>
              </div>

              {/* Active Metric Score Decoder Bar */}
              <div className="p-3.5 bg-white/5 border border-theme-border/40 rounded mb-4 shadow-inner">
                <div className="flex justify-between items-center text-xs mb-2 font-bold">
                  <span className="text-theme-text-muted uppercase flex items-center gap-1.5">
                    <Zap size={13} className="text-theme-accent" />
                    <span>{metricLabel} INDEX</span>
                  </span>
                  <span className="text-theme-accent text-base font-extrabold">
                    {selectedModel.benchmarks?.[activeMetric] ?? selectedModel.score}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-theme-void rounded overflow-hidden border border-theme-border/30 p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedModel.benchmarks?.[activeMetric] ?? selectedModel.score}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-theme-accent/40 via-theme-accent to-emerald-400 rounded-sm shadow-[0_0_10px_var(--color-theme-accent)]"
                  />
                </div>
              </div>

              {/* Key Diagnostic Registers */}
              <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs">
                <div className="p-2.5 bg-white/5 rounded border border-theme-border/30">
                  <div className="text-[9px] text-theme-text-muted mb-0.5 uppercase tracking-wider flex items-center gap-1">
                    <Database size={11} className="text-theme-accent" /> REG_CTX_WIN
                  </div>
                  <div className="font-bold text-theme-text text-sm">
                    {(selectedModel.context_length / 1000).toFixed(0)}k Tokens
                  </div>
                </div>
                <div className="p-2.5 bg-white/5 rounded border border-theme-border/30">
                  <div className="text-[9px] text-theme-text-muted mb-0.5 uppercase tracking-wider flex items-center gap-1">
                    <Radio size={11} className="text-emerald-400" /> REG_LATENCY
                  </div>
                  <div className="font-bold text-emerald-400 text-sm">
                    {selectedModel.ttft ? `${selectedModel.ttft}ms` : "110ms"}
                  </div>
                </div>
                <div className="p-2.5 bg-white/5 rounded border border-theme-border/30 col-span-2">
                  <div className="text-[9px] text-theme-text-muted mb-0.5 uppercase tracking-wider flex items-center gap-1">
                    <Cpu size={11} className="text-theme-accent" /> REG_TOKEN_PRICING (PROMPT / COMP)
                  </div>
                  <div className="font-bold text-theme-text">
                    ${(parseFloat(selectedModel.pricing.prompt) * 1000000).toFixed(2)} / ${
                      (parseFloat(selectedModel.pricing.completion) * 1000000).toFixed(2)
                    } per 1M
                  </div>
                </div>
              </div>

              {/* Architectural Verdict */}
              <div className="p-3 bg-black/40 border-l-2 border-theme-accent rounded text-xs text-theme-text-muted leading-relaxed mb-4 italic">
                <span className="text-theme-accent not-italic font-bold block mb-1">{"// ARCHITECTURAL_VERDICT:"}</span>
                {selectedModel.verdict || selectedModel.description}
              </div>
            </div>

            {/* Bottom Execution Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-theme-border/40">
              <button
                onClick={() => onSelectModelForModal(selectedModel)}
                className="w-full py-3 bg-theme-accent text-theme-void font-extrabold text-xs uppercase tracking-widest rounded hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--color-theme-accent)] cursor-pointer group"
              >
                <span>./LAUNCH_FULL_SPECS.sh</span>
                <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setSelectedModel(null)}
                className="w-full py-1.5 bg-transparent border border-theme-border/50 text-theme-text-muted hover:text-theme-text font-bold text-[11px] uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                [ RESET_CAMERA_ORBIT ]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Terminal Status Bar */}
      <div className="bg-theme-void/95 backdrop-blur-md border-t border-theme-border/50 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-theme-text-muted z-20">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-theme-accent font-bold">SYS_STATUS: ONLINE</span>
          <span className="hidden sm:inline">// GRID_NODES: {rankedModels.length} // CIPHER: AES-GCM-256</span>
        </div>
        <div className="font-bold text-theme-text">
          {selectedModel ? `LOCKED: ${selectedModel.name}` : "AWAITING USER TARGET SELECTION..."}
        </div>
      </div>
    </div>
  );
}
