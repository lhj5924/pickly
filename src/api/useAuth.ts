// ============================================================
// 📁 src/hooks/useAuth.ts
// 로그인 훅
// ============================================================

import { useMutation } from '@tanstack/react-query';
import { login } from '../api/auth';
import type { LoginResponse } from '../types/api';
import { useAuthStore } from '../stores';

export const useLogin = (provider: 'kakao' | 'google') => {
  const loginWithApi = useAuthStore(state => state.loginWithApi);

  return useMutation<LoginResponse, Error, { code: string }>({
    mutationFn: ({ code }) => login(provider, { code }),
    onSuccess: (data) => {
      loginWithApi(data);
    },
  });
};
