/**
 * Google Analytics 4 유틸리티 모듈
 *
 * 주요 기능:
 * - GA4 초기화 및 설정
 * - 커스텀 이벤트 전송 (자동 user_id 포함)
 * - 페이지뷰 추적 (SPA 지원)
 * - 테스트 이벤트 (디버깅용)
 *
 * 사용 예시:
 * ```typescript
 * // GA 초기화
 * initGA('G-XXXXXXXXXX', 'user123');
 *
 * // 커스텀 이벤트 전송
 * trackEvent('button_click', {
 *   event_category: 'engagement',
 *   event_label: 'header_menu'
 * });
 *
 * // 페이지뷰 추적
 * trackPageView('/room/12', 'RoomE - 방명록');
 * ```
 */

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

/**
 * Google Analytics 4 초기화
 * @param measurementId - GA4 측정 ID (G-XXXXXXXXXX)
 * @param userId - 로그인한 사용자의 아이디 (선택사항)
 */
export const initGA = (measurementId: string, userId?: string) => {
  // 이미 로드되었는지 확인
  if (window.gtag) return;

  // gtag 스크립트 동적 로드
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // gtag 초기화 스크립트
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  `;
  document.head.appendChild(script2);

  // gtag가 로드된 후 config 호출
  script1.onload = () => {
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true,
        debug_mode: true,
        user_id: String(userId || 'anonymous'),
      });
      console.log('GA Config 설정 완료:', measurementId, 'User ID:', userId);
    }
  };
};

/**
 * 커스텀 이벤트 전송
 * @param eventName - 이벤트 이름 (예: 'button_click', 'page_view')
 * @param parameters - 이벤트 파라미터 객체
 * @param parameters.custom_user_id - 로그인한 사용자의 아이디 (자동 추가됨)
 * @param parameters.timestamp - 이벤트 발생 시간 (자동 추가됨)
 * @param parameters.event_category - 이벤트 카테고리 (선택사항)
 * @param parameters.event_label - 이벤트 라벨 (선택사항)
 * @param parameters.value - 이벤트 값 (선택사항)
 * @param parameters.custom_parameter_1 - 커스텀 파라미터 1 (선택사항)
 * @param parameters.custom_parameter_2 - 커스텀 파라미터 2 (선택사항)
 * @param parameters.custom_parameter_3 - 커스텀 파라미터 3 (선택사항)
 */
export const trackEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {},
) => {
  if (typeof window !== 'undefined') {
    // gtag가 없으면 dataLayer에 직접 추가
    if (window.gtag) {
      window.gtag('event', eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
      });
      console.log('GA Event tracked (gtag):', eventName, parameters);
    } else if (window.dataLayer) {
      // dataLayer에 직접 추가 (fallback)
      window.dataLayer.push({
        event: eventName,
        ...parameters,
        timestamp: new Date().toISOString(),
      });
      console.log('GA Event tracked (dataLayer):', eventName, parameters);
    } else {
      console.warn('GA not initialized, event not tracked:', eventName);
    }
  }
};

/**
 * 페이지뷰 추적 (SPA용)
 * @param pagePath - 페이지 경로 (예: '/room/12', '/bookcase')
 * @param pageTitle - 페이지 제목 (선택사항, 기본값: document.title)
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    });
    console.log('GA PageView tracked:', pagePath, pageTitle);
  }
};

/**
 * 테스트용 이벤트 (디버깅용)
 * GA 연결 상태 확인 및 디버깅 목적으로 사용
 * @param test_parameter - 테스트 파라미터 값
 * @param timestamp - 이벤트 발생 시간
 * @param user_agent - 사용자 브라우저 정보
 * @param user_id - 로그인한 사용자의 아이디 (자동 추가됨)
 */
export const trackTestEvent = (userId?: string) => {
  trackEvent('test_custom_event', {
    custom_user_id: userId || 'anonymous',
    test_parameter: 'test_value',
    user_agent: navigator.userAgent,
  });
};
