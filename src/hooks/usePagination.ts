import { useMemo } from 'react';

export type PaginationItem = number | 'ellipsis';

function range(start: number, end: number): number[] {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

export function computePagination(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PaginationItem[] {
  if (totalPages <= 0) return [];
  if (totalPages === 1) return [1];

  // 1 + siblings left + current + siblings right + last + 2 ellipsis slots
  const totalSlots = 5 + 2 * siblingCount;

  if (totalPages <= totalSlots) {
    return range(1, totalPages);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + 2 * siblingCount;
    return [...range(1, leftCount), 'ellipsis', totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblingCount;
    return [1, 'ellipsis', ...range(totalPages - rightCount + 1, totalPages)];
  }

  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', totalPages];
}

export function usePagination(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  return useMemo(
    () => computePagination(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );
}
