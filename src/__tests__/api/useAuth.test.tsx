import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { userKeys } from '@/api/queryKeys';
import * as authApi from '@/api/auth';
import type { LoginResponse, UserResponse } from '@/types/api';

// Mock modules
const mockLoginWithApi = jest.fn();
jest.mock('@/stores', () => ({
  useAuthStore: Object.assign(
    (selector: (state: Record<string, unknown>) => unknown) =>
      selector({ loginWithApi: mockLoginWithApi }),
    { getState: () => ({ signupStep: 'complete' }) },
  ),
}));
jest.mock('@/api/auth');

// Import after mocks are set up
import { useLogin } from '@/api/useAuth';

const mockUserResponse: UserResponse = {
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

const mockLoginResponse: LoginResponse = {
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  user: mockUserResponse,
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

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should call login API and seed user cache on success', async () => {
    (authApi.login as jest.Mock).mockResolvedValue(mockLoginResponse);

    const { queryClient, wrapper } = createWrapper();
    const { result } = renderHook(() => useLogin('kakao'), { wrapper });

    act(() => {
      result.current.mutate({ code: 'test-auth-code' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify API was called with correct params
    expect(authApi.login).toHaveBeenCalledWith('kakao', { code: 'test-auth-code' });

    // Verify loginWithApi was called
    expect(mockLoginWithApi).toHaveBeenCalledWith(mockLoginResponse);

    // Verify user data was seeded into cache (prefetch)
    const cachedUser = queryClient.getQueryData<UserResponse>(userKeys.me(mockUserResponse.uuid));
    expect(cachedUser).toEqual(mockUserResponse);
  });

  it('should handle login error', async () => {
    (authApi.login as jest.Mock).mockRejectedValue(new Error('Login failed'));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useLogin('google'), { wrapper });

    act(() => {
      result.current.mutate({ code: 'bad-code' });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Login failed');
  });
});
