export interface Category {
  id: number;
  name: string;
}

export const BOOK_CATEGORIES: Category[] = [
  { id: 1, name: '소설' },
  { id: 2, name: '로맨스' },
  { id: 3, name: '판타지' },
  { id: 4, name: 'SF' },
  { id: 5, name: '미스터리/스릴러' },
  { id: 6, name: '호러' },
  { id: 7, name: '역사소설' },
  { id: 8, name: '시/에세이' },
  { id: 9, name: '자기계발' },
  { id: 10, name: '경제/경영' },
  { id: 11, name: '인문학' },
  { id: 12, name: '과학' },
  { id: 13, name: '역사' },
  { id: 14, name: '사회' },
  { id: 15, name: '예술' },
  { id: 16, name: '여행' },
  { id: 17, name: '요리' },
  { id: 18, name: '건강' },
  { id: 19, name: '종교/영성' },
  { id: 20, name: '만화/웹툰' },
  { id: 21, name: '라이트노벨' },
  { id: 22, name: '아동/청소년' },
];

export type BookStatus = 'reading' | 'wishlist' | 'completed' | null;

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  coverImage: string;
  description: string;
  pageCount: number;
  categories: Category[];
  status?: BookStatus;
  startDate?: string;
  endDate?: string;
  progress?: number;
}

export interface Review {
  id: string;
  bookId: string;
  book: Book;
  content: string;
  rating: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface ReadingStats {
  totalBooks: number;
  averageReadingDays: number;
  monthlyAverage: number;
}

export interface MonthlyReading {
  month: string;
  count: number;
  label: string;
}

export interface GenreStats {
  genre: string;
  percentage: number;
  color: string;
}

export interface CalendarItem {
  date: string;
  books: Book[];
}
