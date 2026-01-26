import { prepareModelTemplate } from '@pages/main/utils/prepareModelTemplate';
import { Center, useGLTF } from '@react-three/drei';
import { useEffect, useMemo } from 'react';

export default function HiveRoomModel({
  room,
  position,
  onModelLoaded,
}: HiveRoomModelProps) {
  const { scene: originalScene } = useGLTF(room.modelPath) as GLTFResult;

  const template = useMemo(
    () => prepareModelTemplate(room.modelPath, originalScene),
    [room.modelPath, originalScene],
  );

  const scene = useMemo(() => template.clone(true), [template]);

  const roomScale = 0.5;

  useEffect(() => {
    if (!scene) return;

    scene.position.set(...position);
    onModelLoaded(room.roomId);
  }, [scene, room.roomId, position, onModelLoaded]);

  return (
    <Center>
      <primitive
        object={scene}
        scale={roomScale}
        rotation={[0, -Math.PI / 4, 0]}
      />
    </Center>
  );
}
