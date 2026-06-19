'use client';

import { useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useLogin } from '@/api/useAuth';
import { useAuthStore } from '@/stores';
import styled from 'styled-components';

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fdf6ef 0%, #fef9f4 50%, #e8ebd8 100%);
`;

const Message = styled.p`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function OAuthCallbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const provider = params.provider as 'kakao' | 'google';
  const code = searchParams.get('code');
  const calledRef = useRef(false);

  const { mutate, isPending, isError } = useLogin(provider);
  const signupStep = useAuthStore(state => state.signupStep);

  useEffect(() => {
    if (!code || calledRef.current) return;
    calledRef.current = true;

    mutate(
      { code },
      {
        onSuccess: () => {
          const step = useAuthStore.getState().signupStep;
          if (step === 'complete') {
            router.replace('/home');
          } else {
            router.replace('/signup/preferences');
          }
        },
        onError: () => {
          router.replace('/login');
        },
      },
    );
  }, [code, mutate, router]);

  if (isError) {
    return (
      <Wrapper>
        <Message>로그인에 실패했습니다. 다시 시도해주세요.</Message>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Message>로그인 처리 중...</Message>
    </Wrapper>
  );
}
