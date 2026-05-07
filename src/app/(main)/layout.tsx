'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GNB, Footer } from '@/components/layout';
import { useAuthStore } from '@/stores';

const PUBLIC_PATHS = ['/landing'];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated && pathname === '/landing') {
      router.replace('/home');
    } else if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
      router.replace('/landing');
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  if (!hydrated) return null;
  if (isAuthenticated && pathname === '/landing') return null;
  if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) return null;

  return (
    <>
      <GNB />
      <main>{children}</main>
      <Footer />
    </>
  );
}
