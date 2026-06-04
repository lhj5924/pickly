import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToLibrary,
  getMyLibraries,
  removeFromLibrary,
  updateLibraryStatus,
} from './library';
import { getExternalBook } from './book';
import { homeKeys, libraryKeys } from './queryKeys';
import { useAuthStore } from '../stores';
import type { BookSource, BookStatus } from '../types/book';
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

/** 외부 책을 2단계로 라이브러리에 추가:
 *  1단계) GET /api/v1/books/external?source=KAKAO → 기본 정보 저장 + Google 장르 보강(백엔드)
 *  2단계) POST /api/v1/libraries with bookUuid
 */
export const useAddExternalToLibrary = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<LibraryItem, Error, { externalId: string; source: BookSource; status: BookStatus }>({
    mutationFn: async ({ externalId, source, status }) => {
      if (!userUuid) throw new Error('No authenticated user');
      const book = await getExternalBook(externalId, source);
      return addToLibrary(userUuid, { bookUuid: book.uuid, status });
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
