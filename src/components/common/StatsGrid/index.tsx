'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type { ReactNode } from 'react';

const StatsGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCardWrapper = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatLabel = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.quinary};
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const StatIconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0ffe0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const EmptyStatValue = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

interface StatCardProps {
  label: string;
  value?: string;
  icon: ReactNode;
  emptyText?: string;
  animate?: boolean;
}

function StatCard({ label, value, icon, emptyText = '아직 데이터가 없습니다', animate = false }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState<string | undefined>(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayValue(value);
    setHasAnimated(false);
  }, [value]);

  useEffect(() => {
    if (!animate || !value || hasAnimated) return;

    const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) return;

    const targetNum = parseFloat(match[1]);
    const suffix = match[2];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
          const duration = 1500;
          const startTime = Date.now();
          setDisplayValue(`0${suffix}`);
          const timer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * targetNum);
            setDisplayValue(`${current}${suffix}`);
            if (progress >= 1) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.3 },
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [animate, value, hasAnimated]);

  return (
    <StatCardWrapper ref={wrapperRef}>
      <StatHeader>
        <StatLabel>{label}</StatLabel>
        <StatIconWrapper>{icon}</StatIconWrapper>
      </StatHeader>
      <StatInfo>
        {displayValue ? <StatValue>{displayValue}</StatValue> : <EmptyStatValue>{emptyText}</EmptyStatValue>}
      </StatInfo>
    </StatCardWrapper>
  );
}

interface StatsGridProps {
  children: ReactNode;
}

function StatsGrid({ children }: StatsGridProps) {
  return <StatsGridWrapper>{children}</StatsGridWrapper>;
}

export { StatsGrid, StatCard };
