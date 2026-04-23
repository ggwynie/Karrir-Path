"use client";
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './roadmap.module.css';

export default function RoadmapPage() {
  const [status, setStatus] = useState('student');
  const [major, setMajor] = useState('');
  const [interests, setInterests] = useState('');
  const [target, setTarget] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!major || !interests || !target) {
      setError("Silakan isi semua bidang yang diperlukan.");
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, major, interests, target }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan saat memproses data.');
      }

      setRoadmap(data.roadmap);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>AI Career Coach</div>
        <h1 className={styles.heroTitle}>
          Bangun <span className={styles.heroAccent}>Roadmap</span> Karir
        </h1>
        <p className={styles.heroSub}>
          Ceritakan latar belakang kamu dan biarkan AI merancang langkah demi langkah karir yang paling tepat untuk masa depanmu.
        </p>
      </div>

      <div className={styles.container}>
        {/* Form Card */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Profil Kamu</h2>          <form onSubmit={handleSubmit}>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Status Saat Ini</label>
              <select 
                className={styles.select}
                value={status} 
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="student">Mahasiswa</option>
                <option value="professional">Pencari Kerja / Profesional</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Jurusan / Latar Belakang Pendidikan</label>
              <input 
                type="text" 
                className={styles.input}
                placeholder={status === 'student' ? 'Contoh: Sistem Informasi' : 'Contoh: Teknik Informatika / Bootcamp Fullstack'}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Bidang yang Diminati (Interests)</label>
              <textarea 
                className={styles.textarea}
                placeholder="Contoh: Saya suka membangun website, tertarik dengan desain UI/UX, dan data analysis."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Target Karir Spesifik</label>
              <input 
                type="text" 
                className={styles.input}
                placeholder="Contoh: Frontend Engineer di Startup / Product Manager unicorn"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ color: '#ef4444', marginBottom: '16px', fontSize: '14px', fontWeight: 500 }}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>Menganalisa...</>
              ) : (
                <>Generate Roadmap</>
              )}
            </button>
          </form>
        </div>

        {/* Result Area */}
        <div className={styles.resultCard}>
          {loading ? (
             <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}></div>
                <h3>Sedang Meracik Roadmap...</h3>
                <p>AI sedang menganalisis profil dan target karirmu.</p>
             </div>
          ) : roadmap ? (
            <div className={styles.markdownContainer}>
              <ReactMarkdown>{roadmap}</ReactMarkdown>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}></div>
              <h3>Belum Ada Roadmap</h3>
              <p>Isi formulir di samping untuk menghasilkan panduan personalmu.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
