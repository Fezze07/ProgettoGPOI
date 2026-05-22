"use client";
import GPOIPageShell from "@/core/components/GPOIPageShell";
import { useStockData } from "@/features/markets/hooks/useStockData";
import { getLatestPrices } from "@/features/markets/services/stockService";
import { useEffect, useMemo, useState } from "react";

export default function MarketsPage() {
  const { data: instruments, loading, error } = useStockData();
  const [priceMap, setPriceMap] = useState({});

  useEffect(() => {
    async function loadPrices() {
      if (!instruments || instruments.length === 0) return;
      const symbols = instruments.slice(0, 20).map((item) => item.symbol);
      const latest = await getLatestPrices(symbols);
      const map = {};
      latest.forEach((row) => {
        map[row.symbol] = row;
      });
      setPriceMap(map);
    }
    loadPrices();
  }, [instruments]);

  const displayRows = useMemo(() => {
    return (instruments || []).slice(0, 20).map((item) => ({
      symbol: item.symbol,
      name: item.name || item.symbol,
      exchange: item.exchange || 'Mercato',
      sector: item.sector || 'N/A',
      price: priceMap[item.symbol]?.price != null ? `$${Number(priceMap[item.symbol].price).toFixed(2)}` : '-',
      updatedAt: priceMap[item.symbol]?.price_date || null,
    }));
  }, [instruments, priceMap]);

  return (
    <GPOIPageShell>
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Mercati Globali</h2>
        <p className="text-on-surface-variant font-medium">Dati reali dai mercati.</p>
      </section>      

      <div className="rounded-3xl border border-outline-variant/15 bg-surface-container p-6">
        {loading ? (
          <div className="text-slate-500">Caricamento dati mercati...</div>
        ) : error ? (
          <div className="text-slate-400">Errore caricamento dati mercati.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-on-surface">
              <thead>
                <tr className="border-b border-outline-variant/10 text-on-surface-variant text-xs uppercase tracking-[0.24em]">
                  <th className="px-6 py-4">Simbolo</th>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Exchange</th>
                  <th className="px-6 py-4">Settore</th>
                  <th className="px-6 py-4">Ultimo Prezzo</th>
                  <th className="px-6 py-4">Aggiornato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {displayRows.map((row) => (
                  <tr key={row.symbol} className="hover:bg-surface-container-high transition-colors">
                    <td className="px-6 py-4 font-semibold text-on-surface">{row.symbol}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.name}</td>
                    <td className="px-6 py-4">{row.exchange}</td>
                    <td className="px-6 py-4">{row.sector}</td>
                    <td className="px-6 py-4 font-mono">{row.price}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{row.updatedAt ? new Date(row.updatedAt).toLocaleDateString('it-IT') : '-'}</td>
                  </tr>
                ))}
                {displayRows.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-slate-500">Nessun titolo disponibile.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </GPOIPageShell>
  );
}
