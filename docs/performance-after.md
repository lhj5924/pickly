# Performance Baseline (React Query 최적화 후)

## 빌드 일시
2026-03-31

## Bundle Size (Next.js Build Output)

| Route | Size | First Load JS |
|-------|------|---------------|
| / | 2.64 kB | 107 kB |
| /_not-found | 991 B | 103 kB |
| /book/[id] | 2.39 kB | 135 kB |
| /home | 4.17 kB | 137 kB |
| /library | 1.75 kB | 131 kB |
| /login | 3.54 kB | 130 kB |
| /mypage | 3.98 kB | 167 kB |
| /oauth/[provider]/callback | 4.52 kB | 145 kB |
| /recommend | 2.27 kB | 132 kB |
| /review | 1.13 kB | 134 kB |
| /review/write | 3.61 kB | 133 kB |
| /search | 2.18 kB | 129 kB |
| /signup/preferences | 2.79 kB | 160 kB |
| /stats | 4.05 kB | 134 kB |
| **Shared JS** | | **102 kB** |

## React Query 최적화 적용 현황

### QueryProvider 설정
- 글로벌 에러 핸들링: `QueryCache` / `MutationCache` onError
- staleTime 기본값: 2분 (120,000ms)
- gcTime 기본값: 10분 (600,000ms)
- Mutation retry: 0회
- DevTools: 연동 완료 (프로덕션 tree-shaken)

### Hook 최적화
- `useMe()` - gcTime 30분 설정 (사용자 정보 장기 캐시)
- `useUpdateMe()` - Optimistic Update + 에러 롤백 + cancelQueries
- `useDeleteMe()` - queryClient.clear() 추가
- `useLogin()` - onSuccess에서 user 캐시 시딩

### 구조 개선
- Query Key Factory (`userKeys`) 도입
- MyPage Zustand 동기화 useEffect 제거

## 테스트 측정 결과

### 캐시 시딩 효과
- 캐시 시딩 후 useMe 초기 렌더 시간: **1.59ms** (API 호출 0회)
- 캐시 없을 때: API 응답 대기 필요 (100ms+ 로딩 상태)

### staleTime 효과
- staleTime 내 재마운트 시 API 호출: **0회**
- 이전 (staleTime: 0): 매 마운트마다 refetch 발생

### 테스트 전체 통과
- Test Suites: 6 passed
- Tests: 21 passed
