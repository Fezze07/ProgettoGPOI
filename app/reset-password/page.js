"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = searchParams.get('token') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password, confirmPassword }),
    });

    const body = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(body?.error || 'Errore durante il reset password.');
      return;
    }

    setMessage(body?.message || 'Password resettata con successo.');
    setTimeout(() => router.push('/login'), 1500);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6">
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-outline/10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">Reset password</h1>
        {error && <div className="mb-4 rounded-xl bg-error-container/20 p-4 text-sm text-error border border-error/30">{error}</div>}
        {message && <div className="mb-4 rounded-xl bg-surface-container-high p-4 text-sm text-primary-container border border-primary-container/20">{message}</div>}
        {!token ? (
          <p className="text-sm text-on-surface-variant">Token mancante. Controlla il link ricevuto via email.</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold">Nuova password</label>
            <input
              className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3"
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className="block text-sm font-semibold">Conferma password</label>
            <input
              className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3"
              type="password"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              className="w-full rounded-full bg-primary-container py-3 text-sm font-semibold text-[#00390e] hover:bg-primary-container/90"
              disabled={loading}
              type="submit"
            >
              {loading ? 'Salvataggio in corso...' : 'Aggiorna password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
