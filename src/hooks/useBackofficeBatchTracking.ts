import { useEffect, useRef, useCallback } from 'react';
import { trackEvent } from '@/utils/ga';

interface TrackingSession {
  featureName: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

interface FeatureStats {
  usage_count: number;
  total_duration: number;
  min_duration: number;
  max_duration: number;
  average_duration?: number;
  median_duration?: number;
  durations: number[];
}

interface UserPattern {
  features_used: Set<string>;
  total_sessions: number;
  total_time: number;
  average_session_time?: number;
}

interface UserPatternResult {
  features_used: string[];
  total_sessions: number;
  total_time: number;
  average_session_time: number;
}

const createBatchManager = () => {
  let sessions: TrackingSession[] = [];
  let flushTimer: NodeJS.Timeout | null = null;

  // 중앙값 계산
  const calculateMedian = (numbers: number[]): number => {
    const sorted = numbers.sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  };

  // 분석 데이터 계산
  const calculateAnalytics = () => {
    const featureStats: Record<string, FeatureStats> = {};
    const userPatterns: Record<string, UserPattern> = {};
    const uniqueFeatures = new Set<string>();
    const uniqueUsers = new Set<string>();

    sessions.forEach((session) => {
      const { featureName, userId, duration } = session;

      uniqueFeatures.add(featureName);
      if (userId) uniqueUsers.add(userId);

      // 기능별 통계
      if (!featureStats[featureName]) {
        featureStats[featureName] = {
          usage_count: 0,
          total_duration: 0,
          min_duration: Infinity,
          max_duration: 0,
          durations: [],
        };
      }

      const stats = featureStats[featureName];
      if (duration) {
        stats.usage_count += 1;
        stats.total_duration += duration;
        stats.min_duration = Math.min(stats.min_duration, duration);
        stats.max_duration = Math.max(stats.max_duration, duration);
        stats.durations.push(duration);
      }

      // 사용자별 패턴 (userId가 있을 때만)
      if (userId) {
        if (!userPatterns[userId]) {
          userPatterns[userId] = {
            features_used: new Set(),
            total_sessions: 0,
            total_time: 0,
          };
        }

        const pattern = userPatterns[userId];
        pattern.features_used.add(featureName);
        pattern.total_sessions += 1;
        if (duration) pattern.total_time += duration;
      }
    });

    Object.keys(featureStats).forEach((feature) => {
      const stats = featureStats[feature];
      if (stats.durations.length > 0) {
        stats.average_duration = stats.total_duration / stats.durations.length;
        stats.median_duration = calculateMedian(stats.durations);
      }
      delete stats.durations;
    });

    Object.keys(userPatterns).forEach((userId) => {
      const pattern = userPatterns[userId];
      pattern.average_session_time =
        pattern.total_time / pattern.total_sessions;
    });

    // UserPattern을 UserPatternResult로 변환
    const userPatternsResult: Record<string, UserPatternResult> = {};
    Object.keys(userPatterns).forEach((userId) => {
      const pattern = userPatterns[userId];
      userPatternsResult[userId] = {
        ...pattern,
        features_used: Array.from(pattern.features_used),
        average_session_time: pattern.total_time / pattern.total_sessions,
      };
    });

    return {
      featureStats,
      userPatterns: userPatternsResult,
      uniqueFeatures: Array.from(uniqueFeatures),
      uniqueUsers: Array.from(uniqueUsers),
    };
  };

  // 배치 전송
  const flush = () => {
    if (sessions.length === 0) return;

    // 기능별, 사용자별 그룹화 및 통계 계산
    const analytics = calculateAnalytics();

    // 전송할 이벤트 데이터 구성
    const eventData = {
      session_count: sessions.length,
      unique_features: analytics.uniqueFeatures.length,
      unique_users: analytics.uniqueUsers.length,
      feature_stats: analytics.featureStats,
      user_patterns: analytics.userPatterns,
      timestamp: new Date().toISOString(),
      batch_id: Date.now().toString(),
      feature_name: analytics.uniqueFeatures.join(','),
      custom_user_id: analytics.uniqueUsers.join(','),
      session_id: Date.now().toString(),
    };

    // 🔍 상세 디버깅 로그
    console.log('🚀 ===== 백오피스 배치 전송 시작 =====');
    console.log('📊 수집된 세션 데이터:', sessions);
    console.log('📈 계산된 분석 데이터:', analytics);
    console.log('📤 전송할 이벤트 데이터:', eventData);
    console.log(
      '📋 feature_stats 상세:',
      JSON.stringify(analytics.featureStats, null, 2),
    );
    console.log(
      '👥 user_patterns 상세:',
      JSON.stringify(analytics.userPatterns, null, 2),
    );
    console.log('🏷️ feature_name 목록:', analytics.uniqueFeatures);
    console.log('👤 user_id 목록:', analytics.uniqueUsers);
    console.log('🚀 ===== 백오피스 배치 전송 완료 =====');

    // 상세 이벤트로 정리
    trackEvent('backoffice_feature_analytics', eventData);

    console.log('📊 백오피스 배치 데이터 전송:', {
      sessions: sessions.length,
      features: analytics.uniqueFeatures,
      users: analytics.uniqueUsers.length,
    });

    // 초기화
    sessions = [];
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
  };

  return {
    addSession: (session: TrackingSession) => {
      sessions.push(session);
      console.log(
        `📝 세션 추가됨: ${session.featureName} (${session.userId}) - 현재 세션 수: ${sessions.length}`,
      );

      // 30개 쌓이거나 10초마다 전송
      if (sessions.length >= 30) {
        console.log('⚡ 30개 세션 도달 - 즉시 전송');
        flush();
      } else if (!flushTimer) {
        console.log('⏰ 10초 타이머 시작 - 10초 후 전송 예정');
        flushTimer = setTimeout(() => {
          console.log('⏰ 10초 타이머 완료 - 전송 시작');
          flush();
        }, 10000);
      }
    },

    forceFlush: () => {
      flush();
    },

    // 디버깅용 (개발 환경에서만)
    ...(process.env.NODE_ENV === 'development' && {
      getSessionCount: () => sessions.length,
      getSessions: () => [...sessions],
    }),
  };
};

const batchManager = createBatchManager();

// 백오피스용 추적 훅
export const useBackofficeFeatureTracking = (
  featureName: string,
  userId?: string,
  minDuration = 1000,
) => {
  const startTimeRef = useRef<number | undefined>(undefined);
  const isTrackingRef = useRef<boolean>(false);

  const startTracking = useCallback(() => {
    if (isTrackingRef.current) return;

    startTimeRef.current = Date.now();
    isTrackingRef.current = true;

    // 디버깅용: 현재 페이지 경로와 기능명 표시
    const currentPath = window.location.pathname;
    console.log(
      `🎯 [GA 추적 시작] ${currentPath} → ${featureName} (사용자: ${
        userId || '익명'
      })`,
    );
  }, [featureName, userId]);

  const endTracking = useCallback(() => {
    if (!startTimeRef.current || !isTrackingRef.current) return;

    const duration = Date.now() - startTimeRef.current;

    // 최소 시간 이상만 배치에 추가
    if (duration >= minDuration) {
      batchManager.addSession({
        featureName,
        userId,
        startTime: startTimeRef.current,
        endTime: Date.now(),
        duration,
      });

      // 디버깅용: 추적 완료 정보 (간단하게)
      console.log(
        `📊 [GA 추적 완료] ${featureName}: ${(duration / 1000).toFixed(1)}초`,
      );
    }

    startTimeRef.current = undefined;
    isTrackingRef.current = false;
  }, [featureName, userId, minDuration]);

  // 페이지 언로드 시 강제 전송
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isTrackingRef.current) {
        endTracking();
      }
      batchManager.forceFlush();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [endTracking]);

  // 컴포넌트 언마운트 시 추적 종료
  useEffect(() => {
    return () => {
      if (isTrackingRef.current) {
        endTracking();
      }
    };
  }, [endTracking]);

  return {
    startTracking,
    endTracking,
    isTracking: isTrackingRef.current,
  };
};

// 자동 추적 버전
export const useAutoBackofficeTracking = (
  featureName: string,
  userId?: string,
  minDuration?: number,
) => {
  const { startTracking, endTracking, isTracking } =
    useBackofficeFeatureTracking(featureName, userId, minDuration);

  useEffect(() => {
    startTracking();
    return endTracking;
  }, [startTracking, endTracking]);

  return { isTracking };
};
