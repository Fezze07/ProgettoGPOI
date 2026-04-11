"use client";
import Header from "../components/Header/Header";
import StockCard from "../components/StockCard/StockCard";
import { useStockData } from "../hooks/useStockData";
import styles from "../styles/page.module.css";

export default function Home() {
  const { data: instruments, loading, error } = useStockData();

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1>Dashboard Mercati 📈</h1>
          <p>Monitora i tuoi investimenti in tempo reale con Supabase + Vercel.</p>
        </section>

        {loading && <div className={styles.loader}>Caricamento mercati...</div>}
        {error && <div className={styles.error}>Errore: {error}</div>}

        {!loading && !error && (
          <div className={styles.grid}>
            {instruments.map((stock) => (
              <StockCard key={stock.symbol} stock={stock} />
            ))}
            {instruments.length === 0 && <p className={styles.loader}>Nessun titolo trovato nel database.</p>}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Progetto GPO - Deployato su Vercel</p>
      </footer>
    </div>
  );
}