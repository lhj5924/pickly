'use client';

import styled, { keyframes } from 'styled-components';
import { BookCard, Button } from '@/components/common';
import {
  Book,
  Calendar,
  BarChart3,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { readingStats, monthlyBarData, staleReadingBooks } from '@/data/mockData';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #f5f7ed 0%, #e8ebd8 100%);
  border-radius: 1rem;
  padding: 1.5rem 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Level = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 0.25rem;
`;

const LevelDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Stats Cards
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const StatIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary[500]};
`;

// Bar Chart Section
const ChartCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
`;

const TotalBooks = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ThisWeekBooks = styled.span`
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const ChartNav = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  width: 28px;
  height: 28px;
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

const growUp = keyframes`
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
`;

const BarChartContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 200px;
  padding-top: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const Bar = styled.div<{ $height: number; $highlight: boolean; $delay: number }>`
  width: 50px;
  height: ${({ $height }) => $height}%;
  background: ${({ theme, $highlight }) => ($highlight ? theme.colors.primary[500] : theme.colors.primary[200])};
  border-radius: 0.25rem 0.25rem 0 0;
  transform-origin: bottom;
  animation: ${growUp} 0.8s ease-out forwards;
  animation-delay: ${({ $delay }) => $delay}s;
  position: relative;

  @media (max-width: 640px) {
    width: 30px;
  }
`;

const BarValue = styled.span`
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BarLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// Calendar Section
const CalendarCard = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CalendarMonth = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const CalendarNavBtn = styled.button`
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const UnitLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const CalendarWeekday = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0.5rem 0;
`;

const CalendarDay = styled.div<{ $hasBooks: boolean; $bookCount: number }>`
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 0.25rem;
  background: ${({ $hasBooks, $bookCount, theme }) =>
    $hasBooks
      ? `${theme.colors.primary[(100 + Math.min($bookCount * 100, 400)) as keyof typeof theme.colors.primary]}`
      : 'transparent'};
  position: relative;
  cursor: ${({ $hasBooks }) => ($hasBooks ? 'pointer' : 'default')};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
  }
`;

const BookTooltip = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
  white-space: nowrap;
  z-index: 10;
  font-size: 0.75rem;
`;

// Pie Chart Section
const PieSection = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PieSectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const PieContainer = styled.div`
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
  align-items: center;
`;

const PieChartLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const PieChart = styled.div`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: conic-gradient(
    ${({ theme }) => theme.colors.primary[500]} 0deg 194deg,
    ${({ theme }) => theme.colors.primary[300]} 194deg 316deg,
    ${({ theme }) => theme.colors.primary[200]} 316deg 360deg
  );
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PieCenter = styled.div`
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.neutral[50]};
`;

const PieLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

// Quarterly Section
const QuarterlySection = styled.div`
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const QuarterlyTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const QuarterlyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const QuarterCard = styled.div`
  text-align: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
`;

const QuarterLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 0.5rem;
`;

const QuarterGenre = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 0.25rem;
`;

const QuarterPercent = styled.span`
  font-size: 1.25rem;
`;

const QuarterSubGenres = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Stale Reading Section
const StaleSection = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1.5rem;
`;

const StaleTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StaleBooks = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const StaleBookCard = styled.div`
  flex-shrink: 0;
  width: 120px;
  text-align: center;
`;

const StaleBookCover = styled.div`
  width: 100%;
  aspect-ratio: 2/3;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StaleBookDate = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

