"use client";
import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { supabase } from "../../utils/supabase";
import StockChart from "../../components/Chart/StockChart";
import styles from "./page.module.css";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("holdings");

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Carica portfolios
        const { data: pData } = await supabase
          .from("portfolios")
          .select("*")
          .eq("user_id", user.id);
        setPortfolios(pData || []);

        if (pData && pData.length > 0) {
          const portfolioIds = pData.map((p) => p.id);

          // Carica holdings
          const { data: hData } = await supabase
            .from("holdings")
            .select("*")
            .in("portfolio_id", portfolioIds);
          setHoldings(hData || []);

          // Carica ultime transazioni
          const { data: tData } = await supabase
            .from("transactions")
            .select("*")
            .in("portfolio_id", portfolioIds)
            .order("executed_at", { ascending: false })
            .limit(20);
          setTransactions(tData || []);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  // Calcola totale investito
  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avg_buy_price, 0);

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Il tuo Portfolio 💼</h1>

        {!user && (
          <div className={styles.authNotice}>
            <p>Accedi per visualizzare e gestire il tuo portfolio.</p>
            <button className={styles.loginBtn}>Accedi con Email</button>
          </div>
        )}

        {user && loading && <p className={styles.loader}>Caricamento portfolio...</p>}

        {user && !loading && portfolios.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💼</div>
            <h2>Nessun portfolio creato</h2>
            <p>Crea il tuo primo portfolio e inizia a tracciare i tuoi investimenti.</p>
            <button className={styles.createBtn}>Crea Portfolio</button>
          </div>
        )}

        {user && !loading && portfolios.length > 0 && (
          <>
            {/* Riepilogo */}
            <div className={styles.summaryGrid}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Portfolio</div>
                <div className={styles.summaryValue}>{portfolios[0]?.name}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Totale Investito</div>
                <div className={styles.summaryValue}>${totalInvested.toFixed(2)}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Posizioni Aperte</div>
                <div className={styles.summaryValue}>{holdings.length}</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Valuta</div>
                <div className={styles.summaryValue}>{portfolios[0]?.currency}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === "holdings" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("holdings")}
              >
                Posizioni
              </button>
              <button
                className={`${styles.tab} ${activeTab === "transactions" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("transactions")}
              >
                Transazioni
              </button>
            </div>

            {activeTab === "holdings" && (
              <div className={styles.tableWrapper}>
                {holdings.length === 0 ? (
                  <p className={styles.empty}>Nessuna posizione nel portfolio.</p>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Simbolo</th>
                        <th>Quantità</th>
                        <th>Prezzo Medio</th>
                        <th>Valore Invest.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.map((h) => (
                        <tr key={h.id}>
                          <td className={styles.symbolCell}>{h.symbol}</td>
                          <td>{Number(h.quantity).toFixed(4)}</td>
                          <td>${Number(h.avg_buy_price).toFixed(2)}</td>
                          <td>${(h.quantity * h.avg_buy_price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className={styles.tableWrapper}>
                {transactions.length === 0 ? (
                  <p className={styles.empty}>Nessuna transazione registrata.</p>
                ) : (
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Simbolo</th>
                        <th>Tipo</th>
                        <th>Quantità</th>
                        <th>Prezzo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id}>
                          <td>{new Date(t.executed_at).toLocaleDateString("it-IT")}</td>
                          <td className={styles.symbolCell}>{t.symbol}</td>
                          <td>
                            <span className={`${styles.badge} ${styles[t.transaction_type]}`}>
                              {t.transaction_type.toUpperCase()}
                            </span>
                          </td>
                          <td>{Number(t.quantity).toFixed(4)}</td>
                          <td>${Number(t.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
