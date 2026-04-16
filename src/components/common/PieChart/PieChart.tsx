'use client';

import { useState, useEffect, useId, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { AnimatedPieChart } from '../AnimatedPieChart';
import { useMyLibraries } from '@/api/useLibrary';

// UI-only 차트/배너 데이터는 아직 서버 API가 없어 로컬 상수로 유지합니다 (Stage 3).
const genreChartData = [
  { name: '소설', value: 54 },
  { name: '에세이', value: 34 },
  { name: '경제경영', value: 12 },
];

const keywordChartData = [
  { name: '성장', value: 35 },
  { name: '로맨스', value: 25 },
  { name: '힐링', value: 10 },
  { name: '판타지', value: 20 },
  { name: '자기계발', value: 5 },
  { name: '역사', value: 5 },
];

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

export const PieChart: React.FC<{ className?: string }> = ({ className }) => {
  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');
  const hasData = completedLibrary.length > 0;
  const [chartAnimated, setChartAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <ChartSection ref={chartRef} className={className}>
        <ChartTitle>당신은 {keywordChartData[0]?.name} 중심의 소설을 가장 많이 소비해요</ChartTitle>
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
    </>
  );
};
