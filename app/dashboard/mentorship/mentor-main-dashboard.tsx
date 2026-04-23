"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './mentor-main-dashboard.module.css';

interface BookingRequest {
  id: number;
  mentee: string;
  avatar: string;
  topic: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Review {
  id: number;
  mentee: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

interface ChatThread {
  id: number;
  mentee: string;
  avatar: string;
  lastMsg: string;
  time: string;
  unread: number;
  messages: { role: 'mentor' | 'mentee'; text: string; time: string }[];
}

const MOCK_BOOKINGS: BookingRequest[] = [
  { id: 1, mentee: 'Aldi Firmansyah',  avatar: 'A', topic: 'Career Switch ke Tech',          time: 'Senin, 20 Jan — 10.00',  status: 'pending'  },
  { id: 2, mentee: 'Rini Susanti',     avatar: 'R', topic: 'Resume Review & Interview Prep', time: 'Selasa, 21 Jan — 14.00', status: 'pending'  },
  { id: 3, mentee: 'Dimas Prasetyo',   avatar: 'D', topic: 'System Design Discussion',       time: 'Rabu, 22 Jan — 09.00',   status: 'approved' },
  { id: 4, mentee: 'Sinta Wulandari',  avatar: 'S', topic: 'Product Management Basics',      time: 'Kamis, 23 Jan — 13.00',  status: 'approved' },
];

const MOCK_REVIEWS: Review[] = [
  { id: 1, mentee: 'Budi Santoso',  avatar: 'B', rating: 5, text: 'Mentor yang sangat membantu! Penjelasannya jelas dan mudah dipahami.', date: '15 Jan 2025' },
  { id: 2, mentee: 'Citra Dewi',    avatar: 'C', rating: 5, text: 'Sesi yang sangat produktif. Banyak insight baru tentang career path.', date: '10 Jan 2025' },
  { id: 3, mentee: 'Hendra Wijaya', avatar: 'H', rating: 4, text: 'Sangat membantu untuk mempersiapkan diri masuk ke perusahaan startup.', date: '5 Jan 2025' },
];

const MOCK_THREADS: ChatThread[] = [
  {
    id: 1, mentee: 'Aldi Firmansyah', avatar: 'A',
    lastMsg: 'Terima kasih atas sarannya kak!', time: '10:30', unread: 2,
    messages: [
      { role: 'mentee', text: 'Halo kak, saya mau tanya soal career switch ke tech', time: '10:00' },
      { role: 'mentor', text: 'Halo! Tentu, apa yang ingin kamu tanyakan?', time: '10:05' },
      { role: 'mentee', text: 'Saya background accounting, bisa ga masuk ke product management?', time: '10:20' },
      { role: 'mentor', text: 'Bisa banget! Background accounting justru jadi nilai plus untuk PM.', time: '10:25' },
      { role: 'mentee', text: 'Terima kasih atas sarannya kak!', time: '10:30' },
    ],
  },
  {
    id: 2, mentee: 'Rini Susanti', avatar: 'R',
    lastMsg: 'Boleh minta feedback resume saya kak?', time: '09:15', unread: 1,
    messages: [
      { role: 'mentee', text: 'Kak, saya sudah apply ke 10 perusahaan tapi belum ada yang reply', time: '09:00' },
      { role: 'mentor', text: 'Hmm, mungkin ada yang perlu diperbaiki di resume kamu', time: '09:10' },
      { role: 'mentee', text: 'Boleh minta feedback resume saya kak?', time: '09:15' },
    ],
  },
  {
    id: 3, mentee: 'Dimas Prasetyo', avatar: 'D',
    lastMsg: 'Siap kak, sampai ketemu besok!', time: 'Kemarin', unread: 0,
    messages: [
      { role: 'mentee', text: 'Kak, sesi kita besok jadi kan?', time: '14:00' },
      { role: 'mentor', text: 'Jadi! Kita bahas system design untuk distributed systems ya', time: '14:05' },
      { role: 'mentee', text: 'Siap kak, sampai ketemu besok!', time: '14:10' },
    ],
  },
];

interface Props {
  profile: any;
  onEditProfile: () => void;
  onBack: () => void;
}

export default function MentorMainDashboard({ profile, onEditProfile, onBack }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'schedule' | 'reviews' | 'analytics'>('overview');
  const [bookings, setBookings] = useState<BookingRequest[]>(MOCK_BOOKINGS);
  const [threads, setThreads] = useState<ChatThread[]>(MOCK_THREADS);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(MOCK_THREADS[0]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  // Sembunyikan DashboardNav saat mentor dashboard aktif
  useEffect(() => {
    const nav = document.querySelector('nav') as HTMLElement | null;
    if (nav) nav.style.display = 'none';
    return () => { if (nav) nav.style.display = ''; };
  }, []);

  const handleBooking = (id: number, action: 'approved' | 'rejected') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action } : b));
  };

  const sendMessage = () => {
    if (!chatInput.trim() || !activeThread) return;
    const newMsg = {
      role: 'mentor' as const,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = threads.map(t =>
      t.id === activeThread.id
        ? { ...t, messages: [...t.messages, newMsg], lastMsg: newMsg.text, unread: 0 }
        : t
    );
    setThreads(updated);
    setActiveThread(updated.find(t => t.id === activeThread.id) || null);
    setChatInput('');
  };

  const openThread = (thread: ChatThread) => {
    setActiveThread(thread);
    setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unread: 0 } : t));
  };

  const totalUnread   = threads.reduce((sum, t) => sum + t.unread, 0);
  const pendingCount  = bookings.filter(b => b.status === 'pending').length;
  const approvedCount = bookings.filter(b => b.status === 'approved').length;
  const avgRating     = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  const firstName     = profile?.fullName?.split(' ')[0] || 'Mentor';

  return (
    <div className={styles.wrapper}>

      {/* ── PAGE HEADER ── */}
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.greeting}>Dashboard Mentor</p>
          <h1 className={styles.title}>
            Selamat Datang, <span className={styles.titleAccent}>{firstName}!</span>
          </h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.editBtn} onClick={onEditProfile}>Edit Profil</button>
          <button className={styles.homeBtn} onClick={() => router.push('/')}>← Beranda</button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {([
          { key: 'overview',   label: 'Overview' },
          { key: 'chat',       label: 'Pesan',    badge: totalUnread },
          { key: 'schedule',   label: 'Jadwal',   badge: pendingCount },
          { key: 'reviews',    label: 'Ulasan' },
          { key: 'analytics',  label: 'Analitik & Pembayaran' },
        ] as const).map(tab => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {'badge' in tab && tab.badge > 0 && <span className={styles.tabBadge}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === 'overview' && (
        <div className={styles.content}>
          <div className={styles.statsGrid}>
            {[
              { label: 'Total Sesi',   value: '47',              sub: '+3 bulan ini' },
              { label: 'Rating',       value: avgRating,         sub: `${MOCK_REVIEWS.length} ulasan` },
              { label: 'Mentee Aktif', value: `${approvedCount}`, sub: 'sesi terjadwal' },
              { label: 'Pending',      value: `${pendingCount}`,  sub: 'perlu konfirmasi' },
            ].map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statSub}>{s.sub}</span>
              </div>
            ))}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Sesi Mendatang</h2>
            <div className={styles.sessionList}>
              {bookings.filter(b => b.status === 'approved').map(b => (
                <div key={b.id} className={styles.sessionCard}>
                  <div className={styles.sessionAvatar}>{b.avatar}</div>
                  <div className={styles.sessionInfo}>
                    <p className={styles.sessionMentee}>{b.mentee}</p>
                    <p className={styles.sessionTopic}>{b.topic}</p>
                  </div>
                  <div className={styles.sessionTime}>{b.time}</div>
                  <span className={styles.badgeApproved}>Terkonfirmasi</span>
                </div>
              ))}
            </div>
          </div>

          {pendingCount > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Permintaan Baru</h2>
              <div className={styles.sessionList}>
                {bookings.filter(b => b.status === 'pending').map(b => (
                  <div key={b.id} className={styles.sessionCard}>
                    <div className={styles.sessionAvatar}>{b.avatar}</div>
                    <div className={styles.sessionInfo}>
                      <p className={styles.sessionMentee}>{b.mentee}</p>
                      <p className={styles.sessionTopic}>{b.topic}</p>
                      <p className={styles.sessionTime}>{b.time}</p>
                    </div>
                    <div className={styles.sessionActions}>
                      <button className={styles.approveBtn} onClick={() => handleBooking(b.id, 'approved')}>Terima</button>
                      <button className={styles.rejectBtn}  onClick={() => handleBooking(b.id, 'rejected')}>Tolak</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CHAT ── */}
      {activeTab === 'chat' && (
        <div className={styles.chatLayout}>
          <div className={styles.threadList}>
            <div className={styles.threadListHeader}>Pesan</div>
            {threads.map(thread => (
              <div
                key={thread.id}
                className={`${styles.threadItem} ${activeThread?.id === thread.id ? styles.threadItemActive : ''}`}
                onClick={() => openThread(thread)}
              >
                <div className={styles.threadAvatar}>{thread.avatar}</div>
                <div className={styles.threadInfo}>
                  <div className={styles.threadName}>{thread.mentee}</div>
                  <div className={styles.threadLastMsg}>{thread.lastMsg}</div>
                </div>
                <div className={styles.threadMeta}>
                  <span className={styles.threadTime}>{thread.time}</span>
                  {thread.unread > 0 && <span className={styles.threadUnread}>{thread.unread}</span>}
                </div>
              </div>
            ))}
          </div>

          {activeThread && (
            <div className={styles.chatWindow}>
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderAvatar}>{activeThread.avatar}</div>
                <div>
                  <p className={styles.chatHeaderName}>{activeThread.mentee}</p>
                  <p className={styles.chatHeaderSub}>Mentee</p>
                </div>
              </div>
              <div className={styles.chatMessages}>
                {activeThread.messages.map((msg, i) => (
                  <div key={i} className={`${styles.chatBubble} ${msg.role === 'mentor' ? styles.chatBubbleMentor : styles.chatBubbleMentee}`}>
                    <p className={styles.chatBubbleText}>{msg.text}</p>
                    <span className={styles.chatBubbleTime}>{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className={styles.chatInputArea}>
                <input
                  className={styles.chatInput}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ketik pesan..."
                />
                <button className={styles.chatSendBtn} onClick={sendMessage}>Kirim</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SCHEDULE ── */}
      {activeTab === 'schedule' && (
        <div className={styles.content}>
          {pendingCount > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Menunggu Konfirmasi ({pendingCount})</h2>
              <div className={styles.sessionList}>
                {bookings.filter(b => b.status === 'pending').map(b => (
                  <div key={b.id} className={styles.sessionCard}>
                    <div className={styles.sessionAvatar}>{b.avatar}</div>
                    <div className={styles.sessionInfo}>
                      <p className={styles.sessionMentee}>{b.mentee}</p>
                      <p className={styles.sessionTopic}>{b.topic}</p>
                      <p className={styles.sessionTime}>{b.time}</p>
                    </div>
                    <div className={styles.sessionActions}>
                      <button className={styles.approveBtn} onClick={() => handleBooking(b.id, 'approved')}>Terima</button>
                      <button className={styles.rejectBtn}  onClick={() => handleBooking(b.id, 'rejected')}>Tolak</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Terkonfirmasi ({approvedCount})</h2>
            <div className={styles.sessionList}>
              {bookings.filter(b => b.status === 'approved').map(b => (
                <div key={b.id} className={styles.sessionCard}>
                  <div className={styles.sessionAvatar}>{b.avatar}</div>
                  <div className={styles.sessionInfo}>
                    <p className={styles.sessionMentee}>{b.mentee}</p>
                    <p className={styles.sessionTopic}>{b.topic}</p>
                  </div>
                  <div className={styles.sessionTime}>{b.time}</div>
                  <span className={styles.badgeApproved}>Terkonfirmasi</span>
                </div>
              ))}
              {approvedCount === 0 && <p className={styles.emptyText}>Belum ada sesi terkonfirmasi</p>}
            </div>
          </div>

          {bookings.filter(b => b.status === 'rejected').length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Ditolak</h2>
              <div className={styles.sessionList}>
                {bookings.filter(b => b.status === 'rejected').map(b => (
                  <div key={b.id} className={`${styles.sessionCard} ${styles.sessionCardRejected}`}>
                    <div className={styles.sessionAvatar}>{b.avatar}</div>
                    <div className={styles.sessionInfo}>
                      <p className={styles.sessionMentee}>{b.mentee}</p>
                      <p className={styles.sessionTopic}>{b.topic}</p>
                    </div>
                    <span className={styles.badgeRejected}>Ditolak</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REVIEWS ── */}
      {activeTab === 'reviews' && (
        <div className={styles.content}>
          <div className={styles.ratingOverview}>
            <span className={styles.ratingBig}>{avgRating}</span>
            <div>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={parseFloat(avgRating) >= s ? styles.starFilled : styles.starEmpty}>★</span>
                ))}
              </div>
              <span className={styles.ratingCount}>{MOCK_REVIEWS.length} ulasan</span>
            </div>
          </div>

          <div className={styles.reviewList}>
            {MOCK_REVIEWS.map(r => (
              <div key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <div className={styles.reviewAvatar}>{r.avatar}</div>
                  <div>
                    <p className={styles.reviewName}>{r.mentee}</p>
                    <p className={styles.reviewDate}>{r.date}</p>
                  </div>
                  <div className={styles.reviewStars}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} className={r.rating >= s ? styles.starFilled : styles.starEmpty}>★</span>
                    ))}
                  </div>
                </div>
                <p className={styles.reviewText}>"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ANALITIK & PEMBAYARAN ── */}
      {activeTab === 'analytics' && (
        <div className={styles.content}>

          {/* ── FLOW UANG MASUK ── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Alur Pembayaran</h2>
            <div className={styles.flowChart}>
              {/* Node 1: Mentee Bayar */}
              <div className={styles.flowNode}>
                <div className={styles.flowNodeLabel}>Mentee Bayar</div>
                <div className={styles.flowNodeAmount}>Rp 150.000</div>
                <div className={styles.flowNodeSub}>per sesi 60 mnt</div>
              </div>

              {/* Arrow */}
              <div className={styles.flowArrow}>
                <div className={styles.flowArrowLine} />
                <div className={styles.flowArrowLabel}>100%</div>
                <div className={styles.flowArrowTip}>→</div>
              </div>

              {/* Node 2: Platform */}
              <div className={`${styles.flowNode} ${styles.flowNodePlatform}`}>
                <div className={styles.flowNodeLabel}>KarrirPath</div>
                <div className={styles.flowNodeAmount}>Rp 150.000</div>
                <div className={styles.flowNodeSub}>diterima platform</div>
              </div>

              {/* Split arrows */}
              <div className={styles.flowSplit}>
                <div className={styles.flowSplitTop}>
                  <div className={styles.flowSplitLine} />
                  <div className={styles.flowSplitLabel}>Potongan 20%</div>
                  <div className={styles.flowArrowTip}>→</div>
                </div>
                <div className={styles.flowSplitBottom}>
                  <div className={styles.flowSplitLine} />
                  <div className={styles.flowSplitLabel}>Mentor 80%</div>
                  <div className={styles.flowArrowTip}>→</div>
                </div>
              </div>

              {/* Node 3a: Fee Platform */}
              <div className={styles.flowNodes}>
                <div className={`${styles.flowNode} ${styles.flowNodeFee}`}>
                  <div className={styles.flowNodeLabel}>Fee Platform</div>
                  <div className={`${styles.flowNodeAmount} ${styles.flowNodeAmountFee}`}>Rp 30.000</div>
                  <div className={styles.flowNodeSub}>20% per sesi</div>
                </div>
                {/* Node 3b: Mentor Dapat */}
                <div className={`${styles.flowNode} ${styles.flowNodeMentor}`}>
                  <div className={styles.flowNodeLabel}>Kamu Dapat</div>
                  <div className={`${styles.flowNodeAmount} ${styles.flowNodeAmountMentor}`}>Rp 120.000</div>
                  <div className={styles.flowNodeSub}>80% per sesi</div>
                </div>
              </div>
            </div>
          </div>

          {/* ── RINGKASAN PENDAPATAN ── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Ringkasan Pendapatan</h2>
            <div className={styles.earningCards}>
              <div className={styles.earningCard}>
                <div className={styles.earningCardTop}>
                  <span className={styles.earningCardLabel}>Bulan Ini</span>
                  <span className={styles.earningCardBadge}>+18%</span>
                </div>
                <div className={styles.earningCardAmount}>Rp 2.280.000</div>
                <div className={styles.earningCardSub}>dari 19 sesi · setelah potongan 20%</div>
                <div className={styles.earningCardBreakdown}>
                  <span>Gross: Rp 2.850.000</span>
                  <span>Fee: −Rp 570.000</span>
                </div>
              </div>
              <div className={styles.earningCard}>
                <div className={styles.earningCardTop}>
                  <span className={styles.earningCardLabel}>Bulan Lalu</span>
                  <span className={styles.earningCardBadgePrev}>Des 2024</span>
                </div>
                <div className={styles.earningCardAmount}>Rp 1.920.000</div>
                <div className={styles.earningCardSub}>dari 16 sesi · setelah potongan 20%</div>
                <div className={styles.earningCardBreakdown}>
                  <span>Gross: Rp 2.400.000</span>
                  <span>Fee: −Rp 480.000</span>
                </div>
              </div>
              <div className={`${styles.earningCard} ${styles.earningCardTotal}`}>
                <div className={styles.earningCardTop}>
                  <span className={styles.earningCardLabel}>Total Diterima</span>
                </div>
                <div className={styles.earningCardAmountBig}>Rp 14.720.000</div>
                <div className={styles.earningCardSub}>dari 47 sesi · sejak bergabung</div>
                <div className={styles.earningCardBreakdown}>
                  <span>Gross: Rp 18.400.000</span>
                  <span>Fee: −Rp 3.680.000</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── BAR CHART ── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Pendapatan Bersih 6 Bulan</h2>
            <div className={styles.barChart}>
              {[
                { month: 'Agu', gross: 1200000, net: 960000,  pct: 34 },
                { month: 'Sep', gross: 1800000, net: 1440000, pct: 51 },
                { month: 'Okt', gross: 1500000, net: 1200000, pct: 42 },
                { month: 'Nov', gross: 2100000, net: 1680000, pct: 59 },
                { month: 'Des', gross: 2400000, net: 1920000, pct: 68 },
                { month: 'Jan', gross: 2850000, net: 2280000, pct: 80 },
              ].map((d) => (
                <div key={d.month} className={styles.barItem}>
                  <div className={styles.barAmounts}>
                    <span className={styles.barNet}>Rp {(d.net/1000000).toFixed(2)}jt</span>
                    <span className={styles.barGross}>gross {(d.gross/1000000).toFixed(1)}jt</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div className={styles.barFill} style={{ height: `${d.pct}%` }} />
                  </div>
                  <span className={styles.barMonth}>{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIWAYAT TRANSAKSI ── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Riwayat Transaksi</h2>
            <div className={styles.txTable}>
              <div className={styles.txHeader}>
                <span>Mentee</span>
                <span>Topik</span>
                <span>Tanggal</span>
                <span>Gross</span>
                <span>Fee (20%)</span>
                <span>Kamu Dapat</span>
                <span>Status</span>
              </div>
              {[
                { mentee: 'Aldi F.',  avatar: 'A', topic: 'Career Switch ke Tech',     date: '20 Jan', gross: 150000, fee: 30000,  net: 120000, status: 'Dibayar' },
                { mentee: 'Rini S.',  avatar: 'R', topic: 'Resume Review',             date: '18 Jan', gross: 150000, fee: 30000,  net: 120000, status: 'Dibayar' },
                { mentee: 'Dimas P.', avatar: 'D', topic: 'System Design',             date: '15 Jan', gross: 225000, fee: 45000,  net: 180000, status: 'Dibayar' },
                { mentee: 'Sinta W.', avatar: 'S', topic: 'Product Management',        date: '12 Jan', gross: 150000, fee: 30000,  net: 120000, status: 'Dibayar' },
                { mentee: 'Kevin H.', avatar: 'K', topic: 'Data Science Roadmap',      date: '10 Jan', gross: 150000, fee: 30000,  net: 120000, status: 'Dibayar' },
                { mentee: 'Maya I.',  avatar: 'M', topic: 'Interview Preparation',     date: '8 Jan',  gross: 150000, fee: 30000,  net: 120000, status: 'Pending' },
                { mentee: 'Fajar N.', avatar: 'F', topic: 'Frontend Career Path',      date: '5 Jan',  gross: 225000, fee: 45000,  net: 180000, status: 'Dibayar' },
                { mentee: 'Nadia F.', avatar: 'N', topic: 'Salary Negotiation',        date: '3 Jan',  gross: 150000, fee: 30000,  net: 120000, status: 'Dibayar' },
              ].map((tx, i) => (
                <div key={i} className={styles.txRow}>
                  <div className={styles.txMentee}>
                    <div className={styles.txAvatar}>{tx.avatar}</div>
                    <span>{tx.mentee}</span>
                  </div>
                  <span className={styles.txTopic}>{tx.topic}</span>
                  <span className={styles.txDate}>{tx.date}</span>
                  <span className={styles.txGross}>Rp {tx.gross.toLocaleString('id-ID')}</span>
                  <span className={styles.txFee}>−Rp {tx.fee.toLocaleString('id-ID')}</span>
                  <span className={styles.txNet}>Rp {tx.net.toLocaleString('id-ID')}</span>
                  <span className={tx.status === 'Dibayar' ? styles.txPaid : styles.txPending}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── PENCAIRAN DANA ── */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Pencairan Dana</h2>
            <div className={styles.withdrawCard}>
              <div className={styles.withdrawInfo}>
                <div>
                  <p className={styles.withdrawLabel}>Saldo Tersedia</p>
                  <p className={styles.withdrawAmount}>Rp 2.280.000</p>
                </div>
                <div>
                  <p className={styles.withdrawLabel}>Dalam Proses</p>
                  <p className={styles.withdrawPending}>Rp 120.000</p>
                </div>
                <div>
                  <p className={styles.withdrawLabel}>Total Dicairkan</p>
                  <p className={styles.withdrawTotal}>Rp 12.320.000</p>
                </div>
              </div>
              <button className={styles.withdrawBtn}>Cairkan Dana</button>
            </div>
            <div className={styles.withdrawHistory}>
              <p className={styles.withdrawHistoryTitle}>Riwayat Pencairan</p>
              {[
                { date: '1 Jan 2025', amount: 'Rp 1.920.000', bank: 'BCA ••••4521', status: 'Berhasil' },
                { date: '1 Des 2024', amount: 'Rp 1.680.000', bank: 'BCA ••••4521', status: 'Berhasil' },
                { date: '1 Nov 2024', amount: 'Rp 1.440.000', bank: 'BCA ••••4521', status: 'Berhasil' },
              ].map((w, i) => (
                <div key={i} className={styles.withdrawRow}>
                  <div className={styles.withdrawRowInfo}>
                    <span className={styles.withdrawRowAmount}>{w.amount}</span>
                    <span className={styles.withdrawRowBank}>{w.bank}</span>
                  </div>
                  <span className={styles.withdrawRowDate}>{w.date}</span>
                  <span className={styles.withdrawRowStatus}>{w.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
