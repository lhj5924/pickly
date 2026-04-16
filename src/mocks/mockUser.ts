// ============================================================
// src/mocks/mockUser.ts
// Dev-only mock user
// ============================================================

import type { User } from '@/types/user';
import type { UserResponse } from '@/types/api';

export const MOCK_USER_UUID = 'mock-user-001';

export const mockUser: User = {
  id: MOCK_USER_UUID,
  email: 'mock@pickly.dev',
  nickname: '피클리유저',
  profileImage: 'https://i.pravatar.cc/150?img=32',
  provider: 'kakao',
  preferences: {
    preferredGenres: [
      { code: 'NOVEL', name: '소설', description: '소설 장르' },
      { code: 'ESSAY', name: '에세이', description: '에세이 장르' },
      { code: 'ECONOMY', name: '경제경영', description: '경제경영 장르' },
    ],
  },
  createdAt: '2025-09-01T10:00:00Z',
};

export const mockUserResponse: UserResponse = {
  uuid: MOCK_USER_UUID,
  email: mockUser.email,
  nickname: mockUser.nickname,
  profileImageUrl: mockUser.profileImage ?? '',
  provider: 'KAKAO',
  gender: 'MALE',
  ageGroup: 'TWENTIES',
  isOnboarded: true,
  preferredGenres: mockUser.preferences.preferredGenres,
};
