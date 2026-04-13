'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { BookCard, StatsGrid, StatCard, ShowMoreToggle } from '@/components/common';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { readingStats, getCompletedBooks, getReadingBooks, getWishlistBooks } from '@/data/mockData';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const StatsGridMargin = styled.div`
  margin-bottom: 2.5rem;
`;

const Section = styled.section`
  margin-bottom: 6rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 3rem;
`;

const BookGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 0.9375rem;
`;


const FIRST_ROW_COUNT = 5;
const LOAD_MORE_COUNT = 10;

export default function LibraryPage() {
  const completedBooks = getCompletedBooks();
  const readingBooks = getReadingBooks();
  const wishlistBooks = getWishlistBooks();
  const totalRead = readingStats.totalBooks;

  const [completedVisible, setCompletedVisible] = useState(FIRST_ROW_COUNT);
  const [readingVisible, setReadingVisible] = useState(FIRST_ROW_COUNT);
  const [wishlistVisible, setWishlistVisible] = useState(FIRST_ROW_COUNT);

  return (
    <Container>
      {/* Stats Section */}
      <SectionTitle>지금까지 총 {totalRead}권의 책을 읽었어요!</SectionTitle>
      <StatsGridMargin>
        <StatsGrid>
          <StatCard label="총 읽은 책 수" value={`${readingStats.totalBooks}권`} icon={<OpenedBookIcon size={24} />} />
          <StatCard
            label="평균 독서 기간"
            value={`${readingStats.averageReadingDays}일`}
            icon={<CalendarIcon size={24} />}
          />
          <StatCard label="월 평균 권 수" value={`${readingStats.monthlyAverage}권`} icon={<BooksIcon size={24} />} />
        </StatsGrid>
      </StatsGridMargin>

      {/* Completed Books */}
      {totalRead > 0 ? (
        <Section>
          <BookGrid>
            {completedBooks.slice(0, completedVisible).map(book => (
              <BookCard key={book.id} book={book} size="sm" />
            ))}
          </BookGrid>
          {completedBooks.length > FIRST_ROW_COUNT && (
            <ShowMoreToggle
              expanded={completedVisible >= completedBooks.length}
              onToggle={() =>
                setCompletedVisible(prev => (prev >= completedBooks.length ? FIRST_ROW_COUNT : prev + LOAD_MORE_COUNT))
              }
            />
          )}
        </Section>
      ) : (
        <EmptyState>아직 완독한 책이 없어요. 읽고 싶은 책을 추가해보세요!</EmptyState>
      )}

      {/* Reading Books */}
      <Section>
        <SectionTitle>읽고 있는 작품이 {readingBooks.length}권이에요. 한 권부터 차근차근 읽어볼까요?</SectionTitle>
        {readingBooks.length > 0 ? (
          <>
            <BookGrid>
              {readingBooks.slice(0, readingVisible).map(book => (
                <BookCard key={book.id} book={book} size="sm" showProgress />
              ))}
            </BookGrid>
            {readingBooks.length > FIRST_ROW_COUNT && (
              <ShowMoreToggle
                expanded={readingVisible >= readingBooks.length}
                onToggle={() =>
                  setReadingVisible(prev => (prev >= readingBooks.length ? FIRST_ROW_COUNT : prev + LOAD_MORE_COUNT))
                }
              />
            )}
          </>
        ) : (
          <EmptyState>아직 읽고 있는 책이 없어요.</EmptyState>
        )}
      </Section>

      {/* Wishlist Books */}
      <Section>
        <SectionTitle>'보고 싶어요'가 {wishlistBooks.length}권 쌓였어요. 지금 시작해볼 작품을 골라보세요.</SectionTitle>
        {wishlistBooks.length > 0 ? (
          <>
            <BookGrid>
              {wishlistBooks.slice(0, wishlistVisible).map(book => (
                <BookCard key={book.id} book={book} size="sm" />
              ))}
            </BookGrid>
            {wishlistBooks.length > FIRST_ROW_COUNT && (
              <ShowMoreToggle
                expanded={wishlistVisible >= wishlistBooks.length}
                onToggle={() =>
                  setWishlistVisible(prev => (prev >= wishlistBooks.length ? FIRST_ROW_COUNT : prev + LOAD_MORE_COUNT))
                }
              />
            )}
          </>
        ) : (
          <EmptyState>보고 싶은 책을 추가해보세요.</EmptyState>
        )}
      </Section>
    </Container>
  );
}
