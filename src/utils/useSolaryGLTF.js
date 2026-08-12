import { useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

/** Matches bundled three.js — Basis transcoder must align with THREE release. */
const THREE_PKG_VER = '0.184.0';

export const SOLARY_DRACO_DECODER =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.7/';

const BASIS_TRANSCODER_PATH = `https://unpkg.com/three@${THREE_PKG_VER}/examples/jsm/libs/basis/`;

/**
 * Loads SolaryOptimized.glb (Draco + KHR_texture_basisu / KTX2).
 * Plain useGLTF + Draco is not enough; GLTFLoader needs KTX2Loader for textures.
 */
export function useSolaryGLTF(url) {
  const gl = useThree((s) => s.gl);
  const extendLoader = useCallback(
    (loader) => {
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.setTranscoderPath(BASIS_TRANSCODER_PATH);
      ktx2Loader.detectSupport(gl);
      loader.setKTX2Loader(ktx2Loader);
    },
    [gl],
  );
  return useGLTF(url, SOLARY_DRACO_DECODER, true, extendLoader);
}
