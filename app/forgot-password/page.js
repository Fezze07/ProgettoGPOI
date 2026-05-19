"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const body = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(body?.error || 'Errore durante la richiesta.');
      return;
    }

    setMessage(body?.message || 'Controlla la tua email per le istruzioni.');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6">
      <div className="w-full max-w-md p-8 glass-panel rounded-3xl border border-outline/10 shadow-2xl">
        <h1 className="text-3xl font-bold mb-4">Recupera password</h1>
        <p className="text-sm text-on-surface-variant mb-6">Inserisci la tua email per ricevere il link di reset.</p>
        {message && <div className="mb-4 rounded-xl bg-surface-container-high p-4 text-sm text-primary-container border border-primary-container/20">{message}</div>}
        {error && <div className="mb-4 rounded-xl bg-error-container/20 p-4 text-sm text-error border border-error/30">{error}</div>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">Email</label>
          <input
            className="w-full rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3"
            type="email"
            placeholder="nome@azienda.it"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            className="w-full rounded-full bg-primary-container py-3 text-sm font-semibold text-[#00390e] hover:bg-primary-container/90"
            disabled={loading}
            type="submit"
          >
            {loading ? 'Invio in corso...' : 'Invia link di reset'}
          </button>
        </form>
        <p className="mt-6 text-sm text-on-surface-variant">Hai già un account? <Link className="text-primary-container font-semibold" href="/login">Accedi</Link></p>
      </div>
    </div>
  )
}
