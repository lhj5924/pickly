'use client';

import styled from 'styled-components';
import { BookCard, Pagination } from '@/components/common';
import { Search, X, Clock } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBookSearch } from '@/api/useBook';
import { useRecentSearches } from '@/hooks/useRecentSearches';

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
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
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
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const RecentDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.25rem);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem 0.5rem;
`;

const DropdownTitle = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const ClearAllButton = styled.button`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const DropdownItem = styled.div<{ $highlighted?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.625rem 1rem;
  cursor: pointer;
  background: ${({ $highlighted, theme }) => ($highlighted ? theme.colors.neutral[100] : 'transparent')};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[100]};
  }
`;

const DropdownItemText = styled.span`
  flex: 1;
  font-size: 0.9375rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-left: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const PAGE_SIZE = 20;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const { items: recentSearches, add: addRecent, remove: removeRecent, clear: clearRecent } = useRecentSearches();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const { data: searchData, isFetching } = useBookSearch(
    { query: submittedQuery, size: PAGE_SIZE, page: currentPage - 1 },
    submittedQuery.length > 0,
  );
  const results = searchData?.books ?? [];
  const totalItems = searchData?.totalItems ?? 0;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const hasSearched = submittedQuery.length > 0;

  const executeSearch = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (trimmed.length > 0) {
        addRecent(trimmed);
        setQuery(trimmed);
        setSubmittedQuery(trimmed);
        setCurrentPage(1);
        setDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    },
    [addRecent],
  );

  const handleSearch = () => {
    executeSearch(query);
  };

  const showDropdown = query.length === 0 && recentSearches.length > 0;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!dropdownOpen || !showDropdown) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < recentSearches.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : recentSearches.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < recentSearches.length) {
          executeSearch(recentSearches[highlightedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setSubmittedQuery('');
    setCurrentPage(1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container>
      <SearchWrapper>
        <SearchIcon onClick={handleSearch} style={{ cursor: 'pointer' }}>
          <Search size={20} />
        </SearchIcon>
        <SearchInputStyled
          ref={inputRef}
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            setHighlightedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => {
            setDropdownOpen(false);
            setHighlightedIndex(-1);
          }}
          placeholder="검색어를 입력하세요"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={dropdownOpen && showDropdown}
          aria-controls="recent-searches-listbox"
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <X size={20} />
          </ClearButton>
        )}
        {dropdownOpen && showDropdown && (
          <RecentDropdown>
            <DropdownHeader>
              <DropdownTitle>최근 검색어</DropdownTitle>
              <ClearAllButton
                onMouseDown={e => {
                  e.preventDefault();
                  clearRecent();
                }}
              >
                전체 삭제
              </ClearAllButton>
            </DropdownHeader>
            <div id="recent-searches-listbox" role="listbox">
              {recentSearches.map((term, index) => (
                <DropdownItem
                  key={term}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  $highlighted={highlightedIndex === index}
                  onMouseDown={e => {
                    e.preventDefault();
                    executeSearch(term);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <Clock size={14} color="#999" />
                  <DropdownItemText>{term}</DropdownItemText>
                  <DeleteButton
                    onMouseDown={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeRecent(term);
                    }}
                  >
                    <X size={14} />
                  </DeleteButton>
                </DropdownItem>
              ))}
            </div>
          </RecentDropdown>
        )}
      </SearchWrapper>

      {hasSearched ? (
        <>
          <RecentSearches>
            <RecentTitle>최근 검색어</RecentTitle>
            <RecentTags>
              {recentSearches.map((term, index) => (
                <RecentTag key={index} onClick={() => executeSearch(term)}>
                  {term}
                </RecentTag>
              ))}
            </RecentTags>
          </RecentSearches>
          <ResultInfo>
            &quot;<HighlightText>{submittedQuery}</HighlightText>&quot; 검색 결과{' '}
            {isFetching ? '불러오는 중…' : `${totalItems}건`}
          </ResultInfo>

          {results.length > 0 ? (
            <>
              <BookGrid>
                {results.map(book => (
                  <BookCard key={book.uuid} book={book} size="md" />
                ))}
              </BookGrid>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          ) : (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyTitle>검색 결과가 없어요</EmptyTitle>
              <EmptySubtext>다른 검색어로 검색해보세요</EmptySubtext>
              <RecentSearches>
                <RecentTitle>최근 검색어</RecentTitle>
                <RecentTags>
                  {recentSearches.map((term, index) => (
                    <RecentTag key={index} onClick={() => executeSearch(term)}>
                      {term}
                    </RecentTag>
                  ))}
                </RecentTags>
              </RecentSearches>
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
                <RecentTag key={index} onClick={() => executeSearch(term)}>
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
