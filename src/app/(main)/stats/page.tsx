'use client';

import styled, { keyframes } from 'styled-components';
import { BookCard, Button, StatsGrid, StatCard, NavButtons, NavButton } from '@/components/common';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { ArrowRight, ChevronLeft, ChevronRight, AlertCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useMyLibraries } from '@/api/useLibrary';
import { useMe } from '@/api/useMe';
import { getMockReadingLevel } from '@/mocks';

const WEEKS_PER_PAGE = 6;

const getWeekStart = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

const formatWeekLabel = (start: Date, end: Date) =>
  `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem 0;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div`
  flex: 1;
`;

const ShareButton = styled(Button)`
  flex-shrink: 0;
  padding: 16px 48px;
  font-size: 1rem;
`;

const Level = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.black};
  margin-bottom: 0.25rem;
`;

const LevelDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.black};
`;

const StatsGridWrapper = styled.div`
  margin-bottom: 2rem;
`;

// Bar Chart Section
const ChartSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const ChartHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const ChartSubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.quinary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const ChartVolume = styled.span`
  font-weight: 700;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};

  span {
    font-weight: 400;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.text.seventary};
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

const ChartPlot = styled.div`
  position: relative;
  height: 240px;
  margin-top: 1rem;
  padding-left: 36px;
`;

const Gridline = styled.div<{ $bottom: number }>`
  position: absolute;
  left: 36px;
  right: 0;
  bottom: ${({ $bottom }) => $bottom}%;
  height: 1px;
  background: #eaeaea;
  pointer-events: none;
`;

const GridlineLabel = styled.span`
  position: absolute;
  left: -36px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: #c8c8c8;
`;

const BarChartContainer = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  height: 100%;
  z-index: 1;
`;

const BarWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const BarLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0 0 36px;
`;

const BarLabelCell = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Bar = styled.div<{ $height: number; $highlight: boolean; $delay: number }>`
  width: 96px;
  height: ${({ $height }) => $height}%;
  background: ${({ $highlight }) => ($highlight ? '#B5EBA7' : '#EAEAEA')};
  border-radius: 0.25rem 0.25rem 0 0;
  transform-origin: bottom;
  animation: ${growUp} 0.5s ease-out both;
  animation-delay: ${({ $delay }) => $delay}s;
  position: relative;

  @media (max-width: 640px) {
    width: 30px;
  }
`;

const BarValue = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.quinary};
  pointer-events: none;
`;

const BarLabel = styled.span<{ $highlight: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme, $highlight }) => ($highlight ? theme.colors.text.primary : theme.colors.text.tertiary)};
`;

// Calendar Section
const CalendarSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
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
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
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
    ${({ theme }) => theme.colors.chart[0]} 0deg 194deg,
    ${({ theme }) => theme.colors.chart[2]} 194deg 316deg,
    ${({ theme }) => theme.colors.chart[4]} 316deg 360deg
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
  background: white;
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
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
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
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
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

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const daysBetween = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

