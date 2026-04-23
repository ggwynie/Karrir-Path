"use client";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './seekers.module.css';

const jobTypes = [
  {
    id: 'freelance',
    tag: '01',
    title: 'Freelance',
    desc: 'Kerja bebas, pilih project sendiri.',
    stats: ['Per project', 'Remote friendly', 'Mulai kapan saja'],
    path: '/jobs/freelance',
  },
  {
    id: 'part-time',
    tag: '02',
    title: 'Part Time',
    desc: 'Beberapa jam sehari, jadwal fleksibel.',
    stats: ['10–20 jam/minggu', 'Jadwal fleksibel', 'Cocok sambil kuliah'],
    path: '/jobs/part-time',
  },
  {
    id: 'magang',
    tag: '03',
    title: 'Magang',
    desc: 'Belajar langsung dari profesional.',
    stats: ['1–6 bulan', 'Mentoring langsung', 'Sertifikat resmi'],
    path: '/jobs/magang',
  },
  {
    id: 'full-time',
    tag: '04',
    title: 'Full Time',
    desc: 'Karir penuh waktu, benefit lengkap.',
    stats: ['40 jam/minggu', 'Gaji + benefit', 'Jenjang karir jelas'],
    path: '/jobs/full-time',
  },
];

export default function SeekerDashboard() {
  const { data: session } = useSession();
  const router = useRouter();
  const firstName = session?.user?.name?.split(' ')[0] ?? 'Kamu';

  return (
    <div className={styles.wrapper}>

      <div className={styles.header}>
        <p className={styles.greeting}>Selamat datang, {firstName}</p>
        <h1 className={styles.title}>
          Halo, Pilih
        </h1>
        <h1 className={styles.title}>
          <span className={styles.titleAccent}>Pekerjaanmu</span>
        </h1>
      </div>

      {/* 4 Cards */}
      <div className={styles.grid}>
        {jobTypes.map((job) => (
          <div
            key={job.id}
            className={styles.card}
            onClick={() => router.push(job.path)}
          >
            <div className={styles.cardTag}>{job.tag}</div>
            <h3 className={styles.cardTitle}>{job.title}</h3>
            <p className={styles.cardDesc}>{job.desc}</p>
            <div className={styles.cardStats}>
              {job.stats.map((s, i) => (
                <div key={i} className={styles.statItem}>
                  <span className={styles.statDot} />
                  {s}
                </div>
              ))}
            </div>
            <div className={styles.cardArrow}>→</div>
          </div>
        ))}
      </div>

    </div>
  );
}
