// ============================================================
// 📁 src/api/auth.ts
// Auth API 함수
// ============================================================

import { apiClient } from './client';
import type { LoginRequest, LoginResponse, RefreshRequest, TokenResponse } from '../types/api';

const REDIRECT_URI: Record<'kakao' | 'google', string> = {
  kakao: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!,
  google: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
};

/** OAuth 로그인 (provider: 'kakao' | 'google') */
export const login = async (provider: 'kakao' | 'google', body: Omit<LoginRequest, 'redirectUri'>): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(`/api/v1/auth/login/${provider}`, {
    ...body,
    redirectUri: REDIRECT_URI[provider],
  });
  return data;
};

/** Access/Refresh 토큰 재발급 */
export const refreshToken = async (body: RefreshRequest): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>('/api/v1/auth/refresh', body);
  return data;
};

/** 로그아웃 (Refresh Token 무효화) */
export const logout = async (userUuid: string): Promise<void> => {
  await apiClient.post('/api/v1/auth/logout', null, { params: { userUuid } });
};
