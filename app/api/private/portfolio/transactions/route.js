import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/core/utils/authMiddleware.server'
import { supabaseServer } from '@/core/supabase/supabaseServer.server'
import { buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request)

    let body = {}
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }

    const { wallet_id, asset_id, symbol, type, amount, price, fee, tx_hash, blockchain_timestamp } = body

    if (!amount || Number.isNaN(Number(amount))) {
      throw new Error('Quantità non valida')
    }

    // resolve wallet
    let walletId = wallet_id
    if (!walletId) {
      const { data: firstWallet, error: fwErr } = await supabaseServer
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single()
      if (fwErr || !firstWallet) throw new Error('Nessun wallet trovato per l\'utente')
      walletId = firstWallet.id
    } else {
      const { data: w, error: wErr } = await supabaseServer.from('wallets').select('*').eq('id', walletId).single()
      if (wErr || !w) throw new Error('Wallet non trovato')
      if (w.user_id !== user.id) throw new Error('Non autorizzato per quel wallet')
    }

    // resolve or create asset
    let resolvedAssetId = asset_id || null
    if (!resolvedAssetId && symbol) {
      const sym = String(symbol).trim().toUpperCase()
      const { data: asset, error: assetErr } = await supabaseServer.from('crypto_assets').select('*').eq('symbol', sym).limit(1).maybeSingle()
      if (assetErr) throw assetErr
      if (asset && asset.id) {
        resolvedAssetId = asset.id
      } else {
        throw new Error(`Simbolo non valido o non supportato: ${sym}`)
      }
    }

    // normalize type
    let txType = String(type || 'trade').toLowerCase()
    if (txType === 'buy' || txType === 'sell') txType = 'trade'
    if (!['deposit', 'withdrawal', 'trade'].includes(txType)) txType = 'trade'

    if (txType === 'trade' && !resolvedAssetId) {
      throw new Error('Trade richiede un asset valido selezionato tra quelli esistenti')
    }

    const payload = {
      wallet_id: walletId,
      asset_id: resolvedAssetId,
      tx_hash: tx_hash || null,
      type: txType,
      amount: Number(amount),
      fee: fee != null ? Number(fee) : 0,
      price_at_execution: price != null ? Number(price) : null,
      status: 'confirmed',
      blockchain_timestamp: blockchain_timestamp || null,
    }

    const { data: created, error: insertError } = await supabaseServer.from('transactions').insert(payload).select().single()
    if (insertError) throw insertError

    return buildJsonResponse({ transaction: created }, 201)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
