'use client';

import { useMyLibraries } from '@/api/useLibrary';
import { useMyReviews } from '@/api/useReview';
import { BookCard, ReviewCard, StatCard, StatsGrid } from '@/components/common';
import { Button } from '@/components/common/Button/Button';
import { Logo } from '@/components/common/Logo/Logo';
import { PieChart } from '@/components/common/PieChart';
import { BooksIcon, CalendarIcon, OpenedBookIcon } from '@/components/icons/StatIcons';
import { computeStatsData, mockBooks } from '@/mocks';
import { Footer } from '@/components/layout';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { BackgroundGradient1, BackgroundGradient2 } from '../home/page';

const GNB_HEIGHT = 60;

const snapSection = `
  height: calc(100vh - ${GNB_HEIGHT}px);
  scroll-snap-align: start;
  overflow: hidden;
  flex-shrink: 0;
`;

const SnapWrapper = styled.div`
  height: calc(100vh - ${GNB_HEIGHT}px);
  overflow-y: scroll;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`;

const HeaderSection = styled.section`
  ${snapSection}
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 2rem 1.5rem;
  gap: 1rem;
  background: linear-gradient(155.99deg, #ffe5cc 10.49%, #d2ffca 93.28%);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const JarImage = styled.div`
  animation: ${float} 4s ease-in-out infinite;
  position: absolute;
  bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
`;

const StatsSection = styled.section`
  ${snapSection}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem;

  > * {
    width: 100%;
    max-width: 1200px;
  }
`;

const ReviewSection = styled.section`
  ${snapSection}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem;

  > * {
    width: 100%;
    max-width: 1200px;
  }
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5rem 1.5rem;
  padding-top: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedCardWrapper = styled.div<{ $visible: boolean; $delay: number }>`
  opacity: 0;
  ${({ $visible, $delay }) =>
    $visible &&
    css`
      animation: ${slideUp} 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${$delay}s forwards;
    `}
`;

const RecommendationSection = styled.section`
  ${snapSection}
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1.5rem;

  > * {
    width: 100%;
    max-width: 1200px;
  }
`;

const scrollLeft = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const RecommendationBooks = styled.div`
  overflow: hidden;
  width: 100%;
`;

const ScrollTrack = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  width: max-content;
  animation: ${scrollLeft} 120s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const FooterSection = styled.section`
  scroll-snap-align: start;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default function LandingPage() {
  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');
  const { data: readingLibrary = [] } = useMyLibraries('READING');
  const { totalBooks, averageReadingDays, monthlyAverage } = computeStatsData(completedLibrary, readingLibrary);
  const { data: reviews = [], isLoading } = useMyReviews();

  const [reviewsVisible, setReviewsVisible] = useState(false);
  const reviewGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const mainEl = document.querySelector('main') as HTMLElement | null;
    const prevMainOverflow = mainEl?.style.overflow ?? '';

    document.body.style.overflow = 'hidden';
    if (mainEl) mainEl.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      if (mainEl) mainEl.style.overflow = prevMainOverflow;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReviewsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (reviewGridRef.current) observer.observe(reviewGridRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <BackgroundGradient1 />
      <BackgroundGradient2 />
      <SnapWrapper>
        <HeaderSection>
          <Subtitle>읽은 책, 남긴 생각, 쌓인 시간이 모두 당신의 취향 데이터가 됩니다.</Subtitle>
          <Title>당신의 독서 기록이 데이터가 되는 순간</Title>
          <Logo size="7rem" />
          <Button
            size="lg2"
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            시작하러 가기
          </Button>
          <JarImage>
            <Image src="/pickly-jar.png" alt="Pickly Jar" width={174} height={280} priority />
          </JarImage>
        </HeaderSection>

        <StatsSection>
          <SectionTitle>읽은 책을 분석해 취향과 독서량을 한눈에 보여줍니다</SectionTitle>
          <StatsGrid>
            <StatCard
              label="총 읽은 책 수"
              value={totalBooks ? `${totalBooks}권` : undefined}
              icon={<OpenedBookIcon size={24} />}
              animate
            />
            <StatCard
              label="평균 독서 기간"
              value={averageReadingDays ? `${averageReadingDays}일` : undefined}
              icon={<CalendarIcon size={24} />}
              animate
            />
            <StatCard
              label="월 평균 권 수"
              value={totalBooks ? `${monthlyAverage}권` : undefined}
              icon={<BooksIcon size={24} />}
              animate
            />
          </StatsGrid>
          <PieChart />
        </StatsSection>

        <ReviewSection>
          <SectionTitle>읽은 책을 간단히 기록하고 나만의 독서 이력을 쌓아보세요</SectionTitle>
          <ReviewGrid ref={reviewGridRef}>
            {isLoading && <p>리뷰를 불러오는 중입니다…</p>}
            {!isLoading &&
              reviews.slice(0, 2).map((review, index) => (
                <AnimatedCardWrapper key={review.uuid} $visible={reviewsVisible} $delay={index * 0.2}>
                  <ReviewCard
                    id={review.uuid}
                    bookTitle={review.book.title}
                    bookCoverImage={review.book.thumbnailUrl}
                    content={review.content}
                  />
                </AnimatedCardWrapper>
              ))}
          </ReviewGrid>
        </ReviewSection>

        <RecommendationSection>
          <SectionTitle>당신의 독서 이력을 기반으로, 취향에 맞는 책을 추천합니다</SectionTitle>
          {/* TODO : bestseller 혹은 trending 책 목록을 불러오기, 일단 mock 데이터 사용 */}
          <RecommendationBooks>
            <ScrollTrack>
              {mockBooks.map(book => (
                <BookCard key={book.uuid} book={book} size="md" />
              ))}
              {mockBooks.map(book => (
                <BookCard key={`clone-${book.uuid}`} book={book} size="md" />
              ))}
            </ScrollTrack>
          </RecommendationBooks>
        </RecommendationSection>

        <FooterSection>
          <Footer />
        </FooterSection>
      </SnapWrapper>
    </>
  );
}
