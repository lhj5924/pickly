'use client';

import { BookCard, ReviewCard, StatCard, StatsGrid } from '@/components/common';
import { Button } from '@/components/common/Button/Button';
import { Logo } from '@/components/common/Logo/Logo';
import { PieChart } from '@/components/common/PieChart';
import { BooksIcon, CalendarIcon, OpenedBookIcon } from '@/components/icons/StatIcons';
import { Footer } from '@/components/layout';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { BackgroundGradient1, BackgroundGradient2 } from '@/components/common/BackgroundGradient';
import type { PieChartDataItem } from '@/components/common/PieChart/PieChart';

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
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
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
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
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

// 랜딩 페이지용 예시 통계 (로그인 전 마케팅 데이터)
const EXAMPLE_STATS = {
  totalBooks: 42,
  averageReadingDays: 8,
  monthlyAverage: 3.5,
};

const EXAMPLE_GENRE_DATA: PieChartDataItem[] = [
  { name: '소설', value: 54 },
  { name: '에세이', value: 34 },
  { name: '경제경영', value: 12 },
];

const EXAMPLE_KEYWORD_DATA: PieChartDataItem[] = [
  { name: '성장', value: 35 },
  { name: '로맨스', value: 25 },
  { name: '힐링', value: 10 },
  { name: '판타지', value: 20 },
  { name: '자기계발', value: 5 },
  { name: '역사', value: 5 },
];

const EXAMPLE_REVIEWS = [
  {
    uuid: 'example-review-1',
    bookTitle: '82년생 김지영',
    bookCoverImage: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937473135.jpg',
    content:
      "'82년생 김지영'은 평범한 여성의 일상을 통해 한국 사회에 만연한 불평등과 차별을 담담하고 현실적으로 그려낸 소설입니다.\n읽는 내내 저와 엄마, 친구들의 삶이 겹쳐지며 깊은 공감과 함께 가슴 한편이 답답하고 씁쓸한 기분이 들었어요.\n때로는 불편하게 다가왔지만, 우리 사회의 현실을 직시하고 더 나은 미래를 고민하게 하는 큰 울림이 있어 꼭 읽어보시길 바라요.",
  },
  {
    uuid: 'example-review-2',
    bookTitle: '채식주의자',
    bookCoverImage: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434595.jpg',
    content:
      '한강 작가 특유의 강렬하고 파격적인 문장으로, 폭력에 저항하는 한 여성의 내면과 외부 세계의 충돌을 섬세하게 그려낸 소설이었어요.',
  },
];

// 랜딩용 예시 책 목록 (마케팅 용도)
const EXAMPLE_BOOKS = [
  {
    uuid: 'ex-1',
    title: '82년생 김지영',
    authors: ['조남주'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937473135.jpg',
  },
  {
    uuid: 'ex-2',
    title: '채식주의자',
    authors: ['한강'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788936434595.jpg',
  },
  {
    uuid: 'ex-3',
    title: '아몬드',
    authors: ['손원평'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791198363510.jpg',
  },
  {
    uuid: 'ex-4',
    title: '하얼빈',
    authors: ['김훈'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9788954699914.jpg',
  },
  {
    uuid: 'ex-5',
    title: '불편한 편의점',
    authors: ['김호연'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791161571188.jpg',
  },
  {
    uuid: 'ex-6',
    title: '달러구트 꿈 백화점',
    authors: ['이미예'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791165341909.jpg',
  },
  {
    uuid: 'ex-7',
    title: '파친코',
    authors: ['이민진'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791168340510.jpg',
  },
  {
    uuid: 'ex-8',
    title: '트렌드 코리아 2026',
    authors: ['김난도'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791193638859.jpg',
  },
  {
    uuid: 'ex-9',
    title: '나미야 잡화점의 기적',
    authors: ['히가시노 게이고'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/450D000229856.jpg',
  },
  {
    uuid: 'ex-10',
    title: '어린 왕자',
    authors: ['생텍쥐페리'],
    thumbnailUrl: 'https://contents.kyobobook.co.kr/sih/fit-in/200x0/pdt/9791164455300.jpg',
  },
];

export default function LandingPage() {
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
              value={`${EXAMPLE_STATS.totalBooks}권`}
              icon={<OpenedBookIcon size={24} />}
              animate
            />
            <StatCard
              label="평균 독서 기간"
              value={`${EXAMPLE_STATS.averageReadingDays}일`}
              icon={<CalendarIcon size={24} />}
              animate
            />
            <StatCard
              label="월 평균 권 수"
              value={`${EXAMPLE_STATS.monthlyAverage}권`}
              icon={<BooksIcon size={24} />}
              animate
            />
          </StatsGrid>
          <PieChart genreData={EXAMPLE_GENRE_DATA} keywordData={EXAMPLE_KEYWORD_DATA} />
        </StatsSection>

        <ReviewSection>
          <SectionTitle>읽은 책을 간단히 기록하고 나만의 독서 이력을 쌓아보세요</SectionTitle>
          <ReviewGrid ref={reviewGridRef}>
            {EXAMPLE_REVIEWS.map((review, index) => (
              <AnimatedCardWrapper key={review.uuid} $visible={reviewsVisible} $delay={index * 0.2}>
                <ReviewCard
                  id={review.uuid}
                  bookTitle={review.bookTitle}
                  bookCoverImage={review.bookCoverImage}
                  content={review.content}
                />
              </AnimatedCardWrapper>
            ))}
          </ReviewGrid>
        </ReviewSection>

        <RecommendationSection>
          <SectionTitle>당신의 독서 이력을 기반으로, 취향에 맞는 책을 추천합니다</SectionTitle>
          <RecommendationBooks>
            <ScrollTrack>
              {EXAMPLE_BOOKS.map(book => (
                <BookCard key={book.uuid} book={book} size="md" />
              ))}
              {EXAMPLE_BOOKS.map(book => (
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
