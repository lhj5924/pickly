'use client';

import styled from 'styled-components';
import { BookCard, StatsGrid, StatCard } from '@/components/common';
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
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
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

const BooksScroll = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.neutral[100]};
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neutral[300]};
    border-radius: 2px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 0.9375rem;
`;

const FooterNav = styled.div`
  text-align: center;
  padding: 2rem 0;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export default function LibraryPage() {
  const completedBooks = getCompletedBooks();
  const readingBooks = getReadingBooks();
  const wishlistBooks = getWishlistBooks();
  const totalRead = readingStats.totalBooks;

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
      <Section>
        <BookGrid>
          {completedBooks.map(book => (
            <BookCard key={book.id} book={book} size="sm" />
          ))}
        </BookGrid>
      </Section>

      {/* Reading Books */}
      <Section>
        <SectionTitle>보는 중인 작품이 {readingBooks.length}개에요 한 개부터 차근차근 읽어볼까요?</SectionTitle>
        {readingBooks.length > 0 ? (
          <BooksScroll>
            {readingBooks.map(book => (
              <BookCard key={book.id} book={book} size="sm" showProgress />
            ))}
          </BooksScroll>
        ) : (
          <EmptyState>아직 읽고 있는 책이 없어요</EmptyState>
        )}
      </Section>

      {/* Wishlist Books */}
      <Section>
        <SectionTitle>보고 싶어요가 {wishlistBooks.length}개 쌓였어요 지금 시작해볼 작품을 골라보세요</SectionTitle>
        {wishlistBooks.length > 0 ? (
          <BookGrid>
            {wishlistBooks.map(book => (
              <BookCard key={book.id} book={book} size="md" />
            ))}
          </BookGrid>
        ) : (
          <EmptyState>보고 싶은 책을 추가해보세요</EmptyState>
        )}
      </Section>

      <FooterNav>1 / 1</FooterNav>
    </Container>
  );
}
