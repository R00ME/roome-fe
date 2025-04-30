import { BrowserRouter } from 'react-router-dom';
import Router from './routes/Router';
import { Toast } from '@components/Toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { enableMockAPIs } from './mocks/mockApis';

// 개발 환경에서만 모킹 API 활성화
if (process.env.NODE_ENV === 'development') {
  enableMockAPIs();
}

function App() {
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
