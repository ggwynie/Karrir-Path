"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './recruiter.module.css';

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  experience: string;
  location: string;
  status: 'new' | 'reviewed' | 'interview' | 'offered' | 'rejected';
  appliedDate: string;
  matchScore: number;
}

interface JobPost {
  id: number;
  title: string;
  type: string;
  location: string;
  applicants: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
}

const MOCK_CANDIDATES: Candidate[] = [
  { id: 1, name: 'Aldi Firmansyah', avatar: 'A', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'Tailwind'], experience: '3 tahun', location: 'Jakarta', status: 'new', appliedDate: '20 Jan 2025', matchScore: 92 },
  { id: 2, name: 'Rini Susanti', avatar: 'R', role: 'Product Manager', skills: ['Figma', 'Agile', 'SQL'], experience: '5 tahun', location: 'Bandung', status: 'interview', appliedDate: '18 Jan 2025', matchScore: 88 },
  { id: 3, name: 'Dimas Prasetyo', avatar: 'D', role: 'Backend Engineer', skills: ['Node.js', 'PostgreSQL', 'Docker'], experience: '4 tahun', location: 'Jakarta', status: 'reviewed', appliedDate: '17 Jan 2025', matchScore: 85 },
  { id: 4, name: 'Sinta Wulandari', avatar: 'S', role: 'UI/UX Designer', skills: ['Figma', 'Prototyping', 'User Research'], experience: '2 tahun', location: 'Surabaya', status: 'offered', appliedDate: '15 Jan 2025', matchScore: 90 },
  { id: 5, name: 'Kevin Halim', avatar: 'K', role: 'Data Analyst', skills: ['Python', 'Tableau', 'SQL'], experience: '3 tahun', location: 'Jakarta', status: 'new', appliedDate: '21 Jan 2025', matchScore: 78 },
  { id: 6, name: 'Maya Indah', avatar: 'M', role: 'Marketing Specialist', skills: ['SEO', 'Google Ads', 'Analytics'], experience: '4 tahun', location: 'Jakarta', status: 'rejected', appliedDate: '14 Jan 2025', matchScore: 65 },
];

const MOCK_JOBS: JobPost[] = [
  { id: 1, title: 'Senior Frontend Developer', type: 'Full Time', location: 'Jakarta (Hybrid)', applicants: 24, status: 'active', postedDate: '10 Jan 2025' },
  { id: 2, title: 'Product Manager', type: 'Full Time', location: 'Jakarta (Remote)', applicants: 18, status: 'active', postedDate: '12 Jan 2025' },
  { id: 3, title: 'UI/UX Designer', type: 'Full Time', location: 'Bandung (On-site)', applicants: 31, status: 'active', postedDate: '8 Jan 2025' },
  { id: 4, title: 'Data Analyst Intern', type: 'Magang', location: 'Jakarta (On-site)', applicants: 47, status: 'active', postedDate: '5 Jan 2025' },
  { id: 5, title: 'Backend Engineer', type: 'Full Time', location: 'Jakarta (Hybrid)', applicants: 12, status: 'draft', postedDate: '—' },
];

const STATUS_LABEL: Record<Candidate['status'], string> = {
  new: 'Baru',
  reviewed: 'Ditinjau',
  interview: 'Interview',
  offered: 'Ditawari',
  rejected: 'Ditolak',
};

const STATUS_COLOR: Record<Candidate['status'], string> = {
  new: '#f5c842',
  reviewed: '#60a5fa',
  interview: '#a78bfa',
  offered: '#34d399',
  rejected: '#f87171',
};