// Data from centralized mock data (replace with API calls later)
const monthlyData = monthlyBarData;
const staleBooks = staleReadingBooks;

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export default function StatsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const maxBarValue = Math.max(...monthlyData.map(d => d.value));

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, books: 0 });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      // Mock: random book count
      const bookCount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0;
      days.push({ day: i, books: bookCount });
    }
    return days;
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Level>나의 독서 레벨 Lv.5 - 안정적 독서자</Level>
          <LevelDesc>&quot;독서가 일상의 한 부분이에요.&quot;</LevelDesc>
        </HeaderLeft>
        <HeaderRight>
          <Button size="sm" rightIcon={<ArrowRight size={16} />}>
            내 통계 공유하기
          </Button>
          <Image src="/pickly-jar.png" alt="pickly" width={60} height={96} />
        </HeaderRight>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatInfo>
            <StatLabel>총 읽은 책 수</StatLabel>
            <StatValue>{readingStats.totalBooks}권</StatValue>
          </StatInfo>
          <StatIcon>
            <Book size={24} />
          </StatIcon>
        </StatCard>
        <StatCard>
          <StatInfo>
            <StatLabel>평균 독서 기간</StatLabel>
            <StatValue>{readingStats.averageReadingDays}일</StatValue>
          </StatInfo>
          <StatIcon>
            <Calendar size={24} />
          </StatIcon>
        </StatCard>
        <StatCard>
          <StatInfo>
            <StatLabel>월 평균 권 수</StatLabel>
            <StatValue>{readingStats.monthlyAverage}권</StatValue>
          </StatInfo>
          <StatIcon>
            <BarChart3 size={24} />
          </StatIcon>
        </StatCard>
      </StatsGrid>

      {/* Monthly Bar Chart */}
      <ChartCard>
        <ChartHeader>
          <ChartTitle>
            월별 독서량
            <HelpCircle size={16} color="#a3a3a3" />
          </ChartTitle>
          <ChartInfo>
            <TotalBooks>34권 (년째)</TotalBooks>
            <ThisWeekBooks>3권 (이번 주)</ThisWeekBooks>
          </ChartInfo>
          <ChartNav>
            <NavButton>
              <ChevronLeft size={16} />
            </NavButton>
            <NavButton>
              <ChevronRight size={16} />
            </NavButton>
          </ChartNav>
        </ChartHeader>
        <BarChartContainer>
          {monthlyData.map((data, index) => (
            <BarWrapper key={index}>
              <Bar $height={(data.value / maxBarValue) * 100} $highlight={data.highlight || false} $delay={index * 0.1}>
                <BarValue>{data.value}</BarValue>
              </Bar>
              <BarLabel>{data.label}</BarLabel>
            </BarWrapper>
          ))}
        </BarChartContainer>
      </ChartCard>

      {/* Calendar */}
      <CalendarCard>
        <CalendarHeader>
          <ChartTitle>
            독서 캘린더
            <HelpCircle size={16} color="#a3a3a3" />
          </ChartTitle>
          <CalendarNav>
            <CalendarNavBtn
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            >
              <ChevronLeft size={18} />
            </CalendarNavBtn>
            <CalendarMonth>{currentMonth.getMonth() + 1}월</CalendarMonth>
            <CalendarNavBtn
              onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            >
              <ChevronRight size={18} />
            </CalendarNavBtn>
          </CalendarNav>
          <UnitLabel>단위 : 시간</UnitLabel>
        </CalendarHeader>
        <CalendarGrid>
          {weekdays.map(day => (
            <CalendarWeekday key={day}>{day}</CalendarWeekday>
          ))}
          {getDaysInMonth().map((item, index) => (
            <CalendarDay key={index} $hasBooks={item.books > 0} $bookCount={item.books}>
              {item.day || ''}
            </CalendarDay>
          ))}
        </CalendarGrid>
      </CalendarCard>

      {/* Pie Charts */}
      <PieSection>
        <PieSectionTitle>당신은 로맨스 중심의 소설을 가장 많이 소비해요</PieSectionTitle>
        <PieContainer>
          <PieChartWrapper>
            <PieChartLabel>장르별 독서량</PieChartLabel>
            <PieChart>
              <PieCenter />
            </PieChart>
            <PieLegend>
              <LegendItem>
                <LegendDot $color="#7d9240" />
                소설 54%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#a3c47a" />
                에세이 34%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#c5d9a4" />
                경제/경영 32%
              </LegendItem>
            </PieLegend>
          </PieChartWrapper>
          <PieChartWrapper>
            <PieChartLabel>키워드별 독서량</PieChartLabel>
            <PieChart>
              <PieCenter />
            </PieChart>
            <PieLegend>
              <LegendItem>
                <LegendDot $color="#7d9240" />
                소설 54%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#a3c47a" />
                에세이 34%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#c5d9a4" />
                경제/경영 32%
              </LegendItem>
            </PieLegend>
          </PieChartWrapper>
        </PieContainer>
      </PieSection>

      {/* Quarterly */}
      <QuarterlySection>
        <QuarterlyTitle>분기별 많이 읽은 장르</QuarterlyTitle>
        <QuarterlyGrid>
          <QuarterCard>
            <QuarterLabel>1분기</QuarterLabel>
            <QuarterGenre>
              스릴러 <QuarterPercent>65%</QuarterPercent>
            </QuarterGenre>
            <QuarterSubGenres>
              로맨스 23%
              <br />
              로맨스 13%
            </QuarterSubGenres>
          </QuarterCard>
          <QuarterCard>
            <QuarterLabel>2분기</QuarterLabel>
            <QuarterGenre>
              라이트노벨 <QuarterPercent>65%</QuarterPercent>
            </QuarterGenre>
            <QuarterSubGenres>
              로맨스 23%
              <br />
              로맨스 13%
            </QuarterSubGenres>
          </QuarterCard>
          <QuarterCard>
            <QuarterLabel>3분기</QuarterLabel>
            <QuarterGenre>
              예술/대중문화 <QuarterPercent>65%</QuarterPercent>
            </QuarterGenre>
            <QuarterSubGenres>
              로맨스 23%
              <br />
              로맨스 13%
            </QuarterSubGenres>
          </QuarterCard>
          <QuarterCard>
            <QuarterLabel>4분기</QuarterLabel>
            <QuarterGenre>
              스릴러 <QuarterPercent>65%</QuarterPercent>
            </QuarterGenre>
            <QuarterSubGenres>
              로맨스 23%
              <br />
              로맨스 13%
            </QuarterSubGenres>
          </QuarterCard>
        </QuarterlyGrid>
      </QuarterlySection>

      {/* Stale Reading */}
      <StaleSection>
        <StaleTitle>
          아직 이 책을 읽고 계신가요?
          <HelpCircle size={16} color="#a3a3a3" />
        </StaleTitle>
        <StaleBooks>
          {staleBooks.map(book => (
            <StaleBookCard key={book.id}>
              <StaleBookCover>
                <img src={book.coverImage} alt="" />
              </StaleBookCover>
              <StaleBookDate>{book.date}</StaleBookDate>
            </StaleBookCard>
          ))}
        </StaleBooks>
        <MoreButton>
          더보기 <ChevronDown size={16} />
        </MoreButton>
      </StaleSection>
    </Container>
  );
}
