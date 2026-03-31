// ============================================================
// 📁 src/api/useMe.ts
// 내 정보 조회/수정/탈퇴 훅 (React Query 최적화 적용)
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe, deleteMe } from '../api/user';
import type { UpdateUserRequest, UserResponse } from '../types/api';
import { userKeys } from './queryKeys';

/** @deprecated USER_QUERY_KEY 대신 userKeys.me() 사용 권장 */
export const USER_QUERY_KEY = userKeys.me();

/** 내 정보 조회 */
export const useMe = () => {
  return useQuery<UserResponse, Error>({
    queryKey: userKeys.me(),
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5분 캐시
    gcTime: 1000 * 60 * 30,   // 30분 GC (사용자 정보는 오래 유지)
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });
};

/** 내 정보 수정 (Optimistic Update 적용) */
export const useUpdateMe = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, UpdateUserRequest, { previousUser: UserResponse | undefined }>({
    mutationFn: updateMe,
    onMutate: async (newData) => {
      // 진행중인 refetch 취소 (optimistic update 덮어쓰기 방지)
      await queryClient.cancelQueries({ queryKey: userKeys.me() });

      // 이전 데이터 스냅샷 저장
      const previousUser = queryClient.getQueryData<UserResponse>(userKeys.me());

      // 낙관적으로 캐시 업데이트
      if (previousUser) {
        queryClient.setQueryData<UserResponse>(userKeys.me(), {
          ...previousUser,
          ...newData,
        });
      }

      return { previousUser };
    },
    onError: (_error, _variables, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousUser) {
        queryClient.setQueryData(userKeys.me(), context.previousUser);
      }
    },
    onSettled: () => {
      // 성공/실패 관계없이 서버 데이터로 재검증
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
    },
  });
};

/** 회원 탈퇴 */
export const useDeleteMe = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: deleteMe,
    onSuccess: () => {
      // 모든 쿼리 캐시 제거
      queryClient.clear();
      localStorage.clear();
      window.location.href = '/login';
    },
  });
};
