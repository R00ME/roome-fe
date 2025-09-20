import { useCallback, useRef } from 'react';
import { trackEvent } from '@/utils/ga';

// 백오피스 통합을 위한 기능 enum
export const FEATURE_NAMES = {
  BOOK: 'book',
  GUESTBOOK: 'guestbook',
  THEME: 'theme',
  CD: 'cd',
  COMMENT: 'comment',
} as const;

export type FeatureName = (typeof FEATURE_NAMES)[keyof typeof FEATURE_NAMES];

// 기능 사용 추적을 위한 간단한 훅
export const useFeatureUsageTracking = () => {
  const startTimesRef = useRef<Map<FeatureName, number>>(new Map());

  // 기능 사용 시작 (스탬프만 저장)
  const startFeatureTracking = useCallback(
    (featureName: FeatureName, userId?: string) => {
      const startTime = Date.now();
      startTimesRef.current.set(featureName, startTime);

      // console.log(
      //   '🚀 기능 사용 시작:',
      //   featureName,
      //   'User:',
      //   userId,
      //   'Start Time:',
      //   startTime,
      // );
    },
    [],
  );

  // 기능 완료 (시간 계산해서 한 번에 전송)
  const trackFeatureCompletion = useCallback(
    (
      featureName: FeatureName,
      userId: string | undefined,
      additionalData: Record<string, unknown> = {},
    ) => {
      const startTime = startTimesRef.current.get(featureName);
      const endTime = Date.now();
      const duration = startTime ? endTime - startTime : 0;

      // console.log(
      //   '✅ 기능 완료:',
      //   featureName,
      //   'Duration:',
      //   duration + 'ms',
      //   'Data:',
      //   additionalData,
      // );

      // 완료 시 한 번에 모든 데이터 전송 (백오피스 통합용)
      trackEvent(`${featureName}_usage`, {
        custom_user_id: userId || 'anonymous',
        duration_sec: Math.round(duration / 1000),
        ...additionalData,
      });

      // 사용 완료된 기능의 시작 시간 제거
      startTimesRef.current.delete(featureName);
    },
    [],
  );

  return {
    startFeatureTracking,
    trackFeatureCompletion,
  };
};
