"use client";
import Link from "next/link";

export default function TopNavBar() {
  return (
    <header className="flex justify-between items-center h-16 px-8 border-b border-white/5 bg-[#0b0e12]/80 backdrop-blur-xl sticky top-0 z-40 font-manrope text-sm">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input
            className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-on-surface focus:ring-1 focus:ring-primary-container transition-all outline-none"
            placeholder="Cerca assets, mercati o indici..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="flex items-center px-3 py-1 bg-primary-container/10 rounded-full border border-primary-container/20">
          <span className="w-2 h-2 rounded-full bg-primary-container mr-2 animate-pulse"></span>
          <span className="text-primary-container font-bold text-xs">Mercato Aperto</span>
        </div>
        <div className="flex items-center space-x-4 border-l border-white/10 pl-6">
          <button className="text-slate-400 hover:text-[#0df259] transition-colors active:scale-95 hidden sm:block">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <Link href="/login" className="text-slate-300 font-bold text-xs hover:text-[#0df259] transition-colors pr-2">
            Accedi
          </Link>
          <Link href="/register" className="bg-[#0df259] hover:bg-[#6dff7e] text-[#00390e] px-4 py-1.5 rounded-full font-bold text-xs shadow-[0_4px_40px_rgba(13,242,89,0.2)] active:scale-95 transition-all min-w-max">
            Registrati
          </Link>
        </div>
      </div>
    </header>
  );
}
