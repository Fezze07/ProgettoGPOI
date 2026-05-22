"use client";
import { useState, useEffect } from "react";
import GPOIPageShell from "@/core/components/GPOIPageShell";
import fetchWithRefresh from '@/core/utils/fetchWithRefresh'
import useCurrentUser from '@/core/hooks/useCurrentUser'
import { useStockData } from '@/features/markets/hooks/useStockData'

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState([]);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: instruments, loading: instrumentsLoading } = useStockData();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("holdings");
  const { user: currentUser } = useCurrentUser()
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false)
  const [newPortfolioName, setNewPortfolioName] = useState('')
  const [newPortfolioAddress, setNewPortfolioAddress] = useState('')
  const [newPortfolioChain, setNewPortfolioChain] = useState('')

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [transactionForm, setTransactionForm] = useState({ wallet_id: '', symbol: '', type: 'trade', amount: '', price: '' })

  useEffect(() => {
    async function init() {
      setLoading(true);
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const portfolioRes = await fetchWithRefresh('/api/private/portfolio', {
        method: 'GET',
      });
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json();
        setPortfolios(portfolioData.portfolios || []);
        setHoldings(portfolioData.holdings || []);
        setTransactions(portfolioData.transactions || []);
      }

      setLoading(false);
    }
    init();
  }, [currentUser]);

  // Apri modal per creare un nuovo portfolio
  const openCreatePortfolioModal = () => {
    setNewPortfolioName('')
    setNewPortfolioAddress('')
    setNewPortfolioChain('')
    setIsPortfolioModalOpen(true)
  }

  const handleCreatePortfolioSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Devi effettuare il login per creare un portfolio.')
      return
    }

    const name = newPortfolioName?.trim()
    if (!name) return alert('Inserisci il nome del portfolio')

    try {
      const res = await fetchWithRefresh('/api/private/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address: newPortfolioAddress || undefined, chain: newPortfolioChain || undefined }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.message || 'Errore nella creazione del portfolio')
        return
      }

      setIsPortfolioModalOpen(false)
      // ricarica dati
      const portfolioRes = await fetchWithRefresh('/api/private/portfolio', { method: 'GET' })
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        setPortfolios(portfolioData.portfolios || [])
        setHoldings(portfolioData.holdings || [])
        setTransactions(portfolioData.transactions || [])
      }
    } catch (e) {
      console.error('create portfolio error', e)
      alert('Errore nella creazione del portfolio')
    }
  }

  const handleOpenTransactionModal = () => {
    setTransactionForm({ wallet_id: portfolios[0]?.id || '', symbol: instruments?.[0]?.symbol || '', type: 'trade', amount: '', price: '' })
    setIsTransactionModalOpen(true)
  }

  const handleTransactionFormChange = (field, value) => {
    setTransactionForm(prev => ({ ...prev, [field]: value }))
  }

  const handleAddTransactionSubmit = async (e) => {
    e.preventDefault()
    if (!user) return alert('Effettua il login per aggiungere transazioni')

    const { wallet_id, symbol, type, amount, price } = transactionForm
    if (!symbol || !amount) return alert('Inserisci simbolo e quantità')

    try {
      const res = await fetchWithRefresh('/api/private/portfolio/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_id: wallet_id || portfolios[0]?.id, symbol: symbol.trim().toUpperCase(), type: type || 'trade', amount: parseFloat(amount), price: price ? parseFloat(price) : null }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err?.message || "Errore nell'aggiunta della transazione")
        return
      }

      setIsTransactionModalOpen(false)
      setTransactionForm({ wallet_id: '', symbol: '', type: 'trade', amount: '', price: '' })

      const portfolioRes = await fetchWithRefresh('/api/private/portfolio', { method: 'GET' })
      if (portfolioRes.ok) {
        const portfolioData = await portfolioRes.json()
        setPortfolios(portfolioData.portfolios || [])
        setHoldings(portfolioData.holdings || [])
        setTransactions(portfolioData.transactions || [])
      }
    } catch (e) {
      console.error('add transaction error', e)
      alert("Errore nell'aggiunta della transazione")
    }
  }

  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avg_buy_price, 0);
  const totalValue = holdings.reduce((sum, h) => sum + h.quantity * (h.current_price || h.avg_buy_price), 0);
  const totalReturnVal = totalValue - totalInvested;
  const totalReturnPct = totalInvested > 0 ? (totalReturnVal / totalInvested) * 100 : 0;

  return (
    <GPOIPageShell>
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
          <button onClick={openCreatePortfolioModal} className="rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-[#00390e]">Crea Portfolio</button>
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
            <div className="flex items-center justify-between">
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

              <div className="flex items-center gap-2">
                <button onClick={handleOpenTransactionModal} className="rounded-full px-4 py-2 text-xs font-semibold border border-outline-variant/10 hover:shadow">Aggiungi Transazione</button>
                <button onClick={openCreatePortfolioModal} className="rounded-full px-4 py-2 text-xs font-semibold bg-primary-container text-[#00390e]">Nuovo Portfolio</button>
              </div>
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
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase ${t.transaction_type === 'trade' ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-container/10 text-tertiary-container'}`}>
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
      {/* Portfolio Modal */}
      {isPortfolioModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setIsPortfolioModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md p-4">
            <form onSubmit={handleCreatePortfolioSubmit} className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4">Crea nuovo Portfolio</h3>
              <label className="text-sm text-on-surface-variant">Nome</label>
              <input required value={newPortfolioName} onChange={(e) => setNewPortfolioName(e.target.value)} className="w-full mt-2 mb-3 rounded-lg border border-outline-variant/10 p-2 bg-transparent" />
              <label className="text-sm text-on-surface-variant">Indirizzo (opzionale)</label>
              <input value={newPortfolioAddress} onChange={(e) => setNewPortfolioAddress(e.target.value)} className="w-full mt-2 mb-3 rounded-lg border border-outline-variant/10 p-2 bg-transparent" />
              <label className="text-sm text-on-surface-variant">Chain (opzionale)</label>
              <input value={newPortfolioChain} onChange={(e) => setNewPortfolioChain(e.target.value)} className="w-full mt-2 mb-4 rounded-lg border border-outline-variant/10 p-2 bg-transparent" />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsPortfolioModalOpen(false)} className="px-4 py-2 rounded-md border border-outline-variant/10">Annulla</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary-container text-[#00390e] font-semibold">Crea</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setIsTransactionModalOpen(false)} />
          <div className="relative z-50 w-full max-w-md p-4">
            <form onSubmit={handleAddTransactionSubmit} className="bg-surface-container p-6 rounded-2xl border border-outline-variant/10 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4">Aggiungi Transazione</h3>

              <label className="text-sm text-on-surface-variant">Portfolio</label>
              <select value={transactionForm.wallet_id} onChange={e => handleTransactionFormChange('wallet_id', e.target.value)} className="w-full mt-2 mb-3 rounded-lg border border-outline-variant/10 p-2 bg-transparent">
                {portfolios.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <label className="text-sm text-on-surface-variant">Simbolo</label>
              <select
                required
                value={transactionForm.symbol}
                onChange={e => handleTransactionFormChange('symbol', e.target.value)}
                className="w-full mt-2 mb-3 rounded-lg border border-outline-variant/10 p-2 bg-transparent"
              >
                <option value="" disabled>{instrumentsLoading ? 'Caricamento asset...' : 'Seleziona un asset esistente'}</option>
                {(instruments || []).map((item) => (
                  <option key={item.symbol} value={item.symbol}>
                    {item.symbol} - {item.name || item.symbol}
                  </option>
                ))}
              </select>
              {!instrumentsLoading && instruments.length === 0 && (
                <p className="text-xs text-tertiary-container">Nessun asset disponibile. Assicurati che il database contenga crypto esistenti.</p>
              )}

              <label className="text-sm text-on-surface-variant">Tipo</label>
              <select value={transactionForm.type} onChange={e => handleTransactionFormChange('type', e.target.value)} className="w-full mt-2 mb-3 rounded-lg border border-outline-variant/10 p-2 bg-transparent">
                <option value="trade">Trade</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
              </select>

              <label className="text-sm text-on-surface-variant">Quantità</label>
              <input required type="number" step="any" value={transactionForm.amount} onChange={e => handleTransactionFormChange('amount', e.target.value)} className="w-full mt-2 mb-3 rounded-lg border border-outline-variant/10 p-2 bg-transparent" />

              <label className="text-sm text-on-surface-variant">Prezzo (opzionale)</label>
              <input type="number" step="any" value={transactionForm.price} onChange={e => handleTransactionFormChange('price', e.target.value)} className="w-full mt-2 mb-4 rounded-lg border border-outline-variant/10 p-2 bg-transparent" />

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsTransactionModalOpen(false)} className="px-4 py-2 rounded-md border border-outline-variant/10">Annulla</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-primary-container text-[#00390e] font-semibold">Aggiungi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </GPOIPageShell>
  );
}
