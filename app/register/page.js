"use client";
import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "../../utils/supabase";
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push("/portfolio");
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) setError(error.message);
  };

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
                      placeholder="m.rossi@obsidian.com" 
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

              <button 
                onClick={handleGoogleSignup}
                type="button"
                className="w-full bg-surface-container/50 hover:bg-surface-variant/40 text-on-surface border border-outline-variant/20 font-bold py-4 rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Iscriviti con Google
              </button>

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
