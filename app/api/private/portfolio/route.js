import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '../../../../middlewares/authMiddleware'
import { supabaseServer } from '../../../../utils/supabaseServer'
import { buildJsonResponse } from '../../../../utils/response'
import { handleApiError } from '../../../../utils/errors'

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request)

    const [{ data: portfolios, error: portfolioError }, { data: holdings, error: holdingsError }, { data: transactions, error: transactionsError }] = await Promise.all([
      supabaseServer.from('portfolios').select('*').eq('user_id', user.id),
      supabaseServer.from('holdings').select('*').eq('user_id', user.id),
      supabaseServer.from('transactions').select('*').eq('user_id', user.id).order('executed_at', { ascending: false }).limit(20),
    ])

    if (portfolioError || holdingsError || transactionsError) {
      throw new Error('Impossibile recuperare i dati del portfolio.')
    }

    return buildJsonResponse({ portfolios: portfolios || [], holdings: holdings || [], transactions: transactions || [] }, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
