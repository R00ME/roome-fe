import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// components
import Router from './routes/Router';
import { Toast } from '@components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// utils
import { initGA, trackEvent } from '@utils/ga';
import PageTracker from './components/PageTracker';


function App() {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
      console.log('Google Analytics 초기화 완료:', measurementId);

      // 세션 시작 추적
      trackEvent('session_start', {
        event_category: 'user_engagement',
      })

      // 유입 경로 추적
      const referrer = document.referrer || 'direct';
      trackEvent('traffic_source', {
        event_category: 'acquisition',
        source: referrer,
        medium: referrer.includes('google')
          ? 'search'
          : referrer.includes('instagram')
          ? 'social'
          : referrer !== 'direct'
          ? 'referral'
          : 'direct',
      })

      // 세션 종료 추적
      const startTime = Date.now();
      const handleBeforeUnload = () => {
        const duration = ~~((Date.now() - startTime)/1000)
        trackEvent('session_duration', {
          event_category: 'engagement',
          session_duration_sec: duration,
          pages_visited: window.history.length,
          last_visit: new Date().toISOString(),
        })
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }
    } else {
      console.warn('GA_MEASUREMENT_ID가 설정되지 않았습니다.');
    }
  }, []);

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
