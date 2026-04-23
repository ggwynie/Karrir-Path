"use client";
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styles from './mentorship.module.css';
import MentorProfile from './mentor-profile';
import MentorMainDashboard from './mentor-main-dashboard';

interface Mentor {
  id: number;
  name: string;
  initial: string;
  title: string;
  company: string;
  rating: number;
  reviews: number;
  sessions: number;
  experience: string;
  bio: string;
  expertise: string[];
  price: string;
  online: boolean;
  category: string;
}

// Tambahan interface untuk Mentor Profile
interface MentorProfile {
  fullName: string;
  title: string;
  company: string;
  yearsExperience: number;
  category: string;
  bio: string;
  expertise: string[];
  hourlyRate: string;
  profilePhoto: File | null;
  profilePhotoUrl: string;
  cv: File | null;
  cvUrl: string;
  certifications: {
    name: string;
    issuer: string;
    year: string;
    url: string;
  }[];
  projects: {
    title: string;
    description: string;
    link: string;
    year: string;
  }[];
  socialLinks: {
    linkedin: string;
    github: string;
    portfolio: string;
    twitter: string;
  };
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  languages: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

const MENTORS: Mentor[] = [
  {
    id: 1, name: 'Andi Pratama', initial: 'A',
    title: 'Senior Software Engineer', company: 'GoTo Group',
    rating: 4.9, reviews: 128, sessions: 340, experience: '8 tahun',
    bio: 'Engineer berpengalaman di bidang backend dan sistem terdistribusi. Pernah memimpin tim 15 orang di GoTo. Spesialis dalam arsitektur microservices dan cloud-native.',
    expertise: ['Backend', 'System Design', 'Career Growth', 'Tech Interview'],
    price: 'Rp 150.000', online: true, category: 'Tech',
  },
  {
    id: 2, name: 'Sari Dewi', initial: 'S',
    title: 'Product Manager', company: 'Traveloka',
    rating: 4.8, reviews: 95, sessions: 210, experience: '6 tahun',
    bio: 'PM dengan track record meluncurkan 10+ produk sukses. Ahli dalam product strategy, user research, dan stakeholder management di perusahaan unicorn.',
    expertise: ['Product Strategy', 'User Research', 'Roadmap', 'PM Interview'],
    price: 'Rp 175.000', online: true, category: 'Product',
  },
  {
    id: 3, name: 'Budi Santoso', initial: 'B',
    title: 'Marketing Director', company: 'Unilever Indonesia',
    rating: 4.7, reviews: 76, sessions: 180, experience: '12 tahun',
    bio: 'Direktur marketing dengan pengalaman membangun brand FMCG global. Ahli dalam digital marketing, brand strategy, dan growth hacking.',
    expertise: ['Digital Marketing', 'Brand Strategy', 'Growth', 'Leadership'],
    price: 'Rp 200.000', online: false, category: 'Marketing',
  },
  {
    id: 4, name: 'Dewi Kusuma', initial: 'D',
    title: 'UI/UX Lead', company: 'Sea Group',
    rating: 4.9, reviews: 112, sessions: 290, experience: '7 tahun',
    bio: 'Design lead yang telah merancang produk untuk 50 juta+ pengguna. Spesialis dalam design system, user research, dan mentoring junior designer.',
    expertise: ['UI Design', 'UX Research', 'Design System', 'Portfolio Review'],
    price: 'Rp 160.000', online: true, category: 'Design',
  },
  {
    id: 5, name: 'Rizky Maulana', initial: 'R',
    title: 'Data Science Manager', company: 'OVO',
    rating: 4.6, reviews: 64, sessions: 145, experience: '5 tahun',
    bio: 'Data scientist yang membangun model ML untuk jutaan transaksi fintech. Ahli dalam machine learning, data analytics, dan career transition ke data science.',
    expertise: ['Machine Learning', 'Data Analytics', 'Python', 'Career Switch'],
    price: 'Rp 165.000', online: true, category: 'Data',
  },
  {
    id: 6, name: 'Nadia Fitri', initial: 'N',
    title: 'HR Business Partner', company: 'Astra International',
    rating: 4.8, reviews: 89, sessions: 220, experience: '9 tahun',
    bio: 'HRBP berpengalaman di perusahaan multinasional. Ahli dalam career planning, salary negotiation, interview preparation, dan pengembangan soft skills.',
    expertise: ['Career Planning', 'Interview Prep', 'Salary Nego', 'Leadership'],
    price: 'Rp 140.000', online: true, category: 'HR',
  },
  {
    id: 7, name: 'Fajar Nugroho', initial: 'F',
    title: 'Frontend Engineer', company: 'Tokopedia',
    rating: 4.7, reviews: 83, sessions: 195, experience: '5 tahun',
    bio: 'Frontend engineer spesialis React dan performance optimization. Aktif berkontribusi ke open source dan senang membantu junior developer berkembang.',
    expertise: ['React', 'TypeScript', 'Performance', 'Code Review'],
    price: 'Rp 130.000', online: true, category: 'Tech',
  },
  {
    id: 8, name: 'Maya Indah', initial: 'M',
    title: 'Business Analyst', company: 'Bank Mandiri',
    rating: 4.5, reviews: 57, sessions: 130, experience: '6 tahun',
    bio: 'BA dengan pengalaman di perbankan dan fintech. Spesialis dalam business process improvement, requirements gathering, dan transisi karir ke dunia finance.',
    expertise: ['Business Analysis', 'Finance', 'SQL', 'Career Transition'],
    price: 'Rp 145.000', online: false, category: 'Finance',
  },
  {
    id: 9, name: 'Kevin Halim', initial: 'K',
    title: 'Startup Founder', company: 'Ex-Grab, Ex-Gojek',
    rating: 4.9, reviews: 143, sessions: 380, experience: '10 tahun',
    bio: 'Founder 2 startup yang berhasil exit. Pernah bekerja di Grab dan Gojek. Mentor untuk aspiring entrepreneur, product thinking, dan fundraising.',
    expertise: ['Entrepreneurship', 'Fundraising', 'Product', 'Leadership'],
    price: 'Rp 250.000', online: true, category: 'Product',
  },
];

const CATEGORIES = ['Semua', 'Tech', 'Product', 'Design', 'Marketing', 'Data', 'HR', 'Finance'];

const SLOTS = [
  { time: 'Senin, 09.00', booked: false },
  { time: 'Senin, 11.00', booked: true },
  { time: 'Senin, 14.00', booked: false },
  { time: 'Selasa, 10.00', booked: false },
  { time: 'Selasa, 13.00', booked: true },
  { time: 'Selasa, 15.00', booked: false },
  { time: 'Rabu, 09.00', booked: false },
  { time: 'Rabu, 11.00', booked: false },
  { time: 'Rabu, 14.00', booked: true },
  { time: 'Kamis, 10.00', booked: false },
  { time: 'Kamis, 13.00', booked: false },
  { time: 'Jumat, 09.00', booked: false },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  );
}

