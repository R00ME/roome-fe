import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// components
import Router from './routes/Router';
import { Toast } from '@components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// utils
import { initGA } from '@utils/ga';


function App() {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      initGA(measurementId);
      console.log('Google Analytics 초기화 완료:', measurementId);
    } else {
      console.warn('GA_MEASUREMENT_ID가 설정되지 않았습니다.');
    }
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toast />
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
