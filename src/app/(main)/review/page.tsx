'use client';

import styled from 'styled-components';
import { Button, ReviewCard } from '@/components/common';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useMyReviews } from '@/api/useReview';

const Container = styled.div`
  max-width: 900px;
  margin: 1rem auto;
  padding: 2rem 1.5rem 4rem;
  box-shadow: 0px 20px 44px 0px #dadada40;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
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

const WriteButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

export default function ReviewPage() {
  const { data: reviews = [], isLoading } = useMyReviews();

  return (
    <Container>
      <Title>내가 작성한 리뷰</Title>
      <ReviewGrid>
        {isLoading && <p>리뷰를 불러오는 중입니다…</p>}
        {!isLoading &&
          reviews.map(review => (
            <ReviewCard
              key={review.uuid}
              id={review.uuid}
              bookTitle={review.book.title}
              bookCoverImage={review.book.thumbnailUrl}
              content={review.content}
            />
          ))}
      </ReviewGrid>
      <WriteButtonWrapper>
        <Button variant="cta" as={Link} href="/review/write" rightIcon={<ArrowRight size={24} />}>
          내가 읽은 책 리뷰 쓰러 가기
        </Button>
      </WriteButtonWrapper>
    </Container>
  );
}
