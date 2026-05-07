import { useQuery } from '@tanstack/react-query';
import { getMyStats, getMyGenreStats, getMyStatsSummary } from './stats';
import { statsKeys } from './queryKeys';
import { useAuthStore } from '../stores';
import type { MyStatsResponse, UserStatsSummaryResponse, GenreStatsResponse } from '../types/stats';

export const useMyStatsSummary = () => {
  const userUuid = useAuthStore(state => state.user?.id);
  return useQuery<UserStatsSummaryResponse, Error>({
    queryKey: statsKeys.summary(userUuid),
    queryFn: () => getMyStatsSummary(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyStats = () => {
  const userUuid = useAuthStore(state => state.user?.id);
  return useQuery<MyStatsResponse, Error>({
    queryKey: statsKeys.full(userUuid),
    queryFn: () => getMyStats(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyGenreStats = () => {
  const userUuid = useAuthStore(state => state.user?.id);
  return useQuery<GenreStatsResponse[], Error>({
    queryKey: statsKeys.genres(userUuid),
    queryFn: () => getMyGenreStats(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 5,
  });
};
