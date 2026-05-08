'use client';

import styled from 'styled-components';
import { Button, StarRating } from '@/components/common';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReviewAvailableBooks, useCreateReview } from '@/api/useReview';
import { useAddToLibrary } from '@/api/useLibrary';
import { useInfiniteBookSearch, useBook } from '@/api/useBook';
import { useDebounce } from '@/hooks/useDebounce';
import type { LibraryItem } from '@/types';
import type { BookSummary } from '@/types/book';

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Title = styled.h1`
  font-size: 1.375rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  background: ${({ theme }) => theme.colors.neutral[50]};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const SearchResults = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.5rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-height: 300px;
  overflow-y: auto;
  z-index: 100;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
`;

const SectionDivider = styled.div`
  padding: 0.375rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.tertiary};
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  position: sticky;
  top: 0;
`;

const SearchResultItem = styled.div<{ $highlighted: boolean }>`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  background: ${({ $highlighted, theme }) =>
    $highlighted ? theme.colors.primary[50] : 'transparent'};

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const ResultCover = styled.img`
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 0.25rem;
  flex-shrink: 0;
`;

const ResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ResultAuthor = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CompletedBadge = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary[600]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: 0.25rem;
  padding: 0.125rem 0.375rem;
  flex-shrink: 0;
`;

const DropdownStatus = styled.div`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
`;

const SelectedBookCard = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.neutral[50]};
  border-radius: 0.5rem;
  margin-top: 0.75rem;
`;

const SelectedBookCover = styled.img`
  width: 80px;
  height: 115px;
  object-fit: cover;
  border-radius: 0.375rem;
`;

const SelectedBookInfo = styled.div`
  flex: 1;
`;

const SelectedBookTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const SelectedBookSubtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: white;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`;

const DateSeparator = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const CalendarModal = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: 1rem;
  z-index: 100;
  display: ${({ $show }) => ($show ? 'block' : 'none')};
  min-width: 280px;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CalendarTitle = styled.span`
  font-size: 0.9375rem;
  font-weight: 600;
`;

const CalendarNav = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CalendarNavBtn = styled.button`
  padding: 0.25rem;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const TodayBtn = styled.button`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-right: 0.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
`;

const CalendarWeekday = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0.5rem 0;
`;

const CalendarDay = styled.button<{ $selected: boolean; $today: boolean; $disabled: boolean }>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8125rem;
  border-radius: 50%;
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary[500] : 'transparent'};
  color: ${({ theme, $selected, $disabled }) =>
    $selected ? 'white' : $disabled ? theme.colors.neutral[300] : theme.colors.text.primary};
  border: ${({ $today, theme }) =>
    $today ? `1px solid ${theme.colors.primary[500]}` : 'none'};
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};

  &:hover {
    background: ${({ theme, $selected, $disabled }) =>
      $disabled ? 'transparent' : $selected ? theme.colors.primary[600] : theme.colors.primary[100]};
  }
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  max-width: 500px;
  margin: 2rem auto 0;
  display: block;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[400]} 0%, ${({ theme }) => theme.colors.primary[500]} 100%);
