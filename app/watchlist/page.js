"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { supabase } from "../../utils/supabase";
import styles from "./page.module.css";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("watchlists")
          .select("*")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false });

        if (!error) setWatchlist(data || []);
      }
      setLoading(false);
    }
    init();
  }, []);

  async function handleSearch(e) {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length < 1) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from("instruments")
      .select("symbol, name, exchange, sector")
      .or(`symbol.ilike.%${term}%,name.ilike.%${term}%`)
      .limit(8);

    setSearchResults(data || []);
  }

  async function addToWatchlist(symbol) {
    if (!user) return alert("Devi effettuare l'accesso per usare la watchlist.");

    const { error } = await supabase
      .from("watchlists")
      .insert({ user_id: user.id, symbol });

    if (!error) {
      setWatchlist((prev) => [{ symbol, added_at: new Date().toISOString() }, ...prev]);
      setSearchTerm("");
      setSearchResults([]);
    } else {
      alert("Errore nell'aggiunta: " + error.message);
    }
  }

  async function removeFromWatchlist(symbol) {
    if (!user) return;
    const { error } = await supabase
      .from("watchlists")
      .delete()
      .eq("user_id", user.id)
      .eq("symbol", symbol);

    if (!error) {
      setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));
    }
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>La tua Watchlist ⭐</h1>

        {!user && (
          <div className={styles.authNotice}>
            <p>Accedi per salvare e gestire la tua watchlist personale.</p>
            <button className={styles.loginBtn}>Accedi con Email</button>
          </div>
        )}

        {user && (
          <div className={styles.searchBox}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Cerca per simbolo (es. AAPL) o nome..."
              className={styles.searchInput}
            />
            {searchResults.length > 0 && (
              <ul className={styles.dropdown}>
                {searchResults.map((r) => (
                  <li key={r.symbol} className={styles.dropdownItem} onClick={() => addToWatchlist(r.symbol)}>
                    <strong>{r.symbol}</strong>
                    <span>{r.name}</span>
                    <span className={styles.exchange}>{r.exchange}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {loading && <p className={styles.loader}>Caricamento...</p>}

        {!loading && watchlist.length === 0 && user && (
          <p className={styles.empty}>La tua watchlist è vuota. Cerca un titolo per aggiungerlo.</p>
        )}

        <ul className={styles.list}>
          {watchlist.map((item) => (
            <li key={item.symbol} className={styles.listItem}>
              <div>
                <span className={styles.symbol}>{item.symbol}</span>
                <span className={styles.date}>aggiunto il {new Date(item.added_at).toLocaleDateString("it-IT")}</span>
              </div>
              <button className={styles.removeBtn} onClick={() => removeFromWatchlist(item.symbol)}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
