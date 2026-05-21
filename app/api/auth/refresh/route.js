import { NextResponse } from 'next/server'
import { getRefreshTokenFromRequest } from '@/features/auth/utils/cookies.server'
import { rotateRefreshToken } from '@/features/auth/auth.server'
import { setAuthCookies, buildJsonResponse } from '@/core/utils/response.server'
import { handleApiError } from '@/core/utils/errors.server'


export async function POST(request) {
  try {
    const refreshToken = await getRefreshTokenFromRequest(request)
    if (!refreshToken) {
      // If there's no refresh token, return 401 without throwing to avoid noisy server errors
      return NextResponse.json({ success: false, message: 'Refresh token mancante' }, { status: 401 })
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
