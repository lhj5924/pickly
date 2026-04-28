'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { BookCard, NavButtons, NavButton, ShowMoreToggle } from '@/components/common';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores';
import {
  mockSimilarBooks,
  mockGenreBooks,
  mockAiRecommendBooks,
  mockPopularBooks,
  mockHiddenBooks,
  type HiddenMockBook,
} from '@/mocks';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 15rem;
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
  border-radius: 1.5rem;
  overflow: hidden;
  position: relative;
  padding: 64px 128px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const HiddenBookCoverWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const HiddenQuoteText = styled.p`
  margin-top: 3rem;
  font-size: 1.25rem;
  text-align: center;
  word-break: keep-all;
`;

// Data from centralized mock data (replace with API calls later)
const similarBooks = mockSimilarBooks;
const genreBooks = mockGenreBooks;
const aiBooks = mockAiRecommendBooks;
const popularBooks = mockPopularBooks;
const hiddenBooks = mockHiddenBooks;

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
    expanded: isFullyExpanded,
    canExpand,
    toggle: () => {
      if (!canExpand) return;
      setVisibleCount(count => (count >= items.length ? pageSize : count + pageSize));
    },
  };
};

const PASTEL_FALLBACK_PALETTES: string[][] = [
  ['#FFE5E5', '#FFD6E8', '#E8F4FF', '#F4E5FF'],
  ['#FFF4D6', '#FFE5B4', '#FFD6CC', '#FFEFE0'],
  ['#E5F7E5', '#D6F0E0', '#C8EBE0', '#E8FAF0'],
  ['#E0F0FF', '#CCE5FF', '#D6DCFF', '#E5E8FF'],
  ['#FFE8F0', '#FFDDE6', '#FFE0CC', '#FFF0E0'],
];

const hashStringToInt = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const toPastel = (r: number, g: number, b: number) => {
  const blend = (channel: number) => Math.round((channel + 255 * 2) / 3);
  return `rgb(${blend(r)}, ${blend(g)}, ${blend(b)})`;
};

const useImagePalette = (src: string, fallback: string[]) => {
  const [palette, setPalette] = useState<string[]>(fallback);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const size = 50;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
          const bucket = buckets.get(key);
          if (bucket) {
            bucket.r += r;
            bucket.g += g;
            bucket.b += b;
            bucket.n += 1;
          } else {
            buckets.set(key, { r, g, b, n: 1 });
          }
        }
        const dominant = [...buckets.values()].sort((a, b) => b.n - a.n).slice(0, 4);
        const colors = dominant.map(c => toPastel(c.r / c.n, c.g / c.n, c.b / c.n));
        if (colors.length && !cancelled) setPalette(colors);
      } catch {
        // CORS-tainted canvas — keep fallback
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return palette;
};

const HiddenBookCard = ({ book }: { book: HiddenMockBook }) => {
  const router = useRouter();
  const seed = hashStringToInt(book.uuid);
  const fallback = PASTEL_FALLBACK_PALETTES[seed % PASTEL_FALLBACK_PALETTES.length];
  const palette = useImagePalette(book.thumbnailUrl, fallback);
  const colors = [...palette, ...palette];
  const [c1, c2, c3, c4] = colors;
  const angle = seed % 360;
  const x1 = (seed % 60) + 20;
  const y1 = ((seed >> 3) % 60) + 20;
  const x2 = ((seed >> 6) % 60) + 20;
  const y2 = ((seed >> 9) % 60) + 20;
  const background = [
    `radial-gradient(circle at ${x1}% ${y1}%, ${c2} 0%, transparent 55%)`,
    `radial-gradient(circle at ${x2}% ${y2}%, ${c3} 0%, transparent 60%)`,
    `linear-gradient(${angle}deg, ${c1} 0%, ${c4 || c1} 100%)`,
  ].join(', ');

  return (
    <HiddenCard style={{ background }} onClick={() => router.push(`/book/${book.uuid}`)}>
      <HiddenBookCoverWrapper>
        <BookCard book={book} size="md" />
      </HiddenBookCoverWrapper>
      <HiddenQuoteText>"{book.quote}"</HiddenQuoteText>
    </HiddenCard>
  );
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
                <FeaturedSubtitle>{featuredSimilarBook.authors?.[0]}</FeaturedSubtitle>
              </FeaturedTextWrapper>
            </FeaturedBookColumn>
          )}
          <SmallBooksColumn>
            <SmallBooksGrid>
              {visibleSmallSimilarBooks.map(book => (
                <SmallBookItem key={book.uuid}>
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
        </SectionHeader>
        <VerticalGrid>
          {genre.items.map(book => (
            <VerticalBookCard key={book.uuid} onClick={() => router.push(`/book/${book.uuid}`)}>
              <VerticalBookCoverWrapper>
                <BookCard book={book} size="sm" showTitle={false} />
              </VerticalBookCoverWrapper>
              <VerticalBookTitle>{book.title}</VerticalBookTitle>
              <VerticalBookSubTitle>{book.publisher}</VerticalBookSubTitle>
              <VerticalBookAuthor>{book.authors?.[0]}</VerticalBookAuthor>
            </VerticalBookCard>
          ))}
        </VerticalGrid>
        {genre.canExpand && <ShowMoreToggle expanded={genre.expanded} onToggle={genre.toggle} />}
      </Section>

      {/* AI 추천 */}
      <Section>
        <SectionHeader>
          <SectionTitle>{nickname}님의 독서 취향 기반 AI 추천</SectionTitle>
        </SectionHeader>
        <AIBookGrid>
          {ai.items.map(book => (
            <BookCard key={book.uuid} book={book} size="md" />
          ))}
        </AIBookGrid>
        {ai.canExpand && <ShowMoreToggle expanded={ai.expanded} onToggle={ai.toggle} />}
      </Section>

      {/* 인기 책 */}
      <PopularSection>
        <SectionHeader>
          <SectionTitle>요즘엔 이런 책이 인기있어요</SectionTitle>
        </SectionHeader>
        <PopularGrid>
          {popular.items.map(book => (
            <VerticalBookCard key={book.uuid} onClick={() => router.push(`/book/${book.uuid}`)}>
              <PopularCoverWrapper>
                <BookCard book={book} size="md" />
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
        {popular.canExpand && <ShowMoreToggle expanded={popular.expanded} onToggle={popular.toggle} />}
      </PopularSection>

      {/* 숨겨진 취향 */}
      <HiddenSection>
        <SectionHeader>
          <SectionTitle>숨겨진 취향 탐색 - 이런 책은 어때요?</SectionTitle>
        </SectionHeader>
        <HiddenGrid>
          {hidden.items.map(book => (
            <HiddenBookCard key={book.uuid} book={book} />
          ))}
        </HiddenGrid>
        {hidden.canExpand && <ShowMoreToggle expanded={hidden.expanded} onToggle={hidden.toggle} />}
      </HiddenSection>
    </Container>
  );
}
