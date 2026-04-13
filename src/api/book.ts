// ============================================================
// 📁 src/api/book.ts
// Book API 함수
// ============================================================

import { apiClient } from './client';
import type { Book, BookSearchParams, BookSearchResponse } from '../types/book';

/** 책 상세 조회 */
export const getBook = async (uuid: string): Promise<Book> => {
  const { data } = await apiClient.get<Book>(`/api/v1/books/${uuid}`);
  return data;
};

/** 책 검색 (카카오/구글 책 API) */
export const searchBooks = async (params: BookSearchParams): Promise<BookSearchResponse> => {
  const { data } = await apiClient.get<BookSearchResponse>('/api/v1/books/search', {
    params: {
      query: params.query,
      target: params.target,
      page: params.page ?? 0,
      size: params.size ?? 10,
    },
  });
  return data;
};
