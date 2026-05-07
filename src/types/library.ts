// ============================================================
// Library 관련 타입 (스웨거 스키마 기준)
// ============================================================

import type { BookSource, BookStatus, BookSummary } from './book';

/** 라이브러리 항목 (GET /api/v1/libraries) */
export interface LibraryItem {
  uuid: string;
  book: BookSummary;
  status: BookStatus;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface AddLibraryRequest {
  externalId: string;
  source: BookSource;
  status: BookStatus;
}

export interface UpdateLibraryStatusRequest {
  status: BookStatus;
}
