'use client';

import styled from 'styled-components';
import { BookCard, Button } from '@/components/common';
import { Eye, Heart, Check, ChevronDown, ArrowRight } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { BookStatus, Book } from '@/types';
import Link from 'next/link';
import { useBookStore } from '@/stores';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const BookHeader = styled.section`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1.5rem;
  
  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
  }
`;

const BookCover = styled.div`
  width: 160px;
  height: 230px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BookInfo = styled.div`
  flex: 1;
`;

const BookTitle = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.375rem;
  line-height: 1.4;
`;

const BookSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.75rem;
`;

const BookMeta = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 1rem;
`;

const CategoryLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 0.375rem;
`;

const TagList = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
  
  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const Tag = styled.span`
  padding: 0.375rem 0.75rem;
  background: ${({ theme }) => theme.colors.neutral[100]};
  color: ${({ theme }) => theme.colors.text.secondary};
  border-radius: 0.375rem;
  font-size: 0.8125rem;
`;

const StatusButtons = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const StatusButton = styled.button<{ $active: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${({ $active, $color, theme }) =>
    $active ? $color : theme.colors.text.secondary};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ $color }) => $color};
  }
`;

// Review Section
const Section = styled.section`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const ReviewEmpty = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ReviewEmptyText = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const ReviewEmptySubtext = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const ReviewContent = styled.div`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.8;
  white-space: pre-wrap;
`;

const ReviewHashtags = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: 1rem;
`;

// Description Section
const DescriptionContent = styled.div<{ $expanded: boolean }>`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.8;
  white-space: pre-wrap;
  max-height: ${({ $expanded }) => ($expanded ? 'none' : '200px')};
  overflow: hidden;
  position: relative;
  
  ${({ $expanded, theme }) =>
    !$expanded &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(transparent, white);
    }
  `}
`;

const ExpandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const AuthorName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.75rem;
`;

// Similar Books
const SimilarBooksGrid = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

// Mock data
const mockBook: Book = {
  id: '1',
  title: '우리는 모두 천문학자로 태어난다',
  description: `김범준, 안민진, 정영진, 이강민, 진동혁리다 강력 추천!
별과 우주, 관측의 역사가 우리에게 알려 주는 것
"별을 바라보는 것은 가장 인간다운 행위다."

당신이 마지막으로 밤하늘을 올려다본 때는 언제입니까? 어제 지나주주? 지난달? 혹은 기억도 나지 않는 과거? 우리는 보무 애매 위에 하늘을 이고 살 있고 있어이지도 연쇄기부터 하늘을 제 대로 올려다보지 않게 저이다. 눈밭만 걸자. 오늘 때나 해지무르오 할 밤은, 당시 가가 할 곧은 많만느라고 자개를 옷어 이하늘을 를 머무도 않게 것이다.

그런 당신을 위한 단 한 권의 현존도 책이 여기에 있다. 서남시타 단장 물, 주간 도노 논후적게설 넵더 영상으로 헤에곰 진드로 '우주의 시년에 배우" 저로해 최가는 천문학자기님 팝하농을 바하면는는 당초 중요정이는 단포 이이지는 시에에 돋면해기고 뱌니다. "우리는 우주 신문학자로 태어나시다이러 않닙다. 그리고 인 강지난누도 또 니른 천문라자가가 완 회실 정문하적으로 이소하미, 천문을 먼저 배후 수 있는 배다라디의 한편의 연상, 단초 종학라의 생각, 월 볼리과 암속, 에너지에 관한 논물, 목선 아라포문라와 마계 상법레에 관한 논영저치 천문학아만 모든 역사적 아슬음 한 권으로 즐소어 성심회 주수 시이긍 가자랫을 한 말 율이어 났는다. 저자체 때민연 천문하적인 나른 과격스 길기 알자이 봄하지고, 연구 마들을 헐여하고시 바하해하인한 만들다는 시급려의 평가가 자양스럽다. 그래서 우주는 보이는 뭐환한 앞 수 있는 세계이어, 존재 자하안으로도 인간을 겸손하게 만든다.`,
  coverImage: 'https://image.yes24.com/goods/124857283/XL',
  author: '지웅배',
  publisher: '오마이북스',
  publishDate: '2019년 01월 30일',
  pageCount: 280,
  categories: [{ id: 12, name: '자연과학' }, { id: 11, name: '철학적' }],
};

const authorDescription = `지웅배
우주와 사업에 빠진 천문과자, 우주를 너무 사랑한 나머저 연정 좋무터 배가어, 메트와 밤고 다니는 노트북지 천를 별과 우주로 가득하며, 구독자 수 26만 명인 유주인지와 인지태안 천, 고리고 다양한 관엄을 통해 최실 천문학적 늘압을 소개하며 대중과 가까이 즐거이 위해 일읽에 면단 한는 구려 카팩나빼어어아이기도 하다. MBC TV [능녀저음]와 무두 능시되로 중역어으며, 한국과학카웅보원이애, 서울시시아박년관하, 국조문신사무학관, 스도국곤사물관, TEDx, [나니] 통 우주에 관한 좋체대을 아이기가 될수있는 것이던 어디론 다더님인다. 한국대하교등학교와 연세 대학교 천문우주하라과를 중만라고 한직는 서울대라고 지의전문하학뗘애 모스자로 좋업하고 있다. 지식 책으로 "[바만이더 우주 한 조각", "잘 수 없다판 알 수 있다, "지우을 닮은 너이 1, 2, 3, 좋 힘이 있다. "우리는 모두 천문학자로 태어나다"이는서 지가는 별고과 좋등의 있어진 안측과 세대학자, 이동이기 우구에 이헤합 한 관점을 이야기어이덤, 천철학으로 이때에 가장 인간적 우주를 이야기한다.`;

