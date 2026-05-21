"use client";
import React from "react";
import Image from "next/image";

export default function PricingPage() {
  return (
    <div className="bg-surface-container-lowest text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary font-manrope">
      
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b0e12] dark:bg-[#0b0e12] shadow-[0_4px_30px_rgba(13,242,89,0.04)]">
        <div className="flex justify-between items-center px-8 py-4 w-full backdrop-blur-xl bg-opacity-80 bg-gradient-to-b from-[#1d2024] to-transparent">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0df259]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            <span className="text-xl font-extrabold tracking-tighter text-[#0df259] uppercase">Progetto GPOI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#0df259] transition-transform active:scale-95 cursor-pointer">account_circle</span>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-20 px-6 relative overflow-hidden" 
            style={{ backgroundImage: "radial-gradient(circle at 50% -20%, rgba(13, 242, 89, 0.15) 0%, rgba(11, 14, 18, 1) 70%)" }}>
        
        {/* Background Dot Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: "radial-gradient(#0df259 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }}></div>
        
        {/* Header Section */}
        <header className="text-center mb-12 relative z-10">
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-primary-container/20 bg-primary-container/5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-container">Accesso Premium</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-4">Scegli il tuo piano</h1>
          <p className="text-on-surface-variant font-medium text-sm max-w-[280px] mx-auto leading-relaxed">Sblocca il pieno potenziale del trading con la nostra tecnologia istituzionale.</p>
        </header>

        {/* Pricing Tiers - ora disposti orizzontalmente */}
        <div className="flex flex-row flex-wrap gap-6 max-w-7xl mx-auto relative z-10 overflow-x-hidden px-4 py-2 justify-center">
          {/* Base */}
          <div className="flex-shrink-0 w-[300px] p-6 rounded-xl bg-surface-container border border-outline/10 hover:border-outline/30 transition-all duration-300 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Base</h3>
                  <p className="text-2xl font-extrabold">Gratuito</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold tracking-tight">$0</span>
                  <span className="text-xs font-medium text-on-surface-variant">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">check_circle</span>
                  Accesso alla watchlist di base
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">check_circle</span>
                  Prezzi di chiusura giornalieri (EOD)
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">check_circle</span>
                  Notifiche via email (limitate)
                </li>
              </ul>
            </div>
            <button className="mt-4 w-full py-3 px-6 rounded-full border border-outline text-on-surface font-bold text-sm tracking-wide active:scale-[0.98] transition-transform">
              Attiva Base
            </button>
          </div>

          {/* Pro */}
          <div className="flex-shrink-0 w-[360px] p-6 rounded-xl bg-surface-container-high border-2 border-primary-container shadow-[0_0_40px_rgba(13,242,89,0.08)] relative overflow-hidden flex flex-col justify-between min-h-[440px]">
            <div className="absolute top-0 right-0">
              <div className="bg-primary-container text-[#00390e] font-bold text-[10px] uppercase tracking-tighter px-4 py-1 rounded-bl-xl">Consigliato</div>
            </div>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary-container mb-1">Pro</h3>
                  <p className="text-2xl font-extrabold text-on-surface">Pro</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold tracking-tight text-on-surface">$29</span>
                  <span className="text-xs font-medium text-on-surface-variant">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-on-surface">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container">bolt</span>
                  Dati in tempo reale a bassa latenza
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container">show_chart</span>
                  Grafici avanzati con indicatori personalizzabili
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container">support_agent</span>
                  Alert e strategie personalizzate (webhook & notifiche)
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container">history</span>
                  Storico intraday fino a 6 mesi e download CSV
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary-container">file_download</span>
                  Esportazione dati e integrazione API per backtesting
                </li>
              </ul>
            </div>
            <button className="mt-4 w-full py-4 px-6 rounded-full bg-primary-container text-[#00390e] font-extrabold text-sm tracking-wide shadow-[0_4px_20px_rgba(13,242,89,0.3)] active:scale-[0.98] transition-transform">
              Attiva Pro
            </button>
          </div>

          {/* Professionale */}
          <div className="flex-shrink-0 w-[320px] p-6 rounded-xl bg-surface-container border border-outline/10 flex flex-col justify-between min-h-[440px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Professionale</h3>
                  <p className="text-2xl font-extrabold">Per team e aziende</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold tracking-tight">$100</span>
                  <span className="text-xs font-medium text-on-surface-variant">/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8 text-sm text-on-surface-variant">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">api</span>
                  Accesso API illimitato con chiavi dedicate
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">person_celebrate</span>
                  Account manager dedicato e onboarding personalizzato
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">timeline</span>
                  Feed dati a bassa latenza con SLA dedicato
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">group</span>
                  Accessi multi-utente e controllo ruoli
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined">settings</span>
                  Integrazione su misura (SFTP, Webhook, SSO)
                </li>
              </ul>
            </div>
            <button className="mt-4 w-full py-3 px-6 rounded-full border border-outline/20 text-on-surface bg-surface-variant/20 backdrop-blur-xl font-bold text-sm tracking-wide active:scale-[0.98] transition-transform">
              Richiedi una demo
            </button>
          </div>
        </div>

        {/* Featured Section Image */}
        <div className="mt-16 rounded-xl overflow-hidden relative h-48 border border-outline/10 max-w-md mx-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            alt="Cinematic shot of trading screens" 
            className="w-full h-full object-cover grayscale opacity-50 contrast-125" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuACCwUqLMWus_0cyGNnmg_zSe4RnqP4-iROGWwMeWFnBSKjiNV9XalitbOH5sb8zq2GyfAFelZ-tIUakdO4kNL2s0Dsu0WSRrAVW7iNpU2LJgkBxM6As5anvWiWJZJ1AfUiMktm5qCKaHGzFl7nm5z6YuQfNfKL1pqcpZcQozPwk6buAciySIXwLG3gtURpOoq_q_jjnkh9O9h5X27DwdNjhRR-0MeXLWE1xknnpwTnLLtE_zPHLiN_goKIlm9B1o3RZrD04uFtvUM9" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-container mb-1">Global Connectivity</p>
            <p className="text-sm font-semibold text-on-surface">Data infrastructure built for speed.</p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#0df259]/10 bg-[#0b0e12] dark:bg-[#0b0e12]">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full max-w-5xl mx-auto">
          <div className="text-lg font-bold text-[#e1e2e8] mb-6 md:mb-0">AFSF Management</div>
          <div className="flex flex-wrap justify-center gap-6 mb-8 md:mb-0">
            <a className="font-manrope text-[10px] font-bold uppercase tracking-widest text-[#e1e2e8]/40 hover:text-[#0df259] hover:underline transition-all duration-200" href="#">Terms of Service</a>
            <a className="font-manrope text-[10px] font-bold uppercase tracking-widest text-[#e1e2e8]/40 hover:text-[#0df259] hover:underline transition-all duration-200" href="#">Privacy Policy</a>
            <a className="font-manrope text-[10px] font-bold uppercase tracking-widest text-[#e1e2e8]/40 hover:text-[#0df259] hover:underline transition-all duration-200" href="#">Risk Disclosure</a>
            <a className="font-manrope text-[10px] font-bold uppercase tracking-widest text-[#e1e2e8]/40 hover:text-[#0df259] hover:underline transition-all duration-200" href="#">Regulatory Status</a>
          </div>
          <div className="font-manrope text-[10px] font-bold uppercase tracking-widest text-[#e1e2e8]/40 text-center">
             © 2026 AFSF Management SRL. All rights reserved.
          </div>
        </div>
      </footer>
      
    </div>
  );
}
