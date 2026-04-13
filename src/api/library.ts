// ============================================================
// 📁 src/api/library.ts
// Library API 함수
// ============================================================

import { apiClient } from './client';
import type {
  LibraryItem,
  AddLibraryRequest,
  UpdateLibraryStatusRequest,
} from '../types/library';
import type { BookStatus } from '../types/book';

/** 내 라이브러리 조회 (상태별 필터링 가능) */
export const getMyLibraries = async (userUuid: string, status?: BookStatus): Promise<LibraryItem[]> => {
  const { data } = await apiClient.get<LibraryItem[]>('/api/v1/libraries', {
    params: { userUuid, status },
  });
  return data;
};

/** 라이브러리에 책 추가 */
export const addToLibrary = async (userUuid: string, body: AddLibraryRequest): Promise<LibraryItem> => {
  const { data } = await apiClient.post<LibraryItem>('/api/v1/libraries', body, {
    params: { userUuid },
  });
  return data;
};

/** 라이브러리에서 책 제거 */
export const removeFromLibrary = async (userUuid: string, uuid: string): Promise<void> => {
  await apiClient.delete(`/api/v1/libraries/${uuid}`, {
    params: { userUuid },
  });
};

/** 라이브러리 항목의 읽기 상태 변경 */
export const updateLibraryStatus = async (
  userUuid: string,
  uuid: string,
  body: UpdateLibraryStatusRequest,
): Promise<LibraryItem> => {
  const { data } = await apiClient.patch<LibraryItem>(`/api/v1/libraries/${uuid}/status`, body, {
    params: { userUuid },
  });
  return data;
};
