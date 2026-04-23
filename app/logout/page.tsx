"use client";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function LogoutPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session) {
      // Ada session NextAuth — pakai signOut
      await signOut({ callbackUrl: "/" });
    } else {
      // Tidak ada session (login simulasi) — langsung redirect
      router.push("/");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#f4f4f2] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">

        <div className="inline-block px-3 py-1 bg-[#111111] text-[#f5c842] text-[10px] font-bold uppercase tracking-[2px] mb-6">
          KarrirPath
        </div>

        <h1 className="text-[40px] font-black uppercase tracking-[-2px] leading-[0.95] text-[#111111] mb-3">
          Yakin mau <br />
          <span className="text-[#f5c842]">Keluar?</span>
        </h1>

        <p className="text-[13px] text-[#888888] mb-10 leading-relaxed">
          Kamu akan keluar dari sesi ini. Progress dan data profilmu tetap tersimpan.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full bg-[#111111] text-white py-4 text-[12px] font-bold uppercase tracking-[2px] hover:bg-[#2e2e2e] transition-all border-none cursor-pointer"
          >
            Ya, Keluar Sekarang
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-transparent text-[#111111] py-4 text-[12px] font-bold uppercase tracking-[2px] border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all cursor-pointer"
          >
            Batal, Kembali
          </button>
        </div>

      </div>
    </div>
  );
}
