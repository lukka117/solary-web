import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, AdaptiveDpr } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import SceneLighting from './SceneLighting';
import SolaryModel from './SolaryModel';

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

export default function SolaryCanvas({ activeColor, sceneActive = true, intro = true }) {
  const mobile = useMemo(() => isMobile(), []);

  return (
    <Canvas
      shadows
      dpr={mobile ? [1, 1] : [1, 1.5]}
      gl={{
        toneMappingExposure: 1.06,
        powerPreference: 'high-performance',
        antialias: !mobile,
        alpha: false,
      }}
      camera={{ position: [0, 0.12, 5.85], fov: 46, near: 0.1, far: 50 }}
      frameloop={sceneActive ? 'always' : 'never'}
      style={{ cursor: 'grab' }}
    >
      <color attach="background" args={['#000000']} />

      <SceneLighting activeColor={activeColor} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!mobile}
        minPolarAngle={Math.PI / 2.8}
        maxPolarAngle={Math.PI / 1.6}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        rotateSpeed={0.3}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <AdaptiveDpr pixelated />

      <Suspense fallback={null}>
        <SolaryModel activeColor={activeColor} sceneActive={sceneActive} mobile={mobile} intro={intro} />
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
  );
}
