# 🚀 Progetto GPO – Finance Dashboard

**Stack:** Next.js 16 · Supabase · Vercel · Recharts

Un'applicazione di monitoraggio finanziario serverless, deployata su [progettogpo.serverfede.eu](https://progettogpo.serverfede.eu).

---

## 🏗️ Architettura

```
ProgettoGPOI/
├── app/
│   ├── layout.js          # Root layout + metadata SEO
│   ├── page.js            # Dashboard principale (mercati)
│   ├── watchlist/         # Pagina watchlist utente
│   └── portfolio/         # Pagina portfolio e transazioni
├── components/
│   ├── Header/            # Navbar sticky
│   ├── StockCard/         # Card titolo azionario
│   ├── Chart/             # StockChart (Recharts)
│   └── WatchlistPanel/    # Widget watchlist per dashboard
├── hooks/
│   └── useStockData.js    # Polling dati da Supabase
├── services/
│   └── stockService.js    # Query Supabase (instruments, watchlist, history)
├── utils/
│   └── supabase.js        # Client Supabase (browser)
├── constants/
│   └── config.js          # Costanti globali (symbol default, interval polling)
└── styles/                # CSS Modules + token CSS globali
```

---

## ⚙️ Setup Locale

### Prerequisiti
- **Node.js 20+** (consigliato via `nvm`)
- Account **Supabase** (progetto già configurato)

### 1. Clona il repo
```bash
git clone https://github.com/Fezze07/ProgettoGPOI
cd ProgettoGPOI
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Configura le variabili d'ambiente
Crea il file `.env` root con:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ylfsbkptdighxtitinux.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<la tua chiave anon>
```

> ⚠️ **Non committare mai `.env` su GitHub.** Il file è già in `.gitignore`.

### 4. Avvia il dev server
```bash
npm run dev
# → http://localhost:3000
```

---

## 🗄️ Database (Supabase)

Schema PostgreSQL con le seguenti tabelle:

| Tabella | Descrizione |
|---|---|
| `profiles` | Profili utente (estende `auth.users`) |
| `instruments` | Anagrafica titoli (stock, ETF, crypto, forex) |
| `watchlists` | Titoli monitorati dagli utenti |
| `portfolios` | Portfolio degli utenti |
| `holdings` | Posizioni aperte per portfolio |
| `transactions` | Storico buy/sell/dividend |
| `price_cache` | Cache prezzi storici (per ridurre chiamate API) |

Tutte le tabelle hanno **Row Level Security (RLS)** abilitata.

## ☁️ Deploy (Vercel)

Il progetto è collegato a Vercel tramite la repo GitHub.

- **Root Directory:** lasciata vuota (il progetto ora è nella root del repository)
- **Build Command:** `npm run build`
- **Output:** `.next`
- **Env Vars su Vercel:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🤝 Contribuire

1. Crea sempre un branch personale: `git checkout -b feature/nome-modifica`
2. Fai le modifiche e testa in locale
3. `git push origin feature/nome-modifica`
4. Apri una Pull Request su GitHub

> ❌ **Non fare mai push diretto su `main`.**