export default function StatsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weekPageOffset, setWeekPageOffset] = useState(0);

  const { data: me } = useMe();
  const readingLevel = getMockReadingLevel(me?.uuid);

  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');
  const { data: readingLibrary = [] } = useMyLibraries('READING');

  // 오늘 기준 가장 가까운 (과거의) 완독일
  const mostRecentFinishedAt: Date | null = completedLibrary.reduce<Date | null>((latest, item) => {
    if (!item.finishedAt) return latest;
    const d = new Date(item.finishedAt);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d > today) return latest;
    return !latest || d > latest ? d : latest;
  }, null);

  // 최근 6주간 완독 권수 (weekPageOffset 만큼 과거로 이동)
  const weeklyData = (() => {
    const currentWeekStart = getWeekStart(new Date());
    return Array.from({ length: WEEKS_PER_PAGE }, (_, i) => {
      const start = new Date(currentWeekStart);
      start.setDate(currentWeekStart.getDate() - (weekPageOffset * WEEKS_PER_PAGE + (WEEKS_PER_PAGE - 1 - i)) * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      const endExclusive = new Date(start);
      endExclusive.setDate(start.getDate() + 7);

      const value = completedLibrary.filter(item => {
        if (!item.finishedAt) return false;
        const finished = new Date(item.finishedAt);
        return finished >= start && finished < endExclusive;
      }).length;

      const highlight = !!mostRecentFinishedAt && mostRecentFinishedAt >= start && mostRecentFinishedAt < endExclusive;

      return {
        label: formatWeekLabel(start, end),
        value,
        highlight,
      };
    });
  })();
  // 차트 Y축 최대값: 5 단위로 올림 (max < 5 → 5, 5~9 → 10, 10~14 → 15, ...)
  const rawMax = Math.max(...weeklyData.map(d => d.value), 0);
  const maxBarValue = (Math.floor(rawMax / 5) + 1) * 5;
  const yTicks = Array.from({ length: maxBarValue / 5 + 1 }, (_, i) => i * 5);

  const earliestFinishedAt = completedLibrary.reduce<Date | null>((min, item) => {
    if (!item.finishedAt) return min;
    const d = new Date(item.finishedAt);
    return !min || d < min ? d : min;
  }, null);
  const earliestShownWeekStart = (() => {
    const currentWeekStart = getWeekStart(new Date());
    const start = new Date(currentWeekStart);
    start.setDate(currentWeekStart.getDate() - (weekPageOffset * WEEKS_PER_PAGE + (WEEKS_PER_PAGE - 1)) * 7);
    return start;
  })();
  const canGoPrevWeeks = !!earliestFinishedAt && earliestFinishedAt < earliestShownWeekStart;
  const canGoNextWeeks = weekPageOffset > 0;

  const staleBooks = readingLibrary
    .filter(item => item.startedAt)
    .map(item => ({
      id: item.uuid,
      coverImage: item.book.thumbnailUrl,
      date: `${item.startedAt}부터 읽는 중`,
    }));

  const totalBooks = completedLibrary.length;
  const finishedPairs = completedLibrary.filter(item => item.startedAt && item.finishedAt);
  const averageReadingDays = finishedPairs.length
    ? Math.round(
        finishedPairs.reduce((sum, item) => sum + daysBetween(item.startedAt!, item.finishedAt!), 0) /
          finishedPairs.length,
      )
    : 0;
  // finishedAt 기준 월별 완독 권수 → 전체 월 평균
  const monthlyFinishedCounts = (() => {
    const map = new Map<string, number>();
    completedLibrary.forEach(item => {
      if (!item.finishedAt) return;
      const d = new Date(item.finishedAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  })();
  const monthlyAverage = monthlyFinishedCounts.size
    ? Math.round(
        (Array.from(monthlyFinishedCounts.values()).reduce((a, b) => a + b, 0) / monthlyFinishedCounts.size) * 10,
      ) / 10
    : 0;

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
          <Level>
            나의 독서 레벨 Lv.{readingLevel.level} - {readingLevel.title}
          </Level>
          <LevelDesc>&quot;{readingLevel.description}&quot;</LevelDesc>
        </HeaderLeft>
        <ShareButton variant="cta" rightIcon={<ArrowRight size={20} />}>
          내 통계 공유하기
        </ShareButton>
      </Header>

      <StatsGridWrapper>
        <StatsGrid>
          <StatCard
            label="총 읽은 책 수"
            value={totalBooks ? `${totalBooks}권` : undefined}
            icon={<OpenedBookIcon size={24} />}
          />
          <StatCard
            label="평균 독서 기간"
            value={averageReadingDays ? `${averageReadingDays}일` : undefined}
            icon={<CalendarIcon size={24} />}
          />
          <StatCard
            label="월 평균 권 수"
            value={totalBooks ? `${monthlyAverage}권` : undefined}
            icon={<BooksIcon size={24} />}
          />
        </StatsGrid>
      </StatsGridWrapper>

      {/* Monthly Bar Chart */}
      <ChartSection>
        <ChartHeader>
          <ChartSubHeader>
            <ChartTitle>
              월별 독서량
              <AlertCircle size={16} color="#a3a3a3" />
            </ChartTitle>
            <NavButtons>
              <NavButton
                $size={24}
                $shadow="0px 1.85px 4.62px 0px #00000040"
                aria-label="이전 6주"
                disabled={!canGoPrevWeeks}
                onClick={() => setWeekPageOffset(p => p + 1)}
              >
                <ChevronLeft size={16} />
              </NavButton>
              <NavButton
                $size={24}
                $shadow="0px 1.85px 4.62px 0px #00000040"
                aria-label="다음 6주"
                disabled={!canGoNextWeeks}
                onClick={() => setWeekPageOffset(p => Math.max(0, p - 1))}
              >
                <ChevronRight size={16} />
              </NavButton>
            </NavButtons>
          </ChartSubHeader>
          <ChartInfo>
            <ChartVolume>
              {totalBooks}권 <span>(전체)</span>
            </ChartVolume>
            <ChartVolume>
              {monthlyAverage}권 <span>(월 평균)</span>
            </ChartVolume>
          </ChartInfo>
        </ChartHeader>
        <ChartPlot>
          {yTicks.map(tick => (
            <Gridline key={tick} $bottom={(tick / maxBarValue) * 100}>
              <GridlineLabel>{tick}</GridlineLabel>
            </Gridline>
          ))}
          <BarChartContainer>
            {weeklyData.map((data, index) => (
              <BarWrapper key={`${weekPageOffset}-${index}`}>
                <Bar $height={(data.value / maxBarValue) * 100} $highlight={data.highlight} $delay={index * 0.1}>
                  {data.value > 0 && <BarValue>{data.value}</BarValue>}
                </Bar>
              </BarWrapper>
            ))}
          </BarChartContainer>
        </ChartPlot>
        <BarLabelRow>
          {weeklyData.map((data, index) => (
            <BarLabelCell key={`${weekPageOffset}-${index}`}>
              <BarLabel $highlight={data.highlight}>{data.label}</BarLabel>
            </BarLabelCell>
          ))}
        </BarLabelRow>
      </ChartSection>

      {/* Calendar */}
      <CalendarSection>
        <CalendarHeader>
          <ChartTitle>
            독서 캘린더
            <AlertCircle size={16} color="#a3a3a3" />
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
      </CalendarSection>

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
                <LegendDot $color="#DEFFD6" />
                소설 54%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#D1FBC6" />
                에세이 34%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#BDF0AF" />
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
                <LegendDot $color="#DEFFD6" />
                소설 54%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#D1FBC6" />
                에세이 34%
              </LegendItem>
              <LegendItem>
                <LegendDot $color="#BDF0AF" />
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
          <AlertCircle size={16} color="#a3a3a3" />
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
