// ============================================================
// 📁 src/api/admin.ts
// Admin API 함수
// ============================================================

import { apiClient } from './client';
import type { UpdateBookGenresRequest } from '../types/genre';
import type { Book } from '../types/book';

/** [관리자] 책 장르 수정 */
export const updateBookGenres = async (
  bookUuid: string,
  body: UpdateBookGenresRequest,
): Promise<Book> => {
  const { data } = await apiClient.put<Book>(`/api/v1/admin/books/${bookUuid}/genres`, body);
  return data;
};
