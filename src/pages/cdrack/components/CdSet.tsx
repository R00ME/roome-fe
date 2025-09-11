// 수정 코드
import { useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as THREE from 'three';
import { useCdStore } from '../../../store/useCdStore';
import { cdSettings } from '../constants/cdSettings';
import useCdMaterials from '../hooks/useCdMaterials';
import { axisOffsetVec, axisVec, getSize, thinAxis } from '../utils/cdUtils';

export default function CdSet({
  item,
  caseGeom,
  cdGeom,
  coverGeom,
  caseAxisIndex,
  rightLocal,
  basePosition,
}: Omit<CdSetProps, 'coverUrl'> & { item: ExtendedCdItem }) {
  const navigate = useNavigate();
  const { userId } = useParams();

  const isPlaceholder = item.isPlaceholder ?? false;

  const group = useRef<THREE.Group>(null!);
  const cdMesh = useRef<THREE.Mesh>(null!);
  const coverMesh = useRef<THREE.Mesh>(null);

  const { caseMat, cdEdgeMat, cdFaceMat } = useCdMaterials();
  const { gl } = useThree();
  const { hoveredCd, setHoveredCd } = useCdStore();
  const hoverTimer = useRef<number>(0);

  const coverTex = useTexture(item.coverUrl); 

  coverTex.colorSpace = THREE.SRGBColorSpace;
  coverTex.minFilter = THREE.LinearFilter;
  coverTex.magFilter = THREE.LinearFilter;
  coverTex.anisotropy = gl.capabilities.getMaxAnisotropy?.() ?? 1;
  coverTex.wrapS = THREE.ClampToEdgeWrapping;
  coverTex.wrapT = THREE.ClampToEdgeWrapping;
  coverTex.generateMipmaps = true;
  coverTex.repeat.x = -1;
  coverTex.offset.x = 1;

  const coverMat = useMemo(() =>{

    if (isPlaceholder) return null;
    return new THREE.MeshStandardMaterial({
      roughness: 0.2,
      metalness: 0.0,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,
      map: coverTex,
    })
  },[coverTex, isPlaceholder],
  );

  const { baseCdPos, slideMax, coverOffset, coverAlignQuat } = useMemo(() => {
    const caseSize = getSize(caseGeom);
    const thickness = [caseSize.x, caseSize.y, caseSize.z][caseAxisIndex];
    const halfT = thickness * 0.5;

    const RIGHT_AXIS = caseAxisIndex === 0 ? 1 : 0;
    const caseWidthAlongRight =
      RIGHT_AXIS === 0
        ? caseSize.x
        : RIGHT_AXIS === 1
        ? caseSize.y
        : caseSize.z;

    const coverThin = thinAxis(coverGeom);

    return {
      baseCdPos: axisVec(caseAxisIndex)
        .clone()
        .multiplyScalar(-halfT + cdSettings.CD_OFFSET_EPS),
      slideMax: 0.5 * caseWidthAlongRight,
      coverOffset: halfT + 0.002,
      coverAlignQuat: new THREE.Quaternion().setFromUnitVectors(
        axisVec(coverThin),
        axisVec(caseAxisIndex),
      ),
    };
  }, [caseGeom, caseAxisIndex, coverGeom]);

  const hoverNow = useRef(0);
  const hoverTarget = useRef(0);

  const caseMesh = useRef<THREE.Mesh>(null!);

  useFrame((_state, dt) => {
    if (isPlaceholder) return;
    const k = 1 - Math.exp(-11 * dt);
    hoverNow.current += (hoverTarget.current - hoverNow.current) * k;

    const shift = rightLocal
      .clone()
      .multiplyScalar(cdSettings.GROUP_POP * hoverNow.current);
    caseMesh.current.position.copy(shift);

    const RIGHT_AXIS = caseAxisIndex === 0 ? 1 : 0;
    const slide = -slideMax * hoverNow.current;
    const addRight = new THREE.Vector3(
      RIGHT_AXIS === 0 ? slide : 0,
      RIGHT_AXIS === 1 ? slide : 0,
      RIGHT_AXIS === 2 ? slide : 0,
    );
    cdMesh.current.position.copy(baseCdPos).add(addRight);

    const qRoll = new THREE.Quaternion().setFromAxisAngle(
      axisVec(caseAxisIndex),
      cdSettings.CD_ROLL_MAX * hoverNow.current,
    );
    cdMesh.current.quaternion.copy(qRoll);

    const isHovered = hoveredCd?.myCdId === item.myCdId;
    hoverTarget.current = isHovered ? 1 : 0;
  });

  return (
    <group
      ref={group}
      position={basePosition}
      onClick={(e) => {
        if (isPlaceholder) return;
        e.stopPropagation();
        navigate(`/cd/${item.myCdId}/user/${userId}`);
      }}
      onPointerOver={(e) => {
        if (isPlaceholder) return;
        e.stopPropagation();
        clearTimeout(hoverTimer.current);
        hoverTimer.current = window.setTimeout(() => {
          setHoveredCd(item);
        }, 140);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (isPlaceholder) return;
        clearTimeout(hoverTimer.current);
        setHoveredCd(null);
        document.body.style.cursor = 'default';
      }}>
      <mesh
        ref={caseMesh}
        geometry={caseGeom}
        material={caseMat}
        castShadow
        receiveShadow={true}
        rotation={cdSettings.SET_ROT}>
        {!isPlaceholder && (
          <>
            <mesh
              ref={cdMesh}
              geometry={cdGeom}
              material={
                cdGeom.groups && cdGeom.groups.length >= 3
                  ? [cdEdgeMat, cdFaceMat, cdFaceMat]
                  : cdFaceMat
              }
              position={baseCdPos}
            />
            <mesh
              ref={coverMesh}
              geometry={coverGeom}
              material={coverMat!}
              position={axisOffsetVec(caseAxisIndex, coverOffset)}
              quaternion={coverAlignQuat}
              receiveShadow={true}
            />
          </>
        )}
      </mesh>
    </group>
  );
}
