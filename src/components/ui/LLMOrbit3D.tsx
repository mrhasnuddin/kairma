"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useTheme } from "@/lib/theme";

export interface OrbitModelItem {
  id: string;
  name: string;
  provider?: string;
  score?: number;
  category?: "top" | "mid" | "bot";
}

interface LLMOrbit3DProps {
  models: OrbitModelItem[];
  focusedModelId: string | null;
  onSelectModel: (id: string) => void;
  onHoverModel?: (id: string | null) => void;
  className?: string;
}

const PALETTE_ACCENTS: Record<
  string,
  {
    accent: number;
    accentHex: string;
    secondary: number;
    secondaryHex: string;
    silver: number;
    voidHex: string;
  }
> = {
  "xuan-mode": {
    accent: 0x00492e,
    accentHex: "#00E588",
    secondary: 0x1faa68,
    secondaryHex: "#5af1b0",
    silver: 0x889988,
    voidHex: "#060a08",
  },
  "matrix-mode": {
    accent: 0xff5c3b,
    accentHex: "#FF5C3B",
    secondary: 0xff8c6b,
    secondaryHex: "#FF8C6B",
    silver: 0xaaaaaa,
    voidHex: "#08080a",
  },
};

/**
 * Creates a high-fidelity Soul.io style dark-glass emblem texture for a node.
 */
