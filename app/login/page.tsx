"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Untuk pindah halaman
import { signIn } from 'next-auth/react';
import styles from './login.module.css';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams?.get('registered') === 'true') {
      setSuccessMsg('Registrasi berhasil! Silakan login.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        // Fetch session to get user role
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        // Save role to localStorage
        if (sessionData?.user?.role) {
          localStorage.setItem('karrirpath_user_role', sessionData.user.role);
          
          // Redirect based on role
          if (sessionData.user.role === 'mentor') {
            router.push('/dashboard/mentorship');
          } else if (sessionData.user.role === 'recruiter') {
            router.push('/dashboard/recruiter');
          } else {
            router.push('/dashboard');
          }
        } else {
          router.push('/dashboard');
        }
        
        router.refresh();
      }
    } catch (err) {
      setError('Terjadi kesalahan sistem');
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.badge}>Welcome</div>
        <h1 className={styles.title}>
          Sign In <br />
          <span className={styles.titleAccent}>to Karrir Path</span>
        </h1>

        {successMsg && <div style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' }}>{successMsg}</div>}
        {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" name="email" placeholder="nama@email.com" className={styles.input} required />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" name="password" placeholder="••••••••" className={styles.input} required />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className={styles.footer}>
          Belum punya akun?{' '}
          <Link href="/register" className={styles.footerLink}>
            Daftar di sini
          </Link>
        </p>

        {/* Divider */}
        <div className={styles.divider}>
          <div className={styles.dividerLine} />
          atau
          <div className={styles.dividerLine} />
        </div>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        >
          <svg className={styles.googleIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Masuk dengan Google
        </button>
      </div>
    </div>
  );
}