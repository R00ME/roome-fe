import { webSocketService } from '@/apis/websocket';
import { useUserStore } from '@/store/useUserStore';
import { useAuthStore } from '../store/useAuthStore';
import axiosInstance from './axiosInstance';

// const cookies = new Cookies();
const API_URL = 'api';

export const getToken = async (tempCode: string): Promise<string> => {
  try {
    const response = await axiosInstance.post(`/${API_URL}/auth/token/temp`, {
      tempCode: tempCode,
    });

    const accessToken =
      response.headers['authorization'] || response.headers['Authorization'];

    if (!accessToken) {
      throw new Error('🚨 엑세스 토큰을 헤더에서 찾을 수 없습니다');
    }

    const token = accessToken.split(' ')[1];
    return token;
  } catch (error) {
    console.error('토큰 요청 실패:', error);
    throw error;
  }
};

export const fetchUserInfo = async (accessToken: string) => {
  try {
    const res = await axiosInstance.get(`/${API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = res.data.user;
    console.log('✅ 유저 정보:', user);

    useUserStore.getState().setUser(user);
    webSocketService.handleLogin();

    return user;
  } catch (error) {
    console.error('🚨 사용자 정보 요청 실패:', error?.response?.data);
    throw error;
  }
};

export const refreshAccessTokenAPI = async () => {
  try {
    const response = await axiosInstance.post(`/${API_URL}/auth/token/refresh`);

    const accessToken =
      response.headers['authorization'] || response.headers['Authorization'];

    if (!accessToken) {
      throw new Error('🚨 재발급된 Access Token이 응답 헤더에 없습니다.');
    }

    const token = accessToken.split(' ')[1];

    useAuthStore.getState().setAccessToken(token);

    return token;
  } catch (error) {
    console.error('🚨 Access Token 재발급 실패:', error);
    throw error;
  }
};

export const logoutAPI = async () => {
  try {
    await axiosInstance.post(`/${API_URL}/auth/logout`);

    useAuthStore.getState().clearAccessToken?.();
    useUserStore.getState().clearUser?.();
    webSocketService.disconnect?.(true);

    window.location.href = '/login';
  } catch (error) {
    console.error('🚨 로그아웃 실패:', error);
    throw error;
  }
};

export const initStatus = () => {
  if (webSocketService.isConnected()) {
    webSocketService.disconnect(true);
  }

  useAuthStore.getState().clearAccessToken?.();
  useUserStore.getState().clearUser?.();

  localStorage.removeItem('user-storage');
};
