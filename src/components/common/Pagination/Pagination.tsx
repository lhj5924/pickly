'use client';

import styled, { css } from 'styled-components';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePagination } from '@/hooks/usePagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  const items = usePagination(currentPage, totalPages, siblingCount);

  if (totalPages <= 1) return null;

  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  return (
    <Nav aria-label="Pagination">
      <ArrowButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isFirst}
        aria-label="이전 페이지"
        aria-disabled={isFirst}
      >
        <ChevronLeft size={18} />
      </ArrowButton>

      <DesktopPages>
        {items.map((item, idx) =>
          item === 'ellipsis' ? (
            <Ellipsis key={`e-${idx}`} aria-hidden>
              &hellip;
            </Ellipsis>
          ) : (
            <PageButton
              key={item}
              $active={item === currentPage}
              onClick={() => onPageChange(item)}
              disabled={item === currentPage}
              aria-current={item === currentPage ? 'page' : undefined}
              aria-label={`${item}페이지`}
            >
              {item}
            </PageButton>
          ),
        )}
      </DesktopPages>

      <MobileIndicator>
        {currentPage} / {totalPages}
      </MobileIndicator>

      <ArrowButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isLast}
        aria-label="다음 페이지"
        aria-disabled={isLast}
      >
        <ChevronRight size={18} />
      </ArrowButton>
    </Nav>
  );
};

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 2rem 0 1rem;
`;

const buttonBase = css`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.15s ease;
  font-family: 'Pretendard Variable', sans-serif;

  &:disabled {
    cursor: default;
  }
`;

const ArrowButton = styled.button`
  ${buttonBase}
  width: 36px;
  height: 36px;
  color: ${({ theme }) => theme.colors.text.secondary};

  &:not(:disabled):hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.neutral[300]};
  }
`;

const PageButton = styled.button<{ $active: boolean }>`
  ${buttonBase}
  min-width: 36px;
  height: 36px;
  padding: 0 0.25rem;
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ theme, $active }) =>
    $active ? '#fff' : theme.colors.text.secondary};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary[600] : 'transparent'};

  &:not(:disabled):hover {
    background: ${({ theme, $active }) =>
      $active ? theme.colors.primary[600] : theme.colors.neutral[100]};
    color: ${({ theme, $active }) =>
      $active ? '#fff' : theme.colors.text.primary};
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  user-select: none;
`;

const DesktopPages = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

const MobileIndicator = styled.span`
  display: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 0 0.75rem;

  @media (max-width: 640px) {
    display: block;
  }
`;
