// ============================================================
// src/mocks/mockReviews.ts
// Dev-only mock reviews. 2-col grid × 2.5 ≈ 5 cards.
// ============================================================

import type { Review } from '@/types/review';
import { mockBooks } from './mockBooks';
import { MOCK_USER_UUID, mockUser } from './mockUser';

const REVIEW_BOOKS = mockBooks.slice(0, 5);

const REVIEW_CONTENTS = [
  '쉽게 쓰인 단편들이 오히려 더 진하게 마음에 남았다. 오래 두고 여러 번 꺼내 읽고 싶은 책.',
  '마지막 장을 덮은 순간, 한동안 멍하게 앉아 있었다. 삶과 죽음을 이렇게 담담하게 그려낼 수 있다니.',
  '박민규 특유의 문체가 살아있다. 슬픈데도 우습고, 우스운데도 서늘한 감정이 계속 교차한다.',
  '관계와 감정을 섬세하게 해부하는 샐리 루니의 장기가 돋보이는 작품. 번역도 안정적이었다.',
  '천선란의 세계는 늘 다정하다. 어디에도 속하지 못한 사람들을 위한 따뜻한 위로 같았다.',
];

const daysAgo = (d: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

export const getMockReviewByUuid = (uuid: string): Review | undefined =>
  mockReviews.find(r => r.uuid === uuid);

export const mockReviews: Review[] = REVIEW_BOOKS.map((book, i) => ({
  uuid: `mock-review-${String(i + 1).padStart(3, '0')}`,
  book,
  user: {
    uuid: MOCK_USER_UUID,
    nickname: mockUser.nickname,
    profileImageUrl: mockUser.profileImage ?? '',
  },
  rating: [5, 4, 5, 4, 5][i],
  content: REVIEW_CONTENTS[i],
  startDate: daysAgo(30 + i * 10).slice(0, 10),
  endDate: daysAgo(15 + i * 10).slice(0, 10),
  createdAt: daysAgo(14 + i * 10),
  updatedAt: daysAgo(14 + i * 10),
}));
