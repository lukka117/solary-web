import { useRef, useLayoutEffect, useEffect } from 'react';
import { Center } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import solaryModelUrl from '../../assets/SolaryOptimized.glb?url';

import { tuneMaterials, isFullLights } from '../../utils/solaryGlowUtils';
import { useSolaryGLTF } from '../../utils/useSolaryGLTF';
import { breathePulse, emissiveIntensityBoost } from '../../utils/lampGlowMath';
import { LAMP_COLOR_DURATION_SEC, LAMP_COLOR_EASE } from '../../utils/lampColorTransition';

const BASE_ROTATION_Y = Math.PI;
const IDLE_DAMP = 8;
const IDLE_DAMP_REDUCE = 12;
const WORLD_SCALE = 9.5;
const POSITION = [0, -0.28, -0.55];

/** Normalized pointer (-1..1), smoothed toward cursor (hero canvas is pointer-events-none). */
const POINTER_GOAL_DAMP = 11;
const FOLLOW_YAW = 0.26;
const FOLLOW_PITCH = 0.14;
const FOLLOW_POS_X = 0.07;
const FOLLOW_POS_Y = 0.05;

const INTRO_DURATION = 1.6;
const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

export default function SolaryModel({
  activeColor,
  sceneActive = true,
  mobile = false,
  intro = true,
}) {
  const group = useRef();
  const lampGlowLight = useRef();
  const reduceMotionRef = useRef(false);
  const pointerGoalRef = useRef({ x: 0, y: 0 });
  const pointerSmoothRef = useRef({ x: 0, y: 0 });
  const fullLightsMaterialRef = useRef(null);
  const emissiveDisplay = useRef(new THREE.Color());
  const introStartRef = useRef(null);

  const { scene } = useSolaryGLTF(solaryModelUrl);
  const emissiveColorRef = useRef(new THREE.Color(activeColor || '#fff'));

  useLayoutEffect(() => {
    if (!scene) return;
    let glowMat = null;

    scene.traverse((child) => {
      if (!child.isMesh || !isFullLights(child.name)) return;

      const current = Array.isArray(child.material) ? child.material[0] : child.material;
      if (current?.userData?.solaryGlowLayer) {
        glowMat = current;
        return;
      }

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
    tuneMaterials(scene, fullLightsMaterialRef.current);
  }, [scene]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reduceMotionRef.current = mq.matches;
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (mobile || !sceneActive) return undefined;

    const onMove = (e) => {
      if (reduceMotionRef.current) return;
      const w = window.innerWidth || 1;
      const h = window.innerHeight || 1;
      pointerGoalRef.current.x = (e.clientX / w) * 2 - 1;
      pointerGoalRef.current.y = -(e.clientY / h) * 2 + 1;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mobile, sceneActive]);

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

  useLayoutEffect(() => {
    if (!group.current) return;
    const [tx, ty, tz] = POSITION;
    group.current.position.set(tx, ty, tz);
    group.current.rotation.order = 'YXZ';
    group.current.rotation.set(0, BASE_ROTATION_Y, 0);
  }, [scene]);

  useFrame((state, delta) => {
    const reduce = reduceMotionRef.current;
    const t = state.clock.elapsedTime;

    /* Power-on intro: hold dark/small until `intro` flips, then ramp in. */
    let introK = 0;
    if (introStartRef.current === null) {
      if (intro) introStartRef.current = t;
    } else {
      introK = easeOutCubic(Math.min(1, (t - introStartRef.current) / INTRO_DURATION));
    }
    if (reduce) introK = intro ? 1 : 0;

    const glowMat = fullLightsMaterialRef.current;
    if (glowMat) {
      const baseRgb = emissiveColorRef.current;
      const spectral = emissiveIntensityBoost(baseRgb);
      const animateLight = !reduce;
      const pulse = breathePulse(t, animateLight);

      emissiveDisplay.current.copy(baseRgb);
      emissiveDisplay.current.multiplyScalar(1 + Math.min(0.7, spectral - 1) * 0.4);

      glowMat.emissive.copy(emissiveDisplay.current);

      const emissiveIntensityBase = reduce ? 1.45 : 3.5;
      glowMat.emissiveIntensity = emissiveIntensityBase * spectral * pulse * introK;

      const pl = lampGlowLight.current;
      if (pl) {
        pl.color.copy(baseRgb);
        const lightBase = reduce ? 5.0 : 8.0;
        pl.intensity = lightBase * spectral * pulse * introK;
      }
    }

    if (!group.current) return;

    const introScale = WORLD_SCALE * (0.82 + 0.18 * introK);
    group.current.scale.setScalar(introScale);
    const introYaw = (1 - introK) * 0.55;
    const introLift = (1 - introK) * 0.35;

    const idle = reduce ? 0 : 1;
    const pg = pointerGoalRef.current;
    const ps = pointerSmoothRef.current;
    const followPointer = !reduce && sceneActive && !mobile;

    if (followPointer) {
      ps.x = THREE.MathUtils.damp(ps.x, pg.x, POINTER_GOAL_DAMP, delta);
      ps.y = THREE.MathUtils.damp(ps.y, pg.y, POINTER_GOAL_DAMP, delta);
    } else {
      ps.x = THREE.MathUtils.damp(ps.x, 0, POINTER_GOAL_DAMP, delta);
      ps.y = THREE.MathUtils.damp(ps.y, 0, POINTER_GOAL_DAMP, delta);
    }

    const mx = followPointer ? ps.x : 0;
    const my = followPointer ? ps.y : 0;

    const targetRotY =
      BASE_ROTATION_Y + idle * Math.sin(t * 0.08) * 0.012 + mx * FOLLOW_YAW + introYaw;
    const targetRotX = idle * Math.sin(t * 0.06) * 0.008 + my * FOLLOW_PITCH;
    const targetRotZ = idle * Math.sin(t * 0.05) * 0.006;

    const damp = reduce ? IDLE_DAMP_REDUCE : IDLE_DAMP;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotY, damp, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotX, damp, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, targetRotZ, damp, delta);

    const [bx, by, bz] = POSITION;
    const targetX = bx + mx * FOLLOW_POS_X;
    const targetY = by + my * FOLLOW_POS_Y - introLift;
    const targetZ = bz;

    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 6, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, targetY, 6, delta);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, targetZ, 6, delta);
  });

  return (
    <group ref={group} dispose={null} scale={WORLD_SCALE}>
      <pointLight
        ref={lampGlowLight}
        position={[0.06, 0.05, 0.38]}
        distance={36}
        decay={1}
        intensity={60}
      />
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

