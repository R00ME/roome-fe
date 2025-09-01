import React, { useEffect } from 'react'
import Loading from '../../../components/Loading'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { fetchUserInfo, getToken } from '../../../apis/auth';

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const setAccessToken = useAuthStore(state => state.setAccessToken);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tempCode = queryParams.get('temp_code');
    const isNewUser = queryParams.get('is_new_user') === "true" ? true : false;

    if(!tempCode){
      console.error('tempCode가 없습니다.');
      navigate('/login');
      return;
    }

    (async () => {
      try{
        const accessToken = await getToken(tempCode);
        setAccessToken(accessToken);
        await fetchUserInfo(accessToken);
        if(isNewUser) {
          navigate('/login/info')
        } else{
          navigate('/');
        } 
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
