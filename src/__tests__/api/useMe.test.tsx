import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMe, useUpdateMe, useDeleteMe } from '@/api/useMe';
import { userKeys } from '@/api/queryKeys';
import * as userApi from '@/api/user';
import type { UserResponse } from '@/types/api';

// Mock the API module
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

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

  return {
    queryClient,
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  };
}

describe('useMe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should not fetch when no access token exists', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useMe(), { wrapper });

    expect(result.current.fetchStatus).toBe('idle');
    expect(userApi.getMe).not.toHaveBeenCalled();
  });

  it('should fetch user data when access token exists', async () => {
    localStorage.setItem('accessToken', 'test-token');
    (userApi.getMe as jest.Mock).mockResolvedValue(mockUser);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useMe(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUser);
    expect(userApi.getMe).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    localStorage.setItem('accessToken', 'test-token');
    (userApi.getMe as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useMe(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Network error');
  });
});

describe('useUpdateMe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should optimistically update cache on mutation', async () => {
    localStorage.setItem('accessToken', 'test-token');

    const updatedUser: UserResponse = { ...mockUser, nickname: '새닉네임' };
    (userApi.updateMe as jest.Mock).mockResolvedValue(updatedUser);
    // Prevent invalidation refetch from failing
    (userApi.getMe as jest.Mock).mockResolvedValue(updatedUser);

    const { queryClient, wrapper } = createWrapper();

    // Pre-populate cache
    queryClient.setQueryData(userKeys.me('test-uuid'), mockUser);

    const { result } = renderHook(() => useUpdateMe(), { wrapper });

    await act(async () => {
      result.current.mutate({ nickname: '새닉네임' });
      // Give time for onMutate to execute
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    // Optimistic update should have been applied
    const cachedData = queryClient.getQueryData<UserResponse>(userKeys.me('test-uuid'));
    expect(cachedData?.nickname).toBe('새닉네임');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('should rollback cache on mutation error', async () => {
    localStorage.setItem('accessToken', 'test-token');
    (userApi.updateMe as jest.Mock).mockRejectedValue(new Error('Server error'));
    // Prevent invalidation refetch
    (userApi.getMe as jest.Mock).mockResolvedValue(mockUser);

    const { queryClient, wrapper } = createWrapper();

    // Pre-populate cache with original data
    queryClient.setQueryData(userKeys.me('test-uuid'), mockUser);

    const { result } = renderHook(() => useUpdateMe(), { wrapper });

    act(() => {
      result.current.mutate({ nickname: '실패할닉네임' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // Should rollback to original data
    await waitFor(() => {
      const cachedData = queryClient.getQueryData<UserResponse>(userKeys.me('test-uuid'));
      expect(cachedData?.nickname).toBe('테스트유저');
    });
  });
});

describe('useDeleteMe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should call deleteMe API and clear localStorage on success', async () => {
    localStorage.setItem('accessToken', 'test-token');
    localStorage.setItem('refreshToken', 'test-refresh');
    (userApi.deleteMe as jest.Mock).mockResolvedValue(undefined);

    const { queryClient, wrapper } = createWrapper();
    queryClient.setQueryData(userKeys.me('test-uuid'), mockUser);

    const { result } = renderHook(() => useDeleteMe(), { wrapper });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify deleteMe API was called
    expect(userApi.deleteMe).toHaveBeenCalledTimes(1);

    // Verify localStorage was cleared
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();

    // Verify query cache was cleared
    expect(queryClient.getQueryData(userKeys.me('test-uuid'))).toBeUndefined();
  });
});
