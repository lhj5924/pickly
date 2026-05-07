import { apiClient } from './client';
import type { MyStatsResponse, UserStatsSummaryResponse, GenreStatsResponse, MonthlyStatsResponse } from '../types/stats';

export const getMyStatsSummary = async (userUuid: string): Promise<UserStatsSummaryResponse> => {
  const { data } = await apiClient.get<UserStatsSummaryResponse>('/api/v1/stats/me/summary', {
    params: { userUuid },
  });
  return data;
};

export const getMyStats = async (userUuid: string): Promise<MyStatsResponse> => {
  const { data } = await apiClient.get<MyStatsResponse>('/api/v1/stats/me', {
    params: { userUuid },
  });
  return data;
};

export const getMyMonthlyStats = async (userUuid: string, year?: number): Promise<MonthlyStatsResponse[]> => {
  const { data } = await apiClient.get<MonthlyStatsResponse[]>('/api/v1/stats/me/monthly', {
    params: { userUuid, ...(year !== undefined && { year }) },
  });
  return data;
};

export const getMyGenreStats = async (userUuid: string): Promise<GenreStatsResponse[]> => {
  const { data } = await apiClient.get<GenreStatsResponse[]>('/api/v1/stats/me/genres', {
    params: { userUuid },
  });
  return data;
};
