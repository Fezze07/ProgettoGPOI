// Unica sorgente di verità per la configurazione del frontend.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Refresh automatico dati (ms)
export const POLLING_INTERVAL_MS = 120_000; // 2 minuti

// Simbolo di default usato se non specificato dall'utente
export const DEFAULT_SYMBOL = 'AAPL';

// Tipi di asset supportati
export const ASSET_TYPES = ['stock', 'etf', 'crypto', 'forex'];
