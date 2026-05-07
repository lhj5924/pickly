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

export const statsKeys = {
  all: ['stats'] as const,
  summary: (userUuid: string | undefined) => [...statsKeys.all, 'summary', userUuid] as const,
  full: (userUuid: string | undefined) => [...statsKeys.all, 'full', userUuid] as const,
  monthly: (userUuid: string | undefined, year?: number) => [...statsKeys.all, 'monthly', userUuid, year] as const,
  genres: (userUuid: string | undefined) => [...statsKeys.all, 'genres', userUuid] as const,
} as const;

export const recommendationKeys = {
  all: ['recommendation'] as const,
  list: (userUuid: string | undefined, limit: number) => [...recommendationKeys.all, 'list', userUuid, limit] as const,
  today: (userUuid: string | undefined, limit: number) => [...recommendationKeys.all, 'today', userUuid, limit] as const,
  similar: (bookUuid: string, limit: number) => [...recommendationKeys.all, 'similar', bookUuid, limit] as const,
  popular: (limit: number) => [...recommendationKeys.all, 'popular', limit] as const,
  popularForMe: (userUuid: string | undefined, limit: number) =>
    [...recommendationKeys.all, 'popularForMe', userUuid, limit] as const,
} as const;

export const homeKeys = {
  all: ['home'] as const,
  data: (userUuid: string | undefined) => [...homeKeys.all, 'data', userUuid] as const,
} as const;
