'use client';

import styled from 'styled-components';
import Link from 'next/link';

const Card = styled(Link)`
  position: relative;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid #dddddd;
  border-radius: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to bottom, #f7f7f7 33.3%, #ffffff 33.3%);
`;

const CardInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2.25rem 2rem;
`;

const BookCover = styled.img`
  width: 45%;
  aspect-ratio: 2 / 3;
  object-fit: cover;
  border-radius: 1.25rem;
  filter: drop-shadow(0px 1.25rem 2.75rem rgba(200, 200, 200, 0.25));
  margin-top: -12%;
`;

const BookTitle = styled.h3`
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-top: 2.5rem;
  text-align: center;
`;

const ContentBox = styled.div`
  width: 100%;
  background: #f7f7f7;
  border-radius: 0.625rem;
  padding: 1.25rem 2rem;
  margin-top: 2rem;
`;

const Content = styled.p`
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  line-height: 150%;
  color: ${({ theme }) => theme.colors.text.primary};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

interface ReviewCardProps {
  id: string;
  bookTitle: string;
  bookCoverImage: string;
  content: string;
}

export function ReviewCard({ id, bookTitle, bookCoverImage, content }: ReviewCardProps) {
  return (
    <Card href={`/review/${id}`}>
      <BookCover src={bookCoverImage} alt={bookTitle} />
      <CardInner>
        <BookTitle>{bookTitle}</BookTitle>
        <ContentBox>
          <Content>{content}</Content>
        </ContentBox>
      </CardInner>
    </Card>
  );
}
