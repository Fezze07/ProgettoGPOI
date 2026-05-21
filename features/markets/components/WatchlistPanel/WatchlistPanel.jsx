"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/core/supabase/supabase";
import { getLatestPrices } from "@/features/markets/services/stockService";
import useCurrentUser from '@/core/hooks/useCurrentUser'

import styles from "./WatchlistPanel.module.css";

export default function WatchlistPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, loading: userLoading } = useCurrentUser()

  useEffect(() => {
    async function load() {
      setLoading(true)
      const user = currentUser
      if (user) {
        const { data } = await supabase
          .from("watchlists")
          .select("symbol, added_at")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false })
          .limit(10);

        if (data && data.length > 0) {
          const symbols = data.map((item) => item.symbol);
          const latestRows = await getLatestPrices(symbols);
          const latestMap = {};
          latestRows.forEach((row) => {
            if (!latestMap[row.symbol]) {
              latestMap[row.symbol] = row;
            }
          });

          setItems(
            data.map((item) => ({
              symbol: item.symbol,
              price: latestMap[item.symbol]?.price ?? null,
              added_at: item.added_at,
            }))
          );
        } else {
          setItems([]);
        }
      } else {
        setItems([])
      }
      setLoading(false)
    }
    load()
  }, [currentUser]);

  if (!currentUser && !userLoading) return null;

  return (
    <aside className={styles.panel}>
      <h2 className={styles.title}>Watchlist</h2>
      {loading && <p className={styles.loader}>Caricamento...</p>}
      {!loading && items.length === 0 && <p className={styles.empty}>Nessun titolo nella watchlist.</p>}
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.symbol} className={styles.item}>
            <div>
              <span className={styles.symbol}>{item.symbol}</span>
              {item.price != null && <span className={styles.price}>${Number(item.price).toFixed(2)}</span>}
            </div>
          </li>
        ))}
      </ul>
      <a href="/watchlist" className={styles.link}>Gestisci watchlist</a>
    </aside>
  );
}
