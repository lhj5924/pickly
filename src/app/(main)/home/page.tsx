'use client';

import styled, { keyframes } from 'styled-components';
import { BookCard, Button, AnimatedPieChart, StatsGrid, StatCard } from '@/components/common';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { useMyLibraries } from '@/api/useLibrary';
// UI-only 차트/배너 데이터는 아직 서버 API가 없어 로컬 상수로 유지합니다 (Stage 3).
const genreChartData = [
  { name: '소설', value: 54 },
  { name: '에세이', value: 34 },
  { name: '경제경영', value: 12 },
];

const keywordChartData = [
  { name: '로맨스', value: 40 },
  { name: '성장', value: 35 },
  { name: '힐링', value: 25 },
];

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
  z-index: 0;
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
  z-index: 0;
`;

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 4rem;
`;

// Banner Section
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

// Stats Section
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

// Chart Section
const ChartSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2.5rem 3rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.quinary};
  margin-bottom: 1.5rem;
  text-align: left;
`;

const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const PieChartWrapper = styled.div`
  display: flex;
  flex-direction: column;

  &:first-child {
    border-right: 1px solid #cfcfcf;
    padding-right: 2rem;

    @media (max-width: 640px) {
      border-right: none;
      border-bottom: 1px solid #cfcfcf;
      padding-right: 0;
      padding-bottom: 2rem;
    }
  }
`;

const PieChartLabel = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const PieChartContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 4rem;
`;

const EmptyChart = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 0.875rem;
`;

const CtaButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

// Books Section
const BooksSection = styled.section`
  // margin-bottom: 2.5rem;
`;

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
  const { data: readingLibrary = [] } = useMyLibraries('READING');
  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');
  const hasData = completedLibrary.length > 0;
  const [currentBanner, setCurrentBanner] = useState(0);
  const [chartAnimated, setChartAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % bannerData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for chart animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !chartAnimated) {
            setChartAnimated(true);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, [chartAnimated]);

  const nickname = user?.nickname?.split('_')[0] || '빨리';

  return (
    <PageWrapper>
      <BackgroundGradient1 />
      <BackgroundGradient2 />
      <Container>
        {/* Banner */}
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

        {/* Stats */}
        <StatsSection>
          <SectionTitle>나는 어떤 책을 얼마나 읽었을까?</SectionTitle>

          <StatsGridMargin>
            <StatsGrid>
              <StatCard
                label="총 읽은 책 수"
                value={hasData ? `${completedLibrary.length}권` : undefined}
                icon={<OpenedBookIcon size={24} />}
              />
              <StatCard
                label="읽는 중"
                value={`${readingLibrary.length}권`}
                icon={<CalendarIcon size={24} />}
              />
              <StatCard
                label="월 평균 권 수"
                value={hasData ? `${Math.round((completedLibrary.length / 12) * 10) / 10}권` : undefined}
                icon={<BooksIcon size={24} />}
              />
            </StatsGrid>
          </StatsGridMargin>

          <ChartSection ref={chartRef}>
            <ChartTitle>당신은 로맨스 중심의 소설을 가장 많이 소비해요</ChartTitle>
            {hasData ? (
              <ChartContainer>
                <PieChartWrapper>
                  <PieChartLabel>장르별 독서량</PieChartLabel>
                  <PieChartContainer>
                    <AnimatedPieChart data={genreChartData} animate={chartAnimated} />
                  </PieChartContainer>
                </PieChartWrapper>
                <PieChartWrapper>
                  <PieChartLabel>키워드별 독서량</PieChartLabel>
                  <PieChartContainer>
                    <AnimatedPieChart data={keywordChartData} animate={chartAnimated} />
                  </PieChartContainer>
                </PieChartWrapper>
              </ChartContainer>
            ) : (
              <EmptyChart>아직 데이터가 없습니다</EmptyChart>
            )}
          </ChartSection>

          <CtaButtonWrapper>
            <Button variant="cta" as={Link} href="/stats" rightIcon={<ArrowRight size={24} />}>
              전체 통계 보러가기
            </Button>
          </CtaButtonWrapper>
        </StatsSection>

        {/* Reading Books */}
        <BooksSection>
          <SectionTitle>내가 지금 읽고 있는 책</SectionTitle>
          {readingLibrary.length > 0 ? (
            <BooksScroll>
              {readingLibrary.map(item => (
                <BookCard key={item.uuid} book={item.book} size="sm" initialStatus="reading" />
              ))}
            </BooksScroll>
          ) : (
            <EmptyBooks>읽고 있는 책이 없습니다</EmptyBooks>
          )}
        </BooksSection>

        {/* AI Recommendations - TODO: 서버에 추천 API가 추가되면 연동 */}
        <BooksSection>
          <SectionTitle>{nickname}님의 독서 취향 기반 AI 추천</SectionTitle>
          <EmptyBooks>곧 AI 추천 책을 보여드릴 예정이에요.</EmptyBooks>
        </BooksSection>
      </Container>
    </PageWrapper>
  );
}
