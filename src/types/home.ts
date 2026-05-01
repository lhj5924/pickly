import type { LibraryItem } from './library';

export interface HomeGenreStat {
  genreCode: string;
  genreName: string;
  booksRead: number;
  percentage: number;
}

export interface HomeRecommendation {
  uuid: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  score: number;
  recommendationType: string;
  reason: string;
}

export interface HomeResponse {
  totalBooksRead: number;
  currentlyReadingCount: number;
  monthlyAverageBooks: number;
  genreStats: HomeGenreStat[];
  currentlyReadingBooks: LibraryItem[];
  recommendations: HomeRecommendation[];
}
