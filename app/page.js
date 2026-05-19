"use client";
import GPOPageShell from "@/core/components/GPOPageShell";
import { useStockData } from "@/features/markets/hooks/useStockData";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: instruments, loading, error } = useStockData();
  const [timeframe, setTimeframe] = useState("1M");

  return (
    <GPOPageShell>
      {/* Ticker Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* AAPL */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-primary-container">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Apple Inc.</p>
              <h3 className="text-lg font-extrabold">AAPL</h3>
            </div>
            <span className="px-2 py-1 bg-primary-container/10 text-primary-container rounded-full text-[10px] font-bold">+1.2%</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tracking-tighter">$182.63</span>
            <div className="h-8 w-20 flex items-end">
              <div className="flex items-end space-x-0.5 h-full w-full">
                <div className="w-1 bg-primary-container/20 h-1/2"></div>
                <div className="w-1 bg-primary-container/20 h-2/3"></div>
                <div className="w-1 bg-primary-container/40 h-1/3"></div>
                <div className="w-1 bg-primary-container/60 h-3/4"></div>
                <div className="w-1 bg-primary-container h-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* MSFT */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-tertiary-container/40">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Microsoft</p>
              <h3 className="text-lg font-extrabold">MSFT</h3>
            </div>
            <span className="px-2 py-1 bg-tertiary-container/10 text-tertiary-container rounded-full text-[10px] font-bold">-0.4%</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tracking-tighter">$406.32</span>
            <div className="h-8 w-20 flex items-end">
              <div className="flex items-end space-x-0.5 h-full w-full">
                <div className="w-1 bg-tertiary-container/60 h-full"></div>
                <div className="w-1 bg-tertiary-container/40 h-3/4"></div>
                <div className="w-1 bg-tertiary-container/20 h-1/2"></div>
                <div className="w-1 bg-tertiary-container/30 h-1/3"></div>
                <div className="w-1 bg-tertiary-container/20 h-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        {/* BTC */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-primary-container">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">Bitcoin</p>
              <h3 className="text-lg font-extrabold">BTC</h3>
            </div>
            <span className="px-2 py-1 bg-primary-container/10 text-primary-container rounded-full text-[10px] font-bold">+3.1%</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tracking-tighter">$67,294.0</span>
            <div className="h-8 w-20 flex items-end">
              <div className="flex items-end space-x-0.5 h-full w-full">
                <div className="w-1 bg-primary-container/20 h-1/4"></div>
                <div className="w-1 bg-primary-container/30 h-1/2"></div>
                <div className="w-1 bg-primary-container/50 h-3/4"></div>
                <div className="w-1 bg-primary-container/70 h-1/3"></div>
                <div className="w-1 bg-primary-container h-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* NVDA */}
        <div className="glass-panel p-5 rounded-xl border-l-4 border-primary-container">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-tight">NVIDIA Corp.</p>
              <h3 className="text-lg font-extrabold">NVDA</h3>
            </div>
            <span className="px-2 py-1 bg-primary-container/10 text-primary-container rounded-full text-[10px] font-bold">+0.8%</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold tracking-tighter">$875.28</span>
            <div className="h-8 w-20 flex items-end">
              <div className="flex items-end space-x-0.5 h-full w-full">
                <div className="w-1 bg-primary-container/20 h-1/3"></div>
                <div className="w-1 bg-primary-container/40 h-1/2"></div>
                <div className="w-1 bg-primary-container/60 h-2/3"></div>
                <div className="w-1 bg-primary-container/80 h-3/4"></div>
                <div className="w-1 bg-primary-container h-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Area Chart & Watchlist */}
      <div className="grid grid-cols-10 gap-8">
        {/* Portfolio Area Chart (70%) */}
        <div className="col-span-7 glass-panel rounded-xl p-8 relative overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Portafoglio</h2>
              <p className="text-slate-400 text-sm">Panoramica asset complessiva</p>
            </div>
            <div className="flex space-x-2 bg-surface-container-lowest p-1 rounded-full border border-white/5">
              {['1G', '1S', '1M', '3M', '1A'].map(tf => (
                <button 
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${timeframe === tf ? 'bg-primary-container text-[#00390e]' : 'text-slate-400 hover:text-on-surface'}`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-[400px] w-full">
            {/* Simulated Area Chart */}
            <div className="absolute inset-0 flex items-end">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#0df259", stopOpacity: 0.2 }}></stop>
                    <stop offset="100%" style={{ stopColor: "#0df259", stopOpacity: 0 }}></stop>
                  </linearGradient>
                </defs>
                <path d="M0,350 Q100,340 200,360 T400,320 T600,300 T800,220 T1000,180 L1000,400 L0,400 Z" fill="url(#chartGradient)"></path>
                <path d="M0,350 Q100,340 200,360 T400,320 T600,300 T800,220 T1000,180" fill="none" stroke="#0df259" strokeWidth="3"></path>
              </svg>
            </div>

            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
              <div className="border-b border-white/5 w-full"></div>
              <div className="border-b border-white/5 w-full"></div>
              <div className="border-b border-white/5 w-full"></div>
              <div className="border-b border-white/5 w-full"></div>
            </div>

            {/* Data Cursor */}
            <div className="absolute left-[80%] top-[45%] flex flex-col items-center">
              <div className="w-[2px] h-[220px] bg-primary-container/30"></div>
              <div className="absolute -top-12 bg-primary-container text-[#00390e] px-3 py-1 rounded-lg font-bold shadow-lg text-sm">
                $124,592.40
              </div>
              <div className="w-3 h-3 rounded-full bg-primary-container border-2 border-white absolute top-[-6px]"></div>
            </div>
          </div>

          <div className="flex justify-between mt-6 px-2 text-slate-500 text-xs font-bold uppercase">
            <span>01 Gen</span>
            <span>08 Gen</span>
            <span>15 Gen</span>
            <span>22 Gen</span>
            <span>31 Gen</span>
          </div>
        </div>

        {/* Watchlist Quick View (30%) */}
        <div className="col-span-3 glass-panel rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold tracking-tight">La tua Watchlist</h2>
            <button 
              className="material-symbols-outlined text-slate-500 hover:text-on-surface"
              onClick={() => alert("Impostazioni Watchlist")}
            >
              more_vert
            </button>
          </div>

          <div className="space-y-5">
            {[
              { sym: 'TSLA', name: 'Tesla, Inc.', icon: 'TS', px: '$175.34', chg: '+0.42%', up: true },
              { sym: 'AMZN', name: 'Amazon.com', icon: 'AM', px: '$174.42', chg: '-1.20%', up: false },
              { sym: 'ETH', name: 'Ethereum', icon: 'ET', px: '$3,842.10', chg: '+4.81%', up: true },
              { sym: 'GOOGL', name: 'Alphabet Inc.', icon: 'GO', px: '$142.65', chg: '+0.15%', up: true },
              { sym: 'META', name: 'Meta Platforms', icon: 'ME', px: '$482.30', chg: '-0.88%', up: false },
            ].map(item => (
              <div key={item.sym} className="flex justify-between items-center group cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold group-hover:text-primary-container transition-colors">{item.sym}</h4>
                    <p className="text-[10px] text-slate-500">{item.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{item.px}</p>
                  <span className={`text-[10px] font-bold ${item.up ? 'text-primary-container' : 'text-tertiary-container'}`}>
                    {item.chg}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Link href="/watchlist" className="block text-center w-full mt-8 border border-white/10 rounded-xl py-3 text-sm font-bold text-slate-400 hover:bg-surface-container-high transition-colors">
            Visualizza Tutti
          </Link>
        </div>
      </div>

      {/* Bottom Row: Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Totale Investito */}
        <div className="glass-panel p-8 rounded-xl flex flex-col justify-between overflow-hidden relative group">
          <div className="flex items-center justify-between z-10">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Totale Investito</span>
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary-container">account_balance</span>
            </div>
          </div>
          <div className="mt-8 z-10">
            <h4 className="text-4xl font-extrabold tracking-tighter mb-2">$842,500.00</h4>
            <div className="flex items-center text-primary-container">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              <span className="text-xs font-bold">+12.5% dall'ultimo mese</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'opsz' 48" }}>account_balance</span>
          </div>
        </div>

        {/* Rendimento Oggi */}
        <div className="glass-panel p-8 rounded-xl flex flex-col justify-between overflow-hidden relative group">
          <div className="flex items-center justify-between z-10">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Rendimento Oggi</span>
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary-container">bolt</span>
            </div>
          </div>
          <div className="mt-8 z-10">
            <h4 className="text-4xl font-extrabold tracking-tighter mb-2">+$4,210.82</h4>
            <div className="flex items-center text-primary-container">
              <span className="material-symbols-outlined text-sm mr-1">arrow_upward</span>
              <span className="text-xs font-bold">+0.82% nelle ultime 24h</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'opsz' 48" }}>bolt</span>
          </div>
        </div>

        {/* Posizioni Aperte */}
        <div className="glass-panel p-8 rounded-xl flex flex-col justify-between overflow-hidden relative group">
          <div className="flex items-center justify-between z-10">
            <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Posizioni Aperte</span>
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary-container">layers</span>
            </div>
          </div>
          <div className="mt-8 z-10">
            <h4 className="text-4xl font-extrabold tracking-tighter mb-2">14</h4>
            <div className="flex items-center text-slate-400">
              <span className="material-symbols-outlined text-sm mr-1">info</span>
              <span className="text-xs font-bold">12 Long / 2 Short attive</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'opsz' 48" }}>layers</span>
          </div>
        </div>
      </div>
    </GPOPageShell>
  );
}