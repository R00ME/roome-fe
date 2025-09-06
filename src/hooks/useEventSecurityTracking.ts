import { useCallback, useRef, useEffect } from 'react';
import { trackEvent } from '@/utils/ga';

// 보안 추적 전용 훅
export const useSecurityTracking = (eventId?: string, userId?: string) => {
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);
  const sessionStartTimeRef = useRef(Date.now());

  // 연속 클릭 감지
  const trackRapidClicking = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    if (timeSinceLastClick < 200) {
      // 200ms 이내 연속 클릭
      clickCountRef.current++;

      if (clickCountRef.current > 3) {
        trackEvent('suspicious_event_clicking', {
          custom_user_id: userId || 'anonymous',
          event_category: 'event_security',
          event_label: 'rapid_clicks',
          value: clickCountRef.current,
          custom_parameter_1: `${timeSinceLastClick}ms_interval`,
          custom_parameter_2: eventId,
        });
      }
    } else {
      clickCountRef.current = 0;
    }

    lastClickTimeRef.current = now;
  }, [eventId, userId]);

  // 즉시 참여 감지
  const trackImmediateParticipation = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTimeRef.current;

    // 페이지 로드 후 3초 내 이벤트 참여
    if (sessionDuration < 3000) {
      trackEvent('suspicious_immediate_participation', {
        custom_user_id: userId || 'anonymous',
        event_category: 'event_security',
        event_label: 'immediate_click',
        value: sessionDuration,
        custom_parameter_1: eventId,
      });
    }
  }, [eventId, userId]);

  // 종합 보안 추적
  const trackSecurityEvent = useCallback(() => {
    trackRapidClicking();
    trackImmediateParticipation();
  }, [trackRapidClicking, trackImmediateParticipation]);

  return { trackSecurityEvent };
};

// 이벤트 추적 전용 훅
export const useEventTracking = (
  options: {
    eventId?: string;
    rewardPoints?: number;
    maxParticipants?: number;
    userId?: string;
  } = {},
) => {
  const participationAttemptsRef = useRef(0);

  // 페이지 뷰 추적
  useEffect(() => {
    trackEvent('event_page_view', {
      custom_user_id: options.userId || 'anonymous',
      event_category: 'event',
      event_label: 'event_page_loaded',
      custom_parameter_1: options.eventId || 'unknown',
    });
  }, [options.eventId, options.userId]);

  // 이벤트 참여 시도 추적
  const trackParticipationAttempt = useCallback(() => {
    participationAttemptsRef.current++;

    trackEvent('event_participation_attempt', {
      custom_user_id: options.userId || 'anonymous',
      event_category: 'event',
      event_label: 'participation_attempted',
      value: participationAttemptsRef.current,
      custom_parameter_1: options.eventId,
    });
  }, [options.eventId, options.userId]);

  // 이벤트 참여 성공 추적
  const trackParticipationSuccess = useCallback(() => {
    trackEvent('event_participation_success', {
      custom_user_id: options.userId || 'anonymous',
      event_category: 'event',
      event_label: 'participation_complete',
      value: options.rewardPoints || 0,
      custom_parameter_1: options.eventId,
      custom_parameter_2: options.maxParticipants?.toString(),
    });
  }, [
    options.eventId,
    options.rewardPoints,
    options.maxParticipants,
    options.userId,
  ]);

  // 이벤트 참여 실패 추적
  const trackParticipationFailure = useCallback(
    (
      error?:
        | Error
        | { response?: { data?: { message?: string }; status?: number } },
    ) => {
      trackEvent('event_participation_failed', {
        custom_user_id: options.userId || 'anonymous',
        event_category: 'event',
        event_label: 'participation_failed',
        custom_parameter_1: options.eventId,
        custom_parameter_2:
          error && 'response' in error
            ? error.response?.data?.message || 'unknown_error'
            : 'unknown_error',
        custom_parameter_3:
          error && 'response' in error
            ? error.response?.status?.toString()
            : undefined,
      });
    },
    [options.eventId, options.userId],
  );

  return {
    trackParticipationAttempt,
    trackParticipationSuccess,
    trackParticipationFailure,
  };
};

// 통합 훅 (기존 API 유지)
export const useEventSecurityTracking = (
  options: {
    eventId?: string;
    rewardPoints?: number;
    maxParticipants?: number;
  } = {},
) => {
  const { trackSecurityEvent } = useSecurityTracking(options.eventId);
  const {
    trackParticipationAttempt,
    trackParticipationSuccess,
    trackParticipationFailure,
  } = useEventTracking(options);

  const trackEventClick = useCallback(() => {
    trackSecurityEvent();
  }, [trackSecurityEvent]);

  return {
    trackEventClick,
    trackParticipationAttempt,
    trackParticipationSuccess,
    trackParticipationFailure,
  };
};
