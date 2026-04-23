"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const STATS = [
  { num: "73%", label: "Orang Indonesia bekerja tidak sesuai passion" },
  { num: "68%", label: "Fresh graduate kesulitan menemukan pekerjaan pertama" },
  { num: "4.2x", label: "Lebih produktif saat bekerja sesuai minat" },
  { num: "91%", label: "Merasa lebih bahagia ketika karir sesuai passion" },
];

const FEATURE_CARDS = [
  {
    num: "01",
    title: "Temukan Passion",
    desc: "Tes minat berbasis AI yang menganalisis kepribadian, skill, dan tujuan hidupmu untuk menemukan bidang karir yang paling cocok.",
    color: "#f5c842",
  },
  {
    num: "02",
    title: "Mentoring 1-on-1",
    desc: "Terhubung langsung dengan mentor profesional berpengalaman dari perusahaan top Indonesia untuk bimbingan karir personal.",
    color: "#111111",
  },
  {
    num: "03",
    title: "Sertifikasi Skill",
    desc: "Validasi kemampuanmu dengan sertifikat yang diakui industri. Tingkatkan nilai jualmu di mata recruiter.",
    color: "#f5c842",
  },
  {
    num: "04",
    title: "Temukan Pekerjaan",
    desc: "Akses ribuan lowongan dari perusahaan terverifikasi. AI kami mencocokkan profilmu dengan posisi yang paling relevan.",
    color: "#111111",
  },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function StatCard({ num, label, index }: { num: string; label: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
      }}
      className="flex flex-col items-center text-center p-8 border border-[#e0e0e0] bg-white"
    >
      <span className="text-[52px] font-black text-[#111111] leading-none tracking-[-2px]">{num}</span>
      <span className="text-[12px] text-[#888888] mt-3 leading-relaxed max-w-[160px]">{label}</span>
    </div>
  );
}

function FeatureCard({ card, index }: { card: typeof FEATURE_CARDS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isYellow = card.color === "#f5c842";

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
        backgroundColor: isYellow ? "#f5c842" : "#111111",
        color: isYellow ? "#111111" : "#ffffff",
      }}
      className="p-8 flex flex-col gap-4 cursor-default group hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex items-start justify-between">
        <span
          className="text-[11px] font-bold uppercase tracking-[2px]"
          style={{ color: isYellow ? "#111111" : "#f5c842" }}
        >
          {card.num}
        </span>
      </div>
      <h3 className="text-[22px] font-black uppercase tracking-[-0.5px] leading-tight">
        {card.title}
      </h3>
      <p
        className="text-[13px] leading-relaxed"
        style={{ color: isYellow ? "#4a4a4a" : "#c8c8c8" }}
      >
        {card.desc}
      </p>
    </div>
  );
}

function AuthModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="bg-[#f4f4f2] w-full max-w-[400px] p-10 flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Badge */}
        <div className="inline-block px-3 py-1 bg-[#111111] text-[#f5c842] text-[10px] font-bold uppercase tracking-[2px] mb-6">
          Akses Terbatas
        </div>

        <h2 className="text-[28px] font-black uppercase tracking-[-1px] leading-tight mb-3">
          Login untuk <br />
          <span className="text-[#f5c842]">Melanjutkan</span>
        </h2>
        <p className="text-[13px] text-[#4a4a4a] leading-relaxed mb-8">
          Kamu perlu login atau daftar dulu untuk mengakses fitur ini.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/login"
            className="bg-[#111111] text-white px-8 py-3 text-[11px] font-bold uppercase tracking-[2px] hover:bg-[#2e2e2e] transition-all text-center"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="border border-[#111111] text-[#111111] px-8 py-3 text-[11px] font-bold uppercase tracking-[2px] hover:bg-[#111111] hover:text-white transition-all text-center"
          >
            Daftar Sekarang
          </Link>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-[11px] text-[#888888] uppercase tracking-[1px] hover:text-[#111111] transition-colors"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  function handleProtectedLink(href: string) {
    if (session) {
      router.push(href);
    } else {
      setShowAuthModal(true);
    }
  }

  useEffect(() => {
    setHeroVisible(true);
  }, []);

  return (
    <div className="bg-[#f4f4f2] min-h-screen font-sans text-[#111111]">

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* ── HERO ── */}
      <section className="flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <div
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <div className="inline-block px-3 py-1 bg-[#111111] text-[#f5c842] text-[10px] font-bold uppercase tracking-[2px] mb-6">
            AI-Powered Career Path
          </div>

          <h1 className="text-[56px] md:text-[80px] font-black uppercase tracking-[-3px] leading-[0.9] mb-6">
            Work With <br />
            <span className="text-[#f5c842]">Passion.</span>
          </h1>

          <p className="max-w-[500px] text-[14px] leading-relaxed text-[#4a4a4a] mb-4 mx-auto">
            Platform karir inklusif yang membantu anak muda menemukan arah kerja sesuai minat,
            didukung verifikasi skill otomatis dan mentorship.
          </p>

          {/* Tagline baru */}
          <p className="max-w-[560px] text-[18px] md:text-[22px] font-bold text-[#111111] mb-10 mx-auto leading-snug">
            Temukan pekerjaan sesuai minat <br className="hidden md:block" />
            dan passion kamu di{" "}
            <span className="text-[#f5c842]">KarrirPath.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleProtectedLink("/dashboard/seekers")}
              className="bg-[#111111] text-white px-10 py-4 text-[12px] font-bold uppercase tracking-[2px] hover:bg-[#2e2e2e] transition-all text-center"
            >
              Cari Lowongan
            </button>
            <button
              onClick={() => handleProtectedLink("/dashboard/mentorship")}
              className="border border-[#111111] text-[#111111] px-10 py-4 text-[12px] font-bold uppercase tracking-[2px] hover:bg-[#111111] hover:text-white transition-all text-center"
            >
              Mentoring Session
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ── */}
      <section className="bg-[#111111] py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-[#f5c842] text-[#111111] text-[10px] font-bold uppercase tracking-[2px] mb-4">
              Fakta Indonesia
            </div>
            <h2 className="text-[32px] md:text-[44px] font-black uppercase text-white tracking-[-2px] leading-tight">
              Realita Dunia Kerja <br />
              <span className="text-[#f5c842]">di Indonesia</span>
            </h2>
            <p className="text-[#888888] text-[13px] mt-4 max-w-[480px] mx-auto leading-relaxed">
              Data menunjukkan mayoritas pekerja Indonesia tidak bekerja sesuai passion mereka.
              KarrirPath hadir untuk mengubah itu.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <StatCard key={i} num={s.num} label={s.label} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="py-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 bg-[#111111] text-[#f5c842] text-[10px] font-bold uppercase tracking-[2px] mb-4">
              Fitur Unggulan
            </div>
            <h2 className="text-[32px] md:text-[44px] font-black uppercase tracking-[-2px] leading-tight">
              Semua yang Kamu <br />
              <span className="text-[#f5c842]">Butuhkan</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#e0e0e0]">
            {FEATURE_CARDS.map((card, i) => (
              <FeatureCard key={i} card={card} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL SECTION ── */}
      <section className="py-20 px-6 bg-white border-t border-[#e0e0e0]">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block px-3 py-1 bg-[#111111] text-[#f5c842] text-[10px] font-bold uppercase tracking-[2px] mb-4">
              Cerita Mereka
            </div>
            <h2 className="text-[32px] md:text-[44px] font-black uppercase tracking-[-2px] leading-tight">
              Sudah Ribuan yang <br />
              <span className="text-[#f5c842]">Berhasil</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Aditya R.",
                role: "Frontend Dev · GoTo",
                text: "Dulu kerja di bidang yang sama sekali bukan passion gue. Setelah pakai KarrirPath, dalam 3 bulan gue dapet posisi yang beneran gue impiin.",
                avatar: "A",
              },
              {
                name: "Sinta M.",
                role: "UI/UX Designer · Traveloka",
                text: "Fitur match score-nya akurat banget. Langsung tau posisi mana yang cocok sama skill gue. Proses lamarnya juga gampang banget.",
                avatar: "S",
              },
              {
                name: "Bimo P.",
                role: "Data Analyst · OVO",
                text: "Mentor yang gue dapet dari KarrirPath beneran ngebantu banget. Dari nol sampai dapet kerja cuma 2 bulan. Highly recommended!",
                avatar: "B",
              },
            ].map((t, i) => (
              <div key={i} className="border border-[#e0e0e0] p-8 flex flex-col gap-4 hover:border-[#111111] transition-colors duration-300">
                <p className="text-[14px] text-[#4a4a4a] leading-relaxed flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#f0f0f0]">
                  <div className="w-10 h-10 bg-[#111111] text-[#f5c842] flex items-center justify-center font-black text-[14px]">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#111111]">{t.name}</p>
                    <p className="text-[11px] text-[#888888] uppercase tracking-[1px]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-[#111111] py-24 px-6 text-center">
        <div className="max-w-[700px] mx-auto">
          <div className="inline-block px-3 py-1 bg-[#f5c842] text-[#111111] text-[10px] font-bold uppercase tracking-[2px] mb-6">
            Mulai Sekarang
          </div>
          <h2 className="text-[40px] md:text-[60px] font-black uppercase text-white tracking-[-3px] leading-[0.9] mb-6">
            Jangan Tunda <br />
            <span className="text-[#f5c842]">Passion-mu.</span>
          </h2>
          <p className="text-[#888888] text-[14px] leading-relaxed mb-10 max-w-[460px] mx-auto">
            Bergabung dengan 50.000+ anak muda Indonesia yang sudah menemukan karir impian mereka bersama KarrirPath.
          </p>

        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <section id="about" className="py-24 px-6 bg-[#f4f4f2]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Left */}
          <div>
            <div className="inline-block px-3 py-1 bg-[#111111] text-[#f5c842] text-[10px] font-bold uppercase tracking-[2px] mb-6">
              Tentang Kami
            </div>
            <h2 className="text-[36px] md:text-[48px] font-black uppercase tracking-[-2px] leading-[0.95] mb-6">
              Platform Karir <br />
              untuk Generasi <br />
              <span className="text-[#f5c842]">Berikutnya.</span>
            </h2>
            <p className="text-[14px] text-[#4a4a4a] leading-relaxed mb-4">
              KarrirPath lahir dari keresahan sederhana — terlalu banyak anak muda Indonesia yang terjebak di pekerjaan yang tidak mencerminkan siapa mereka sebenarnya.
            </p>
            <p className="text-[14px] text-[#4a4a4a] leading-relaxed mb-8">
              Kami membangun platform yang menggabungkan kecerdasan buatan, jaringan mentor profesional, dan ribuan lowongan terverifikasi — semua dalam satu tempat — agar setiap orang bisa menemukan karir yang benar-benar sesuai passion mereka.
            </p>
            <div className="flex gap-8">
              <div>
                <p className="text-[32px] font-black text-[#111111] leading-none">50K+</p>
                <p className="text-[11px] text-[#888888] uppercase tracking-[1px] mt-1">Pengguna Aktif</p>
              </div>
              <div>
                <p className="text-[32px] font-black text-[#111111] leading-none">840+</p>
                <p className="text-[11px] text-[#888888] uppercase tracking-[1px] mt-1">Perusahaan Partner</p>
              </div>
              <div>
                <p className="text-[32px] font-black text-[#111111] leading-none">200+</p>
                <p className="text-[11px] text-[#888888] uppercase tracking-[1px] mt-1">Mentor Profesional</p>
              </div>
            </div>
          </div>

          {/* Right — nilai-nilai */}
          <div className="flex flex-col gap-4">
            {[
              { title: "Passion-First", desc: "Kami percaya karir terbaik dimulai dari mengenal diri sendiri. Setiap fitur kami dirancang untuk membantu kamu menemukan itu." },
              { title: "Inklusif & Terbuka", desc: "Tidak ada sekat. Dari Sabang sampai Merauke, dari fresh graduate hingga career switcher — semua punya tempat di sini." },
              { title: "Terverifikasi & Terpercaya", desc: "Setiap perusahaan dan mentor di platform kami telah melalui proses verifikasi ketat untuk menjamin kualitas." },
              { title: "Didukung AI", desc: "Teknologi AI kami bekerja di balik layar untuk mencocokkan profil, skill, dan passion kamu dengan peluang terbaik." },
            ].map((v, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white border border-[#e0e0e0] hover:border-[#111111] transition-colors duration-200">
                <div>
                  <h4 className="text-[13px] font-bold uppercase tracking-[1px] mb-1">{v.title}</h4>
                  <p className="text-[12px] text-[#888888] leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#111111] pt-16 pb-8 px-6">
        <div className="max-w-[1100px] mx-auto">
          
          {/* Top */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#2e2e2e]">
            
            {/* Brand */}
            <div className="md:col-span-1">
              <p className="text-white text-[20px] font-black uppercase tracking-[1px] mb-3">
                Karrir<span className="text-[#f5c842]">Path</span>
              </p>
              <p className="text-[#888888] text-[12px] leading-relaxed mb-5">
                Platform karir inklusif berbasis AI untuk generasi muda Indonesia.
              </p>
              <div className="flex gap-3">
                {["ig", "tw", "li", "yt"].map((s) => (
                  <div key={s} className="w-8 h-8 border border-[#2e2e2e] flex items-center justify-center text-[#888888] text-[10px] uppercase font-bold hover:border-[#f5c842] hover:text-[#f5c842] cursor-pointer transition-colors">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-[2px] mb-4">Platform</p>
              <ul className="flex flex-col gap-2">
                {[
                  { name: "Cari Lowongan", href: "/dashboard/seekers" },
                  { name: "Mentorship", href: "/dashboard/mentorship" },
                  { name: "Perusahaan", href: "/dashboard/company" },
                  { name: "Sertifikasi", href: "#" },
                  { name: "Roadmaps", href: "#" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[#888888] text-[12px] hover:text-[#f5c842] transition-colors">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perusahaan */}
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-[2px] mb-4">Perusahaan</p>
              <ul className="flex flex-col gap-2">
                {[
                  { name: "Tentang Kami", href: "#about" },
                  { name: "Blog & Insight", href: "#" },
                  { name: "Karir di KarrirPath", href: "#" },
                  { name: "Press Kit", href: "#" },
                  { name: "Hubungi Kami", href: "#" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-[#888888] text-[12px] hover:text-[#f5c842] transition-colors">{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <p className="text-white text-[11px] font-bold uppercase tracking-[2px] mb-4">Newsletter</p>
              <p className="text-[#888888] text-[12px] leading-relaxed mb-4">
                Tips karir, info lowongan terbaru, dan insight industri langsung ke inbox kamu.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email kamu"
                  className="flex-1 bg-[#1a1a1a] border border-[#2e2e2e] text-white text-[12px] px-3 py-2 outline-none focus:border-[#f5c842] transition-colors placeholder:text-[#555]"
                />
                <button className="bg-[#f5c842] text-[#111111] px-4 py-2 text-[11px] font-bold uppercase hover:bg-[#e0b63a] transition-colors">
                  OK
                </button>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#555] text-[11px] uppercase tracking-[1px]">
              © 2024 KarrirPath — Membangun Masa Depan Inklusif.
            </p>
            <div className="flex gap-6">
              {["Kebijakan Privasi", "Syarat & Ketentuan", "Cookie Policy"].map((item) => (
                <a key={item} href="#" className="text-[#555] text-[11px] hover:text-[#f5c842] transition-colors uppercase tracking-[1px]">
                  {item}
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
