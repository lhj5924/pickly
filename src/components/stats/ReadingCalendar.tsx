'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMyReviews } from '@/api/useReview';
import type { Review } from '@/types/review';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const BAR_COLORS = [
  '#FDF1F1',
  '#FEF5E8',
  '#FDFAE4',
  '#F1F9EC',
  '#EAF7F1',
  '#ECF2FD',
  '#F0EAFD',
  '#FCEAF4',
];

const DAY_HEIGHT_BASE = 72;
const BAR_HEIGHT = 20;
const BAR_GAP = 4;
const BARS_TOP_OFFSET = 24;

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

type DayInfo = { date: Date; isCurrentMonth: boolean };
type WeekInfo = DayInfo[];

const buildCalendarWeeks = (year: number, month: number): WeekInfo[] => {
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const lastOfMonth = new Date(year, month + 1, 0);
  const gridEnd = addDays(lastOfMonth, 6 - lastOfMonth.getDay());

  const weeks: WeekInfo[] = [];
  let cursor = gridStart;
  while (cursor <= gridEnd) {
    const week: WeekInfo = [];
    for (let i = 0; i < 7; i++) {
      week.push({ date: cursor, isCurrentMonth: cursor.getMonth() === month });
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  }
  return weeks;
};

type BarSegment = {
  key: string;
  reviewUuid: string;
  title: string;
  color: string;
  startCol: number;
  endCol: number;
  lane: number;
};

const assignLanes = (segments: Omit<BarSegment, 'lane'>[]): BarSegment[] => {
  const sorted = [...segments].sort((a, b) => a.startCol - b.startCol);
  const laneEnds: number[] = [];
  return sorted.map(seg => {
    let lane = laneEnds.findIndex(end => end < seg.startCol);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(seg.endCol);
    } else {
      laneEnds[lane] = seg.endCol;
    }
    return { ...seg, lane };
  });
};

const computeWeekSegments = (week: WeekInfo, reviews: Review[]): BarSegment[] => {
  const weekStart = startOfDay(week[0].date);
  const weekEnd = startOfDay(week[6].date);
  const raw: Omit<BarSegment, 'lane'>[] = [];

  reviews.forEach(r => {
    if (!r.startDate || !r.endDate) return;
    const rStart = startOfDay(new Date(r.startDate));
    const rEnd = startOfDay(new Date(r.endDate));
    if (rEnd < weekStart || rStart > weekEnd) return;

    const effectiveStart = rStart < weekStart ? weekStart : rStart;
    const effectiveEnd = rEnd > weekEnd ? weekEnd : rEnd;
    const startCol = Math.round((effectiveStart.getTime() - weekStart.getTime()) / 86_400_000);
    const endCol = Math.round((effectiveEnd.getTime() - weekStart.getTime()) / 86_400_000);
    const color = BAR_COLORS[hashString(r.uuid) % BAR_COLORS.length];

    raw.push({
      key: `${r.uuid}-${startCol}`,
      reviewUuid: r.uuid,
      title: r.book.title,
      color,
      startCol,
      endCol,
    });
  });

  return assignLanes(raw);
};

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const SubHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.quinary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UnitLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const Nav = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const MonthLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.tertiary};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Weekday = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.tertiary};
  padding: 0.5rem 0;
`;

const CalendarBody = styled.div`
  border-right: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
`;

const WeekRow = styled.div<{ $height: number }>`
  position: relative;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: ${({ $height }) => $height}px;
`;

const DayCell = styled.div<{ $height: number }>`
  position: relative;
  border-top: 1px solid #eaeaea;
  border-left: 1px solid #eaeaea;
  min-height: ${({ $height }) => $height}px;
`;

const DayNumber = styled.span<{ $dim: boolean }>`
  position: absolute;
  top: 6px;
  right: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $dim, theme }) => ($dim ? '#c8c8c8' : theme.colors.text.secondary)};
`;

const BarsLayer = styled.div`
  position: absolute;
  top: ${BARS_TOP_OFFSET}px;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const BarLink = styled(Link)<{
  $left: number;
  $width: number;
  $top: number;
  $color: string;
}>`
  position: absolute;
  left: ${({ $left }) => $left}%;
  width: calc(${({ $width }) => $width}% - 2px);
  top: ${({ $top }) => $top}px;
  height: ${BAR_HEIGHT}px;
  background: ${({ $color }) => $color};
  border-radius: 100rem;
  pointer-events: auto;
  padding: 0 10px;
  font-size: 0.6875rem;
  font-weight: 400;
  color: #616161;
  line-height: ${BAR_HEIGHT}px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    filter: brightness(0.95);
  }
`;

export const ReadingCalendar = ({ className }: { className?: string }) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const { data: reviews = [] } = useMyReviews();

  const weeks = useMemo(
    () => buildCalendarWeeks(currentMonth.getFullYear(), currentMonth.getMonth()),
    [currentMonth],
  );

  const weekSegments = useMemo(
    () => weeks.map(w => computeWeekSegments(w, reviews)),
    [weeks, reviews],
  );

  const goPrev = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const goNext = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  return (
    <Section className={className}>
      <Header>
        <SubHeader>
          <Title>
            독서 캘린더
            <AlertCircle size={16} color="#a3a3a3" />
          </Title>
          <UnitLabel>단위 : 시간</UnitLabel>
        </SubHeader>
        <Nav>
          <NavBtn onClick={goPrev} aria-label="이전 달">
            <ChevronLeft size={18} />
          </NavBtn>
          <MonthLabel>{currentMonth.getMonth() + 1}월</MonthLabel>
          <NavBtn onClick={goNext} aria-label="다음 달">
            <ChevronRight size={18} />
          </NavBtn>
        </Nav>
      </Header>

      <WeekdayRow>
        {WEEKDAYS.map(w => (
          <Weekday key={w}>{w}</Weekday>
        ))}
      </WeekdayRow>

      <CalendarBody>
        {weeks.map((week, wi) => {
          const segments = weekSegments[wi];
          const laneCount = segments.reduce((max, s) => Math.max(max, s.lane + 1), 0);
          const rowHeight = Math.max(
            DAY_HEIGHT_BASE,
            BARS_TOP_OFFSET + laneCount * (BAR_HEIGHT + BAR_GAP) + 8,
          );

          return (
          <WeekRow key={wi} $height={rowHeight}>
            {week.map((day, di) => (
              <DayCell key={di} $height={rowHeight}>
                <DayNumber $dim={!day.isCurrentMonth}>{day.date.getDate()}</DayNumber>
              </DayCell>
            ))}
            <BarsLayer>
              {segments.map(seg => {
                const left = (seg.startCol / 7) * 100;
                const width = ((seg.endCol - seg.startCol + 1) / 7) * 100;
                const top = seg.lane * (BAR_HEIGHT + BAR_GAP);
                return (
                  <BarLink
                    key={seg.key}
                    href={`/review/${seg.reviewUuid}`}
                    $left={left}
                    $width={width}
                    $top={top}
                    $color={seg.color}
                  >
                    {seg.title}
                  </BarLink>
                );
              })}
            </BarsLayer>
            </WeekRow>
          );
        })}
      </CalendarBody>
    </Section>
  );
};
