import { supabase } from '@/core/supabase/supabase';

/**
 * Recupera l'elenco di tutti gli strumenti finanziari disponibili.
 */
export async function getInstruments() {
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    .order('symbol', { ascending: true });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getInstruments: table `instruments` not found, returning empty list.');
      return [];
    }
    throw error;
  }

  return data;
}

/**
 * Recupera i dati di un singolo strumento tramite il suo simbolo.
 */
export async function getInstrumentBySymbol(symbol) {
  const { data, error } = await supabase
    .from('instruments')
    .select('*')
    .eq('symbol', symbol)
    .single();

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getInstrumentBySymbol: table `instruments` not found.');
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Recupera i prezzi storici cacheati per un simbolo.
 */
export async function getPriceHistory(symbol) {
  if (!symbol) return [];

  const { data, error } = await supabase
    .from('price_cache')
    .select('*')
    .eq('symbol', symbol)
    .order('price_date', { ascending: true });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getPriceHistory: table `price_cache` not found.');
      return [];
    }
    throw error;
  }
  return data;
}

/**
 * Recupera l'ultima quotazione di un simbolo dal cache dei prezzi.
 */
export async function getLatestPriceForSymbol(symbol) {
  if (!symbol) return null;

  const { data, error } = await supabase
    .from('price_cache')
    .select('*')
    .eq('symbol', symbol)
    .order('price_date', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getLatestPriceForSymbol: table `price_cache` not found.');
      return null;
    }
    throw error;
  }
  return data;
}

/**
 * Recupera l'ultima quotazione per una lista di simboli dal cache dei prezzi.
 */
export async function getLatestPrices(symbols = []) {
  if (!symbols || symbols.length === 0) return [];

  const { data, error } = await supabase
    .from('price_cache')
    .select('*')
    .in('symbol', symbols)
    .order('symbol', { ascending: true })
    .order('price_date', { ascending: false });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getLatestPrices: table `price_cache` not found.');
      return [];
    }
    throw error;
  }

  const latestMap = {};
  (data || []).forEach((row) => {
    if (!latestMap[row.symbol]) {
      latestMap[row.symbol] = row;
    }
  });

  return Object.values(latestMap);
}

/**
 * Recupera la watchlist dell'utente corrente.
 */
export async function getWatchlist() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getWatchlist: table `watchlists` not found.');
      return [];
    }
    throw error;
  }
  return data;
}
