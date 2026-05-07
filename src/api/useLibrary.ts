import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToLibrary,
  getMyLibraries,
  removeFromLibrary,
  updateLibraryStatus,
} from './library';
import { getBook } from './book';
import { homeKeys, libraryKeys } from './queryKeys';
import { useAuthStore } from '../stores';
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
    queryFn: () => getMyLibraries(userUuid!, status),
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
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
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
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
    },
  });
};

/** book.uuid만 있는 경우 (추천 도서 등) — 책 상세 조회로 externalId+source 확보 후 라이브러리 추가 */
export const useAddToLibraryByBookUuid = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<LibraryItem, Error, { bookUuid: string; status: BookStatus }>({
    mutationFn: async ({ bookUuid, status }) => {
      if (!userUuid) throw new Error('No authenticated user');
      const book = await getBook(bookUuid);
      return addToLibrary(userUuid, { externalId: book.externalId, source: book.source, status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: libraryKeys.all });
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
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
      queryClient.invalidateQueries({ queryKey: homeKeys.all });
    },
  });
};
