"use client";
import styles from "./Header.module.css";
import useCurrentUser from '@/core/hooks/useCurrentUser'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user, loading, logout } = useCurrentUser()
  const router = useRouter()

  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.logo}>GPOI Finance</div>
        <nav className={styles.links}>
          <a href="/" className={styles.active}>Mercati</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/portfolio">Portfolio</a>
        </nav>
        <div className={styles.user}>
          {user ? (
            <button
              className={styles.loginBtn}
              onClick={async () => {
                try {
                  await logout()
                  router.push('/')
                } catch (err) {
                  console.error('Logout error', err)
                }
              }}
            >
              Logout
            </button>
          ) : (
            <button className={styles.loginBtn} onClick={() => router.push('/login')}>Accedi</button>
          )}
        </div>
      </div>
    </header>
  );
}
