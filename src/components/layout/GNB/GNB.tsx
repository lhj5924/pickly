'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Logo } from '@/components/common';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  font-size: 0.9375rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary[600] : theme.colors.text.secondary)};
  font-family: 'Pretendard Variable', sans-serif;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[200]};
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
    border-radius: 50%;
  }
`;

const SearchInput = styled.input`
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  width: 180px;
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const navItems = [
  { href: '/home', label: '홈' },
  { href: '/recommend', label: '추천' },
  { href: '/library', label: '라이브러리' },
  { href: '/stats', label: '통계' },
  { href: '/mypage', label: '마이페이지' },
  { href: '/review', label: '리뷰' },
];

export const GNB = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/search');
  };

  return (
    <Header>
      <Container>
        <Logo href="/home" />

        <Nav>
          {navItems.map(item => (
            <NavLink
              key={item.href}
              href={item.href}
              $active={pathname === item.href || pathname.startsWith(item.href + '/')}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>

        <SearchWrapper onClick={handleSearchClick}>
          <Search size={18} color="#737373" />
          <SearchInput placeholder="검색" readOnly />
        </SearchWrapper>
      </Container>
    </Header>
  );
};
