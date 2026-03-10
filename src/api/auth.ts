// ============================================================
// 📁 src/api/auth.ts
// Auth API 함수
// ============================================================

import { apiClient } from './client';
import type { LoginRequest, LoginResponse, RefreshRequest, TokenResponse } from '../types/api';

/** OAuth 로그인 (provider: 'kakao' | 'google') */
export const login = async (provider: 'kakao' | 'google', body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>(`/api/v1/auth/login/${provider}`, body);
  return data;
};

/** Access/Refresh 토큰 재발급 */
export const refreshToken = async (body: RefreshRequest): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>('/api/v1/auth/refresh', body);
  return data;
};
