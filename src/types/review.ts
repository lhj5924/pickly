// ============================================================
// Review 관련 타입 (스웨거 스키마 기준)
// ============================================================

import type { BookSummary } from './book';

export interface ReviewAuthor {
  uuid: string;
  nickname: string;
  profileImageUrl: string;
}

/** 리뷰 (GET /api/v1/books/{bookUuid}/reviews 등) */
export interface Review {
  uuid: string;
  book: BookSummary;
  user: ReviewAuthor;
  rating: number;
  content: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  libraryUuid: string;
  rating: number;
  content: string;
  startDate: string;
  endDate: string;
}

export interface UpdateReviewRequest {
  rating: number;
  content: string;
  startDate: string;
  endDate: string;
}

// --- Pageable (스웨거 Spring Pageable 응답) ---
export interface PageableRequest {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface SortInfo {
  sorted: boolean;
  empty: boolean;
  unsorted: boolean;
}

export interface PageableInfo {
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  offset: number;
  sort: SortInfo;
  unpaged: boolean;
}

export interface Page<T> {
  totalElements: number;
  totalPages: number;
  pageable: PageableInfo;
  first: boolean;
  size: number;
  content: T[];
  number: number;
  sort: SortInfo;
  numberOfElements: number;
  last: boolean;
  empty: boolean;
}

export type ReviewPage = Page<Review>;
