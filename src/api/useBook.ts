// ============================================================
// 📁 src/api/useBook.ts
// Book 관련 React Query 훅
// ============================================================

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
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

/** 책 검색 (무한 스크롤, 5개씩) */
export const useInfiniteBookSearch = (query: string) => {
  return useInfiniteQuery({
    queryKey: bookKeys.infiniteSearch(query),
    queryFn: ({ pageParam }: { pageParam: number }) =>
      searchBooks({ query, page: pageParam, size: 5 }),
    initialPageParam: 0,
    getNextPageParam: (lastPage: BookSearchResponse) =>
      lastPage.hasNext ? lastPage.currentPage + 1 : undefined,
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60 * 2,
  });
};
