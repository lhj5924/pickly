'use client';

import styled from 'styled-components';

export const NavButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const NavButton = styled.button<{ $size?: number; $shadow?: string }>`
  width: ${({ $size = 44 }) => $size}px;
  height: ${({ $size = 44 }) => $size}px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  box-shadow: ${({ $shadow }) => $shadow ?? '0px 4.44px 31.06px 0px #b8b8b840'};

  &:disabled {
    color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;
