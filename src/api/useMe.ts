// ============================================================
// 📁 src/hooks/useMe.ts
// 내 정보 조회/수정/탈퇴 훅
// ============================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe, deleteMe } from '../api/user';
import type { UpdateUserRequest, UserResponse } from '../types/api';

export const USER_QUERY_KEY = ['user', 'me'] as const;

/** 내 정보 조회 */
export const useMe = () => {
  return useQuery<UserResponse, Error>({
    queryKey: USER_QUERY_KEY,
    queryFn: getMe,
    staleTime: 1000 * 60 * 5, // 5분 캐시
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
  });
};

/** 내 정보 수정 */
export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, Error, UpdateUserRequest>({
    mutationFn: updateMe,
    onSuccess: data => {
      // 수정 성공 시 캐시 즉시 업데이트 후 백그라운드 재검증
      queryClient.setQueryData(USER_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
    },
  });
};

/** 회원 탈퇴 */
export const useDeleteMe = () => {
  return useMutation<void, Error, void>({
    mutationFn: deleteMe,
    onSuccess: () => {
      localStorage.clear();
      window.location.href = '/login';
    },
  });
};

// ============================================================
// 📁 사용 예시 (컴포넌트에서)
// ============================================================
/*

// ✅ 내 정보 표시
function ProfileCard() {
  const { data: user, isLoading, isError } = useMe();

  if (isLoading) return <p>불러오는 중...</p>;
  if (isError)   return <p>오류가 발생했습니다.</p>;

  return (
    <div>
      <img src={user.profileImageUrl} alt="프로필" />
      <p>{user.nickname}</p>
      <p>{user.email}</p>
    </div>
  );
}

// ✅ 닉네임 수정
function EditNickname() {
  const { mutate, isPending } = useUpdateMe();

  const handleSubmit = (nickname: string) => {
    mutate({ nickname });
  };

  return (
    <button onClick={() => handleSubmit('새닉네임')} disabled={isPending}>
      {isPending ? '저장 중...' : '저장'}
    </button>
  );
}

// ✅ 카카오 로그인 (OAuth 콜백 페이지에서)
function KakaoCallback() {
  const { mutate } = useLogin('kakao');
  const code = new URLSearchParams(window.location.search).get('code') ?? '';

  useEffect(() => {
    if (code) mutate({ code });
  }, [code]);

  return <p>로그인 중...</p>;
}

*/
