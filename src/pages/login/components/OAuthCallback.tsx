import React, { useEffect } from 'react'
import Loading from '../../../components/Loading'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { getToken } from '../../../apis/auth';

export default function OAuthCallback() {
  console.log('[OAuthCallback] 렌더링됨');
  const location = useLocation();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore(state => state.setAccessToken);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    console.log(`추출: ${queryParams}`);
    const tempCode = queryParams.get('temp_code');

    if(!tempCode){
      console.error('tempCode가 없습니다.');
      navigate('/login');
      return;
    }

    (async () => {
      try{
        const token = await getToken(tempCode);
        setAccessToken(token);
        navigate('/');
      } catch (error){
        console.error('엑세스 토큰 처리 실패:', error);
        navigate('/login');
      }
    })();
  },[location, setAccessToken, navigate]);


  return (
    <div>
      <Loading />
    </div>
  )
}
