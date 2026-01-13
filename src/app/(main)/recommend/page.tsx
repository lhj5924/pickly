'use client';

import styled from 'styled-components';
import { BookCard } from '@/components/common';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores';
import { Book } from '@/types';

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
  margin-bottom: 1.25rem;
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

const NavButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 2px;
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
  font-family: 'Georgia', serif;
  margin-bottom: 0.5rem;
`;

// Mock data
const similarBooks: Book[] = [
  { id: '1', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '2', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '3', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '4', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
];

const genreBooks = [
  { id: '1', title: '당연하게도 나는 너를', author: '이꽃', subtitle: '때론이 아니 적어 마음이만 한다 걸 *', coverImage: 'https://image.yes24.com/goods/119564892/XL' },
  { id: '2', title: '당연하게도 나는 너를', author: '이꽃', subtitle: '때론이 아니 적어 마음이만 한다 걸 *', coverImage: 'https://image.yes24.com/goods/119564892/XL' },
  { id: '3', title: '당연하게도 나는 너를', author: '이꽃', subtitle: '때론이 아니 적어 마음이만 한다 걸 *', coverImage: 'https://image.yes24.com/goods/119564892/XL' },
];

const aiBooks = [
  { id: '1', coverImage: 'https://image.yes24.com/goods/125698547/XL' },
  { id: '2', coverImage: 'https://image.yes24.com/goods/124857283/XL' },
  { id: '3', coverImage: 'https://image.yes24.com/goods/125698547/XL' },
  { id: '4', coverImage: 'https://image.yes24.com/goods/124857283/XL' },
];

const popularBooks = [
  { id: '1', title: '"나가 했던 어느 날에" 의', subtitle: '비슷한 작품이에요!', coverImage: 'https://image.yes24.com/goods/125698547/XL' },
  { id: '2', title: '"나가 했던 어느 날에" 의', subtitle: '비슷한 작품이에요!', coverImage: 'https://image.yes24.com/goods/125698547/XL' },
  { id: '3', title: '"나가 했던 어느 날에" 의', subtitle: '비슷한 작품이에요!', coverImage: 'https://image.yes24.com/goods/125698547/XL' },
];

const hiddenBooks = [
  { id: '1', coverImage: 'https://image.yes24.com/goods/125698547/XL', quote: '"어선원지가 내 번채 평에서 만났던 분들 세는 사업가를 가이미시닙요?"' },
  { id: '2', coverImage: 'https://image.yes24.com/goods/124857283/XL', quote: '"어선원지가 내 번채 평에서 만났던 분들 세는 사업가를 가이미시닙요?"' },
];

export default function RecommendPage() {
  const { user } = useAuthStore();
  const nickname = user?.nickname?.split('_')[0] || '빨리';

  return (
    <Container>
      {/* 비슷한 책 */}
      <Section>
        <SectionHeader>
          <SectionTitle>&lt;내가 했던 어느 날에&gt; 와 비슷한 책</SectionTitle>
          <NavButtons>
            <NavButton><ChevronLeft size={18} /></NavButton>
            <NavButton><ChevronRight size={18} /></NavButton>
          </NavButtons>
        </SectionHeader>
        <HorizontalScroll>
          {similarBooks.map((book) => (
            <BookCard key={book.id} book={book} size="md" />
          ))}
        </HorizontalScroll>
      </Section>

      {/* 장르 기반 추천 */}
      <Section>
        <SectionHeader>
          <SectionTitle>가장 최근 읽은 장르 기반 추천</SectionTitle>
          <SeeMoreLink>더보기</SeeMoreLink>
        </SectionHeader>
        <VerticalGrid>
          {genreBooks.map((book) => (
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
          {aiBooks.map((book) => (
            <AIBookCard key={book.id}>
              <AIBookCover src={book.coverImage} alt="" />
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
          {popularBooks.map((book) => (
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
          {hiddenBooks.map((book) => (
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
        <FooterLogo>Pickley</FooterLogo>
      </Footer>
    </Container>
  );
}
