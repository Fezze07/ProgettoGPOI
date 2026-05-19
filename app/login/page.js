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

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
  };

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

          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/10"></div>
            </div>
            <span className="relative px-4 bg-surface-container/45 text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-tighter">Oppure</span>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            type="button"
            className="w-full bg-surface-variant/40 hover:bg-surface-variant/60 text-on-surface py-4 rounded-full font-bold text-sm flex items-center justify-center gap-3 border border-outline-variant/10 transition-all duration-300">
            <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Accedi con Google
          </button>

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
