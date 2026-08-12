import { Suspense, useEffect, useRef } from 'react';
import { Environment, ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** Rim light whose color eases toward the live lamp color for a cohesive scene. */
function ColorRim({ activeColor = '#ffffff', intensity = 0.55, position = [7, 2.6, -6] }) {
  const ref = useRef(null);
  const target = useRef(new THREE.Color(activeColor));

  useEffect(() => {
    target.current.set(activeColor || '#ffffff');
  }, [activeColor]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const k = 1 - Math.pow(0.0025, delta);
    ref.current.color.lerp(target.current, k);
  });

  return <directionalLight ref={ref} position={position} intensity={intensity} />;
}

/**
 * Product-style lighting: HDR environment carries the base, a neutral key defines form,
 * and a lamp-tinted rim + contact shadow ground the model for a premium studio look.
 */
export default function SceneLighting({ activeColor = '#ffffff' }) {
  return (
    <>
      <hemisphereLight args={['#e6ebf2', '#050505', 0.4]} />

      {/* Neutral key — window direction */}
      <directionalLight position={[-5.5, 11, 9]} intensity={1.4} color="#f7f4ed" />

      {/* Soft opposite fill so shadows don't crush */}
      <directionalLight position={[6, 4, 7]} intensity={0.35} color="#dfe6f0" />

      {/* Lamp-tinted back rim for edge separation */}
      <ColorRim activeColor={activeColor} intensity={0.6} position={[7, 2.6, -6]} />
      <ColorRim activeColor={activeColor} intensity={0.4} position={[-7, 1.6, -5]} />

      <ambientLight intensity={0.08} />

      {/* Soft ground shadow for premium product grounding 
      <ContactShadows
        position={[0, -1.55, 0]}
        opacity={0.5}
        scale={16}
        blur={3.2}
        far={5}
        resolution={512}
        color="#000000"
      />
    */}

      <Suspense fallback={null}>
        <Environment preset="studio" environmentIntensity={0.55} />
      </Suspense>
    </>
  );
}
