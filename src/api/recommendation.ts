import { apiClient } from './client';
import type { RecommendedBookResponse, PopularBookResponse } from '../types/recommendation';

export const getRecommendations = async (userUuid: string, limit = 10): Promise<RecommendedBookResponse[]> => {
  const { data } = await apiClient.get<RecommendedBookResponse[]>('/api/v1/recommendations', {
    params: { userUuid, limit },
  });
  return data;
};

export const getTodayRecommendations = async (userUuid: string, limit = 5): Promise<RecommendedBookResponse[]> => {
  const { data } = await apiClient.get<RecommendedBookResponse[]>('/api/v1/recommendations/today', {
    params: { userUuid, limit },
  });
  return data;
};

export const getSimilarBooks = async (bookUuid: string, limit = 10): Promise<RecommendedBookResponse[]> => {
  const { data } = await apiClient.get<RecommendedBookResponse[]>(`/api/v1/recommendations/similar/${bookUuid}`, {
    params: { limit },
  });
  return data;
};

export const getPopularBooks = async (limit = 10): Promise<PopularBookResponse[]> => {
  const { data } = await apiClient.get<PopularBookResponse[]>('/api/v1/recommendations/popular', {
    params: { limit },
  });
  return data;
};

export const getPopularBooksForMe = async (userUuid: string, limit = 10): Promise<PopularBookResponse[]> => {
  const { data } = await apiClient.get<PopularBookResponse[]>('/api/v1/recommendations/popular/for-me', {
    params: { userUuid, limit },
  });
  return data;
};
