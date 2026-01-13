'use client';

import { GNB } from '@/components/layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GNB />
      <main>{children}</main>
    </>
  );
}
