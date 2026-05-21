import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/core/utils/authMiddleware.server'
import { supabaseServer } from '@/core/supabase/supabaseServer.server'
import { fetchTicker } from '@/core/services/alphaVantage.server'
import { handleApiError, ApiError } from '@/core/utils/errors.server'

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

async function ensureAsset(symbol) {
  const s = symbol.toUpperCase()
  const { data, error } = await supabaseServer.from('crypto_assets').select('id').eq('symbol', s).limit(1).maybeSingle()
  if (error) throw error
  if (data && data.id) return data.id
  const { data: insData, error: insErr } = await supabaseServer
    .from('crypto_assets')
    .insert({ symbol: s, name: s, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .select('id')
    .single()
  if (insErr) throw insErr
  return insData.id
}

export async function POST(request) {
  try {
    const query = new URL(request.url).searchParams
    const querySymbols = query.get('symbols')
    const body = await request.json().catch(() => null)

    let symbols = []
    if (body && Array.isArray(body.symbols) && body.symbols.length) symbols = body.symbols
    else if (querySymbols) symbols = querySymbols.split(',')
    else symbols = (process.env.COLLECT_SYMBOLS || 'BTC,ETH,BNB').split(',')

    symbols = symbols.map((s) => String(s).trim().toUpperCase()).filter(Boolean)

    // Authorization: allow admin user OR a collector API key header
    let authorized = false
    try {
      const user = await getAuthenticatedUser(request)
      if (user && user.role === 'admin') authorized = true
    } catch (e) {
      // not authenticated
    }

    if (!authorized) {
      const key = request.headers.get('x-collector-key') || request.headers.get('x-api-key')
      if (!key || key !== process.env.COLLECTOR_API_KEY) {
        throw new ApiError(401, 'Non autorizzato')
      }
    }

    const MAX_REQUESTS_PER_MINUTE = Math.max(1, parseInt(process.env.MAX_REQUESTS_PER_MINUTE || '5', 10))
    const REQUEST_DELAY_MS = Math.ceil(60000 / MAX_REQUESTS_PER_MINUTE)

    const results = []
    for (let i = 0; i < symbols.length; i++) {
      const s = symbols[i]
      try {
        const payload = await fetchTicker(s)
        const assetId = await ensureAsset(s)

        const row = {
          asset_id: assetId,
          provider: payload.provider,
          symbol: payload.symbol,
          price: payload.price,
          market_cap: payload.market_cap,
          volume_24h: payload.volume_24h,
          percent_change_24h: payload.percent_change_24h,
          captured_at: payload.captured_at,
        }

        const { error } = await supabaseServer.from('crypto_price_history').insert(row)
        if (error) {
          console.error('Supabase insert error for', s, error)
          results.push({ symbol: s, ok: false, error: error.message || error })
        } else {
          results.push({ symbol: s, ok: true })
        }
      } catch (err) {
        console.error('Collector error for', s, err)
        results.push({ symbol: s, ok: false, error: err?.message || String(err) })
      }

      if (i < symbols.length - 1) await sleep(REQUEST_DELAY_MS)
    }

    return NextResponse.json({ success: true, results }, { status: 200 })
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
