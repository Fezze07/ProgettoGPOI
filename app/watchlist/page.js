"use client";
import { useState, useEffect } from "react";
import GPOPageShell from "../../components/GPOPageShell";
import { supabase } from "../../utils/supabase";

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

  const mockWatchlist = [
    { sym: 'TSLA', name: 'Tesla, Inc.', icon: 'TS', px: '$175.34', chg: '+0.42%', up: true, sector: 'Technology' },
    { sym: 'AMZN', name: 'Amazon.com', icon: 'AM', px: '$174.42', chg: '-1.20%', up: false, sector: 'Retail' },
    { sym: 'ETH', name: 'Ethereum', icon: 'ET', px: '$3,842.10', chg: '+4.81%', up: true, sector: 'Crypto' },
  ];

  const displayList = watchlist.length > 0
    ? watchlist.map(w => ({ sym: w.symbol, name: w.symbol, icon: w.symbol.substring(0, 2).toUpperCase(), px: '-', chg: '-', up: true, sector: '-' }))
    : mockWatchlist;

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
    const { error } = await supabase.from("watchlists").insert({ user_id: user.id, symbol });
    if (!error) {
      setWatchlist((prev) => [{ symbol, added_at: new Date().toISOString() }, ...prev]);
      setSearchTerm("");
      setSearchResults([]);
    }
  }

  async function removeFromWatchlist(symbol) {
    if (!user) return;
    const { error } = await supabase.from("watchlists").delete().eq("user_id", user.id).eq("symbol", symbol);
    if (!error) setWatchlist((prev) => prev.filter((w) => w.symbol !== symbol));
  }

  return (
    <GPOPageShell>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">La tua Watchlist</h2>
          </div>
          <p className="text-on-surface-variant text-lg font-light">Monitora i tuoi titoli preferiti in tempo reale</p>
        </div>
        <button className="bg-primary-container text-on-primary font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:shadow-[0_0_20px_rgba(13,242,89,0.3)] transition-all active:scale-95 group">
          <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
          + Aggiungi Titolo
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative">
        <div className="lg:col-span-7 relative z-20">
          <input
            className="glass-panel w-full pl-14 pr-6 py-4 rounded-full border border-outline-variant/10 focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container/50 outline-none text-on-surface placeholder:text-on-surface-variant/50"
            placeholder="Cerca simbolo o nome azienda..."
            type="text"
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary-container text-2xl">search</span>

          {searchResults.length > 0 && (
            <ul className="absolute top-14 left-0 w-full glass-panel rounded-xl mt-2 overflow-hidden shadow-2xl z-50">
              {searchResults.map((r) => (
                <li key={r.symbol} className="px-6 py-3 hover:bg-surface-bright/40 cursor-pointer flex justify-between items-center" onClick={() => addToWatchlist(r.symbol)}>
                  <div>
                    <strong className="text-primary-container">{r.symbol}</strong>
                    <span className="text-slate-400 ml-2 text-xs">{r.name}</span>
                  </div>
                  <span className="text-[10px] bg-surface-variant/50 px-2 py-1 rounded-full">{r.exchange}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="lg:col-span-5 flex items-center justify-end gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button className="px-6 py-2 rounded-full bg-primary-container/10 text-primary-container font-bold border border-primary-container/20">Tutti</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all font-medium">Azioni</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all font-medium">ETF</button>
          <button className="px-6 py-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30 transition-all font-medium">Crypto</button>
        </div>
      </div>

      {!user && (
        <div className="glass-panel p-6 rounded-2xl border border-primary-container/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden mb-8">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-container/5 rounded-full blur-3xl"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-on-surface">Accedi per salvare la tua watchlist</h4>
              <p className="text-on-surface-variant">Sincronizza i tuoi asset preferiti su tutti i tuoi dispositivi e ricevi avvisi di prezzo.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-8 py-3 bg-primary-container text-on-primary font-bold rounded-full hover:shadow-lg transition-all">Accedi</button>
          </div>
        </div>
      )}

      {loading && <p className="animate-pulse text-slate-500">Caricamento...</p>}

      {/* Watchlist Table Section */}
      {!loading && (
        <div className="surface-container-low rounded-2xl overflow-hidden border border-outline-variant/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Settore</th>
                  <th className="px-6 py-4">Prezzo</th>
                  <th className="px-6 py-4">Variazione</th>
                  <th className="px-6 py-4">Trend (7G)</th>
                  <th className="px-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y-0 text-sm">
                {displayList.map(item => (
                  <tr key={item.sym} className="group hover:bg-surface-bright/40 transition-all cursor-pointer">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center p-2 border border-outline-variant/10 font-bold text-xs">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-primary-container font-extrabold text-lg leading-tight">{item.sym}</div>
                        <div className="text-xs text-on-surface-variant">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-surface-variant/30 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{item.sector}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-on-surface">{item.px}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.up ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-container/10 text-tertiary-container'}`}>
                        <span className="material-symbols-outlined text-sm">{item.up ? 'arrow_drop_up' : 'arrow_drop_down'}</span> {item.chg}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-10 flex items-end gap-0.5">
                        <div className={`flex-1 ${item.up ? 'bg-primary-container/20' : 'bg-tertiary-container/80'} h-4 rounded-t-sm`}></div>
                        <div className={`flex-1 ${item.up ? 'bg-primary-container/30' : 'bg-tertiary-container/60'} h-6 rounded-t-sm`}></div>
                        <div className={`flex-1 ${item.up ? 'bg-primary-container/40' : 'bg-tertiary-container/40'} h-5 rounded-t-sm`}></div>
                        <div className={`flex-1 ${item.up ? 'bg-primary-container/60' : 'bg-tertiary-container/30'} h-8 rounded-t-sm`}></div>
                        <div className={`flex-1 ${item.up ? 'bg-primary-container/80' : 'bg-tertiary-container/20'} h-7 rounded-t-sm`}></div>
                        <div className={`flex-1 ${item.up ? 'bg-primary-container' : 'bg-tertiary-container/10'} h-10 rounded-t-sm`}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-tertiary-container" onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.sym); }}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {displayList.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-500">Nessun titolo in watchlist.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </GPOPageShell>
  );
}
