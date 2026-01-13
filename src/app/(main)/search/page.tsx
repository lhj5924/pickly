'use client';

import styled from 'styled-components';
import { BookCard, Input } from '@/components/common';
import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Book } from '@/types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const SearchWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem;
  position: relative;
`;

const SearchInputStyled = styled.input`
  width: 100%;
  padding: 1rem 3rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 3rem;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ResultInfo = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1.5rem;
`;

const HighlightText = styled.span`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 600;
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

const EmptyTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const EmptySubtext = styled.p`
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const RecentSearches = styled.div`
  margin-top: 2rem;
`;

const RecentTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const RecentTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const RecentTag = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.neutral[100]};
  border-radius: 2rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const mockBooks: Book[] = [
  { id: '1', title: '우리는 모두 천문학자로 태어난다', author: '지웅배', coverImage: 'https://image.yes24.com/goods/124857283/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '2', title: '우리가 빛의 속도로 갈 수 없다면', author: '김초엽', coverImage: 'https://image.yes24.com/goods/77091141/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '3', title: '중독된 뇌를 어떻게 바꾸는가', author: '저드슨 브루어', coverImage: 'https://image.yes24.com/goods/90309531/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '4', title: '서해는 모든 것을 알았다', author: '정세랑', coverImage: 'https://image.yes24.com/goods/125698547/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
  { id: '5', title: '당연하게도 나는 너를', author: '이꽃', coverImage: 'https://image.yes24.com/goods/119564892/XL', description: '', publisher: '', publishDate: '', pageCount: 0, categories: [] },
];

const recentSearches = ['우리는', '천문학', '로맨스 소설', '김초엽', '에세이'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockBooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.author.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setHasSearched(true);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [query]);

  const handleRecentClick = (term: string) => {
    setQuery(term);
  };

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Container>
      <SearchWrapper>
        <SearchIcon>
          <Search size={20} />
        </SearchIcon>
        <SearchInputStyled
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <X size={20} />
          </ClearButton>
        )}
      </SearchWrapper>

      {hasSearched ? (
        <>
          <ResultInfo>
            "<HighlightText>{query}</HighlightText>" 검색 결과 {results.length}건
          </ResultInfo>

          {results.length > 0 ? (
            <BookGrid>
              {results.map((book) => (
                <BookCard key={book.id} book={book} size="md" />
              ))}
            </BookGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>검색 결과가 없어요</EmptyTitle>
              <EmptySubtext>다른 검색어로 검색해보세요</EmptySubtext>
            </EmptyState>
          )}
        </>
      ) : (
        <EmptyState>
          <EmptyIcon>🔍</EmptyIcon>
          <EmptyTitle>무엇을 찾고 계신가요?</EmptyTitle>
          <EmptySubtext>책 제목, 저자명으로 검색해보세요</EmptySubtext>
          
          <RecentSearches>
            <RecentTitle>최근 검색어</RecentTitle>
            <RecentTags>
              {recentSearches.map((term, index) => (
                <RecentTag key={index} onClick={() => handleRecentClick(term)}>
                  {term}
                </RecentTag>
              ))}
            </RecentTags>
          </RecentSearches>
        </EmptyState>
      )}
    </Container>
  );
}
