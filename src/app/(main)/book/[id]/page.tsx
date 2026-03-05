'use client';

import styled from 'styled-components';
import { BookCard, Button } from '@/components/common';
import { Eye, Heart, Check, ChevronDown, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { BookStatus, Book } from '@/types';
import Link from 'next/link';
import { useBookStore } from '@/stores';
import {
  bookDetailData,
  authorDescription as authorDesc,
  similarBooks as similarBooksData,
} from '@/data/mockData';

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

// Data from centralized mock data (replace with API calls later)
const mockBook = bookDetailData;
const authorDescription = authorDesc;
const similarBooks = similarBooksData;

// Mock review (set to null to show empty state)
const mockReview: { hashtags: string; content: string } | null = null;
// const mockReview = {
//   hashtags: '#우리는모두천문학자로태어난다 #사시오매미가 #지갈해',
//   content: `* 이 책은 카시오매아어원셔 로부터 제공한할이에서 죽절 있고 저성한 주관적 서럼합니다.
// 도쁘에 관심 륭을 뭐야 프로오스나 프르오스나 뱌에 삶아이 나지 않는 나책,
// 아 책하길큐 유해 관싱이 따는 제솜 않는 거어도 출중핸상화하곰 좋응 수 있은 원화 도왜준다고 자니다하게 푸점할 수 있다.
// 저가는 구독사 26(만)명의 시작합 '우주접나의 인사렵이인'서 강은 유무류와 잘시에 천문학에 대한 이야기를 정업이며 내중들이 나누고 있는 현문학자 이어지도 하다.
// 현재는 서울대하곤 자연천성학반의 조교수로 일하고 있다.
// 지시은 "남마마다 우주 한 조각" "알 수 없지만 알 수 있는" "고책을냄배다시리즈" 가 있다.`,
// };

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateBookStatus } = useBookStore();
  const [status, setStatus] = useState<BookStatus>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const handleStatusClick = (newStatus: BookStatus) => {
    const finalStatus = status === newStatus ? null : newStatus;
    setStatus(finalStatus);
    updateBookStatus(mockBook.id, finalStatus);
  };

  return (
    <Container>
      <BookHeader>
        <BookCover>
          <img src={mockBook.coverImage} alt={mockBook.title} />
        </BookCover>
        <BookInfo>
          <BookTitle>{mockBook.title}</BookTitle>
          <BookSubtitle>별과 우주에 관한 가장 인간적인 이야기</BookSubtitle>
          <BookMeta>
            저자 : {mockBook.author} | 출판사 : {mockBook.publisher} | 발행일 : {mockBook.publishDate}
          </BookMeta>
          <CategoryLabel>카테고리</CategoryLabel>
          <TagList>
            {mockBook.categories.map(cat => (
              <Tag key={cat.id}>{cat.name}</Tag>
            ))}
          </TagList>
          <StatusButtons>
            <StatusButton $active={status === 'reading'} $color="#3b82f6" onClick={() => handleStatusClick('reading')}>
              <Eye size={18} fill={status === 'reading' ? 'currentColor' : 'none'} />
              읽는 중
            </StatusButton>
            <StatusButton
              $active={status === 'wishlist'}
              $color="#ef4444"
              onClick={() => handleStatusClick('wishlist')}
            >
              <Heart size={18} fill={status === 'wishlist' ? 'currentColor' : 'none'} />
              보고싶어요
            </StatusButton>
            <StatusButton
              $active={status === 'completed'}
              $color="#22c55e"
              onClick={() => handleStatusClick('completed')}
            >
              <Check size={18} />
              독서 완료
            </StatusButton>
          </StatusButtons>
        </BookInfo>
      </BookHeader>

      {/* My Review */}
      <Section>
        <SectionTitle>나의 리뷰</SectionTitle>
        {mockReview ? (
          <>
            <ReviewHashtags>{mockReview.hashtags}</ReviewHashtags>
            <ReviewContent>{mockReview.content}</ReviewContent>
          </>
        ) : (
          <ReviewEmpty>
            <ReviewEmptyText>아직 작성한 리뷰가 없어요.</ReviewEmptyText>
            <ReviewEmptySubtext>이 책을 읽으셨다면 리뷰를 작성해볼까요?</ReviewEmptySubtext>
            <Button as={Link} href={`/review/write?bookId=${mockBook.id}`} rightIcon={<ArrowRight size={18} />}>
              이 책 리뷰 쓰러 가기
            </Button>
          </ReviewEmpty>
        )}
      </Section>

      {/* Book Description */}
      <Section>
        <SectionTitle>책 소개</SectionTitle>
        <DescriptionContent $expanded={descExpanded}>{mockBook.description}</DescriptionContent>
        <ExpandButton onClick={() => setDescExpanded(!descExpanded)}>
          {descExpanded ? '접기' : '펼쳐 보기'}
          <ChevronDown size={16} style={{ transform: descExpanded ? 'rotate(180deg)' : 'none' }} />
        </ExpandButton>
      </Section>

      {/* Author Description */}
      <Section>
        <SectionTitle>저자 소개</SectionTitle>
        <AuthorName>{mockBook.author}</AuthorName>
        <DescriptionContent $expanded={authorExpanded}>{authorDescription}</DescriptionContent>
        <ExpandButton onClick={() => setAuthorExpanded(!authorExpanded)}>
          {authorExpanded ? '접기' : '펼쳐 보기'}
          <ChevronDown size={16} style={{ transform: authorExpanded ? 'rotate(180deg)' : 'none' }} />
        </ExpandButton>
      </Section>

      {/* Similar Books */}
      <Section>
        <SectionTitle>이 책과 비슷한 책</SectionTitle>
        <SimilarBooksGrid>
          {similarBooks.map(book => (
            <BookCard key={book.id} book={book} size="sm" />
          ))}
        </SimilarBooksGrid>
      </Section>
    </Container>
  );
}
