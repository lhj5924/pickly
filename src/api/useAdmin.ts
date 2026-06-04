// ============================================================
// 📁 src/api/useAdmin.ts
// Admin React Query 훅
// ============================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBookGenres } from './admin';
import { bookKeys } from './queryKeys';
import type { UpdateBookGenresRequest } from '../types/genre';
import type { Book } from '../types/book';

interface UpdateBookGenresVariables {
  bookUuid: string;
  body: UpdateBookGenresRequest;
}

/** [관리자] 책 장르 수정 */
export const useUpdateBookGenres = () => {
  const queryClient = useQueryClient();

  return useMutation<Book, Error, UpdateBookGenresVariables>({
    mutationFn: ({ bookUuid, body }) => updateBookGenres(bookUuid, body),
    onSuccess: (_, { bookUuid }) => {
      queryClient.invalidateQueries({ queryKey: bookKeys.detail(bookUuid) });
    },
  });
};
