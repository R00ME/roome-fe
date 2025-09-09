import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { useCdStore } from '../../../store/useCdStore';
import { cdSettings } from '../constants/cdSettings';
import { wrapCentered } from '../utils/cdUtils';
import CdSet from './CdSet';

export default function CdWheel({
  items,
  caseGeom,
  cdGeom,
  coverGeom,
  caseAxisIndex,
  rightLocal,
}: CdWheelProps) {
  const wheel = useRef<THREE.Group>(null);
  const setPhase = useCdStore((set) => set.setPhase);

  const phase = useRef(0);
  const phaseVel = useRef(0);

  const dir = useMemo(() => cdSettings.DIR.clone(), []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      phaseVel.current += e.deltaY * -0.003;
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  useFrame((_state, dt) => {
    phase.current += phaseVel.current * dt;
    phaseVel.current *= Math.exp(-2.2 * dt);

    const N = items.length;
    if (wheel.current) {
      wheel.current.children.forEach((child, i) => {
        const t = wrapCentered(i - phase.current, N);
        const base = dir.clone().multiplyScalar(t * cdSettings.STEP);
        (child as THREE.Group).position.copy(base);
      });
    }

    setPhase(phase.current);
  });

  return (
      <group
        ref={wheel}
        rotation={cdSettings.WHEEL_ROT}
        position={[-0.5, -0.2, 0]}>
        {items.map((item: CdItem, i: number) => {
          const N = items.length;
          const CENTER = (N - 1) * 0.5;
          const base = dir
            .clone()
            .multiplyScalar((i - CENTER) * cdSettings.STEP);
          return (
            <CdSet
              key={item.myCdId}
              item={item}
              caseGeom={caseGeom}
              cdGeom={cdGeom}
              coverGeom={coverGeom}
              caseAxisIndex={caseAxisIndex}
              rightLocal={rightLocal}
              basePosition={base}
            />
          );
        })}
      </group>
  );
}
