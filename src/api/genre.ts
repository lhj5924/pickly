// ============================================================
// 📁 src/api/genre.ts
// Genre API 함수
// ============================================================

import { apiClient } from './client';
import type { GenreInfo } from '../types/genre';

/** 전체 장르 목록 조회 */
export const getGenres = async (): Promise<GenreInfo[]> => {
  const { data } = await apiClient.get<GenreInfo[]>('/api/v1/genres');
  return data;
};
