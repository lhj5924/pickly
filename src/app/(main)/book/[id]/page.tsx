'use client';

import styled from 'styled-components';
import { Button } from '@/components/common';
import { ChevronDown, ArrowRight, Eye, Heart, Check, Pencil, X } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useBook, useExternalBook } from '@/api/useBook';
import { useBookReviews } from '@/api/useReview';
import { useMyLibraries, useUpdateLibraryStatus, useAddToLibrary } from '@/api/useLibrary';
import { useGenres } from '@/api/useGenre';
import { useUpdateBookGenres } from '@/api/useAdmin';
import { useAuthStore } from '@/stores/authStore';
import type { BookStatus } from '@/types/book';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const BookHeader = styled.section`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
  }
`;

const BookCover = styled.div`
  width: 160px;
  height: 230px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.375rem;
  line-height: 1.4;
`;

const BookSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
`;

const BookMeta = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 1rem;
`;

const CategoryLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 0.375rem;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const Tag = styled.span`
  padding: 0.375rem 0.75rem;
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 0.375rem;
  font-size: 0.8125rem;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const StatusButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ $active, $color, theme }) => ($active ? $color : theme.colors.text.secondary)};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ $color }) => $color};
  }
`;

// Review Section
const Section = styled.section`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const ReviewEmpty = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ReviewEmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const ReviewEmptySubtext = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const ReviewContent = styled.div`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.8;
  white-space: pre-wrap;
`;

const ReviewHashtags = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 1rem;
`;

// Description Section
const DescriptionContent = styled.div<{ $expanded: boolean }>`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.8;
  white-space: pre-wrap;
  max-height: ${({ $expanded }) => ($expanded ? 'none' : '200px')};
  overflow: hidden;
  position: relative;

  ${({ $expanded, theme }) =>
    !$expanded &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(transparent, white);
    }
  `}
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const AuthorName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

// Similar Books
const SimilarBooksGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

// Admin Genre Edit
const AdminEditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.375rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const AdminBadge = styled.span`
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  background: #7c3aed;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  letter-spacing: 0.05em;
`;

const GenreEditSection = styled.div`
  margin-top: 0.75rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  border: 1px solid ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.5rem;
`;

const GenreEditTitle = styled.p`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GenreCheckList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const GenreCheckItem = styled.label<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  cursor: pointer;
  border: 1px solid ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[400] : theme.colors.neutral[200]};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[50] : 'white'};
  color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[700] : theme.colors.text.secondary};
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }

  input {
    display: none;
  }
`;

const GenreEditActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const SmallButton = styled.button<{ $variant?: 'primary' | 'ghost' }>`
  padding: 0.375rem 0.875rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: all 0.15s ease;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background: ${theme.colors.primary[600]};
    color: white;
    &:hover { background: ${theme.colors.primary[700]}; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  `
      : `
    background: white;
    color: ${theme.colors.text.secondary};
    border: 1px solid ${theme.colors.neutral[200]};
    &:hover { background: ${theme.colors.neutral[50]}; }
  `}
