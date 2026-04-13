import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  GenreInfo,
  SignupStep,
  SignupData,
  SocialProvider,
  User,
} from '@/types';
import { generateRandomNickname } from '@/types';
import type { LoginResponse, UserResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  signupStep: SignupStep;
  signupData: SignupData;

  // Actions
  login: (provider: SocialProvider, email: string) => void;
  loginWithApi: (response: LoginResponse) => void;
  setUserFromApi: (userResponse: UserResponse) => void;
  logout: () => void;
  setSignupStep: (step: SignupStep) => void;
  updateSignupData: (data: Partial<SignupData>) => void;
  completeSignup: () => void;
  updateNickname: (nickname: string) => void;
  updatePreferredGenres: (genres: GenreInfo[]) => void;
  resetSignup: () => void;
}

const initialSignupData: SignupData = {
  provider: 'kakao',
  email: '',
  termsAgreed: false,
  preferredGenres: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      signupStep: 'login',
      signupData: initialSignupData,

      login: (provider, email) => {
        set({
          signupData: { ...get().signupData, provider, email },
          signupStep: 'terms',
        });
      },

      loginWithApi: (response: LoginResponse) => {
        const { user: apiUser, accessToken, refreshToken } = response;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const provider = apiUser.provider.toLowerCase() as SocialProvider;
        const newUser: User = {
          id: apiUser.uuid,
          email: apiUser.email,
          nickname: apiUser.nickname,
          profileImage: apiUser.profileImageUrl,
          provider,
          preferences: { preferredGenres: apiUser.preferredGenres ?? [] },
          createdAt: new Date().toISOString(),
        };

        set({
          user: newUser,
          isAuthenticated: true,
          signupStep: apiUser.isOnboarded ? 'complete' : 'preferences',
          signupData: { ...get().signupData, provider, email: apiUser.email },
        });
      },

      setUserFromApi: (apiUser: UserResponse) => {
        const provider = apiUser.provider.toLowerCase() as SocialProvider;
        const newUser: User = {
          id: apiUser.uuid,
          email: apiUser.email,
          nickname: apiUser.nickname,
          profileImage: apiUser.profileImageUrl,
          provider,
          preferences: { preferredGenres: apiUser.preferredGenres ?? [] },
          createdAt: new Date().toISOString(),
        };
        set({ user: newUser });
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({
          user: null,
          isAuthenticated: false,
          signupStep: 'login',
          signupData: initialSignupData,
        });
      },

      setSignupStep: step => {
        set({ signupStep: step });
      },

      updateSignupData: data => {
        set({ signupData: { ...get().signupData, ...data } });
      },

      completeSignup: () => {
        const { signupData, user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: { preferredGenres: signupData.preferredGenres },
            },
            signupStep: 'complete',
            signupData: initialSignupData,
          });
          return;
        }
        // 로컬 전용 fallback (서버 user 없이 온보딩 완료된 경우)
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: signupData.email,
          nickname: generateRandomNickname(),
          provider: signupData.provider,
          preferences: { preferredGenres: signupData.preferredGenres },
          createdAt: new Date().toISOString(),
        };
        set({
          user: newUser,
          isAuthenticated: true,
          signupStep: 'complete',
          signupData: initialSignupData,
        });
      },

      updateNickname: nickname => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, nickname } });
        }
      },

      updatePreferredGenres: genres => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: { ...user.preferences, preferredGenres: genres },
            },
          });
        }
      },

      resetSignup: () => {
        set({
          signupStep: 'login',
          signupData: initialSignupData,
        });
      },
    }),
    {
      name: 'pickly-auth',
    },
  ),
);
