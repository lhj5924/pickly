// ============================================================
// src/mocks/mockRecommendations.ts
// Dev-only: AI 추천 mock (4 books)
// ============================================================

import type { BookSummary } from '@/types/book';
import { mockBooks } from './mockBooks';

export const mockRecommendations: BookSummary[] = mockBooks.slice(39, 43);
