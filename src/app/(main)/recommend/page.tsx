'use client';

import { useState } from 'react';
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
  padding: 56px 80px 36px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const VerticalBookCoverWrapper = styled.div`
  width: 100%;
  max-width: 180px;
  margin: 0 auto 1rem;
`;

const VerticalBookTitle = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
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
  const router = useRouter();
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
          <SeeMoreLink style={{ color: '#a3a3a3' }}>더보기</SeeMoreLink>
        </SectionHeader>
        <AIBookGrid>
          {aiBooks.slice(0, 4).map(book => (
            <BookCard key={book.id} book={book} size="md" />
          ))}
        </AIBookGrid>
      </Section>

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
