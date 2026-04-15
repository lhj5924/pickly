'use client';

import styled from 'styled-components';

export const NavButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

export const NavButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  box-shadow: 0px 4.44px 31.06px 0px #b8b8b840;

  &:disabled {
    color: ${({ theme }) => theme.colors.neutral[300]};
    cursor: not-allowed;
  }
`;
