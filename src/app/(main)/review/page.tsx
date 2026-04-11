'use client';

import styled from 'styled-components';
import { Button } from '@/components/common';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { mockReviews } from '@/data/mockData';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  margin-bottom: 1rem;
`;

const BookTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ReviewContent = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const WriteButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

// Data from centralized mock data (replace with API calls later)

export default function ReviewPage() {
  return (
    <Container>
      <Title>내가 작성한 리뷰</Title>
      <ReviewGrid>
        {mockReviews.map((review) => (
          <ReviewCard key={review.id}>
            <BookCover src={review.book.coverImage} alt={review.book.title} />
            <BookTitle>{review.book.title}</BookTitle>
            <ReviewContent>{review.content}</ReviewContent>
          </ReviewCard>
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
