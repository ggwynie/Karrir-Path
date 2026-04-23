"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import styles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Terjadi kesalahan');
      }

      // Berhasil register, redirect ke login
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.badge}>Join Us</div>
        <h1 className={styles.title}>
          Create Your <br />
          <span className={styles.titleAccent}>Account</span>
        </h1>
        <p className={styles.subtitle}>
          Mulai perjalanan karir kamu bersama KarrirPath
        </p>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit} method="post" action="#">

          {/* Row 1: Nama */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nama Depan</label>
              <input type="text" name="firstName" placeholder="John" className={styles.input} required />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Nama Belakang</label>
              <input type="text" name="lastName" placeholder="Doe" className={styles.input} required />
            </div>
          </div>

          {/* Row 2: Email + Password */}
          <div className={styles.row}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Email</label>
              <input type="email" name="email" placeholder="nama@email.com" className={styles.input} required />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Password</label>
              <input type="password" name="password" placeholder="••••••••" className={styles.input} required minLength={8} />
            </div>
          </div>

          {/* Row 3: Role full width */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Daftar Sebagai</label>
            <select name="role" className={styles.select} required defaultValue="">
              <option value="" disabled>-- Pilih Peran --</option>
              <option value="job-seeker">Mencari Pekerjaan</option>
              <option value="mentor">Mentor Profesional</option>
              <option value="recruiter">Tim Recruitment</option>
            </select>
          </div>

          {/* Tombol Daftar */}
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>

        </form>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          atau daftar dengan
          <div className={styles.dividerLine} />
        </div>

        <p className={styles.footer}>
          Sudah punya akun?{' '}
          <Link href="/login" className={styles.footerLink}>
            Masuk di sini
          </Link>
        </p>

      </div>
    </div>
  );
}
