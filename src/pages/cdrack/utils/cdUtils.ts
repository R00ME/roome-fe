import * as THREE from 'three';

/* 각도 변환 */
export const DEG = (d: number) => THREE.MathUtils.degToRad(d);

/* 0(x), 1(y), 2(z) */
export const axisVec = (i: Axis): THREE.Vector3 =>
  i === 0
    ? new THREE.Vector3(1, 0, 0)
    : i === 1
    ? new THREE.Vector3(0, 1, 0)
    : new THREE.Vector3(0, 0, 1);

/* 축 이동 */
export const axisOffsetVec = (axis: Axis, d: number): THREE.Vector3 =>
  axis === 0
    ? new THREE.Vector3(d, 0, 0)
    : axis === 1
    ? new THREE.Vector3(0, d, 0)
    : new THREE.Vector3(0, 0, d);

/* Geometry 실제 크기 추출 */
export function getSize(g: THREE.BufferGeometry): THREE.Vector3 {
  g.computeBoundingBox();
  return new THREE.Vector3().subVectors(g.boundingBox!.max, g.boundingBox!.min);
}

/* 두께 축 추출 */
export function thinAxis(g: THREE.BufferGeometry): Axis {
  g.computeBoundingBox();
  const s = new THREE.Vector3().subVectors(
    g.boundingBox!.max,
    g.boundingBox!.min,
  );
  if (s.x <= s.y && s.x <= s.z) return 0;
  if (s.y <= s.x && s.y <= s.z) return 1;
  return 2;
}

/* 두께 축 정렬(서로 다른 축) */
export function alignGeomToAxis(
  geom: THREE.BufferGeometry,
  src: Axis,
  dst: Axis,
): THREE.BufferGeometry {
  if (src === dst) return geom;
  const q = new THREE.Quaternion().setFromUnitVectors(
    axisVec(src),
    axisVec(dst),
  );
  geom.applyQuaternion(q);
  geom.computeVertexNormals();
  return geom;
}

/* 공통 규격 맞춤 */
export function unitizeTo(
  geom: THREE.BufferGeometry,
  targetSize: Size3,
  options: UnitizeOptions = {},
): THREE.BufferGeometry {
  const g = geom.clone();

  // (1) 회전
  const rx = options.rotateX ?? 0;
  const ry = options.rotateY ?? 0;
  const rz = options.rotateZ ?? 0;
  if (rx || ry || rz) {
    g.applyMatrix4(
      new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz)),
    );
  }

  // (2) 스케일
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

  // (3) 센터 맞추기
  const doCenter = options.center ?? true;
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

/* uv 작업 */
export function ensurePlanarUVs(
  geom: THREE.BufferGeometry,
  thin: Axis,
  flipV: boolean = true,
): void {
  const pos = geom.getAttribute('position') as THREE.BufferAttribute;
  const n = pos.count;

  const bb = new THREE.Box3().setFromBufferAttribute(pos);
  const min = bb.min,
    max = bb.max;
  const size = new THREE.Vector3().subVectors(max, min);

  let a: Axis, b: Axis;
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

  const get = (i: number, ax: Axis) =>
    ax === 0 ? pos.getX(i) : ax === 1 ? pos.getY(i) : pos.getZ(i);

  const sizeArr = [size.x, size.y, size.z];
  const invA = 1 / Math.max(1e-9, sizeArr[a]);
  const invB = 1 / Math.max(1e-9, sizeArr[b]);

  const minArr = [min.x, min.y, min.z];
  const uv = new Float32Array(n * 2);
  for (let i = 0; i < n; i++) {
    const u = (get(i, a) - minArr[a]) * invA;
    const v = (get(i, b) - minArr[b]) * invB;
    uv[i * 2 + 0] = u;
    uv[i * 2 + 1] = flipV ? 1 - v : v;
  }
  geom.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  (geom.attributes.uv as THREE.BufferAttribute).needsUpdate = true;
}

/* 무한 순환 래핑 */
export function wrapCentered(t: number, N: number): number {
  const C = (N - 1) * 0.5;
  return ((((t + C) % N) + N) % N) - C;
}

/* 감쇠 */
export function damp(lambda: number, dt: number): number {
  return 1 - Math.exp(-lambda * dt);
}
