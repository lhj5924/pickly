export type RecommendationType = 'PREFERRED_GENRE' | 'DEMOGRAPHIC' | 'SIMILAR_BOOK' | 'POPULAR' | 'HYBRID';

export interface RecommendedBookResponse {
  uuid: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  score: number;
  recommendationType: RecommendationType;
  reason: string;
}

export interface PopularBookResponse {
  uuid: string;
  title: string;
  authors: string[];
  thumbnailUrl: string;
  rankPosition: number;
  score: number;
}
