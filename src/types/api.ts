// ============================================================
// 📁 src/types/api.ts
// 공통 타입 & Pickly API 전체 타입 정의
// ============================================================

// --- 공통 ---
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// --- Enum ---
export type OAuthProvider = 'KAKAO' | 'GOOGLE';
export type Gender = 'MALE' | 'FEMALE';
export type AgeGroup = 'TEENS' | 'TWENTIES' | 'THIRTIES' | 'FORTIES' | 'FIFTIES_PLUS';

// --- User ---
export interface UserResponse {
  uuid: string;
  email: string;
  nickname: string;
  profileImageUrl: string;
  provider: OAuthProvider;
  gender: Gender;
  ageGroup: AgeGroup;
  isOnboarded: boolean;
}

// --- Auth ---
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends TokenResponse {
  user: UserResponse;
}

export interface LoginRequest {
  code: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// --- User Update ---
export interface UpdateUserRequest {
  nickname?: string;
  profileImageUrl?: string;
  gender?: Gender;
  ageGroup?: AgeGroup;
}
