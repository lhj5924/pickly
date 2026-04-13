// ============================================================
// 📁 src/api/useReview.ts
// Review 관련 React Query 훅
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createReview,
  deleteReview,
  getAvailableBooksForReview,
  getBookReviews,
  getMyReviews,
  updateReview,
} from './review';
import { reviewKeys } from './queryKeys';
import { useAuthStore } from '../stores';
import type { LibraryItem } from '../types/library';
import type {
  CreateReviewRequest,
  PageableRequest,
  Review,
  ReviewPage,
  UpdateReviewRequest,
} from '../types/review';

/** 특정 책의 리뷰 목록 */
export const useBookReviews = (bookUuid: string | undefined, pageable: PageableRequest) => {
  return useQuery<ReviewPage, Error>({
    queryKey: reviewKeys.byBook(bookUuid ?? '', pageable),
    queryFn: () => getBookReviews(bookUuid!, pageable),
    enabled: !!bookUuid,
    staleTime: 1000 * 60,
  });
};

/** 내 리뷰 목록 */
export const useMyReviews = () => {
  const userUuid = useAuthStore(state => state.user?.id);

  return useQuery<Review[], Error>({
    queryKey: reviewKeys.me(userUuid),
    queryFn: () => getMyReviews(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60,
  });
};

/** 리뷰 작성 가능한 책 목록 */
export const useReviewAvailableBooks = () => {
  const userUuid = useAuthStore(state => state.user?.id);

  return useQuery<LibraryItem[], Error>({
    queryKey: reviewKeys.available(userUuid),
    queryFn: () => getAvailableBooksForReview(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60,
  });
};

/** 리뷰 작성 */
export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<Review, Error, CreateReviewRequest>({
    mutationFn: (body) => {
      if (!userUuid) throw new Error('No authenticated user');
      return createReview(userUuid, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};

/** 리뷰 수정 */
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<Review, Error, { uuid: string; body: UpdateReviewRequest }>({
    mutationFn: ({ uuid, body }) => {
      if (!userUuid) throw new Error('No authenticated user');
      return updateReview(userUuid, uuid, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};

/** 리뷰 삭제 */
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<void, Error, string>({
    mutationFn: (uuid) => {
      if (!userUuid) throw new Error('No authenticated user');
      return deleteReview(userUuid, uuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
};
