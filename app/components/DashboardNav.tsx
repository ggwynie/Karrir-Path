"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import styles from './DashboardNav.module.css';

const navItems = [
  { label: 'Jobs', href: '/dashboard/seekers' },
  { label: 'Mentorship', href: '/dashboard/mentorship' },
  { label: 'Company', href: '/dashboard/company' },
  { label: 'Roadmap', href: '/dashboard/roadmap' },
];

export default function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const firstName = session?.user?.name?.split(' ')[0] ?? 'User';
  const avatar = session?.user?.image;

  return (
    <nav className={styles.nav}>
      <Link href="/dashboard/seekers" className={styles.logo}>
        Karrir<span className={styles.logoAccent}>Path</span>
      </Link>

      <div className={styles.links}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.link} ${pathname?.startsWith(item.href) ? styles.linkActive : ''}`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className={styles.profileWrapper}>
        <button
          className={styles.profileBtn}
          onClick={() => setProfileOpen((v) => !v)}
        >
          {mounted && avatar ? (
            <img src={avatar} alt={firstName} className={styles.avatar} />
          ) : (
            <div className={styles.avatarFallback}>
              {mounted ? firstName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <span className={styles.profileName}>{mounted ? firstName : ''}</span>
          <span className={styles.chevron}>{profileOpen ? '▲' : '▼'}</span>
        </button>

        {profileOpen && (
          <div className={styles.dropdown}>
            <div className={styles.dropdownHeader}>
              <p className={styles.dropdownName}>{session?.user?.name}</p>
              <p className={styles.dropdownEmail}>{session?.user?.email}</p>
            </div>
            <Link
              href="/dashboard/profile"
              className={styles.dropdownItem}
              onClick={() => setProfileOpen(false)}
            >
              Edit Profil
            </Link>
            <Link
              href="/logout"
              className={styles.dropdownSignOut}
              onClick={() => setProfileOpen(false)}
            >
              Keluar
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
