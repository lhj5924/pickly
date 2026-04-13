'use client';

import styled from 'styled-components';
import { Button, StarRating } from '@/components/common';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReviewAvailableBooks, useCreateReview } from '@/api/useReview';
import type { LibraryItem } from '@/types';

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
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ResultAuthor = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
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

const CategoryLabel = styled.p`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-bottom: 0.25rem;
`;

const CategoryTags = styled.div`
  display: flex;
  gap: 0.375rem;
  flex-wrap: wrap;
`;

const CategoryTag = styled.span`
  padding: 0.25rem 0.5rem;
  background: ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
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

function ReviewWriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: availableBooks = [] } = useReviewAvailableBooks();
  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LibraryItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [rating, setRating] = useState(3);
  const [reviewContent, setReviewContent] = useState('');

  const searchRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const libraryUuid = searchParams.get('libraryUuid');
    if (libraryUuid && availableBooks.length > 0) {
      const item = availableBooks.find(b => b.uuid === libraryUuid);
      if (item) {
        setSelectedItem(item);
        setSearchQuery(item.book.title);
      }
    }
  }, [searchParams, availableBooks]);

  useEffect(() => {
    if (searchQuery.length > 0 && !selectedItem) {
      const results = availableBooks.filter(item => {
        const title = item.book.title.toLowerCase();
        const authors = item.book.authors.join(' ').toLowerCase();
        const q = searchQuery.toLowerCase();
        return title.includes(q) || authors.includes(q);
      });
      setSearchResults(results);
      setShowResults(results.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, selectedItem, availableBooks]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setShowCalendar(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => prev < searchResults.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelectBook(searchResults[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setShowResults(false);
    }
  };

  const handleSelectBook = (item: LibraryItem) => {
    setSelectedItem(item);
    setSearchQuery(item.book.title);
    setShowResults(false);
    setHighlightedIndex(-1);
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

  const handleSubmit = () => {
    if (!selectedItem || !startDate || !endDate || !reviewContent) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    createReview(
      {
        libraryUuid: selectedItem.uuid,
        rating,
        content: reviewContent,
        startDate: toApiDate(startDate),
        endDate: toApiDate(endDate),
      },
      {
        onSuccess: () => router.push('/review'),
        onError: () => alert('리뷰 저장에 실패했어요. 다시 시도해주세요.'),
      },
    );
  };

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
                if (selectedItem) setSelectedItem(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="완독한 책에서 검색하세요"
            />
            <SearchResults $show={showResults}>
              {searchResults.map((item, index) => (
                <SearchResultItem
                  key={item.uuid}
                  $highlighted={index === highlightedIndex}
                  onClick={() => handleSelectBook(item)}
                >
                  <ResultCover src={item.book.thumbnailUrl} alt={item.book.title} />
                  <ResultInfo>
                    <ResultTitle>{item.book.title}</ResultTitle>
                    <ResultAuthor>{item.book.authors.join(', ')}</ResultAuthor>
                  </ResultInfo>
                </SearchResultItem>
              ))}
            </SearchResults>
          </SearchWrapper>

          {selectedItem && (
            <SelectedBookCard>
              <SelectedBookCover src={selectedItem.book.thumbnailUrl} alt={selectedItem.book.title} />
              <SelectedBookInfo>
                <SelectedBookTitle>{selectedItem.book.title}</SelectedBookTitle>
                <SelectedBookSubtitle>{selectedItem.book.authors.join(', ')}</SelectedBookSubtitle>
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
                  <CalendarNavBtn onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}>
                    <ChevronLeft size={18} />
                  </CalendarNavBtn>
                  <CalendarNavBtn onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}>
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
            onChange={(e) => setReviewContent(e.target.value)}
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
    <Suspense fallback={<Container><FormCard><Title>로딩 중...</Title></FormCard></Container>}>
      <ReviewWriteContent />
    </Suspense>
  );
}
