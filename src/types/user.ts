import { Category } from './book';

export type SocialProvider = 'google' | 'kakao';

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  provider: SocialProvider;
  preferences: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  favoriteCategories: Category[];
}

export type SignupStep = 'login' | 'terms' | 'preferences' | 'complete';

export interface SignupData {
  provider: SocialProvider;
  email: string;
  termsAgreed: boolean;
  favoriteCategories: Category[];
}

// 랜덤 닉네임 생성
const NICKNAME_ADJECTIVES = [
  '책읽는', '독서하는', '꼼꼼한', '열정적인', '차분한',
  '지적인', '탐구하는', '호기심많은', '깊이있는', '사색하는',
];

const NICKNAME_NOUNS = [
  '피클러', '독서가', '서재지기', '책벌레', '페이지터너',
  '북러버', '리더', '탐독가', '서적광', '문학인',
];

export const generateRandomNickname = (): string => {
  const adjective = NICKNAME_ADJECTIVES[Math.floor(Math.random() * NICKNAME_ADJECTIVES.length)];
  const noun = NICKNAME_NOUNS[Math.floor(Math.random() * NICKNAME_NOUNS.length)];
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${adjective}${noun}_${number}`;
};
