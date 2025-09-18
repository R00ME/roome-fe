import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
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
  isModalOpen,
}: CdWheelProps) {
  const wheel = useRef<THREE.Group>(null);
  const setPhase = useCdStore((set) => set.setPhase);

  const phase = useRef(0);
  const phaseVel = useRef(0);

  const dir = useMemo(() => cdSettings.DIR.clone(), []);

  const paddedItems: ExtendedCdItem[] = useMemo(() => {
    const placeholdersNeeded = Math.max(0, 10 - items.length);
    const placeholders = Array.from({ length: placeholdersNeeded }, (_, i) => ({
      myCdId: -1000 - i,
      title: '',
      artist: '',
      album: '',
      releaseDate: '',
      genres: [],
      coverUrl: '',
      youtubeUrl: '',
      duration: 0,
      isPlaceholder: true,
    }));
    return [...items, ...placeholders];
  }, [items]);

  useEffect(() => {
    if (isModalOpen) return;

    const onWheel = (e: WheelEvent) => {
      if (items.length <= 10) return;
      phaseVel.current += e.deltaY * -0.003;
    };

    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - touchStartY;
        touchStartY = currentY;

        if (items.length > 10) {
          phaseVel.current += deltaY * -0.01;
        }
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [isModalOpen, items.length]);

  useFrame((_state, dt) => {
    phase.current += phaseVel.current * dt;
    phaseVel.current *= Math.exp(-2.2 * dt);

    const N = paddedItems.length;
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
      position={[-0.4, -0.3, 0]}>
      {paddedItems.map((item: CdItem, i: number) => {
        const N = paddedItems.length;
        const CENTER = (N - 1) * 0.5;
        const base = dir.clone().multiplyScalar((i - CENTER) * cdSettings.STEP);
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
