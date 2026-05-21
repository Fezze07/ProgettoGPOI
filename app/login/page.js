"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })

    setLoading(false)

    if (!response.ok) {
      const data = await response.json()
      setError(data?.error || "Errore durante l'accesso.")
      return
    }

    router.push("/portfolio")
  }

  return (
    <div className="flex items-center justify-center min-h-screen relative selection:bg-primary-container selection:text-on-primary-container font-manrope">
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 dot-grid z-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#32353a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      <div className="fixed bg-[#0df259] w-[40vw] h-[40vw] top-[-10vw] left-[-10vw] blur-[120px] rounded-full z-0 opacity-15"></div>
      <div className="fixed bg-[#ffdad9] w-[35vw] h-[35vw] bottom-[-5vw] right-[-5vw] blur-[120px] rounded-full z-0 opacity-15"></div>

      <main className="z-10 w-full max-w-[440px] px-6">
        <div className="glass-panel bg-surface-container/45 backdrop-blur-[30px] border border-outline/15 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-[24px] p-8 md:p-12 relative overflow-hidden">

          <div className="flex flex-col items-center mb-10 text-center">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-surface-container-high border border-outline-variant/20 shadow-inner">
              <span className="material-symbols-outlined text-primary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <h1 className="text-on-surface font-extrabold text-3xl tracking-tight mb-2">Bentornato su GPOI</h1>
            <p className="text-on-surface-variant/60 font-semibold tracking-[0.15em] uppercase text-[11px]">Institutional Terminal</p>
          </div>

          {error && <div className="mb-4 text-xs font-bold text-error bg-error-container/20 p-3 rounded-xl border border-error/50">{error}</div>}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-on-surface-variant text-[11px] font-bold uppercase tracking-widest mb-2 ml-1" htmlFor="email">Email</label>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary-container/40 transition-all duration-300"
                id="email"
                placeholder="nome@azienda.it"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="block text-on-surface-variant text-[11px] font-bold uppercase tracking-widest" htmlFor="password">Password</label>
                <Link className="text-[11px] font-bold text-primary-container hover:text-primary-fixed-dim transition-colors duration-200" href="#">Password dimenticata?</Link>
              </div>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-xl px-5 py-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary-container/40 transition-all duration-300"
                id="password"
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="w-full bg-primary-container text-[#00390e] py-4 rounded-full font-extrabold text-sm uppercase tracking-widest shadow-[0_10px_20px_-5px_rgba(13,242,89,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(13,242,89,0.4)] active:scale-[0.98] transition-all duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? ("Accesso in corso...") : ("Accedi")}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-on-surface-variant/50 text-[13px] font-medium">
              Non hai un account? <Link className="text-primary-container font-bold hover:underline underline-offset-4 decoration-primary-container/30 transition-all" href="/register">Registrati</Link>
            </p>
          </div>

          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="mt-8 flex items-center justify-between px-2 text-[10px] font-bold text-on-surface-variant/20 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container/40 animate-pulse"></span>
            Terminal Active
          </div>
          <span>v2.4.0 Obsidian</span>
        </div>
      </main>

      <div className="fixed bottom-12 left-12 flex flex-col gap-1 opacity-10 select-none pointer-events-none">
        <div className="h-[1px] w-24 bg-on-surface"></div>
        <div className="h-[1px] w-16 bg-on-surface"></div>
        <div className="h-[1px] w-32 bg-on-surface"></div>
      </div>
    </div>
  );
}
