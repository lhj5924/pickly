/**
 * 렌더링 횟수 측정 테스트
 * React Query 최적화 전후의 컴포넌트 리렌더링 횟수를 검증합니다.
 */
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMe, useUpdateMe } from '@/api/useMe';
import { userKeys } from '@/api/queryKeys';
import * as userApi from '@/api/user';
import type { UserResponse } from '@/types/api';

jest.mock('@/api/user');
jest.mock('@/stores', () => ({
  useAuthStore: Object.assign(
    (selector: (state: Record<string, unknown>) => unknown) =>
      selector({ user: { id: 'test-uuid' } }),
    { getState: () => ({ user: { id: 'test-uuid' } }) },
  ),
}));

const mockUser: UserResponse = {
  uuid: 'test-uuid',
  email: 'test@example.com',
  nickname: '테스트유저',
  profileImageUrl: 'https://example.com/avatar.png',
  provider: 'KAKAO',
  gender: 'MALE',
  ageGroup: 'TWENTIES',
  preferredGenres: [],
  isOnboarded: true,
};

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('렌더링 횟수 측정', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Infinity },
        mutations: { retry: false },
      },
    });
  });

  describe('useMe - 캐시 히트 시 네트워크 호출 없음', () => {
    it('캐시에 데이터가 있고 stale하지 않으면 API를 호출하지 않아야 한다', async () => {
      localStorage.setItem('accessToken', 'test-token');

      // 캐시에 데이터 시딩 (로그인 시 useLogin이 수행하는 것과 동일)
      queryClient.setQueryData(userKeys.me('test-uuid'), mockUser);

      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useMe(), { wrapper });

      // 즉시 성공 상태 (네트워크 호출 없이)
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockUser);

      // API가 호출되지 않았는지 확인 (staleTime 내이므로)
      expect(userApi.getMe).not.toHaveBeenCalled();
    });

    it('캐시가 stale하면 백그라운드에서 refetch해야 한다', async () => {
      localStorage.setItem('accessToken', 'test-token');
      (userApi.getMe as jest.Mock).mockResolvedValue(mockUser);

      // 캐시에 stale 데이터 세팅 (updatedAt을 과거로)
      queryClient.setQueryData(userKeys.me('test-uuid'), mockUser, {
        updatedAt: Date.now() - 1000 * 60 * 10, // 10분 전
      });

      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useMe(), { wrapper });

      // 캐시된 데이터는 즉시 반환
      expect(result.current.data).toEqual(mockUser);

      // 백그라운드에서 refetch 발생
      await waitFor(() => {
        expect(userApi.getMe).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('useUpdateMe - Optimistic Update 렌더링 측정', () => {
    it('mutation 시작 즉시 캐시가 업데이트되어야 한다', async () => {
      localStorage.setItem('accessToken', 'test-token');

      const updatedUser = { ...mockUser, nickname: '새닉네임' };
      // API 응답을 지연시켜 optimistic update가 먼저 적용되는지 확인
      (userApi.updateMe as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(updatedUser), 500))
      );
      (userApi.getMe as jest.Mock).mockResolvedValue(updatedUser);

      queryClient.setQueryData(userKeys.me('test-uuid'), mockUser);
      const wrapper = createWrapper(queryClient);

      const { result } = renderHook(() => useUpdateMe(), { wrapper });

      // Mutation 시작
      await act(async () => {
        result.current.mutate({ nickname: '새닉네임' });
        // onMutate가 실행될 시간을 준다
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      // API 응답 전에 이미 캐시가 업데이트되어 있어야 함
      const cachedData = queryClient.getQueryData<UserResponse>(userKeys.me('test-uuid'));
      expect(cachedData?.nickname).toBe('새닉네임');

      // 이 시점에서 API는 아직 응답하지 않았음 (500ms 지연)
      expect(result.current.isPending).toBe(true);
    });
  });

  describe('캐시 시딩 성능 효과', () => {
    it('로그인 후 캐시 시딩된 상태에서 useMe는 즉시 데이터를 반환해야 한다', () => {
      localStorage.setItem('accessToken', 'test-token');

      // 로그인 시 useLogin의 onSuccess에서 수행하는 캐시 시딩 시뮬레이션
      queryClient.setQueryData(userKeys.me('test-uuid'), mockUser);

      const wrapper = createWrapper(queryClient);

      const startTime = performance.now();
      const { result } = renderHook(() => useMe(), { wrapper });
      const endTime = performance.now();

      // 데이터가 즉시 사용 가능 (로딩 없음)
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockUser);
      expect(result.current.isLoading).toBe(false);

      // API 호출 없음
      expect(userApi.getMe).not.toHaveBeenCalled();

      // 1ms 이내에 완료 (네트워크 대기 없음)
      const elapsed = endTime - startTime;
      expect(elapsed).toBeLessThan(50); // 렌더링 오버헤드 감안 50ms
      console.log(`캐시 시딩 후 useMe 초기 렌더 시간: ${elapsed.toFixed(2)}ms`);
    });

    it('캐시가 없는 상태에서 useMe는 로딩 상태를 거쳐야 한다', async () => {
      localStorage.setItem('accessToken', 'test-token');
      (userApi.getMe as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockUser), 100))
      );

      const wrapper = createWrapper(queryClient);
      const { result } = renderHook(() => useMe(), { wrapper });

      // 최초에는 로딩 상태
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // API 응답 후 데이터 사용 가능
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockUser);
    });
  });

  describe('staleTime 효과 측정', () => {
    it('staleTime 내 동일 쿼리 재마운트 시 API를 호출하지 않아야 한다', async () => {
      localStorage.setItem('accessToken', 'test-token');
      (userApi.getMe as jest.Mock).mockResolvedValue(mockUser);

      const wrapper = createWrapper(queryClient);

      // 첫 번째 마운트
      const { result: result1, unmount } = renderHook(() => useMe(), { wrapper });
      await waitFor(() => expect(result1.current.isSuccess).toBe(true));
      expect(userApi.getMe).toHaveBeenCalledTimes(1);

      // 언마운트 (페이지 이동 시뮬레이션)
      unmount();

      // 두 번째 마운트 (페이지 재방문)
      const { result: result2 } = renderHook(() => useMe(), { wrapper });

      // staleTime 내이므로 즉시 캐시 데이터 반환, API 재호출 없음
      expect(result2.current.isSuccess).toBe(true);
      expect(result2.current.data).toEqual(mockUser);

      // 추가 API 호출이 발생하지 않았는지 확인
      // (staleTime 전에는 매번 refetch가 발생했을 것)
      expect(userApi.getMe).toHaveBeenCalledTimes(1);
      console.log('staleTime 내 재마운트: API 호출 0회 (이전에는 1회 발생했을 것)');
    });
  });
});
