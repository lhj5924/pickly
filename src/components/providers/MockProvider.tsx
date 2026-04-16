'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores';
import { MOCK_MODE, mockUser } from '@/mocks';

/**
 * Dev-only: seeds the auth store with a mock user so that hooks gated on
 * `user?.id` fire immediately without running through OAuth.
 * No-op unless NEXT_PUBLIC_USE_MOCK=true.
 */
export const MockProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    if (!MOCK_MODE) return;
    const state = useAuthStore.getState();
    if (state.user?.id === mockUser.id) return;
    useAuthStore.setState({
      user: mockUser,
      isAuthenticated: true,
      signupStep: 'complete',
    });
  }, []);

  return <>{children}</>;
};
