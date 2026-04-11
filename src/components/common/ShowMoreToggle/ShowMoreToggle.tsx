'use client';

import styled from 'styled-components';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  margin-top: 3rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  font-family: 'Pretendard Variable', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 100%;
  letter-spacing: 0%;
  color: #8d8d8d;
`;

const ArrowIcon = styled.svg`
  width: 24px;
  height: 24px;
  fill: none;
  stroke: #8d8d8d;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

interface ShowMoreToggleProps {
  expanded: boolean;
  onToggle: () => void;
}

export function ShowMoreToggle({ expanded, onToggle }: ShowMoreToggleProps) {
  return (
    <Button onClick={onToggle}>
      {expanded ? '접기' : '더보기'}
      <ArrowIcon viewBox="0 0 24 24">
        <polyline points={expanded ? '6 15 12 9 18 15' : '6 9 12 15 18 9'} />
      </ArrowIcon>
    </Button>
  );
}
