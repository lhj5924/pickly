'use client';

import styled from 'styled-components';
import { Button } from '@/components/common';
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
  padding: 2rem 0;
  margin-bottom: 1.5rem;
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

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral[200]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.neutral[400]};
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

const GenreTag = styled.span<{ $highlight?: boolean }>`
  padding: 0.375rem 0.75rem;
  background: ${({ theme, $highlight }) => ($highlight ? theme.colors.primary[100] : theme.colors.neutral[100])};
  color: ${({ theme, $highlight }) => ($highlight ? theme.colors.primary[600] : theme.colors.text.secondary)};
  border: 1px solid ${({ theme, $highlight }) => ($highlight ? theme.colors.primary[300] : 'transparent')};
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

// Reviews Section
const ReviewSection = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 1rem;
  padding: 2rem;
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
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const ReviewBookCover = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const ReviewBookTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  text-align: center;
`;

const ReviewContent = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
    return <Container><p style={{ textAlign: 'center', padding: '4rem 0' }}>불러오는 중...</p></Container>;
  }

  if (isError) {
    return <Container><p style={{ textAlign: 'center', padding: '4rem 0' }}>정보를 불러오지 못했습니다.</p></Container>;
  }

  return (
    <Container>
      <ProfileCard>
        <ProfileHeader>
          <Avatar>👤</Avatar>
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
              {selectedCategories.slice(0, 3).map((cat, index) => (
                <GenreTag key={cat.id} $highlight={index === 1}>
                  {cat.name}
                </GenreTag>
              ))}
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
            <ReviewCard key={review.id}>
              <ReviewBookCover src={review.book.coverImage} alt={review.book.title} />
              <ReviewBookTitle>{review.book.title}</ReviewBookTitle>
              <ReviewContent>{review.content}</ReviewContent>
            </ReviewCard>
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
