# React Query 최적화 적용 보고서

**작성일**: 2026-03-31  
**브랜치**: `claude/implement-react-query-ZSu4q`

---

## 1. 개요

Pickly 프론트엔드 프로젝트에 React Query(TanStack Query) 최적화를 적용하여 서버 상태 관리의 효율성, 안정성, 개발 경험을 개선하였습니다.

---

## 2. 변경 사항 요약

### 2.1 QueryProvider 강화 (`src/components/providers/QueryProvider.tsx`)

| 항목               | Before                    | After                                                  |
| ------------------ | ------------------------- | ------------------------------------------------------ |
| 글로벌 에러 핸들링 | 없음                      | `QueryCache` / `MutationCache`에 `onError` 핸들러 추가 |
| staleTime 기본값   | 0 (매 마운트마다 refetch) | 2분 (120,000ms)                                        |
| gcTime 기본값      | 5분 (기본값)              | 10분 (600,000ms)                                       |
| Mutation retry     | 3회 (기본값)              | 0회 (중복 요청 방지)                                   |
| DevTools           | 없음                      | `ReactQueryDevtools` 연동 (프로덕션 자동 제거)         |
| 에러 분류          | 없음                      | 401/네트워크/API 에러 자동 분류                        |

**개선 효과**:

- `staleTime: 2분` → 동일 데이터 2분 내 재요청 시 네트워크 호출 0회 (캐시 활용)
- 글로벌 에러 핸들링으로 각 컴포넌트에서 개별 에러 처리 부담 감소
- DevTools로 캐시 상태 실시간 디버깅 가능

### 2.2 Query Key Factory 도입 (`src/api/queryKeys.ts`)

```typescript
// Before: 하드코딩된 키
const USER_QUERY_KEY = ['user', 'me'] as const;

// After: 팩토리 패턴
export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
} as const;
```

**개선 효과**:

- 쿼리 키 중앙 관리로 오타/불일치 방지
- `queryClient.invalidateQueries({ queryKey: userKeys.all })` 로 user 관련 전체 무효화 가능
- 향후 도메인 확장 시 일관된 패턴 유지

### 2.3 Optimistic Update 구현 (`src/api/useMe.ts` - `useUpdateMe`)

| 항목          | Before                              | After                                 |
| ------------- | ----------------------------------- | ------------------------------------- |
| 캐시 업데이트 | `onSuccess`에서 `setQueryData`      | `onMutate`에서 즉시 낙관적 업데이트   |
| 에러 롤백     | 없음                                | `onError`에서 이전 데이터로 자동 롤백 |
| 진행중 쿼리   | 무시                                | `cancelQueries`로 충돌 방지           |
| 재검증        | `onSuccess`에서 `invalidateQueries` | `onSettled`에서 성공/실패 모두 재검증 |

**개선 효과**:

- UI 반영 속도: 서버 응답 대기(~200ms) → 즉시 반영 (0ms)
- 네트워크 에러 시 자동 롤백으로 데이터 일관성 보장
- `cancelQueries`로 race condition 방지

### 2.4 로그인 시 사용자 데이터 캐시 시딩 (`src/api/useAuth.ts`)

```typescript
// Before: 로그인 후 /home 이동 시 useMe()가 별도 API 호출
onSuccess: data => {
  loginWithApi(data);
};

// After: LoginResponse의 user 데이터를 캐시에 즉시 세팅
onSuccess: data => {
  loginWithApi(data);
  queryClient.setQueryData(userKeys.me(), data.user); // 추가 API 호출 불필요
};
```

**개선 효과**:

- 로그인 후 마이페이지/홈 진입 시 `GET /api/v1/users/me` 호출 1회 절약
- 페이지 전환 시 로딩 상태 제거 (즉시 데이터 표시)

### 2.5 Zustand 동기화 안티패턴 제거 (`src/app/(main)/mypage/page.tsx`)

```typescript
// Before: 불필요한 useEffect로 서버 데이터 → Zustand 동기화
useEffect(() => {
  if (serverUser) {
    setUserFromApi(serverUser); // 리렌더링 유발
  }
}, [serverUser, setUserFromApi]);

// After: React Query를 서버 상태의 Single Source of Truth로 사용
// useEffect 제거 → 불필요한 리렌더링 1회 감소
const displayNickname = serverUser?.nickname ?? localUser?.nickname ?? '';
```

**개선 효과**:

- MyPage 마운트 시 불필요한 리렌더링 1회 제거
- React Query 캐시 = 서버 상태의 유일한 진실 소스 (Single Source of Truth)
- 데이터 흐름 단순화로 디버깅 용이성 향상

### 2.6 회원 탈퇴 시 캐시 정리 (`useDeleteMe`)

```typescript
// Before: localStorage만 정리
onSuccess: () => {
  localStorage.clear();
  window.location.href = '/login';
};

// After: 쿼리 캐시도 함께 정리
onSuccess: () => {
  queryClient.clear(); // 모든 쿼리 캐시 제거
  localStorage.clear();
  window.location.href = '/login';
};
```

---

## 3. Bundle Size 비교

### 3.1 빌드 결과 비교

