import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, SignupStep, SignupData, SocialProvider, generateRandomNickname, Category } from '@/types';
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
  updateFavoriteCategories: (categories: Category[]) => void;
  resetSignup: () => void;
}

const initialSignupData: SignupData = {
  provider: 'kakao',
  email: '',
  termsAgreed: false,
  favoriteCategories: [],
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
          preferences: { favoriteCategories: [] },
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
          preferences: { favoriteCategories: [] },
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

      setSignupStep: (step) => {
        set({ signupStep: step });
      },

      updateSignupData: (data) => {
        set({ signupData: { ...get().signupData, ...data } });
      },

      completeSignup: () => {
        const { signupData } = get();
        const newUser: User = {
          id: `user_${Date.now()}`,
          email: signupData.email,
          nickname: generateRandomNickname(),
          provider: signupData.provider,
          preferences: {
            favoriteCategories: signupData.favoriteCategories,
          },
          createdAt: new Date().toISOString(),
        };
        
        set({
          user: newUser,
          isAuthenticated: true,
          signupStep: 'complete',
          signupData: initialSignupData,
        });
      },

      updateNickname: (nickname) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, nickname } });
        }
      },

      updateFavoriteCategories: (categories) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: { ...user.preferences, favoriteCategories: categories },
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
    }
  )
);
