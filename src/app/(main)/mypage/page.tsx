'use client';

import styled from 'styled-components';
import { Button, ReviewCard } from '@/components/common';
import { Pencil, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { Category, BOOK_CATEGORIES } from '@/types';
import { mockReviews as allMockReviews } from '@/data/mockData';
import { useMe, useUpdateMe, useDeleteMe } from '@/api/useMe';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

// Profile Section
const ProfileCard = styled.div`
  padding: 2rem 4rem;
  margin-bottom: 1.5rem;
  box-shadow: 0px 20px 44px 0px #dadada40;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #f7f7f7;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const NicknameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Nickname = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const NicknameInput = styled.input`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  border: none;
  border-bottom: 2px solid ${({ theme }) => theme.colors.neutral[300]};
  background: transparent;
  outline: none;
  padding: 0;

  &:focus {
    border-bottom-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const EditDoneLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 500;
`;

const EditButton = styled.button`
  padding: 0.25rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Email = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const GenreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const GENRE_COLORS: Record<number, { bg: string; text: string }> = {
  1: { bg: '#FFF0F0', text: '#D14343' }, // 소설
  2: { bg: '#FFF0F5', text: '#C93892' }, // 로맨스
  3: { bg: '#F0F0FF', text: '#5B5BD6' }, // 판타지
  4: { bg: '#E8F4FF', text: '#2B7BB9' }, // SF
  5: { bg: '#F5F0FF', text: '#7C3AED' }, // 미스터리/스릴러
  6: { bg: '#F4F0F7', text: '#6B3FA0' }, // 호러
  7: { bg: '#FFF5EB', text: '#B35C1E' }, // 역사소설
  8: { bg: '#FDF6EC', text: '#A67C2E' }, // 시/에세이
  9: { bg: '#ECFDF5', text: '#1E8A5E' }, // 자기계발
  10: { bg: '#EEF6FF', text: '#2E6DA4' }, // 경제/경영
  11: { bg: '#FFF8F0', text: '#B86E2B' }, // 인문학
  12: { bg: '#E8FFF0', text: '#1A7A42' }, // 과학
  13: { bg: '#FAF0E6', text: '#8B6914' }, // 역사
  14: { bg: '#F0F4F8', text: '#4A6785' }, // 사회
  15: { bg: '#FFF0FB', text: '#B03A8E' }, // 예술
  16: { bg: '#E6F9F5', text: '#148A6E' }, // 여행
  17: { bg: '#FFF7E6', text: '#C07A1A' }, // 요리
  18: { bg: '#EAFFF0', text: '#2D8C4E' }, // 건강
  19: { bg: '#F5F0FF', text: '#6E4AB5' }, // 종교/영성
  20: { bg: '#FFF0E8', text: '#D4602C' }, // 만화/웹툰
  21: { bg: '#F0F8FF', text: '#3B7FC4' }, // 라이트노벨
  22: { bg: '#FFF8F5', text: '#C95B3C' }, // 아동/청소년
};

const DEFAULT_GENRE_COLOR = { bg: '#F5F5F5', text: '#6B6B6B' };

const GenreTag = styled.span<{ $bg: string; $color: string }>`
  padding: 0.375rem 0.75rem;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  border-radius: 100rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

// Reviews Section
const ReviewSection = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0px 20px 44px 0px #dadada40;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SeeMoreLink = styled(Link)`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem 1.5rem;
  padding-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const WriteButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

// Footer Links
const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const FooterLink = styled.button`
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const DeleteLink = styled.button`
  color: ${({ theme }) => theme.colors.error};

  &:hover {
    text-decoration: underline;
  }
`;

// Genre Modal
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
  max-width: 500px;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const GenreGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const GenreChip = styled.button<{ $selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  border: 1.5px solid ${({ theme, $selected }) => ($selected ? theme.colors.primary[500] : theme.colors.border.default)};
  background: ${({ theme, $selected }) => ($selected ? theme.colors.primary[50] : 'white')};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.primary[600] : theme.colors.text.secondary)};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

const mockReviews = allMockReviews.slice(0, 2);

export default function MyPage() {
  const { user: localUser, updateNickname, updateFavoriteCategories, logout } = useAuthStore();
  const { data: serverUser, isLoading, isError } = useMe();
  const { mutate: updateUser } = useUpdateMe();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteMe();

  // React Query를 서버 상태의 Single Source of Truth로 사용
  // Zustand 동기화 useEffect 제거 → 불필요한 리렌더링 방지
  const displayNickname = serverUser?.nickname ?? localUser?.nickname ?? '';
  const displayEmail = serverUser?.email ?? localUser?.email ?? '';

  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nicknameValue, setNicknameValue] = useState(displayNickname);
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    localUser?.preferences.favoriteCategories || [],
  );
  const [tempCategories, setTempCategories] = useState<Category[]>([]);

  // 서버 데이터 도착 시 닉네임 input 동기화
  useEffect(() => {
    if (serverUser?.nickname) {
      setNicknameValue(serverUser.nickname);
    }
  }, [serverUser?.nickname]);

  const nicknameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingNickname && nicknameInputRef.current) {
      nicknameInputRef.current.focus();
    }
  }, [isEditingNickname]);

  const handleNicknameEdit = () => {
    setIsEditingNickname(true);
  };

  const handleNicknameSave = () => {
    const trimmed = nicknameValue.trim();
    if (!trimmed || trimmed === displayNickname) {
      setNicknameValue(displayNickname);
      setIsEditingNickname(false);
      return;
    }
    // 즉시 로컬 반영
    updateNickname(trimmed);
    setIsEditingNickname(false);
    // 서버에 반영
    updateUser({ nickname: trimmed });
  };

  const handleNicknameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNicknameSave();
    }
  };

  const handleOpenGenreModal = () => {
    setTempCategories([...selectedCategories]);
    setShowGenreModal(true);
  };

  const handleGenreToggle = (category: Category) => {
    setTempCategories(prev =>
      prev.find(c => c.id === category.id) ? prev.filter(c => c.id !== category.id) : [...prev, category],
    );
  };

  const handleGenreSave = () => {
    if (tempCategories.length < 3) return;
    setSelectedCategories(tempCategories);
    updateFavoriteCategories(tempCategories);
    setShowGenreModal(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleDeleteAccount = () => {
    if (window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      deleteUser();
    }
  };

  if (isLoading) {
    return (
      <Container>
        <p style={{ textAlign: 'center', padding: '4rem 0' }}>불러오는 중...</p>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <p style={{ textAlign: 'center', padding: '4rem 0' }}>정보를 불러오지 못했습니다.</p>
      </Container>
    );
  }

  return (
    <Container>
      <ProfileCard>
        <ProfileHeader>
          <Avatar src="/images/default-user.svg" alt="프로필" />
          <ProfileInfo>
            <NicknameRow>
              {isEditingNickname ? (
                <>
                  <NicknameInput
                    ref={nicknameInputRef}
                    value={nicknameValue}
                    onChange={e => setNicknameValue(e.target.value)}
                    onBlur={handleNicknameSave}
                    onKeyDown={handleNicknameKeyDown}
                  />
                  <EditDoneLabel>완료</EditDoneLabel>
                </>
              ) : (
                <>
                  <Nickname>{nicknameValue}</Nickname>
                  <EditButton onClick={handleNicknameEdit}>
                    <Pencil size={16} />
                  </EditButton>
                </>
              )}
            </NicknameRow>
            <Email>{displayEmail}</Email>
            <GenreRow>
              {selectedCategories.slice(0, 3).map(cat => {
                const color = GENRE_COLORS[cat.id] ?? DEFAULT_GENRE_COLOR;
                return (
                  <GenreTag key={cat.id} $bg={color.bg} $color={color.text}>
                    {cat.name}
                  </GenreTag>
                );
              })}
              <EditButton onClick={handleOpenGenreModal}>
                <Pencil size={16} />
              </EditButton>
            </GenreRow>
          </ProfileInfo>
        </ProfileHeader>
      </ProfileCard>

      <ReviewSection>
        <SectionHeader>
          <SectionTitle>내가 작성한 리뷰</SectionTitle>
          <SeeMoreLink href="/review">더보기</SeeMoreLink>
        </SectionHeader>

        <ReviewGrid>
          {mockReviews.map(review => (
            <ReviewCard
              key={review.id}
              id={review.id}
              bookTitle={review.book.title}
              bookCoverImage={review.book.coverImage}
              content={review.content}
            />
          ))}
        </ReviewGrid>

        <WriteButtonWrapper>
          <Button variant="cta" as={Link} href="/review/write" rightIcon={<ArrowRight size={24} />}>
            내가 읽은 책 리뷰 쓰러 가기
          </Button>
        </WriteButtonWrapper>
      </ReviewSection>

      <FooterLinks>
        <FooterLink onClick={handleLogout}>로그아웃</FooterLink>
        <span>|</span>
        <FooterLink>개인정보이용약관</FooterLink>
      </FooterLinks>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <DeleteLink onClick={handleDeleteAccount} disabled={isDeleting}>
          {isDeleting ? '처리 중...' : '회원탈퇴'}
        </DeleteLink>
      </div>

      {/* Genre Selection Modal */}
      <ModalOverlay $isOpen={showGenreModal} onClick={() => setShowGenreModal(false)}>
        <Modal onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>최소 3개 이상 선택해주세요</ModalTitle>
            <CloseButton onClick={() => setShowGenreModal(false)}>×</CloseButton>
          </ModalHeader>

          <GenreGrid>
            {BOOK_CATEGORIES.map(category => (
              <GenreChip
                key={category.id}
                $selected={tempCategories.some(c => c.id === category.id)}
                onClick={() => handleGenreToggle(category)}
              >
                {category.name}
              </GenreChip>
            ))}
          </GenreGrid>

          <Button fullWidth disabled={tempCategories.length < 3} onClick={handleGenreSave}>
            선택완료
          </Button>
        </Modal>
      </ModalOverlay>
    </Container>
  );
}
