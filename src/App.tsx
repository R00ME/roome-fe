import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// components
import Router from './routes/Router';
import { Toast } from '@components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// utils
import { initGA, trackEvent, trackTestEvent } from '@utils/ga';
import PageTracker from './components/PageTracker';
import { useUserStore } from './store/useUserStore';

function App() {
  const { user } = useUserStore();

  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      if (user?.userId) {
        localStorage.setItem('userId', user.userId.toString());
      }

      initGA(measurementId, user?.userId?.toString());
      console.log(
        'Google Analytics 초기화 완료:',
        measurementId,
        'User ID:',
        user?.userId,
      );

      // 세션 시작 추적
      trackEvent('session_start', {
        custom_user_id: user?.userId?.toString() || 'anonymous',
        event_category: 'user_engagement',
      });

      // 테스트 이벤트 (배포 환경에서도 실행)
      setTimeout(() => {
        trackTestEvent(user?.userId?.toString());
      }, 5000);

      // 유입 경로 추적 (세션 최초 referrer 우선, 세션당 1회)
      const savedFirstReferrer = sessionStorage.getItem('first_referrer');
      const referrer = savedFirstReferrer || document.referrer || 'direct';
      const alreadySent = sessionStorage.getItem('first_referrer_sent') === '1';

      if (!alreadySent) {
        trackEvent('traffic_source', {
          custom_user_id: user?.userId?.toString() || 'anonymous',
          event_category: 'acquisition',
          source: referrer,
          medium: referrer.includes('google')
            ? 'search'
            : referrer.includes('instagram')
            ? 'social'
            : referrer !== 'direct'
            ? 'referral'
            : 'direct',
        });
        sessionStorage.setItem('first_referrer_sent', '1');
      }

      // 세션 종료 추적
      const startTime = Date.now();
      const handleBeforeUnload = () => {
        const duration = ~~((Date.now() - startTime) / 1000);
        trackEvent('session_duration', {
          custom_user_id: user?.userId?.toString() || 'anonymous',
          event_category: 'engagement',
          session_duration_sec: duration,
          pages_visited: window.history.length,
          last_visit: new Date().toISOString(),
        });
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    } else {
      console.warn('GA_MEASUREMENT_ID가 설정되지 않았습니다.');
    }
  }, [user?.userId]);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toast />
        <PageTracker />
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
