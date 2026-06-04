// ============================================================
// Genre 관련 타입 (스웨거 스키마 기준)
// ============================================================

export interface GenreInfo {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface PreferredGenresResponse {
  genres: GenreInfo[];
}

export interface UpdatePreferredGenresRequest {
  genreCodes: string[];
}

export interface UpdateBookGenresRequest {
  genreIds: number[];
}
