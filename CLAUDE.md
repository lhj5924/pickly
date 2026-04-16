# Pickly 프론트엔드 프로젝트

## API 설정

- **Base URL (로컬)**: `http://localhost:8080`
- **환경변수**: `VITE_API_BASE_URL` (Next.js는 `NEXT_PUBLIC_API_BASE_URL`)
- **API 문서**: http://localhost:8080/swagger-ui.html
- **인증**: JWT Bearer Token → `Authorization: Bearer {accessToken}`

## 토큰 정책

- Access Token: 1시간 만료 → 만료 시 Refresh Token으로 재발급
- Refresh Token: 7일 만료
- 토큰 저장: localStorage (`accessToken`, `refreshToken`)

## 프로젝트 컨벤션

- Language: TypeScript (strict, any 타입 금지)
- API 함수: `/src/api/<도메인>.ts`
- React Query 훅: `/src/hooks/use<Domain>.ts`
- 타입 정의: `/src/types/<도메인>.ts`
- 에러 처리: 공통 에러 핸들러 사용, try/catch 필수

## API 도메인 목록

- auth: 로그인, 토큰 갱신
- user: 내 정보 조회/수정/탈퇴

---

## API 명세

### Auth API

#### POST /api/v1/auth/login/{provider}

- provider: "kakao" | "google"
- Request Body: `{ "code": "oauth_authorization_code" }`
- Response:

```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "user": {
    "uuid": "string",
    "email": "string",
    "nickname": "string",
    "profileImageUrl": "string",
    "provider": "KAKAO" | "GOOGLE",
    "gender": "MALE" | "FEMALE",
    "ageGroup": "TEENS" | "TWENTIES" | "THIRTIES" | "FORTIES" | "FIFTIES_PLUS",
    "isOnboarded": true
  }
}
```

#### POST /api/v1/auth/refresh

- Request Body: `{ "refreshToken": "string" }`
- Response: `{ "accessToken": "string", "refreshToken": "string" }`

### User API (모두 인증 필요)

#### GET /api/v1/users/me → UserResponse

#### PATCH /api/v1/users/me

- Body: `{ nickname?, profileImageUrl?, gender?, ageGroup? }`
- Response: UserResponse

#### DELETE /api/v1/users/me → 204 No Content

### 공통 에러 응답

```json
{ "code": "ERROR_CODE", "message": "에러 메시지", "details": {} }
```

주요 코드: INVALID_INPUT(400), UNAUTHORIZED(401), EXPIRED_TOKEN(401), USER_NOT_FOUND(404), INTERNAL_ERROR(500)
