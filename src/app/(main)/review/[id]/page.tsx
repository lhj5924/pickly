'use client';

import styled from 'styled-components';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { StarRating } from '@/components/common';
import { useMyReviews } from '@/api/useReview';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem 6rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Card = styled.article`
  background: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0px 20px 44px 0px #dadada40;
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`;

const Cover = styled.img`
  width: 180px;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 0.75rem;
  box-shadow: 0px 10px 28px rgba(180, 180, 180, 0.35);
`;

const BookTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const Authors = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const Meta = styled.div`
  display: flex;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ContentBox = styled.div`
  width: 100%;
  margin-top: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 0.75rem;
  font-size: 1rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: pre-wrap;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export default function ReviewDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { data: reviews = [], isLoading } = useMyReviews();

  const review = reviews.find(r => r.uuid === params.id);

  if (isLoading) {
    return (
      <Container>
        <NotFound>리뷰를 불러오는 중입니다…</NotFound>
      </Container>
    );
  }

  if (!review) {
    return (
      <Container>
        <BackButton onClick={() => router.back()}>
          <ChevronLeft size={18} /> 돌아가기
        </BackButton>
        <NotFound>해당 리뷰를 찾을 수 없습니다.</NotFound>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => router.back()}>
        <ChevronLeft size={18} /> 돌아가기
      </BackButton>
      <Card>
        <Cover src={review.book.thumbnailUrl} alt={review.book.title} />
        <BookTitle>{review.book.title}</BookTitle>
        <Authors>{review.book.authors.join(', ')}</Authors>
        <StarRating rating={review.rating} readonly size={24} />
        <Meta>
          <span>{review.startDate}</span>
          <span>—</span>
          <span>{review.endDate}</span>
        </Meta>
        <ContentBox>{review.content}</ContentBox>
      </Card>
    </Container>
  );
}