| Route               | Before (First Load JS) | After (First Load JS) | 변화      |
| ------------------- | ---------------------- | --------------------- | --------- |
| /                   | 107 kB                 | 107 kB                | 0         |
| /home               | 137 kB                 | 137 kB                | 0         |
| /library            | 131 kB                 | 131 kB                | 0         |
| /login              | 130 kB                 | 130 kB                | 0         |
| **/mypage**         | **168 kB**             | **167 kB**            | **-1 kB** |
| /oauth/callback     | 145 kB                 | 145 kB                | 0         |
| /signup/preferences | 161 kB                 | 160 kB                | -1 kB     |
| **Shared JS**       | **102 kB**             | **102 kB**            | **0**     |

- React Query DevTools는 **프로덕션 빌드에서 자동 tree-shaken** → 번들 증가 0
- `/mypage`: useEffect/setUserFromApi 제거로 -1 kB 감소
- 전체적으로 번들 크기 변화 미미 (로직 최적화이므로 번들보다 런타임 성능에 영향)

### 3.2 런타임 성능 개선 (이론적 분석)

| 시나리오                     | Before                             | After                          | 개선                              |
| ---------------------------- | ---------------------------------- | ------------------------------ | --------------------------------- |
| 로그인 후 마이페이지 첫 진입 | API 호출 1회 + 로딩 UI             | 캐시 히트 (즉시 표시)          | **API 호출 -1, 로딩 시간 -200ms** |
| 닉네임 수정                  | 서버 응답 후 UI 반영               | 즉시 UI 반영 + 백그라운드 검증 | **체감 지연 -200ms**              |
| 닉네임 수정 실패             | 에러 표시만 (캐시 불일치)          | 자동 롤백 (캐시 일관성 보장)   | **안정성 향상**                   |
| 같은 페이지 2분 내 재방문    | refetch 발생                       | 캐시 활용 (staleTime 2분)      | **불필요한 API 호출 방지**        |
| MyPage 마운트                | 2회 렌더 (데이터 + Zustand 동기화) | 1회 렌더                       | **리렌더링 -1회**                 |

---

## 4. 테스트 결과

```
Test Suites: 5 passed, 5 total
Tests:       15 passed, 15 total
```

### 테스트 커버리지

| 파일                     | 테스트 수 | 내용                                                      |
| ------------------------ | --------- | --------------------------------------------------------- |
| `queryKeys.test.ts`      | 4         | Query Key Factory 키 구조/일관성 검증                     |
| `useMe.test.tsx`         | 5         | useMe 조회, useUpdateMe 낙관적 업데이트/롤백, useDeleteMe |
| `useAuth.test.tsx`       | 2         | useLogin 캐시 시딩, 에러 처리                             |
| `QueryProvider.test.tsx` | 2         | 기본 옵션 설정값 검증, 하위 컴포넌트 렌더링               |
| `sanity.test.ts`         | 1         | 테스트 인프라 정상 동작 확인                              |

---

## 5. 추가된/변경된 파일 목록

| 파일                                             | 변경 유형 | 설명                                            |
| ------------------------------------------------ | --------- | ----------------------------------------------- |
| `src/api/queryKeys.ts`                           | **신규**  | Query Key Factory                               |
| `src/api/useMe.ts`                               | 수정      | Optimistic Update, gcTime, queryKeys 적용       |
| `src/api/useAuth.ts`                             | 수정      | 캐시 시딩 (prefetch 효과)                       |
| `src/components/providers/QueryProvider.tsx`     | 수정      | 글로벌 에러 핸들링, staleTime, gcTime, DevTools |
| `src/app/(main)/mypage/page.tsx`                 | 수정      | Zustand 동기화 안티패턴 제거                    |
| `jest.config.ts`                                 | **신규**  | Jest 설정                                       |
| `tsconfig.jest.json`                             | **신규**  | Jest용 TypeScript 설정                          |
| `src/__tests__/setup.ts`                         | **신규**  | 테스트 환경 설정                                |
| `src/__tests__/test-utils.tsx`                   | **신규**  | 테스트 유틸리티                                 |
| `src/__tests__/api/queryKeys.test.ts`            | **신규**  | Query Key 테스트                                |
| `src/__tests__/api/useMe.test.tsx`               | **신규**  | 사용자 훅 테스트                                |
| `src/__tests__/api/useAuth.test.tsx`             | **신규**  | 인증 훅 테스트                                  |
| `src/__tests__/providers/QueryProvider.test.tsx` | **신규**  | Provider 설정 테스트                            |
| `package.json`                                   | 수정      | 테스트 스크립트 추가, 의존성 업데이트           |

---

## 6. 향후 개선 제안

1. **Book API React Query 적용**: 현재 mock data를 사용하는 Home/Library 페이지에 실제 API 연동 시 React Query 적용
2. **useSuspenseQuery 도입**: React Suspense와 연동하여 로딩 상태 처리 일원화
3. **Infinite Query**: 리뷰 목록 등 페이지네이션에 `useInfiniteQuery` 적용
4. **Prefetch on hover**: 책 카드 hover 시 상세 데이터 prefetch로 상세 페이지 진입 속도 개선
