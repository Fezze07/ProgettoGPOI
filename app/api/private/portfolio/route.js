import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/core/utils/authMiddleware.server'
import { getUserPortfolioData } from '@/features/portfolio/portfolio.server'
import { buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'
import { supabaseServer } from '@/core/supabase/supabaseServer.server'

export async function GET(request) {
  try {
    const user = await getAuthenticatedUser(request)
    const data = await getUserPortfolioData(user.id)
    return buildJsonResponse(data, 200)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser(request)

    let body = {}
    try {
      body = await request.json()
    } catch (e) {
      body = {}
    }

    const { name, label, address, chain } = body
    const walletLabel = name || label || 'Wallet'
    const walletAddress = address || `local-${Date.now()}-${Math.random().toString(36).slice(2,8)}`

    const { data, error } = await supabaseServer
      .from('wallets')
      .insert({ user_id: user.id, label: walletLabel, address: walletAddress, chain: chain || null })
      .select()
      .single()

    if (error) throw error

    return buildJsonResponse({ wallet: data }, 201)
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
