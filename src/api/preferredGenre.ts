// ============================================================
// 📁 src/api/preferredGenre.ts
// Preferred Genre API 함수
// ============================================================

import { apiClient } from './client';
import type {
  PreferredGenresResponse,
  UpdatePreferredGenresRequest,
} from '../types/genre';

/** 내 선호 장르 조회 */
export const getPreferredGenres = async (userUuid: string): Promise<PreferredGenresResponse> => {
  const { data } = await apiClient.get<PreferredGenresResponse>('/api/v1/preferred-genres', {
    params: { userUuid },
  });
  return data;
};

/** 선호 장르 설정/수정 (전체 교체) */
export const updatePreferredGenres = async (
  userUuid: string,
  body: UpdatePreferredGenresRequest,
): Promise<PreferredGenresResponse> => {
  const { data } = await apiClient.put<PreferredGenresResponse>('/api/v1/preferred-genres', body, {
    params: { userUuid },
  });
  return data;
};
