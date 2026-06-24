'use client';

import styled from 'styled-components';
import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Pencil } from 'lucide-react';
import { useBookSearch, useBook } from '@/api/useBook';
import { useGenres } from '@/api/useGenre';
import { useUpdateBookGenres } from '@/api/useAdmin';
import { useAuthStore } from '@/stores/authStore';
import { useDebounce } from '@/hooks/useDebounce';

// ─── Layout ───────────────────────────────────────────────────
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem 4rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.375rem;
`;

const PageDesc = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// ─── Search ───────────────────────────────────────────────────
const SearchBar = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchIconWrap = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 3rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  background: white;
  color: ${({ theme }) => theme.colors.text.primary};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ResultInfo = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 0.9375rem;
`;

// ─── Book List ────────────────────────────────────────────────
const BookList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const BookRow = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.15s;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const BookThumb = styled.div`
  width: 48px;
  height: 68px;
  border-radius: 0.25rem;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.neutral[100]};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.neutral[200]};
`;

const BookRowInfo = styled.div<{ $clickable?: boolean }>`
  flex: 1;
  min-width: 0;
  ${({ $clickable }) => $clickable && `
    cursor: pointer;
    &:hover p:first-child {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  `}
`;

const BookRowTitle = styled.p`
  font-size: 0.9375rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.25rem;
`;

const BookRowMeta = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookRowSource = styled.span<{ $local: boolean }>`
  display: inline-block;
  font-size: 0.6875rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: ${({ theme, $local }) => ($local ? theme.colors.primary[50] : theme.colors.neutral[100])};
  color: ${({ theme, $local }) => ($local ? theme.colors.primary[600] : theme.colors.text.tertiary)};
  margin-top: 0.25rem;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary[600]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: 0.5rem;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
  }
`;

const UnregisteredBadge = styled.span`
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  background: ${({ theme }) => theme.colors.neutral[100]};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: 0.5rem;
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── Modal ────────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 480px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  overflow: hidden;
`;

const ModalHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const ModalTitleGroup = styled.div`
  flex: 1;
  min-width: 0;
`;

const ModalTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.25rem;
`;

const ModalSubtitle = styled.p`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CloseButton = styled.button`
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0.25rem;
  margin-left: 1rem;
  flex-shrink: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: 1.25rem 1.5rem;
  max-height: 360px;
  overflow-y: auto;
`;

const ModalLoading = styled.div`
  padding: 2rem 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: 0.9375rem;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const GenreItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: left;
  border: 1.5px solid ${({ theme, $selected }) =>
    $selected ? theme.colors.primary[400] : theme.colors.border.light};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary[50] : 'white'};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary[700] : theme.colors.text.secondary};
  transition: all 0.12s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const Checkbox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid ${({ theme, $checked }) =>
    $checked ? theme.colors.primary[500] : theme.colors.neutral[300]};
  background: ${({ theme, $checked }) =>
    $checked ? theme.colors.primary[500] : 'white'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;

  &::after {
    content: '';
    display: ${({ $checked }) => ($checked ? 'block' : 'none')};
    width: 8px;
    height: 5px;
    border-left: 2px solid white;
    border-bottom: 2px solid white;
    transform: rotate(-45deg) translateY(-1px);
  }
`;

const ModalFoot = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1rem 1.5rem 1.25rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  background: white;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.colors.neutral[50]};
  }
`;

const SaveButton = styled.button`
  padding: 0.625rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  transition: background 0.12s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ─── Genre Edit Modal ─────────────────────────────────────────
interface GenreEditModalProps {
  bookUuid: string;
  onClose: () => void;
}

function GenreEditModal({ bookUuid, onClose }: GenreEditModalProps) {
  const { data: book, isLoading: bookLoading } = useBook(bookUuid);
  const { data: allGenres = [] } = useGenres();
  const { mutate: updateGenres, isPending } = useUpdateBookGenres();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (book && !initialized) {
      setSelectedIds(book.genres.map(g => g.id));
      setInitialized(true);
    }
  }, [book, initialized]);

  const toggleGenre = (id: number) =>
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    );

  const handleSave = () => {
    updateGenres(
      { bookUuid, body: { genreIds: selectedIds } },
      { onSuccess: () => onClose() },
    );
  };

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <ModalHead>
          <ModalTitleGroup>
            <ModalTitle>장르 편집</ModalTitle>
            {book && <ModalSubtitle>{book.title}</ModalSubtitle>}
          </ModalTitleGroup>
          <CloseButton onClick={onClose} aria-label="닫기">
            <X size={18} />
          </CloseButton>
        </ModalHead>

        <ModalBody>
          {bookLoading ? (
            <ModalLoading>불러오는 중…</ModalLoading>
          ) : (
            <GenreGrid>
              {allGenres.map(genre => (
                <GenreItem
                  key={genre.code}
                  $selected={selectedIds.includes(genre.id)}
                  onClick={() => toggleGenre(genre.id)}
                  type="button"
                >
                  <Checkbox $checked={selectedIds.includes(genre.id)} />
                  {genre.name}
                </GenreItem>
              ))}
            </GenreGrid>
          )}
        </ModalBody>

        <ModalFoot>
          <CancelButton onClick={onClose} type="button">취소</CancelButton>
          <SaveButton onClick={handleSave} disabled={isPending || bookLoading} type="button">
            {isPending ? '저장 중…' : '저장'}
          </SaveButton>
        </ModalFoot>
      </ModalBox>
    </Overlay>
  );
}

