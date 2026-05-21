"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import GPOIPageShell from "@/core/components/GPOIPageShell";
import { supabase } from "@/core/supabase/supabase";
import useCurrentUser from '@/core/hooks/useCurrentUser'
import { getLatestPrices } from "@/features/markets/services/stockService";

export const dynamic = "force-dynamic";

function WatchlistPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Tutti");
  const searchInputRef = useRef(null);

  const { user: currentUser, loading: userLoading } = useCurrentUser()

  useEffect(() => {
    async function init() {
      setLoading(true)
      const user = currentUser
      setUser(user)

      if (user) {
        const { data, error } = await supabase
          .from("watchlists")
          .select("*")
          .eq("user_id", user.id)
          .order("added_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const symbols = data.map((w) => w.symbol);
          const priceRows = await getLatestPrices(symbols);
          const priceMap = {};
          const historyMap = {};

          priceRows.forEach((row) => {
            if (!priceMap[row.symbol]) {
              priceMap[row.symbol] = row;
            }
            if (!historyMap[row.symbol]) {
              historyMap[row.symbol] = [];
            }
            historyMap[row.symbol].push(row);
          });

          const enriched = data.map((w) => {
            const latest = priceMap[w.symbol] || {};
            const history = historyMap[w.symbol] || [];
            const previous = history[1];
            const percentChange = previous && latest.price != null
              ? ((Number(latest.price) - Number(previous.price)) / Number(previous.price)) * 100
              : null;

            return {
              ...w,
              current_price: latest.price || null,
              percent_change: percentChange,
              updated_at: latest.price_date || null,
            };
          });

          setWatchlist(enriched);
        } else {
          setWatchlist([]);
        }
      } else {
        setWatchlist([])
      }

      setLoading(false);
    }

    init();

    if (initialQuery) {
      handleSearch({ target: { value: initialQuery } });
    }
  }, [initialQuery, currentUser]);

  const displayList = watchlist.map((w) => {
    const px = w.current_price ? `$${Number(w.current_price).toFixed(2)}` : '-';
    const chgNum = w.percent_change || 0;
    const chgStr = w.percent_change !== null ? `${chgNum >= 0 ? '+' : ''}${Number(chgNum).toFixed(2)}%` : '-';
    return {
      sym: w.symbol,
      name: w.symbol,
      icon: w.symbol.substring(0, 2).toUpperCase(),
      px,
      chg: chgStr,
      up: chgNum >= 0,
      sector: 'Crypto',
    };
  });

  async function handleSearch(e) {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length < 1) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('crypto_assets')
      .select('symbol, name, metadata')
      .or(`symbol.ilike.%${term}%,name.ilike.%${term}%`)
      .limit(8);

    setSearchResults((data || []).map((r) => ({
      symbol: r.symbol,
      name: r.name || r.symbol,
      exchange: (r.metadata && r.metadata.exchange) || 'Crypto',
      sector: (r.metadata && r.metadata.sector) || 'Crypto',
    })));
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
    <GPOIPageShell>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-on-surface">La tua Watchlist</h2>
          <p className="text-on-surface-variant text-lg font-light">Monitora i tuoi titoli preferiti con dati reali.</p>
        </div>
        <button
          className="rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-[#00390e] transition hover:shadow-lg"
          onClick={() => searchInputRef.current?.focus()}
        >
          Aggiungi Titolo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative mb-8">
        <div className="lg:col-span-7 relative z-20">
          <input
            ref={searchInputRef}
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
                <li
                  key={r.symbol}
                  className="px-6 py-3 hover:bg-surface-bright/40 cursor-pointer flex justify-between items-center"
                  onClick={() => addToWatchlist(r.symbol)}
                >
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
          {["Tutti", "Azioni", "ETF", "Crypto"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition ${activeFilter === filter ? 'bg-primary-container/10 text-primary-container border border-primary-container/20' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/30'}`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {!user && (
        <div className="rounded-3xl border border-outline-variant/10 bg-surface-container p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-xl font-semibold text-on-surface">Accedi per salvare la tua watchlist</h4>
              <p className="text-on-surface-variant">Sincronizza i tuoi asset preferiti su tutti i tuoi dispositivi.</p>
            </div>
            <Link href="/login" className="rounded-full bg-primary-container px-6 py-3 text-sm font-semibold text-[#00390e]">Accedi</Link>
          </div>
        </div>
      )}

      {loading && <p className="animate-pulse text-slate-500">Caricamento...</p>}

      {!loading && (
        <div className="rounded-3xl border border-outline-variant/10 bg-surface-container overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-on-surface">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-high/50 text-on-surface-variant text-[10px] uppercase tracking-[0.25em] font-semibold">
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Settore</th>
                  <th className="px-6 py-4">Prezzo</th>
                  <th className="px-6 py-4">Variazione</th>
                  <th className="px-6 py-4">Trend</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody>
                {displayList.map((item) => (
                  <tr key={item.sym} className="border-b border-outline-variant/10 hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-container-lowest text-xs font-semibold text-on-surface">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-on-surface">{item.sym}</div>
                        <div className="text-xs text-on-surface-variant">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-surface-variant/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{item.sector}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold">{item.px}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold ${item.up ? 'bg-primary-container/10 text-primary-container' : 'bg-tertiary-container/10 text-tertiary-container'}`}>
                        <span className="material-symbols-outlined text-sm">{item.up ? 'arrow_drop_up' : 'arrow_drop_down'}</span>
                        {item.chg}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-end gap-1 h-10">
                        <span className={`block h-2 w-6 rounded-full ${item.up ? 'bg-primary-container' : 'bg-tertiary-container'}`} />
                        <span className={`block h-3 w-6 rounded-full ${item.up ? 'bg-primary-container/80' : 'bg-tertiary-container/80'}`} />
                        <span className={`block h-4 w-6 rounded-full ${item.up ? 'bg-primary-container/60' : 'bg-tertiary-container/60'}`} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-tertiary-container" onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.sym); }}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {displayList.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Nessun titolo in watchlist.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </GPOIPageShell>
  );
}

export default function WatchlistPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant">Caricamento watchlist...</div>}>
      <WatchlistPageContent />
    </Suspense>
  );
}
