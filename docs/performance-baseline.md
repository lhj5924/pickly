# Performance Baseline (React Query 최적화 전)

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
| /mypage | 3.9 kB | 168 kB |
| /oauth/[provider]/callback | 3.65 kB | 145 kB |
| /recommend | 2.27 kB | 132 kB |
| /review | 1.13 kB | 134 kB |
| /review/write | 3.61 kB | 133 kB |
| /search | 2.18 kB | 129 kB |
| /signup/preferences | 2.67 kB | 161 kB |
| /stats | 4.05 kB | 134 kB |
| **Shared JS** | | **102 kB** |

## 현재 React Query 사용 현황

### 사용중인 Hook
- `useMe()` - 사용자 정보 조회 (5분 staleTime)
- `useUpdateMe()` - 사용자 정보 수정 (setQueryData + invalidate)
- `useDeleteMe()` - 회원 탈퇴
- `useLogin()` - OAuth 로그인

### 식별된 문제점

1. **QueryProvider 설정 미흡**
   - 글로벌 에러 핸들링 없음
   - gcTime 미설정 (기본값 5분)
   - staleTime 글로벌 기본값 0 (매 마운트마다 refetch)
   - DevTools 미연동

2. **Zustand-React Query 동기화 안티패턴**
   - MyPage에서 `useEffect`로 서버 데이터 → Zustand 동기화
   - React Query 캐시와 Zustand 이중 관리로 인한 불필요한 리렌더링
   - 서버 상태의 Single Source of Truth 원칙 위반

3. **Optimistic Update 미구현**
   - `useUpdateMe`에서 setQueryData 후 invalidate하지만 에러 시 롤백 없음
   - 사용자 경험 저하 가능성

4. **Query Key 관리 미체계화**
   - 단순 배열 리터럴 사용 (`['user', 'me']`)
   - Query Key Factory 패턴 미적용

5. **Prefetch 미활용**
   - 로그인 성공 후 사용자 데이터 prefetch 없음
   - 페이지 전환 시 waterfall 발생 가능

6. **에러 바운더리 미연동**
   - React Query의 throwOnError와 ErrorBoundary 미활용
