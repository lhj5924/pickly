'use client';

import styled from 'styled-components';
import { BookCard } from '@/components/common';
import { useState } from 'react';
import { Book } from '@/types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  padding-bottom: 1rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[600] : theme.colors.text.tertiary};
  border-bottom: 2px solid ${({ theme, $active }) =>
    $active ? theme.colors.primary[600] : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
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
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  background: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.875rem;
`;

type TabType = 'completed' | 'reading' | 'wishlist';

const mockBooks: Record<TabType, Book[]> = {
  completed: [
    { id: '1', title: '우리는 모두 천문학자로 태어난다', author: '지웅배', coverImage: 'https://image.yes24.com/goods/124857283/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [], status: 'completed' },
    { id: '2', title: '서해는 모든 것을 알았다', author: '정세랑', coverImage: 'https://image.yes24.com/goods/125698547/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [], status: 'completed' },
    { id: '3', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [], status: 'completed' },
  ],
  reading: [
    { id: '4', title: '중독된 뇌를 어떻게 바꾸는가', author: '저드슨 브루어', coverImage: 'https://image.yes24.com/goods/90309531/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [], status: 'reading', progress: 36 },
    { id: '5', title: '중독된 뇌를 어떻게 바꾸는가', author: '저드슨 브루어', coverImage: 'https://image.yes24.com/goods/90309531/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [], status: 'reading', progress: 65 },
  ],
  wishlist: [
    { id: '6', title: '우리가 빛의 속도로 갈 수 없다면', author: '김초엽', coverImage: 'https://image.yes24.com/goods/77091141/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [], status: 'wishlist' },
  ],
};

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<TabType>('completed');

  const books = mockBooks[activeTab];

  return (
    <Container>
      <TabList>
        <Tab $active={activeTab === 'completed'} onClick={() => setActiveTab('completed')}>
          완독 ({mockBooks.completed.length})
        </Tab>
        <Tab $active={activeTab === 'reading'} onClick={() => setActiveTab('reading')}>
          읽는 중 ({mockBooks.reading.length})
        </Tab>
        <Tab $active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')}>
          보고싶어요 ({mockBooks.wishlist.length})
        </Tab>
      </TabList>

      {books.length > 0 ? (
        <BookGrid>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              size="md"
              showProgress={activeTab === 'reading'}
            />
          ))}
        </BookGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>📚</EmptyIcon>
          <EmptyText>아직 책이 없어요</EmptyText>
          <EmptySubtext>책을 추가해보세요!</EmptySubtext>
        </EmptyState>
      )}
    </Container>
  );
}
