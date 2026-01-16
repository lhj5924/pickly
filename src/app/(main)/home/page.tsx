'use client';

import styled, { keyframes } from 'styled-components';
import { BookCard, Button } from '@/components/common';
import { ChevronLeft, ChevronRight, ArrowRight, Book, Calendar, BarChart3 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuthStore, useBookStore } from '@/stores';

// Chart Data Types
interface ChartSegment {
  name: string;
  value: number;
  color: string;
}

interface ChartData {
  title: string;
  segments: ChartSegment[];
}

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
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.quaternary};
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  width: 368px;
  height: 208px;
  background: white;
  border-radius: 0.75rem;
  padding: 1.75rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatInfo = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StatLabel = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.quinary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const StatIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary[500]};
  margin-top: 0.3rem;
`;

const EmptyStatValue = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// Chart Section
const ChartSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2.5rem 3rem;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.quaternary};
  margin-bottom: 2rem;
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
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
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

// Books Section
const BooksSection = styled.section`
  margin-bottom: 2.5rem;
`;

const BooksScroll = styled.div`
  display: flex;
  justify-content: space-between;
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

const EmptyBooks = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// Footer
const Footer = styled.footer`
  position: relative;
  z-index: 1;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  padding: 3rem 1.5rem;
  margin-top: 4rem;
  text-align: center;
`;

const FooterLogo = styled.p`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: 'Pretendard Variable', sans-serif;
  margin-bottom: 1rem;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const FooterLink = styled.a`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const FooterSubLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
`;

// Animated Pie Chart Component
const AnimatedPieChart = ({ data, animate }: { data: ChartSegment[]; animate: boolean }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const size = 220;
  const strokeWidth = 110;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Mark animation as complete after it finishes
  useEffect(() => {
    if (animate && !animationComplete) {
      const timer = setTimeout(() => {
        setAnimationComplete(true);
      }, 1500); // Animation duration + delays
      return () => clearTimeout(timer);
    }
  }, [animate, animationComplete]);

  // Calculate segment positions
  let accumulatedPercentage = 0;
  const segments = data.map((segment, index) => {
    const percentage = segment.value;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercentage / 100) * circumference;

    // Calculate label position (middle of segment)
    const segmentMiddle = accumulatedPercentage + percentage / 2;
    const angle = (segmentMiddle / 100) * 2 * Math.PI - Math.PI / 2;
    const labelRadius = radius + strokeWidth / 2 + 30;
    const labelX = center + Math.cos(angle) * labelRadius;
    const labelY = center + Math.sin(angle) * labelRadius;

    // Line start point (edge of pie)
    const lineStartRadius = radius + strokeWidth / 2;
    const lineStartX = center + Math.cos(angle) * lineStartRadius;
    const lineStartY = center + Math.sin(angle) * lineStartRadius;

    // Determine text anchor based on position
    const isLeftSide = labelX < center;
    const textAnchor: 'end' | 'start' = isLeftSide ? 'end' : 'start';
    const labelOffset = isLeftSide ? -10 : 10;

    accumulatedPercentage += percentage;

    return {
      ...segment,
      strokeDasharray,
      strokeDashoffset,
      labelX: labelX + labelOffset,
      labelY,
      lineStartX,
      lineStartY,
      lineEndX: labelX,
      lineEndY: labelY,
      textAnchor,
      delay: 1 + index * 0.2,
    };
  });

  return (
    <svg width={size + 100} height={size + 40} style={{ overflow: 'visible' }}>
      <g transform={`translate(50, 20)`}>
        {/* Pie segments */}
        <g style={{ transform: 'rotate(-90deg)', transformOrigin: `${center}px ${center}px` }}>
          {segments.map((segment, index) => (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={animationComplete ? segment.strokeDasharray : (animate ? `0 ${circumference}` : segment.strokeDasharray)}
              strokeDashoffset={segment.strokeDashoffset}
              style={{
                transition: animate && !animationComplete ? 'none' : undefined,
                animation: animate && !animationComplete ? `pieSegment${index} 1s ease-out ${index * 0.1}s forwards` : undefined,
              }}
            />
          ))}
        </g>

        {/* Labels with lines */}
        {segments.map((segment, index) => (
          <g key={`label-${index}`}>
            {/* Connection line */}
            <line
              x1={segment.lineStartX}
              y1={segment.lineStartY}
              x2={segment.lineEndX}
              y2={segment.lineEndY}
              stroke="#999"
              strokeWidth={1}
              style={{
                opacity: animationComplete ? 1 : (animate ? 0 : 1),
                animation: animate && !animationComplete ? `fadeIn 0.3s ease-out ${segment.delay}s forwards` : undefined,
              }}
            />
            {/* Label text */}
            <text
              x={segment.labelX}
              y={segment.labelY}
              textAnchor={segment.textAnchor}
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="500"
              fill="#333"
              style={{
                opacity: animationComplete ? 1 : (animate ? 0 : 1),
                transform: 'translateY(0)',
                animation: animate && !animationComplete ? `fadeInUp 0.5s ease-out ${segment.delay + 0.1}s forwards` : undefined,
              }}
            >
              {segment.name} {segment.value}%
            </text>
          </g>
        ))}
      </g>

      {/* CSS animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          ${segments
            .map(
              (segment, index) => `
            @keyframes pieSegment${index} {
              from { stroke-dasharray: 0 ${circumference}; }
              to { stroke-dasharray: ${segment.strokeDasharray}; }
            }
          `,
            )
            .join('')}
        `}
      </style>
    </svg>
  );
};

