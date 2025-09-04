declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// GA 초기화
export const initGA = (measurementId: string) => {
  // 이미 로드되었는지 확인
  if (window.gtag) return;

  // gtag 스크립트 동적 로드
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}', {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      debug_mode: true
    });
  `;
  document.head.appendChild(script2);
};

// 커스텀 이벤트 전송
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {},
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

// 페이지뷰 추적
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle,
    });
    console.log('GA PageView tracked:', pagePath, pageTitle);
  }
};

// 기능 사용 시간 추적
export const trackFeatureUsage = (
  featureName: string,
  userId: string,
  durationMs: number,
) => {
  trackEvent('feature_usage', {
    feature_name: featureName,
    custom_user_id: userId,
    duration_ms: durationMs,
    tracking_session_id: Date.now().toString(),
  });
};

// 테스트용 이벤트 (디버깅용)
export const trackTestEvent = () => {
  trackEvent('test_custom_event', {
    test_parameter: 'test_value',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent,
  });
};
