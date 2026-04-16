'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import html2canvas from 'html2canvas';
import { ArrowLeft, Download } from 'lucide-react';
import { useMe } from '@/api/useMe';
import { useMyLibraries } from '@/api/useLibrary';
import { getMockReadingLevel } from '@/mocks';
import { ReadingCalendar } from '@/components/stats';
import { StatsGrid, StatCard } from '@/components/common';
import { PieChart } from '@/components/common/PieChart';
import { OpenedBookIcon, CalendarIcon, BooksIcon } from '@/components/icons/StatIcons';
import { Logo } from '@/components/common/Logo/Logo';

// ─── Flat overrides: remove white-card styling from each section ───

const FlatPieChart = styled(PieChart)`
  background: #ffffff;
  box-shadow: none;
  border-radius: 20px;
  margin-bottom: 0;
  padding: 24px;
`;

const FlatCalendar = styled(ReadingCalendar)`
  background: #ffffff;
  box-shadow: none;
  border-radius: 20px;
  margin-bottom: 0;
  padding: 24px;
`;

// ─── Page layout ───

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px 64px;
  gap: 28px;
`;

const TopBar = styled.div`
  width: 100%;
  max-width: 1200px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
  padding: 6px 0;
  transition: color 0.15s;

  &:hover {
    color: #111;
  }
`;

// ─── Shadow box (NOT captured) ───

const ShadowBox = styled.div`
  box-shadow: 0px 14px 34px 0px #5a5a5a40;
  border-radius: 32px;
`;

// ─── Capture area (this becomes the PNG) ───

const CaptureArea = styled.div`
  width: 1200px;
  border-radius: 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 42px;
  background: linear-gradient(156.48deg, #fde6cc 15.85%, #e7ffe2 88.12%);
`;

const CaptureHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
`;

const CaptureHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 8px;
  flex: 1;
`;

const CaptureHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
`;

const CaptureLevelText = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.35;
  word-break: keep-all;
`;

const CaptureDescText = styled.p`
  font-size: 0.8125rem;
  color: #555;
  margin: 0;
  line-height: 1.55;
  word-break: keep-all;
`;

// ─── Download button ───

const DownloadButton = styled.button<{ $loading: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 40px;
  background: linear-gradient(90deg, #fea24b 0%, #6cb86a 100%);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 999px;
  cursor: ${({ $loading }) => ($loading ? 'not-allowed' : 'pointer')};
  opacity: ${({ $loading }) => ($loading ? 0.7 : 1)};
  transition: opacity 0.15s;

  &:hover:not(:disabled) {
    opacity: 0.88;
  }
`;

// ─── Page ───

export default function StatsSharePage() {
  const router = useRouter();
  const captureRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: me } = useMe();
  const readingLevel = getMockReadingLevel(me?.uuid);

  const { data: completedLibrary = [] } = useMyLibraries('COMPLETED');

  const totalBooks = completedLibrary.length;
  const finishedPairs = completedLibrary.filter(item => item.startedAt && item.finishedAt);
  const averageReadingDays = finishedPairs.length
    ? Math.round(
        finishedPairs.reduce((sum, item) => {
          const ms = new Date(item.finishedAt!).getTime() - new Date(item.startedAt!).getTime();
          return sum + Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
        }, 0) / finishedPairs.length,
      )
    : 0;
  const monthlyFinishedCounts = (() => {
    const map = new Map<string, number>();
    completedLibrary.forEach(item => {
      if (!item.finishedAt) return;
      const d = new Date(item.finishedAt);
      map.set(`${d.getFullYear()}-${d.getMonth()}`, (map.get(`${d.getFullYear()}-${d.getMonth()}`) ?? 0) + 1);
    });
    return map;
  })();
  const monthlyAverage = monthlyFinishedCounts.size
    ? Math.round(
        (Array.from(monthlyFinishedCounts.values()).reduce((a, b) => a + b, 0) / monthlyFinishedCounts.size) * 10,
      ) / 10
    : 0;

  const handleDownload = async () => {
    if (!captureRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
      });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'pickly-stats.png';
      a.click();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <PageWrapper>
      <TopBar>
        <BackButton onClick={() => router.back()}>
          <ArrowLeft size={16} />
          통계로 돌아가기
        </BackButton>
      </TopBar>

      <ShadowBox>
        <CaptureArea ref={captureRef}>
          <CaptureHeader>
            <CaptureHeaderLeft>
              <CaptureLevelText>
                나의 독서 레벨 Lv.{readingLevel.level} - {readingLevel.title}
              </CaptureLevelText>
              <CaptureDescText>&quot;{readingLevel.description}&quot;</CaptureDescText>
            </CaptureHeaderLeft>
            <CaptureHeaderRight>
              <Logo size="36px" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/pickly-jar.png" alt="pickly" width={54} height={54} style={{ objectFit: 'contain', display: 'block' }} />
            </CaptureHeaderRight>
          </CaptureHeader>

          <StatsGrid>
            <StatCard
              label="총 읽은 책 수"
              value={totalBooks ? `${totalBooks}권` : undefined}
              icon={<OpenedBookIcon size={24} />}
            />
            <StatCard
              label="평균 독서 기간"
              value={averageReadingDays ? `${averageReadingDays}일` : undefined}
              icon={<CalendarIcon size={24} />}
            />
            <StatCard
              label="월 평균 권 수"
              value={totalBooks ? `${monthlyAverage}권` : undefined}
              icon={<BooksIcon size={24} />}
            />
          </StatsGrid>

          {/* PieChart first, then ReadingCalendar */}
          <FlatPieChart />
          <FlatCalendar />
        </CaptureArea>
      </ShadowBox>

      <DownloadButton onClick={handleDownload} $loading={isDownloading} disabled={isDownloading}>
        <Download size={18} />
        {isDownloading ? '생성 중...' : '이미지 다운로드'}
      </DownloadButton>
    </PageWrapper>
  );
}
