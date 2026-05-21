"use client";
import { useState, useEffect } from "react";
import GPOPageShell from "@/core/components/GPOPageShell";

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("holdings");

  useEffect(() => {
    async function init() {
      setLoading(true);
      const authRes = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (!authRes.ok) {
        setLoading(false);
        return;
      }

      const authData = await authRes.json();
      setUser(authData.user);

      if (authData.user) {
        const portfolioRes = await fetch('/api/private/portfolio', {
          method: 'GET',
          credentials: 'include',
        });
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json();
          setPortfolios(portfolioData.portfolios || []);
          setHoldings(portfolioData.holdings || []);
          setTransactions(portfolioData.transactions || []);
        }
      }
      setLoading(false);
    }
    init();
  }, []);

  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avg_buy_price, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.quantity * (h.current_price || h.avg_buy_price), 0);
  const totalReturnVal = totalValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalReturnVal / totalInvested) * 100 : 0;

  return (
    <GPOPageShell>
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Portfolio Personale</h2>
        <p className="text-on-surface-variant font-medium">Visualizza i tuoi portafogli e le performance correnti.</p>
      </section>

      {!user ? (
        <div className="rounded-3xl border border-outline-variant/15 bg-surface-container p-8 text-center">
          <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-lowest text-primary-container">
            <span className="material-symbols-outlined text-3xl">lock</span>
          </div>
          <p className="mb-3 text-lg font-semibold text-on-surface">Accedi per visualizzare e gestire il tuo portfolio.</p>
          <button className="inline-flex rounded-full bg-primary-container px-8 py-3 text-sm font-semibold text-[#00390e] transition hover:shadow-lg">Accedi con Email</button>
        </div>
      ) : loading ? (
        <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-10 text-center text-slate-500">
          Caricamento portfolio...
        </div>
      ) : portfolios.length === 0 ? (
        <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-10 text-center">
          <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-container-lowest text-slate-400">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Nessun portfolio creato</h2>
          <p className="text-slate-400 mb-6">Crea il primo wallet per iniziare a tracciare il tuo capitale.</p>
          <button className="rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-[#00390e]">Crea Portfolio</button>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-3">Portfolio</p>
              <h3 className="text-2xl font-semibold truncate">{portfolios[0]?.name}</h3>
            </div>
            <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-3">Valore Attuale</p>
              <h3 className="text-2xl font-semibold text-primary-container">${totalValue.toFixed(2)}</h3>
            </div>
            <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-3">Rendimento Totale</p>
              <div className="flex items-center gap-2">
                <h3 className={`text-2xl font-semibold ${totalReturnVal >= 0 ? 'text-primary-container' : 'text-tertiary-container'}`}>
                  {totalReturnVal >= 0 ? '+' : ''}${totalReturnVal.toFixed(2)}
                </h3>
                <span className="text-xs text-on-surface-variant">{Math.abs(totalReturnPct).toFixed(2)}%</span>
              </div>
            </div>
            <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-3">Posizioni Aperte</p>
              <h3 className="text-2xl font-semibold">{holdings.length}</h3>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex flex-wrap items-center gap-3 bg-surface-container-lowest rounded-full p-1 border border-outline-variant/10 w-fit">
              <button
                onClick={() => setActiveTab('holdings')}
                className={`rounded-full px-6 py-2 text-xs font-semibold transition ${activeTab === 'holdings' ? 'bg-primary-container text-[#00390e]' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Posizioni
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`rounded-full px-6 py-2 text-xs font-semibold transition ${activeTab === 'transactions' ? 'bg-primary-container text-[#00390e]' : 'text-on-surface-variant hover:text-on-surface'}`}
              >
                Transazioni
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container">
            {activeTab === 'holdings' ? (
              <table className="min-w-full text-left text-sm text-on-surface">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant text-[10px] uppercase tracking-[0.2em]">
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">Quantità</th>
                    <th className="px-6 py-4">Prezzo Medio</th>
                    <th className="px-6 py-4">Valore Invest.</th>
                    <th className="px-6 py-4 text-right">Rendimento</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h) => {
                    const currentPrice = h.current_price || h.avg_buy_price;
                    const currentValue = h.quantity * currentPrice;
                    const retPct = ((currentPrice - h.avg_buy_price) / h.avg_buy_price) * 100;
                    return (
                      <tr key={h.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-lowest text-xs font-semibold text-on-surface">
                              {h.symbol.substring(0, 4)}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface">{h.symbol}</div>
                              <div className="text-[10px] text-on-surface-variant">{h.exchange || 'Crypto'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{Number(h.quantity).toFixed(4)}</td>
                        <td className="px-6 py-4 font-mono">${Number(h.avg_buy_price).toFixed(2)}</td>
                        <td className="px-6 py-4 font-semibold font-mono">${currentValue.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${retPct >= 0 ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-container/10 text-tertiary-container'}`}>
                            {retPct >= 0 ? '+' : ''}{retPct.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {holdings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Nessuna posizione aperta.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="min-w-full text-left text-sm text-on-surface">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant text-[10px] uppercase tracking-[0.2em]">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Simbolo</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Quantità</th>
                    <th className="px-6 py-4">Prezzo</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                      <td className="px-6 py-4 text-on-surface-variant text-xs">{new Date(t.executed_at).toLocaleDateString('it-IT')}</td>
                      <td className="px-6 py-4 font-semibold text-on-surface">{t.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${t.transaction_type === 'buy' ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-container/10 text-tertiary-container'}`}>
                          {t.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{Number(t.quantity).toFixed(4)}</td>
                      <td className="px-6 py-4 font-mono">${Number(t.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-slate-500">Nessuna transazione registrata.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </GPOPageShell>
  );
}
