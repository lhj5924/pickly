import { useQuery } from '@tanstack/react-query';
import {
  getRecommendations,
  getTodayRecommendations,
  getSimilarBooks,
  getPopularBooks,
  getPopularBooksForMe,
} from './recommendation';
import { recommendationKeys } from './queryKeys';
import { useAuthStore } from '../stores';
import type { RecommendedBookResponse, PopularBookResponse } from '../types/recommendation';

export const useRecommendations = (limit = 10) => {
  const userUuid = useAuthStore(state => state.user?.id);
  return useQuery<RecommendedBookResponse[], Error>({
    queryKey: recommendationKeys.list(userUuid, limit),
    queryFn: () => getRecommendations(userUuid!, limit),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 10,
  });
};

export const useTodayRecommendations = (limit = 5) => {
  const userUuid = useAuthStore(state => state.user?.id);
  return useQuery<RecommendedBookResponse[], Error>({
    queryKey: recommendationKeys.today(userUuid, limit),
    queryFn: () => getTodayRecommendations(userUuid!, limit),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 60,
  });
};

export const useSimilarBooks = (bookUuid: string | undefined, limit = 6) => {
  return useQuery<RecommendedBookResponse[], Error>({
    queryKey: recommendationKeys.similar(bookUuid ?? '', limit),
    queryFn: () => getSimilarBooks(bookUuid!, limit),
    enabled: !!bookUuid,
    staleTime: 1000 * 60 * 10,
  });
};

export const usePopularBooks = (limit = 10) => {
  return useQuery<PopularBookResponse[], Error>({
    queryKey: recommendationKeys.popular(limit),
    queryFn: () => getPopularBooks(limit),
    staleTime: 1000 * 60 * 30,
  });
};

export const usePopularBooksForMe = (limit = 6) => {
  const userUuid = useAuthStore(state => state.user?.id);
  return useQuery<PopularBookResponse[], Error>({
    queryKey: recommendationKeys.popularForMe(userUuid, limit),
    queryFn: () => getPopularBooksForMe(userUuid!, limit),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 10,
  });
};
