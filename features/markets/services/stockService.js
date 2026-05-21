import { supabase } from '@/core/supabase/supabase';

/**
 * Recupera l'elenco di tutti gli strumenti finanziari disponibili.
 */
export async function getInstruments() {
  // Use `crypto_assets` as canonical source for available instruments (primarily crypto)
  const { data, error } = await supabase
    .from('crypto_assets')
    .select('symbol, name, metadata')
    .order('symbol', { ascending: true });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getInstruments: table `crypto_assets` not found, returning empty list.');
      return [];
    }
    throw error;
  }

  return (data || []).map((row) => ({
    symbol: row.symbol,
    name: row.name || row.symbol,
    exchange: (row.metadata && row.metadata.exchange) || 'Crypto',
    sector: (row.metadata && row.metadata.sector) || 'Crypto',
  }));
}

/**
 * Recupera i dati di un singolo strumento tramite il suo simbolo.
 */
export async function getInstrumentBySymbol(symbol) {
  const { data, error } = await supabase
    .from('crypto_assets')
    .select('symbol, name, metadata')
    .eq('symbol', symbol)
    .maybeSingle();

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getInstrumentBySymbol: table `crypto_assets` not found.');
      return null;
    }
    throw error;
  }

  if (!data) return null;
  return {
    symbol: data.symbol,
    name: data.name || data.symbol,
    exchange: (data.metadata && data.metadata.exchange) || 'Crypto',
    sector: (data.metadata && data.metadata.sector) || 'Crypto',
  };
}

/**
 * Recupera i prezzi storici cacheati per un simbolo.
 */
export async function getPriceHistory(symbol) {
  if (!symbol) return [];

  const { data, error } = await supabase
    .from('crypto_price_history')
    .select('price, captured_at, provider')
    .eq('symbol', symbol)
    .order('captured_at', { ascending: true });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getPriceHistory: table `crypto_price_history` not found.');
      return [];
    }
    throw error;
  }

  return (data || []).map((r) => ({ price: r.price, price_date: r.captured_at, provider: r.provider }));
}

/**
 * Recupera l'ultima quotazione di un simbolo dal cache dei prezzi.
 */
export async function getLatestPriceForSymbol(symbol) {
  if (!symbol) return null;

  const { data, error } = await supabase
    .from('latest_crypto_prices')
    .select('price, captured_at, symbol')
    .eq('symbol', symbol)
    .maybeSingle();

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getLatestPriceForSymbol: view `latest_crypto_prices` not found.');
      return null;
    }
    throw error;
  }

  if (!data) return null;
  return { price: data.price, price_date: data.captured_at, symbol: data.symbol };
}

/**
 * Recupera l'ultima quotazione per una lista di simboli dal cache dei prezzi.
 */
export async function getLatestPrices(symbols = []) {
  if (!symbols || symbols.length === 0) return [];

  const { data, error } = await supabase
    .from('latest_crypto_prices')
    .select('price, captured_at, symbol')
    .in('symbol', symbols)
    .order('symbol', { ascending: true });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getLatestPrices: view `latest_crypto_prices` not found.');
      return [];
    }
    throw error;
  }

  const latestMap = {};
  (data || []).forEach((row) => {
    if (!latestMap[row.symbol]) {
      latestMap[row.symbol] = { price: row.price, price_date: row.captured_at, symbol: row.symbol };
    }
  });

  return Object.values(latestMap);
}

/**
 * Recupera la watchlist dell'utente corrente.
 */
export async function getWatchlist(userId = null) {
  let uid = userId
  if (!uid) {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) return []
      uid = data?.user?.id || null
    } catch (err) {
      return []
    }
  }

  if (!uid) return []

  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', uid)
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
