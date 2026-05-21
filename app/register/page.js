"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Le password non coincidono.");
      return;
    }
    setLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fullName, email, password, confirmPassword }),
    })

    setLoading(false)

    if (!response.ok) {
      const data = await response.json()
      setError(data?.error || "Errore durante la registrazione.")
      return
    }

    router.push("/portfolio")
  }

  return (
    <div className="text-on-surface min-h-screen flex flex-col relative font-manrope">
      {/* Hero Background Visual */}
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0b0e12]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container/10 blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-[#0df259]/10 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>
      </div>

      <main className="flex-grow flex items-center justify-center px-6 pt-24 pb-12 z-10 w-full">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Registration Glass Container */}
          <div className="glass-panel bg-surface-container/60 backdrop-blur-2xl border border-outline/15 rounded-xl p-8 shadow-[0_8px_32px_0_rgba(13,242,89,0.04)] relative overflow-hidden">

            {/* Inner Glow Ornament */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">Crea il tuo Account</h1>
              <p className="text-on-surface-variant text-sm font-medium mb-10 tracking-wide">Unisciti alla rivoluzione istituzionale</p>

              {error && <div className="mb-4 text-xs font-bold text-error bg-error-container/20 p-3 rounded-xl border border-error/50">{error}</div>}

              <form className="space-y-5" onSubmit={handleRegister}>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 ml-1">Nome Completo</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container/50 transition-all outline-none"
                      placeholder="Mario Rossi"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 ml-1">Email</label>
                  <div className="relative group">
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container/50 transition-all outline-none"
                      placeholder="m.rossi@gmail.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 ml-1">Password</label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container/50 transition-all outline-none"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/70 ml-1">Conferma Password</label>
                    <input
                      className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-4 py-3.5 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary-container/50 transition-all outline-none"
                      placeholder="••••••••"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  className="w-full bg-primary-container text-[#00390e] font-extrabold py-4 rounded-full mt-6 shadow-[0_0_20px_rgba(13,242,89,0.2)] hover:shadow-[0_0_30px_rgba(13,242,89,0.4)] active:scale-[0.98] transition-all duration-200 tracking-tight"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creazione in corso..." : "Registrati"}
                </button>
              </form>

              <div className="relative my-10 flex items-center">
                <div className="flex-grow border-t border-outline-variant/20"></div>
                <span className="flex-shrink mx-4 text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/50">Oppure</span>
                <div className="flex-grow border-t border-outline-variant/20"></div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-on-surface-variant font-medium">
                  Hai già un account? <Link className="text-[#0df259] font-bold hover:underline ml-1" href="/login">Accedi</Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center items-center gap-6 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {/* Security badges placeholder */}
            <div className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">lock</span> SSL Secured
            </div>
            <div className="text-[10px] font-bold text-on-surface-variant/50 uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px]">shield</span> Privacy First
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
