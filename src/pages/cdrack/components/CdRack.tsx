import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import useCdModel from '../hooks/useCdModel';
import CdRackScene from './CdRackScene';
import { cdSettings } from '../constants/cdSettings';

export default function CdRack({ items, isModalOpen }: CdRackProps) {
  const { caseGeom, cdGeom, coverGeom, caseAxisIndex } = useCdModel();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
      camera={{ fov: 15, near: 0.1, far: 40 }}
      className='w-full h-full'
      onCreated={({ camera }) => {
        const pitch = THREE.MathUtils.degToRad(cdSettings.CAM_PITCH);
        camera.position.set(
          0,
          Math.cos(pitch) * cdSettings.CAM_RADIUS * 0.004,
          Math.sin(pitch) * cdSettings.CAM_RADIUS,
        );
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 0);
      }}
      >
      <CdRackScene
        items={items}
        caseGeom={caseGeom}
        cdGeom={cdGeom}
        coverGeom={coverGeom}
        caseAxisIndex={caseAxisIndex}
        isModalOpen={isModalOpen}
      />
    </Canvas>
  );
}
