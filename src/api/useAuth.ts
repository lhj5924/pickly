// ============================================================
// 📁 src/api/useAuth.ts
// 로그인 훅 (로그인 성공 시 사용자 데이터 프리페치 적용)
// ============================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth';
import type { LoginResponse } from '../types/api';
import { useAuthStore } from '../stores';
import { userKeys } from './queryKeys';

export const useLogin = (provider: 'kakao' | 'google') => {
  const loginWithApi = useAuthStore(state => state.loginWithApi);
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, { code: string }>({
    mutationFn: ({ code }) => login(provider, { code }),
    onSuccess: (data) => {
      loginWithApi(data);

      // 로그인 성공 시 사용자 데이터를 캐시에 즉시 세팅 (prefetch 효과)
      // 이미 LoginResponse에 user 데이터가 포함되어 있으므로 추가 API 호출 불필요
      queryClient.setQueryData(userKeys.me(), data.user);
    },
  });
};
