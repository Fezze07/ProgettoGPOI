# 🚀 Progetto GPO – Finance Dashboard

**Stack:** Next.js 16 · Supabase · Vercel · Recharts · Tailwind CSS

Un cruscotto finanziario per monitorare mercati, watchlist e portfolio.

---

## 🏗️ Struttura del repository (essenziale)

- `app/` – pagine Next.js (dashboard, watchlist, portfolio, api routes)
	- `app/api/` – API route (autenticazione, endpoint privati)
	- `app/portfolio/`, `app/watchlist/`, `app/markets/` – view client
- `core/` – componenti condivisi, client/server Supabase e utilità
	- `core/supabase/supabase.js` – client anonimo (browser)
	- `core/supabase/supabaseServer.server.js` – client service-role (server)
	- `core/utils/` – middleware, error handling, response helpers
- `features/` – feature-oriented code
	- `features/portfolio/portfolio.server.js` – aggregazione dati portfolio (server)
	- `features/markets/services/stockService.js` – query supabase per strumenti e prezzi
	- `features/markets/hooks/useStockData.js` – hook client per polling strumenti
- `supabase/` – file SQL e viste
	- `supabase/schema.sql` – schema DB principale (tabelle + view)
- `worker/` – job di raccolta prezzi e servizi di background
- `styles/` – fogli globali e variabili CSS
- `package.json`, `next.config.js`, `tailwind.config.js`, ecc.

---

## ⚙️ Setup locale

### Prerequisiti
- `Node.js` 20+ (consigliato)
- Account e progetto Supabase

### 1) Clona e installa
```bash
git clone https://github.com/Fezze07/ProgettoGPOI
cd ProgettoGPOI
npm install
```

### 2) Variabili d'ambiente
Copia il file `.env.example` se presente o crea un `.env.local` con almeno:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key> # usata dal server, NON esporre
```

> ⚠️ NON committare le chiavi nell'albero git.

### 3) Avvia in sviluppo
```bash
npm run dev
# → http://localhost:5003 (il progetto usa la porta 5003 in `package.json`)
```

---

## 🗄️ Schema database

Il file principale dello schema è [supabase/schema.sql](supabase/schema.sql).
Applicalo sul tuo database Supabase (SQL Editor) o tramite CLI/`psql`.

Tabelle e view principali create in `supabase/schema.sql`:

- `users` — profili locali
- `auth_refresh_tokens` — refresh token di sessione
- `wallets` — wallet/portafogli degli utenti
- `crypto_assets` — anagrafica asset crittografici
- `crypto_price_history` — storico prezzi raw
- `latest_crypto_prices` (VIEW) — ultimo prezzo per asset
- `transactions` — transazioni collegate ai wallet
- `instruments` — anagrafica titoli (azioni, ETF, crypto, forex)
- `price_cache` — cache prezzi storici per symbol
- `watchlists` — titoli salvati dagli utenti

Nota: lo script contiene istruzioni `DROP TABLE IF EXISTS` per pulire tabelle durante l'applicazione; usalo con cautela su DB di produzione.

---

## 🔧 Consigli per debug rapido

- Endpoint API autenticazione/server: `app/api/*` e `core/utils/authMiddleware.server.js`
- Portfolio server aggregation: [features/portfolio/portfolio.server.js](features/portfolio/portfolio.server.js)
- Query strumenti/watchlist: [features/markets/services/stockService.js](features/markets/services/stockService.js)
- Hook client per polling: [features/markets/hooks/useStockData.js](features/markets/hooks/useStockData.js)
- Supabase clients: [core/supabase/supabase.js](core/supabase/supabase.js) (browser) e [core/supabase/supabaseServer.server.js](core/supabase/supabaseServer.server.js) (server)

Se vedi errori tipo `PGRST205: Could not find the table 'public.instruments'`, significa che lo schema non è stato applicato sul database: applica `supabase/schema.sql` come indicato sopra.

---

## ☁️ Deploy (Vercel)

Imposta le env vars su Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo se necessario per funzioni server-side; nondiffondere pubblicamente)

Build command: `npm run build` — Output: `.next`

---
