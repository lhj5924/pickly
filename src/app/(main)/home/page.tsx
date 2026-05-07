'use client';

import styled, { keyframes } from 'styled-components';
import { BookCard, Button, StatsGrid, StatCard } from '@/components/common';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { useHome } from '@/api/useHome';
import { PieChart } from '@/components/common/PieChart';
import type { PieChartDataItem } from '@/components/common/PieChart/PieChart';

const bannerData = [
  {
    id: 1,
    book: { title: '나나 올리브에게', coverImage: 'https://image.yes24.com/goods/109933559/XL' },
    quote: '서운해하지는 마세요. 물건들에게도 계절이 있다면, 긴 겨울이 지나 봄이 온 것뿐이에요.',
  },
  {
    id: 2,
    book: { title: '배너 2', coverImage: '' },
    quote: '',
  },
  {
    id: 3,
    book: { title: '배너 3', coverImage: '' },
    quote: '',
  },
];

const PageWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
`;

const BackgroundGradient1 = styled.div`
  position: absolute;
  width: 1283px;
  height: 1283px;
  left: -261px;
  top: -175px;
  background: #fff2eb;
  filter: blur(107px);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
`;

const BackgroundGradient2 = styled.div`
  position: absolute;
  width: 1588px;
  height: 1588px;
  left: 869px;
  top: 1369px;
  background: #e7ffe1;
  filter: blur(107px);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
`;

const BannerSection = styled.section`
  position: relative;
  margin: 1.5rem 0 2.5rem;
  border-radius: 1rem;
  overflow: hidden;

  &:hover .banner-nav {
    opacity: 1;
  }
`;

const BannerSlide = styled.div<{ $bannerIndex: number }>`
  display: flex;
  background: url(${({ $bannerIndex }) => `/images/banner-${$bannerIndex + 1}.png`});
  background-size: cover;
  min-height: 468px;
  gap: 2rem;
  align-items: center;
`;

const BannerNav = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${({ $direction }) => ($direction === 'left' ? 'left: 4rem' : 'right: 4rem')};
  transform: translateY(-50%);
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ffffff66;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 10;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const StatsSection = styled.section`
  margin-bottom: 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.quaternary};
  margin-bottom: 1rem;
`;

const StatsGridMargin = styled.div`
  margin-bottom: 1.5rem;
`;

const CtaButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const BooksSection = styled.section``;

const BooksScroll = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1.25rem;
  overflow-x: auto;
  padding-bottom: 2.5rem;

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

const EmptyBooks = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export default function HomePage() {
  const { user } = useAuthStore();
  const { data: home } = useHome();

  const readingBooks = [...(home?.currentlyReadingBooks ?? [])]
    .sort((a, b) => {
      const aTime = new Date(a.startedAt ?? a.createdAt).getTime();
      const bTime = new Date(b.startedAt ?? b.createdAt).getTime();
      return bTime - aTime;
    })
    .slice(0, 5);

  const recommendedBooks = home?.recommendations ?? [];
  const totalBooksRead = home?.totalBooksRead ?? 0;
  const currentlyReadingCount = home?.currentlyReadingCount ?? 0;
  const monthlyAverageBooks = home?.monthlyAverageBooks ?? 0;
  const hasData = totalBooksRead > 0;

  const genreData: PieChartDataItem[] | undefined = home?.genreStats?.length
    ? home.genreStats.map(g => ({ name: g.genreName, value: g.booksRead }))
    : undefined;

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % bannerData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nickname = user?.nickname?.split('_')[0] || '빨리';

  return (
    <PageWrapper>
      <BackgroundGradient1 />
      <BackgroundGradient2 />
      <Container>
        {/* 배너 */}
        <BannerSection>
          <BannerSlide $bannerIndex={currentBanner} />
          <BannerNav
            className="banner-nav"
            $direction="left"
            onClick={() => setCurrentBanner(prev => (prev - 1 + bannerData.length) % bannerData.length)}
          >
            <ChevronLeft size={36} />
          </BannerNav>
          <BannerNav
            className="banner-nav"
            $direction="right"
            onClick={() => setCurrentBanner(prev => (prev + 1) % bannerData.length)}
          >
            <ChevronRight size={36} />
          </BannerNav>
        </BannerSection>

        {/* 통계 */}
        <StatsSection>
          <SectionTitle>나는 어떤 책을 얼마나 읽었을까?</SectionTitle>

          <StatsGridMargin>
            <StatsGrid>
              <StatCard
                label="총 읽은 책 수"
                value={hasData ? `${totalBooksRead}권` : undefined}
                icon={<OpenedBookIcon size={24} />}
              />
              <StatCard
                label="읽는 중"
                value={`${currentlyReadingCount}권`}
                icon={<CalendarIcon size={24} />}
              />
              <StatCard
                label="월 평균 권 수"
                value={hasData ? `${monthlyAverageBooks}권` : undefined}
                icon={<BooksIcon size={24} />}
              />
            </StatsGrid>
          </StatsGridMargin>

          <PieChart genreData={genreData} />

          <CtaButtonWrapper>
            <Button variant="cta" as={Link} href="/stats" rightIcon={<ArrowRight size={24} />}>
              전체 통계 보러가기
            </Button>
          </CtaButtonWrapper>
        </StatsSection>

        {/* 읽고 있는 책 */}
        <BooksSection>
          <SectionTitle>내가 지금 읽고 있는 책</SectionTitle>
          {readingBooks.length > 0 ? (
            <BooksScroll>
              {readingBooks.map(item => (
                <BookCard key={item.uuid} book={item.book} size="sm" initialStatus="reading" />
              ))}
            </BooksScroll>
          ) : (
            <EmptyBooks>읽고 있는 책이 없습니다</EmptyBooks>
          )}
        </BooksSection>

        {/* AI 추천 */}
        <BooksSection>
          <SectionTitle>{nickname}님의 독서 취향 기반 AI 추천</SectionTitle>
          {recommendedBooks.length > 0 ? (
            <BooksScroll>
              {recommendedBooks.map(book => (
                <BookCard key={book.uuid} book={book} size="sm" />
              ))}
            </BooksScroll>
          ) : (
            <EmptyBooks>곧 AI 추천 책을 보여드릴 예정이에요.</EmptyBooks>
          )}
        </BooksSection>
      </Container>
    </PageWrapper>
  );
}
