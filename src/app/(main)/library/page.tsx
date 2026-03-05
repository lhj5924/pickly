'use client';

import styled from 'styled-components';
import { BookCard } from '@/components/common';
import { Book, Calendar, BarChart3 } from 'lucide-react';
import {
  readingStats,
  getCompletedBooks,
  getReadingBooks,
  getWishlistBooks,
} from '@/data/mockData';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.quinary};
`;

const StatValue = styled.p`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const StatIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.25rem;
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
      <PageTitle>지금까지 총 {totalRead}권의 책을 읽었어요!</PageTitle>

      <StatsGrid>
        <StatCard>
          <StatInfo>
            <StatLabel>총 읽은 책 수</StatLabel>
            <StatValue>{readingStats.totalBooks}권</StatValue>
          </StatInfo>
          <StatIcon><Book size={24} /></StatIcon>
        </StatCard>
        <StatCard>
          <StatInfo>
            <StatLabel>평균 독서 기간</StatLabel>
            <StatValue>{readingStats.averageReadingDays}일</StatValue>
          </StatInfo>
          <StatIcon><Calendar size={24} /></StatIcon>
        </StatCard>
        <StatCard>
          <StatInfo>
            <StatLabel>월 평균 권 수</StatLabel>
            <StatValue>{readingStats.monthlyAverage}권</StatValue>
          </StatInfo>
          <StatIcon><BarChart3 size={24} /></StatIcon>
        </StatCard>
      </StatsGrid>

      {/* Completed Books */}
      <Section>
        <BookGrid>
          {completedBooks.map((book) => (
            <BookCard key={book.id} book={book} size="md" />
          ))}
        </BookGrid>
      </Section>

      {/* Reading Books */}
      <Section>
        <SectionTitle>
          보는 중인 작품이 {readingBooks.length}개에요 한 개부터 차근차근 읽어볼까요?
        </SectionTitle>
        {readingBooks.length > 0 ? (
          <BooksScroll>
            {readingBooks.map((book) => (
              <BookCard key={book.id} book={book} size="sm" showProgress />
            ))}
          </BooksScroll>
        ) : (
          <EmptyState>아직 읽고 있는 책이 없어요</EmptyState>
        )}
      </Section>

      {/* Wishlist Books */}
      <Section>
        <SectionTitle>
          보고 싶어요가 {wishlistBooks.length}개 쌓였어요 지금 시작해볼 작품을 골라보세요
        </SectionTitle>
        {wishlistBooks.length > 0 ? (
          <BookGrid>
            {wishlistBooks.map((book) => (
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
