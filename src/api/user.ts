// ============================================================
// 📁 src/api/user.ts
// User API 함수
// ============================================================

import { apiClient } from './client';
import type { UserResponse, UpdateUserRequest } from '../types/api';

/** 내 정보 조회 */
export const getMe = async (userUuid: string): Promise<UserResponse> => {
  const { data } = await apiClient.get<UserResponse>('/api/v1/users/me', {
    params: { userUuid },
  });
  return data;
};

/** 내 정보 수정 */
export const updateMe = async (userUuid: string, body: UpdateUserRequest): Promise<UserResponse> => {
  const { data } = await apiClient.patch<UserResponse>('/api/v1/users/me', body, {
    params: { userUuid },
  });
  return data;
};

/** 회원 탈퇴 */
export const deleteMe = async (userUuid: string): Promise<void> => {
  await apiClient.delete('/api/v1/users/me', {
    params: { userUuid },
  });
};
