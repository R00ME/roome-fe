// import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { cdSettings } from '../constants/cdSettings';
import CdWheel from './CdWheel';

export default function CdRackScene(props: CdWheelProps) {
  const { camera, gl, scene } = useThree();

  useEffect(() => {
    const pitch = THREE.MathUtils.degToRad(cdSettings.CAM_PITCH);
    camera.position.set(
      0,
      Math.cos(pitch) * cdSettings.CAM_RADIUS * 0.004,
      Math.sin(pitch) * cdSettings.CAM_RADIUS,
    );
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
  }, [camera]);

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
