// ============================================================
// src/mocks/mockStats.ts
// Stats 계산 함수 모음 + Mock 데이터.
// API 연동 시 computeStatsData / computeWeeklyData 에
// 실제 API 응답을 그대로 넣으면 됩니다.
// ============================================================

import type { LibraryItem } from '@/types/library';
import { getMockLibraries } from './mockLibraries';

// ── 상수 ─────────────────────────────────────────────────
export const WEEKS_PER_PAGE = 6;

// ── 순수 유틸 ─────────────────────────────────────────────

export const daysBetween = (a: string, b: string): number => {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
};

export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
};

export const formatWeekLabel = (start: Date, end: Date): string =>
  `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`;

// ── 타입 ─────────────────────────────────────────────────

export type WeeklyDataItem = {
  label: string;
  value: number;
  highlight: boolean;
};

export type StaleBook = {
  uuid: string;
  title: string;
  thumbnailUrl: string;
  authors: string[];
  date: string;
};

export type StatsData = {
  totalBooks: number;
  averageReadingDays: number;
  monthlyAverage: number;
  staleBooks: StaleBook[];
  mostRecentFinishedAt: Date | null;
  earliestFinishedAt: Date | null;
};

// ── 계산 함수 ─────────────────────────────────────────────

/**
 * completedLibrary / readingLibrary 를 받아 정적 통계를 계산합니다.
 * API 응답으로 대체할 때는 이 함수의 인자만 교체하면 됩니다.
 */
export const computeStatsData = (
  completedLibrary: LibraryItem[],
  readingLibrary: LibraryItem[],
): StatsData => {
  const totalBooks = completedLibrary.length;

  const finishedPairs = completedLibrary.filter(item => item.startedAt && item.finishedAt);
  const averageReadingDays = finishedPairs.length
    ? Math.round(
        finishedPairs.reduce((sum, item) => sum + daysBetween(item.startedAt!, item.finishedAt!), 0) /
          finishedPairs.length,
      )
    : 0;

  // finishedAt 기준 월별 완독 권수 → 전체 월 평균
  const monthlyFinishedCounts = (() => {
    const map = new Map<string, number>();
    completedLibrary.forEach(item => {
      if (!item.finishedAt) return;
      const d = new Date(item.finishedAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  })();
  const monthlyAverage = monthlyFinishedCounts.size
    ? Math.round(
        (Array.from(monthlyFinishedCounts.values()).reduce((a, b) => a + b, 0) /
          monthlyFinishedCounts.size) *
          10,
      ) / 10
    : 0;

  // 오늘 기준 가장 가까운 (과거의) 완독일
  const mostRecentFinishedAt = completedLibrary.reduce<Date | null>((latest, item) => {
    if (!item.finishedAt) return latest;
    const d = new Date(item.finishedAt);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (d > today) return latest;
    return !latest || d > latest ? d : latest;
  }, null);

  const earliestFinishedAt = completedLibrary.reduce<Date | null>((min, item) => {
    if (!item.finishedAt) return min;
    const d = new Date(item.finishedAt);
    return !min || d < min ? d : min;
  }, null);

  const staleBooks: StaleBook[] = readingLibrary
    .filter(item => item.startedAt)
    .map(item => ({
      uuid: item.uuid,
      title: item.book.title,
      thumbnailUrl: item.book.thumbnailUrl,
      authors: item.book.authors,
      date: (() => {
        const [y, m, day] = item.startedAt!.slice(0, 10).split('-').map(Number);
        return `${y}년 ${m}월 ${day}일`;
      })(),
    }));

  return {
    totalBooks,
    averageReadingDays,
    monthlyAverage,
    staleBooks,
    mostRecentFinishedAt,
    earliestFinishedAt,
  };
};

/**
 * 주간 바 차트용 데이터를 계산합니다.
 * weekPageOffset: 0 = 현재 6주, 1 = 6주 전, ...
 */
export const computeWeeklyData = (
  completedLibrary: LibraryItem[],
  mostRecentFinishedAt: Date | null,
  weekPageOffset: number,
): WeeklyDataItem[] => {
  const currentWeekStart = getWeekStart(new Date());
  return Array.from({ length: WEEKS_PER_PAGE }, (_, i) => {
    const start = new Date(currentWeekStart);
    start.setDate(
      currentWeekStart.getDate() -
        (weekPageOffset * WEEKS_PER_PAGE + (WEEKS_PER_PAGE - 1 - i)) * 7,
    );
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const endExclusive = new Date(start);
    endExclusive.setDate(start.getDate() + 7);

    const value = completedLibrary.filter(item => {
      if (!item.finishedAt) return false;
      const finished = new Date(item.finishedAt);
      return finished >= start && finished < endExclusive;
    }).length;

    const highlight =
      !!mostRecentFinishedAt &&
      mostRecentFinishedAt >= start &&
      mostRecentFinishedAt < endExclusive;

    return { label: formatWeekLabel(start, end), value, highlight };
  });
};

/**
 * 주간 페이지 네비게이션 가능 여부를 계산합니다.
 */
export const computeWeekNavState = (
  earliestFinishedAt: Date | null,
  weekPageOffset: number,
): { canGoPrev: boolean; canGoNext: boolean } => {
  const currentWeekStart = getWeekStart(new Date());
  const earliestShownWeekStart = new Date(currentWeekStart);
  earliestShownWeekStart.setDate(
    currentWeekStart.getDate() - (weekPageOffset * WEEKS_PER_PAGE + (WEEKS_PER_PAGE - 1)) * 7,
  );

  return {
    canGoPrev: !!earliestFinishedAt && earliestFinishedAt < earliestShownWeekStart,
    canGoNext: weekPageOffset > 0,
  };
};

/**
 * 차트 Y축 눈금을 계산합니다. (5 단위 올림)
 * maxBarValue: rawMax < 5 → 5, 5~9 → 10, ...
 */
export const computeBarChartAxis = (
  weeklyData: WeeklyDataItem[],
): { maxBarValue: number; yTicks: number[] } => {
  const rawMax = Math.max(...weeklyData.map(d => d.value), 0);
  const maxBarValue = (Math.floor(rawMax / 5) + 1) * 5;
  const yTicks = Array.from({ length: maxBarValue / 5 + 1 }, (_, i) => i * 5);
  return { maxBarValue, yTicks };
};

// ── Mock 데이터 (API 연동 전 사용) ───────────────────────

const mockCompletedLibrary = getMockLibraries('COMPLETED');
const mockReadingLibrary = getMockLibraries('READING');

export const mockStatsData = computeStatsData(mockCompletedLibrary, mockReadingLibrary);
