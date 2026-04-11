"use client";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.nav}>
        <div className={styles.logo}>GPO Finance</div>
        <nav className={styles.links}>
          <a href="/" className={styles.active}>Mercati</a>
          <a href="/watchlist">Watchlist</a>
          <a href="/portfolio">Portfolio</a>
        </nav>
        <div className={styles.user}>
           <button className={styles.loginBtn}>Accedi</button>
        </div>
      </div>
    </header>
  );
}
