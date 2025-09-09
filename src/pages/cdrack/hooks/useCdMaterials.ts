import { useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { cdSettings } from '../constants/cdSettings';

export default function useCdMaterials() {
  const { gl } = useThree();

  const cdLabelTex = useTexture(cdSettings.CD_LABEL_URL);
  cdLabelTex.colorSpace = THREE.SRGBColorSpace;
  cdLabelTex.minFilter = THREE.LinearMipMapLinearFilter;
  cdLabelTex.magFilter = THREE.LinearFilter;
  cdLabelTex.generateMipmaps = true;
  cdLabelTex.anisotropy = gl.capabilities.getMaxAnisotropy?.() ?? 1;

  const caseMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.22,
        metalness: 0.0,
        transmission: 1.0,
        thickness: 1.2,
        ior: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        color: 0xaebedc,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const cdEdgeMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        roughness: 0.05,
        metalness: 0.0,
        iridescence: 0.9,
        iridescenceIOR: 1.0,
        iridescenceThicknessRange: [120, 380],
        color: 0xffffff,
      }),
    [],
  );

  const cdFaceMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: cdLabelTex,
        roughness: 0.9,
        metalness: 0.8,
        clearcoat: 0.0,
        iridescence: 0.0,
        envMapIntensity: 0.0,
        side: THREE.DoubleSide,
      }),
    [cdLabelTex],
  );

  return { caseMat, cdEdgeMat, cdFaceMat };
}
