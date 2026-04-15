// ============================================================
// src/mocks/index.ts
// Dev-only mock entrypoint.
// Enable by setting NEXT_PUBLIC_USE_MOCK=true in .env.local.
// ============================================================

export const MOCK_MODE = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export { mockBooks, getMockBookByUuid } from './mockBooks';
export { mockUser, mockUserResponse, MOCK_USER_UUID } from './mockUser';
export { mockLibraries, getMockLibraries } from './mockLibraries';
export { mockReviews, getMockReviewByUuid } from './mockReviews';
export { mockRecommendations } from './mockRecommendations';
export {
  mockSimilarBooks,
  mockGenreBooks,
  mockPopularBooks,
  mockAiRecommendBooks,
  mockHiddenBooks,
} from './mockRecommendPage';
export type { HiddenMockBook } from './mockRecommendPage';
