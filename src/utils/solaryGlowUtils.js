import * as THREE from 'three';

function normalizeMeshName(name) {
  return (name || '').replace(/\s+/g, '').toLowerCase();
}

export function isFullLights(name) {
  const n = normalizeMeshName(name);
  return n === 'fulllights' || (n.includes('full') && n.includes('light'));
}

const clamp = THREE.MathUtils.clamp;

export function tuneMaterials(scene, glowMaterial) {
  scene.traverse((child) => {
    if (!child.isMesh) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    const nameNorm = normalizeMeshName(child.name);
    const isGlowMesh =
      nameNorm.replace(/[^a-z0-9]/g, '') === 'fulllights' ||
      (nameNorm.includes('full') && nameNorm.includes('light'));

    const accentMetal =
      nameNorm.includes('metal') ||
      nameNorm.includes('chrome') ||
      nameNorm.includes('ring') ||
      nameNorm.includes('base');

    for (const mat of mats) {
      if (!mat) continue;

      const isGlow = isGlowMesh || (glowMaterial && mat === glowMaterial);
      const hasPbrMetal = 'metalness' in mat && typeof mat.metalness === 'number';
      const origMetal = hasPbrMetal ? mat.metalness : 0;
      const origRough = mat.roughness ?? 0.5;
      const isMetal = !isGlow && (accentMetal || origMetal >= 0.28);

      if (hasPbrMetal) {
        if (isGlow) {
          /* Emitter / diffuser: matte plastic — weak env so it reads opaque, not pearlescent */
          mat.metalness = clamp(origMetal * 0.12, 0, 0.06);
          mat.roughness = clamp(origRough * 0.35 + 0.46, 0.72, 0.95);
          if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 0.12;
        } else if (isMetal) {
          /* Brushed aluminum: mid roughness + anisotropy = elongated highlights, richer env */
          mat.metalness = clamp(
            Math.max(origMetal * 0.85, accentMetal ? 0.66 : 0.6),
            0.58,
            0.82,
          );
          mat.roughness = clamp(origRough * 0.8 + 0.3, 0.4, 0.62);
          if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 0.62;
        } else {
          /* Painted / polymer: chalkier, almost no specular highlight from the HDR */
          mat.metalness = clamp(origMetal * 0.28 + 0.02, 0, 0.1);
          mat.roughness = clamp(origRough * 0.84 + 0.44, 0.58, 0.88);
          if (mat.envMapIntensity !== undefined) mat.envMapIntensity = 0.26;
        }
      }

      if (mat.isMeshPhysicalMaterial) {
        if (typeof mat.iridescence === 'number') mat.iridescence = 0;
        if (typeof mat.sheen === 'number') mat.sheen = 0;
        if (typeof mat.sheenRoughness === 'number') mat.sheenRoughness = 1;

        if (isMetal) {
          /* Subtle anisotropic brushing + a whisper of clearcoat = premium finish */
          if ('anisotropy' in mat) {
            mat.anisotropy = clamp(Math.max(mat.anisotropy ?? 0, 0.7), 0.6, 0.92);
          }
          if ('anisotropyRotation' in mat) {
            mat.anisotropyRotation = (mat.anisotropyRotation ?? 0) + Math.PI * 0.24;
          }
          mat.clearcoat = 0.28;
          mat.clearcoatRoughness = 0.45;
          if (typeof mat.specularIntensity === 'number') {
            mat.specularIntensity = clamp(mat.specularIntensity * 0.55, 0.25, 0.6);
          }
        } else {
          /* Strip varnish / pearlescence from diffuser + painted parts */
          mat.clearcoat = 0;
          mat.clearcoatRoughness = 1;
          const spMul = isGlow ? 0.5 : 0.42;
          const spMin = isGlow ? 0.15 : 0.18;
          const spMax = isGlow ? 0.42 : 0.48;
          if (typeof mat.specularIntensity === 'number') {
            mat.specularIntensity = clamp(mat.specularIntensity * spMul, spMin, spMax);
          }
        }
      }

      if (!isGlow && mat.emissive) {
        mat.emissive.setHex(0x000000);
        if (mat.emissiveIntensity !== undefined) mat.emissiveIntensity = 0;
      }

      mat.needsUpdate = true;
    }
  });
}
