import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { cdSettings } from '../constants/cdSettings';
import useCdModel from '../hooks/useCdModel';
import CdRackScene from './CdRackScene';
import Loading from '../../../components/Loading';

export default function CdRack({ items, isModalOpen }: CdRackProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const { caseGeom, cdGeom, coverGeom, caseAxisIndex } = useCdModel();

  return (
    <>
    {isLoading && <Loading />}
      <Suspense fallback={null}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          camera={{ fov: 15, near: 0.1, far: 40 }}
          className={`w-full h-full transition-opacity duration-200 ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
          onCreated={({ camera }) => {
            const pitch = THREE.MathUtils.degToRad(cdSettings.CAM_PITCH);
            camera.position.set(
              0,
              Math.cos(pitch) * cdSettings.CAM_RADIUS * 0.004,
              Math.sin(pitch) * cdSettings.CAM_RADIUS,
            );
            camera.up.set(0, 0, 1);
            camera.lookAt(0, 0, 0);
          }}>
          <CdRackScene
            items={items}
            caseGeom={caseGeom}
            cdGeom={cdGeom}
            coverGeom={coverGeom}
            caseAxisIndex={caseAxisIndex}
            isModalOpen={isModalOpen}
            onLoaded={() => setIsLoading(false)}
          />
        </Canvas>
      </Suspense>
    </>
  );
}
