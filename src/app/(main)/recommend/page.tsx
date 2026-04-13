'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { BookCard } from '@/components/common';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Book } from '@/types';
import {
  similarBooks as similarBooksData,
  genreRecommendBooks as genreBooksData,
  aiRecommendations,
  popularBooks as popularBooksData,
  hiddenTasteBooks as hiddenBooksData,
} from '@/data/mockData';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.quaternary};
`;

const SeeMoreLink = styled.button`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;

    &:hover {
      color: ${({ theme }) => theme.colors.neutral[300]};
    }
  }
`;

const SimilarBooksLayout = styled.div`
  display: flex;
  gap: 3rem;
  align-items: stretch;
`;

const FeaturedBookColumn = styled.div`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;

  & > div:first-child {
    width: 100%;
  }
`;

const FeaturedTextWrapper = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const FeaturedTitle = styled.p`
  font-family: 'Pretendard Variable';
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeaturedSubtitle = styled.p`
  font-family: 'Pretendard Variable';
  font-weight: 400;
  font-size: 16px;
  line-height: 160%;
  letter-spacing: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SmallBooksColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`;

const SmallBooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
`;

const SmallBookItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SmallBookTextWrapper = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SmallBookTitle = styled.p`
  font-family: 'Pretendard Variable';
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const NavButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  box-shadow: 0px 4.44px 31.06px 0px #b8b8b840;

  &:disabled {
    color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;

const VerticalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const VerticalBookCard = styled.div`
  text-align: center;
  box-sizing: border-box;
  background: #ffffff;
  border: 2px solid #ffffff;
  box-shadow: 0px 10px 44px rgba(194, 194, 194, 0.25);
  border-radius: 20px;
  padding: 32px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const PopularCoverWrapper = styled.div`
  width: 100%;
  margin: 0 auto 1rem;

  & > div:first-child {
    width: 100%;
  }
`;

const VerticalBookCoverWrapper = styled.div`
  width: 100%;
  max-width: 180px;
  margin: 0 auto 1rem;
`;

const VerticalBookTitle = styled.p`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const VerticalBookSubTitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: Pretendard Variable;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VerticalBookAuthor = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.sextary};
  margin-top: 0.5rem;
`;

// AI 추천 섹션
const AIRecommendTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const AIBookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  & > div {
    width: 100%;
  }
`;

// 인기 책 섹션
const PopularSection = styled.section`
  margin-bottom: 3rem;
`;

const PopularGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 숨겨진 취향 탐색
const HiddenSection = styled.section`
  margin-bottom: 3rem;
`;

const HiddenGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const HiddenCard = styled.div`
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
`;

const HiddenBookCover = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const HiddenQuote = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
`;

const HiddenQuoteText = styled.p`
  font-size: 0.875rem;
  line-height: 1.6;
