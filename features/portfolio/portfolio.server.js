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

  return {
    portfolios: portfolios || [],
    holdings: holdings || [],
    transactions: transactions || [],
  }
}
