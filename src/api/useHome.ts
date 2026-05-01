import { useQuery } from '@tanstack/react-query';
import { getHome } from './home';
import { homeKeys } from './queryKeys';
import type { HomeResponse } from '../types/home';

export const useHome = (userUuid: string | undefined) => {
  return useQuery<HomeResponse, Error>({
    queryKey: homeKeys.data(userUuid),
    queryFn: () => getHome(userUuid!),
    enabled: !!userUuid,
    staleTime: 1000 * 60 * 2,
  });
};
