'use client';

import styled, { keyframes } from 'styled-components';
import { Button } from '@/components/common';
import { useAuthStore } from '@/stores';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #fdf6ef 0%, #fef9f4 50%, #e8ebd8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 46px;
`;

const Container = styled.div`
  width: 100%;
  min-height: 700px;
  height: calc(100vh - 92px);
  display: flex;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    flex-direction: column;
    min-height: auto;
  }
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(155.99deg, #ffe5cc 10.49%, #d2ffca 93.28%);
  border: 6px solid #ffffff;
  border-radius: 30px 0px 0px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 40vh;
    border-radius: 24px 24px 0 0;
  }
`;

const Logo = styled.h1`
  font-size: 110px;
  font-weight: 400;
  color: #57824c;
  font-family: 'Titan One', cursive;
  margin-bottom: 4rem;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 60px;
    margin-bottom: 0.5rem;
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const JarImage = styled.div`
  animation: ${float} 4s ease-in-out infinite;
`;

const RightPanel = styled.div`
  flex: 2;
  background: rgba(255, 255, 255, 0.6);
  border: 6px solid #ffffff;
  border-radius: 30px 0px 0px 30px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  border-radius: 0 24px 24px 0;

  @media (max-width: 768px) {
    padding: 2rem;
    min-height: 60vh;
    border-radius: 0 0 24px 24px;
  }
`;

const LoginContent = styled.div`
  width: 100%;
  max-width: 380px;
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const KakaoIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const GoogleIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

// 개인정보 약관 동의 모달
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 974px;
  max-height: 60vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    opacity: 0.7;
  }
`;

const ModalBody = styled.div`
  padding: 0 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const TermsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const TermsTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

const TermsContent = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.7;
`;

const TermsList = styled.ol`
  padding-left: 1.25rem;
  margin-top: 0.5rem;
  list-style-type: decimal;

  > li {
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1rem;
    margin-top: 0.25rem;
    list-style: disc;
  }
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${({ theme }) => theme.colors.primary[500]};
`;

const CheckboxLabel = styled.label`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
`;

export default function LoginPage() {
  const router = useRouter();
  const { login, updateSignupData } = useAuthStore();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [pendingProvider, setPendingProvider] = useState<'kakao' | 'google' | null>(null);

  const handleSocialLogin = (provider: 'kakao' | 'google') => {
    setPendingProvider(provider);
    setShowTermsModal(true);
  };

  const handleCloseModal = () => {
    setShowTermsModal(false);
    setTermsAgreed(false);
  };

  const handleAgreeAndContinue = () => {
    if (!termsAgreed || !pendingProvider) return;

    const mockEmail = pendingProvider === 'kakao' ? 'user@kakao.com' : 'user@gmail.com';
    login(pendingProvider, mockEmail);
    updateSignupData({ termsAgreed: true });
    setShowTermsModal(false);
    router.push('/signup/preferences');
  };

  return (
    <PageWrapper>
      <Container>
        <LeftPanel>
          <Logo>Pickley</Logo>
          <JarImage>
            <Image src="/pickly-jar.png" alt="Pickly Jar" width={174} height={280} priority />
          </JarImage>
        </LeftPanel>

        <RightPanel>
          <LoginContent>
            <Title>로그인 및 회원가입</Title>

            <ButtonGroup>
              <Button
                variant="kakao"
                size="lg"
                fullWidth
                leftIcon={
                  <KakaoIcon>
                    <Image src="/kakao-logo.png" alt="Kakao" width={18} height={18} />
                  </KakaoIcon>
                }
                onClick={() => handleSocialLogin('kakao')}
              >
                카카오로 계속하기
              </Button>

              <Button
                variant="google"
                size="lg"
                fullWidth
                leftIcon={
                  <GoogleIcon>
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path
                        fill="#4285F4"
                        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                      />
                      <path
                        fill="#34A853"
                        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z"
                      />
                      <path
                        fill="#EA4335"
                        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                      />
                    </svg>
                  </GoogleIcon>
                }
                onClick={() => handleSocialLogin('google')}
              >
                Google로 계속하기
              </Button>
            </ButtonGroup>
          </LoginContent>
        </RightPanel>
      </Container>

      {/* 개인정보 약관 동의 모달 */}
      <ModalOverlay $isOpen={showTermsModal} onClick={handleCloseModal}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>개인정보 약관에 동의해주세요</ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          <ModalBody>
            <TermsSection>
              <TermsTitle>개인정보 수집·이용 동의</TermsTitle>
              <TermsContent>
                회사는 서비스 제공을 위하여 아래와 같이 개인정보를 수집·이용합니다. 이용자는 개인정보 수집·이용에 대한
                동의를 거부할 권리가 있으나, 동의를 거부할 경우 일부 서비스 이용이 제한될 수 있습니다.
                <TermsList>
                  <ol>
                    <li>
                      수집하는 개인정보 항목
                      <ul>
                        <li>필수항목: 이메일 주소, 비밀번호, 닉네임</li>
                        <li>선택항목: 프로필 이미지, 관심 정보, 서비스 이용 기록</li>
                      </ul>
                    </li>
                    <li>
                      개인정보 수집·이용 목적
                      <ul>
                        <li>회원 가입 및 본인 확인</li>
                        <li>서비스 제공 및 운영</li>
                        <li>이용자 맞춤형 콘텐츠 및 추천 제공</li>
                        <li>서비스 이용 통계 및 품질 개선</li>
                        <li>고객 문의 및 민원 처리</li>
                      </ul>
                    </li>
                    <li>
                      개인정보 보유 및 이용 기간
                      <ul>
                        <li>회원 탈퇴 시까지</li>
                        <li>단, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관 후 파기</li>
                      </ul>
                    </li>
                    <li>
                      개인정보의 파기 절차 및 방법
                      <ul>
                        <li>수집 및 이용 목적 달성 후 지체 없이 파기</li>
                        <li>전자적 파일 형태의 정보는 복구 불가능한 방법으로 삭제</li>
                      </ul>
                    </li>
                    <li>
                      동의 거부 권리 및 불이익 안내
                      <ul>
                        <li>
                          이용자는 개인정보 수집·이용에 대한 동의를 거부할 수 있으며, 다만 필수 항목에 대한 동의 거부 시
                          회원 가입 및 서비스 이용이 제한될 수 있습니다.
                        </li>
                      </ul>
                    </li>
                  </ol>
                </TermsList>
              </TermsContent>
            </TermsSection>
          </ModalBody>

          <ModalFooter>
            <Checkbox
              type="checkbox"
              id="terms-agree"
              checked={termsAgreed}
              onChange={e => setTermsAgreed(e.target.checked)}
            />
            <CheckboxLabel htmlFor="terms-agree" onClick={() => setTermsAgreed(!termsAgreed)}>
              동의하기
            </CheckboxLabel>
          </ModalFooter>

          <div style={{ padding: '0 1.5rem 1.5rem' }}>
            <Button fullWidth disabled={!termsAgreed} onClick={handleAgreeAndContinue}>
              계속하기
            </Button>
          </div>
        </Modal>
      </ModalOverlay>
    </PageWrapper>
  );
}
