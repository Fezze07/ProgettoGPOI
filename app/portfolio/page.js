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
      setLoading(true)
      const authRes = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      })

      if (!authRes.ok) {
        setLoading(false)
        return
      }

      const authData = await authRes.json()
      setUser(authData.user)

      if (authData.user) {
        const portfolioRes = await fetch('/api/private/portfolio', {
          method: 'GET',
          credentials: 'include',
        })
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json()
          setPortfolios(portfolioData.portfolios || [])
          setHoldings(portfolioData.holdings || [])
          setTransactions(portfolioData.transactions || [])
        }
      }
      setLoading(false)
    }
    init()
  }, [])

  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avg_buy_price, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.quantity * (h.current_price || h.avg_buy_price), 0);
  const totalReturnVal = totalValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalReturnVal / totalInvested) * 100 : 0;

  return (
    <GPOPageShell>

      {/* Header Section */}
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Il tuo Portfolio 💼</h2>
        <p className="text-on-surface-variant font-medium">Gestisci i tuoi investimenti e traccia le performance in tempo reale.</p>
      </section>

      {!user ? (
        <div className="glass-panel p-6 rounded-2xl border border-primary-container/20 flex flex-col items-center justify-center text-center gap-4">
          <span className="material-symbols-outlined text-4xl text-primary-container">lock</span>
          <p className="font-bold">Accedi per visualizzare e gestire il tuo portfolio.</p>
          <button className="bg-primary-container text-on-primary font-bold px-8 py-3 rounded-full">Accedi con Email</button>
        </div>
      ) : loading ? (
        <div className="animate-pulse glass-panel p-10 rounded-xl border border-white/5 flex justify-center text-slate-500 font-bold">
          Caricamento portfolio...
        </div>
      ) : portfolios.length === 0 ? (
         <div className="glass-panel p-10 rounded-xl border border-white/5 flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-5xl text-slate-500">account_balance_wallet</span>
            <h2 className="text-2xl font-bold">Nessun portfolio creato</h2>
            <p className="text-slate-400">Crea il tuo primo portfolio e inizia a tracciare i tuoi investimenti.</p>
            <button className="bg-[#0df259] text-[#00390e] px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(13,242,89,0.2)]">Crea Portfolio</button>
          </div>
      ) : (
        <>
          {/* KPI Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-surface-container rounded-xl p-6 transition-all hover:bg-surface-container-high group">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Portfolio</p>
              <h3 className="text-2xl font-extrabold truncate">{portfolios[0]?.name}</h3>
            </div>
            <div className="bg-surface-container rounded-xl p-6 transition-all hover:bg-surface-container-high group border-l-4 border-primary-container/30">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Valore Attuale</p>
              <h3 className="text-2xl font-extrabold text-primary-container">${totalValue.toFixed(2)}</h3>
            </div>
            <div className="bg-surface-container rounded-xl p-6 transition-all hover:bg-surface-container-high group">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Rendimento Totale</p>
              <div className="flex items-baseline gap-2">
                <h3 className={`text-2xl font-extrabold ${totalReturnVal >= 0 ? 'text-primary-container' : 'text-tertiary-container'}`}>
                  {totalReturnVal >= 0 ? '+' : ''}${totalReturnVal.toFixed(2)}
                </h3>
                <span className={`text-xs font-bold flex items-center ${totalReturnVal >= 0 ? 'text-primary-container' : 'text-tertiary-container'}`}>
                  <span className="material-symbols-outlined text-xs">{totalReturnVal >= 0 ? 'arrow_upward' : 'arrow_downward'}</span> {Math.abs(totalReturnPct).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="bg-surface-container rounded-xl p-6 transition-all hover:bg-surface-container-high group">
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Posizioni Aperte</p>
              <h3 className="text-2xl font-extrabold">{holdings.length}</h3>

            </div>
          </section>

          {/* Tabs Section */}
          <section className="mb-8 overflow-x-auto">
            <div className="flex items-center gap-2 bg-surface-container-lowest p-1 rounded-full border border-outline-variant/10 w-fit">
              <button 
                onClick={() => setActiveTab('holdings')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'holdings' ? 'bg-primary-container text-[#00390e] shadow-lg shadow-primary-container/10' : 'text-on-surface-variant hover:text-on-surface'}`}>
                Posizioni
              </button>
              <button 
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${activeTab === 'transactions' ? 'bg-primary-container text-[#00390e] shadow-lg shadow-primary-container/10' : 'text-on-surface-variant hover:text-on-surface'}`}>
                Transazioni
              </button>
            </div>
          </section>

          {/* Table Area */}
          <section className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant/5">
            {activeTab === 'holdings' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    <th className="px-6 py-5 border-b border-outline-variant/10">Asset</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Quantità</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Prezzo Medio</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Valore Invest.</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10 text-right">Rendimento</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {holdings.map(h => {
                    const currentPrice = h.current_price || h.avg_buy_price;
                    const currentValue = h.quantity * currentPrice;
                    const retPct = ((currentPrice - h.avg_buy_price) / h.avg_buy_price) * 100;
                    return (
                    <tr key={h.id} className="hover:bg-surface-container transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface">
                            {h.symbol.substring(0,4)}
                          </div>
                          <div>
                            <p className="font-bold text-primary-container">{h.symbol}</p>
                            <p className="text-[10px] opacity-50">{h.exchange || "Crypto"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{Number(h.quantity).toFixed(4)}</td>
                      <td className="px-6 py-4 font-mono">${Number(h.avg_buy_price).toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold font-mono text-on-surface">${currentValue.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${retPct >= 0 ? 'text-primary-container bg-primary-container/10' : 'text-tertiary-container bg-tertiary-container/10'}`}>
                          {retPct >= 0 ? '+' : ''}{retPct.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  )})}
                  {holdings.length === 0 && (
                     <tr><td colSpan="5" className="text-center py-6 text-slate-500 text-xs">Nessuna posizione aperta.</td></tr>
                  )}

                </tbody>
              </table>
            )}

            {activeTab === 'transactions' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    <th className="px-6 py-5 border-b border-outline-variant/10">Data</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Simbolo</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Tipo</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Quantità</th>
                    <th className="px-6 py-5 border-b border-outline-variant/10">Prezzo</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {transactions.map(t => (
                    <tr key={t.id} className="hover:bg-surface-container transition-colors cursor-pointer group">
                      <td className="px-6 py-4 text-slate-400 text-xs">{new Date(t.executed_at).toLocaleDateString("it-IT")}</td>
                      <td className="px-6 py-4 font-bold text-primary-container">{t.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.transaction_type === 'buy' ? 'bg-primary-container/20 text-primary-container' : 'bg-tertiary-container/20 text-tertiary-container'}`}>
                          {t.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">{Number(t.quantity).toFixed(4)}</td>
                      <td className="px-6 py-4 font-mono">${Number(t.price).toFixed(2)}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-10 text-slate-500">Nessuna transazione registrata.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-[#00390e] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(13,242,89,0.2)] hover:scale-105 active:scale-95 transition-all z-[100]">
        <span className="material-symbols-outlined font-bold text-3xl">add</span>
      </button>
    </GPOPageShell>
  );
}
