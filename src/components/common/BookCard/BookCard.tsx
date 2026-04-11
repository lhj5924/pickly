'use client';

import styled from 'styled-components';
import { Book, BookStatus } from '@/types';
import { Eye, Heart, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useBookStore } from '@/stores';
import { useState } from 'react';
import Image from 'next/image';

interface BookCardProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
  showProgress?: boolean;
}

// SM size card wrapper - vertical layout with white info section
const SmCardWrapper = styled.div`
  width: 100%;
  aspect-ratio: 2 / 3;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
`;

const SmCoverWrapper = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  &:hover .status-overlay {
    opacity: 1;
  }
`;

const SmCoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SmInfoSection = styled.div`
  padding: 1.25rem 1.25rem;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const SmBookInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SmBookTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SmProgressText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 1rem;
  flex-shrink: 0;
`;

const SmStatusOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0000004d;
  box-shadow: 10px 10px 34px 0px #54545440;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const SmStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.375rem 0;

  &:hover {
    opacity: 0.8;
  }
`;

const SmStatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const SmStatusLabel = styled.span`
  color: white;
`;

// MD size card wrapper - cover only with hover overlay
const MdCardWrapper = styled.div`
  width: 280px;
  cursor: pointer;
`;

const MdCoverWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 5px 12px 44px rgba(150, 150, 150, 0.25);

  &:hover .status-overlay {
    opacity: 1;
  }
`;

const MdCoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MdStatusOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #0000004d;
  box-shadow: 10px 10px 34px 0px #54545440;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const MdStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;

  &:hover {
    opacity: 0.8;
  }
`;

const MdStatusIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const MdStatusLabel = styled.span`
  color: white;
`;

// Default/LG card styles (kept for backward compatibility)
const CardWrapper = styled.div<{ $size: string }>`
  width: ${({ $size }) => ($size === 'lg' ? '320px' : '280px')};
  cursor: pointer;
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};

  &:hover .status-overlay {
    opacity: 1;
  }
`;

const CoverImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StatusOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  opacity: 0;
  transition: opacity 0.2s ease;
`;

const StatusButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $active, $color }) => ($active ? $color : 'rgba(255, 255, 255, 0.9)')};
  color: ${({ $active, $color }) => ($active ? 'white' : '#666')};
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${({ $color }) => $color};
    color: white;
  }
`;

