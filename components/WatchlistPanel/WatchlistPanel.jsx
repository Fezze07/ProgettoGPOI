"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import styles from "./WatchlistPanel.module.css";

/**
 * Pannello watchlist compatto — usato come widget nella dashboard home.
 * Mostra i simboli monitorati dall'utente e permette di aggiungerli/rimuoverli.
 */
export default function WatchlistPanel() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("watchlists")
          .select("symbol, added_at")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false })
          .limit(10);
        setItems(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (!user) return null; // Non mostrare se non autenticato

  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>⭐ Watchlist</h2>
      {loading && <p className={styles.loader}>Caricamento...</p>}
      {!loading && items.length === 0 && (
        <p className={styles.empty}>Nessun titolo nella watchlist.</p>
      )}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.symbol} className={styles.item}>
            <span className={styles.symbol}>{item.symbol}</span>
          </li>
        ))}
      </ul>
      <a href="/watchlist" className={styles.link}>Gestisci watchlist →</a>
    </aside>
  );
}
