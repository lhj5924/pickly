// ============================================================
// 📁 src/api/useMe.ts
// 내 정보 조회/수정/탈퇴 훅
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe, deleteMe } from './user';
import type { UpdateUserRequest, UserResponse } from '../types/api';
import { useAuthStore } from '../stores';
import { userKeys } from './queryKeys';
import { MOCK_MODE, mockUserResponse } from '../mocks';

/** 내 정보 조회 */
export const useMe = () => {
  const userUuid = useAuthStore(state => state.user?.id);

  return useQuery<UserResponse, Error>({
    queryKey: userKeys.me(userUuid),
    queryFn: () => {
      if (MOCK_MODE) return Promise.resolve(mockUserResponse);
      return getMe(userUuid!);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    enabled:
      MOCK_MODE ||
      (typeof window !== 'undefined' && !!userUuid && !!localStorage.getItem('accessToken')),
  });
};

/** 내 정보 수정 (Optimistic Update 적용) */
export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<UserResponse, Error, UpdateUserRequest, { previousUser: UserResponse | undefined }>({
    mutationFn: (body) => {
      if (!userUuid) throw new Error('No authenticated user');
      return updateMe(userUuid, body);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: userKeys.me(userUuid) });
      const previousUser = queryClient.getQueryData<UserResponse>(userKeys.me(userUuid));
      if (previousUser) {
        queryClient.setQueryData<UserResponse>(userKeys.me(userUuid), {
          ...previousUser,
          ...newData,
        });
      }
      return { previousUser };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.me(userUuid), context.previousUser);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.me(userUuid) });
    },
  });
};

/** 회원 탈퇴 */
export const useDeleteMe = () => {
  const queryClient = useQueryClient();
  const userUuid = useAuthStore(state => state.user?.id);

  return useMutation<void, Error, void>({
    mutationFn: () => {
      if (!userUuid) throw new Error('No authenticated user');
      return deleteMe(userUuid);
    },
    onSuccess: () => {
      queryClient.clear();
      localStorage.clear();
      window.location.href = '/login';
    },
  });
};
