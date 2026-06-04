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
      { id: 1, code: 'NOVEL', name: '소설', description: '소설 장르' },
      { id: 2, code: 'ESSAY', name: '에세이', description: '에세이 장르' },
      { id: 3, code: 'ECONOMY', name: '경제경영', description: '경제경영 장르' },
    ],
  },
  createdAt: '2025-09-01T10:00:00Z',
  role: 'USER',
};

export const mockUserResponse: UserResponse = {
  uuid: MOCK_USER_UUID,
  email: mockUser.email,
  nickname: mockUser.nickname,
  profileImageUrl: mockUser.profileImage ?? '',
  provider: 'KAKAO',
  gender: 'FEMALE',
  ageGroup: 'TWENTIES',
  isOnboarded: true,
  preferredGenres: mockUser.preferences.preferredGenres,
  role: 'USER',
};
