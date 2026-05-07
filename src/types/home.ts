import type { LibraryItem } from './library';
import type { GenreStatsResponse } from './stats';
import type { RecommendedBookResponse } from './recommendation';

export interface HomeResponse {
  totalBooksRead: number;
  currentlyReadingCount: number;
  monthlyAverageBooks: number;
  genreStats: GenreStatsResponse[];
  currentlyReadingBooks: LibraryItem[];
  recommendations: RecommendedBookResponse[];
}
