import * as THREE from "three";
import { useLoader } from '@react-three/fiber';
import { useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from "three-stdlib";
import { cdSettings } from '../constants/cdSettings';
import {
  alignGeomToAxis,
  ensurePlanarUVs,
  thinAxis,
  unitizeTo,
} from '../utils/cdUtils';

export default function useCdModel(): CdModel {
  const glbCase = useLoader(GLTFLoader, '/models/cd_case.glb');
  const glbCd = useLoader(GLTFLoader, '/models/cd.glb');
  const glbCover = useLoader(GLTFLoader, '/models/albumCover.glb');

  const getGeom = (glb: GLTF): THREE.BufferGeometry => {
    let found: THREE.BufferGeometry | null = null;
    glb.scene.traverse((o) => {
      if (!found && (o as THREE.Mesh).isMesh) {
        found = (o as THREE.Mesh).geometry.clone();
      }
    });
    if (!found) throw new Error('🚨 해당 glb에서 mesh를 찾을 수 없습니다.');
    return found;
  };

  return useMemo(() => {
    const rawCase = getGeom(glbCase);
    const rawCd = getGeom(glbCd);
    const rawCover = getGeom(glbCover);

    const caseGeom = unitizeTo(rawCase, cdSettings.CASE_SIZE);
    let cdGeom = unitizeTo(rawCd, cdSettings.CD_SIZE);
    const coverGeom = unitizeTo(rawCover, cdSettings.COVER_SIZE);

    const caseAxisIndex = thinAxis(caseGeom);
    cdGeom = alignGeomToAxis(cdGeom, thinAxis(cdGeom), caseAxisIndex);

    ensurePlanarUVs(cdGeom, caseAxisIndex);
    ensurePlanarUVs(coverGeom, thinAxis(coverGeom));

    return { caseGeom, cdGeom, coverGeom, caseAxisIndex };
  }, [glbCase, glbCd, glbCover]);
}
