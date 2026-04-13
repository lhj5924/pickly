'use client';

import styled from 'styled-components';
import { Button } from '@/components/common';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useBook } from '@/api/useBook';
import { useBookReviews } from '@/api/useReview';

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

export default function BookDetailPage() {
  const params = useParams();
  const bookUuid = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
  const { data: book, isLoading, isError } = useBook(bookUuid);
  const { data: reviewsPage } = useBookReviews(bookUuid, { page: 0, size: 1 });
  const myReview = reviewsPage?.content?.[0] ?? null;
  const [descExpanded, setDescExpanded] = useState(false);
  const [authorExpanded, setAuthorExpanded] = useState(false);

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
          <CategoryLabel>카테고리</CategoryLabel>
          <TagList>
            {book.genres.map(genre => (
              <Tag key={genre.code}>{genre.name}</Tag>
            ))}
          </TagList>
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
