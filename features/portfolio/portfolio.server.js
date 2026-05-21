import { supabaseServer } from '@/core/supabase/supabaseServer.server'

/**
 * Recupera tutti i dati correlati al portfolio di un utente (portfolios, holdings, transazioni recenti).
 * @param {string} userId - ID dell'utente autenticato.
 * @returns {Promise<{portfolios: Array, holdings: Array, transactions: Array}>}
 */
export async function getUserPortfolioData(userId) {
  const [{ data: portfolios, error: portfolioError }, { data: holdings, error: holdingsError }, { data: transactions, error: transactionsError }] = await Promise.all([
    supabaseServer.from('portfolios').select('*').eq('user_id', userId),
    supabaseServer.from('holdings').select('*').eq('user_id', userId),
    supabaseServer.from('transactions').select('*').eq('user_id', userId).order('executed_at', { ascending: false }).limit(20),
  ])

  if (portfolioError || holdingsError || transactionsError) {
    throw new Error('Impossibile recuperare i dati del portfolio.')
  }

  const holdingsList = holdings || [];
  
  if (holdingsList.length > 0) {
    const symbols = [...new Set(holdingsList.map(h => h.symbol))];
    const { data: prices } = await supabaseServer.from('latest_crypto_prices').select('*').in('symbol', symbols);
    
    if (prices) {
      const priceMap = {};
      prices.forEach(p => { priceMap[p.symbol] = p; });
      
      holdingsList.forEach(h => {
        if (priceMap[h.symbol]) {
          h.current_price = priceMap[h.symbol].price;
          h.percent_change_24h = priceMap[h.symbol].percent_change_24h;
        } else {
          h.current_price = h.avg_buy_price; // fallback
          h.percent_change_24h = 0;
        }
      });
    }
  }

  return {
    portfolios: portfolios || [],
    holdings: holdingsList,
    transactions: transactions || [],
  }
}
