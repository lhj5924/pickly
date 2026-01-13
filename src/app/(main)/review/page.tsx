'use client';

import styled from 'styled-components';
import { Button } from '@/components/common';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
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
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const BookCover = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 0.5rem;
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

const mockReviews = [
  { id: '1', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '2', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '3', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '4', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '5', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '6', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '7', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
  { id: '8', book: { title: '중독된 뇌를 어떻게 바꾸는가', coverImage: 'https://image.yes24.com/goods/90309531/XL' }, content: '아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 아무튼 리뷰 리뷰..' },
];

export default function ReviewPage() {
  return (
    <Container>
      <Card>
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
          <Button as={Link} href="/review/write" rightIcon={<ArrowRight size={18} />}>
            내가 읽은 책 리뷰 쓰러 가기
          </Button>
        </WriteButtonWrapper>
      </Card>
    </Container>
  );
}
