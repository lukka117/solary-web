import { Suspense, useMemo, useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Bounds, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import solaryModelUrl from '../../assets/SolaryOptimized.glb?url';
import { tuneMaterials, isFullLights } from '../../utils/solaryGlowUtils';
import { useSolaryGLTF } from '../../utils/useSolaryGLTF';
import { breathePulse, emissiveIntensityBoost } from '../../utils/lampGlowMath';
import { LAMP_COLOR_DURATION_SEC, LAMP_COLOR_EASE } from '../../utils/lampColorTransition';
import SceneLighting from './SceneLighting';
import RotatingProduct from './RotatingProduct';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

/** Small presets-viewport Solary; framing via Bounds, minimal sway. */
const SWAY_Y = 0.014;
const SWAY_X = 0.004;
const SWAY_Z = 0.002;
const SWAY_SPEED = 0.045;

function PresetsModel({ activeColor }) {
  const group = useRef();
  const lampGlowLight = useRef();
  const reduceMotionRef = useRef(false);
  const fullLightsMaterialRef = useRef(null);
  const emissiveColorRef = useRef(new THREE.Color(activeColor || '#ffb347'));
  const emissiveDisplay = useRef(new THREE.Color());

  const { scene } = useSolaryGLTF(solaryModelUrl);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    if (!clonedScene) return;
    let glowMat = null;

    clonedScene.traverse((child) => {
      if (!child.isMesh || !isFullLights(child.name)) return;
      const current = Array.isArray(child.material) ? child.material[0] : child.material;

      const m = current;
      if (!m || !('emissive' in m)) return;

      const clone = m.clone();
      clone.userData.solaryGlowLayer = true;
      clone.emissiveIntensity = m.emissiveIntensity ?? 1;
      if (clone.emissive) clone.emissive.copy(m.emissive);
      else clone.emissive = new THREE.Color(0x000000);

      if (Array.isArray(child.material)) {
        child.material = child.material.slice();
        child.material[0] = clone;
      } else {
        child.material = clone;
      }
      glowMat = clone;
    });

    fullLightsMaterialRef.current = glowMat;
    tuneMaterials(clonedScene, fullLightsMaterialRef.current);
  }, [clonedScene]);

  useLayoutEffect(() => {
    if (!activeColor || !fullLightsMaterialRef.current) return;
    const targetColor = new THREE.Color(activeColor);
    gsap.killTweensOf(emissiveColorRef.current);
    gsap.to(emissiveColorRef.current, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: LAMP_COLOR_DURATION_SEC,
      ease: LAMP_COLOR_EASE,
    });
  }, [activeColor]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduceMotionRef.current = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const glowMat = fullLightsMaterialRef.current;

    const reduce = reduceMotionRef.current;

    if (glowMat) {
      const baseRgb = emissiveColorRef.current;
      const spectral = emissiveIntensityBoost(baseRgb);
      const animateLight = !reduce;
      const pulse = breathePulse(t, animateLight);

      emissiveDisplay.current.copy(baseRgb);
      emissiveDisplay.current.multiplyScalar(1 + Math.min(0.5, spectral - 1) * 0.26);

      glowMat.emissive.copy(emissiveDisplay.current);

      const emissiveIntensityBase = reduce ? 1.45 : 2.35;
      glowMat.emissiveIntensity = emissiveIntensityBase * spectral * pulse;

      const pl = lampGlowLight.current;
      if (pl) {
        pl.color.copy(baseRgb);
        const lightBase = reduce ? 2.0 : 5.0;
        pl.intensity = lightBase * spectral * pulse * 0.72;
      }
    }

    if (!group.current) return;
    if (reduce) {
      group.current.rotation.set(0, Math.PI, 0);
      return;
    }
    group.current.rotation.y = Math.PI + Math.sin(t * SWAY_SPEED) * SWAY_Y;
    group.current.rotation.x = Math.sin(t * SWAY_SPEED * 0.85) * SWAY_X;
    group.current.rotation.z = Math.sin(t * SWAY_SPEED * 0.65) * SWAY_Z;
  });

  return (
    <Bounds fit clip margin={1.38}>
      <RotatingProduct limit={Math.PI / 4} sensitivity={0.005}>
        <group ref={group} dispose={null} scale={16.2} position={[0, -0.06, 0]} rotation={[0, Math.PI, 0]}>
          <pointLight
            ref={lampGlowLight}
            position={[0.06, 0.05, 0.38]}
            distance={24}
            decay={2}
            intensity={3.2}
          />
          <Center>
            <primitive object={clonedScene} />
          </Center>
        </group>
      </RotatingProduct>
    </Bounds>
  );
}

export default function PresetsModelCanvas({ activeColor }) {
  const mobile = useMemo(() => isMobile(), []);
  const [inView, setInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="presets-model-canvas"
    >
      <Canvas
        shadows
        dpr={mobile ? [1, 1] : [1, 1.5]}
        gl={{
          toneMappingExposure: 1.06,
          powerPreference: 'high-performance',
          antialias: !mobile,
          alpha: true,
        }}
        camera={{ position: [0, 0.12, 6], fov: 42, near: 0.1, far: 20 }}
        frameloop={inView ? 'always' : 'never'}
        style={{ pointerEvents: 'auto', touchAction: 'none', cursor: 'grab' }}
      >
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <SceneLighting />
          <PresetsModel activeColor={activeColor} />
        </Suspense>

        <EffectComposer multisampling={0} depthBuffer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0.64}
            luminanceSmoothing={0.42}
            intensity={mobile ? 0.42 : 0.62}
            mipmapBlur
            radius={mobile ? 0.3 : 0.36}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
