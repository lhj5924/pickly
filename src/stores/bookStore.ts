import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book, BookStatus, Review } from '@/types';

interface BookState {
  books: Book[];
  reviews: Review[];
  
  // Actions
  updateBookStatus: (bookId: string, status: BookStatus) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getBooksByStatus: (status: BookStatus) => Book[];
  getReviewByBookId: (bookId: string) => Review | undefined;
  searchBooks: (query: string) => Book[];
}

// Mock 책 데이터
const mockBooks: Book[] = [
  {
    id: '1',
    title: '우리는 모두 천문학자로 태어난다',
    author: '지웅배',
    publisher: '오마이북스',
    publishDate: '2019년 01월 30일',
    coverImage: 'https://image.yes24.com/goods/124857283/XL',
    description: '별과 우주에 관한 가장 인간적인 이야기',
    pageCount: 280,
    categories: [{ id: 12, name: '과학' }, { id: 11, name: '인문학' }],
  },
  {
    id: '2',
    title: '중독된 뇌를 어떻게 바꾸는가',
    author: '저드슨 브루어',
    publisher: '안드로메디안',
    publishDate: '2020년 05월 15일',
    coverImage: 'https://image.yes24.com/goods/90309531/XL',
    description: '나쁜 습관을 끊는 과학적 방법',
    pageCount: 320,
    categories: [{ id: 12, name: '과학' }, { id: 9, name: '자기계발' }],
  },
  {
    id: '3',
    title: '당연하게도 나는 너를',
    author: '박서련',
    publisher: '문학동네',
    publishDate: '2023년 03월 20일',
    coverImage: 'https://image.yes24.com/goods/119564892/XL',
    description: '사랑과 관계에 대한 따뜻한 이야기',
    pageCount: 256,
    categories: [{ id: 1, name: '소설' }, { id: 2, name: '로맨스' }],
  },
  {
    id: '4',
    title: '나나 올리브에게',
    author: '김이설',
    publisher: '창비',
    publishDate: '2022년 07월 10일',
    coverImage: 'https://image.yes24.com/goods/109933559/XL',
    description: '서운해하지는 마세요. 물건들에게도 계절이 있다면, 긴 겨울이 지나 봄이 온 것뿐이에요.',
    pageCount: 224,
    categories: [{ id: 1, name: '소설' }, { id: 8, name: '시/에세이' }],
  },
  {
    id: '5',
    title: '서해는 모든 것을 알았다',
    author: '정세랑',
    publisher: '은행나무',
    publishDate: '2024년 01월 05일',
    coverImage: 'https://image.yes24.com/goods/125698547/XL',
    description: '정세랑 작가의 신작 소설',
    pageCount: 288,
    categories: [{ id: 1, name: '소설' }],
  },
];

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: mockBooks,
      reviews: [],

      updateBookStatus: (bookId, status) => {
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId
              ? {
                  ...book,
                  status,
                  startDate: status === 'reading' ? new Date().toISOString() : book.startDate,
                  endDate: status === 'completed' ? new Date().toISOString() : book.endDate,
                }
              : book
          ),
        }));
      },

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `review_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ reviews: [...state.reviews, newReview] }));
      },

      getBooksByStatus: (status) => {
        return get().books.filter((book) => book.status === status);
      },

      getReviewByBookId: (bookId) => {
        return get().reviews.find((review) => review.bookId === bookId);
      },

      searchBooks: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().books.filter(
          (book) =>
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'pickly-books',
    }
  )
);
