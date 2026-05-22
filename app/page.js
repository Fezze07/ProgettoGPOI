"use client";
import GPOIPageShell from "@/core/components/GPOIPageShell";
import fetchWithRefresh from '@/core/utils/fetchWithRefresh'
import useCurrentUser from '@/core/hooks/useCurrentUser'
import { useStockData } from "@/features/markets/hooks/useStockData";
import { getLatestPrices, getPriceHistory } from "@/features/markets/services/stockService";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import StockChart from "@/features/markets/components/Chart/StockChart";

export default function Home() {
  const { data: instruments } = useStockData();
  const [portfolioStats, setPortfolioStats] = useState({ totalInvested: 0, totalValue: 0, totalReturnVal: 0, openPositions: 0 });
  const [watchlist, setWatchlist] = useState([]);
  const [prices, setPrices] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    if (!selectedSymbol && instruments?.length > 0) {
      setSelectedSymbol(instruments[0].symbol);
    }
  }, [selectedSymbol, instruments]);

  useEffect(() => {
    async function loadChart() {
      if (!selectedSymbol) return;
      setChartLoading(true);
      setChartError(null);
      try {
        const history = await getPriceHistory(selectedSymbol);
        setChartData(
          history
            .slice(-18)
            .map((row) => ({ ...row, price: Number(row.price) }))
        );
      } catch (error) {
        console.error("Errore nel caricamento della cronologia prezzi:", error);
        setChartData([]);
        setChartError(error?.message || "Errore caricamento grafico");
      } finally {
        setChartLoading(false);
      }
    }
    loadChart();
  }, [selectedSymbol]);

  const { user: currentUser } = useCurrentUser()

  useEffect(() => {
    async function init() {
      if (!currentUser) return;

      const portfolioRes = await fetchWithRefresh('/api/private/portfolio', { method: 'GET' });
      if (portfolioRes.ok) {
        const { holdings } = await portfolioRes.json();
        const hList = holdings || [];
        const tInv = hList.reduce((sum, h) => sum + h.quantity * h.avg_buy_price, 0);
        const tVal = hList.reduce((sum, h) => sum + h.quantity * (h.current_price || h.avg_buy_price), 0);
        setPortfolioStats({
          totalInvested: tInv,
          totalValue: tVal,
          totalReturnVal: tVal - tInv,
          openPositions: hList.length,
        });
      }

      const { supabase } = await import("@/core/supabase/supabase");
      const { data } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("added_at", { ascending: false })
        .limit(5);

      if (data && data.length > 0) {
        const symbols = data.map((w) => w.symbol);
        const latestPrices = await getLatestPrices(symbols);
        const priceMap = {};
        latestPrices.forEach((row) => {
          priceMap[row.symbol] = row;
        });

        setWatchlist(
          data.map((w) => {
            const row = priceMap[w.symbol] || {};
            return {
              sym: w.symbol,
              name: w.symbol,
              icon: w.symbol.substring(0, 2).toUpperCase(),
              px: row.price != null ? `$${Number(row.price).toFixed(2)}` : '-',
              chg: row.price_date ? new Date(row.price_date).toLocaleDateString('it-IT') : '-',
              up: row.price != null,
            };
          })
        );
        setPrices(prev => ({ ...prev, ...priceMap }));
      }
    }
    init();
  }, [currentUser]);

  useEffect(() => {
    async function loadFeaturedPrices() {
      if (!instruments || instruments.length === 0) return;
      const symbols = instruments.slice(0, 4).map((item) => item.symbol);
      if (symbols.length === 0) return;
      const latestPrices = await getLatestPrices(symbols);
      const priceMap = {};
      latestPrices.forEach((row) => {
        priceMap[row.symbol] = row;
      });
      setPrices((prev) => ({ ...prev, ...priceMap }));
    }
    loadFeaturedPrices();
  }, [instruments]);

  const featuredItems = useMemo(
    () =>
      (instruments || []).slice(0, 4).map((instrument) => {
        const latest = prices[instrument.symbol];
        return {
          symbol: instrument.symbol,
          name: instrument.name || instrument.symbol,
          exchange: instrument.exchange || 'Mercato',
          price: latest?.price != null ? `$${Number(latest.price).toFixed(2)}` : '-',
          updatedAt: latest?.price_date || null,
        };
      }),
    [instruments, prices]
  );

  const selectedSeries = chartData.length > 1 ? chartData : [];
  const minPrice = selectedSeries.length ? Math.min(...selectedSeries.map((item) => Number(item.price))) : 0;
  const maxPrice = selectedSeries.length ? Math.max(...selectedSeries.map((item) => Number(item.price))) : 0;
  const priceChange = selectedSeries.length > 1 ? Number(selectedSeries[selectedSeries.length - 1].price) - Number(selectedSeries[0].price) : 0;
  const priceChangePct = selectedSeries.length > 1 && selectedSeries[0].price ? (priceChange / Number(selectedSeries[0].price)) * 100 : 0;

  const chartPath = selectedSeries
    .map((point, index) => {
      const x = (index / Math.max(selectedSeries.length - 1, 1)) * 1000;
      const priceValue = Number(point.price);
      const y = maxPrice === minPrice ? 220 : 320 - ((priceValue - minPrice) / (maxPrice - minPrice)) * 220;
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    })
    .join(' ');

  return (
    <GPOIPageShell>
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-on-surface-variant mb-2">Dashboard</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface">Panoramica</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {featuredItems.map((item) => (
            <div key={item.symbol} className="rounded-3xl border border-outline-variant/15 bg-surface-container p-5 shadow-sm shadow-black/5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">{item.exchange}</p>
                  <h2 className="text-xl font-semibold text-on-surface mt-2">{item.symbol}</h2>
                </div>
                <span className="text-xs text-on-surface-variant">
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString('it-IT') : '—'}
                </span>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-3xl font-semibold text-on-surface">{item.price}</p>
                  <p className="text-xs text-on-surface-variant mt-2">Ultimo prezzo</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <section className="rounded-3xl border border-outline-variant/15 bg-surface-container p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">Prezzo storico</p>
                <h2 className="text-2xl font-semibold text-on-surface">{selectedSymbol || 'Titolo selezionato'}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {(instruments || []).slice(0, 4).map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => setSelectedSymbol(item.symbol)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedSymbol === item.symbol ? 'bg-primary-container text-[#00390e]' : 'bg-surface-container-low hover:bg-surface-container-high'}`}
                  >
                    {item.symbol}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-[320px] rounded-3xl bg-surface-container-lowest p-4">
              {chartLoading ? (
                <div className="flex h-full items-center justify-center text-slate-500">Caricamento grafico...</div>
              ) : chartError ? (
                <div className="flex h-full items-center justify-center text-red-400">{chartError}</div>
              ) : (
                <StockChart data={chartData} symbol={selectedSymbol || 'Titolo selezionato'} />
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-outline-variant/15 bg-surface-container p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-on-surface">Watchlist</h2>
                <p className="text-sm text-on-surface-variant">I tuoi titoli monitorati</p>
              </div>
              <Link href="/watchlist" className="text-sm font-semibold text-primary-container">Visualizza</Link>
            </div>

            <div className="space-y-3">
              {watchlist.length > 0 ? (
                watchlist.map((item) => (
                  <div key={item.sym} className="rounded-3xl border border-outline-variant/10 bg-surface-container-low p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.sym}</p>
                      <p className="text-xs text-on-surface-variant">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${item.up ? 'text-primary-container' : 'text-tertiary-container'}`}>{item.px}</p>
                      <p className="text-[11px] text-on-surface-variant mt-1">{item.chg}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-outline-variant/10 bg-surface-container-low p-7 text-center text-slate-500">
                  Nessun titolo in watchlist.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-outline-variant/15 bg-surface-container p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant mb-4">Totale Investito</p>
            <p className="text-3xl font-semibold text-on-surface">${portfolioStats.totalInvested.toFixed(2)}</p>
          </div>
          <div className="rounded-3xl border border-outline-variant/15 bg-surface-container p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant mb-4">Rendimento Totale</p>
            <p className={`text-3xl font-semibold ${portfolioStats.totalReturnVal >= 0 ? 'text-primary-container' : 'text-tertiary-container'}`}>
              {portfolioStats.totalReturnVal >= 0 ? '+' : ''}${portfolioStats.totalReturnVal.toFixed(2)}
            </p>
          </div>
          <div className="rounded-3xl border border-outline-variant/15 bg-surface-container p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant mb-4">Posizioni Aperte</p>
            <p className="text-3xl font-semibold text-on-surface">{portfolioStats.openPositions}</p>
          </div>
        </div>
      </div>
    </GPOIPageShell>
  );
}
