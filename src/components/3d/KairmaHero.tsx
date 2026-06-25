"use client";

import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { useLoader } from "@react-three/fiber";

/* ------------------------------------------------------------------ */
/*  CONFIG — all visual knobs in one place                            */
/* ------------------------------------------------------------------ */
export const CONFIG = {
  bevelSegments: 10,
  extrudeDepth: 1,
  targetWidth: 0.15,
  bloom: {
    strength: 1.2,
    radius: 0.4,
    threshold: 0.15,
  },
  material: {
    color: "#ffffff",
    transmission: 1,
    thickness: 2,
    roughness: 0.08,
    iridescence: 1,
    iridescenceThicknessRange: [100, 400] as [number, number],
    attenuationColor: "#1FAA68",
    attenuationDistance: 5,
  },
  environmentPreset: "studio" as const,
  autoRotateSpeed: 1,
};

/* ------------------------------------------------------------------ */
/*  Bloom via three.js core EffectComposer + UnrealBloomPass          */
/*  (avoids @react-three/postprocessing crash on Next 16 / React 19)  */
/* ------------------------------------------------------------------ */
function BloomEffect() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      CONFIG.bloom.strength,
      CONFIG.bloom.radius,
      CONFIG.bloom.threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera, size]);

  useFrame(() => {
    if (composerRef.current) {
      composerRef.current.render();
    }
  }, 1); // priority 1 → runs after default render

  return null;
}

/* ------------------------------------------------------------------ */
/*  Extruded glass mark from K.svg                                    */
/* ------------------------------------------------------------------ */
function ExtrudedGlassMark() {
  const svg = useLoader(SVGLoader, "/Bentos/K.svg");

  const shapes = useMemo(() => {
    return svg.paths.flatMap((path) => path.toShapes(true));
  }, [svg]);

  const extrudeSettings = useMemo(
    () => ({
      depth: CONFIG.extrudeDepth,
      bevelEnabled: true,
      bevelSegments: CONFIG.bevelSegments,
      steps: 1,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    }),
    []
  );

  return (
    <group scale={[CONFIG.targetWidth, -CONFIG.targetWidth, CONFIG.targetWidth]}>
      {shapes.map((shape, i) => (
        <mesh key={i}>
          <extrudeGeometry args={[shape, extrudeSettings]} />
          <meshPhysicalMaterial
            color={CONFIG.material.color}
            transmission={CONFIG.material.transmission}
            thickness={CONFIG.material.thickness}
            roughness={CONFIG.material.roughness}
            iridescence={CONFIG.material.iridescence}
            iridescenceIOR={1.5}
            iridescenceThicknessRange={CONFIG.material.iridescenceThicknessRange}
            attenuationColor={CONFIG.material.attenuationColor}
            attenuationDistance={CONFIG.material.attenuationDistance}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Fallback wireframe box (shown while SVG loads or on error)        */
/* ------------------------------------------------------------------ */
function FallbackMark() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#1FAA68" wireframe />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner scene — rotation, environment, bloom                        */
/* ------------------------------------------------------------------ */
function Scene({ useFallback }: { useFallback?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReducedMotion) {
        groupRef.current.rotation.y += delta * CONFIG.autoRotateSpeed;
      }
    }
  });

  return (
    <>
      <Environment preset={CONFIG.environmentPreset} />

      <group ref={groupRef}>
        <Center>
          <Suspense fallback={<FallbackMark />}>
            {useFallback ? <FallbackMark /> : <ExtrudedGlassMark />}
          </Suspense>
        </Center>
      </group>

      <BloomEffect />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                  */
/* ------------------------------------------------------------------ */
export default function KairmaHero({
  useFallback = false,
}: {
  useFallback?: boolean;
}) {
  return (
    <div className="w-full h-full relative" style={{ minHeight: "300px" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true }}
        frameloop="always"
      >
        <color attach="background" args={["#05060A"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Scene useFallback={useFallback} />
      </Canvas>
    </div>
  );
}
