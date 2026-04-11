'use client';

import { GNB, Footer } from '@/components/layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <GNB />
      <main>{children}</main>
      <Footer />
    </>
  );
}