interface ChatMsg { role: 'user' | 'mentor'; text: string; }

export default function MentorshipPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || 'guest';
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'chat'>('profile');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [myBookings, setMyBookings] = useState<{mentorId: number, time: string}[]>([]);
  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // State untuk Mentor Dashboard
  const [viewMode, setViewMode] = useState<'browse' | 'mentor-dashboard' | 'mentor-profile'>('browse');
  // isMentor langsung dari session role
  const isMentor = (session?.user as any)?.role === 'mentor';
  const [mentorProfile, setMentorProfile] = useState<MentorProfile>({
    fullName: '',
    title: '',
    company: '',
    yearsExperience: 0,
    category: 'Tech',
    bio: '',
    expertise: [],
    hourlyRate: '',
    profilePhoto: null,
    profilePhotoUrl: '',
    cv: null,
    cvUrl: '',
    certifications: [],
    projects: [],
    socialLinks: { linkedin: '', github: '', portfolio: '', twitter: '' },
    availability: { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false },
    languages: [],
    education: [],
  });
  const [expertiseInput, setExpertiseInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  useEffect(() => {
    setMounted(true);
    
    // Load bookings per user
    const bookingKey = `karrirpath_bookings_${userEmail}`;
    const saved = localStorage.getItem(bookingKey);
    if (saved) setMyBookings(JSON.parse(saved));
    
    // Check if user is mentor - pakai session role sebagai sumber utama
    const sessionRole = (session?.user as any)?.role;
    const mentorKey = `karrirpath_mentor_profile_${userEmail}`;
    const mentorData = localStorage.getItem(mentorKey);
    
    if (mentorData) {
      setMentorProfile(JSON.parse(mentorData));
    }
    
    // Auto redirect ke mentor dashboard jika role mentor
    if (sessionRole === 'mentor') {
      setViewMode('mentor-dashboard');
    }
  }, [userEmail, session]);

  const saveBooking = (mentorId: number, time: string) => {
    const newBookings = [...myBookings, { mentorId, time }];
    setMyBookings(newBookings);
    const bookingKey = `karrirpath_bookings_${userEmail}`;
    localStorage.setItem(bookingKey, JSON.stringify(newBookings));
    setBooked(true);
  };

  const handleMentorProfileUpdate = (profile: MentorProfile) => {
    setMentorProfile(profile);
    // Simpan per user
    const mentorKey = `karrirpath_mentor_profile_${userEmail}`;
    localStorage.setItem(mentorKey, JSON.stringify(profile));
  };

  const switchToBrowse = () => {
    setViewMode('browse');
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMsgs]);

  if (!mounted) return null;

  // Show Mentor Main Dashboard
  if (viewMode === 'mentor-dashboard') {
    return (
      <MentorMainDashboard
        profile={mentorProfile}
        onEditProfile={() => setViewMode('mentor-profile')}
        onBack={switchToBrowse}
      />
    );
  }

  // Show Mentor Profile Editor
  if (viewMode === 'mentor-profile') {
    return (
      <MentorProfile
        profile={mentorProfile}
        onUpdate={(p: MentorProfile) => { handleMentorProfileUpdate(p); setViewMode('mentor-dashboard'); }}
        onBack={() => setViewMode('mentor-dashboard')}
      />
    );
  }

  const filtered = MENTORS.filter((m) => {
    const matchSearch = search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some((e) => e.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'Semua' || m.category === category;
    const matchOnline = !onlineOnly || m.online;
    return matchSearch && matchCat && matchOnline;
  });

  const openMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setActiveTab('profile');
    setSelectedSlot(null);
    setBooked(false);
    const greeting = `Halo! Saya ${mentor.name}, ${mentor.title} di ${mentor.company}. Saya siap membantu kamu. Ada yang ingin didiskusikan?`;
    setChatMsgs([{ role: 'mentor', text: greeting }]);
    setChatHistory([{ role: 'model', parts: [{ text: greeting }] }]);
    setChatLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() || !selectedMentor || chatLoading) return;
    const userText = chatInput.trim();
    setChatInput('');
    setChatMsgs((prev) => [...prev, { role: 'user', text: userText }]);
    setChatLoading(true);

    // Inject konteks mentor ke pesan
    const contextMsg = `Kamu adalah ${selectedMentor.name}, seorang ${selectedMentor.title} di ${selectedMentor.company} dengan ${selectedMentor.experience} pengalaman. Keahlianmu: ${selectedMentor.expertise.join(', ')}. Jawab sebagai mentor karir yang membantu, dalam Bahasa Indonesia, singkat dan praktis. Pesan user: ${userText}`;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextMsg, history: chatHistory }),
      });
      const data = await res.json();
      const reply = data.text || 'Maaf, saya tidak bisa menjawab saat ini. Coba lagi ya!';
      setChatMsgs((prev) => [...prev, { role: 'mentor', text: reply }]);
      setChatHistory((prev) => [
        ...prev,
        { role: 'user', parts: [{ text: userText }] },
        { role: 'model', parts: [{ text: reply }] },
      ]);
    } catch {
      setChatMsgs((prev) => [...prev, { role: 'mentor', text: 'Koneksi bermasalah. Coba lagi sebentar.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>Mentorship</div>
        <h1 className={styles.heroTitle}>
          Konsultasi Karir<br />
          <span className={styles.heroAccent}>Langsung</span> dengan Ahlinya.
        </h1>
        <p className={styles.heroSub}>
          Terhubung dengan mentor profesional berpengalaman. Tanya, diskusi, dan jadwalkan sesi 1-on-1 sesuai waktu kamu.
        </p>
        <div className={styles.heroSearch}>
          <input
            className={styles.heroSearchInput}
            placeholder="Cari mentor, keahlian, atau topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className={styles.heroSearchBtn}>Cari</button>
        </div>
        <div style={{ marginTop: 16 }}>
          <button
            className={styles.becomeMentorBtn}
            onClick={() => {
              if (isMentor) {
                // Langsung ke dashboard utama mentor
                setViewMode('mentor-dashboard');
              } else {
                // Jika belum jadi mentor, arahkan ke form profil
                setViewMode('mentor-profile');
              }
            }}
          >
            {isMentor ? 'Dashboard Mentor' : 'Daftar Sebagai Mentor'}
          </button>
        </div>
      </div>

      <div className={styles.body}>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideSection}>
            <h3 className={styles.sideTitle}>Kategori</h3>
            <div className={styles.checkList}>
              {CATEGORIES.map((cat) => (
                <label key={cat} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.sideSection}>
            <h3 className={styles.sideTitle}>Ketersediaan</h3>
            <div className={styles.checkList}>
              <label className={styles.checkLabel}>
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={() => setOnlineOnly((v) => !v)}
                />
                Online Sekarang
              </label>
            </div>
          </div>
        </aside>

        {/* Mentor Grid */}
        <main className={styles.content}>
          <div className={styles.contentHeader}>
            <p className={styles.resultCount}>{filtered.length} mentor ditemukan</p>
          </div>

          <div className={styles.mentorGrid}>
            {filtered.map((mentor) => (
              <div key={mentor.id} className={styles.mentorCard} onClick={() => openMentor(mentor)}>
                <div className={styles.mentorTop}>
                  <div className={styles.mentorAvatar}>{mentor.initial}</div>
                  <div className={styles.mentorInfo}>
                    <h3 className={styles.mentorName}>{mentor.name}</h3>
                    <p className={styles.mentorTitle}>{mentor.title}</p>
                    <p className={styles.mentorCompany}>{mentor.company}</p>
                  </div>
                </div>

                <div className={styles.mentorRating}>
                  <StarRating rating={mentor.rating} />
                  <span className={styles.ratingNum}>{mentor.rating}</span>
                  <span className={styles.ratingCount}>({mentor.reviews} ulasan)</span>
                </div>

                <p className={styles.mentorBio}>{mentor.bio.slice(0, 90)}...</p>

                <div className={styles.mentorTags}>
                  {mentor.expertise.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.mentorTag}>{tag}</span>
                  ))}
                </div>

                <div className={styles.mentorFooter}>
                  <div>
                    <div className={styles.mentorPrice}>{mentor.price}</div>
                    <div className={styles.mentorPriceSub}>per sesi 60 menit</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    {mentor.online ? (
                      <span className={styles.onlineBadge}>
                        <span className={styles.onlineDot} />
                        Online
                      </span>
                    ) : (
                      <span className={styles.offlineBadge}>
                        <span className={styles.offlineDot} />
                        Offline
                      </span>
                    )}
                    <button className={styles.consultBtn} onClick={(e) => { e.stopPropagation(); openMentor(mentor); }}>
                      Konsultasi
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {selectedMentor && (
        <div className={styles.overlay} onClick={() => setSelectedMentor(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedMentor(null)}>✕</button>

            {/* Tabs */}
            <div className={styles.modalTabs}>
              {(['profile', 'schedule', 'chat'] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.modalTab} ${activeTab === tab ? styles.modalTabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'profile' ? 'Profil' : tab === 'schedule' ? 'Jadwal' : 'Chat'}
                </button>
              ))}
            </div>

            <div className={styles.modalBody}>

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className={styles.modalProfile}>
                  <div className={styles.modalMentorTop}>
                    <div className={styles.modalAvatar}>{selectedMentor.initial}</div>
                    <div>
                      <h2 className={styles.modalMentorName}>{selectedMentor.name}</h2>
                      <p className={styles.modalMentorTitle}>{selectedMentor.title}</p>
                      <p className={styles.modalMentorCompany}>{selectedMentor.company}</p>
                      <div className={styles.mentorRating} style={{ marginTop: 8 }}>
                        <StarRating rating={selectedMentor.rating} />
                        <span className={styles.ratingNum}>{selectedMentor.rating}</span>
                        <span className={styles.ratingCount}>({selectedMentor.reviews} ulasan)</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.statsRow}>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{selectedMentor.sessions}</span>
                      <span className={styles.statLabel}>Sesi</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{selectedMentor.experience}</span>
                      <span className={styles.statLabel}>Pengalaman</span>
                    </div>
                    <div className={styles.statBox}>
                      <span className={styles.statNum}>{selectedMentor.price}</span>
                      <span className={styles.statLabel}>Per Sesi</span>
                    </div>
                  </div>

                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>Tentang Mentor</h3>
                    <p className={styles.modalText}>{selectedMentor.bio}</p>
                  </div>

                  <div className={styles.modalSection}>
                    <h3 className={styles.modalSectionTitle}>Keahlian</h3>
                    <div className={styles.modalTagsWrap}>
                      {selectedMentor.expertise.map((tag) => (
                        <span key={tag} className={styles.modalTag}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  <button className={styles.bookBtn} onClick={() => setActiveTab('schedule')}>
                    Jadwalkan Sesi →
                  </button>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === 'schedule' && (
                <div className={styles.scheduleTab}>
                  <h3 className={styles.scheduleTitle}>Pilih Jadwal Konsultasi</h3>
                  <div className={styles.slotGrid}>
                    {SLOTS.map((slot) => {
                      const isMyBooking = myBookings.some((b) => b.mentorId === selectedMentor.id && b.time === slot.time);
                      const isBooked = slot.booked || isMyBooking;
                      
                      return (
                        <button
                          key={slot.time}
                          disabled={isBooked && !isMyBooking} // Boleh di-klik jika milik sendiri? Atau hanya disable.
                          className={`${styles.slot} ${isBooked ? styles.slotBooked : ''} ${selectedSlot === slot.time ? styles.slotSelected : ''} ${isMyBooking ? styles.slotMyBooking : ''}`}
                          onClick={() => {
                            if (!isBooked) setSelectedSlot(slot.time);
                          }}
                          style={isMyBooking ? { border: '2px solid #f5c842', background: '#fff', color: '#111' } : {}}
                        >
                          {slot.time}
                          {isMyBooking ? (
                             <div style={{ fontSize: 9, marginTop: 2, fontWeight: 'bold' }}>Jadwal Kamu</div>
                          ) : isBooked ? (
                             <div style={{ fontSize: 9, marginTop: 2 }}>Penuh</div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {booked || (selectedSlot && myBookings.some(b => b.mentorId === selectedMentor.id && b.time === selectedSlot)) ? (
                    <div className={styles.bookedMsg}>
                      Sesi ini sudah kamu jadwalkan! {selectedMentor.name} akan menghubungi kamu pada {selectedSlot}.
                    </div>
                  ) : (
                    <button
                      className={styles.bookBtn}
                      disabled={!selectedSlot}
                      onClick={() => selectedSlot && saveBooking(selectedMentor.id, selectedSlot)}
                    >
                      {selectedSlot ? `Konfirmasi Sesi — ${selectedSlot}` : 'Pilih jadwal dulu'}
                    </button>
                  )}
                </div>
              )}

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className={styles.chatWrap}>
                  <div className={styles.chatMessages}>
                    {chatMsgs.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          maxWidth: '75%',
                          width: 'fit-content',
                          padding: '10px 14px',
                          fontSize: 13,
                          lineHeight: 1.6,
                          border: '2px solid #111111',
                          background: msg.role === 'user' ? '#111111' : '#ffffff',
                          color: msg.role === 'user' ? '#ffffff' : '#111111',
                          wordBreak: 'break-word',
                        }}
                      >
                        {msg.role === 'mentor' && (
                          <div className={styles.chatBubbleName}>{selectedMentor.name} (AI)</div>
                        )}
                        {msg.text}
                      </div>
                    ))}
                    {chatLoading && (
                      <div style={{ alignSelf: 'flex-start', padding: '10px 14px', border: '2px solid #e0e0e0', background: '#f4f4f2', fontSize: 12, color: '#888888' }}>
                        {selectedMentor.name} sedang mengetik...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className={styles.chatInput}>
                    <input
                      className={styles.chatInputField}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                      placeholder={`Tanya ${selectedMentor.name} tentang karir kamu...`}
                      disabled={chatLoading}
                    />
                    <button className={styles.chatSendBtn} onClick={sendChat} disabled={chatLoading}>
                      {chatLoading ? '...' : 'Kirim'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
