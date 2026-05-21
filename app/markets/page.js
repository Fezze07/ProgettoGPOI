"use client";
import GPOPageShell from "@/core/components/GPOPageShell";


export default function MarketsPage() {
  return (
    <GPOPageShell>
      <section className="mb-10">
        <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Mercati Globali 🌍</h2>
        <p className="text-on-surface-variant font-medium">Panoramica sui principali indici e asset class.</p>
      </section>

      <div className="glass-panel p-10 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center gap-4">
        <span className="material-symbols-outlined text-5xl text-primary-container">monitoring</span>
        <h3 className="text-2xl font-bold">In Arrivo</h3>
        <p className="text-slate-400">La sezione mercati è in fase di sviluppo e includerà dati su indici globali, forex e materie prime.</p>
      </div>
    </GPOPageShell>
  );
}
