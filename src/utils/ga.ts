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
      send_page_view: true
    });
  `;
  document.head.appendChild(script2);
};

// 커스텀 이벤트 전송
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {},
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
    console.log('GA Event tracked:', eventName, parameters);
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
    user_id: userId,
    duration_ms: durationMs,
    session_id: Date.now().toString(),
  });
};
