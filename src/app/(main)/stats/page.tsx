'use client';

import styled, { keyframes } from 'styled-components';
import { Button, StatsGrid, StatCard, NavButtons, NavButton, BookCard } from '@/components/common';
import { ReadingCalendar } from '@/components/stats';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { ArrowRight, ChevronLeft, ChevronRight, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/api/useMe';
import { getMockReadingLevel, computeStatsData, computeWeeklyData, computeWeekNavState, computeBarChartAxis } from '@/mocks';
import { PieChart } from '@/components/common/PieChart';
import { useMyLibraries } from '@/api/useLibrary';


const Container = styled.div`
  max-width: 1200px;
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
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.quinary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

// Quarterly Section
const QuarterlySection = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
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
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-align: left;
`;

const GenreBox = styled.div`
  background: #f8f8f8;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const QuarterGenre = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const QuarterSecondGenres = styled.div`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const QuarterThirdGenres = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Stale Reading Section
const StaleSection = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StaleBooks = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1rem;
`;

const StaleBookItem = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const StaleBookDate = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  margin-top: 0.75rem;
`;

const ShowMoreToggle = styled.button`
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

export default function StatsPage() {
  const router = useRouter();
  const [weekPageOffset, setWeekPageOffset] = useState(0);
  const [staleShowCount, setStaleShowCount] = useState(7);

  const { data: me } = useMe();
  const readingLevel = getMockReadingLevel(me?.uuid);

  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');
  const { data: readingLibrary = [] } = useMyLibraries('READING');

  // TODO: API 연동 시 completedLibrary / readingLibrary 를 API 응답으로 교체
  const { totalBooks, averageReadingDays, monthlyAverage, staleBooks, mostRecentFinishedAt, earliestFinishedAt } =
    computeStatsData(completedLibrary, readingLibrary);

  const weeklyData = computeWeeklyData(completedLibrary, mostRecentFinishedAt, weekPageOffset);
  const { maxBarValue, yTicks } = computeBarChartAxis(weeklyData);
  const { canGoPrev: canGoPrevWeeks, canGoNext: canGoNextWeeks } = computeWeekNavState(
    earliestFinishedAt,
    weekPageOffset,
  );

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Level>
            나의 독서 레벨 Lv.{readingLevel.level} - {readingLevel.title}
          </Level>
          <LevelDesc>&quot;{readingLevel.description}&quot;</LevelDesc>
        </HeaderLeft>
        <ShareButton variant="cta" rightIcon={<ArrowRight size={20} />} onClick={() => router.push('/stats/share')}>
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
            <SectionTitle>
              월별 독서량
              <AlertCircle size={16} color="#a3a3a3" />
            </SectionTitle>
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

      <ReadingCalendar />

      {/* Pie Charts */}
      <PieChart />

      {/* Quarterly */}
      <QuarterlySection>
        <SectionTitle>분기별 많이 읽은 장르</SectionTitle>
        <QuarterlyGrid>
          <QuarterCard>
            <QuarterLabel>1분기</QuarterLabel>
            <GenreBox>
              <QuarterGenre>스릴러 65%</QuarterGenre>
              <QuarterSecondGenres>로맨스 23%</QuarterSecondGenres>
              <QuarterThirdGenres>성장 13%</QuarterThirdGenres>
            </GenreBox>
          </QuarterCard>
          <QuarterCard>
            <QuarterLabel>2분기</QuarterLabel>
            <GenreBox>
              <QuarterGenre>라이트노벨 65%</QuarterGenre>
              <QuarterSecondGenres>로맨스 23%</QuarterSecondGenres>
              <QuarterThirdGenres>로맨스 13%</QuarterThirdGenres>
            </GenreBox>
          </QuarterCard>
          <QuarterCard>
            <QuarterLabel>3분기</QuarterLabel>
            <GenreBox>
              <QuarterGenre>예술/대중문화 65%</QuarterGenre>
              <QuarterSecondGenres>로맨스 23%</QuarterSecondGenres>
              <QuarterThirdGenres>로맨스 13%</QuarterThirdGenres>
            </GenreBox>
          </QuarterCard>
          <QuarterCard>
            <QuarterLabel>4분기</QuarterLabel>
            <GenreBox>
              <QuarterGenre>스릴러 65%</QuarterGenre>
              <QuarterSecondGenres>로맨스 23%</QuarterSecondGenres>
              <QuarterThirdGenres>로맨스 13%</QuarterThirdGenres>
            </GenreBox>
          </QuarterCard>
        </QuarterlyGrid>
      </QuarterlySection>

      {/* Stale Reading */}
      <StaleSection>
        <SectionTitle>
          아직 이 책을 읽고 계신가요?
          <AlertCircle size={16} color="#a3a3a3" />
        </SectionTitle>
        <StaleBooks>
          {staleBooks.slice(0, staleShowCount).map(book => (
            <StaleBookItem key={book.uuid}>
              <BookCard book={book} size="sm" showTitle={false} />
              <StaleBookDate>
                {book.date}부터
                <br />
                읽는 중
              </StaleBookDate>
            </StaleBookItem>
          ))}
        </StaleBooks>
        {staleBooks.length > 7 && (
          <ShowMoreToggle
            onClick={() => (staleShowCount >= staleBooks.length ? setStaleShowCount(7) : setStaleShowCount(c => c + 7))}
          >
            {staleShowCount >= staleBooks.length ? (
              <>
                접기 <ChevronUp size={16} />
              </>
            ) : (
              <>
                더보기 <ChevronDown size={16} />
              </>
            )}
          </ShowMoreToggle>
        )}
      </StaleSection>
    </Container>

  );
}