const similarBooks: Book[] = [
  { id: '2', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '3', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '4', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '5', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '6', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
];

// Mock review (set to null to show empty state)
const mockReview = null;
// const mockReview = {
//   hashtags: '#우리는모두천문학자로태어난다 #사시오매미가 #지갈해',
//   content: `* 이 책은 카시오매아어원셔 로부터 제공한할이에서 죽절 있고 저성한 주관적 서럼합니다.
// 도쁘에 관심 륭을 뭐야 프로오스나 프르오스나 뱌에 삶아이 나지 않는 나책,
// 아 책하길큐 유해 관싱이 따는 제솜 않는 거어도 출중핸상화하곰 좋응 수 있은 원화 도왜준다고 자니다하게 푸점할 수 있다.
// 저가는 구독사 26(만)명의 시작합 '우주접나의 인사렵이인'서 강은 유무류와 잘시에 천문학에 대한 이야기를 정업이며 내중들이 나누고 있는 현문학자 이어지도 하다.
// 현재는 서울대하곤 자연천성학반의 조교수로 일하고 있다.
// 지시은 "남마마다 우주 한 조각" "알 수 없지만 알 수 있는" "고책을냄배다시리즈" 가 있다.`,
// };

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { updateBookStatus } = useBookStore();
  const [status, setStatus] = useState<BookStatus>(null);
  const [descExpanded, setDescExpanded] = useState(false);
  const [authorExpanded, setAuthorExpanded] = useState(false);

  const handleStatusClick = (newStatus: BookStatus) => {
    const finalStatus = status === newStatus ? null : newStatus;
    setStatus(finalStatus);
    updateBookStatus(mockBook.id, finalStatus);
  };

  return (
    <Container>
      <BookHeader>
        <BookCover>
          <img src={mockBook.coverImage} alt={mockBook.title} />
        </BookCover>
        <BookInfo>
          <BookTitle>{mockBook.title}</BookTitle>
          <BookSubtitle>별과 우주에 관한 가장 인간적인 이야기</BookSubtitle>
          <BookMeta>
            저자 : {mockBook.author} | 출판사 : {mockBook.publisher} | 발행일 : {mockBook.publishDate}
          </BookMeta>
          <CategoryLabel>카테고리</CategoryLabel>
          <TagList>
            {mockBook.categories.map((cat) => (
              <Tag key={cat.id}>{cat.name}</Tag>
            ))}
          </TagList>
          <StatusButtons>
            <StatusButton
              $active={status === 'reading'}
              $color="#3b82f6"
              onClick={() => handleStatusClick('reading')}
            >
              <Eye size={18} fill={status === 'reading' ? 'currentColor' : 'none'} />
              읽는 중
            </StatusButton>
            <StatusButton
              $active={status === 'wishlist'}
              $color="#ef4444"
              onClick={() => handleStatusClick('wishlist')}
            >
              <Heart size={18} fill={status === 'wishlist' ? 'currentColor' : 'none'} />
              보고싶어요
            </StatusButton>
            <StatusButton
              $active={status === 'completed'}
              $color="#22c55e"
              onClick={() => handleStatusClick('completed')}
            >
              <Check size={18} />
              독서 완료
            </StatusButton>
          </StatusButtons>
        </BookInfo>
      </BookHeader>

      {/* My Review */}
      <Section>
        <SectionTitle>나의 리뷰</SectionTitle>
        {mockReview ? (
          <>
            <ReviewHashtags>{mockReview.hashtags}</ReviewHashtags>
            <ReviewContent>{mockReview.content}</ReviewContent>
          </>
        ) : (
          <ReviewEmpty>
            <ReviewEmptyText>아직 작성한 리뷰가 없어요.</ReviewEmptyText>
            <ReviewEmptySubtext>이 책을 읽으셨다면 리뷰를 작성해볼까요?</ReviewEmptySubtext>
            <Button 
              as={Link}
              href={`/review/write?bookId=${mockBook.id}`}
              rightIcon={<ArrowRight size={18} />}
            >
              이 책 리뷰 쓰러 가기
            </Button>
          </ReviewEmpty>
        )}
      </Section>

      {/* Book Description */}
      <Section>
        <SectionTitle>책 소개</SectionTitle>
        <DescriptionContent $expanded={descExpanded}>
          {mockBook.description}
        </DescriptionContent>
        <ExpandButton onClick={() => setDescExpanded(!descExpanded)}>
          {descExpanded ? '접기' : '펼쳐 보기'}
          <ChevronDown size={16} style={{ transform: descExpanded ? 'rotate(180deg)' : 'none' }} />
        </ExpandButton>
      </Section>

      {/* Author Description */}
      <Section>
        <SectionTitle>저자 소개</SectionTitle>
        <AuthorName>{mockBook.author}</AuthorName>
        <DescriptionContent $expanded={authorExpanded}>
          {authorDescription}
        </DescriptionContent>
        <ExpandButton onClick={() => setAuthorExpanded(!authorExpanded)}>
          {authorExpanded ? '접기' : '펼쳐 보기'}
          <ChevronDown size={16} style={{ transform: authorExpanded ? 'rotate(180deg)' : 'none' }} />
        </ExpandButton>
      </Section>

      {/* Similar Books */}
      <Section>
        <SectionTitle>이 책과 비슷한 책</SectionTitle>
        <SimilarBooksGrid>
          {similarBooks.map((book) => (
            <BookCard key={book.id} book={book} size="sm" />
          ))}
        </SimilarBooksGrid>
      </Section>
    </Container>
  );
}
