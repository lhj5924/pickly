import { apiClient } from './client';
import type { HomeResponse } from '../types/home';

export const getHome = async (userUuid: string): Promise<HomeResponse> => {
  const { data } = await apiClient.get<HomeResponse>('/api/v1/home', {
    params: { userUuid },
  });
  return data;
};
