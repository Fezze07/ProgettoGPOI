import { NextResponse } from 'next/server'
import { getRefreshTokenFromRequest } from '@/features/auth/utils/cookies.server'
import { rotateRefreshToken } from '@/features/auth/auth.server'
import { setAuthCookies, buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'


export async function POST(request) {
  try {
    const refreshToken = getRefreshTokenFromRequest(request)
    if (!refreshToken) {
      throw new Error('Refresh token mancante')
    }
    const tokens = await rotateRefreshToken(refreshToken)
    let response = buildJsonResponse({ message: 'Sessione rinnovata.' }, 200)
    response = setAuthCookies(response, tokens)
    return response
  } catch (error) {
    const { status, body } = handleApiError(error)
    return NextResponse.json(body, { status })
  }
}
