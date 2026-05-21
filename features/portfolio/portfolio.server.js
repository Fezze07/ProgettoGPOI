import { supabaseServer } from '@/core/supabase/supabaseServer.server'
import { getCache, setCache } from '@/core/utils/cache.server'

/**
 * Recupera tutti i dati correlati al portfolio di un utente adattandosi
 * alla nuova struttura DB (wallets, transactions, crypto_assets, latest_crypto_prices).
 * Restituisce gli array `portfolios`, `holdings` e `transactions` attesi dal frontend.
 */
export async function getUserPortfolioData(userId) {
  try {
    const cacheKey = `portfolio:${userId}`
    const cached = getCache(cacheKey)
    if (cached) return cached

    const { data: wallets, error: walletsError } = await supabaseServer.from('wallets').select('*').eq('user_id', userId)
    if (walletsError) throw walletsError

    const portfolios = (wallets || []).map(w => ({ id: w.id, name: w.label || 'Wallet', chain: w.chain, address: w.address }))

    const walletIds = (wallets || []).map(w => w.id)

    let transactions = []
    if (walletIds.length > 0) {
      const { data: txs, error: txError } = await supabaseServer
        .from('transactions')
        .select('*')
        .in('wallet_id', walletIds)
        .order('blockchain_timestamp', { ascending: false })
        .limit(100)
      if (txError) throw txError
      transactions = txs || []
    }

    const assetIds = [...new Set((transactions || []).map(t => t.asset_id).filter(Boolean))]

    let cryptoAssets = []
    if (assetIds.length > 0) {
      const { data: assets, error: assetsError } = await supabaseServer.from('crypto_assets').select('*').in('id', assetIds)
      if (assetsError) throw assetsError
      cryptoAssets = assets || []
    }

    let prices = []
    if (assetIds.length > 0) {
      const { data: priceData, error: priceError } = await supabaseServer.from('latest_crypto_prices').select('*').in('asset_id', assetIds)
      if (priceError) {
        console.warn('latest_crypto_prices query failed', priceError)
      } else {
        prices = priceData || []
      }
    }

    const assetMap = {}
    cryptoAssets.forEach(a => { assetMap[a.id] = a })
    const priceMap = {}
    prices.forEach(p => { priceMap[p.asset_id] = p })

    // Aggrega holdings da tutte le transazioni (net quantity per asset)
    const holdingsMap = {}
    transactions.forEach(t => {
      const aid = t.asset_id
      if (!aid) return
      if (!holdingsMap[aid]) holdingsMap[aid] = { quantity: 0, costSum: 0, costQty: 0 }
      const amount = Number(t.amount) || 0
      holdingsMap[aid].quantity += amount
      const price = t.price_at_execution != null ? Number(t.price_at_execution) : null
      if (price !== null && amount > 0) {
        holdingsMap[aid].costSum += price * amount
        holdingsMap[aid].costQty += amount
      }
    })

    const holdings = Object.entries(holdingsMap).map(([aid, h]) => {
      const asset = assetMap[aid] || { id: aid, symbol: 'UNKNOWN' }
      const avgBuy = h.costQty > 0 ? h.costSum / h.costQty : 0
      const latest = priceMap[aid]
      const currentPrice = latest ? Number(latest.price) : (avgBuy || 0)
      return {
        id: asset.id,
        symbol: asset.symbol,
        quantity: h.quantity,
        avg_buy_price: avgBuy,
        current_price: currentPrice,
        exchange: 'Crypto',
      }
    })

    const txsMapped = (transactions || []).map(t => {
      const asset = assetMap[t.asset_id] || {}
      return {
        id: t.id,
        executed_at: t.blockchain_timestamp || t.created_at,
        symbol: asset.symbol || '',
        transaction_type: t.type,
        quantity: Number(t.amount) || 0,
        price: t.price_at_execution != null ? Number(t.price_at_execution) : null,
      }
    })

    const result = {
      portfolios,
      holdings,
      transactions: txsMapped,
    }

    try {
      setCache(cacheKey, result, 30) // cache portfolio per 30s
    } catch (e) {
      // ignore cache errors
    }

    return result
  } catch (error) {
    console.error('getUserPortfolioData error', error)
    throw new Error('Impossibile recuperare i dati del portfolio.')
  }
}
