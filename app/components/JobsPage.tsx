'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import styles from './JobsPage.module.css'

export interface Job {
  id: string
  company: string
  position: string
  location: string
  salary: string
  tags: string[]
  description?: string
  requirements?: string[]
  benefits?: string[]
}

interface JobsPageProps {
  type: 'freelance' | 'part-time' | 'magang' | 'full-time'
  title: string
  jobs: Job[]
}

const CITIES = [
  'Jakarta', 'Surabaya', 'Bandung', 'Medan',
  'Yogyakarta', 'Semarang', 'Makassar', 'Bali', 'Remote',
]

const CATEGORIES = [
  'Akuntansi',
  'Administrasi & Dukungan Perkantoran',
  'Periklanan, Seni & Media',
  'Perbankan & Layanan Finansial',
  'Call Center & Layanan Konsumen',
  'CEO & Manajemen Umum',
  'Layanan & Pengembangan Komunitas',
  'Konstruksi',
  'Konsultasi & Strategi',
  'Desain & Arsitektur',
  'Pendidikan & Pelatihan',
  'Teknik',
  'Pertanian, Hewan & Konservasi',
  'Pemerintahan & Pertahanan',
  'Kesehatan & Medis',
  'Perhotelan & Pariwisata',
  'Sumber Daya Manusia & Rekrutmen',
  'Teknologi Informasi & Komunikasi',
  'Asuransi & Superannuation',
  'Hukum',
  'Manufaktur, Transportasi & Logistik',
  'Pemasaran & Komunikasi',
  'Pertambangan, Sumber Daya & Energi',
  'Real Estate & Properti',
  'Ritel & Produk Konsumen',
  'Penjualan',
  'Ilmu Pengetahuan & Teknologi',
  'Olahraga & Rekreasi',
  'Perdagangan & Layanan',
]