export default function RecruiterDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'candidates' | 'jobs' | 'post'>('overview');
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showPostForm, setShowPostForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hide navbar
  useEffect(() => {
    setMounted(true);
    const nav = document.querySelector('nav') as HTMLElement | null;
    if (nav) nav.style.display = 'none';
    return () => { if (nav) nav.style.display = ''; };
  }, []);

  const firstName = session?.user?.name?.split(' ')[0] || 'Recruiter';

  const updateStatus = (id: number, status: Candidate['status']) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const filteredCandidates = filterStatus === 'all'
    ? candidates
    : candidates.filter(c => c.status === filterStatus);

  const stats = {
    totalApplicants: candidates.length,
    newApplicants: candidates.filter(c => c.status === 'new').length,
    interviews: candidates.filter(c => c.status === 'interview').length,
    offered: candidates.filter(c => c.status === 'offered').length,
    activeJobs: MOCK_JOBS.filter(j => j.status === 'active').length,
  };

  if (!mounted) return null;

  return (
    <div className={styles.wrapper}>

      {/* ── PAGE HEADER ── */}
      <div className={styles.pageHeader}>
        <div>
          <p className={styles.greeting}>Dashboard Recruiter</p>
          <h1 className={styles.title}>
            Halo, <span className={styles.titleAccent}>{firstName}!</span>
          </h1>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.postJobBtn} onClick={() => setActiveTab('post')}>
            + Posting Lowongan
          </button>
          <button className={styles.homeBtn} onClick={() => router.push('/')}>
            ← Beranda
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        {([
          { key: 'overview',   label: 'Overview' },
          { key: 'candidates', label: 'Kandidat', badge: stats.newApplicants },
          { key: 'jobs',       label: 'Lowongan', badge: stats.activeJobs },
          { key: 'post',       label: 'Posting Baru' },
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
          {/* Stats */}
          <div className={styles.statsGrid}>
            {[
              { label: 'Total Pelamar',  value: stats.totalApplicants, sub: 'semua posisi' },
              { label: 'Pelamar Baru',   value: stats.newApplicants,   sub: 'belum ditinjau' },
              { label: 'Jadwal Interview', value: stats.interviews,    sub: 'minggu ini' },
              { label: 'Lowongan Aktif', value: stats.activeJobs,      sub: 'sedang berjalan' },
            ].map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
                <span className={styles.statSub}>{s.sub}</span>
              </div>
            ))}
          </div>

          {/* Recent Candidates */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Pelamar Terbaru</h2>
              <button className={styles.seeAllBtn} onClick={() => setActiveTab('candidates')}>
                Lihat Semua →
              </button>
            </div>
            <div className={styles.candidateList}>
              {candidates.filter(c => c.status === 'new').slice(0, 3).map(c => (
                <div key={c.id} className={styles.candidateCard}>
                  <div className={styles.candidateAvatar}>{c.avatar}</div>
                  <div className={styles.candidateInfo}>
                    <p className={styles.candidateName}>{c.name}</p>
                    <p className={styles.candidateRole}>{c.role} · {c.experience}</p>
                    <div className={styles.candidateSkills}>
                      {c.skills.slice(0, 3).map(s => (
                        <span key={s} className={styles.skillTag}>{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className={styles.candidateMeta}>
                    <div className={styles.matchScore}>
                      <span className={styles.matchNum}>{c.matchScore}%</span>
                      <span className={styles.matchLabel}>Match</span>
                    </div>
                    <div className={styles.candidateActions}>
                      <button className={styles.reviewBtn} onClick={() => updateStatus(c.id, 'reviewed')}>Tinjau</button>
                      <button className={styles.interviewBtn} onClick={() => updateStatus(c.id, 'interview')}>Interview</button>
                    </div>
                  </div>
                </div>
              ))}
              {candidates.filter(c => c.status === 'new').length === 0 && (
                <p className={styles.emptyText}>Tidak ada pelamar baru</p>
              )}
            </div>
          </div>

          {/* Active Jobs */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Lowongan Aktif</h2>
              <button className={styles.seeAllBtn} onClick={() => setActiveTab('jobs')}>
                Lihat Semua →
              </button>
            </div>
            <div className={styles.jobList}>
              {MOCK_JOBS.filter(j => j.status === 'active').map(job => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobInfo}>
                    <p className={styles.jobTitle}>{job.title}</p>
                    <p className={styles.jobMeta}>{job.type} · {job.location}</p>
                  </div>
                  <div className={styles.jobStats}>
                    <span className={styles.jobApplicants}>{job.applicants} pelamar</span>
                    <span className={styles.jobDate}>{job.postedDate}</span>
                  </div>
                  <span className={styles.jobBadgeActive}>Aktif</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CANDIDATES ── */}
      {activeTab === 'candidates' && (
        <div className={styles.content}>
          {/* Filter */}
          <div className={styles.filterRow}>
            {['all', 'new', 'reviewed', 'interview', 'offered', 'rejected'].map(s => (
              <button
                key={s}
                className={`${styles.filterBtn} ${filterStatus === s ? styles.filterBtnActive : ''}`}
                onClick={() => setFilterStatus(s)}
              >
                {s === 'all' ? 'Semua' : STATUS_LABEL[s as Candidate['status']]}
              </button>
            ))}
          </div>

          <div className={styles.candidateList}>
            {filteredCandidates.map(c => (
              <div key={c.id} className={styles.candidateCard}>
                <div className={styles.candidateAvatar}>{c.avatar}</div>
                <div className={styles.candidateInfo}>
                  <p className={styles.candidateName}>{c.name}</p>
                  <p className={styles.candidateRole}>{c.role} · {c.experience} · {c.location}</p>
                  <div className={styles.candidateSkills}>
                    {c.skills.map(s => (
                      <span key={s} className={styles.skillTag}>{s}</span>
                    ))}
                  </div>
                  <p className={styles.candidateDate}>Melamar: {c.appliedDate}</p>
                </div>
                <div className={styles.candidateMeta}>
                  <div className={styles.matchScore}>
                    <span className={styles.matchNum}>{c.matchScore}%</span>
                    <span className={styles.matchLabel}>Match</span>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: STATUS_COLOR[c.status], color: c.status === 'new' ? '#111' : '#fff' }}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                  <div className={styles.candidateActions}>
                    {c.status === 'new' && <>
                      <button className={styles.reviewBtn} onClick={() => updateStatus(c.id, 'reviewed')}>Tinjau</button>
                      <button className={styles.interviewBtn} onClick={() => updateStatus(c.id, 'interview')}>Interview</button>
                    </>}
                    {c.status === 'reviewed' && <>
                      <button className={styles.interviewBtn} onClick={() => updateStatus(c.id, 'interview')}>Interview</button>
                      <button className={styles.rejectBtn} onClick={() => updateStatus(c.id, 'rejected')}>Tolak</button>
                    </>}
                    {c.status === 'interview' && <>
                      <button className={styles.offerBtn} onClick={() => updateStatus(c.id, 'offered')}>Tawarkan</button>
                      <button className={styles.rejectBtn} onClick={() => updateStatus(c.id, 'rejected')}>Tolak</button>
                    </>}
                  </div>
                </div>
              </div>
            ))}
            {filteredCandidates.length === 0 && (
              <p className={styles.emptyText}>Tidak ada kandidat dengan status ini</p>
            )}
          </div>
        </div>
      )}

      {/* ── JOBS ── */}
      {activeTab === 'jobs' && (
        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Semua Lowongan</h2>
            <button className={styles.postJobBtn} onClick={() => setActiveTab('post')}>
              + Posting Baru
            </button>
          </div>
          <div className={styles.jobList}>
            {MOCK_JOBS.map(job => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.jobInfo}>
                  <p className={styles.jobTitle}>{job.title}</p>
                  <p className={styles.jobMeta}>{job.type} · {job.location}</p>
                </div>
                <div className={styles.jobStats}>
                  <span className={styles.jobApplicants}>{job.applicants} pelamar</span>
                  <span className={styles.jobDate}>Diposting: {job.postedDate}</span>
                </div>
                <span className={job.status === 'active' ? styles.jobBadgeActive : job.status === 'draft' ? styles.jobBadgeDraft : styles.jobBadgeClosed}>
                  {job.status === 'active' ? 'Aktif' : job.status === 'draft' ? 'Draft' : 'Ditutup'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POST JOB ── */}
      {activeTab === 'post' && (
        <div className={styles.content}>
          <div className={styles.postForm}>
            <h2 className={styles.postFormTitle}>Posting Lowongan Baru</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Judul Posisi *</label>
                <input className={styles.input} placeholder="e.g. Senior Frontend Developer" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tipe Pekerjaan *</label>
                <select className={styles.select}>
                  <option value="">-- Pilih Tipe --</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Freelance</option>
                  <option>Magang</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Lokasi *</label>
                <input className={styles.input} placeholder="e.g. Jakarta (Hybrid)" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Range Gaji</label>
                <input className={styles.input} placeholder="e.g. Rp 8.000.000 – 15.000.000" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Pengalaman Minimum</label>
                <select className={styles.select}>
                  <option>Fresh Graduate</option>
                  <option>1-2 tahun</option>
                  <option>3-5 tahun</option>
                  <option>5+ tahun</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Deadline Lamaran</label>
                <input type="date" className={styles.input} />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Deskripsi Pekerjaan *</label>
              <textarea className={styles.textarea} rows={5} placeholder="Jelaskan tanggung jawab, kualifikasi, dan hal lain yang relevan..." />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Skills yang Dibutuhkan</label>
              <input className={styles.input} placeholder="e.g. React, TypeScript, Node.js (pisahkan dengan koma)" />
            </div>
            <div className={styles.formActions}>
              <button className={styles.draftBtn}>Simpan Draft</button>
              <button className={styles.publishBtn}>Publikasikan</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
