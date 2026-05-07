'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AnimatedPieChart } from '../AnimatedPieChart';

export type PieChartDataItem = { name: string; value: number };

const DEFAULT_KEYWORD_DATA: PieChartDataItem[] = [
  { name: '성장', value: 35 },
  { name: '로맨스', value: 25 },
  { name: '힐링', value: 10 },
  { name: '판타지', value: 20 },
  { name: '자기계발', value: 5 },
  { name: '역사', value: 5 },
];

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

interface PieChartProps {
  className?: string;
  genreData?: PieChartDataItem[];
  keywordData?: PieChartDataItem[];
}

export const PieChart: React.FC<PieChartProps> = ({ className, genreData, keywordData }) => {
  const hasData = genreData !== undefined && genreData.length > 0;
  const resolvedKeywordData = keywordData ?? DEFAULT_KEYWORD_DATA;
  const [chartAnimated, setChartAnimated] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

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

  const topGenre = genreData?.[0]?.name;
  const chartTitle = topGenre
    ? `당신은 ${topGenre} 장르를 가장 많이 읽었어요`
    : '당신은 어떤 장르를 즐겨 읽으시나요?';

  return (
    <ChartSection ref={chartRef} className={className}>
      <ChartTitle>{chartTitle}</ChartTitle>
      {hasData ? (
        <ChartContainer>
          <PieChartWrapper>
            <PieChartLabel>장르별 독서량</PieChartLabel>
            <PieChartContainer>
              <AnimatedPieChart data={genreData!} animate={chartAnimated} />
            </PieChartContainer>
          </PieChartWrapper>
          <PieChartWrapper>
            <PieChartLabel>키워드별 독서량</PieChartLabel>
            <PieChartContainer>
              <AnimatedPieChart data={resolvedKeywordData} animate={chartAnimated} />
            </PieChartContainer>
          </PieChartWrapper>
        </ChartContainer>
      ) : (
        <EmptyChart>아직 데이터가 없습니다</EmptyChart>
      )}
    </ChartSection>
  );
};
