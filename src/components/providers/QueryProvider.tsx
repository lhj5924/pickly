'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

function handleGlobalError(error: Error) {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError | undefined;
    const status = error.response?.status;

    // 401은 axios interceptor에서 처리 (토큰 재발급)
    if (status === 401) return;

    // 네트워크 에러
    if (!error.response) {
      console.error('[네트워크 에러] 서버에 연결할 수 없습니다.');
      return;
    }

    console.error(`[API 에러] ${apiError?.code ?? status}: ${apiError?.message ?? error.message}`);
  }
}

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: handleGlobalError,
        }),
        mutationCache: new MutationCache({
          onError: handleGlobalError,
        }),
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 2, // 2분 글로벌 staleTime
            gcTime: 1000 * 60 * 10,   // 10분 garbage collection
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
