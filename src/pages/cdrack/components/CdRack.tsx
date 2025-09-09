import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import useCdModel from '../hooks/useCdModel';
import CdRackScene from './CdRackScene';

export default function CdRack({ items }: CdRackProps) {
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
      className='w-full h-full'>
      <CdRackScene
        items={items}
        caseGeom={caseGeom}
        cdGeom={cdGeom}
        coverGeom={coverGeom}
        caseAxisIndex={caseAxisIndex}
      />
    </Canvas>
  );
}
