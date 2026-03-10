// ============================================================
// 📁 src/api/user.ts
// User API 함수
// ============================================================

import { apiClient } from './client';
import type { UserResponse, UpdateUserRequest } from '../types/api';

/** 내 정보 조회 */
export const getMe = async (): Promise<UserResponse> => {
  const { data } = await apiClient.get<UserResponse>('/api/v1/users/me');
  return data;
};

/** 내 정보 수정 */
export const updateMe = async (body: UpdateUserRequest): Promise<UserResponse> => {
  const { data } = await apiClient.patch<UserResponse>('/api/v1/users/me', body);
  return data;
};

/** 회원 탈퇴 */
export const deleteMe = async (): Promise<void> => {
  await apiClient.delete('/api/v1/users/me');
};
