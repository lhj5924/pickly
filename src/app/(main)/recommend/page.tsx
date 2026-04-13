'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { BookCard } from '@/components/common';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores';
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
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SeeMoreLink = styled.button`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
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
`;

const VerticalBookCover = styled.img`
  width: 100%;
  max-width: 180px;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 1rem;
`;

const VerticalBookTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const VerticalBookMeta = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// AI 추천 섹션
const AIRecommendSection = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 3rem;
`;

const AIRecommendTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
`;

const AIBookGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
`;

const AIBookCard = styled.div`
  flex-shrink: 0;
  width: 160px;
`;

const AIBookCover = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
  border-radius: 0.5rem;
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

const PopularCard = styled.div`
  text-align: center;
`;

const PopularBookCover = styled.img`
  width: 160px;
  height: 230px;
  object-fit: cover;
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 1rem;
`;

const PopularLabel = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const PopularBookTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const PopularBookSubtitle = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
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

// Footer
const Footer = styled.footer`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const FooterLogo = styled.p`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: 'Titan One', 'Georgia', serif;
  margin-bottom: 0.75rem;
`;

const FooterSubLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

const SocialIcon = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.625rem;
`;

// Data from centralized mock data (replace with API calls later)
const similarBooks = similarBooksData;
const genreBooks = genreBooksData;
const aiBooks = aiRecommendations;
const popularBooks = popularBooksData;
const hiddenBooks = hiddenBooksData;

const SMALL_BOOKS_PAGE_SIZE = 4;

export default function RecommendPage() {
  const { user } = useAuthStore();
  const nickname = user?.nickname?.split('_')[0] || '빨리';

  const smallBooks = similarBooks.slice(1);
  const [smallBooksPage, setSmallBooksPage] = useState(0);
  const smallBooksMaxPage = Math.max(0, Math.ceil(smallBooks.length / SMALL_BOOKS_PAGE_SIZE) - 1);
  const canGoPrevSmallBooks = smallBooksPage > 0;
  const canGoNextSmallBooks = smallBooksPage < smallBooksMaxPage;
  const visibleSmallBooks = smallBooks.slice(
    smallBooksPage * SMALL_BOOKS_PAGE_SIZE,
    (smallBooksPage + 1) * SMALL_BOOKS_PAGE_SIZE,
  );

  return (
    <Container>
      {/* 비슷한 책 */}
      <Section>
        <SectionHeader>
          <SectionTitle>&lt;내가 했던 어느 날에&gt; 와 비슷한 책</SectionTitle>
        </SectionHeader>
        <SimilarBooksLayout>
          {similarBooks.length > 0 && (
            <FeaturedBookColumn>
              <BookCard book={similarBooks[0]} size="md" />
              <FeaturedTextWrapper>
                <FeaturedTitle>{similarBooks[0].title}</FeaturedTitle>
                <FeaturedSubtitle>{similarBooks[0].author}</FeaturedSubtitle>
              </FeaturedTextWrapper>
            </FeaturedBookColumn>
          )}
          <SmallBooksColumn>
            <SmallBooksGrid>
              {visibleSmallBooks.map(book => (
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
                onClick={() => setSmallBooksPage(p => Math.max(0, p - 1))}
                disabled={!canGoPrevSmallBooks}
                aria-label="이전"
              >
                <ChevronLeft size={20} />
              </NavButton>
              <NavButton
                onClick={() => setSmallBooksPage(p => Math.min(smallBooksMaxPage, p + 1))}
                disabled={!canGoNextSmallBooks}
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
          <SeeMoreLink>더보기</SeeMoreLink>
        </SectionHeader>
        <VerticalGrid>
          {genreBooks.map(book => (
            <VerticalBookCard key={book.id}>
              <VerticalBookCover src={book.coverImage} alt={book.title} />
              <VerticalBookTitle>{book.title}</VerticalBookTitle>
              <VerticalBookMeta>{book.subtitle}</VerticalBookMeta>
            </VerticalBookCard>
          ))}
        </VerticalGrid>
      </Section>

      {/* AI 추천 */}
      <AIRecommendSection>
        <SectionHeader>
          <AIRecommendTitle>{nickname}님의 독서 취향 기반 AI 추천</AIRecommendTitle>
          <SeeMoreLink style={{ color: '#a3a3a3' }}>더보기</SeeMoreLink>
        </SectionHeader>
        <AIBookGrid>
          {aiBooks.map(book => (
            <AIBookCard key={book.id}>
              <AIBookCover src={book.coverImage} alt={book.title} />
            </AIBookCard>
          ))}
        </AIBookGrid>
      </AIRecommendSection>

      {/* 인기 책 */}
      <PopularSection>
        <SectionHeader>
          <SectionTitle>요즘엔 이런 책이 인기있어요</SectionTitle>
          <SeeMoreLink>더보기</SeeMoreLink>
        </SectionHeader>
        <PopularGrid>
          {popularBooks.map(book => (
            <PopularCard key={book.id}>
              <PopularBookCover src={book.coverImage} alt="" />
              <PopularLabel>{nickname}님이 읽은</PopularLabel>
              <PopularBookTitle>{book.title}</PopularBookTitle>
              <PopularBookSubtitle>{book.subtitle}</PopularBookSubtitle>
            </PopularCard>
          ))}
        </PopularGrid>
      </PopularSection>

      {/* 숨겨진 취향 */}
      <HiddenSection>
        <SectionHeader>
          <SectionTitle>숨겨진 취향 탐색 - 이런 책은 어때요?</SectionTitle>
          <SeeMoreLink>더보기</SeeMoreLink>
        </SectionHeader>
        <HiddenGrid>
          {hiddenBooks.map(book => (
            <HiddenCard key={book.id}>
              <HiddenBookCover src={book.coverImage} alt="" />
              <HiddenQuote>
                <HiddenQuoteText>{book.quote}</HiddenQuoteText>
              </HiddenQuote>
            </HiddenCard>
          ))}
        </HiddenGrid>
      </HiddenSection>

      <Footer>
        <FooterLogo>pickly</FooterLogo>
        <FooterSubLinks>
          <span>고객센터</span>
          <span>CONTACT US</span>
        </FooterSubLinks>
        <SocialIcons>
          <SocialIcon>Y</SocialIcon>
          <SocialIcon>@</SocialIcon>
          <SocialIcon>X</SocialIcon>
          <SocialIcon>♪</SocialIcon>
        </SocialIcons>
      </Footer>
    </Container>
  );
}