`;

function BookDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const isExternal = id === 'external';

  const externalId = searchParams.get('externalId') ?? undefined;
  const source = searchParams.get('source') ?? undefined;

  const { data: uuidBook, isLoading: uuidLoading, isError: uuidError } = useBook(isExternal ? undefined : id);
  const { data: extBook, isLoading: extLoading, isError: extError } = useExternalBook(
    isExternal ? externalId : undefined,
    isExternal ? source : undefined,
  );

  const book = isExternal ? extBook : uuidBook;
  const isLoading = isExternal ? extLoading : uuidLoading;
  const isError = isExternal ? extError : uuidError;

  const { data: reviewsPage } = useBookReviews(book?.uuid, { page: 0, size: 1 });
  const myReview = reviewsPage?.content?.[0] ?? null;
  const [descExpanded, setDescExpanded] = useState(false);
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const { data: allLibraries = [] } = useMyLibraries();
  const { mutate: updateStatus } = useUpdateLibraryStatus();
  const { mutate: addBook } = useAddToLibrary();

  const userRole = useAuthStore(state => state.user?.role);
  const isAdmin = userRole === 'ADMIN';
  const { data: allGenres = [] } = useGenres();
  const { mutate: updateGenres, isPending: isUpdatingGenres } = useUpdateBookGenres();
  const [genreEditOpen, setGenreEditOpen] = useState(false);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);

  const libraryItem = book?.uuid ? allLibraries.find(item => item.book.uuid === book.uuid) : undefined;

  const STATUS_TO_API: Record<string, BookStatus> = {
    wishlist: 'WANT_TO_READ',
    reading: 'READING',
    completed: 'COMPLETED',
  };

  const API_TO_LABEL: Record<BookStatus, string> = {
    WANT_TO_READ: 'wishlist',
    READING: 'reading',
    COMPLETED: 'completed',
    DROPPED: 'dropped',
  };

  const currentStatus = libraryItem ? API_TO_LABEL[libraryItem.status] : null;

  const handleStatusClick = (status: string) => {
    const apiStatus = STATUS_TO_API[status];
    if (libraryItem) {
      updateStatus({ uuid: libraryItem.uuid, body: { status: apiStatus } });
    } else if (book) {
      addBook({ externalId: book.externalId, source: book.source, status: apiStatus });
    }
  };

  const openGenreEdit = () => {
    setSelectedGenreIds(book?.genres.map(g => g.id) ?? []);
    setGenreEditOpen(true);
  };

  const toggleGenre = (id: number) => {
    setSelectedGenreIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );
  };

  const handleSaveGenres = () => {
    if (!book?.uuid) return;
    updateGenres(
      { bookUuid: book.uuid, body: { genreIds: selectedGenreIds } },
      { onSuccess: () => setGenreEditOpen(false) },
    );
  };

  if (isLoading) {
    return (
      <Container>
        <p style={{ textAlign: 'center', padding: '4rem 0' }}>책 정보를 불러오는 중…</p>
      </Container>
    );
  }

  if (isError || !book) {
    return (
      <Container>
        <p style={{ textAlign: 'center', padding: '4rem 0' }}>책 정보를 불러오지 못했습니다.</p>
      </Container>
    );
  }

  const authorText = book.authors.join(', ');

  return (
    <Container>
      <BookHeader>
        <BookCover>
          <img src={book.thumbnailUrl} alt={book.title} />
        </BookCover>
        <BookInfo>
          <BookTitle>{book.title}</BookTitle>
          {book.subtitle && <BookSubtitle>{book.subtitle}</BookSubtitle>}
          <BookMeta>
            저자 : {authorText} | 출판사 : {book.publisher} | 발행일 : {book.publishedDate}
          </BookMeta>
          <CategoryLabel style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            카테고리
            {isAdmin && !genreEditOpen && (
              <AdminEditButton onClick={openGenreEdit}>
                <Pencil size={11} />
                장르 수정
                <AdminBadge>ADMIN</AdminBadge>
              </AdminEditButton>
            )}
          </CategoryLabel>
          <TagList>
            {book.genres.map(genre => (
              <Tag key={genre.code}>{genre.name}</Tag>
            ))}
          </TagList>
          {isAdmin && genreEditOpen && (
            <GenreEditSection>
              <GenreEditTitle>
                장르 선택
                <button onClick={() => setGenreEditOpen(false)} style={{ background: 'none', cursor: 'pointer' }}>
                  <X size={14} />
                </button>
              </GenreEditTitle>
              <GenreCheckList>
                {allGenres.map(genre => (
                  <GenreCheckItem key={genre.id} $selected={selectedGenreIds.includes(genre.id)}>
                    <input
                      type="checkbox"
                      checked={selectedGenreIds.includes(genre.id)}
                      onChange={() => toggleGenre(genre.id)}
                    />
                    {genre.name}
                  </GenreCheckItem>
                ))}
              </GenreCheckList>
              <GenreEditActions>
                <SmallButton $variant="ghost" onClick={() => setGenreEditOpen(false)}>
                  취소
                </SmallButton>
                <SmallButton
                  $variant="primary"
                  onClick={handleSaveGenres}
                  disabled={isUpdatingGenres}
                >
                  {isUpdatingGenres ? '저장 중…' : '저장'}
                </SmallButton>
              </GenreEditActions>
            </GenreEditSection>
          )}
          <StatusButtons>
            <StatusButton $active={currentStatus === 'wishlist'} $color="#ef4444" onClick={() => handleStatusClick('wishlist')}>
              <Heart size={18} fill={currentStatus === 'wishlist' ? 'currentColor' : 'none'} />
              보고싶어요
            </StatusButton>
            <StatusButton $active={currentStatus === 'reading'} $color="#3b82f6" onClick={() => handleStatusClick('reading')}>
              <Eye size={18} />
              읽는 중
            </StatusButton>
            <StatusButton $active={currentStatus === 'completed'} $color="#22c55e" onClick={() => handleStatusClick('completed')}>
              <Check size={18} />
              독서완료
            </StatusButton>
          </StatusButtons>
        </BookInfo>
      </BookHeader>

      {/* My Review */}
      <Section>
        <SectionTitle>나의 리뷰</SectionTitle>
        {myReview ? (
          <ReviewContent>{myReview.content}</ReviewContent>
        ) : (
          <ReviewEmpty>
            <ReviewEmptyText>아직 작성한 리뷰가 없어요.</ReviewEmptyText>
            <ReviewEmptySubtext>이 책을 읽으셨다면 리뷰를 작성해볼까요?</ReviewEmptySubtext>
            <Button as={Link} href={`/review/write?bookUuid=${book.uuid}`} rightIcon={<ArrowRight size={18} />}>
              이 책 리뷰 쓰러 가기
            </Button>
          </ReviewEmpty>
        )}
      </Section>

      {/* Book Description */}
      <Section>
        <SectionTitle>책 소개</SectionTitle>
        <DescriptionContent $expanded={descExpanded}>{book.description}</DescriptionContent>
        <ExpandButton onClick={() => setDescExpanded(!descExpanded)}>
          {descExpanded ? '접기' : '펼쳐 보기'}
          <ChevronDown size={16} style={{ transform: descExpanded ? 'rotate(180deg)' : 'none' }} />
        </ExpandButton>
      </Section>

      {/* Author Description */}
      <Section>
        <SectionTitle>저자 소개</SectionTitle>
        <AuthorName>{authorText}</AuthorName>
        <DescriptionContent $expanded={authorExpanded}>
          저자 소개 정보가 아직 없습니다.
        </DescriptionContent>
        <ExpandButton onClick={() => setAuthorExpanded(!authorExpanded)}>
          {authorExpanded ? '접기' : '펼쳐 보기'}
          <ChevronDown size={16} style={{ transform: authorExpanded ? 'rotate(180deg)' : 'none' }} />
        </ExpandButton>
      </Section>
    </Container>
  );
}

export default function BookDetailPage() {
  return (
    <Suspense
      fallback={
        <Container>
          <p style={{ textAlign: 'center', padding: '4rem 0' }}>책 정보를 불러오는 중…</p>
        </Container>
      }
    >
      <BookDetailContent />
    </Suspense>
  );
}
