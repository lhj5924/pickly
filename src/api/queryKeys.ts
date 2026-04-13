// ============================================================
// Query Key Factory
// 체계적인 쿼리 키 관리를 위한 팩토리 패턴
// ============================================================

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
} as const;