export default function JobsPage({ title, jobs }: JobsPageProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [search, setSearch] = useState('')
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [applied, setApplied] = useState(false)
  const [userSkills, setUserSkills] = useState<string[]>([])
  const [userExperiences, setUserExperiences] = useState<{ title: string; desc: string }[]>([])
  const [userPersonal, setUserPersonal] = useState<{ name?: string; phone?: string; location?: string; bio?: string } | null>(null)
  const [userEducations, setUserEducations] = useState<{ degree: string }[]>([])
  const [userCv, setUserCv] = useState('')

  // Load user profile dari localStorage
  useEffect(() => {
    const userEmail = session?.user?.email || 'guest'
    const profileKey = `karrirpath_profile_${userEmail}`
    const saved = localStorage.getItem(profileKey) || localStorage.getItem('karrirpath_profile')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.skills) setUserSkills(parsed.skills)
      if (parsed.experiences) setUserExperiences(parsed.experiences)
      if (parsed.personal) setUserPersonal(parsed.personal)
      if (parsed.educations) setUserEducations(parsed.educations)
    }
    const cvKey = `karrirpath_cv_name_${userEmail}`
    const cv = localStorage.getItem(cvKey)
    if (cv) setUserCv(cv)
  }, [session])

  // Hitung match score berdasarkan requirements vs skills + experience
  const calcMatchScore = (job: Job): { score: number; matched: string[]; missing: string[] } => {
    if (!job.requirements || job.requirements.length === 0) {
      return { score: 0, matched: [], missing: [] }
    }

    const profileText = [
      ...userSkills,
      ...userExperiences.map((e) => `${e.title} ${e.desc}`),
    ].join(' ').toLowerCase()

    const matched: string[] = []
    const missing: string[] = []

    job.requirements.forEach((req) => {
      const reqLower = req.toLowerCase()
      // Cek kata kunci dari requirement ada di profil
      const keywords = reqLower.split(/[\s,&\/]+/).filter((w) => w.length > 3)
      const isMatch = keywords.some((kw) => profileText.includes(kw))
      if (isMatch) matched.push(req)
      else missing.push(req)
    })

    const score = Math.round((matched.length / job.requirements.length) * 100)
    return { score, matched, missing }
  }

  const matchResult = selectedJob ? calcMatchScore(selectedJob) : null

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const removeFilter = (filter: string) => {
    setSelectedCities((prev) => prev.filter((c) => c !== filter))
    setSelectedCategories((prev) => prev.filter((c) => c !== filter))
  }

  const activeFilters = [...selectedCities, ...selectedCategories]

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchLower = search.toLowerCase()
      const matchesSearch =
        search === '' ||
        job.position.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower)

      const matchesCity =
        selectedCities.length === 0 ||
        selectedCities.some((city) =>
          job.location.toLowerCase().includes(city.toLowerCase())
        )

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((cat) =>
          job.tags.some((tag) => tag.toLowerCase().includes(cat.toLowerCase()))
        )

      return matchesSearch && matchesCity && matchesCategory
    })
  }, [jobs, search, selectedCities, selectedCategories])

  const openModal = (job: Job) => {
    setSelectedJob(job)
    setApplied(false)
  }

  const closeModal = () => {
    setSelectedJob(null)
    setApplied(false)
  }

  const getMissingFields = () => {
    const missing: string[] = []
    if (!userPersonal?.name && !session?.user?.name) missing.push('Nama lengkap')
    if (!userPersonal?.phone) missing.push('No. Telepon')
    if (!userPersonal?.location) missing.push('Domisili')
    if (!userPersonal?.bio) missing.push('Bio / Tentang Saya')
    if (userSkills.length === 0) missing.push('Skills')
    if (userExperiences.length === 0) missing.push('Pengalaman Kerja')
    if (userEducations.length === 0) missing.push('Pendidikan')
    if (!userCv) missing.push('CV / Resume')
    return missing
  }

  const handleApply = () => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }
    const missing = getMissingFields()
    if (missing.length > 0) {
      router.push('/dashboard/profile')
      return
    }
    setApplied(true)
  }

  return (
    <div className={styles.wrapper}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <Link href="/dashboard/seekers" className={styles.backBtn}>
          ← Kembali
        </Link>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      {/* Search Bar */}
      <div className={styles.searchSection}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Cari posisi, perusahaan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {activeFilters.length > 0 && (
          <div className={styles.activeFilters}>
            {activeFilters.map((filter) => (
              <span key={filter} className={styles.filterTag}>
                {filter}
                <button
                  className={styles.filterTagRemove}
                  onClick={() => removeFilter(filter)}
                  aria-label={`Hapus filter ${filter}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarTitle}>Domisili</h2>
            <div className={styles.checkboxList}>
              {CITIES.map((city) => (
                <label key={city} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCities.includes(city)}
                    onChange={() => toggleCity(city)}
                  />
                  {city}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.sidebarSection}>
            <h2 className={styles.sidebarTitle}>Kategori</h2>
            <div className={styles.checkboxList}>
              {CATEGORIES.map((cat) => (
                <label key={cat} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Job Listings */}
        <main className={styles.content}>
          <p className={styles.resultsCount}>
            {filteredJobs.length} lowongan ditemukan
          </p>

          {filteredJobs.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tidak ada lowongan yang sesuai filter.</p>
            </div>
          ) : (
            <div className={styles.jobGrid}>
              {filteredJobs.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <div className={styles.jobInfo}>
                    <p className={styles.jobCompany}>{job.company}</p>
                    <h3 className={styles.jobPosition}>{job.position}</h3>
                    <div className={styles.jobMeta}>
                      <span className={styles.jobLocation}>📍 {job.location}</span>
                      <span className={styles.jobSalary}>{job.salary}</span>
                    </div>
                    {job.tags.length > 0 && (
                      <div className={styles.jobTags}>
                        {job.tags.map((tag) => (
                          <span key={tag} className={styles.jobTag}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className={styles.applyBtn} onClick={() => openModal(job)}>
                    Lamar
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal Detail Lowongan */}
      {selectedJob && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>✕</button>

            <div className={styles.modalHeader}>
              <p className={styles.modalCompany}>{selectedJob.company}</p>
              <h2 className={styles.modalTitle}>{selectedJob.position}</h2>
              <div className={styles.modalMeta}>
                <span className={styles.jobLocation}>📍 {selectedJob.location}</span>
                <span className={styles.jobSalary}>{selectedJob.salary}</span>
              </div>
              <div className={styles.jobTags} style={{ marginTop: '12px' }}>
                {selectedJob.tags.map((tag) => (
                  <span key={tag} className={styles.jobTag}>{tag}</span>
                ))}
              </div>

              {/* Match Score */}
              {matchResult && userSkills.length > 0 && (
                <div className={styles.matchBox}>
                  <div className={styles.matchHeader}>
                    <span className={styles.matchLabel}>Kecocokan Profil</span>
                    <span className={`${styles.matchScore} ${
                      matchResult.score >= 70 ? styles.matchHigh :
                      matchResult.score >= 40 ? styles.matchMid : styles.matchLow
                    }`}>
                      {matchResult.score}%
                    </span>
                  </div>
                  <div className={styles.matchTrack}>
                    <div
                      className={`${styles.matchFill} ${
                        matchResult.score >= 70 ? styles.matchFillHigh :
                        matchResult.score >= 40 ? styles.matchFillMid : styles.matchFillLow
                      }`}
                      style={{ width: `${matchResult.score}%` }}
                    />
                  </div>
                  <p className={styles.matchHint}>
                    {matchResult.score >= 70
                      ? '✓ Profil kamu sangat cocok untuk posisi ini!'
                      : matchResult.score >= 40
                      ? '⚡ Cukup cocok, tapi ada beberapa skill yang perlu ditingkatkan.'
                      : '⚠ Profil kamu belum terlalu cocok. Lengkapi skill di halaman profil.'}
                  </p>
                </div>
              )}

              {userSkills.length === 0 && (
                <div className={styles.matchBox}>
                  <p className={styles.matchHint}>
                    💡 <a href="/dashboard/profile" className={styles.matchLink}>Lengkapi profil kamu</a> untuk melihat persentase kecocokan dengan lowongan ini.
                  </p>
                </div>
              )}
            </div>

            <div className={styles.modalBody}>
              {selectedJob.description && (
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Deskripsi Pekerjaan</h3>
                  <p className={styles.modalText}>{selectedJob.description}</p>
                </div>
              )}

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Persyaratan</h3>
                  <ul className={styles.modalList}>
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i} className={styles.modalListItem}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className={styles.modalSection}>
                  <h3 className={styles.modalSectionTitle}>Benefit</h3>
                  <ul className={styles.modalList}>
                    {selectedJob.benefits.map((b, i) => (
                      <li key={i} className={styles.modalListItem}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              {applied ? (
                <div className={styles.appliedMsg}>
                  ✓ Lamaran terkirim! Tim {selectedJob.company} akan menghubungi kamu.
                </div>
              ) : status === 'unauthenticated' ? (
                <div>
                  <p className={styles.profileWarning}>Kamu harus login untuk melamar.</p>
                  <button className={styles.modalApplyBtn} onClick={() => router.push('/login')}>
                    Login Sekarang
                  </button>
                </div>
              ) : getMissingFields().length > 0 ? (
                <div className={styles.profileIncomplete}>
                  <p className={styles.profileWarning}>
                    Lengkapi profil kamu sebelum melamar:
                  </p>
                  <ul className={styles.missingList}>
                    {getMissingFields().map((f) => (
                      <li key={f} className={styles.missingItem}>✗ {f}</li>
                    ))}
                  </ul>
                  <button className={styles.completeProfileBtn} onClick={() => router.push('/dashboard/profile')}>
                    Lengkapi Profil →
                  </button>
                </div>
              ) : (
                <button className={styles.modalApplyBtn} onClick={handleApply}>
                  Kirim Lamaran ke {selectedJob.company}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
