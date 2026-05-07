// ============================================================
// 📁 src/api/useBook.ts
// Book 관련 React Query 훅
// ============================================================

import { useQuery } from '@tanstack/react-query';
import { getBook, getExternalBook, searchBooks } from './book';
import { bookKeys } from './queryKeys';
import type { Book, BookSearchParams, BookSearchResponse, BookSource } from '../types/book';

/** 책 상세 조회 (DB) */
export const useBook = (uuid: string | undefined) => {
  return useQuery<Book, Error>({
    queryKey: bookKeys.detail(uuid ?? ''),
    queryFn: () => getBook(uuid!),
    enabled: !!uuid,
    staleTime: 1000 * 60 * 5,
  });
};

/** 책 상세 조회 (외부 API - uuid 없는 경우) */
export const useExternalBook = (externalId: string | undefined, source: string | undefined) => {
  return useQuery<Book, Error>({
    queryKey: bookKeys.external(externalId ?? '', source ?? ''),
    queryFn: () => getExternalBook(externalId!, source as BookSource),
    enabled: !!externalId && !!source,
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