const BookTitle = styled.p`
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const BookAuthor = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.375rem;
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 4px;
  background: ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 2px;
  overflow: hidden;
  margin-right: 0.5rem;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ theme }) => theme.colors.primary[500]};
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

interface StatusState {
  reading: boolean;
  wishlist: boolean;
  completed: boolean;
}

export const BookCard = ({ book, size = 'md', showTitle = true, showProgress = false }: BookCardProps) => {
  const router = useRouter();
  const { updateBookStatus } = useBookStore();
  const [statusState, setStatusState] = useState<StatusState>({
    reading: book.status === 'reading',
    wishlist: book.status === 'wishlist',
    completed: book.status === 'completed',
  });

  const handleStatusClick = (e: React.MouseEvent, status: 'reading' | 'wishlist' | 'completed') => {
    e.stopPropagation();
    setStatusState(prev => ({
      ...prev,
      [status]: !prev[status],
    }));
    // For store compatibility, we still call updateBookStatus
    updateBookStatus(book.id, statusState[status] ? null : status);
  };

  const handleCardClick = () => {
    router.push(`/book/${book.id}`);
  };

  const handleTitleClick = () => {
    router.push(`/book/${book.id}`);
  };

  // SM size layout - vertical card with white info section
  if (size === 'sm') {
    return (
      <SmCardWrapper onClick={handleCardClick}>
        <SmCoverWrapper>
          <SmCoverImage src={book.coverImage} alt={book.title} />
          <SmStatusOverlay className="status-overlay">
            <SmStatusRow onClick={e => handleStatusClick(e, 'reading')}>
              <SmStatusLabel>읽는 중</SmStatusLabel>
              <SmStatusIcon>
                <Image
                  src={statusState.reading ? '/icons/reading-color.png' : '/icons/reading-white.png'}
                  alt="읽는 중"
                  width={20}
                  height={20}
                />
              </SmStatusIcon>
            </SmStatusRow>
            <SmStatusRow onClick={e => handleStatusClick(e, 'wishlist')}>
              <SmStatusLabel>보고 싶어요</SmStatusLabel>
              <SmStatusIcon>
                <Image
                  src={statusState.wishlist ? '/icons/heart-color.png' : '/icons/heart-white.png'}
                  alt="보고 싶어요"
                  width={20}
                  height={20}
                />
              </SmStatusIcon>
            </SmStatusRow>
            <SmStatusRow onClick={e => handleStatusClick(e, 'completed')}>
              <SmStatusLabel>독서 완료</SmStatusLabel>
              <SmStatusIcon>
                <Image
                  src={statusState.completed ? '/icons/complete-color.png' : '/icons/complete-white.png'}
                  alt="독서 완료"
                  width={20}
                  height={20}
                />
              </SmStatusIcon>
            </SmStatusRow>
          </SmStatusOverlay>
        </SmCoverWrapper>
        <SmInfoSection>
          <SmBookInfo>
            <SmBookTitle>{book.title}</SmBookTitle>
          </SmBookInfo>
          {showProgress && book.progress !== undefined && <SmProgressText>{book.progress}%</SmProgressText>}
        </SmInfoSection>
      </SmCardWrapper>
    );
  }

  // MD size layout - cover only with hover overlay for status
  if (size === 'md') {
    return (
      <MdCardWrapper>
        <MdCoverWrapper onClick={handleCardClick}>
          <MdCoverImage src={book.coverImage} alt={book.title} />
          <MdStatusOverlay className="status-overlay">
            <MdStatusRow onClick={e => handleStatusClick(e, 'reading')}>
              <MdStatusLabel>읽는 중</MdStatusLabel>
              <MdStatusIcon>
                <Image
                  src={statusState.reading ? '/icons/reading-color.png' : '/icons/reading-white.png'}
                  alt="읽는 중"
                  width={24}
                  height={24}
                />
              </MdStatusIcon>
            </MdStatusRow>
            <MdStatusRow onClick={e => handleStatusClick(e, 'wishlist')}>
              <MdStatusLabel>보고 싶어요</MdStatusLabel>
              <MdStatusIcon>
                <Image
                  src={statusState.wishlist ? '/icons/heart-color.png' : '/icons/heart-white.png'}
                  alt="보고 싶어요"
                  width={24}
                  height={24}
                />
              </MdStatusIcon>
            </MdStatusRow>
            <MdStatusRow onClick={e => handleStatusClick(e, 'completed')}>
              <MdStatusLabel>독서 완료</MdStatusLabel>
              <MdStatusIcon>
                <Image
                  src={statusState.completed ? '/icons/complete-color.png' : '/icons/complete-white.png'}
                  alt="독서 완료"
                  width={24}
                  height={24}
                />
              </MdStatusIcon>
            </MdStatusRow>
          </MdStatusOverlay>
        </MdCoverWrapper>
      </MdCardWrapper>
    );
  }

  // LG size layout - original layout
  return (
    <CardWrapper $size={size}>
      <CoverWrapper onClick={handleCardClick}>
        <CoverImage src={book.coverImage} alt={book.title} />
        <StatusOverlay className="status-overlay">
          <StatusButton
            $active={statusState.reading}
            $color="#3b82f6"
            onClick={e => handleStatusClick(e, 'reading')}
            title="읽는 중"
          >
            <Eye size={16} />
          </StatusButton>
          <StatusButton
            $active={statusState.wishlist}
            $color="#ef4444"
            onClick={e => handleStatusClick(e, 'wishlist')}
            title="보고싶어요"
          >
            <Heart size={16} fill={statusState.wishlist ? 'currentColor' : 'none'} />
          </StatusButton>
          <StatusButton
            $active={statusState.completed}
            $color="#22c55e"
            onClick={e => handleStatusClick(e, 'completed')}
            title="독서 완료"
          >
            <Check size={16} />
          </StatusButton>
        </StatusOverlay>
      </CoverWrapper>

      {showTitle && (
        <div onClick={handleTitleClick}>
          <BookTitle>{book.title}</BookTitle>
          <BookAuthor>{book.author}</BookAuthor>
        </div>
      )}

      {showProgress && book.progress !== undefined && (
        <ProgressWrapper>
          <ProgressBar>
            <ProgressFill $progress={book.progress} />
          </ProgressBar>
          <ProgressText>{book.progress}%</ProgressText>
        </ProgressWrapper>
      )}
    </CardWrapper>
  );
};
