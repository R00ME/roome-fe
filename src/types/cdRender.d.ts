type Axis = 0 | 1 | 2;

interface Size3 {
  x: number;
  y: number;
  z: number;
}

interface UnitizeOptions {
  center?: boolean;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}

interface CdModel {
  caseGeom: THREE.BufferGeometry;
  cdGeom: THREE.BufferGeometry;
  coverGeom: THREE.BufferGeometry;
  caseAxisIndex: Axis;
}

interface CdSetProps {
  item: CdItem;
  caseGeom: THREE.BufferGeometry;
  cdGeom: THREE.BufferGeometry;
  coverGeom: THREE.BufferGeometry;
  caseAxisIndex: Axis;
  rightLocal: THREE.Vector3;
  basePosition: THREE.Vector3;
}

interface CdWheelProps {
  items: CdItem[];
  caseGeom: THREE.BufferGeometry;
  cdGeom: THREE.BufferGeometry;
  coverGeom: THREE.BufferGeometry;
  caseAxisIndex: Axis;
  rightLocal?: THREE.Vector3;
  isModalOpen?: boolean;
}
