// ============================================================
// src/mocks/mockRecommendPage.ts
// Dev-only: /recommend 페이지 섹션별 mock
// ============================================================

import type { BookSummary } from '@/types/book';
import { mockBooks } from './mockBooks';
import { mockRecommendations } from './mockRecommendations';

export interface HiddenMockBook extends BookSummary {
  quote: string;
}

const HIDDEN_QUOTES = [
  '어린왕자가 네 번째 별에서 만났던 별을 세는 사업가를 기억하시나요?',
  '문장과 문장 사이, 당신이 잠시 숨을 고르는 그 순간에도 세계는 조금씩 움직이고 있어요.',
  '읽고 싶은 책보다 읽어야 할 책이 많아질 때, 우리는 취향을 잃어버리곤 합니다.',
  '가장 조용한 페이지 속에서 가장 큰 목소리를 들을 수 있을지도 몰라요.',
];

export const mockSimilarBooks: BookSummary[] = mockBooks.slice(13, 19);
export const mockGenreBooks: BookSummary[] = mockBooks.slice(19, 25);
export const mockPopularBooks: BookSummary[] = mockBooks.slice(25, 31);
export const mockAiRecommendBooks: BookSummary[] = mockRecommendations;

export const mockHiddenBooks: HiddenMockBook[] = mockBooks.slice(31, 35).map((book, i) => ({
  ...book,
  quote: HIDDEN_QUOTES[i % HIDDEN_QUOTES.length],
}));
