// ============================================================
// src/mocks/mockLibraries.ts
// Dev-only mock library items keyed by status.
// 5-per-row grid × 2.5 ≈ 13 cards per section.
// ============================================================

import type { LibraryItem } from '@/types/library';
import type { BookStatus } from '@/types/book';
import { mockBooks } from './mockBooks';

const COMPLETED_BOOKS = mockBooks.slice(0, 13);
const READING_BOOKS = mockBooks.slice(13, 26);
const WISHLIST_BOOKS = mockBooks.slice(26, 39);

const daysAgo = (d: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
};

const mockCompleted: LibraryItem[] = COMPLETED_BOOKS.map((book, i) => ({
  uuid: `mock-lib-completed-${String(i + 1).padStart(3, '0')}`,
  book,
  status: 'COMPLETED',
  startedAt: daysAgo(30 + i * 14),
  finishedAt: daysAgo(15 + i * 14),
  createdAt: daysAgo(30 + i * 14),
}));

const mockReading: LibraryItem[] = READING_BOOKS.map((book, i) => ({
  uuid: `mock-lib-reading-${String(i + 1).padStart(3, '0')}`,
  book,
  status: 'READING',
  startedAt: daysAgo(7 + i * 3),
  finishedAt: null,
  createdAt: daysAgo(7 + i * 3),
}));

const mockWishlist: LibraryItem[] = WISHLIST_BOOKS.map((book, i) => ({
  uuid: `mock-lib-wishlist-${String(i + 1).padStart(3, '0')}`,
  book,
  status: 'WANT_TO_READ',
  startedAt: null,
  finishedAt: null,
  createdAt: daysAgo(2 + i),
}));

export const mockLibraries: LibraryItem[] = [
  ...mockCompleted,
  ...mockReading,
  ...mockWishlist,
];

export const getMockLibraries = (status?: BookStatus): LibraryItem[] => {
  if (!status) return mockLibraries;
  return mockLibraries.filter(item => item.status === status);
};
