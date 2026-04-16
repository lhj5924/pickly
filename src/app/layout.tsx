import type { Metadata } from 'next';
import StyledComponentsRegistry from './registry';
import { ThemeProvider, QueryProvider, MockProvider } from '@/components/providers';

export const metadata: Metadata = {
  title: '피클리 - 도서 큐레이션 서비스',
  description: '나만의 독서 기록을 관리하고, 맞춤 추천을 받아보세요',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Titan+One&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <StyledComponentsRegistry>
          <QueryProvider>
            <MockProvider>
              <ThemeProvider>{children}</ThemeProvider>
            </MockProvider>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
