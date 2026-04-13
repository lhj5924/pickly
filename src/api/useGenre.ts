// ============================================================
// 📁 src/api/useGenre.ts
// Genre / PreferredGenre React Query 훅
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getGenres } from './genre';
import { getPreferredGenres, updatePreferredGenres } from './preferredGenre';
import { genreKeys, preferredGenreKeys } from './queryKeys';
import { useAuthStore } from '../stores';
import type { GenreInfo, PreferredGenresResponse, UpdatePreferredGenresRequest } from '../types/genre';

/** 전체 장르 목록 */
export const useGenres = () => {
  return useQuery<GenreInfo[], Error>({
    queryKey: genreKeys.list(),
    queryFn: getGenres,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

/** 내 선호 장르 */
export const useMyPreferredGenres = () => {
  const userUuid = useAuthStore(state => state.user?.id);

  return useQuery<PreferredGenresResponse, Error>({
    queryKey: preferredGenreKeys.me(userUuid),
    queryFn: () => getPreferredGenres(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 5,
  });
};

/** 선호 장르 설정/수정 */
export const useUpdatePreferredGenres = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<PreferredGenresResponse, Error, UpdatePreferredGenresRequest>({
    mutationFn: (body) => {
      if (!userUuid) throw new Error('No authenticated user');
      return updatePreferredGenres(userUuid, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: preferredGenreKeys.all });
    },
  });
};