function createNodeEmblemTexture(
  name: string,
  provider: string,
  isSelected: boolean,
  accentHex: string
): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, 256, 256);

  // Outer ambient neon aura when selected
  if (isSelected) {
    const glow = ctx.createRadialGradient(128, 128, 50, 128, 128, 126);
    glow.addColorStop(0, accentHex);
    glow.addColorStop(0.5, accentHex + "66");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(128, 128, 126, 0, Math.PI * 2);
    ctx.fill();
  }

  // Obsidian dark-glass badge disc
  ctx.beginPath();
  ctx.arc(128, 128, 86, 0, Math.PI * 2);
  const discGrad = ctx.createLinearGradient(40, 40, 216, 216);
  if (isSelected) {
    discGrad.addColorStop(0, "#1f1816");
    discGrad.addColorStop(1, "#0a0808");
  } else {
    discGrad.addColorStop(0, "#191920");
    discGrad.addColorStop(1, "#0d0d12");
  }
  ctx.fillStyle = discGrad;
  ctx.fill();

  // Crisp glowing border ring
  ctx.beginPath();
  ctx.arc(128, 128, 86, 0, Math.PI * 2);
  ctx.lineWidth = isSelected ? 8 : 4;
  ctx.strokeStyle = isSelected ? accentHex : "rgba(255, 255, 255, 0.35)";
  ctx.stroke();

  // Provider monogram or initials
  const monogram = provider
    ? provider.slice(0, 2).toUpperCase()
    : name.slice(0, 2).toUpperCase();

  ctx.fillStyle = isSelected ? accentHex : "#FFFFFF";
  ctx.font = "700 58px 'Outfit', 'IBM Plex Mono', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(monogram, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export const LLMOrbit3D: React.FC<LLMOrbit3DProps> = ({
  models,
  focusedModelId,
  onSelectModel,
  onHoverModel,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Three.js runtime references
  const sysRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    world: THREE.Group;
    ringGroups: THREE.Group[];
    nodes: THREE.Group[];
    centralEmbers?: THREE.Points;
    spokeLines: THREE.LineSegments[];
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    hoveredNode: THREE.Group | null;
    selectedNode: THREE.Group | null;
    isDragging: boolean;
    draggedRing: THREE.Group | null;
    dragStartX: number;
    dragMoved: boolean;
    animId: number;
  } | null>(null);

  // Partition models into 3 tiers matching Soul.io Gauges & Emissions layout
  const ringBuckets = React.useMemo(() => {
    const top: OrbitModelItem[] = [];
    const mid: OrbitModelItem[] = [];
    const bot: OrbitModelItem[] = [];

    models.forEach((m, idx) => {
      const tier = idx % 3;
      if (tier === 0) top.push(m);
      else if (tier === 1) mid.push(m);
      else bot.push(m);
    });

    return { top, mid, bot };
  }, [models]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    const pal = PALETTE_ACCENTS[theme] || PALETTE_ACCENTS["matrix-mode"];

    // 1. Setup Scene & Authentic Soul.io Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 4.4, 9.2);
    camera.lookAt(0, -0.25, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(pal.accent, 3, 25);
    pointLight.position.set(0, 3, 4);
    scene.add(pointLight);

    // 2. Central Energy Fountain (NO solid red stick — pure glowing ember stream like Soul.io!)
    const emberCount = 450;
    const emberGeo = new THREE.BufferGeometry();
    const emberPositions = new Float32Array(emberCount * 3);
    const emberSpeeds: number[] = [];

    for (let i = 0; i < emberCount; i++) {
      // Swirling vertical stream concentrated along the center
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.pow(Math.random(), 2) * 0.35;
      emberPositions[i * 3] = Math.cos(angle) * radius;
      emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 6.5;
      emberPositions[i * 3 + 2] = Math.sin(angle) * radius;
      emberSpeeds.push(0.006 + Math.random() * 0.012);
    }

    emberGeo.setAttribute("position", new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: pal.accent,
      size: 0.038,
      transparent: true,
      opacity: 0.85,
    });
    const centralEmbers = new THREE.Points(emberGeo, emberMat);
    centralEmbers.userData = { speeds: emberSpeeds };
    world.add(centralEmbers);

    const allNodes: THREE.Group[] = [];
    const allRingGroups: THREE.Group[] = [];
    const allSpokeLines: THREE.LineSegments[] = [];

    // Helper to build each elliptical orbital ring with Soul.io spoke beams
    const createOrbitRing = (
      group: THREE.Group,
      radius: number,
      items: OrbitModelItem[],
      category: string,
      ringColor: number
    ) => {
      // Dotted / dashed faint orbital path
      const segments = 96;
      const ringPathGeo = new THREE.BufferGeometry();
      const ringPts = new Float32Array(segments * 3);
      for (let i = 0; i < segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        ringPts[i * 3] = Math.cos(theta) * radius;
        ringPts[i * 3 + 1] = 0;
        ringPts[i * 3 + 2] = Math.sin(theta) * radius;
      }
      ringPathGeo.setAttribute("position", new THREE.BufferAttribute(ringPts, 3));
      const ringPathMat = new THREE.PointsMaterial({
        color: ringColor,
        size: 0.022,
        transparent: true,
        opacity: 0.45,
      });
      const ringPoints = new THREE.Points(ringPathGeo, ringPathMat);
      group.add(ringPoints);

      // Revolving dust particles around ring
      const dustCount = category === "top" ? 220 : category === "mid" ? 380 : 540;
      const dustGeo = new THREE.BufferGeometry();
      const dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount; i++) {
        const a = (i / dustCount) * Math.PI * 2 + Math.random() * 0.15;
        const r = radius + (Math.random() - 0.5) * 0.16;
        dustPositions[i * 3] = Math.cos(a) * r;
        dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
        dustPositions[i * 3 + 2] = Math.sin(a) * r;
      }
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
      const dustMat = new THREE.PointsMaterial({
        color: ringColor,
        size: 0.018,
        transparent: true,
        opacity: 0.5,
      });
      const dustMesh = new THREE.Points(dustGeo, dustMat);
      group.add(dustMesh);

      // Radiating dotted spoke lines from central spine (0,0,0) to each node
      const count = items.length;
      const ringNodes: THREE.Group[] = [];

      items.forEach((item, index) => {
        const angle = count > 0 ? (index / count) * Math.PI * 2 : 0;
        const nodeGroup = new THREE.Group();

        const nx = Math.cos(angle) * radius;
        const nz = Math.sin(angle) * radius;
        nodeGroup.position.set(nx, 0, nz);

        // Spoke line from center to node
        const spokePts = new Float32Array([0, 0, 0, nx, 0, nz]);
        const spokeGeo = new THREE.BufferGeometry();
        spokeGeo.setAttribute("position", new THREE.BufferAttribute(spokePts, 3));
        const spokeMat = new THREE.LineBasicMaterial({
          color: ringColor,
          transparent: true,
          opacity: 0.22,
        });
        const spokeLine = new THREE.LineSegments(spokeGeo, spokeMat);
        group.add(spokeLine);
        allSpokeLines.push(spokeLine);

        // Node Outer Glow Ring Mesh
        const outerRingGeo = new THREE.RingGeometry(0.24, 0.28, 36);
        const outerRingMat = new THREE.MeshBasicMaterial({
          color: 0x555560,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });
        const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat);
        nodeGroup.add(outerRingMesh);

        // Node Emblem Billboard
        const texture = createNodeEmblemTexture(
          item.name,
          item.provider || "",
          false,
          pal.accentHex
        );
        const emblemGeo = new THREE.PlaneGeometry(0.48, 0.48);
        const emblemMat = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
        });
        const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
        nodeGroup.add(emblemMesh);

        // Precise raycasting hit box
        const hitGeo = new THREE.BoxGeometry(0.65, 0.65, 0.2);
        const hitMat = new THREE.MeshBasicMaterial({ visible: false });
        const hitMesh = new THREE.Mesh(hitGeo, hitMat);
        nodeGroup.add(hitMesh);

        nodeGroup.userData = {
          item,
          category,
          index,
          angle,
          ringGroup: group,
          ringColor,
          outerRingMesh,
          emblemMesh,
          spokeMat,
          texture,
        };

        group.add(nodeGroup);
        ringNodes.push(nodeGroup);
        allNodes.push(nodeGroup);
      });

      group.userData = {
        radius,
        category,
        ringColor,
        nodes: ringNodes,
        targetRotationY: 0,
      };

      allRingGroups.push(group);
    };

    // Construct the 3 stacked Soul.io rings
    // Top Ring (Frontier Tier)
    const topGroup = new THREE.Group();
    topGroup.position.y = 2.1;
    world.add(topGroup);
    createOrbitRing(topGroup, 1.55, ringBuckets.top, "top", pal.secondary);

    // Middle Ring (Specialist Tier)
    const midGroup = new THREE.Group();
    midGroup.position.y = 0.0;
    world.add(midGroup);
    createOrbitRing(midGroup, 2.45, ringBuckets.mid, "mid", 0x8154e8);

    // Bottom Ring (Core / High-Throughput Tier)
    const botGroup = new THREE.Group();
    botGroup.position.y = -2.1;
    world.add(botGroup);
    createOrbitRing(botGroup, 3.4, ringBuckets.bot, "bot", 0x98a838);

    // Runtime reference
    const sys = {
      scene,
      camera,
      renderer,
      world,
      ringGroups: allRingGroups,
      nodes: allNodes,
      centralEmbers,
      spokeLines: allSpokeLines,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      hoveredNode: null as THREE.Group | null,
      selectedNode: null as THREE.Group | null,
      isDragging: false,
      draggedRing: null as THREE.Group | null,
      dragStartX: 0,
      dragMoved: false,
      animId: 0,
    };
    sysRef.current = sys;

    // Mouse & Touch interaction
    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      sys.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      sys.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (sys.isDragging && sys.draggedRing) {
        const deltaX = e.clientX - sys.dragStartX;
        if (Math.abs(deltaX) > 4) sys.dragMoved = true;
        sys.draggedRing.rotation.y += deltaX * 0.0075;
        sys.draggedRing.userData.targetRotationY = sys.draggedRing.rotation.y;
        sys.dragStartX = e.clientX;
        return;
      }

      // Raycast to hover nodes
      sys.raycaster.setFromCamera(sys.mouse, sys.camera);
      const hits = sys.raycaster.intersectObjects(world.children, true);

      let target: THREE.Group | null = null;
      for (const h of hits) {
        let p: THREE.Object3D | null = h.object.parent;
        while (p && p !== scene) {
          if (p.userData && p.userData.item) {
            target = p as THREE.Group;
            break;
          }
          p = p.parent;
        }
        if (target) break;
      }

      if (target) {
        if (sys.hoveredNode !== target) {
          if (sys.hoveredNode && sys.hoveredNode !== sys.selectedNode) {
            gsap.to(sys.hoveredNode.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
            sys.hoveredNode.userData.outerRingMesh.material.color.setHex(0x555560);
          }
          sys.hoveredNode = target;
          container.style.cursor = "pointer";
          gsap.to(target.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.25, ease: "power2.out" });
          target.userData.outerRingMesh.material.color.setHex(pal.accent);

          if (onHoverModel) onHoverModel(target.userData.item.id);
        }
      } else {
        if (sys.hoveredNode) {
          if (sys.hoveredNode !== sys.selectedNode) {
            gsap.to(sys.hoveredNode.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
            sys.hoveredNode.userData.outerRingMesh.material.color.setHex(0x555560);
          }
          sys.hoveredNode = null;
          container.style.cursor = "default";
          if (onHoverModel) onHoverModel(null);
        }
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      sys.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      sys.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      sys.raycaster.setFromCamera(sys.mouse, sys.camera);
      const hits = sys.raycaster.intersectObjects(world.children, true);

      // Check if clicking near a ring for rotation drag
      let ringHit: THREE.Group | null = null;
      for (const h of hits) {
        let p = h.object.parent;
        while (p && p !== scene) {
          if (p.userData && p.userData.radius) {
            ringHit = p as THREE.Group;
            break;
          }
          p = p.parent;
        }
        if (ringHit) break;
      }

      if (ringHit) {
        sys.isDragging = true;
        sys.draggedRing = ringHit;
        sys.dragStartX = e.clientX;
        sys.dragMoved = false;
        container.style.cursor = "grabbing";
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (sys.isDragging) {
        sys.isDragging = false;
        container.style.cursor = "default";

        // If mouse barely moved, treat as a node click!
        if (!sys.dragMoved) {
          const rect = renderer.domElement.getBoundingClientRect();
          sys.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          sys.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

          sys.raycaster.setFromCamera(sys.mouse, sys.camera);
          const hits = sys.raycaster.intersectObjects(world.children, true);

          let nodeHit: THREE.Group | null = null;
          for (const h of hits) {
            let p = h.object.parent;
            while (p && p !== scene) {
              if (p.userData && p.userData.item) {
                nodeHit = p as THREE.Group;
                break;
              }
              p = p.parent;
            }
            if (nodeHit) break;
          }

          if (nodeHit) {
            onSelectModel(nodeHit.userData.item.id);
            return;
          }
        }

        // Otherwise snap ring to closest front node
        if (sys.draggedRing) {
          const currentRot = sys.draggedRing.rotation.y;
          let closest: THREE.Group | null = null;
          let minDiff = Infinity;

          sys.draggedRing.userData.nodes.forEach((n: THREE.Group) => {
            const absAngle = n.userData.angle + currentRot;
            const targetFacing = -Math.PI / 2;
            const diff = Math.abs(((absAngle - targetFacing + Math.PI) % (Math.PI * 2)) - Math.PI);
            if (diff < minDiff) {
              minDiff = diff;
              closest = n;
            }
          });

          if (closest) {
            onSelectModel((closest as THREE.Group).userData.item.id);
          }
          sys.draggedRing = null;
        }
      }
    };

    const onResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);

    // Render / Animation loop
    const animate = () => {
      sys.animId = requestAnimationFrame(animate);

      // 1. Orient nodes facing camera
      allNodes.forEach((node) => {
        if (node.parent) {
          node.rotation.y = -node.parent.rotation.y;
          node.rotation.x = -0.38;
        }
      });

      // 2. Animate central fountain ember particles upward & downward
      if (sys.centralEmbers) {
        const pos = sys.centralEmbers.geometry.attributes.position.array as Float32Array;
        const speeds = sys.centralEmbers.userData.speeds as number[];
        const num = pos.length / 3;
        for (let i = 0; i < num; i++) {
          pos[i * 3 + 1] += speeds[i];
          if (pos[i * 3 + 1] > 3.2) pos[i * 3 + 1] = -3.2;
        }
        sys.centralEmbers.geometry.attributes.position.needsUpdate = true;
      }

      // 3. Gentle ambient orbit drift for rings not being dragged
      allRingGroups.forEach((rg) => {
        if (
          !sys.isDragging &&
          (!sys.selectedNode || sys.selectedNode.userData.ringGroup !== rg)
        ) {
          rg.rotation.y += 0.00065;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(sys.animId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, [ringBuckets, theme]);

  // Synchronize with external focusedModelId (from table hover or active model selection)
  useEffect(() => {
    const sys = sysRef.current;
    if (!sys) return;

    const pal = PALETTE_ACCENTS[theme] || PALETTE_ACCENTS["matrix-mode"];

    // Reset previous selected node visuals
    if (sys.selectedNode) {
      gsap.to(sys.selectedNode.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
      sys.selectedNode.userData.outerRingMesh.material.color.setHex(0x555560);
      sys.selectedNode.userData.spokeMat.color.setHex(sys.selectedNode.userData.ringColor);
      sys.selectedNode.userData.spokeMat.opacity = 0.22;

      // Reset texture to normal state
      const unselTex = createNodeEmblemTexture(
        sys.selectedNode.userData.item.name,
        sys.selectedNode.userData.item.provider || "",
        false,
        pal.accentHex
      );
      sys.selectedNode.userData.emblemMesh.material.map = unselTex;
      sys.selectedNode.userData.emblemMesh.material.needsUpdate = true;
      sys.selectedNode = null;
    }

    if (!focusedModelId) return;

    const targetNode = sys.nodes.find((n) => n.userData.item.id === focusedModelId);
    if (!targetNode) return;

    sys.selectedNode = targetNode;
    targetNode.userData.outerRingMesh.material.color.setHex(pal.accent);
    targetNode.userData.spokeMat.color.setHex(pal.accent);
    targetNode.userData.spokeMat.opacity = 0.85;
    gsap.to(targetNode.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3, ease: "power2.out" });

    // Update texture to glowing selected state
    const selTex = createNodeEmblemTexture(
      targetNode.userData.item.name,
      targetNode.userData.item.provider || "",
      true,
      pal.accentHex
    );
    targetNode.userData.emblemMesh.material.map = selTex;
    targetNode.userData.emblemMesh.material.needsUpdate = true;

    // Smoothly rotate the ring to align targetNode to front (-Math.PI / 2)
    const ringGroup = targetNode.userData.ringGroup as THREE.Group;
    const targetAngle = -targetNode.userData.angle - Math.PI / 2;
    const currentRot = ringGroup.rotation.y;
    const diff = ((targetAngle - currentRot + Math.PI) % (Math.PI * 2)) - Math.PI;
    const finalRot = currentRot + diff;

    gsap.killTweensOf(ringGroup.rotation);
    gsap.to(ringGroup.rotation, {
      y: finalRot,
      duration: 0.8,
      ease: "power3.out",
    });
  }, [focusedModelId, theme]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[460px] overflow-hidden select-none ${className}`}
    />
  );
};
