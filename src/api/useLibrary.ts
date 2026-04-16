// ============================================================
// 📁 src/api/useLibrary.ts
// Library 관련 React Query 훅
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToLibrary,
  getMyLibraries,
  removeFromLibrary,
  updateLibraryStatus,
} from './library';
import { libraryKeys } from './queryKeys';
import { useAuthStore } from '../stores';
import { MOCK_MODE, getMockLibraries } from '../mocks';
import type { BookStatus } from '../types/book';
import type {
  AddLibraryRequest,
  LibraryItem,
  UpdateLibraryStatusRequest,
} from '../types/library';

/** 내 라이브러리 조회 */
export const useMyLibraries = (status?: BookStatus) => {
  const userUuid = useAuthStore(state => state.user?.id);

  return useQuery<LibraryItem[], Error>({
    queryKey: libraryKeys.list(userUuid, status),
    queryFn: () => {
      if (MOCK_MODE) return Promise.resolve(getMockLibraries(status));
      return getMyLibraries(userUuid!, status);
    },
    enabled: !!userUuid,
    staleTime: 1000 * 60,
  });
};

/** 라이브러리에 책 추가 */
export const useAddToLibrary = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<LibraryItem, Error, AddLibraryRequest>({
    mutationFn: (body) => {
      if (!userUuid) throw new Error('No authenticated user');
      return addToLibrary(userUuid, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
};

/** 라이브러리에서 책 제거 */
export const useRemoveFromLibrary = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<void, Error, string>({
    mutationFn: (uuid) => {
      if (!userUuid) throw new Error('No authenticated user');
      return removeFromLibrary(userUuid, uuid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
};

/** 라이브러리 항목 읽기 상태 변경 */
export const useUpdateLibraryStatus = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<LibraryItem, Error, { uuid: string; body: UpdateLibraryStatusRequest }>({
    mutationFn: ({ uuid, body }) => {
      if (!userUuid) throw new Error('No authenticated user');
      return updateLibraryStatus(userUuid, uuid, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
    },
  });
};