`;

// Data from centralized mock data (replace with API calls later)
const similarBooks = similarBooksData;
const genreBooks = genreBooksData;
const aiBooks = aiRecommendations;
const popularBooks = popularBooksData;
const hiddenBooks = hiddenBooksData;

const SIMILAR_BOOKS_PAGE_SIZE = 5;
const GENRE_BOOKS_PAGE_SIZE = 3;
const AI_BOOKS_PAGE_SIZE = 4;
const POPULAR_BOOKS_PAGE_SIZE = 3;
const HIDDEN_BOOKS_PAGE_SIZE = 2;

const useShowMore = <T,>(items: T[], pageSize: number) => {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const canExpand = items.length > pageSize;
  const isFullyExpanded = canExpand && visibleCount >= items.length;
  return {
    items: items.slice(0, visibleCount),
    label: isFullyExpanded ? '접기' : '더보기',
    isDisabled: !canExpand,
    toggle: () => {
      if (!canExpand) return;
      setVisibleCount(count => (count >= items.length ? pageSize : count + pageSize));
    },
  };
};

const getKoreanObjectParticle = (word: string, withJongseong: string, withoutJongseong: string) => {
  const lastChar = word.trim().slice(-1);
  const code = lastChar.charCodeAt(0);
  const isHangulSyllable = code >= 0xac00 && code <= 0xd7a3;
  if (!isHangulSyllable) return withoutJongseong;
  return (code - 0xac00) % 28 !== 0 ? withJongseong : withoutJongseong;
};

export default function RecommendPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const nickname = user?.nickname?.split('_')[0] || '빨리';

  const [similarBooksPage, setSimilarBooksPage] = useState(0);
  const similarBooksMaxPage = Math.max(0, Math.ceil(similarBooks.length / SIMILAR_BOOKS_PAGE_SIZE) - 1);
  const canGoPrevSimilarBooks = similarBooksPage > 0;
  const canGoNextSimilarBooks = similarBooksPage < similarBooksMaxPage;
  const visibleSimilarBooks = similarBooks.slice(
    similarBooksPage * SIMILAR_BOOKS_PAGE_SIZE,
    (similarBooksPage + 1) * SIMILAR_BOOKS_PAGE_SIZE,
  );
  const featuredSimilarBook = visibleSimilarBooks[0];
  const visibleSmallSimilarBooks = visibleSimilarBooks.slice(1);

  const genre = useShowMore(genreBooks, GENRE_BOOKS_PAGE_SIZE);
  const ai = useShowMore(aiBooks, AI_BOOKS_PAGE_SIZE);
  const popular = useShowMore(popularBooks, POPULAR_BOOKS_PAGE_SIZE);
  const hidden = useShowMore(hiddenBooks, HIDDEN_BOOKS_PAGE_SIZE);

  return (
    <Container>
      {/* 비슷한 책 */}
      <Section>
        <SectionHeader>
          <SectionTitle>&lt;내가 없던 어느 밤에&gt; 와 비슷한 책</SectionTitle>
        </SectionHeader>
        <SimilarBooksLayout>
          {featuredSimilarBook && (
            <FeaturedBookColumn>
              <BookCard book={featuredSimilarBook} size="md" />
              <FeaturedTextWrapper>
                <FeaturedTitle>{featuredSimilarBook.title}</FeaturedTitle>
                <FeaturedSubtitle>{featuredSimilarBook.author}</FeaturedSubtitle>
              </FeaturedTextWrapper>
            </FeaturedBookColumn>
          )}
          <SmallBooksColumn>
            <SmallBooksGrid>
              {visibleSmallSimilarBooks.map(book => (
                <SmallBookItem key={book.id}>
                  <BookCard book={book} size="sm" showTitle={false} />
                  <SmallBookTextWrapper>
                    <SmallBookTitle>{book.title}</SmallBookTitle>
                  </SmallBookTextWrapper>
                </SmallBookItem>
              ))}
            </SmallBooksGrid>
            <NavButtons>
              <NavButton
                onClick={() => setSimilarBooksPage(p => Math.max(0, p - 1))}
                disabled={!canGoPrevSimilarBooks}
                aria-label="이전"
              >
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton
                onClick={() => setSimilarBooksPage(p => Math.min(similarBooksMaxPage, p + 1))}
                disabled={!canGoNextSimilarBooks}
                aria-label="다음"
              >
                <ChevronRight size={20} />
              </NavButton>
            </NavButtons>
          </SmallBooksColumn>
        </SimilarBooksLayout>
      </Section>

      {/* 장르 기반 추천 */}
      <Section>
        <SectionHeader>
          <SectionTitle>가장 최근 읽은 장르 기반 추천</SectionTitle>
          <SeeMoreLink onClick={genre.toggle} disabled={genre.isDisabled}>
            {genre.label}
          </SeeMoreLink>
        </SectionHeader>
        <VerticalGrid>
          {genre.items.map(book => (
            <VerticalBookCard key={book.id} onClick={() => router.push(`/book/${book.id}`)}>
              <VerticalBookCoverWrapper>
                <BookCard book={book as unknown as Book} size="sm" showTitle={false} />
              </VerticalBookCoverWrapper>
              <VerticalBookTitle>{book.title}</VerticalBookTitle>
              <VerticalBookSubTitle>{book.subtitle}</VerticalBookSubTitle>
              <VerticalBookAuthor>{book.author}</VerticalBookAuthor>
            </VerticalBookCard>
          ))}
        </VerticalGrid>
      </Section>

      {/* AI 추천 */}
      <Section>
        <SectionHeader>
          <SectionTitle>{nickname}님의 독서 취향 기반 AI 추천</SectionTitle>
          <SeeMoreLink
            style={{ color: '#a3a3a3' }}
            onClick={ai.toggle}
            disabled={ai.isDisabled}
          >
            {ai.label}
          </SeeMoreLink>
        </SectionHeader>
        <AIBookGrid>
          {ai.items.map(book => (
            <BookCard key={book.id} book={book} size="md" />
          ))}
        </AIBookGrid>
      </Section>

      {/* 인기 책 */}
      <PopularSection>
        <SectionHeader>
          <SectionTitle>요즘엔 이런 책이 인기있어요</SectionTitle>
          <SeeMoreLink onClick={popular.toggle} disabled={popular.isDisabled}>
            {popular.label}
          </SeeMoreLink>
        </SectionHeader>
        <PopularGrid>
          {popular.items.map(book => (
            <VerticalBookCard key={book.id} onClick={() => router.push(`/book/${book.id}`)}>
              <PopularCoverWrapper>
                <BookCard book={book as unknown as Book} size="md" />
              </PopularCoverWrapper>
              <div>
                <Image src="/icons/shootingstar.svg" alt="" width={24} height={24} />
              </div>
              {`${nickname}님이 읽은`}
              <div>
                <VerticalBookTitle as="span">&quot;{book.title}&quot;</VerticalBookTitle>
                {getKoreanObjectParticle(book.title, '과', '와')}
              </div>
              비슷한 작품이에요!
            </VerticalBookCard>
          ))}
        </PopularGrid>
      </PopularSection>

      {/* 숨겨진 취향 */}
      <HiddenSection>
        <SectionHeader>
          <SectionTitle>숨겨진 취향 탐색 - 이런 책은 어때요?</SectionTitle>
          <SeeMoreLink onClick={hidden.toggle} disabled={hidden.isDisabled}>
            {hidden.label}
          </SeeMoreLink>
        </SectionHeader>
        <HiddenGrid>
          {hidden.items.map(book => (
            <HiddenCard key={book.id}>
              <HiddenBookCover src={book.coverImage} alt="" />
              <HiddenQuote>
                <HiddenQuoteText>{book.quote}</HiddenQuoteText>
              </HiddenQuote>
            </HiddenCard>
          ))}
        </HiddenGrid>
      </HiddenSection>
    </Container>
  );
}
