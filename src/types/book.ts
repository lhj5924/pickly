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

// ============================================================
// LEGACY 타입 (Stage 2 페이지 마이그레이션 전까지 임시 유지)
// mockData / bookStore / BookCard / 기존 페이지가 참조
// ============================================================

/** @deprecated Stage 2에서 GenreInfo로 교체 예정 */
export interface LegacyCategory {
  id: number;
  name: string;
}

/** @deprecated Stage 2에서 BookStatus(대문자)로 교체 예정 */
export type LegacyBookStatus = 'reading' | 'wishlist' | 'completed' | null;

/** @deprecated Stage 2에서 Book(스웨거)으로 교체 예정 */
export interface LegacyBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  coverImage: string;
  description: string;
  pageCount: number;
  categories: LegacyCategory[];
  status?: LegacyBookStatus;
  startDate?: string;
  endDate?: string;
  progress?: number;
}

/** @deprecated Stage 2에서 Review(스웨거)로 교체 예정 */
export interface LegacyReview {
  id: string;
  bookId: string;
  book: LegacyBook;
  content: string;
  rating: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

/** @deprecated Stage 2에서 GenreInfo 배열로 교체 예정 */
export const BOOK_CATEGORIES: LegacyCategory[] = [
  { id: 1, name: '소설' },
  { id: 2, name: '로맨스' },
  { id: 3, name: '판타지' },
  { id: 4, name: 'SF' },
  { id: 5, name: '미스터리/스릴러' },
  { id: 6, name: '호러' },
  { id: 7, name: '역사소설' },
  { id: 8, name: '시/에세이' },
  { id: 9, name: '자기계발' },
  { id: 10, name: '경제/경영' },
  { id: 11, name: '인문학' },
  { id: 12, name: '과학' },
  { id: 13, name: '역사' },
  { id: 14, name: '사회' },
  { id: 15, name: '예술' },
  { id: 16, name: '여행' },
  { id: 17, name: '요리' },
  { id: 18, name: '건강' },
  { id: 19, name: '종교/영성' },
  { id: 20, name: '만화/웹툰' },
  { id: 21, name: '라이트노벨' },
  { id: 22, name: '아동/청소년' },
];

/** @deprecated 하위호환 — 신규 코드는 `LegacyBook` 또는 (Stage 2 이후) `Book`/`BookSummary`를 직접 사용 */
export type Category = LegacyCategory;
