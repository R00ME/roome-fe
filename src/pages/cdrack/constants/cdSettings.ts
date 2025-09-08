import * as THREE from "three";
import { DEG } from "../utils/cdUtils";

export const cdSettings = {
  CAM_RADIUS: 9,
  CAM_PITCH: 80,

  // 휠(랙) 배치
  WHEEL_ROT: new THREE.Euler(DEG(-24), DEG(9), 0), // 전체 스택 기울기
  SET_ROT: new THREE.Euler(0, 0.3, 0),             // 세트 공통 기울기
  DIR: new THREE.Vector3(1, 0, 2.4).normalize(),    // 레일 진행방향
  STEP: 0.6,                                        // 아이템 간격

  // 인터랙션
  GROUP_POP: -0.6,             // 호버시 그룹 오른쪽 이동량
  CD_ROLL_MAX: Math.PI / 6,    // 호버시 CD 굴림
  CD_OFFSET_EPS: 0.001,       // CD를 케이스 안/밖 미세 오프셋

  // 기본 사이즈
  CASE_SIZE: { x: 0.8, y: 0.8, z: 0.04 },
  CD_SIZE: { x: 0.6, y: 0.009, z: 0.6 },
  COVER_SIZE: { x: 0.7, y: 0.7, z: 0.005 },

  // 텍스처 경로
  CD_LABEL_URL: "/textures/cd_texture.png",
} as const; 
