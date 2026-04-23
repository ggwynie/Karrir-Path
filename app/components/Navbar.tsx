"use client";
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Sembunyikan navbar di halaman dashboard dan jobs
  if (pathname?.startsWith('/dashboard') || pathname?.startsWith('/jobs')) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#111111] h-[65px] px-10 flex items-center justify-between border-b border-[#2e2e2e]">

      {/* LOGO */}
      <Link href="/" className="text-white text-[16px] font-black uppercase tracking-[2px] no-underline">
        Karrir<span className="text-[#f5c842]">Path</span>
      </Link>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-8">
        {session ? (
          <>
            <span className="text-[#c8c8c8] text-[12px] font-bold uppercase tracking-[1px]">
              {session.user?.name?.split(' ')[0]}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-[#f5c842] text-[#111111] px-6 py-2 text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#e0b63a] transition-all border-none cursor-pointer"
            >
              Keluar
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="text-[#c8c8c8] text-[12px] font-bold uppercase tracking-[1px] hover:text-white transition-colors no-underline"
            >
              Masuk
            </Link>
            <Link href="/register">
              <button className="bg-[#f5c842] text-[#111111] px-6 py-2 text-[11px] font-bold tracking-[1.5px] uppercase hover:bg-[#e0b63a] transition-all border-none cursor-pointer">
                Daftar
              </button>
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