// Mock data
// Chart mock data
const genreChartData: ChartSegment[] = [
  { name: '소설', value: 54, color: '#7d9240' },
  { name: '에세이', value: 34, color: '#a3c47a' },
  { name: '경제경영', value: 12, color: '#c5d9a4' },
];

const keywordChartData: ChartSegment[] = [
  { name: '로맨스', value: 40, color: '#7d9240' },
  { name: '성장', value: 35, color: '#a3c47a' },
  { name: '힐링', value: 25, color: '#c5d9a4' },
];
const bannerData = [
  {
    id: 1,
    book: {
      title: '나나 올리브에게',
      coverImage: 'https://image.yes24.com/goods/109933559/XL',
    },
    quote: '서운해하지는 마세요. 물건들에게도 계절이 있다면, 긴 겨울이 지나 봄이 온 것뿐이에요.',
  },
  {
    id: 2,
    book: {
      title: '배너 2',
      coverImage: '',
    },
    quote: '',
  },
  {
    id: 3,
    book: {
      title: '배너 3',
      coverImage: '',
    },
    quote: '',
  },
];

const mockReadingBooks = [
  {
    id: '1',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    progress: 36,
  },
  {
    id: '2',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    progress: 36,
  },
  {
    id: '3',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    progress: 36,
  },
  {
    id: '4',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    progress: 36,
  },
  {
    id: '5',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    progress: 36,
  },
];

const mockRecommendations = [
  {
    id: '1',
    title: '서해는 모든 것을 알았다',
    author: '정세랑',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
  },
  {
    id: '2',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
  },
  {
    id: '3',
    title: '서해는 모든 것을 알았다',
    author: '정세랑',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
  },
  {
    id: '4',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
  },
];

export default function HomePage() {
  const { user } = useAuthStore();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [hasData, setHasData] = useState(true); // 데이터 유무 상태
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

          <StatsGrid>
            <StatCard>
              <StatInfo>
                <StatLabel>총 읽은 책 수</StatLabel>
                {hasData ? <StatValue>12권</StatValue> : <EmptyStatValue>아직 데이터가 없습니다</EmptyStatValue>}
              </StatInfo>
              <StatIcon>
                <Book size={36} />
              </StatIcon>
            </StatCard>
            <StatCard>
              <StatInfo>
                <StatLabel>평균 독서 기간</StatLabel>
                {hasData ? <StatValue>5일</StatValue> : <EmptyStatValue>아직 데이터가 없습니다</EmptyStatValue>}
              </StatInfo>
              <StatIcon>
                <Calendar size={36} />
              </StatIcon>
            </StatCard>
            <StatCard>
              <StatInfo>
                <StatLabel>월 평균 권 수</StatLabel>
                {hasData ? <StatValue>3권</StatValue> : <EmptyStatValue>아직 데이터가 없습니다</EmptyStatValue>}
              </StatInfo>
              <StatIcon>
                <BarChart3 size={36} />
              </StatIcon>
            </StatCard>
          </StatsGrid>

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

          <Button variant="stats" as={Link} href="/stats" fullWidth rightIcon={<ArrowRight size={18} />}>
            전체 통계 보러가기
          </Button>
        </StatsSection>

        {/* Reading Books */}
        <BooksSection>
          <SectionTitle>내가 지금 읽고 있는 책</SectionTitle>
          {mockReadingBooks.length > 0 ? (
            <BooksScroll>
              {mockReadingBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={{ ...book, description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] }}
                  size="sm"
                  showProgress
                />
              ))}
            </BooksScroll>
          ) : (
            <EmptyBooks>읽고 있는 책이 없습니다</EmptyBooks>
          )}
        </BooksSection>

        {/* AI Recommendations */}
        <BooksSection>
          <SectionTitle>{nickname}님의 독서 취향 기반 AI 추천</SectionTitle>
          <BooksScroll>
            {mockRecommendations.map(book => (
              <BookCard
                key={book.id}
                book={{ ...book, description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] }}
                size="md"
              />
            ))}
          </BooksScroll>
        </BooksSection>
      </Container>

      {/* Footer */}
      <Footer>
        <FooterLogo>Pickley</FooterLogo>
        <FooterLinks>
          <FooterLink href="#">고객센터</FooterLink>
          <FooterLink href="#">CONTACT US</FooterLink>
        </FooterLinks>
        <FooterSubLinks>
          <span>이용약관</span>
          <span>개인정보처리방침</span>
        </FooterSubLinks>
        <SocialLinks>
          <SocialIcon href="#">Y</SocialIcon>
          <SocialIcon href="#">@</SocialIcon>
          <SocialIcon href="#">X</SocialIcon>
          <SocialIcon href="#">♪</SocialIcon>
        </SocialLinks>
      </Footer>
    </PageWrapper>
  );
}
