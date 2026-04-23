"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './role.module.css';

const roles = [
  {
    id: 'job-seeker',
    number: '01',
    icon: '🎯',
    title: 'Mencari Pekerjaan',
    desc: 'Temukan lowongan sesuai passion dan skill kamu',
    path: '/dashboard/seekers',
  },
  {
    id: 'mentor',
    number: '02',
    icon: '🧑‍🏫',
    title: 'Mentor Profesional',
    desc: 'Bimbing talenta muda dan bagikan pengalaman',
    path: '/dashboard/mentor',
  },
  {
    id: 'recruiter',
    number: '03',
    icon: '💼',
    title: 'Tim Recruiter',
    desc: 'Cari kandidat terbaik untuk perusahaan kamu',
    path: '/dashboard/recruiter',
  },
];

export default function SelectRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectRole = async (roleId: string, path: string) => {
    setLoading(roleId);
    try {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleId }),
      });
      router.push(path);
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.badge}>Pilih Role</div>
        <h1 className={styles.title}>
          Kamu Masuk <br />
          Sebagai <span className={styles.titleAccent}>Apa?</span>
        </h1>
        <p className={styles.subtitle}>
          Pilih role yang sesuai dengan tujuan kamu di KarrirPath
        </p>

        <div className={styles.grid}>
          {roles.map((role) => (
            <div
              key={role.id}
              className={`${styles.card} ${loading === role.id ? styles.cardLoading : ''}`}
              onClick={() => !loading && handleSelectRole(role.id, role.path)}
            >
              <div className={styles.cardIcon}>{role.icon}</div>
              <div className={styles.cardNumber}>{role.number}</div>
              <h3 className={styles.cardTitle}>{role.title}</h3>
              <p className={styles.cardDesc}>{role.desc}</p>
              <div className={styles.cardArrow}>
                {loading === role.id ? '...' : '→'}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
