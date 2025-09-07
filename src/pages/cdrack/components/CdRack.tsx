import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default function CdRack({ items }: CdProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hostRef.current) return;
    const host = hostRef.current;

    // ───────── Renderer / Scene / Camera
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;

    const camera = new THREE.PerspectiveCamera(17, window.innerWidth / window.innerHeight, 0.15, 40);
    scene.add(camera);

    const CAM_RADIUS = 9;
    const CAM_PITCH = 89.9;

    function setAngledTopDown(
      radius: number,
      pitchDeg: number,
      target = new THREE.Vector3(0, 0, 0),
    ) {
      const pitch = THREE.MathUtils.degToRad(pitchDeg);
      const y = Math.cos(pitch) * radius ;
      const z = Math.sin(pitch) * radius ;

      camera.position.set(0, y, z);
      camera.up.set(0, 0, 1);

      const lookTarget = target.clone().add(new THREE.Vector3(0, 0, 0));
      camera.lookAt(lookTarget);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight.position.set(5, 6, 8);
    scene.add(dirLight);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    const DEG = (d: number) => THREE.MathUtils.degToRad(d);
    const WHEEL_ROT = new THREE.Euler(DEG(-13), DEG(5), 0); // 전체 스택 기울기
    const SET_ROT = new THREE.Euler(0, 0.23, 0); // 세트 공통 기울기

    const wheel = new THREE.Group();
    wheel.rotation.copy(WHEEL_ROT);
    scene.add(wheel);

    const focus = new THREE.Vector3();
    wheel.getWorldPosition(focus);
    setAngledTopDown(CAM_RADIUS, CAM_PITCH, focus);

    const WHEEL_OFFSET_X = -1.6; 
    const WHEEL_OFFSET_Y = -0.5; 
    wheel.position.x += WHEEL_OFFSET_X;
    wheel.position.y += WHEEL_OFFSET_Y;

    // ───────── 로더/유틸
    const loader = new GLTFLoader();
    async function loadGeometry(url: string): Promise<THREE.BufferGeometry> {
      const glb = await loader.loadAsync(url);

      let found: THREE.BufferGeometry | null = null;
      glb.scene.traverse((o) => {
        if (!found && (o as any)?.isMesh)
          found = (o as THREE.Mesh).geometry.clone();
      });
      if (!found) throw new Error(`🚨 ${url} Mesh가 없습니다.`);
      return found;
    }

    function unitizeTo(
      geom: THREE.BufferGeometry,
      targetSize: { x: number; y: number; z: number },
      options?: {
        center?: boolean;
        rotateX?: number;
        rotateY?: number;
        rotateZ?: number;
      },
    ) {
      const g = geom.clone();
      const rx = options?.rotateX ?? 0,
        ry = options?.rotateY ?? 0,
        rz = options?.rotateZ ?? 0;
      if (rx || ry || rz)
        g.applyMatrix4(
          new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(rx, ry, rz),
          ),
        );
      g.computeBoundingBox();
      const bb = g.boundingBox!;
      const size = new THREE.Vector3().subVectors(bb.max, bb.min);
      g.applyMatrix4(
        new THREE.Matrix4().makeScale(
          targetSize.x / (size.x || 1),
          targetSize.y / (size.y || 1),
          targetSize.z / (size.z || 1),
        ),
      );
      const doCenter = options?.center ?? true;
      if (doCenter) {
        g.computeBoundingBox();
        const bb2 = g.boundingBox!;
        const c = new THREE.Vector3()
          .addVectors(bb2.min, bb2.max)
          .multiplyScalar(0.5);
        g.applyMatrix4(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
      }
      g.computeVertexNormals();
      return g;
    }

    function thinAxis(g: THREE.BufferGeometry): 0 | 1 | 2 {
      g.computeBoundingBox();
      const s = new THREE.Vector3().subVectors(
        g.boundingBox!.max,
        g.boundingBox!.min,
      );
      if (s.x <= s.y && s.x <= s.z) return 0;
      if (s.y <= s.x && s.y <= s.z) return 1;
      return 2;
    }
    const axisVec = (i: 0 | 1 | 2) =>
      i === 0
        ? new THREE.Vector3(1, 0, 0)
        : i === 1
        ? new THREE.Vector3(0, 1, 0)
        : new THREE.Vector3(0, 0, 1);
    function alignGeomToAxis(
      geom: THREE.BufferGeometry,
      src: 0 | 1 | 2,
      dst: 0 | 1 | 2,
    ) {
      if (src === dst) return geom;
      const q = new THREE.Quaternion().setFromUnitVectors(
        axisVec(src),
        axisVec(dst),
      );
      geom.applyQuaternion(q);
      geom.computeVertexNormals();
      return geom;
    }
    function getSize(g: THREE.BufferGeometry) {
      g.computeBoundingBox();
      return new THREE.Vector3().subVectors(
        g.boundingBox!.max,
        g.boundingBox!.min,
      );
    }
    const axisOffsetVec = (axis: 0 | 1 | 2, d: number) =>
      axis === 0
        ? new THREE.Vector3(d, 0, 0)
        : axis === 1
        ? new THREE.Vector3(0, d, 0)
        : new THREE.Vector3(0, 0, d);

    function ensurePlanarUVs(geom: THREE.BufferGeometry, thin: 0 | 1 | 2) {
      const pos = geom.getAttribute('position') as THREE.BufferAttribute;
      const n = pos.count;
      const uv = new Float32Array(n * 2);
      const bb = new THREE.Box3().setFromBufferAttribute(pos);
      const min = bb.min,
        max = bb.max;
      const size = new THREE.Vector3().subVectors(max, min);
      let a: 0 | 1 | 2, b: 0 | 1 | 2;
      if (thin === 0) {
        a = 1;
        b = 2;
      } else if (thin === 1) {
        a = 0;
        b = 2;
      } else {
        a = 0;
        b = 1;
      }
      const invA =
        1 / Math.max(1e-9, a === 0 ? size.x : a === 1 ? size.y : size.z);
      const invB =
        1 / Math.max(1e-9, b === 0 ? size.x : b === 1 ? size.y : size.z);
      const get = (i: number, ax: 0 | 1 | 2) =>
        ax === 0 ? pos.getX(i) : ax === 1 ? pos.getY(i) : pos.getZ(i);
      for (let i = 0; i < n; i++) {
        const ua =
          (get(i, a) - (a === 0 ? min.x : a === 1 ? min.y : min.z)) * invA;
        const vb =
          (get(i, b) - (b === 0 ? min.x : b === 1 ? min.y : min.z)) * invB;
        uv[i * 2 + 0] = ua;
        uv[i * 2 + 1] = 1 - vb; 
      }
      geom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      (geom.attributes.uv as THREE.BufferAttribute).needsUpdate = true;
    }

    const CASE_SIZE = { x: 0.8, y: 0.8, z: 0.02 };
    const CD_SIZE = { x: 0.6, y: 0.02, z: 0.6 };
    const COVER_SIZE = { x: 0.7, y: 0.7, z: 0.005 };

    let caseGeom: THREE.BufferGeometry | undefined;
    let cdGeom: THREE.BufferGeometry | undefined;
    let coverGeom: THREE.BufferGeometry | undefined;
    let caseAxisIndex: 0 | 1 | 2 = 2;

    (async () => {
      try {
        const [rawCase, rawCd, rawCover] = await Promise.all([
          loadGeometry('/models/cd_case.glb'),
          loadGeometry('/models/cd.glb'),
          loadGeometry('/models/albumCover.glb'),
        ]);

        caseGeom = unitizeTo(rawCase, CASE_SIZE);
        cdGeom = unitizeTo(rawCd, CD_SIZE);
        coverGeom = unitizeTo(rawCover, COVER_SIZE);

        caseAxisIndex = thinAxis(caseGeom);
        cdGeom = alignGeomToAxis(cdGeom, thinAxis(cdGeom), caseAxisIndex);

        ensurePlanarUVs(cdGeom, caseAxisIndex);

        const coverThin = thinAxis(coverGeom);
        ensurePlanarUVs(coverGeom, coverThin);

        buildRack();
      } catch (err) {
        console.error(
          '🚨 파일 로더에 실패했습니다 :',
          err,
        );
        caseGeom = new THREE.BoxGeometry(CASE_SIZE.x, CASE_SIZE.y, CASE_SIZE.z);
        cdGeom = new THREE.CylinderGeometry(
          CD_SIZE.x / 2,
          CD_SIZE.x / 2,
          CD_SIZE.y,
          96,
        );
        coverGeom = new THREE.BoxGeometry(
          COVER_SIZE.x,
          COVER_SIZE.y,
          COVER_SIZE.z,
        );
        caseAxisIndex = thinAxis(caseGeom);
        ensurePlanarUVs(cdGeom, caseAxisIndex);
        ensurePlanarUVs(coverGeom, 2);
        buildRack();
      }
    })();

    const RIGHT_LOCAL = new THREE.Vector3(1, 0, 0)
      .applyEuler(WHEEL_ROT)
      .normalize();

    const texLoader = new THREE.TextureLoader();

    const CD_LABEL_URL = '/textures/cd_texture.png';
    const cdLabelTex = texLoader.load(CD_LABEL_URL);
    cdLabelTex.colorSpace = THREE.SRGBColorSpace;
    cdLabelTex.minFilter = THREE.LinearMipmapLinearFilter;
    cdLabelTex.magFilter = THREE.LinearFilter;
    cdLabelTex.generateMipmaps = true;
    cdLabelTex.anisotropy = renderer.capabilities.getMaxAnisotropy?.() ?? 1;
    cdLabelTex.center.set(0.5, 0.5);
    cdLabelTex.rotation = 0;

    const coverTexCache = new Map<string, THREE.Texture>();
    const getCoverTex = (url: string) => {
      const cached = coverTexCache.get(url);
      if (cached) return cached;
      const t = texLoader.load(url);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = true;
      t.repeat.x = -1;
      t.offset.x = 1;
      t.anisotropy = renderer.capabilities.getMaxAnisotropy?.() ?? 1;
      coverTexCache.set(url, t);
      return t;
    };

    // 재질
    const caseMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.22,
      metalness: 0.0,
      transmission: 1.0,
      thickness: 1.2,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      color: 0xaebedc,
      side: THREE.DoubleSide,
    });

    const cdEdgeMat = new THREE.MeshPhysicalMaterial({
      roughness: 0.05,
      metalness: 0.0,
      iridescence: 0.9,
      iridescenceIOR: 1,
      iridescenceThicknessRange: [120, 380],
      color: 0xffffff,
    });

    const cdFaceMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: cdLabelTex,
      roughness: 0.9,
      metalness: 0.0,
      clearcoat: 0.0,
      iridescence: 0.0,
      envMapIntensity: 0.0,
      side: THREE.DoubleSide,
    });

    // ───────── 레일
    const DIR = new THREE.Vector3(1, 0, 2.4).normalize(); 
    const STEP = 0.8;

    const groups: THREE.Group[] = [];
    const covers: THREE.Mesh[] = [];
    const cdMeshes: THREE.Mesh[] = [];
    const cdBasePos: THREE.Vector3[] = [];
    const cdBaseQuat: THREE.Quaternion[] = [];
    const cdSlideMax: number[] = [];

    const hoverNow = new Float32Array(items.length);
    const hoverTarget = new Float32Array(items.length);

    function makeCdSet(coverUrl: string) {
      const caseSize = getSize(caseGeom!);
      const thickness = [caseSize.x, caseSize.y, caseSize.z][caseAxisIndex];
      const halfT = thickness * 0.5;

      const RIGHT_AXIS: 0 | 1 | 2 = caseAxisIndex === 0 ? 1 : 0;

      const caseMesh = new THREE.Mesh(caseGeom!, caseMat);

      let cdMesh: THREE.Mesh;
      if (cdGeom!.groups && cdGeom!.groups.length >= 3) {
        cdMesh = new THREE.Mesh(cdGeom!, [cdEdgeMat, cdFaceMat, cdFaceMat]);
      } else {
        cdMesh = new THREE.Mesh(cdGeom!, cdFaceMat);
      }

      const coverMat = new THREE.MeshStandardMaterial({
        roughness: 0.2,
        metalness: 0.0,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
        side: THREE.DoubleSide,
      });
      const cover = new THREE.Mesh(coverGeom!, coverMat);
      cover.renderOrder = 1;
      coverMat.map = getCoverTex(coverUrl);

      caseMesh.rotation.copy(SET_ROT);
      const coverThin = thinAxis(coverGeom!);
      cover.quaternion.premultiply(
        new THREE.Quaternion().setFromUnitVectors(
          axisVec(coverThin),
          axisVec(caseAxisIndex),
        ),
      );

      const coverOffset = halfT + 0.002;
      const cdOffset = -halfT + 0.0098;
      const baseCdPos = axisOffsetVec(caseAxisIndex, cdOffset);
      cdMesh.position.copy(baseCdPos);
      cover.position.copy(axisOffsetVec(caseAxisIndex, coverOffset));

      const caseWidthAlongRight =
        RIGHT_AXIS === 0
          ? caseSize.x
          : RIGHT_AXIS === 1
          ? caseSize.y
          : caseSize.z;
      const slideMax = 0.5 * caseWidthAlongRight;

      caseMesh.add(cdMesh, cover);
      const g = new THREE.Group();
      g.add(caseMesh);

      cdMeshes.push(cdMesh);
      cdBasePos.push(baseCdPos.clone());
      cdBaseQuat.push(cdMesh.quaternion.clone());
      cdSlideMax.push(slideMax);
      covers.push(cover);
      groups.push(g);

      return { group: g };
    }

    function buildRack() {
      const N = items.length;
      const CENTER = (N - 1) * 0.5;
      for (let i = 0; i < N; i++) {
        const { group } = makeCdSet(items[i].coverUrl);
        group.userData.index = i;
        const base = new THREE.Vector3()
          .copy(DIR)
          .multiplyScalar((i - CENTER) * STEP);
        group.position.copy(base);
        wheel.add(group);
      }
    }

    // ───────── 인터랙션
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(9999, 9999);
    let hovered = -1;

    host.addEventListener('pointermove', (e) => {
      const r = host.getBoundingClientRect();
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    });
    host.addEventListener('pointerleave', () => {
      ndc.set(9999, 9999);
      if (hovered >= 0) {
        hoverTarget[hovered] = 0;
        hovered = -1;
      }
    });

    // 레일 이동
    let phase = 0,
      phaseVel = 0;
    const WHEEL_TO_PHASE = 0.003,
      PHASE_DECAY = 2.2;
    host.addEventListener(
      'wheel',
      (e) => {
        phaseVel += e.deltaY * WHEEL_TO_PHASE * -1;
      },
      { passive: true },
    );

    const GROUP_POP = -0.6;
    const CD_ROLL_MAX = Math.PI / 6;
    const HOVER_RATE = 11;
    const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);
    const tmpBase = new THREE.Vector3();
    const tmpShift = new THREE.Vector3();
    const tmpRight = new THREE.Vector3();
    const qTmp = new THREE.Quaternion();

    const clock = new THREE.Clock();
    let raf = 0;

    function wrapCentered(t: number, N: number) {
      const C = (N - 1) * 0.5;
      return ((((t + C) % N) + N) % N) - C;
    }

    const tick = () => {
      const dt = clock.getDelta();

      phase += phaseVel * dt;
      phaseVel *= Math.exp(-PHASE_DECAY * dt);

      const N = groups.length;
      for (let i = 0; i < N; i++) {
        const t = wrapCentered(i - phase, N);

        tmpBase.copy(DIR).multiplyScalar(t * STEP);

        const k = damp(HOVER_RATE, dt);
        hoverNow[i] += (hoverTarget[i] - hoverNow[i]) * k;

        tmpShift.copy(RIGHT_LOCAL).multiplyScalar(GROUP_POP * hoverNow[i]);
        groups[i].position.copy(tmpBase.add(tmpShift));

        const slide = -cdSlideMax[i] * hoverNow[i];
        tmpRight.set(0, 0, 0);
        if (caseAxisIndex === 0) {
          tmpRight.set(0, slide, 0);
        } else {
          tmpRight.set(slide, 0, 0);
        }
        cdMeshes[i].position.copy(cdBasePos[i]).add(tmpRight);

        qTmp.setFromAxisAngle(
          axisVec(caseAxisIndex),
          CD_ROLL_MAX * hoverNow[i],
        );
        cdMeshes[i].quaternion.copy(cdBaseQuat[i]).multiply(qTmp);
      }

      if (
        ndc.x >= -1 &&
        ndc.x <= 1 &&
        ndc.y >= -1 &&
        ndc.y <= 1 &&
        covers.length > 0
      ) {
        raycaster.setFromCamera(ndc, camera);
        const hit = raycaster.intersectObjects(covers, false)[0];
        const id =
          (hit?.object?.parent as THREE.Object3D | undefined)?.parent?.userData
            ?.index ?? -1;
        if (id !== hovered) {
          if (hovered >= 0) hoverTarget[hovered] = 0;
          hovered = id;
          if (hovered >= 0) hoverTarget[hovered] = 1;
        }
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // ───────── 정리
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      host.replaceChildren();
      renderer.dispose();
      envMap.dispose();
      pmrem.dispose();

      cdLabelTex.dispose();
      coverTexCache.forEach((t) => t.dispose());

      wheel.traverse((o) => {
        const m = o as any;
        if (m.isMesh) {
          const mesh = m as THREE.Mesh;
          const mat = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((mm) => (mm as any).dispose?.());
          else (mat as any).dispose?.();
        }
      });
    };
  }, [items]);

  return (
    <div
      ref={hostRef}
      className='w-full h-full'
    />
  );
}
