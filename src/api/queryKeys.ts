// ============================================================
// Query Key Factory
// 체계적인 쿼리 키 관리를 위한 팩토리 패턴
// ============================================================

import type { BookStatus } from '../types/book';
import type { PageableRequest } from '../types/review';

export const userKeys = {
  all: ['user'] as const,
  me: (userUuid: string | undefined) => [...userKeys.all, 'me', userUuid] as const,
} as const;

export const genreKeys = {
  all: ['genre'] as const,
  list: () => [...genreKeys.all, 'list'] as const,
} as const;

export const preferredGenreKeys = {
  all: ['preferredGenre'] as const,
  me: (userUuid: string | undefined) => [...preferredGenreKeys.all, 'me', userUuid] as const,
} as const;

export const bookKeys = {
  all: ['book'] as const,
  detail: (uuid: string) => [...bookKeys.all, 'detail', uuid] as const,
  search: (query: string, target?: string, page?: number, size?: number) =>
    [...bookKeys.all, 'search', query, target, page, size] as const,
} as const;

export const libraryKeys = {
  all: ['library'] as const,
  list: (userUuid: string | undefined, status?: BookStatus) =>
    [...libraryKeys.all, 'list', userUuid, status] as const,
} as const;

export const reviewKeys = {
  all: ['review'] as const,
  byBook: (bookUuid: string, pageable: PageableRequest) =>
    [...reviewKeys.all, 'byBook', bookUuid, pageable.page, pageable.size, pageable.sort] as const,
  me: (userUuid: string | undefined) => [...reviewKeys.all, 'me', userUuid] as const,
  available: (userUuid: string | undefined) => [...reviewKeys.all, 'available', userUuid] as const,
} as const;
