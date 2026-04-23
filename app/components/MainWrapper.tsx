"use client";
import { usePathname } from 'next/navigation';

export default function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/jobs');

  return (
    <main className={isDashboard ? 'min-h-screen' : 'pt-[65px] min-h-screen'}>
      {children}
    </main>
  );
}
