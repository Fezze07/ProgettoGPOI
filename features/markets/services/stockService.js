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
    // PGRST205 => table not found in PostgREST schema cache
    if (error?.code === 'PGRST205') {
      console.warn('getInstruments: table `instruments` not found, returning empty list.')
      return []
    }
    throw error
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
      console.warn('getInstrumentBySymbol: table `instruments` not found.')
      return null
    }
    throw error
  }
  return data;
}

/**
 * Recupera i prezzi storici cacheati per un simbolo.
 */
export async function getPriceHistory(symbol) {
  const { data, error } = await supabase
    .from('price_cache')
    .select('*')
    .eq('symbol', symbol)
    .order('price_date', { ascending: true });

  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getPriceHistory: table `price_cache` not found.')
      return []
    }
    throw error
  }
  return data;
}

/**
 * Recupera la watchlist dell'utente corrente.
 */
export async function getWatchlist() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('watchlists')
    .select(`
      *,
      instruments:symbol (*)
    `)
    .eq('user_id', user.id);
  if (error) {
    if (error?.code === 'PGRST205') {
      console.warn('getWatchlist: table `watchlists` or `instruments` not found.')
      return []
    }
    throw error
  }
  return data;
}
