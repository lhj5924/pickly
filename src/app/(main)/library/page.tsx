'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { BookCard, StatsGrid, StatCard, ShowMoreToggle } from '@/components/common';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { useMyLibraries } from '@/api/useLibrary';

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

const daysBetween = (a: string, b: string) => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

export default function LibraryPage() {
  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');
  const { data: readingLibrary = [] } = useMyLibraries('READING');
  const { data: wishlistLibrary = [] } = useMyLibraries('WANT_TO_READ');

  const totalRead = completedLibrary.length;

  const averageReadingDays = completedLibrary.length
    ? Math.round(
        completedLibrary
          .filter(item => item.startedAt && item.finishedAt)
          .reduce((sum, item) => sum + daysBetween(item.startedAt!, item.finishedAt!), 0) /
          Math.max(1, completedLibrary.filter(item => item.startedAt && item.finishedAt).length),
      )
    : 0;

  const monthlyAverage = completedLibrary.length
    ? Math.round((completedLibrary.length / 12) * 10) / 10
    : 0;

  const [completedVisible, setCompletedVisible] = useState(FIRST_ROW_COUNT);
  const [readingVisible, setReadingVisible] = useState(FIRST_ROW_COUNT);
  const [wishlistVisible, setWishlistVisible] = useState(FIRST_ROW_COUNT);

  return (
    <Container>
      {/* Stats Section */}
      <SectionTitle>지금까지 총 {totalRead}권의 책을 읽었어요!</SectionTitle>
      <StatsGridMargin>
        <StatsGrid>
          <StatCard label="총 읽은 책 수" value={`${totalRead}권`} icon={<OpenedBookIcon size={24} />} />
          <StatCard label="평균 독서 기간" value={`${averageReadingDays}일`} icon={<CalendarIcon size={24} />} />
          <StatCard label="월 평균 권 수" value={`${monthlyAverage}권`} icon={<BooksIcon size={24} />} />
        </StatsGrid>
      </StatsGridMargin>

      {/* Completed Books */}
      {totalRead > 0 ? (
        <Section>
          <BookGrid>
            {completedLibrary.slice(0, completedVisible).map(item => (
              <BookCard key={item.uuid} book={item.book} size="sm" initialStatus="completed" />
            ))}
          </BookGrid>
          {completedLibrary.length > FIRST_ROW_COUNT && (
            <ShowMoreToggle
              expanded={completedVisible >= completedLibrary.length}
              onToggle={() =>
                setCompletedVisible(prev =>
                  prev >= completedLibrary.length ? FIRST_ROW_COUNT : prev + LOAD_MORE_COUNT,
                )
              }
            />
          )}
        </Section>
      ) : (
        <EmptyState>아직 완독한 책이 없어요. 읽고 싶은 책을 추가해보세요!</EmptyState>
      )}

      {/* Reading Books */}
      <Section>
        <SectionTitle>
          읽고 있는 작품이 {readingLibrary.length}권이에요. 한 권부터 차근차근 읽어볼까요?
        </SectionTitle>
        {readingLibrary.length > 0 ? (
          <>
            <BookGrid>
              {readingLibrary.slice(0, readingVisible).map(item => (
                <BookCard key={item.uuid} book={item.book} size="sm" showProgress initialStatus="reading" />
              ))}
            </BookGrid>
            {readingLibrary.length > FIRST_ROW_COUNT && (
              <ShowMoreToggle
                expanded={readingVisible >= readingLibrary.length}
                onToggle={() =>
                  setReadingVisible(prev =>
                    prev >= readingLibrary.length ? FIRST_ROW_COUNT : prev + LOAD_MORE_COUNT,
                  )
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
        <SectionTitle>
          &apos;보고 싶어요&apos;가 {wishlistLibrary.length}권 쌓였어요. 지금 시작해볼 작품을 골라보세요.
        </SectionTitle>
        {wishlistLibrary.length > 0 ? (
          <>
            <BookGrid>
              {wishlistLibrary.slice(0, wishlistVisible).map(item => (
                <BookCard key={item.uuid} book={item.book} size="sm" initialStatus="wishlist" />
              ))}
            </BookGrid>
            {wishlistLibrary.length > FIRST_ROW_COUNT && (
              <ShowMoreToggle
                expanded={wishlistVisible >= wishlistLibrary.length}
                onToggle={() =>
                  setWishlistVisible(prev =>
                    prev >= wishlistLibrary.length ? FIRST_ROW_COUNT : prev + LOAD_MORE_COUNT,
                  )
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
