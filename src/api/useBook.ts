// ============================================================
// 📁 src/api/useBook.ts
// Book 관련 React Query 훅
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { getBook, searchBooks } from './book';
import { bookKeys } from './queryKeys';
import type { Book, BookSearchParams, BookSearchResponse } from '../types/book';

/** 책 상세 조회 */
export const useBook = (uuid: string | undefined) => {
  return useQuery<Book, Error>({
    queryKey: bookKeys.detail(uuid ?? ''),
    queryFn: () => getBook(uuid!),
    enabled: !!uuid,
    staleTime: 1000 * 60 * 5,
  });
};

/** 책 검색 */
export const useBookSearch = (params: BookSearchParams, enabled = true) => {
  return useQuery<BookSearchResponse, Error>({
    queryKey: bookKeys.search(params.query, params.target, params.page, params.size),
    queryFn: () => searchBooks(params),
    enabled: enabled && !!params.query,
    staleTime: 1000 * 60 * 2,
  });
};
