// ============================================================
// Book 관련 타입 (스웨거 스키마 기준)
// ============================================================

import type { GenreInfo } from './genre';

export type BookSource = 'KAKAO' | 'GOOGLE';

/** 라이브러리 읽기 상태 (스웨거 LibraryStatus) */
export type BookStatus = 'WANT_TO_READ' | 'READING' | 'COMPLETED' | 'DROPPED';

/** 책 상세 (GET /api/v1/books/{uuid}) */
export interface Book {
  uuid: string;
  externalId: string;
  source: BookSource;
  isbn10: string;
  isbn13: string;
  title: string;
  subtitle: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  pageCount: number;
  thumbnailUrl: string;
  language: string;
  genres: GenreInfo[];
  averageRating: number;
  reviewCount: number;
}

/** 책 요약 (검색/라이브러리/리뷰 응답에 포함) */
export interface BookSummary {
  uuid: string;
  externalId: string;
  isbn: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  publishedDate: string;
  publisher: string;
  source: BookSource;
}

export interface BookSearchResponse {
  books: BookSummary[];
  totalItems: number;
  currentPage: number;
  hasNext: boolean;
}

export interface BookSearchParams {
  query: string;
  target?: 'title' | 'author';
  page?: number;
  size?: number;
}

// --- UI용 통계/차트 데이터 (API 외 로컬 모델) ---
export interface ReadingStats {
  totalBooks: number;
  averageReadingDays: number;
  monthlyAverage: number;
}

export interface MonthlyReading {
  month: string;
  count: number;
  label: string;
}

export interface GenreStats {
  genre: string;
  percentage: number;
  color: string;
}

export interface CalendarItem {
  date: string;
  books: BookSummary[];
}

