export interface UserStatsSummaryResponse {
  totalBooksRead: number;
  totalPagesRead: number;
  averageRating: number;
  currentStreak: number;
  longestStreak: number;
}

export interface MonthlyStatsResponse {
  year: number;
  month: number;
  booksRead: number;
  pagesRead: number;
}

export interface GenreStatsResponse {
  genreCode: string;
  genreName: string;
  booksRead: number;
  percentage: number;
}

export interface MyStatsResponse extends UserStatsSummaryResponse {
  monthlyStats: MonthlyStatsResponse[];
  genreStats: GenreStatsResponse[];
}
