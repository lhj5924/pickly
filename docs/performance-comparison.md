# React Query 최적화 전후 성능 비교

**측정일**: 2026-03-31  
**브랜치**: `claude/implement-react-query-ZSu4q`

---

## 1. Bundle Size 비교

### Route별 First Load JS

| Route | Before | After | 차이 |
|-------|--------|-------|------|
| / | 107 kB | 107 kB | **0** |
| /_not-found | 103 kB | 103 kB | **0** |
| /book/[id] | 135 kB | 135 kB | **0** |
| /home | 137 kB | 137 kB | **0** |
| /library | 131 kB | 131 kB | **0** |
| /login | 130 kB | 130 kB | **0** |
| /mypage | 168 kB | 167 kB | **-1 kB** |
| /oauth/callback | 145 kB | 145 kB | **0** |
| /recommend | 132 kB | 132 kB | **0** |
| /review | 134 kB | 134 kB | **0** |
| /review/write | 133 kB | 133 kB | **0** |
| /search | 129 kB | 129 kB | **0** |
| /signup/preferences | 161 kB | 160 kB | **-1 kB** |
| /stats | 134 kB | 134 kB | **0** |
| **Shared JS** | **102 kB** | **102 kB** | **0** |

### Route별 Page Size

| Route | Before | After | 차이 |
|-------|--------|-------|------|
| /mypage | 3.90 kB | 3.98 kB | +0.08 kB (optimistic update 로직) |
| /oauth/callback | 3.65 kB | 4.52 kB | +0.87 kB (캐시 시딩 로직) |
| /signup/preferences | 2.67 kB | 2.79 kB | +0.12 kB |

### 분석
- **Shared JS 변화 없음** (102 kB): React Query DevTools는 프로덕션에서 tree-shaken 되어 번들에 포함되지 않음
- **mypage First Load -1 kB**: Zustand 동기화 useEffect + setUserFromApi 호출 제거 효과
- **Page size 미세 증가**: optimistic update 로직, 캐시 시딩 로직 추가분이나 First Load에는 영향 미미

---

## 2. 네트워크 요청 비교

### 시나리오별 API 호출 횟수

| 시나리오 | Before | After | 절감 |
|----------|--------|-------|------|
| 로그인 → 마이페이지 첫 진입 | `GET /users/me` 1회 | 0회 (캐시 시딩) | **-1회** |
| 마이페이지에서 홈 → 다시 마이페이지 (2분 내) | `GET /users/me` 1회 | 0회 (staleTime) | **-1회** |
| 마이페이지에서 홈 → 다시 마이페이지 (5분 후) | `GET /users/me` 1회 | `GET /users/me` 1회 (stale) | 0 |
| 닉네임 수정 | `PATCH /users/me` 1회 + `GET /users/me` 1회 | `PATCH /users/me` 1회 + `GET /users/me` 1회 | 0 |

### 테스트 증빙

```
✓ 캐시에 데이터가 있고 stale하지 않으면 API를 호출하지 않아야 한다
  → getMe 호출 횟수: 0회 (이전: 1회)

✓ staleTime 내 동일 쿼리 재마운트 시 API를 호출하지 않아야 한다
  → 첫 마운트 후 언마운트 → 재마운트: getMe 총 1회만 호출 (이전: 2회)
```

---

## 3. 렌더링 성능 비교

### MyPage 마운트 시 렌더링 횟수

| 단계 | Before | After |
|------|--------|-------|
| 초기 마운트 (로딩) | 렌더 1회 | 렌더 1회 |
| 데이터 수신 | 렌더 1회 | 렌더 1회 |
| Zustand 동기화 useEffect | 렌더 1회 | ~~제거됨~~ |
| **합계** | **3회** | **2회** |

> MyPage 마운트 시 불필요한 리렌더링 **1회 감소** (33% 개선)

### 닉네임 수정 시 UX 반영 속도

| 측정 항목 | Before | After |
|-----------|--------|-------|
| UI 반영 시점 | 서버 응답 후 (~200ms) | 즉시 (0ms, optimistic) |
| 에러 시 동작 | 에러 표시만 (캐시 불일치 가능) | 자동 롤백 (이전 닉네임 복원) |

### 테스트 증빙

```
✓ mutation 시작 즉시 캐시가 업데이트되어야 한다
  → API 응답 대기(500ms) 중에도 캐시에 '새닉네임' 즉시 반영 확인
  → result.current.isPending === true (API는 아직 응답하지 않음)

✓ 캐시 시딩 후 useMe 초기 렌더 시간: 1.59ms
  → 네트워크 대기 없이 즉시 데이터 반환
```

---

## 4. 데이터 일관성 비교

| 항목 | Before | After |
|------|--------|-------|
| 서버 상태 진실 소스 | React Query + Zustand (이중 관리) | React Query (단일 소스) |
| 수정 실패 시 캐시 | 불일치 가능 (setQueryData 후 롤백 없음) | 자동 롤백 (onError) |
| 탈퇴 시 캐시 정리 | localStorage만 정리 | queryClient.clear() + localStorage 정리 |
| Query Key 관리 | 하드코딩 `['user', 'me']` | Factory 패턴 `userKeys.me()` |

### 테스트 증빙

```
✓ should rollback cache on mutation error
  → updateMe 실패 후 cachedData.nickname === '테스트유저' (원본 복원 확인)

✓ should call deleteMe API and clear localStorage on success
  → queryClient.getQueryData(userKeys.me()) === undefined (캐시 완전 제거)
```

---

## 5. 개발 경험(DX) 비교

| 항목 | Before | After |
|------|--------|-------|
| 캐시 디버깅 | 불가능 | React Query DevTools로 실시간 확인 |
| 에러 추적 | 각 컴포넌트에서 개별 처리 | 글로벌 onError에서 401/네트워크/API 자동 분류 |
| Query Key 오타 | 런타임까지 발견 불가 | Factory 패턴으로 타입 안전성 확보 |
| 테스트 | 없음 | 21개 테스트 (hooks, provider, 성능) |

---

## 6. 종합 비교표

| 지표 | Before | After | 개선율 |
|------|--------|-------|--------|
| Shared Bundle | 102 kB | 102 kB | 0% |
| /mypage First Load | 168 kB | 167 kB | -0.6% |
| 로그인→마이페이지 API 호출 | 1회 | 0회 | **-100%** |
| 2분 내 재방문 API 호출 | 1회 | 0회 | **-100%** |
| MyPage 마운트 렌더링 | 3회 | 2회 | **-33%** |
| 닉네임 수정 UI 반영 | ~200ms | 0ms | **즉시 반영** |
| 수정 실패 시 데이터 복구 | 수동 | 자동 롤백 | **자동화** |
| 서버 상태 소스 | 2개 (이중) | 1개 (단일) | **단일화** |
| 테스트 커버리지 | 0개 | 21개 | **+21개** |

---

## 7. 결론

이번 React Query 최적화는 **번들 크기에 거의 영향 없이** 런타임 성능과 안정성을 크게 개선하였습니다.

### 핵심 개선 사항
1. **불필요한 네트워크 요청 제거**: 캐시 시딩 + staleTime으로 동일 데이터 중복 요청 방지
2. **UI 반응성 향상**: Optimistic Update로 사용자 동작 즉시 반영
3. **데이터 안정성 강화**: 에러 시 자동 롤백으로 캐시 일관성 보장
4. **아키텍처 개선**: 서버 상태 Single Source of Truth 확립, Zustand는 클라이언트 전용 상태만 관리