// ─── Main Page ────────────────────────────────────────────────
function AdminGenresContent() {
  const router = useRouter();
  const userRole = useAuthStore(state => state.user?.role);
  const isAdmin = userRole === 'ADMIN';

  const [searchInput, setSearchInput] = useState('');
  const [editingBookUuid, setEditingBookUuid] = useState<string | null>(null);

  const debouncedQuery = useDebounce(searchInput, 400);
  const { data: searchResult, isLoading: searching } = useBookSearch(
    { query: debouncedQuery, size: 20 },
    debouncedQuery.trim().length >= 1,
  );

  useEffect(() => {
    if (!isAdmin) {
      router.replace('/home');
    }
  }, [isAdmin, router]);

  if (!isAdmin) return null;

  const books = searchResult?.books ?? [];
  const hasQuery = debouncedQuery.trim().length >= 1;

  return (
    <Container>
      <PageHeader>
        <PageTitle>장르 관리</PageTitle>
        <PageDesc>책별로 장르를 검색하고 수정합니다.</PageDesc>
      </PageHeader>

      <SearchBar>
        <SearchIconWrap>
          <Search size={18} />
        </SearchIconWrap>
        <SearchInput
          placeholder="책 제목 또는 저자로 검색"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          autoFocus
        />
        {searchInput && (
          <ClearBtn onClick={() => setSearchInput('')} aria-label="지우기">
            <X size={16} />
          </ClearBtn>
        )}
      </SearchBar>

      {hasQuery && (
        <ResultInfo>
          {searching
            ? '검색 중…'
            : `"${debouncedQuery}" 검색 결과 ${books.length}건`}
        </ResultInfo>
      )}

      {!hasQuery && (
        <EmptyState>검색어를 입력하여 책을 찾으세요.</EmptyState>
      )}

      {hasQuery && !searching && books.length === 0 && (
        <EmptyState>검색 결과가 없습니다.</EmptyState>
      )}

      {books.length > 0 && (
        <BookList>
          {books.map(book => (
            <BookRow key={book.externalId}>
              <BookThumb>
                {book.thumbnailUrl ? (
                  <img src={book.thumbnailUrl} alt={book.title} />
                ) : (
                  <ThumbPlaceholder />
                )}
              </BookThumb>

              <BookRowInfo
                $clickable={!book.uuid}
                onClick={!book.uuid ? () => router.push(
                  `/book/external?externalId=${encodeURIComponent(book.externalId)}&source=${encodeURIComponent(book.source)}`
                ) : undefined}
                title={!book.uuid ? '클릭하면 책 상세 페이지로 이동합니다' : undefined}
              >
                <BookRowTitle>{book.title}</BookRowTitle>
                <BookRowMeta>
                  {book.authors.join(', ')}
                  {book.publisher ? ` · ${book.publisher}` : ''}
                </BookRowMeta>
                <BookRowSource $local={!!book.uuid}>
                  {book.uuid ? 'DB 등록됨' : '미등록 · 클릭하여 상세 보기'}
                </BookRowSource>
              </BookRowInfo>

              {book.uuid ? (
                <EditButton
                  onClick={() => setEditingBookUuid(book.uuid!)}
                  type="button"
                >
                  <Pencil size={13} />
                  장르 편집
                </EditButton>
              ) : (
                <UnregisteredBadge
                  title="라이브러리에 추가된 적 없는 책은 장르를 편집할 수 없습니다"
                >
                  편집 불가
                </UnregisteredBadge>
              )}
            </BookRow>
          ))}
        </BookList>
      )}

      {editingBookUuid && (
        <GenreEditModal
          bookUuid={editingBookUuid}
          onClose={() => setEditingBookUuid(null)}
        />
      )}
    </Container>
  );
}

export default function AdminGenresPage() {
  return (
    <Suspense>
      <AdminGenresContent />
    </Suspense>
  );
}