`;

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

interface SelectedBookInfo {
  isInAvailableBooks: boolean;
  libraryItem: LibraryItem | null;
  bookSummary: BookSummary | null;
}

function ReviewWriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: availableBooks = [] } = useReviewAvailableBooks();
  const { mutateAsync: createReviewAsync } = useCreateReview();
  const { mutateAsync: addToLibraryAsync } = useAddToLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedBook, setSelectedBook] = useState<SelectedBookInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [startDate, setStartDate] = useState<Date | null>(() => new Date());
  const [endDate, setEndDate] = useState<Date | null>(() => new Date());
  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [rating, setRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const bookUuidParam = searchParams.get('bookUuid') ?? undefined;
  const libraryUuidParam = searchParams.get('libraryUuid') ?? undefined;

  // bookUuid로 진입 시 책 정보 사전 로드 (완독 목록에 없을 경우 대비)
  const { data: preselectedBookData } = useBook(bookUuidParam);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const {
    data: infiniteSearchData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching: isExternalFetching,
  } = useInfiniteBookSearch(debouncedQuery);

  const filteredAvailableBooks = useMemo(() => {
    if (!searchQuery.trim()) return availableBooks;
    const q = searchQuery.toLowerCase();
    return availableBooks.filter(
      item =>
        item.book.title.toLowerCase().includes(q) ||
        item.book.authors.join(' ').toLowerCase().includes(q),
    );
  }, [searchQuery, availableBooks]);

  const externalSearchBooks = useMemo(
    () => infiniteSearchData?.pages.flatMap(p => p.books) ?? [],
    [infiniteSearchData],
  );

  // 키보드 네비게이션용 플랫 리스트 (완독 목록 + 외부 검색)
  const allDropdownItems = useMemo(
    () => [
      ...filteredAvailableBooks.map(item => ({ type: 'available' as const, item })),
      ...externalSearchBooks.map(book => ({ type: 'external' as const, book })),
    ],
    [filteredAvailableBooks, externalSearchBooks],
  );

  const showDropdown = dropdownOpen && searchQuery.length > 0 && !selectedBook;

  // URL 파라미터로 책 사전 선택 (bookUuid 또는 libraryUuid)
  useEffect(() => {
    if (selectedBook) return;

    if (bookUuidParam) {
      // 완독 목록에서 book UUID로 먼저 탐색
      if (availableBooks.length > 0) {
        const item = availableBooks.find(b => b.book.uuid === bookUuidParam);
        if (item) {
          setSelectedBook({ isInAvailableBooks: true, libraryItem: item, bookSummary: null });
          setSearchQuery(item.book.title);
          return;
        }
      }
      // 완독 목록에 없으면 책 상세 데이터로 pre-select
      if (preselectedBookData) {
        const summary: BookSummary = {
          uuid: preselectedBookData.uuid,
          externalId: preselectedBookData.externalId,
          isbn: preselectedBookData.isbn13 || preselectedBookData.isbn10,
          title: preselectedBookData.title,
          authors: preselectedBookData.authors,
          thumbnailUrl: preselectedBookData.thumbnailUrl,
          publishedDate: preselectedBookData.publishedDate,
          publisher: preselectedBookData.publisher,
          source: preselectedBookData.source,
        };
        setSelectedBook({ isInAvailableBooks: false, libraryItem: null, bookSummary: summary });
        setSearchQuery(preselectedBookData.title);
      }
      return;
    }

    // 기존 libraryUuid 파라미터 지원
    if (libraryUuidParam && availableBooks.length > 0) {
      const item = availableBooks.find(b => b.uuid === libraryUuidParam);
      if (item) {
        setSelectedBook({ isInAvailableBooks: true, libraryItem: item, bookSummary: null });
        setSearchQuery(item.book.title);
      }
    }
  }, [bookUuidParam, libraryUuidParam, availableBooks, preselectedBookData, selectedBook]);

  // 클릭 외부 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAvailableBook = (item: LibraryItem) => {
    setSelectedBook({ isInAvailableBooks: true, libraryItem: item, bookSummary: null });
    setSearchQuery(item.book.title);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSelectExternalBook = (book: BookSummary) => {
    // 외부 검색 결과 중 완독 목록에 있는지 externalId로 확인 (API 재호출 없이)
    const matchingItem = availableBooks.find(item => item.book.externalId === book.externalId);
    if (matchingItem) {
      setSelectedBook({ isInAvailableBooks: true, libraryItem: matchingItem, bookSummary: null });
    } else {
      setSelectedBook({ isInAvailableBooks: false, libraryItem: null, bookSummary: book });
    }
    setSearchQuery(book.title);
    setDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, allDropdownItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      const dropdownItem = allDropdownItems[highlightedIndex];
      if (dropdownItem.type === 'available') handleSelectAvailableBook(dropdownItem.item);
      else handleSelectExternalBook(dropdownItem.book);
    } else if (e.key === 'Escape') {
      setDropdownOpen(false);
    }
  };

  // 드롭다운 스크롤 감지 → 다음 페이지 로드
  const handleDropdownScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 60 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const getDaysInMonth = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const days: { day: number; disabled: boolean; isToday?: boolean; isSelected?: boolean }[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: 0, disabled: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected =
        (showCalendar === 'start' && startDate?.toDateString() === date.toDateString()) ||
        (showCalendar === 'end' && endDate?.toDateString() === date.toDateString());
      days.push({ day: i, disabled: false, isToday, isSelected });
    }
    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
    if (showCalendar === 'start') {
      setStartDate(selectedDate);
    } else if (showCalendar === 'end') {
      setEndDate(selectedDate);
    }
    setShowCalendar(null);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '0000.00.00';
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const toApiDate = (d: Date) => d.toISOString().slice(0, 10);

  const handleSubmit = async () => {
    if (!selectedBook || !startDate || !endDate || !reviewContent.trim()) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      let libraryUuid: string;

      if (selectedBook.isInAvailableBooks && selectedBook.libraryItem) {
        // 완독 목록에 있는 책 → 바로 리뷰 작성
        libraryUuid = selectedBook.libraryItem.uuid;
      } else if (selectedBook.bookSummary) {
        // 완독 목록에 없는 책 → 라이브러리에 COMPLETED 상태로 추가 후 리뷰 작성
        const libraryItem = await addToLibraryAsync({
          externalId: selectedBook.bookSummary.externalId,
          source: selectedBook.bookSummary.source,
          status: 'COMPLETED',
        });
        libraryUuid = libraryItem.uuid;
      } else {
        return;
      }

      await createReviewAsync({
        libraryUuid,
        rating,
        content: reviewContent,
        startDate: toApiDate(startDate),
        endDate: toApiDate(endDate),
      });

      router.push('/review');
    } catch {
      alert('저장에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayBook = selectedBook?.libraryItem?.book ?? selectedBook?.bookSummary ?? null;

  return (
    <Container>
      <FormCard>
        <Title>내가 읽은 책 리뷰 작성하기</Title>

        <FormGroup>
          <Label>책 제목</Label>
          <SearchWrapper ref={searchRef}>
            <SearchInput
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (selectedBook) setSelectedBook(null);
                setHighlightedIndex(-1);
              }}
              onFocus={() => setDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="책을 검색하세요"
            />
            <SearchResults $show={showDropdown} onScroll={handleDropdownScroll}>
              {/* 섹션 1: 내 완독 목록 */}
              {filteredAvailableBooks.length > 0 && (
                <>
                  <SectionDivider>내 완독 목록</SectionDivider>
                  {filteredAvailableBooks.map((item, index) => (
                    <SearchResultItem
                      key={item.uuid}
                      $highlighted={highlightedIndex === index}
                      onClick={() => handleSelectAvailableBook(item)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <ResultCover src={item.book.thumbnailUrl} alt={item.book.title} />
                      <ResultInfo>
                        <ResultTitle>{item.book.title}</ResultTitle>
                        <ResultAuthor>{item.book.authors.join(', ')}</ResultAuthor>
                      </ResultInfo>
                      <CompletedBadge>완독</CompletedBadge>
                    </SearchResultItem>
                  ))}
                </>
              )}

              {/* 섹션 2: 전체 검색 결과 */}
              <SectionDivider>전체 검색</SectionDivider>
              {externalSearchBooks.map((book, idx) => {
                const globalIndex = filteredAvailableBooks.length + idx;
                return (
                  <SearchResultItem
                    key={`${book.externalId}-${idx}`}
                    $highlighted={highlightedIndex === globalIndex}
                    onClick={() => handleSelectExternalBook(book)}
                    onMouseEnter={() => setHighlightedIndex(globalIndex)}
                  >
                    <ResultCover src={book.thumbnailUrl} alt={book.title} />
                    <ResultInfo>
                      <ResultTitle>{book.title}</ResultTitle>
                      <ResultAuthor>{book.authors.join(', ')}</ResultAuthor>
                    </ResultInfo>
                  </SearchResultItem>
                );
              })}

              {isExternalFetching || isFetchingNextPage ? (
                <DropdownStatus>불러오는 중…</DropdownStatus>
              ) : externalSearchBooks.length === 0 ? (
                <DropdownStatus>검색 결과가 없어요</DropdownStatus>
              ) : null}
            </SearchResults>
          </SearchWrapper>

          {displayBook && (
            <SelectedBookCard>
              <SelectedBookCover src={displayBook.thumbnailUrl} alt={displayBook.title} />
              <SelectedBookInfo>
                <SelectedBookTitle>{displayBook.title}</SelectedBookTitle>
                <SelectedBookSubtitle>{displayBook.authors.join(', ')}</SelectedBookSubtitle>
              </SelectedBookInfo>
            </SelectedBookCard>
          )}
        </FormGroup>

        <FormGroup>
          <Label>읽은 기간</Label>
          <div style={{ position: 'relative' }} ref={calendarRef}>
            <DateRow>
              <DateButton onClick={() => setShowCalendar(showCalendar === 'start' ? null : 'start')}>
                <Calendar size={16} />
                {formatDate(startDate)}
              </DateButton>
              <DateSeparator>—</DateSeparator>
              <DateButton onClick={() => setShowCalendar(showCalendar === 'end' ? null : 'end')}>
                <Calendar size={16} />
                {formatDate(endDate)}
              </DateButton>
            </DateRow>

            <CalendarModal $show={showCalendar !== null}>
              <CalendarHeader>
                <CalendarTitle>
                  {calendarDate.getFullYear()}년 {calendarDate.getMonth() + 1}월
                </CalendarTitle>
                <CalendarNav>
                  <TodayBtn onClick={() => setCalendarDate(new Date())}>오늘</TodayBtn>
                  <CalendarNavBtn
                    onClick={() =>
                      setCalendarDate(
                        new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1),
                      )
                    }
                  >
                    <ChevronLeft size={18} />
                  </CalendarNavBtn>
                  <CalendarNavBtn
                    onClick={() =>
                      setCalendarDate(
                        new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1),
                      )
                    }
                  >
                    <ChevronRight size={18} />
                  </CalendarNavBtn>
                </CalendarNav>
              </CalendarHeader>
              <CalendarGrid>
                {weekdays.map(day => (
                  <CalendarWeekday key={day}>{day}</CalendarWeekday>
                ))}
                {getDaysInMonth().map((item, index) => (
                  <CalendarDay
                    key={index}
                    $selected={item.isSelected || false}
                    $today={item.isToday || false}
                    $disabled={item.disabled}
                    onClick={() => !item.disabled && item.day && handleDateSelect(item.day)}
                  >
                    {item.day || ''}
                  </CalendarDay>
                ))}
              </CalendarGrid>
            </CalendarModal>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>별점</Label>
          <StarRating rating={rating} onChange={setRating} size={28} />
        </FormGroup>

        <FormGroup>
          <Label>리뷰</Label>
          <ReviewTextarea
            value={reviewContent}
            onChange={e => setReviewContent(e.target.value)}
            placeholder="이 책에 대한 리뷰를 작성해주세요"
          />
        </FormGroup>
      </FormCard>

      <SubmitButton size="lg" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? '저장 중…' : '리뷰 작성 완료'}
      </SubmitButton>
    </Container>
  );
}

export default function ReviewWritePage() {
  return (
    <Suspense
      fallback={
        <Container>
          <FormCard>
            <Title>로딩 중...</Title>
          </FormCard>
        </Container>
      }
    >
      <ReviewWriteContent />
    </Suspense>
  );
}
