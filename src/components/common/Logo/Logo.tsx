'use client';

import styled from 'styled-components';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  size?: string;
  className?: string;
}

const StyledLogo = styled(Link)<{ $size: string }>`
  font-size: ${({ $size }) => $size};
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-family: 'Titan One', 'Georgia', serif;
`;

export const Logo = ({ href = '/home', size = '1.5rem', className }: LogoProps) => (
  <StyledLogo href={href} $size={size} className={className}>
    Pickly
  </StyledLogo>
);
