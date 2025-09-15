// import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { cdSettings } from '../constants/cdSettings';
import CdWheel from './CdWheel';

export default function CdRackScene(props: CdWheelProps) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    return () => pmrem.dispose();
  }, [gl, scene]);

  const rightLocal = useMemo(
    () =>
      new THREE.Vector3(1, 0, 0).applyEuler(cdSettings.WHEEL_ROT).normalize(),
    [],
  );
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight
        intensity={0.3}
        position={[5, 3, 8]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      {/* <OrbitControls
        enablePan={false}
        enableZoom={false}
        target={[0, 0, 0]}
      /> */}
      <CdWheel
        {...props}
        rightLocal={rightLocal}
      />
    </>
  );
}
