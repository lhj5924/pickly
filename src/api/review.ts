// ============================================================
// 📁 src/api/review.ts
// Review API 함수
// ============================================================

import { apiClient } from './client';
import type {
  Review,
  ReviewPage,
  CreateReviewRequest,
  UpdateReviewRequest,
  PageableRequest,
} from '../types/review';
import type { LibraryItem } from '../types/library';

/** 특정 책의 리뷰 목록 (페이지네이션) */
export const getBookReviews = async (
  bookUuid: string,
  pageable: PageableRequest,
): Promise<ReviewPage> => {
  const { data } = await apiClient.get<ReviewPage>(`/api/v1/books/${bookUuid}/reviews`, {
    params: {
      page: pageable.page ?? 0,
      size: pageable.size ?? 10,
      sort: pageable.sort,
    },
  });
  return data;
};

/** 내 리뷰 목록 */
export const getMyReviews = async (userUuid: string): Promise<Review[]> => {
  const { data } = await apiClient.get<Review[]>('/api/v1/reviews/me', {
    params: { userUuid },
  });
  return data;
};

/** 리뷰 작성 가능한 책(완독한 라이브러리 항목) 목록 */
export const getAvailableBooksForReview = async (userUuid: string): Promise<LibraryItem[]> => {
  const { data } = await apiClient.get<LibraryItem[]>('/api/v1/reviews/available-books', {
    params: { userUuid },
  });
  return data;
};

/** 리뷰 작성 */
export const createReview = async (userUuid: string, body: CreateReviewRequest): Promise<Review> => {
  const { data } = await apiClient.post<Review>('/api/v1/reviews', body, {
    params: { userUuid },
  });
  return data;
};

/** 리뷰 수정 */
export const updateReview = async (
  userUuid: string,
  uuid: string,
  body: UpdateReviewRequest,
): Promise<Review> => {
  const { data } = await apiClient.patch<Review>(`/api/v1/reviews/${uuid}`, body, {
    params: { userUuid },
  });
  return data;
};

/** 리뷰 삭제 */
export const deleteReview = async (userUuid: string, uuid: string): Promise<void> => {
  await apiClient.delete(`/api/v1/reviews/${uuid}`, {
    params: { userUuid },
  });
};
